import { useState, useEffect } from 'react';

export const useAudioRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioData, setAudioData] = useState<number[]>([]);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (isRecording && !mediaRecorder) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          setAudioStream(stream);
          const recorder = new MediaRecorder(stream);
          setMediaRecorder(recorder);
          
          const audioContext = new AudioContext();
          const analyser = audioContext.createAnalyser();
          const source = audioContext.createMediaStreamSource(stream);
          source.connect(analyser);
          
          analyser.fftSize = 256;
          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          
          const updateWaveform = () => {
            if (isRecording) {
              analyser.getByteTimeDomainData(dataArray);
              const normalizedData = Array.from(dataArray).map(v => v / 128 - 1);
              setAudioData(normalizedData);
              requestAnimationFrame(updateWaveform);
            }
          };
          
          updateWaveform();
          recorder.start();
        });
    } else if (!isRecording && mediaRecorder) {
      mediaRecorder.stop();
      audioStream?.getTracks().forEach(track => track.stop());
      setMediaRecorder(null);
      setAudioStream(null);
      setAudioData([]);
    }
  }, [isRecording, mediaRecorder]);

  return { isRecording, setIsRecording, audioData };
};