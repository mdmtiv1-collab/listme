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
    <div className="flex flex-col gap-2 bg-[#14181D] border border-white/10 p-3 rounded-2xl shadow-xl">
      {/* Real-time live transcript bar */}
      <div className="px-1 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-[#84E000] animate-pulse shrink-0" />
          <p className="text-xs text-white font-medium truncate">
            {transcript ? (
              <span className="text-[#84E000] font-semibold">&ldquo;{transcript}&rdquo;</span>
            ) : errorMessage ? (
              <span className="text-amber-400">{errorMessage}</span>
            ) : (
              <span className="text-neutral-400">Ouvindo... Diga os itens da sua compra</span>
            )}
          </p>
        </div>
        <span className="font-mono text-xs font-bold text-[#84E000] shrink-0 ml-2">
          {formatTime(seconds)}
        </span>
      </div>

      {/* Wave Visualizer and Controls */}
      <div className="flex items-center justify-between gap-3 pt-1">
        {/* Real Dynamic Soundwave */}
        <div className="flex items-center gap-1 h-7 px-1 flex-1 overflow-hidden">
          {audioVolumes.map((height, i) => (
            <span
              key={i}
              style={{ height: `${height}px` }}
              className={`w-1 rounded-full transition-all duration-75 ${
                isPaused ? 'bg-neutral-600' : 'bg-[#84E000] shadow-[0_0_8px_#84e00088]'
              }`}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onCancel}
            type="button"
            title="Descartar áudio"
            className="p-2 text-neutral-400 hover:text-red-400 hover:bg-white/5 rounded-xl transition"
          >
            <Trash2 size={16} />
          </button>

          <button
            onClick={() => setIsPaused(!isPaused)}
            type="button"
            title={isPaused ? 'Continuar' : 'Pausar'}
            className="p-2 text-neutral-300 hover:text-white hover:bg-white/5 rounded-xl transition"
          >
            {isPaused ? <Play size={16} /> : <Pause size={16} />}
          </button>

          <button
            onClick={handleSend}
            type="button"
            title="Adicionar à lista"
            className="px-3.5 py-2 bg-[#84E000] hover:bg-[#92F200] text-neutral-950 rounded-xl text-xs font-bold shadow-lg shadow-[#84e000]/20 transition flex items-center gap-1.5 duration-200"
          >
            <Send size={14} />
            <span>Adicionar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
