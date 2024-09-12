import React, { useState, useEffect, useCallback } from 'react';
import { Disc } from 'lucide-react';

// Assume we have these audio file paths
const beatSamples = {
  'bg-red-500': '/path/to/kick.wav',
  'bg-blue-500': '/path/to/snare.wav',
  'bg-green-500': '/path/to/hihat.wav',
  'bg-yellow-500': '/path/to/clap.wav',
  // Add more as needed
};

const pianoSamples = {
  'C': '/path/to/piano_C.mid',
  'D': '/path/to/piano_D.mid',
  'E': '/path/to/piano_E.mid',
  // Add more notes
};

const BeatPad = ({ color, onClick }) => (
  <button
    className={`w-16 h-16 ${color} rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${color}-500`}
    onClick={onClick}
  ></button>
);

const PianoKey = ({ note, isBlack, onClick }) => (
  <button
    className={`${
      isBlack 
        ? 'bg-black text-white w-8 h-20 -mx-4 z-10' 
        : 'bg-white text-black w-12 h-32'
    } relative border border-gray-300 focus:outline-none hover:bg-gray-100`}
    onClick={() => onClick(note)}
  >
    <span className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs">
      {note}
    </span>
  </button>
);

const DJMixerInterface = () => {
  const [audioContext, setAudioContext] = useState(null);
  const [audioBuffers, setAudioBuffers] = useState({});

  useEffect(() => {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    setAudioContext(context);

    // Load all audio samples
    const loadSample = async (path) => {
      const response = await fetch(path);
      const arrayBuffer = await response.arrayBuffer();
      return await context.decodeAudioData(arrayBuffer);
    };

    const loadAllSamples = async () => {
      const beatBuffers = await Promise.all(
        Object.entries(beatSamples).map(async ([color, path]) => [color, await loadSample(path)])
      );
      const pianoBuffers = await Promise.all(
        Object.entries(pianoSamples).map(async ([note, path]) => [note, await loadSample(path)])
      );
      setAudioBuffers(Object.fromEntries([...beatBuffers, ...pianoBuffers]));
    };

    loadAllSamples();
  }, []);

  const playSample = useCallback((buffer) => {
    if (!audioContext || !buffer) return;

    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start();
  }, [audioContext]);

  const playBeat = (color) => {
    console.log(`Playing beat: ${color}`);
    playSample(audioBuffers[color]);
  };

  const playNote = (note) => {
    console.log(`Playing note: ${note}`);
    playSample(audioBuffers[note]);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">DJ Mixer Interface</h1>
      
      {/* Turntables and Sliders section would go here */}
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Beat Pads</h2>
        <div className="grid grid-cols-4 gap-4">
          {Object.keys(beatSamples).map((color, index) => (
            <BeatPad key={index} color={color} onClick={() => playBeat(color)} />
          ))}
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mb-4">Piano</h2>
        <div className="flex relative">
          {Object.keys(pianoSamples).map((note, index) => (
            <PianoKey
              key={index}
              note={note}
              isBlack={note.includes('#')}
              onClick={playNote}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DJMixerInterface;

