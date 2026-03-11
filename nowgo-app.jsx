
import { useState, useEffect, useRef } from "react"; 

const COLORS = {
  bg: "#F5F0E8", surface: "#FFFDF7", warm: "#E8DFC8",
  accent: "#C17B3F", accentLight: "#F0D4B0", accentSoft: "#FAF0E0",
  text: "#2C2416", textMid: "#7A6A52", textLight: "#B09A7A",
  green: "#5A8A5A", greenLight: "#E8F5E8",
};

// Accessibility: inject focus styles + reduced motion support once
if (typeof document !== 'undefined' && !document.getElementById('nowgo-a11y')) {
  const s = document.createElement('style');
  s.id = 'nowgo-a11y';
  s.textContent = `
    *:focus-visible {
      outline: 3px solid #C17B3F !important;
      outline-offset: 3px !important;
      border-radius: 6px !important;
    }
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
      }
    }
    @media (prefers-contrast: high) {
      body { background: #fff !important; color: #000 !important; }
    }
  `;
  document.head.appendChild(s);
}

const MICRO_STEPS = {
  "Send that email": ["Open email app", "Find the draft or start new", "Type just the subject line", "Write one sentence", "Hit send"],
  "Pay bills": ["Open bank app or website", "Find the bill section", "Pick just one bill", "Enter payment info", "Confirm"],
  "Clean kitchen": ["Walk to the kitchen", "Put one dish in the sink", "Turn on the water", "Wash that one dish", "See what's next"],
  "Exercise": ["Put on workout clothes", "Step outside or find space", "Do 5 jumping jacks", "Keep going if you want", "Done — you showed up"],
  "Work on project": ["Open the file or doc", "Read the last thing you wrote", "Write one sentence or idea", "Set a 10-min timer", "Keep going"],
  default: ["Open the app or go to the place", "Do the very first physical action", "Set a timer for 5 minutes", "Just begin — even badly", "Keep going or call it done"],
};

const ENERGY_TASKS = {
  low: ["Reply to one text", "Delete 5 emails", "Make your bed", "Drink water", "Write tomorrow's one task"],
  medium: ["Send that email", "Pay bills", "Clean kitchen", "Make a call", "Work on project for 20 min"],
  high: ["Work on project", "Exercise", "Hard conversation", "Deep focus work", "Plan your week"],
};

const AFFIRMATIONS = [
  "Starting is the only hard part.",
  "You don't have to do it all. Just do one thing.",
  "Imperfect action beats perfect inaction.",
  "Your brain works differently — not less.",
  "5 minutes is a real amount of effort.",
];

const ONBOARDING_SLIDES = [
  {
    emoji: "👋",
    title: "Welcome to NowGo",
    subtitle: "You know what to do.\nNowGo helps you actually do it.",
    body: "Built for brains that run on interest, urgency, and 'oh no it's due today.' No judgment. No time-blocking. Just your one thing, right now.",
  },
  {
    emoji: "🧠",
    title: "Your brain isn't broken",
    subtitle: "Your old apps just weren't built for it.",
    body: "The ADHD brain sees time as 'now' or 'not now.' NowGo works with that. It shows you one task, breaks it into the tiniest first step, and celebrates you for starting.",
  },
  {
    emoji: "🌧",
    title: "Bad brain days happen",
    subtitle: "NowGo has a mode for those too.",
    body: "When everything feels impossible, tap Bad Brain Day mode. It strips everything back to basics — breathe, one sip of water, five minutes. That's enough.",
  },
  {
    emoji: "📱",
    title: "Add to your home screen",
    subtitle: "Use it like a real app — for free.",
    body: "Tap the share icon in your browser, then 'Add to Home Screen.' NowGo will appear as an app icon on your phone — no app store needed.",
    isInstall: true,
  },
];

