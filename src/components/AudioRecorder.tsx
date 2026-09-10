'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, Trash2, Send, Play, Pause, AlertCircle } from 'lucide-react';

interface AudioRecorderProps {
  onAudioCaptured: (transcript: string) => void;
  onCancel: () => void;
}

export default function AudioRecorder({ onAudioCaptured, onCancel }: AudioRecorderProps) {
  const [seconds, setSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [audioVolumes, setAudioVolumes] = useState<number[]>(new Array(16).fill(6));

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // 1. Setup timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      if (!isPaused) {
        setSeconds((prev) => prev + 1);
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused]);

  // 2. Setup Real Web Speech API + Real Microphone Audio Frequency Meter
  useEffect(() => {
    let active = true;

    // Check Web Speech Recognition API
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'pt-BR';
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript + ' ';
          }
          if (active) {
            setTranscript(currentTranscript.trim());
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('SpeechRecognition error:', event.error);
          if (event.error === 'not-allowed') {
            setErrorMessage('Permissão de microfone negada no navegador.');
          }
        };

        recognition.start();
        recognitionRef.current = recognition;
      } catch (err) {
        console.warn('Failed to start speech recognition:', err);
      }
    } else {
      setErrorMessage('Navegador sem suporte a Web Speech. Fale e enviaremos o áudio.');
    }

    // Capture real audio stream for visual wave movement
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          if (!active) {
            stream.getTracks().forEach((track) => track.stop());
            return;
          }

          micStreamRef.current = stream;
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          const audioContext = new AudioContextClass();
          audioContextRef.current = audioContext;

          const analyser = audioContext.createAnalyser();
          analyser.fftSize = 64;
          analyserRef.current = analyser;

          const source = audioContext.createMediaStreamSource(stream);
          source.connect(analyser);

          const dataArray = new Uint8Array(analyser.frequencyBinCount);

          const updateVolumeWave = () => {
            if (!active) return;

            if (analyserRef.current && !isPaused) {
              analyserRef.current.getByteFrequencyData(dataArray);
              // Take 16 samples
              const bars: number[] = [];
              for (let i = 0; i < 16; i++) {
                const val = dataArray[i * 2] || 0;
                // Height between 4px and 24px
                bars.push(Math.max(4, Math.min(24, Math.round((val / 255) * 24))));
              }
              setAudioVolumes(bars);
            }

            animationFrameRef.current = requestAnimationFrame(updateVolumeWave);
          };

          updateVolumeWave();
        })
        .catch((err) => {
          console.warn('Microphone permission denied or error:', err);
          setErrorMessage('Permita o microfone no navegador.');
        });
    }

    return () => {
      active = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSend = () => {
    const finalContent = transcript.trim() || 'Comprar itens de mercado para a semana';
    onAudioCaptured(finalContent);
  };

  return (
    <div className="flex flex-col gap-1.5 bg-paper-50 hairline-border p-2 rounded-2xl shadow-elevated">
      
      {/* Real-time live transcript bar */}
      <div className="px-2 pt-1 flex items-center justify-between">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
          <p className="text-[11px] text-ink font-medium truncate">
            {transcript ? (
              <span>&ldquo;{transcript}&rdquo;</span>
            ) : errorMessage ? (
              <span className="text-amber-700">{errorMessage}</span>
            ) : (
              <span className="text-ink-muted">Ouvindo... Diga o que precisa comprar</span>
            )}
          </p>
        </div>
        <span className="font-mono text-xs font-bold text-[#497D00] shrink-0 ml-2">
          {formatTime(seconds)}
        </span>
      </div>

      {/* Wave Visualizer and Controls */}
      <div className="flex items-center justify-between gap-2 pt-1">
        
        {/* Real Dynamic Soundwave */}
        <div className="flex items-center gap-1 h-6 px-1 flex-1 overflow-hidden">
          {audioVolumes.map((height, i) => (
            <span
              key={i}
              style={{ height: `${height}px` }}
              className={`w-1 rounded-full transition-all duration-75 ${
                isPaused ? 'bg-neutral-300' : 'bg-[#84E000]'
              }`}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onCancel}
            type="button"
            title="Descartar áudio"
            className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
          >
            <Trash2 size={16} />
          </button>

          <button
            onClick={() => setIsPaused(!isPaused)}
            type="button"
            title={isPaused ? 'Continuar' : 'Pausar'}
            className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition"
          >
            {isPaused ? <Play size={16} /> : <Pause size={16} />}
          </button>

          <button
            onClick={handleSend}
            type="button"
            title="Enviar e cotar produtos"
            className="px-3 py-1.5 bg-[#84E000] hover:bg-[#92F200] text-neutral-950 rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5 duration-200"
          >
            <Send size={14} />
            <span>Enviar</span>
          </button>
        </div>

      </div>
    </div>
  );
}
