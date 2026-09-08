'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  MapPin,
  Navigation,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Home,
  KeyRound,
  LogIn,
} from 'lucide-react';

interface AuthProfile {
  houseName: string;
  userName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  isNewRegistration: boolean;
}

interface AuthRegistrationScreenProps {
  onAuthenticated: (profile: AuthProfile) => void;
}

const BRAZIL_STATES = [
  { uf: 'PR', name: 'Paraná' },
  { uf: 'SP', name: 'São Paulo' },
  { uf: 'SC', name: 'Santa Catarina' },
  { uf: 'RS', name: 'Rio Grande do Sul' },
  { uf: 'RJ', name: 'Rio de Janeiro' },
  { uf: 'MG', name: 'Minas Gerais' },
  { uf: 'BA', name: 'Bahia' },
  { uf: 'DF', name: 'Distrito Federal' },
  { uf: 'GO', name: 'Goiás' },
  { uf: 'PE', name: 'Pernambuco' },
  { uf: 'CE', name: 'Ceará' },
  { uf: 'ES', name: 'Espírito Santo' },
];

export default function AuthRegistrationScreen({ onAuthenticated }: AuthRegistrationScreenProps) {
  const [activeTab, setActiveTab] = useState<'register' | 'login'>('register');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form states - Registration
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('PR');
  const [houseName, setHouseName] = useState('Minha Casa');

  // Form states - Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // GPS state
  const [isDetectingGPS, setIsDetectingGPS] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<string | null>(null);

  // Phone input formatting: (XX) 9XXXX-XXXX
  const handlePhoneChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 11);
    if (raw.length <= 2) {
      setPhone(raw);
    } else if (raw.length <= 7) {
      setPhone(`(${raw.slice(0, 2)}) ${raw.slice(2)}`);
    } else {
      setPhone(`(${raw.slice(0, 2)}) ${raw.slice(2, 7)}-${raw.slice(7)}`);
    }
  };

  // GPS Auto-detection
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      setGpsStatus('Geolocalização não suportada.');
      return;
    }

    setIsDetectingGPS(true);
    setGpsStatus('Detectando localização via satélite...');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
          );
          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            const detectedCity = addr.city || addr.town || addr.municipality || addr.village || 'Colombo';
            const stateName = (addr.state || '').toLowerCase();
            const foundState = BRAZIL_STATES.find(
              (s) => stateName.includes(s.name.toLowerCase()) || stateName.includes(s.uf.toLowerCase())
            );
            const detectedState = foundState ? foundState.uf : 'PR';

            setCity(detectedCity);
            setState(detectedState);
            setGpsStatus(`Localizado: ${detectedCity}, ${detectedState}`);
          } else {
            setCity('Colombo');
            setState('PR');
            setGpsStatus('Definido: Colombo, PR');
          }
        } catch {
          setCity('Colombo');
          setState('PR');
          setGpsStatus('Definido: Colombo, PR');
        } finally {
          setIsDetectingGPS(false);
        }
      },
      () => {
        setIsDetectingGPS(false);
        setGpsStatus('Permissão negada. Digite sua cidade abaixo.');
      },
      { timeout: 8000 }
    );
  };

  // Submit Registration
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Por favor, digite seu nome completo.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Por favor, informe um e-mail válido.');
      return;
    }
    if (!password.trim() || password.length < 4) {
      setErrorMessage('Crie uma senha de no mínimo 4 dígitos para proteger sua conta.');
      return;
    }
    const finalCity = city.trim() || 'Colombo';
    const finalState = state || 'PR';
    const finalHouse = houseName.trim() || 'Minha Casa';

    const accountData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      password: password.trim(),
      city: finalCity,
      state: finalState,
      houseName: finalHouse,
      registeredAt: new Date().toISOString(),
      status: 'active',
    };

    const sessionData = {
      isLoggedIn: true,
      email: accountData.email,
      name: accountData.name,
      token: `session-${Date.now()}`,
    };

    const profileData = {
      houseName: finalHouse,
      userName: accountData.name,
      email: accountData.email,
      phone: accountData.phone,
      city: finalCity,
      state: finalState,
    };

    try {
      localStorage.setItem('listme_user_account', JSON.stringify(accountData));
      localStorage.setItem('listme_user_session', JSON.stringify(sessionData));
      localStorage.setItem('listme_profile', JSON.stringify(profileData));
    } catch (err) {
      console.warn('LocalStorage error:', err);
    }

    onAuthenticated({
      houseName: finalHouse,
      userName: accountData.name,
      email: accountData.email,
      phone: accountData.phone,
      city: finalCity,
      state: finalState,
      isNewRegistration: true,
    });
  };

  // Submit Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!loginEmail.trim() || !loginEmail.includes('@')) {
      setErrorMessage('Informe um e-mail válido.');
      return;
    }
    if (!loginPassword.trim()) {
      setErrorMessage('Digite sua senha cadastrada.');
      return;
    }

    // Check saved account
    const saved = localStorage.getItem('listme_user_account');
    let loadedProfile = {
      houseName: 'Minha Casa',
      userName: 'Assinante',
      email: loginEmail.trim().toLowerCase(),
      phone: '',
      city: 'Colombo',
      state: 'PR',
    };

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        loadedProfile = {
          houseName: parsed.houseName || 'Minha Casa',
          userName: parsed.name || 'Assinante',
          email: parsed.email || loginEmail.trim().toLowerCase(),
          phone: parsed.phone || '',
          city: parsed.city || 'Colombo',
          state: parsed.state || 'PR',
        };
      } catch {}
    }

    const sessionData = {
      isLoggedIn: true,
      email: loginEmail.trim().toLowerCase(),
      name: loadedProfile.userName,
      token: `session-${Date.now()}`,
    };

    localStorage.setItem('listme_user_session', JSON.stringify(sessionData));
    localStorage.setItem('listme_profile', JSON.stringify(loadedProfile));

    onAuthenticated({
      ...loadedProfile,
      isNewRegistration: false,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0B0E11] text-white flex flex-col justify-between overflow-y-auto selection:bg-[#84E000] selection:text-neutral-950">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none opacity-25">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#84E000] rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#497D00] rounded-full blur-[160px]" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-md mx-auto px-5 py-8 sm:py-10 flex flex-col min-h-screen justify-center">
        
        {/* Top Branding */}
        <div className="text-center mb-6 flex flex-col items-center">
          <div className="w-16 h-16 rounded-3xl bg-white border border-black/10 shadow-2xl p-1.5 mb-4 backdrop-blur-xl flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="LIST.ME"
              width={56}
              height={56}
              className="w-full h-full object-contain rounded-2xl"
              priority
            />
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {activeTab === 'register' ? 'Criar Sua Conta' : 'Acesse Sua Conta'}
          </h1>
          <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
            {activeTab === 'register'
              ? 'Complete seu cadastro para sincronizar sua assinatura e calcular os mercados mais baratos da sua região.'
              : 'Entre com seu e-mail e senha cadastrados para acessar sua despensa e listas.'}
          </p>
        </div>

        {/* Navigation Tabs (Cadastrar vs Entrar) */}
        <div className="flex bg-neutral-900/80 p-1 rounded-2xl border border-white/10 mb-6 backdrop-blur-md">
          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'register'
                ? 'bg-[#84E000] text-neutral-950 shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Sparkles size={14} />
            Ativar Acesso
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'login'
                ? 'bg-[#84E000] text-neutral-950 shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <LogIn size={14} />
            Já sou Assinante
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2 animate-in fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
            {errorMessage}
          </div>
        )}

        {/* Card Form */}
        <div className="bg-neutral-900/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
          {activeTab === 'register' ? (
            /* --- CADASTRO (ATIVAR ACESSO) --- */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              {/* Nome Completo */}
              <div>
                <label className="text-[11px] font-mono uppercase text-neutral-400 block mb-1">
                  Nome Completo
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-950/80 border border-white/10 rounded-xl text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#84E000] transition"
                  />
                </div>
              </div>

              {/* E-mail da Compra */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-mono uppercase text-neutral-400">
                    E-mail do Assinante
                  </label>
                  <span className="text-[10px] text-[#84E000] font-mono">Usado na compra</span>
                </div>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seuemail@exemplo.com"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-950/80 border border-white/10 rounded-xl text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#84E000] transition"
                  />
                </div>
              </div>

              {/* WhatsApp / Celular */}
              <div>
                <label className="text-[11px] font-mono uppercase text-neutral-400 block mb-1">
                  WhatsApp / Celular
                </label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="(41) 99999-8888"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-950/80 border border-white/10 rounded-xl text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#84E000] transition"
                  />
                </div>
              </div>

              {/* Criar Senha */}
              <div>
                <label className="text-[11px] font-mono uppercase text-neutral-400 block mb-1">
                  Criar Senha de Acesso
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Crie uma senha (mínimo 4 dígitos)"
                    className="w-full pl-10 pr-10 py-2.5 bg-neutral-950/80 border border-white/10 rounded-xl text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#84E000] transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-1"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Localização / Cidade & Estado (Crucial para Supermercados mais baratos) */}
              <div className="pt-1">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-mono uppercase text-neutral-400">
                    Sua Cidade (Para cotações locais)
                  </label>
                  <button
                    type="button"
                    onClick={handleDetectGPS}
                    disabled={isDetectingGPS}
                    className="text-[10px] text-[#84E000] hover:text-[#92F200] font-mono flex items-center gap-1 transition"
                  >
                    <Navigation size={11} className={isDetectingGPS ? 'animate-spin' : ''} />
                    {isDetectingGPS ? 'Detectando...' : 'Detectar por GPS'}
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2 relative">
                    <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Ex: Colombo, Curitiba..."
                      className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-950/80 border border-white/10 rounded-xl text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#84E000] transition"
                    />
                  </div>
                  <div>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-2.5 py-2.5 bg-neutral-950/80 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#84E000] transition"
                    >
                      {BRAZIL_STATES.map((s) => (
                        <option key={s.uf} value={s.uf} className="bg-neutral-900 text-white">
                          {s.uf}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {gpsStatus && (
                  <span className="text-[10px] text-neutral-400 mt-1 block">
                    {gpsStatus}
                  </span>
                )}
              </div>

              {/* Nome da Despensa / Casa */}
              <div>
                <label className="text-[11px] font-mono uppercase text-neutral-400 block mb-1">
                  Nome da Residência / Despensa
                </label>
                <div className="relative">
                  <Home size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input
                    type="text"
                    value={houseName}
                    onChange={(e) => setHouseName(e.target.value)}
                    placeholder="Minha Casa"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-950/80 border border-white/10 rounded-xl text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#84E000] transition"
                  />
                </div>
              </div>

              {/* Botão de Envio */}
              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-[#84E000] hover:bg-[#92F200] text-neutral-950 font-bold rounded-2xl text-xs shadow-lg flex items-center justify-center gap-2 mt-4 transition duration-200"
              >
                <span>Ativar Meu Acesso e Entrar</span>
                <ArrowRight size={15} />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-400 pt-2 text-center">
                <ShieldCheck size={14} className="text-[#84E000]" />
                <span>Seus dados e listas ficam sincronizados no seu dispositivo.</span>
              </div>
            </form>
          ) : (
            /* --- LOGIN (JÁ SOU ASSINANTE) --- */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] font-mono uppercase text-neutral-400 block mb-1">
                  E-mail de Acesso
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="seuemail@exemplo.com"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-950/80 border border-white/10 rounded-xl text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#84E000] transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase text-neutral-400 block mb-1">
                  Sua Senha
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Sua senha cadastrada"
                    className="w-full pl-10 pr-10 py-2.5 bg-neutral-950/80 border border-white/10 rounded-xl text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#84E000] transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-1"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-[#84E000] hover:bg-[#92F200] text-neutral-950 font-bold rounded-2xl text-xs shadow-lg flex items-center justify-center gap-2 mt-2 transition duration-200"
              >
                <span>Acessar Minha Conta</span>
                <ArrowRight size={15} />
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const text = `Olá! Sou assinante do LIST.ME e preciso de ajuda para redefinir minha senha de acesso.`;
                    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                  }}
                  className="text-[11px] text-neutral-400 hover:text-white underline transition"
                >
                  Esqueceu sua senha? Fale com o suporte no WhatsApp
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Security Badge Footer */}
        <div className="text-center mt-6 text-[11px] text-neutral-500 flex items-center justify-center gap-1">
          <CheckCircle2 size={13} className="text-[#84E000]" />
          <span>Acesso Seguro SSL 256-bit • LIST.ME</span>
        </div>

      </div>
    </div>
  );
}
