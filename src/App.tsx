import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Lock, AlertTriangle, ShieldAlert, 
  Smile, UserCheck, HelpCircle, Sparkles, Volume2,
  LockOpen, Play, ArrowRight, Star
} from 'lucide-react';

const BAD_ADJECTIVES = [
  "Gullible", "Forgetful", "Clumsy", "Smelly", "Lazy", 
  "Awkward", "Dense", "Oblivious", "Grumpy", "Greasy", 
  "Goofy", "Weird", "Moody", "Loud", "Stubborn", 
  "Nosy", "Silly", "Whiny", "Slow", "Messy", 
  "Ignorant", "Reckless", "Selfish", "Vain", "Tactless", 
  "Timid", "Naive", "Dull", "Cranky", "Needy", 
  "Shabby", "Clueless", "Odd", "Bizarre", "Petty", 
  "Fussy", "Crafty", "Sneaky", "Sleepy", "Careless", 
  "Picky", "Rowdy", "Grim", "Churlish", "Pretentious", 
  "Spoiled", "Sassy", "Geeky", "Drab", "Bland"
];

const capitalizeName = (str: string) => {
  if (!str) return '';
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export default function App() {
  const [step, setStep] = useState<
    'landing' | 'password' | 'name' | 'srishti_romance' | 'calligraphy' | 'captcha' | 
    'motivational' | 'love' | 'horror' | 'virus' | 'camera' | 'feedback' | 'suggestions'
  >('landing');
  const [srishtiPhase, setSrishtiPhase] = useState<1 | 2 | 3 | 4>(1);
  const [horrorPhase, setHorrorPhase] = useState<'none' | 'flashing' | 'darkness' | 'scare'>('none');

  // Input states
  const [passwordInput, setPasswordInput] = useState('');
  const [nameInput, setNameInput] = useState('');

  // Calligraphy phase state
  const [nameDrawn, setNameDrawn] = useState(false);

  // Captcha phase state
  const [captchaStatus, setCaptchaStatus] = useState<'idle' | 'countdown' | 'triggered'>('idle');
  const [countdown, setCountdown] = useState(3);

  // Motivational phase state
  const [motivationPhase, setMotivationPhase] = useState<'typing' | 'bad_words'>('typing');
  const [badWordsVisible, setBadWordsVisible] = useState<Array<{ id: number; text: string; top: number; left: number; color: string }>>([]);

  // Love phase state
  const [lovePhase, setLovePhase] = useState<1 | 2 | 3 | 4>(1);
  const [loveAnswer, setLoveAnswer] = useState<'yes' | 'no' | null>(null);

  // Virus & camera states
  const [spinProgress, setSpinProgress] = useState(0);
  const [cameraState, setCameraState] = useState<'scanning' | 'funny_pose' | 'done'>('scanning');

  // Final Step State
  const [finalChoice, setFinalChoice] = useState<'creator' | 'github' | 'other' | null>(null);
  const [finalActionTaken, setFinalActionTaken] = useState(false);

  // Audio references
  const audio1Ref = useRef<HTMLAudioElement | null>(null);
  const audio2Ref = useRef<HTMLAudioElement | null>(null);

  // Generate synthesizer backup sounds safely (Web Audio API)
  const getAudioContext = () => {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    return new AudioContext();
  };

  const playSynthesizedTone = (type: OscillatorType, freq: number, duration: number, volume: number) => {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn("Synth tone unavailable", e);
    }
  };

  const playScaryScreech = () => {
    try {
      const ctx = getAudioContext();
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(600, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.6);

      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(400, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.6);

      gain.gain.setValueAtTime(1.2, ctx.currentTime); // Extra loud scare
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.6);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.6);
      osc2.stop(ctx.currentTime + 0.6);
    } catch (e) {
      console.warn("Horror tone unavailable", e);
    }
  };

  // Play embarrassing sounds
  const playLoudEmbarrassingSound = () => {
    try {
      const ctx = getAudioContext();
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(110, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 1.2);
      
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(85, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 1.5);

      gain.gain.setValueAtTime(1.0, ctx.currentTime); 
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 1.5);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 1.5);
      osc2.stop(ctx.currentTime + 1.5);
    } catch (e) {
      console.warn("Embarrassing tone unavailable", e);
    }
  };

  const playPrankAudio = (file: 'audio1' | 'audio2') => {
    if (file === 'audio1') {
      if (audio1Ref.current) {
        audio1Ref.current.play().catch(() => playSynthesizedTone('sine', 330, 1.5, 0.4));
      } else {
        playSynthesizedTone('sine', 330, 1.5, 0.4);
      }
    } else {
      if (audio2Ref.current) {
        audio2Ref.current.play().catch(() => playSynthesizedTone('sawtooth', 180, 0.6, 0.5));
      } else {
        playSynthesizedTone('sawtooth', 180, 0.6, 0.5);
      }
    }
  };

  const [passwordError, setPasswordError] = useState('');

  // Password Verification Logic
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'Onceuponam@sturbator') {
      setPasswordError('');
      setStep('name');
    } else {
      setPasswordError('Invalid Decryption Key. Try again.');
      setPasswordInput('');
    }
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = nameInput.trim().toLowerCase();
    const isSrishti = cleanName.includes('shristi') || cleanName.includes('srishti');

    if (nameInput.trim()) {
      if (isSrishti) {
        setStep('srishti_romance');
      } else {
        setStep('calligraphy');
        setTimeout(() => setNameDrawn(true), 1500);
      }
    }
  };

  // Captcha volume logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (captchaStatus === 'countdown' && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (captchaStatus === 'countdown' && countdown === 0) {
      setCaptchaStatus('triggered');
      playLoudEmbarrassingSound();
    }
    return () => clearTimeout(timer);
  }, [captchaStatus, countdown]);

  const triggerLowSound = () => {
    setCaptchaStatus('countdown');
    playSynthesizedTone('sine', 220, 3.0, 0.05); // low volume pitch
  };

  // Sequential word spam
  useEffect(() => {
    if (step === 'motivational') {
      const timer = setTimeout(() => {
        setMotivationPhase('bad_words');
        const list: typeof badWordsVisible = [];
        for (let i = 0; i < 50; i++) {
          setTimeout(() => {
            const colors = ['text-red-500', 'text-amber-500', 'text-rose-500', 'text-pink-500', 'text-fuchsia-500', 'text-yellow-500'];
            list.push({
              id: i,
              text: BAD_ADJECTIVES[i % BAD_ADJECTIVES.length],
              top: Math.floor(Math.random() * 85) + 5,
              left: Math.floor(Math.random() * 85) + 5,
              color: colors[Math.floor(Math.random() * colors.length)]
            });
            setBadWordsVisible([...list]);
          }, i * 100);
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // Srishti Romantic specific flow logic
  useEffect(() => {
    if (step === 'srishti_romance') {
      const p1 = setTimeout(() => setSrishtiPhase(2), 2000); // 2000ms delay
      const p2 = setTimeout(() => setSrishtiPhase(3), 4000); // 1000ms pause + type
      const p3 = setTimeout(() => setSrishtiPhase(4), 6500); // 1500ms pause + merge

      return () => {
        clearTimeout(p1);
        clearTimeout(p2);
        clearTimeout(p3);
      };
    }
  }, [step]);

  // One-sided love sequential displays
  useEffect(() => {
    if (step === 'love') {
      const t1 = setTimeout(() => setLovePhase(2), 2000); 
      const t2 = setTimeout(() => setLovePhase(3), 3000); 
      const t3 = setTimeout(() => setLovePhase(4), 5000); 
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [step]);

  // Horror Sequence controllers
  useEffect(() => {
    if (step === 'horror') {
      const t1 = setTimeout(() => {
        setHorrorPhase('darkness');
      }, 3000); // 3 seconds flashing

      const t2 = setTimeout(() => {
        setHorrorPhase('scare');
        playScaryScreech();
      }, 4500); // 1.5 seconds darkness

      const t3 = setTimeout(() => {
        setHorrorPhase('none');
        setStep('camera'); // advance to face camera calibration
      }, 5000); // 0.5s jump scare

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [step]);

  const handleLoveSelection = (choice: 'yes' | 'no') => {
    setLoveAnswer(choice);
    if (choice === 'yes') {
      playPrankAudio('audio1');
    } else {
      playPrankAudio('audio2');
    }
  };

  const handleInteraction = () => {
    if (step === 'virus' && spinProgress < 100) {
      setSpinProgress(prev => Math.min(prev + 1.2, 100));
    }
  };

  useEffect(() => {
    if (step === 'camera') {
      const timer1 = setTimeout(() => setCameraState('funny_pose'), 3000);
      const timer2 = setTimeout(() => setCameraState('done'), 6000);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [step]);

  return (
    <div 
      className="min-h-screen w-full select-none flex flex-col justify-between font-sans bg-slate-950 text-slate-200 transition-colors duration-700 overflow-x-hidden touch-none"
      onMouseMove={handleInteraction}
      onTouchMove={handleInteraction}
    >
      {/* Hidden audio loaders safely referencing assets */}
      <audio ref={audio1Ref} src="audio1.mp3" preload="auto" />
      <audio ref={audio2Ref} src="audio2.mp3" preload="auto" />

      {/* Modern Global Navbar */}
      <nav className="w-full border-b border-slate-800 bg-slate-900/60 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="text-emerald-500 w-6 h-6 animate-pulse" />
          <span className="font-bold tracking-tight text-xl text-white">Quantum<span className="text-emerald-500">Secure</span></span>
        </div>
        <div className="text-xs font-mono text-slate-400 bg-slate-950/80 px-3 py-1 rounded-full border border-slate-800">
          NODE_ONLINE_v7.9
        </div>
      </nav>

      {/* Main Container */}
      <main className="flex-1 w-full flex items-center justify-center relative">
        
        {/* LANDING PAGE INTRO */}
        {step === 'landing' && (
          <div className="max-w-4xl px-6 text-center space-y-8 animate-fade-in py-12">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-semibold px-4 py-1.5 rounded-full">
              <Lock className="w-4 h-4" /> Military-Grade Authentication
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Unlock Your Dedicated <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Information Portal</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Welcome to the secured central gateway. Please establish your session by fulfilling your authentication requirements below.
            </p>
            <div className="pt-4">
              <button 
                onClick={() => setStep('password')}
                className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-lg rounded-xl shadow-lg shadow-emerald-500/20 transition-all duration-300 transform hover:-translate-y-0.5 inline-flex items-center gap-2 group"
              >
                Launch Verification <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {/* 1. PASSWORD INPUT */}
        {step === 'password' && (
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 mx-4 rounded-2xl shadow-2xl space-y-6 relative animate-scale-up">
            <div className="flex flex-col items-center">
              <div className="p-3 bg-emerald-500/10 rounded-full text-emerald-400 mb-4 border border-emerald-500/20">
                <LockOpen size={32} />
              </div>
              <h2 className="text-2xl font-bold font-mono tracking-wide text-emerald-400">INPUT DECRYPTION KEY</h2>
              <p className="text-slate-400 text-sm mt-1">Unlimited clearance attempts are active.</p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-2">ACCESS PASSWORD</label>
                <input 
                  type="text"
                  placeholder="Insert secure passcode..."
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-emerald-400 font-mono placeholder-slate-700 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              {passwordError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-3 py-2 rounded-lg font-mono flex items-start gap-2">
                  <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                  <span>{passwordError}</span>
                </div>
              )}

              <button 
                type="submit" 
                className="w-full bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-bold py-3 px-4 rounded-lg font-mono transition shadow-lg shadow-emerald-500/20 flex justify-center items-center gap-2"
              >
                DECRYPT VAULT
              </button>
            </form>
          </div>
        )}

        {/* CUSTOM SRISHTI ROMANTIC EXPERIENCE */}
        {step === 'srishti_romance' && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-tr from-rose-600 via-pink-600 to-red-500 text-white px-6 text-center select-none animate-fade-in">


            <div className="max-w-xl space-y-8 z-10">
              {srishtiPhase >= 1 && (
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-wide drop-shadow-md animate-scale-up">
                  You're {capitalizeName(nameInput)}??
                </h1>
              )}

              {srishtiPhase >= 2 && (
                <p className="text-2xl md:text-4xl font-medium tracking-wide drop-shadow-sm animate-fade-in">
                  Really wanted to talk to you (irl)...
                </p>
              )}

              {srishtiPhase >= 3 && (
                <p className="text-xl md:text-2xl italic text-rose-200 animate-fade-in font-serif">
                  Nvm, let's head towards a unified experience.
                </p>
              )}

              {srishtiPhase >= 4 && (
                <button
                  onClick={() => {
                    setStep('calligraphy');
                    setTimeout(() => setNameDrawn(true), 1500);
                  }}
                  className="mt-8 px-8 py-4 bg-white text-rose-600 font-extrabold rounded-2xl shadow-xl transition-all hover:scale-105 duration-300 flex items-center justify-center gap-2 mx-auto"
                >
                  Enter Portal 🌹
                </button>
              )}
            </div>
          </div>
        )}

        {/* 2. NAME INPUT */}
        {step === 'name' && (
          <div className="max-w-md w-full bg-slate-900/60 backdrop-blur-md border border-emerald-500/20 p-8 mx-4 rounded-2xl shadow-2xl space-y-6 animate-scale-up">
            <div className="flex flex-col items-center">
              <div className="p-3 bg-indigo-500/10 rounded-full text-indigo-400 mb-4 border border-indigo-500/20">
                <UserCheck size={32} />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white">Identity Credentials</h2>
              <p className="text-slate-400 text-sm mt-1">Submit your name to establish access.</p>
            </div>

            <form onSubmit={handleNameSubmit} className="space-y-4">
              <div>
                <input 
                  type="text"
                  required
                  placeholder="Your Full Name"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-indigo-300 placeholder-slate-700 focus:outline-none focus:border-indigo-400 transition-colors text-center text-xl font-semibold"
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-indigo-600 text-white hover:bg-indigo-500 font-bold py-3 px-4 rounded-lg transition shadow-lg shadow-indigo-500/20"
              >
                CONFIRM SIGNATURE
              </button>
            </form>
          </div>
        )}

        {/* 3. CALLIGRAPHY ANIMATION */}
        {step === 'calligraphy' && (
          <div className="w-full h-full min-h-[60vh] flex flex-col items-center justify-center p-6 text-slate-200 animate-fade-in">
            <div className="max-w-2xl w-full text-center space-y-8 bg-slate-900/40 backdrop-blur-md p-12 rounded-3xl border border-slate-800/50 shadow-xl">
              <h3 className="text-xs font-semibold tracking-widest text-emerald-400 uppercase">Automated Elegant Calligraphy</h3>
              
              <div className="relative py-8 flex justify-center items-center">
                <span 
                  className={`text-6xl md:text-8xl text-indigo-400 transition-all duration-[2500ms] ${
                    nameDrawn ? 'opacity-100 translate-y-0 scale-105' : 'opacity-0 translate-y-8 scale-95'
                  }`}
                  style={{ fontFamily: "'Great Vibes', cursive" }}
                >
                  {capitalizeName(nameInput)}
                </span>
              </div>

              {nameDrawn && (
                <button
                  onClick={() => setStep('captcha')}
                  className="mt-6 px-8 py-3 bg-white text-slate-950 hover:bg-slate-200 font-semibold rounded-xl shadow-xl transition-all duration-300 animate-scale-up inline-flex items-center gap-2"
                >
                  Confirm Signature <Play className="w-4 h-4 fill-current" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* 4. PRANK 1: CAPTCHA (VOLUME BAIT) */}
        {step === 'captcha' && (
          <div className="max-w-md w-full bg-white border border-slate-200 p-8 mx-4 rounded-2xl shadow-xl space-y-6 text-slate-800 animate-scale-up">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-900">Security Clearance</h2>
              <p className="text-slate-500 text-xs">Captcha browser validation required.</p>
            </div>

            {captchaStatus === 'idle' && (
              <div className="space-y-6">
                <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      id="captcha-check"
                      className="w-6 h-6 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      onChange={triggerLowSound}
                    />
                    <label htmlFor="captcha-check" className="font-semibold text-slate-700 cursor-pointer select-none">
                      I am not a robot
                    </label>
                  </div>
                  <div className="flex flex-col items-center opacity-70">
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/a/ad/RecaptchaLogo.svg" 
                      alt="recaptcha" 
                      className="w-10 h-10"
                    />
                    <span className="text-[9px] text-slate-400 mt-1">reCAPTCHA</span>
                  </div>
                </div>
              </div>
            )}

            {captchaStatus === 'countdown' && (
              <div className="text-center space-y-4">
                <div className="flex justify-center text-amber-500">
                  <Volume2 size={48} className="animate-bounce" />
                </div>
                <div className="font-semibold text-red-600 text-md">
                  🔊 VERIFICATION FREQUENCY ISSUED
                </div>
                <p className="text-slate-600 text-sm">
                  The audio tone is deliberately low. <strong className="text-red-500">Please raise system volume to full capacity</strong> to verify pitch variance.
                </p>
                <div className="text-2xl font-bold font-mono text-slate-800 bg-slate-100 py-2 rounded-lg border">
                  Decoding in: {countdown}s
                </div>
              </div>
            )}

            {captchaStatus === 'triggered' && (
              <div className="text-center space-y-4 animate-ping-once">
                <div className="flex justify-center text-red-500 animate-pulse">
                  <AlertTriangle size={64} />
                </div>
                <h1 className="text-3xl font-black text-red-600">🚨 WHOOPS! 💨</h1>
                <p className="text-lg font-bold text-slate-800">Did the entire room hear that?</p>
                <p className="text-slate-500 text-sm">
                  We apologize for that sudden security burst. It happens occasionally.
                </p>
                <button
                  onClick={() => setStep('virus')}
                  className="w-full py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-lg shadow-red-500/30 transition duration-300"
                >
                  Forgive and Continue
                </button>
              </div>
            )}
          </div>
        )}

        {/* 5. PRANK 2: MOTIVATIONAL & ADJECTIVE SPAM */}
        {step === 'motivational' && (
          <div className="w-full h-full min-h-[60vh] relative overflow-hidden flex items-center justify-center text-white">
            {motivationPhase === 'typing' && (
              <div className="text-center space-y-6 px-4 animate-fade-in">
                <Sparkles className="text-amber-400 mx-auto w-12 h-12 animate-pulse" />
                <h1 className="text-4xl md:text-5xl font-light italic tracking-wide text-amber-200">
                  You are...
                </h1>
              </div>
            )}

            {motivationPhase === 'bad_words' && (
              <>
                {/* Visual adjective bombardment */}
                {badWordsVisible.map(item => (
                  <span
                    key={item.id}
                    className={`absolute font-black text-xl md:text-3xl transition-all duration-300 ${item.color} scale-110 animate-pulse`}
                    style={{ top: `${item.top}%`, left: `${item.left}%` }}
                  >
                    {item.text}!
                  </span>
                ))}

                <div className="z-10 bg-slate-900/90 backdrop-blur-xl p-8 mx-4 rounded-2xl border border-red-500 text-center max-w-md space-y-4 shadow-2xl">
                  <h2 className="text-2xl font-extrabold text-red-500">Wait... Wait!</h2>
                  <p className="text-slate-300 text-sm">
                    The motivational assessment pipeline encountered an honest malfunction. Our deepest apologies.
                  </p>
                  <button
                    onClick={() => setStep('love')}
                    className="px-6 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold rounded-lg transition shadow-lg shadow-pink-500/20"
                  >
                    Next Prompt
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* 6. PRANK 3: LOVE DIALOGUE */}
        {step === 'love' && (
          <div className="w-full h-full min-h-[60vh] flex items-center justify-center text-pink-900 relative">
            <div className="absolute inset-0 pointer-events-none opacity-20">
              <span className="absolute top-10 left-10 text-4xl animate-bounce">💖</span>
              <span className="absolute top-20 right-20 text-3xl animate-pulse">💘</span>
              <span className="absolute bottom-20 left-1/4 text-5xl animate-ping">❤️</span>
              <span className="absolute bottom-10 right-1/3 text-4xl animate-bounce">💔</span>
            </div>

            <div className="max-w-xl w-full text-center px-6 space-y-8 z-10 bg-pink-50/90 backdrop-blur-sm p-12 rounded-3xl border border-pink-200 shadow-xl mx-4">
              {lovePhase >= 1 && (
                <h2 className="text-2xl md:text-3xl font-serif italic text-pink-800 animate-fade-in">
                  "You know what hurts the most??"
                </h2>
              )}

              {lovePhase >= 3 && (
                <p className="text-xl md:text-2xl font-light text-rose-600 animate-fade-in">
                  Fall of your one-sided love.
                </p>
              )}

              {lovePhase >= 4 && !loveAnswer && (
                <div className="space-y-6 pt-4 animate-fade-in">
                  <p className="text-xl font-bold text-pink-900">Have you ever loved someone??</p>
                  <div className="flex justify-center gap-6">
                    <button
                      onClick={() => handleLoveSelection('yes')}
                      className="px-6 py-3 bg-pink-600 text-white font-bold rounded-xl hover:bg-pink-700 shadow-lg shadow-pink-500/30 transition duration-300 transform hover:scale-105 flex items-center gap-2"
                    >
                      Yes ❤️
                    </button>
                    <button
                      onClick={() => handleLoveSelection('no')}
                      className="px-6 py-3 bg-slate-700 text-white font-bold rounded-xl hover:bg-slate-800 shadow-lg shadow-slate-500/30 transition duration-300 transform hover:scale-105 flex items-center gap-2"
                    >
                      No 💔
                    </button>
                  </div>
                </div>
              )}

              {loveAnswer && (
                <div className="pt-4 space-y-6 animate-scale-up">
                  {loveAnswer === 'yes' ? (
                    <div className="space-y-4">
                      <span className="text-6xl inline-block animate-pulse">🎻</span>
                      <h3 className="text-xl font-bold text-pink-800">Playing the world's smallest violin...</h3>
                      <p className="text-pink-600 text-sm">We salute your emotional strength.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <span className="text-6xl animate-spin inline-block">😳</span>
                      <h3 className="text-xl font-black text-rose-800">Wait... NO ONE?!</h3>
                      <div className="flex justify-center">
                        <div className="bg-white border-2 border-rose-400 p-2 rounded-xl shadow-md max-w-xs rotate-2 animate-bounce">
                          <img 
                            src="https://media.giphy.com/media/26ueYUlPAmUkY5jK8/giphy.gif" 
                            alt="Reaction" 
                            className="rounded-lg w-full h-40 object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1531928351158-2f736078e0a1?auto=format&fit=crop&w=300";
                            }}
                          />
                          <p className="text-[10px] font-mono mt-2 text-rose-500 font-bold">GIF Loaded Successfully</p>
                        </div>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => {
                      setStep('horror');
                      setHorrorPhase('flashing');
                    }}
                    className="mt-6 px-6 py-2.5 bg-pink-600 text-white font-medium rounded-xl hover:bg-pink-700 transition"
                  >
                    Proceed Forward
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* HORROR JUMP SCARE STEP */}
        {step === 'horror' && (
          <div className={`fixed inset-0 z-50 flex items-center justify-center ${
            horrorPhase === 'flashing' ? 'animate-scary-flash' : 'bg-black'
          }`}>
            {horrorPhase === 'scare' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black overflow-hidden">
                <img 
                  src="/scary.png" 
                  alt="Screaming Horror Figure" 
                  className="w-full h-full md:w-auto md:h-full object-contain animate-jump-scare animate-shake"
                />
              </div>
            )}
          </div>
        )}

        {/* 7. PRANK 4: VIRUS MALWARE DECEPTION */}
        {step === 'virus' && (
          <div className="max-w-md w-full bg-slate-900 border-2 border-red-500 p-8 mx-4 rounded-2xl shadow-2xl space-y-6 animate-scale-up">
            <div className="flex items-center gap-3 border-b border-red-500/30 pb-4">
              <ShieldAlert className="text-red-500 w-10 h-10 animate-pulse" />
              <div>
                <h2 className="text-xl font-bold text-red-500 uppercase">Malware Alert!</h2>
                <p className="text-slate-400 text-xs font-mono">CRITICAL SECURITY BREACH</p>
              </div>
            </div>

            <div className="space-y-4 text-center">
              <p className="text-sm text-slate-300">
                A stealth protocol is backing up personal browser logs.
              </p>
              <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg text-xs text-red-400 font-mono">
                "TROJAN.GULLIBLE_DEFENSE.32"
              </div>
              <p className="font-bold text-sm text-amber-400">
                ⚠️ TO OVERRIDE DOWNLOAD: Drag your mouse across the screen rapidly!
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono text-slate-400">
                <span>INTERRUPTION RATIO:</span>
                <span>{Math.floor(spinProgress)}%</span>
              </div>
              <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden border border-slate-700">
                <div 
                  className="bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500 h-full transition-all duration-100"
                  style={{ width: `${spinProgress}%` }}
                ></div>
              </div>
            </div>

            {spinProgress >= 100 && (
              <div className="pt-2 animate-fade-in">
                <div className="text-emerald-400 text-center font-bold text-sm mb-4">
                  ✓ Connection intercepted.
                </div>
                <button
                  onClick={() => setStep('motivational')}
                  className="w-full py-3 bg-emerald-600 text-slate-950 font-bold rounded-xl hover:bg-emerald-500 transition duration-300"
                >
                  Verify Overwrite
                </button>
              </div>
            )}
          </div>
        )}

        {/* 8. PRANK 5: CAMERA SCAN */}
        {step === 'camera' && (
          <div className="max-w-md w-full bg-slate-800 border border-slate-700 p-8 mx-4 rounded-2xl shadow-2xl space-y-6 text-center animate-scale-up">
            <h2 className="text-xl font-bold text-white">Visual Alignment Verification</h2>
            <p className="text-slate-400 text-sm">Synchronizing optical clearance data</p>

            <div className="w-56 h-56 mx-auto border-4 border-indigo-500 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden bg-slate-950 shadow-inner">
              {cameraState === 'scanning' && (
                <>
                  <div className="w-full bg-indigo-500/30 h-8 absolute top-0 animate-scan pointer-events-none"></div>
                  <Smile size={64} className="text-indigo-400 animate-pulse" />
                  <div className="text-[10px] font-mono text-slate-400 mt-4">Reading facial mapping...</div>
                </>
              )}

              {cameraState === 'funny_pose' && (
                <div className="space-y-4 px-4">
                  <div className="text-amber-400 font-bold text-xs uppercase font-mono">Mapping Error</div>
                  <div className="text-xs text-slate-300">
                    Facial depth is too flat. Stick your tongue out and widen your eyes to continue.
                  </div>
                  <span className="text-4xl animate-bounce inline-block">🤪</span>
                </div>
              )}

              {cameraState === 'done' && (
                <div className="space-y-2 p-4 text-emerald-400 animate-scale-up">
                  <span className="text-5xl">👍</span>
                  <div className="font-bold text-sm">Calibration Success!</div>
                  <div className="text-[9px] text-slate-400 font-mono">100% Goofball metrics</div>
                </div>
              )}
            </div>

            {cameraState === 'done' && (
              <button
                onClick={() => setStep('feedback')}
                className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition shadow-lg shadow-indigo-500/20"
              >
                Access Portal Feedback
              </button>
            )}
          </div>
        )}

        {/* 10. SUGGESTIONS (FRIENDLY / VIBRANT) */}
        {step === 'suggestions' && (
          <div className="max-w-xl w-full bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-8 mx-4 rounded-3xl shadow-2xl space-y-8 animate-fade-in relative overflow-hidden">
            {/* Playful Floating Emojis in the background */}
            <div className="absolute inset-0 pointer-events-none opacity-30 select-none">
              <span className="absolute top-4 left-6 text-2xl animate-bounce">💡</span>
              <span className="absolute top-1/3 right-10 text-3xl animate-pulse">🛠️</span>
              <span className="absolute bottom-12 left-10 text-4xl animate-bounce delay-100">🚀</span>
              <span className="absolute bottom-1/4 right-8 text-2xl animate-spin delay-200">✨</span>
            </div>

            <div className="text-center space-y-4 z-10 relative">
              <div className="inline-flex p-3 bg-gradient-to-tr from-amber-500 to-orange-400 rounded-2xl text-slate-950 font-bold shadow-lg transform rotate-6 animate-pulse">
                🤝 Bestie Corner
              </div>
              <h2 className="text-3xl font-black text-white bg-gradient-to-r from-amber-200 via-emerald-200 to-teal-200 bg-clip-text text-transparent">
                "Okay, we know this site is kinda trash..."
              </h2>
              <p className="text-slate-300 text-base leading-relaxed font-medium">
                But hey, it's all in good fun! We'd seriously love any cool advice or wild ideas you have to level this up. Drop a quick suggestion below! 👇
              </p>
            </div>

            <div className="text-center py-6 space-y-6 z-10 relative animate-scale-up">
              <div className="text-5xl animate-bounce">🥳</div>
              <h3 className="text-xl font-bold text-amber-400">Mission Accomplished!</h3>
              <p className="text-slate-300 text-sm max-w-sm mx-auto">
                No real data was recorded, but hopefully you had some good laughs! Send this link to unsuspecting colleagues.
              </p>
              <button
                onClick={() => {
                  setStep('landing');
                  setPasswordInput('');
                  setNameInput('');
                }}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold rounded-xl hover:opacity-90 transition-all shadow-md duration-300 inline-flex items-center gap-2"
              >
                🔄 Reset Portal
              </button>
            </div>
          </div>
        )}

        {/* 9. FINAL FEEDBACK STEP */}
        {step === 'feedback' && (
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 mx-4 rounded-2xl shadow-2xl space-y-6 animate-scale-up">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 bg-purple-500/10 rounded-full text-purple-400 mb-4 border border-purple-500/30">
                <HelpCircle size={32} />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white">Final Questionnaire</h2>
              <p className="text-slate-400 text-sm mt-1">Where did you find this platform?</p>
            </div>

            {!finalChoice ? (
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => { setFinalChoice('creator'); confetti(); }}
                  className="py-3 px-4 bg-slate-800 hover:bg-slate-700/50 border border-slate-700 hover:border-purple-500 rounded-xl text-left font-medium transition flex items-center justify-between group text-slate-200"
                >
                  <span>By the Creator (Unisexually named creature)</span>
                  <span className="opacity-0 group-hover:opacity-100 transition">👑</span>
                </button>
                <button
                  onClick={() => { setFinalChoice('github'); confetti(); }}
                  className="py-3 px-4 bg-slate-800 hover:bg-slate-700/50 border border-slate-700 hover:border-purple-500 rounded-xl text-left font-medium transition flex items-center justify-between group text-slate-200"
                >
                  <span>GitHub Repository</span>
                  <span className="opacity-0 group-hover:opacity-100 transition"><Star size={18} className="text-yellow-400 fill-yellow-400" /></span>
                </button>
                <button
                  onClick={() => { setFinalChoice('other'); confetti(); }}
                  className="py-3 px-4 bg-slate-800 hover:bg-slate-700/50 border border-slate-700 hover:border-purple-500 rounded-xl text-left font-medium transition flex items-center justify-between group text-slate-200"
                >
                  <span>Other Outlets</span>
                  <span className="opacity-0 group-hover:opacity-100 transition">🚀</span>
                </button>
              </div>
            ) : (
              <div className="text-center py-2 space-y-6 animate-scale-up">
                {finalChoice === 'creator' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-purple-400">Would you show appreciation to him?</h3>
                    <div className="flex justify-center gap-4">
                      <button 
                        onClick={() => setFinalActionTaken(true)}
                        className="px-6 py-2 bg-purple-600 hover:bg-purple-500 font-bold rounded-xl"
                      >
                        Absolutely! ❤️
                      </button>
                      <button 
                        onClick={() => setFinalActionTaken(true)}
                        className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-400"
                      >
                        No thanks
                      </button>
                    </div>
                  </div>
                )}

                {finalChoice === 'github' && (
                  <div className="space-y-4">
                    <p className="text-md text-slate-200">
                      We'd appreciate a ⭐ star on GitHub to support future expansions.
                    </p>
                    <button 
                      onClick={() => setFinalActionTaken(true)}
                      className="px-6 py-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 rounded-xl text-yellow-400 font-bold animate-pulse"
                    >
                      Will Do! 🌟
                    </button>
                  </div>
                )}

                {finalChoice === 'other' && (
                  <div className="space-y-4">
                    <p className="text-md font-serif italic text-slate-200">
                      "How did you know the password?? Just kidding!"
                    </p>
                    <p className="text-purple-400 text-sm font-bold">
                      We're happy others shared this experience with you.
                    </p>
                    <button 
                      onClick={() => setFinalActionTaken(true)}
                      className="px-6 py-2 bg-purple-600 hover:bg-purple-500 font-bold rounded-xl"
                    >
                      Close Gateway
                    </button>
                  </div>
                )}

                {finalActionTaken && (
                  <div className="border-t border-slate-800 pt-4 animate-fade-in space-y-4">
                    <p className="text-slate-400 text-xs">No private data was compromised. You did great!</p>
                    <button
                      onClick={() => setStep('suggestions')}
                      className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold rounded-xl shadow-md transition-all hover:scale-105 duration-300"
                    >
                      A Quick Message For You ✨
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </main>

      {/* Modern Footer */}
      <footer className="w-full border-t border-slate-800/50 bg-slate-900/40 text-center py-4 text-xs text-slate-500 font-mono">
        &copy; 2026 QuantumSecure Gateway. All rights pranked.
      </footer>

      {/* Style extensions for custom transitions */}
      <style>{`
        @keyframes scary-flash {
          0%, 100% { background-color: black; }
          50% { background-color: white; }
        }
        .animate-scary-flash {
          animation: scary-flash 0.15s linear infinite;
        }
        @keyframes jump-scare {
          0% { transform: scale(0.6) translate3d(0, 50px, 0); opacity: 0.5; }
          100% { transform: scale(1.4) translate3d(0, 0, 0); opacity: 1; }
        }
        .animate-jump-scare {
          animation: jump-scare 0.5s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
        }
        @keyframes shake {
          0%, 100% { transform: translate(0, 0) scale(1.3); }
          10%, 30%, 50%, 70%, 90% { transform: translate(-10px, 10px) scale(1.35); }
          20%, 40%, 60%, 80% { transform: translate(10px, -10px) scale(1.3); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out infinite;
        }
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
        .animate-scan {
          animation: scan 2.5s linear infinite;
        }
        @keyframes ping-once {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        .animate-ping-once {
          animation: ping-once 0.4s ease-out 1;
        }
        @keyframes scale-up {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scale-up {
          animation: scale-up 0.35s ease-out forwards;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