function OnboardingScreen({ onDone }) {
  const [slide, setSlide] = useState(0);
  const current = ONBOARDING_SLIDES[slide];
  const isLast = slide === ONBOARDING_SLIDES.length - 1;

  return (
    <div style={{
      minHeight: "100vh", background: COLORS.bg,
      display: "flex", flexDirection: "column",
      fontFamily: "Georgia, serif",
    }}>
      {/* Progress dots */}
      <div style={{ display: "flex", gap: 6, padding: "32px 24px 0", justifyContent: "center" }}>
        {ONBOARDING_SLIDES.map((_, i) => (
          <div key={i} style={{
            width: i === slide ? 24 : 8, height: 8,
            borderRadius: 4,
            background: i === slide ? COLORS.accent : COLORS.warm,
            transition: "all 0.3s ease",
          }} />
        ))}
      </div>

      {/* Content */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        justifyContent: "center", padding: "40px 28px",
        textAlign: "center",
      }}>
        <div style={{ fontSize: 72, marginBottom: 24 }}>{current.emoji}</div>
        <h1 style={{
          fontSize: 28, fontWeight: 700, color: COLORS.text,
          marginBottom: 10, lineHeight: 1.2,
        }}>
          {current.title}
        </h1>
        <p style={{
          fontSize: 17, color: COLORS.accent, fontStyle: "italic",
          marginBottom: 20, lineHeight: 1.4,
          whiteSpace: "pre-line",
        }}>
          {current.subtitle}
        </p>
        <p style={{
          fontSize: 15, color: COLORS.textMid, lineHeight: 1.8,
          maxWidth: 340, margin: "0 auto",
        }}>
          {current.body}
        </p>

        {current.isInstall && (
          <div style={{
            marginTop: 24, background: COLORS.accentSoft,
            borderRadius: 14, padding: "16px 20px",
            border: `1px solid ${COLORS.accentLight}`,
            textAlign: "left", maxWidth: 340, margin: "24px auto 0",
          }}>
            <p style={{ fontSize: 13, color: COLORS.textMid, marginBottom: 10, fontWeight: 600 }}>
              iPhone / Safari:
            </p>
            <p style={{ fontSize: 13, color: COLORS.textMid, lineHeight: 1.7 }}>
              1. Tap the <strong style={{color: COLORS.accent}}>Share</strong> icon (box with arrow) at the bottom<br/>
              2. Scroll down and tap <strong style={{color: COLORS.accent}}>"Add to Home Screen"</strong><br/>
              3. Tap <strong style={{color: COLORS.accent}}>"Add"</strong> — done! 🎉
            </p>
            <p style={{ fontSize: 13, color: COLORS.textMid, marginTop: 12, fontWeight: 600 }}>
              Android / Chrome:
            </p>
            <p style={{ fontSize: 13, color: COLORS.textMid, lineHeight: 1.7 }}>
              1. Tap the <strong style={{color: COLORS.accent}}>⋮ menu</strong> (top right)<br/>
              2. Tap <strong style={{color: COLORS.accent}}>"Add to Home Screen"</strong><br/>
              3. Tap <strong style={{color: COLORS.accent}}>"Add"</strong> — you're set!
            </p>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div style={{ padding: "0 24px 48px", display: "flex", flexDirection: "column", gap: 10 }}>
        <button
          onClick={() => isLast ? onDone() : setSlide(s => s + 1)}
          aria-label={isLast ? "Finish intro and open NowGo" : `Next slide`}
          style={{
            background: COLORS.accent, color: "#fff",
            border: "none", borderRadius: 14, padding: "16px 0",
            fontSize: 18, fontWeight: 700, cursor: "pointer",
            fontFamily: "Georgia, serif",
            boxShadow: `0 6px 20px rgba(193,123,63,0.35)`,
          }}>
          {isLast ? "Let's go →" : "Next →"}
        </button>
        {!isLast && (
          <button onClick={onDone} aria-label="Skip intro and go straight to the app" style={{
            background: "none", border: "none",
            color: COLORS.textLight, fontSize: 14,
            cursor: "pointer", padding: "8px 0",
          }}>
            Skip intro
          </button>
        )}
      </div>
    </div>
  );
}

function InstallBanner({ onDismiss }) {
  return (
    <div style={{
      background: COLORS.accentSoft,
      borderBottom: `1px solid ${COLORS.accentLight}`,
      padding: "10px 16px",
      display: "flex", alignItems: "center", gap: 10,
    }}>
      <span style={{ fontSize: 18 }}>📱</span>
      <p style={{ flex: 1, fontSize: 12, color: COLORS.textMid, lineHeight: 1.4 }}>
        <strong style={{ color: COLORS.accent }}>Add to Home Screen</strong> for the best experience
      </p>
      <button onClick={onDismiss} aria-label="Dismiss install banner" style={{
        background: "none", border: "none",
        color: COLORS.textLight, cursor: "pointer",
        fontSize: 18, padding: "0 4px",
      }}>×</button>
    </div>
  );
}

function BreathingCircle({ active }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}
      role="img" aria-label={active ? "Breathing circle expanding — breathe in" : "Breathing circle contracting — breathe out"}>
      <div style={{
        width: active ? 80 : 50, height: active ? 80 : 50,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${COLORS.accentLight}, ${COLORS.accent})`,
        transition: "all 4s ease-in-out",
        boxShadow: `0 0 ${active ? 30 : 10}px ${COLORS.accentLight}`,
      }} aria-hidden="true" />
      <p style={{ color: COLORS.textMid, fontSize: 13, fontStyle: "italic" }} aria-live="polite">
        {active ? "breathe in..." : "breathe out..."}
      </p>
    </div>
  );
}

function TaskCard({ task, onStart, onSkip }) {
  const [showSteps, setShowSteps] = useState(false);
  const steps = MICRO_STEPS[task] || MICRO_STEPS.default;
  return (
    <div style={{
      background: COLORS.surface, borderRadius: 20, padding: "32px 28px",
      border: `1.5px solid ${COLORS.warm}`,
      boxShadow: "0 4px 24px rgba(193,123,63,0.08)",
    }}>
      <p style={{ color: COLORS.textLight, fontSize: 11, letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>
        YOUR ONE THING
      </p>
      <h2 style={{ fontSize: 28, fontWeight: 700, color: COLORS.text, fontFamily: "Georgia, serif", marginBottom: 20 }}>
        {task}
      </h2>
      {!showSteps ? (
        <button onClick={() => setShowSteps(true)}
          aria-label={`Show me how to start: ${task}`}
          style={{
            background: "none", border: `1px solid ${COLORS.accentLight}`,
            color: COLORS.accent, padding: "8px 16px", borderRadius: 8,
            fontSize: 13, cursor: "pointer", marginBottom: 20,
          }}>→ Show me how to start</button>
      ) : (
        <div style={{ marginBottom: 20 }}>
          <p style={{ color: COLORS.textMid, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>FIRST STEP ONLY:</p>
          <div style={{
            background: COLORS.accentSoft, borderRadius: 12, padding: "14px 18px",
            borderLeft: `3px solid ${COLORS.accent}`,
          }}>
            <p style={{ fontSize: 18, color: COLORS.text, fontFamily: "Georgia, serif", fontWeight: 600 }}>{steps[0]}</p>
            <p style={{ fontSize: 12, color: COLORS.textLight, marginTop: 4 }}>That's it. Just that one thing.</p>
          </div>
          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
            {steps.slice(1).map((s, i) => (
              <p key={i} style={{ fontSize: 13, color: COLORS.textLight, paddingLeft: 16 }}>{i + 2}. {s}</p>
            ))}
          </div>
        </div>
      )}
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={onStart} aria-label={`I'm starting: ${task}`} style={{
          flex: 1, background: COLORS.accent, color: "#FFF",
          border: "none", borderRadius: 12, padding: "14px 0",
          fontSize: 16, fontWeight: 700, cursor: "pointer",
          fontFamily: "Georgia, serif",
          boxShadow: `0 4px 16px rgba(193,123,63,0.35)`,
        }}>✓ I'm starting</button>
        <button onClick={onSkip} aria-label="Not now — go back to home" style={{
          padding: "14px 18px", background: "none",
          border: `1px solid ${COLORS.warm}`, borderRadius: 12,
          color: COLORS.textLight, cursor: "pointer", fontSize: 14,
        }}>Not now</button>
      </div>
    </div>
  );
}

