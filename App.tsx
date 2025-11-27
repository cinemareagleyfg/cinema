import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { LESSON_PLAN } from './constants';
import DayCard from './components/DayCard';
import LiveAssistant from './components/LiveAssistant';
import SettingsView from './components/SettingsView';
import FlashCardView from './components/FlashCardView';
import { base64ToUint8Array, decodeAudioData } from './utils/audioUtils';
import { Theme, VoiceOption } from './types';

const App: React.FC = () => {
  // --- Persistent State ---
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('mixmaster_progress');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('mixmaster_theme') as Theme) || 'dark';
  });

  const [voice, setVoice] = useState<VoiceOption>(() => {
    return (localStorage.getItem('mixmaster_voice') as VoiceOption) || 'Puck';
  });

  // --- UI State ---
  const [currentView, setCurrentView] = useState<'home' | 'flashcards' | 'settings'>('home');
  const [expandedDay, setExpandedDay] = useState<number>(1);
  const [isLiveOpen, setIsLiveOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'week1' | 'week2'>('week1');

  // --- Dictation State ---
  const [isDictating, setIsDictating] = useState(false);
  const [dictationLoading, setDictationLoading] = useState(false);
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const hasBriefingRun = useRef(false);

  // --- Effects ---
  useEffect(() => {
    localStorage.setItem('mixmaster_progress', JSON.stringify(Array.from(completedTasks)));
  }, [completedTasks]);

  useEffect(() => {
    localStorage.setItem('mixmaster_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('mixmaster_voice', voice);
  }, [voice]);

  // Reset audio buffer if voice changes so we regenerate with new voice
  useEffect(() => {
    audioBufferRef.current = null;
  }, [voice]);

  // --- Handlers ---
  const stopDictation = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    if (audioSourceRef.current) {
      audioSourceRef.current.stop();
      audioSourceRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    setIsDictating(false);
    setDictationLoading(false);
  };

  const startDailyBriefing = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    // Prevent multiple starts
    if (dictationLoading || isDictating) return;

    const allDays = [...LESSON_PLAN.week1, ...LESSON_PLAN.week2];
    let targetDay = allDays.find(d => d.day === expandedDay);
    if (!targetDay || targetDay.tasks.every(t => completedTasks.has(t.id))) {
         targetDay = allDays.find(d => d.tasks.some(t => !completedTasks.has(t.id))) || allDays[0];
    }
    
    setExpandedDay(targetDay.day);
    setActiveTab(targetDay.day > 7 ? 'week2' : 'week1');
    
    setIsDictating(true);
    setDictationLoading(true);

    try {
      let buffer = audioBufferRef.current;
      
      if (!buffer) {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const taskList = targetDay.tasks.map((t, i) => `Step ${i + 1}: ${t.text}`).join('. ');
        const prompt = `
          Speak the following lesson plan clearly and professionally.
          "Welcome back to Mix Master. Today is Day ${targetDay.day}. The topic is ${targetDay.title}.
          ${targetDay.description}
          Here are your tasks for today.
          ${taskList}
          Tap the screen when you are ready to start mixing."
        `;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-preview-tts',
          contents: { parts: [{ text: prompt }] },
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } }
            }
          }
        });

        const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!audioData) throw new Error("No audio generated");

        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        audioCtxRef.current = ctx;

        buffer = await decodeAudioData(
            base64ToUint8Array(audioData),
            ctx,
            24000,
            1
        );
        audioBufferRef.current = buffer;
      } else {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
      }

      if (audioCtxRef.current && buffer) {
        const source = audioCtxRef.current.createBufferSource();
        source.buffer = buffer;
        source.connect(audioCtxRef.current.destination);
        audioSourceRef.current = source;
        
        source.onended = () => {
          stopDictation();
        };

        source.start();
      }
      
      setDictationLoading(false);

    } catch (error) {
      console.error("Dictation failed:", error);
      stopDictation();
    }
  };

  // Automatic Dictation on Startup (Only on first load)
  useEffect(() => {
    if (hasBriefingRun.current) return;
    hasBriefingRun.current = true;
    // Small delay to ensure interaction or simply start
    setTimeout(() => startDailyBriefing(), 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleTask = (id: string) => {
    const newSet = new Set(completedTasks);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setCompletedTasks(newSet);
  };

  const calculateTotalProgress = () => {
    const allTasks = [...LESSON_PLAN.week1, ...LESSON_PLAN.week2].flatMap(d => d.tasks);
    const total = allTasks.length;
    const completed = allTasks.filter(t => completedTasks.has(t.id)).length;
    return Math.round((completed / total) * 100);
  };

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen pb-24 relative transition-colors duration-300 ${isDark ? 'bg-zinc-950 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      
      {/* Auto-Dictation Overlay */}
      {isDictating && (
        <div 
          onClick={(e) => stopDictation(e)}
          className="fixed inset-0 z-[60] flex flex-col items-center justify-end pb-32 bg-black/60 backdrop-blur-[2px] cursor-pointer animate-fadeIn"
        >
          <div className="bg-zinc-900/90 border border-purple-500/30 px-6 py-4 rounded-full shadow-2xl flex items-center gap-4 hover:scale-105 transition-transform">
             {dictationLoading ? (
               <div className="animate-spin h-5 w-5 border-2 border-purple-500 rounded-full border-t-transparent"></div>
             ) : (
                <div className="flex gap-1 h-5 items-center">
                    <div className="w-1.5 bg-purple-500 rounded-full h-full animate-[bounce_1s_infinite]"></div>
                    <div className="w-1.5 bg-purple-500 rounded-full h-2/3 animate-[bounce_1.2s_infinite]"></div>
                    <div className="w-1.5 bg-purple-500 rounded-full h-full animate-[bounce_0.8s_infinite]"></div>
                </div>
             )}
             <div className="flex flex-col">
                <span className="text-purple-100 font-medium text-sm">
                  {dictationLoading ? "Preparing Daily Briefing..." : "Reading Today's Plan..."}
                </span>
             </div>
             <div className="h-6 w-px bg-zinc-700 mx-2"></div>
             <span className="text-xs text-zinc-400 uppercase tracking-widest font-semibold">Tap to Skip</span>
          </div>
        </div>
      )}

      {/* Top Header */}
      <header className={`sticky top-0 z-30 backdrop-blur-md border-b transition-colors ${isDark ? 'bg-zinc-950/80 border-zinc-800' : 'bg-white/80 border-gray-200'}`}>
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-2">
             <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-900/20">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
                </div>
                <h1 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>MixMaster</h1>
             </div>
             <div className="text-xs font-mono text-zinc-500">
                PRO TOOLS INTRO
             </div>
          </div>
          
          {/* Global Progress */}
          <div className={`w-full h-1.5 rounded-full overflow-hidden mt-3 ${isDark ? 'bg-zinc-800' : 'bg-gray-200'}`}>
            <div 
                className="bg-gradient-to-r from-purple-600 to-blue-500 h-full transition-all duration-700 ease-out" 
                style={{ width: `${calculateTotalProgress()}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-zinc-500 mt-1 uppercase tracking-wider font-semibold">
             <span>Course Progress</span>
             <span>{calculateTotalProgress()}% Ready</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-3xl mx-auto px-4 py-6">
        
        {currentView === 'home' && (
          <>
            {/* Week Tabs */}
            <div className={`flex gap-2 mb-6 p-1 rounded-xl border transition-colors ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200 shadow-sm'}`}>
                <button 
                    onClick={() => setActiveTab('week1')}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'week1' ? (isDark ? 'bg-zinc-800 text-white' : 'bg-gray-100 text-gray-900') : 'text-zinc-500 hover:text-zinc-400'}`}
                >
                    Week 1: Fundamentals
                </button>
                <button 
                    onClick={() => setActiveTab('week2')}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'week2' ? (isDark ? 'bg-zinc-800 text-white' : 'bg-gray-100 text-gray-900') : 'text-zinc-500 hover:text-zinc-400'}`}
                >
                    Week 2: Mastery
                </button>
            </div>

            {/* Days List */}
            <div className="space-y-2">
                {LESSON_PLAN[activeTab].map((dayPlan) => (
                    <DayCard 
                        key={dayPlan.day}
                        dayPlan={dayPlan}
                        completedTasks={completedTasks}
                        toggleTask={toggleTask}
                        isExpanded={expandedDay === dayPlan.day}
                        onToggleExpand={() => setExpandedDay(expandedDay === dayPlan.day ? -1 : dayPlan.day)}
                        theme={theme}
                    />
                ))}
            </div>

            {/* Footer Info */}
            <div className={`mt-12 text-center text-sm ${isDark ? 'text-zinc-600' : 'text-gray-400'}`}>
                <p>Using Stock Plugins Only</p>
                <p className="text-xs mt-1 opacity-50">EQ III • Dynamics III • D-Verb • Mod Delay III</p>
                <a 
                    href="https://www.instagram.com/cinemareagleyfg/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block text-xs mt-1 opacity-50 hover:opacity-100 hover:text-purple-500 transition-all cursor-pointer"
                >
                    @CinemaReagleYFG
                </a>
            </div>
          </>
        )}

        {currentView === 'flashcards' && (
          <FlashCardView theme={theme} />
        )}

        {currentView === 'settings' && (
          <SettingsView 
            theme={theme} 
            setTheme={setTheme} 
            voice={voice} 
            setVoice={setVoice} 
          />
        )}
      </main>

      {/* Persistent Bottom Navigation Bar */}
      <div className={`fixed bottom-0 left-0 right-0 z-40 border-t ${isDark ? 'bg-zinc-950/90 border-zinc-800' : 'bg-white/90 border-gray-200'} backdrop-blur-lg safe-area-bottom`}>
        <div className="max-w-md mx-auto flex justify-between items-center h-16 px-6">
           {/* Lessons Tab */}
           <button 
             onClick={() => setCurrentView('home')}
             className={`flex flex-col items-center justify-center w-16 h-full space-y-1 ${currentView === 'home' ? 'text-purple-500' : 'text-zinc-500'}`}
           >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              <span className="text-[10px] font-medium">Lessons</span>
           </button>

           {/* Flashcards Tab */}
           <button 
             onClick={() => setCurrentView('flashcards')}
             className={`flex flex-col items-center justify-center w-16 h-full space-y-1 ${currentView === 'flashcards' ? 'text-purple-500' : 'text-zinc-500'}`}
           >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              <span className="text-[10px] font-medium">Cards</span>
           </button>
           
           {/* Settings Tab */}
           <button 
             onClick={() => setCurrentView('settings')}
             className={`flex flex-col items-center justify-center w-16 h-full space-y-1 ${currentView === 'settings' ? 'text-purple-500' : 'text-zinc-500'}`}
           >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <span className="text-[10px] font-medium">Settings</span>
           </button>
        </div>
      </div>

      {/* Floating Action Buttons */}
      
      {/* Left Control (Dictation Play/Pause) */}
      <div className="fixed bottom-24 left-4 z-50 pointer-events-none">
          <div className="pointer-events-auto">
             {currentView === 'home' && (
                <button
                    onClick={isDictating ? stopDictation : startDailyBriefing}
                    className={`group relative flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all transform hover:scale-105 border ${isDictating ? (isDark ? 'bg-zinc-800 text-red-400 border-zinc-700' : 'bg-white text-red-500 border-gray-200') : (isDark ? 'bg-zinc-900 text-white border-zinc-700 hover:bg-zinc-800' : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50')}`}
                >
                    {isDictating ? (
                        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                    ) : (
                        <svg className="w-8 h-8 fill-current ml-1" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    )}
                </button>
             )}
          </div>
      </div>

      {/* Right Control (Live AI) */}
      <div className="fixed bottom-24 right-4 z-50 pointer-events-none">
           <div className="pointer-events-auto">
              <button 
                  onClick={() => { stopDictation(); setIsLiveOpen(true); }}
                  className="group relative flex items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full shadow-[0_4px_20px_rgba(124,58,237,0.4)] hover:shadow-[0_4px_25px_rgba(124,58,237,0.6)] transition-all transform hover:scale-105"
              >
                  <div className="absolute inset-0 rounded-full border border-white/20"></div>
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
              </button>
           </div>
      </div>

      {/* Live Assistant Overlay */}
      <LiveAssistant 
        isOpen={isLiveOpen} 
        onClose={() => setIsLiveOpen(false)} 
        voice={voice}
        theme={theme}
      />
    </div>
  );
};

export default App;