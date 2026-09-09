'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MapPin, Navigation, Sparkles, Home, User, Check, ArrowRight } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (profile: {
    houseName: string;
    userName: string;
    city: string;
    state: string;
  }) => void;
}

const BRAZIL_STATES = [
  { uf: 'SP', name: 'São Paulo' },
  { uf: 'RJ', name: 'Rio de Janeiro' },
  { uf: 'MG', name: 'Minas Gerais' },
  { uf: 'SC', name: 'Santa Catarina' },
  { uf: 'PR', name: 'Paraná' },
  { uf: 'RS', name: 'Rio Grande do Sul' },
  { uf: 'BA', name: 'Bahia' },
  { uf: 'DF', name: 'Distrito Federal' },
  { uf: 'GO', name: 'Goiás' },
  { uf: 'PE', name: 'Pernambuco' },
  { uf: 'CE', name: 'Ceará' },
  { uf: 'ES', name: 'Espírito Santo' },
];

export default function OnboardingModal({ isOpen, onComplete }: OnboardingModalProps) {
  const [houseName, setHouseName] = useState('Minha Casa');
  const [userName, setUserName] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('SP');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocalização não suportada neste navegador.');
      return;
    }

    setIsDetectingLocation(true);
    setLocationStatus('Identificando coordenadas...');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Reverse geocoding via OpenStreetMap free API
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
          );
          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            const detectedCity = addr.city || addr.town || addr.municipality || addr.village || 'São Paulo';
            
            // Map state to 2-letter UF if possible
            let detectedState = 'SP';
            const stateName = (addr.state || '').toLowerCase();
            const foundState = BRAZIL_STATES.find(s => 
              stateName.includes(s.name.toLowerCase()) || stateName.includes(s.uf.toLowerCase())
            );
            if (foundState) detectedState = foundState.uf;

            setCity(detectedCity);
            setState(detectedState);
            setLocationStatus(`Localizado: ${detectedCity}, ${detectedState}`);
          } else {
            setCity('São Paulo');
            setState('SP');
            setLocationStatus('Localizado por aproximação: São Paulo, SP');
          }
        } catch {
          setCity('São Paulo');
          setState('SP');
          setLocationStatus('Definido: São Paulo, SP');
        } finally {
          setIsDetectingLocation(false);
        }
      },
      () => {
        setIsDetectingLocation(false);
        setLocationStatus('Permissão negada. Digite manualmente abaixo.');
      },
      { timeout: 8000 }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCity = city.trim() || 'São Paulo';
    const finalHouse = houseName.trim() || 'Minha Casa';
    const finalUser = userName.trim() || 'Usuário';

    onComplete({
      houseName: finalHouse,
      userName: finalUser,
      city: finalCity,
      state: state || 'SP',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto overscroll-contain animate-in fade-in duration-200">
      <div className="bg-paper-50 rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-elevated hairline-border max-h-[88dvh] overflow-y-auto overscroll-contain my-auto animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-3.5">
          <div className="w-9 h-9 rounded-2xl overflow-hidden border border-black/10 bg-white shadow-xs shrink-0">
            <Image
              src="/logo.png"
              alt="Logo"
              width={36}
              height={36}
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <span className="text-[10px] font-mono text-[#497D00] uppercase font-bold tracking-widest block">
              LIST.ME SETUP
            </span>
            <h2 className="font-serif text-lg font-bold text-neutral-900 leading-tight">
              Sua Residência
            </h2>
          </div>
        </div>

        <p className="text-xs text-neutral-500 leading-relaxed mb-4">
          Informe sua localização para compararmos os mercados e encontrar o melhor preço para suas compras.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          
          {/* Nome da Casa */}
          <div>
            <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1 font-medium">
              Nome da Casa
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={houseName}
                onChange={(e) => setHouseName(e.target.value)}
                placeholder="Ex: Minha Casa"
                className="w-full px-3.5 py-2.5 bg-neutral-50 hairline-border rounded-xl text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#84E000]"
              />
              <Home size={14} className="absolute right-3 top-3 text-neutral-400 pointer-events-none" />
            </div>
          </div>

          {/* Nome do Usuário */}
          <div>
            <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1 font-medium">
              Seu Primeiro Nome
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Ex: Mariana"
                className="w-full px-3.5 py-2.5 bg-neutral-50 hairline-border rounded-xl text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#84E000]"
              />
              <User size={14} className="absolute right-3 top-3 text-neutral-400 pointer-events-none" />
            </div>
          </div>

          {/* Localização GPS Quick Action */}
          <div className="pt-0.5">
            <button
              type="button"
              onClick={handleDetectGPS}
              disabled={isDetectingLocation}
              className="w-full py-2.5 px-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition"
            >
              <Navigation size={13} className={`text-[#497D00] ${isDetectingLocation ? 'animate-spin' : ''}`} />
              {isDetectingLocation ? 'Localizando...' : '📍 Usar GPS Atual'}
            </button>
            {locationStatus && (
              <p className="text-[10px] text-[#497D00] font-bold mt-1 text-center">
                {locationStatus}
              </p>
            )}
          </div>

          {/* Cidade e Estado */}
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1 font-medium">
                Cidade
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ex: Colombo"
                className="w-full px-3 py-2.5 bg-neutral-50 hairline-border rounded-xl text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#84E000]"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1 font-medium">
                UF
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-2 py-2.5 bg-neutral-50 hairline-border rounded-xl text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#84E000] font-mono font-medium"
              >
                {BRAZIL_STATES.map((s) => (
                  <option key={s.uf} value={s.uf}>
                    {s.uf}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-1.5">
            <button
              type="submit"
              className="w-full py-2.5 bg-[#84E000] hover:bg-[#92F200] text-neutral-950 rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition duration-200"
            >
              Ativar LIST.ME <ArrowRight size={13} />
            </button>
          </div>

          <p className="text-[10px] text-center text-neutral-400">
            Salvo localmente no seu aparelho.
          </p>
        </form>

      </div>
    </div>
  );
}