function FocusTimer({ task, onDone }) {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(true);
  const [phase, setPhase] = useState("working");
  const intervalRef = useRef(null);
  const WORK_TIME = 25 * 60, BREAK_TIME = 5 * 60;
  const total = phase === "working" ? WORK_TIME : BREAK_TIME;
  const progress = seconds / total;
  const circumference = 2 * Math.PI * 80;

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => {
          if (s >= total - 1) { setPhase(p => p === "working" ? "break" : "working"); return 0; }
          return s + 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, phase, total]);

  const mins = Math.floor((total - seconds) / 60);
  const secs = (total - seconds) % 60;

  return (
    <div style={{
      background: COLORS.surface, borderRadius: 20, padding: "32px 28px",
      border: `1.5px solid ${COLORS.warm}`, textAlign: "center",
    }}>
      <p style={{ color: COLORS.textLight, fontSize: 11, letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>
        {phase === "working" ? "FOCUSING ON" : "BREAK TIME"}
      </p>
      <p style={{ color: COLORS.text, fontSize: 18, fontFamily: "Georgia, serif", marginBottom: 24, fontWeight: 600 }}>
        {phase === "working" ? task : "Rest your brain ☕"}
      </p>
      <div style={{ position: "relative", width: 180, height: 180, margin: "0 auto 24px" }}>
        <svg width="180" height="180" style={{ transform: "rotate(-90deg)" }}
          aria-hidden="true" role="presentation">
          <circle cx="90" cy="90" r="80" fill="none" stroke={COLORS.warm} strokeWidth="8" />
          <circle cx="90" cy="90" r="80" fill="none"
            stroke={phase === "working" ? COLORS.accent : COLORS.green}
            strokeWidth="8" strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
            strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s linear" }}
          />
        </svg>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center" }}
          aria-live="polite" aria-label={`${String(mins).padStart(2,"0")} minutes ${String(secs).padStart(2,"0")} seconds remaining`}>
          <p style={{ fontSize: 36, fontWeight: 700, color: COLORS.text, fontFamily: "Georgia, serif", lineHeight: 1 }} aria-hidden="true">
            {String(mins).padStart(2,"0")}:{String(secs).padStart(2,"0")}
          </p>
          <p style={{ fontSize: 12, color: COLORS.textLight }} aria-hidden="true">remaining</p>
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        <button onClick={() => setRunning(r => !r)}
          aria-label={running ? "Pause timer" : "Resume timer"}
          aria-pressed={!running}
          style={{
            padding: "10px 20px", borderRadius: 10, border: `1px solid ${COLORS.warm}`,
            background: "none", color: COLORS.textMid, cursor: "pointer", fontSize: 14,
          }}>{running ? "⏸ Pause" : "▶ Resume"}</button>
        <button onClick={onDone} aria-label="Mark task as done" style={{
          padding: "10px 20px", borderRadius: 10, background: COLORS.green,
          border: "none", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600,
        }}>✓ Done!</button>
      </div>
    </div>
  );
}

function BadBrainDay() {
  const [step, setStep] = useState(0);
  const steps = [
    { label: "Breathe", desc: "Take 3 slow breaths. That's the whole first task." },
    { label: "One sip of water", desc: "Get up and drink some water. That counts." },
    { label: "Name one thing", desc: "What's the absolute minimum you could do today?" },
    { label: "5 minutes only", desc: "Set a timer. Do the thing for just 5 minutes. Stop when it goes off." },
    { label: "You did it", desc: "That's genuinely enough. You showed up on a hard day." },
  ];
  return (
    <div style={{ background: COLORS.surface, borderRadius: 20, padding: "28px 24px", border: `1.5px solid ${COLORS.warm}` }}>
      <p style={{ color: COLORS.textLight, fontSize: 11, letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>BAD BRAIN DAY MODE</p>
      <p style={{ color: COLORS.textMid, fontSize: 15, fontFamily: "Georgia, serif", marginBottom: 20 }}>
        Your executive function has crashed. That's okay. Here's the minimum viable day.
      </p>
      {steps.map((s, i) => (
        <div key={i} onClick={() => setStep(i)}
          role="button"
          tabIndex={0}
          onKeyDown={e => (e.key === "Enter" || e.key === " ") && setStep(i)}
          aria-label={`Step ${i + 1}: ${s.label}${i < step ? " — completed" : step === i ? " — current step" : ""}`}
          aria-current={step === i ? "step" : undefined}
          style={{
            padding: "12px 16px", borderRadius: 10, marginBottom: 8,
            background: step === i ? COLORS.accentSoft : "transparent",
            border: `1px solid ${step === i ? COLORS.accent : COLORS.warm}`,
            cursor: "pointer", transition: "all 0.2s",
          }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div aria-hidden="true" style={{
              width: 24, height: 24, borderRadius: "50%",
              background: i < step ? COLORS.green : (step === i ? COLORS.accent : COLORS.warm),
              color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 700, flexShrink: 0,
            }}>{i < step ? "✓" : i + 1}</div>
            <div>
              <p style={{ fontWeight: 600, color: COLORS.text, fontSize: 14 }}>{s.label}</p>
              {step === i && <p style={{ fontSize: 13, color: COLORS.textMid, marginTop: 2 }}>{s.desc}</p>}
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={() => setStep(s => Math.min(s + 1, steps.length - 1))}
        aria-label={step < steps.length - 1 ? `Complete step ${step + 1} and move to next` : "Close Bad Brain Day mode"}
        style={{
          width: "100%", marginTop: 12, background: COLORS.accent, color: "#fff",
          border: "none", borderRadius: 10, padding: "12px 0", fontSize: 15,
          fontWeight: 600, cursor: "pointer", fontFamily: "Georgia, serif",
        }}>
        {step < steps.length - 1 ? "Done → Next step" : "Close this day with grace ✓"}
      </button>
    </div>
  );
}

export default function NowGoApp() {
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [view, setView] = useState("home");
  const [energy, setEnergy] = useState(null);
  const [currentTask, setCurrentTask] = useState(null);
  const [tasks, setTasks] = useState(["Send that email", "Pay bills", "Work on project"]);
  const [newTask, setNewTask] = useState("");
  const [completedCount, setCompletedCount] = useState(0);
  const [breathPhase, setBreathPhase] = useState(true);
  const [affirmIdx, setAffirmIdx] = useState(0);

  useEffect(() => {
    const t1 = setInterval(() => setBreathPhase(p => !p), 4000);
    const t2 = setInterval(() => setAffirmIdx(i => (i + 1) % AFFIRMATIONS.length), 6000);
    return () => { clearInterval(t1); clearInterval(t2); };
  }, []);

  if (!hasOnboarded) return <OnboardingScreen onDone={() => setHasOnboarded(true)} />;

  const suggestTask = () => {
    if (!energy) return;
    const pool = ENERGY_TASKS[energy].filter(t => tasks.includes(t));
    const pick = pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : tasks[0] || "Rest";
    setCurrentTask(pick);
    setView("focus");
  };

  const addTask = () => {
    if (newTask.trim()) { setTasks(t => [...t, newTask.trim()]); setNewTask(""); }
  };

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div style={{
      minHeight: "100vh", background: COLORS.bg,
      fontFamily: "'Trebuchet MS', Georgia, serif",
      padding: "0 0 60px", maxWidth: 420, margin: "0 auto",
    }} role="application" aria-label="NowGo productivity app">
      {showBanner && <InstallBanner onDismiss={() => setShowBanner(false)} />}

      {/* Header */}
      <header style={{
        padding: "28px 24px 16px", borderBottom: `1px solid ${COLORS.warm}`,
        display: "flex", justifyContent: "space-between", alignItems: "flex-start",
      }}>
        <div>
          <p style={{ fontSize: 18, fontWeight: 900, color: COLORS.accent, letterSpacing: -0.5 }}>NowGo</p>
          <p style={{ fontSize: 20, fontFamily: "Georgia, serif", color: COLORS.text, fontWeight: 600, marginTop: 2 }}>
            {greeting} 👋
          </p>
        </div>
        {completedCount > 0 && (
          <div style={{
            background: COLORS.greenLight, borderRadius: 20, padding: "4px 12px",
            fontSize: 13, color: COLORS.green, fontWeight: 600,
          }} aria-live="polite" aria-label={`${completedCount} tasks completed today`}>✓ {completedCount} done</div>
        )}
      </header>

      <main style={{ padding: "20px 24px" }}>
        {/* Affirmation */}
        <div style={{
          background: COLORS.accentSoft, borderRadius: 12, padding: "12px 16px",
          marginBottom: 20, borderLeft: `3px solid ${COLORS.accent}`,
        }}>
          <p style={{ fontSize: 14, color: COLORS.textMid, fontFamily: "Georgia, serif", fontStyle: "italic" }}>
            "{AFFIRMATIONS[affirmIdx]}"
          </p>
        </div>

        {/* Bad Brain Day button */}
        {view !== "bad" && (
          <button onClick={() => setView(view === "bad" ? "home" : "bad")}
            aria-label="Switch to Bad Brain Day mode — for days when everything feels impossible"
            style={{
              width: "100%", marginBottom: 16, background: "none",
              border: `1px dashed ${COLORS.textLight}`, borderRadius: 10,
              padding: "10px 0", fontSize: 13, color: COLORS.textLight, cursor: "pointer",
            }}>🌧 Bad brain day? Tap here</button>
        )}

        {view === "bad" && (
          <>
            <BadBrainDay />
            <button onClick={() => setView("home")} aria-label="Go back to home" style={{
              width: "100%", marginTop: 12, background: "none",
              border: `1px solid ${COLORS.warm}`, borderRadius: 10,
              padding: "10px 0", fontSize: 13, color: COLORS.textLight, cursor: "pointer",
            }}>← Back</button>
          </>
        )}

        {view === "home" && (
          <>
            {/* Energy check */}
            <div style={{
              background: COLORS.surface, borderRadius: 20, padding: "24px",
              border: `1.5px solid ${COLORS.warm}`, marginBottom: 16,
              boxShadow: "0 4px 24px rgba(193,123,63,0.06)",
            }}>
              <p style={{ fontSize: 13, color: COLORS.textMid, marginBottom: 14 }}>
                How's your brain feeling <em>right now</em>?
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                {[{val:"low",emoji:"🌿",label:"Low energy"},{val:"medium",emoji:"🌤",label:"Medium energy"},{val:"high",emoji:"⚡",label:"High energy"}].map(({ val, emoji, label }) => (
                  <button key={val} onClick={() => setEnergy(val)}
                    aria-pressed={energy === val}
                    aria-label={`${label} — select this if your brain feels ${val} right now`}
                    style={{
                      flex: 1, padding: "12px 0", borderRadius: 12,
                      border: `1.5px solid ${energy === val ? COLORS.accent : COLORS.warm}`,
                      background: energy === val ? COLORS.accentSoft : "none",
                      color: energy === val ? COLORS.accent : COLORS.textMid,
                      cursor: "pointer", fontSize: 13, fontWeight: energy === val ? 700 : 400,
                      transition: "all 0.15s",
                    }}>
                    <div style={{ fontSize: 20 }} aria-hidden="true">{emoji}</div>
                    <div style={{ marginTop: 2 }}>{val.charAt(0).toUpperCase() + val.slice(1)}</div>
                  </button>
                ))}
              </div>
            </div>

            {energy && (
              <button onClick={suggestTask}
                aria-label="Show me one task matched to my current energy level"
                style={{
                  width: "100%", background: COLORS.accent, color: "#fff",
                  border: "none", borderRadius: 14, padding: "16px 0",
                  fontSize: 18, fontWeight: 700, cursor: "pointer",
                  fontFamily: "Georgia, serif",
                  boxShadow: `0 6px 20px rgba(193,123,63,0.4)`,
                  marginBottom: 16,
                }}>Show me my one thing →</button>
            )}

            {/* Breathing */}
            <div style={{
              background: COLORS.surface, borderRadius: 20, padding: "24px",
              border: `1.5px solid ${COLORS.warm}`, marginBottom: 16, textAlign: "center",
            }}>
              <p style={{ fontSize: 11, letterSpacing: 3, color: COLORS.textLight, textTransform: "uppercase", marginBottom: 16 }}>BEFORE YOU BEGIN</p>
              <BreathingCircle active={breathPhase} />
              <p style={{ color: COLORS.textLight, fontSize: 12, marginTop: 12 }}>30 seconds of breathing reduces task paralysis</p>
            </div>

            {/* Task backlog */}
            <div style={{
              background: COLORS.surface, borderRadius: 20, padding: "24px",
              border: `1.5px solid ${COLORS.warm}`, marginBottom: 16,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <p style={{ fontSize: 11, letterSpacing: 3, color: COLORS.textLight, textTransform: "uppercase" }}>BRAIN DUMP ({tasks.length})</p>
                <p style={{ fontSize: 11, color: COLORS.textLight }}>no pressure</p>
              </div>
              {tasks.map((t, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 0", borderBottom: i < tasks.length - 1 ? `1px solid ${COLORS.warm}` : "none",
                }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${COLORS.accent}`, flexShrink: 0 }} />
                  <p style={{ fontSize: 15, color: COLORS.text, flex: 1 }}>{t}</p>
                  <button onClick={() => { setCurrentTask(t); setView("focus"); }}
                    aria-label={`Focus on task: ${t}`}
                    style={{
                      fontSize: 11, color: COLORS.accent, background: "none",
                      border: `1px solid ${COLORS.accentLight}`, borderRadius: 6,
                      padding: "3px 8px", cursor: "pointer",
                    }}>focus</button>
                </div>
              ))}
              <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                <input value={newTask} onChange={e => setNewTask(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addTask()}
                  placeholder="Add a task (no time needed)..."
                  aria-label="Add a new task to your brain dump"
                  style={{
                    flex: 1, padding: "10px 14px", borderRadius: 10,
                    border: `1px solid ${COLORS.warm}`, background: COLORS.bg,
                    fontSize: 14, color: COLORS.text, outline: "none", fontFamily: "Georgia, serif",
                  }} />
                <button onClick={addTask} aria-label="Add task" style={{
                  padding: "10px 16px", background: COLORS.accent, color: "#fff",
                  border: "none", borderRadius: 10, cursor: "pointer", fontSize: 16,
                }}>+</button>
              </div>
            </div>
          </>
        )}

        {view === "focus" && currentTask && (
          <TaskCard task={currentTask} onStart={() => setView("timer")} onSkip={() => setView("home")} />
        )}

        {view === "timer" && (
          <>
            <div style={{
              background: COLORS.greenLight, borderRadius: 12, padding: "14px 16px",
              marginBottom: 16, display: "flex", alignItems: "center", gap: 10,
            }}>
              <span style={{ fontSize: 22 }}>🎉</span>
              <p style={{ color: COLORS.green, fontWeight: 600, fontSize: 15 }}>You started! That was the hardest part.</p>
            </div>
            <FocusTimer task={currentTask} onDone={() => { setCompletedCount(c => c + 1); setTasks(t => t.filter(x => x !== currentTask)); setView("done"); }} />
          </>
        )}

        {view === "done" && (
          <div style={{
            background: COLORS.surface, borderRadius: 20, padding: "40px 28px",
            border: `1.5px solid ${COLORS.warm}`, textAlign: "center",
          }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>✨</div>
            <h2 style={{ fontSize: 28, fontFamily: "Georgia, serif", color: COLORS.text, marginBottom: 8 }}>You did it.</h2>
            <p style={{ color: COLORS.textMid, fontSize: 16, marginBottom: 8 }}>{currentTask}</p>
            <p style={{ color: COLORS.textLight, fontSize: 14, marginBottom: 28, fontStyle: "italic" }}>That took real effort. Seriously.</p>
            <div style={{ background: COLORS.greenLight, borderRadius: 12, padding: "16px", marginBottom: 24 }}>
              <p style={{ color: COLORS.green, fontWeight: 700, fontSize: 18 }}>{completedCount} {completedCount === 1 ? "task" : "tasks"} completed today</p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => { setCurrentTask(null); setEnergy(null); setView("home"); }}
                aria-label="Go back to home and do another task"
                style={{
                  flex: 1, background: COLORS.accent, color: "#fff",
                  border: "none", borderRadius: 12, padding: "14px 0",
                  fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "Georgia, serif",
                }}>Do another →</button>
              <button onClick={() => setView("home")} aria-label="Rest — go back to home without starting another task" style={{
                padding: "14px 18px", background: "none",
                border: `1px solid ${COLORS.warm}`, borderRadius: 12,
                color: COLORS.textLight, cursor: "pointer", fontSize: 14,
              }}>Rest</button>
            </div>
          </div>
        )}
      </main>

      <div style={{
        textAlign: "center", padding: "8px 0 4px",
        fontSize: 11, color: COLORS.textLight,
        display: "flex", justifyContent: "center", gap: 16,
      }}>
        <a href="https://silly-eclair-79f63b.netlify.app" target="_blank"
          style={{ color: COLORS.textLight, textDecoration: "none" }}>Give feedback</a>
        <a href="https://calm-mandazi-d3fa06.netlify.app" target="_blank"
          style={{ color: COLORS.textLight, textDecoration: "none" }}>Privacy & Terms</a>
      </div>

      <nav style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 420,
        background: COLORS.surface, borderTop: `1px solid ${COLORS.warm}`,
        display: "flex", padding: "10px 0 6px",
      }} aria-label="Main navigation">
        {[
          { id: "home", label: "Home", icon: "🏠" },
          { id: "focus", label: "Focus", icon: "🎯", disabled: !currentTask },
          { id: "bad", label: "Help", icon: "🌧" },
        ].map(({ id, label, icon, disabled }) => (
          <button key={id} onClick={() => !disabled && setView(id)}
            aria-label={disabled ? `${label} — not available until you select a task` : label}
            aria-current={view === id ? "page" : undefined}
            disabled={disabled}
            style={{
              flex: 1, background: "none", border: "none", cursor: disabled ? "default" : "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
              padding: "4px 0", opacity: disabled ? 0.3 : 1,
            }}>
            <span style={{ fontSize: 20 }} aria-hidden="true">{icon}</span>
            <span style={{ fontSize: 10, color: view === id ? COLORS.accent : COLORS.textLight, fontWeight: view === id ? 700 : 400 }}>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
