import React from 'react';
import { Theme, VoiceOption, VOICES } from '../types';

interface SettingsViewProps {
  theme: Theme;
  setTheme: (t: Theme) => void;
  voice: VoiceOption;
  setVoice: (v: VoiceOption) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ theme, setTheme, voice, setVoice }) => {
  const isDark = theme === 'dark';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-zinc-400' : 'text-gray-500';
  const cardBg = isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200';

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      <div className="text-center mb-8">
        <h2 className={`text-2xl font-bold ${textPrimary}`}>Settings</h2>
        <p className={textSecondary}>Customize your learning experience</p>
      </div>

      {/* Theme Section */}
      <section>
        <h3 className={`text-sm font-semibold uppercase tracking-wider mb-3 ${textSecondary}`}>App Appearance</h3>
        <div className={`p-1 rounded-xl flex ${isDark ? 'bg-zinc-900 border border-zinc-800' : 'bg-gray-100 border border-gray-200'}`}>
          <button
            onClick={() => setTheme('light')}
            className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all ${theme === 'light' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            <span className="font-medium">Light Mode</span>
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all ${theme === 'dark' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            <span className="font-medium">Dark Mode</span>
          </button>
        </div>
      </section>

      {/* Voice Section */}
      <section>
        <h3 className={`text-sm font-semibold uppercase tracking-wider mb-3 ${textSecondary}`}>AI Tutor Voice</h3>
        <div className="space-y-3">
          {(Object.keys(VOICES) as VoiceOption[]).map((v) => {
             const isSelected = voice === v;
             return (
               <div 
                 key={v}
                 onClick={() => setVoice(v)}
                 className={`cursor-pointer p-4 rounded-xl border flex items-center justify-between transition-all ${isSelected ? 'border-purple-500 bg-purple-500/10' : cardBg + ' hover:border-purple-500/30'}`}
               >
                 <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isSelected ? 'bg-purple-500 text-white' : (isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-gray-100 text-gray-500')}`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                    </div>
                    <div>
                        <div className={`font-semibold ${textPrimary}`}>{VOICES[v].label}</div>
                        <div className={`text-xs ${textSecondary}`}>{VOICES[v].desc}</div>
                    </div>
                 </div>
                 
                 <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-purple-500' : (isDark ? 'border-zinc-700' : 'border-gray-300')}`}>
                    {isSelected && <div className="w-3 h-3 rounded-full bg-purple-500"></div>}
                 </div>
               </div>
             )
          })}
        </div>
      </section>

      <div className={`mt-8 p-4 rounded-lg text-sm ${isDark ? 'bg-blue-900/20 text-blue-200' : 'bg-blue-50 text-blue-800'}`}>
        <p>Tip: The selected voice will be used for both the Automatic Daily Briefing and the interactive Live Tutor.</p>
      </div>

      <div className={`mt-12 text-center text-xs ${isDark ? 'text-zinc-600' : 'text-gray-400'}`}>
        <a 
            href="https://www.instagram.com/cinemareagleyfg/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="opacity-50 hover:opacity-100 hover:text-purple-500 transition-all cursor-pointer"
        >
            @CinemaReagleYFG
        </a>
      </div>
    </div>
  );
};

export default SettingsView;