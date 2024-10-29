import React, { useState, useCallback } from 'react';
import { Activity, Mic, RefreshCw } from 'lucide-react';
import { Stars } from './components/Stars';
import { Waveform } from './components/Waveform';
import { useAudioRecording } from './hooks/useAudioRecording';

const App = () => {
  const [countdown, setCountdown] = useState(null);
  const [iconsVisible, setIconsVisible] = useState(true);
  const [showDoneResume, setShowDoneResume] = useState(false);
  const { isRecording, setIsRecording, audioData } = useAudioRecording();

  const startRecording = useCallback(() => {
    let count = 3;
    setCountdown(count);
    setIconsVisible(false);
    setShowDoneResume(false);

    const countdownInterval = setInterval(() => {
      count--;
      if (count > 0) {
        setCountdown(count);
      } else {
        clearInterval(countdownInterval);
        setCountdown(null);
        setIsRecording(true);
      }
    }, 1000);
  }, [setIsRecording]);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
    setShowDoneResume(true);
    setIconsVisible(false);
  }, [setIsRecording]);

  const resumeRecording = useCallback(() => {
    setIsRecording(true);
    setShowDoneResume(false);
    setIconsVisible(false);
  }, [setIsRecording]);

  const handleDone = useCallback(() => {
    setShowDoneResume(false);
    setIconsVisible(true);
    // Add any additional done functionality here
  }, []);


  return (
    <div className="relative min-h-screen bg-[#1f2937] overflow-hidden">
      <Stars />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center">
        <div className="absolute top-8 text-white/80 text-xl font-light tracking-wider">
          Babble
        </div>

        {/* Center content */}
        {showDoneResume ? (
          <div className="flex gap-8">
            {/* Done button */}
            <button
              onClick={handleDone}
              className="w-32 h-32 rounded-full bg-white flex items-center justify-center transition-all hover:scale-105"
            >
              <span className="text-[#1f2937]/70 text-lg font-light">Done</span>
            </button>

            {/* Resume button */}
            <button
              onClick={resumeRecording}
              className="w-24 h-24 rounded-full bg-[#D4A373] flex items-center justify-center transition-all hover:scale-105"
            >
              <span className="text-black text-lg font-light">Resume</span>
            </button>
          </div>
        ) : (
          <div className="relative">
            <button
              onClick={!isRecording ? startRecording : stopRecording}
              className="w-48 h-48 rounded-full bg-white flex items-center justify-center transition-all hover:scale-105"
            >
              <span className="text-[#1f2937] text-2xl font-light tracking-wider">
                {countdown ? countdown : isRecording ? 'Stop' : 'Babble'}
              </span>
            </button>

            {/* Refresh icon when recording */}
            {isRecording && (
              <button
                onClick={!isRecording ? startRecording : stopRecording}
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-20 w-12 h-12 rounded-full bg-[#D4A373] flex items-center justify-center text-white transition-all hover:bg-[#D4A373]/80"
              >
                <RefreshCw size={20} />
              </button>
            )}
          </div>
        )}

        {/* Waveform */}
        {isRecording && <Waveform audioData={audioData} />}

        {/* Bottom icons */}
        {iconsVisible && (
          <div className="absolute bottom-12 flex gap-6">
            <button className="w-12 h-12 rounded-full bg-[#1f2937] border border-[#D4A373] flex items-center justify-center text-[#D4A373] transition-all hover:bg-[#D4A373] hover:text-white">
              <Activity size={20} />
            </button>
            <button className="w-12 h-12 rounded-full bg-[#1f2937] border border-[#D4A373] flex items-center justify-center text-[#D4A373] transition-all hover:bg-[#D4A373] hover:text-white">
              <Mic size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
