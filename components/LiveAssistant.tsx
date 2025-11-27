import React, { useEffect, useRef, useState, useMemo } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { createPcmBlob, decodeAudioData, base64ToUint8Array } from '../utils/audioUtils';
import { Theme, VoiceOption } from '../types';

interface LiveAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  voice: VoiceOption;
  theme: Theme;
}

const LiveAssistant: React.FC<LiveAssistantProps> = ({ isOpen, onClose, voice, theme }) => {
  const [status, setStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [volume, setVolume] = useState<number>(0);
  
  const isDark = theme === 'dark';

  // Audio Contexts
  const inputContextRef = useRef<AudioContext | null>(null);
  const outputContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  // Audio Playback Queue
  const nextStartTimeRef = useRef<number>(0);
  const scheduledSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // Connection Management
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const mountedRef = useRef(true);

  // Initialize API
  const ai = useMemo(() => new GoogleGenAI({ apiKey: process.env.API_KEY }), []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-connect if voice changes while connected, but for simplicity we just require reconnect manually or on next open
  // Just ensuring we disconnect if closed
  useEffect(() => {
    if (isOpen && status === 'disconnected') {
      connect();
    } else if (!isOpen && status === 'connected') {
      disconnect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const connect = async () => {
    try {
      setStatus('connecting');

      // 1. Setup Audio Input
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      inputContextRef.current = inputCtx;
      
      const source = inputCtx.createMediaStreamSource(stream);
      sourceRef.current = source;

      // Processor for capturing microphone data
      const processor = inputCtx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (e) => {
        if (!mountedRef.current) return;
        
        // Visualizer volume data
        const inputData = e.inputBuffer.getChannelData(0);
        let sum = 0;
        for (let i = 0; i < inputData.length; i++) {
            sum += inputData[i] * inputData[i];
        }
        setVolume(Math.sqrt(sum / inputData.length) * 5); // Boost gain for visual

        // Send to Gemini
        const pcmBlob = createPcmBlob(inputData);
        if (sessionPromiseRef.current) {
          sessionPromiseRef.current.then(session => {
            session.sendRealtimeInput({ media: pcmBlob });
          }).catch(err => console.error("Session send error", err));
        }
      };

      source.connect(processor);
      processor.connect(inputCtx.destination);

      // 2. Setup Audio Output
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      outputContextRef.current = outputCtx;

      // 3. Connect to Live API
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } },
          },
          systemInstruction: `You are a friendly, professional audio engineering tutor. 
          You are guiding a student through a 2-week course on mixing vocals in Pro Tools Intro (Free Version).
          The user has a lesson plan checklist.
          Your goal is to explain concepts simply, encourage them, and explain WHY specific stock plugins (EQ III, Dynamics III, D-Verb) are used.
          Keep answers concise and conversational. Do not be too verbose.
          If asked, you can dictate tasks for a specific day.`,
        },
        callbacks: {
          onopen: () => {
            if (mountedRef.current) setStatus('connected');
          },
          onmessage: async (msg: LiveServerMessage) => {
            if (!mountedRef.current) return;

            // Handle Audio Response
            const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioData && outputContextRef.current) {
              const ctx = outputContextRef.current;
              
              // Ensure we track time correctly
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);

              const audioBuffer = await decodeAudioData(
                base64ToUint8Array(audioData),
                ctx,
                24000,
                1
              );

              const bufferSource = ctx.createBufferSource();
              bufferSource.buffer = audioBuffer;
              bufferSource.connect(ctx.destination);
              
              bufferSource.start(nextStartTimeRef.current);
              scheduledSourcesRef.current.add(bufferSource);
              
              nextStartTimeRef.current += audioBuffer.duration;
              
              bufferSource.onended = () => {
                scheduledSourcesRef.current.delete(bufferSource);
              };
            }

            // Handle Interruption
            if (msg.serverContent?.interrupted) {
                scheduledSourcesRef.current.forEach(s => s.stop());
                scheduledSourcesRef.current.clear();
                nextStartTimeRef.current = 0;
            }
          },
          onclose: () => {
            if (mountedRef.current) setStatus('disconnected');
          },
          onerror: (err) => {
            console.error(err);
            if (mountedRef.current) setStatus('error');
          }
        }
      });

      sessionPromiseRef.current = sessionPromise;

    } catch (err) {
      console.error("Connection failed", err);
      setStatus('error');
    }
  };

  const disconnect = () => {
    // 1. Close session
    if (sessionPromiseRef.current) {
      sessionPromiseRef.current.then(session => session.close()).catch(() => {});
      sessionPromiseRef.current = null;
    }

    // 2. Stop audio tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }

    // 3. Close Contexts
    if (inputContextRef.current) inputContextRef.current.close();
    if (outputContextRef.current) outputContextRef.current.close();
    if (processorRef.current) {
        processorRef.current.disconnect();
        processorRef.current = null;
    }
    
    // 4. Reset state
    inputContextRef.current = null;
    outputContextRef.current = null;
    scheduledSourcesRef.current.clear();
    nextStartTimeRef.current = 0;
    setStatus('disconnected');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className={`${isDark ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-gray-200'} border w-full max-w-md rounded-2xl p-6 shadow-2xl flex flex-col items-center relative overflow-hidden`}>
        
        {/* Background Ambient Glow */}
        <div className={`absolute inset-0 bg-purple-600/10 transition-opacity duration-500 ${status === 'connected' ? 'opacity-100' : 'opacity-0'}`} />

        {/* Close Button */}
        <button 
          onClick={onClose}
          className={`absolute top-4 right-4 ${isDark ? 'text-zinc-400 hover:text-white' : 'text-gray-400 hover:text-gray-900'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        {/* Visualizer / Status Icon */}
        <div className="mt-8 mb-6 relative">
          {status === 'connecting' && (
             <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
          )}
          
          {status === 'connected' && (
             <div className={`relative flex items-center justify-center w-24 h-24 rounded-full border-2 border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.3)] ${isDark ? 'bg-zinc-800' : 'bg-gray-100'}`}>
                {/* Simulated Audio Waveform Ring based on volume */}
                <div 
                    className="absolute inset-0 rounded-full bg-purple-500 opacity-20 transition-transform duration-75"
                    style={{ transform: `scale(${1 + Math.min(volume, 0.5)})` }}
                />
                 <svg className="w-10 h-10 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
                     <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                     <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                 </svg>
             </div>
          )}

          {status === 'error' && (
              <div className="text-red-500 text-center">
                  <p className="font-bold">Connection Error</p>
                  <p className="text-sm">Please allow mic access</p>
              </div>
          )}
        </div>

        <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Live Pro Tools Tutor</h3>
        
        <p className={`text-center text-sm mb-8 px-4 h-12 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
          {status === 'connected' 
             ? "I'm listening. Ask me about your current mix step or say 'Dictate tasks'." 
             : status === 'connecting' ? "Connecting to AI..." : "Tap to speak"}
        </p>

        {status === 'connected' && (
          <button 
            onClick={onClose}
            className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 rounded-xl transition-colors font-medium"
          >
            End Session
          </button>
        )}
      </div>
    </div>
  );
};

export default LiveAssistant;