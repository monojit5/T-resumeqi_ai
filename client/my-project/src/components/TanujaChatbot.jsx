import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ArrowRight, Heart, Minus, Sparkles, Volume2, X } from "lucide-react";

function TanujaChatbot({ onStartHelping }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);
  const [soundNeedsGesture, setSoundNeedsGesture] = useState(false);
  const audioContextRef = useRef(null);

  const playWelcomeSound = async () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) {
      setSoundNeedsGesture(true);
      return;
    }

    try {
      const audioContext = audioContextRef.current || new AudioContext();
      audioContextRef.current = audioContext;

      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }

      if (audioContext.state !== "running") {
        setSoundNeedsGesture(true);
        return;
      }

      const notes = [
        { frequency: 659.25, start: 0 },
        { frequency: 880, start: 0.13 },
      ];

      notes.forEach(({ frequency, start }) => {
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        const noteStart = audioContext.currentTime + start;

        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(frequency, noteStart);
        gain.gain.setValueAtTime(0.0001, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.075, noteStart + 0.025);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 0.32);
        oscillator.connect(gain);
        gain.connect(audioContext.destination);
        oscillator.start(noteStart);
        oscillator.stop(noteStart + 0.34);
      });
      setSoundNeedsGesture(false);
    } catch (error) {
      console.warn("Welcome sound could not be played:", error);
      setSoundNeedsGesture(true);
    }
  };

  useEffect(() => {
    const soundTimer = window.setTimeout(() => {
      void playWelcomeSound();
    }, 0);

    return () => window.clearTimeout(soundTimer);
  }, []);

  const dismissForNow = () => {
    setIsDismissed(true);
  };

  const startHelping = () => {
    setIsOpen(false);
    onStartHelping();
  };

  if (isDismissed) return null;

  return (
    <div className="tanuja-chatbot">
      <AnimatePresence>
        {isOpen && (
          <motion.section
            className="tanuja-welcome-card"
            aria-label="Miss Tanuja resume assistant"
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: [0, -5, 0], scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{
              opacity: { duration: 0.22 },
              scale: { duration: 0.22 },
              y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            }}
            whileHover={{ y: -3 }}
          >
            <header className="tanuja-chat-header">
              <div className="tanuja-chat-title">
                <span className="tanuja-online-indicator"><i /> Online</span>
              </div>
              <button
                className={`tanuja-close-button tanuja-sound-button${soundNeedsGesture ? " needs-gesture" : ""}`}
                type="button"
                aria-label={soundNeedsGesture ? "Enable and play welcome sound" : "Play welcome sound"}
                title={soundNeedsGesture ? "Click to enable welcome sound" : "Play welcome sound"}
                onClick={playWelcomeSound}
              >
                <Volume2 size={18} />
              </button>
              <button
                className="tanuja-close-button"
                type="button"
                aria-label="Minimize chat"
                onClick={() => setIsOpen(false)}
              >
                <Minus size={20} />
              </button>
              <button
                className="tanuja-close-button"
                type="button"
                aria-label="Close chat for now"
                onClick={dismissForNow}
              >
                <X size={20} />
              </button>
            </header>

            <div className="tanuja-chat-body">
              <div className="tanuja-photo" role="img" aria-label="Miss Tanuja, your friendly resume helper" />
              <div className="tanuja-chat-content">
                <div className="tanuja-chat-message">
                  <span className="tanuja-message-sparkle"><Sparkles size={15} /></span>
                  <p>
                    Hi! I&apos;m <strong>Tanuja</strong>. I can help you make your CV stronger.
                  </p>
                  <span className="tanuja-message-prompt">Where would you like to start?</span>
                </div>

                <div className="tanuja-chat-actions">
                  <button className="tanuja-sure-button" type="button" onClick={startHelping}>
                    Sure, let&apos;s go <ArrowRight size={15} />
                  </button>
                  <button className="tanuja-later-button" type="button" onClick={dismissForNow}>
                    Not now
                  </button>
                  <button className="tanuja-later-button" type="button" onClick={() => setIsOpen(false)}>
                    Later <ArrowDown size={14} />
                  </button>
                </div>
                <span className="tanuja-chat-footnote"><Heart size={12} fill="currentColor" /> Here to help you shine</span>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.button
          className="tanuja-chat-launcher"
          type="button"
          aria-label="Open Miss Tanuja chat"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => {
            setIsOpen(true);
            playWelcomeSound();
          }}
        >
          <span className="tanuja-launcher-photo" role="img" aria-label="Miss Tanuja" />
          <span className="tanuja-launcher-heart"><Heart size={11} fill="currentColor" /></span>
        </motion.button>
      )}
    </div>
  );
}

export default TanujaChatbot;
