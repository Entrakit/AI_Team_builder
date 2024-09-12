import React, { useState } from 'react';
import { Disc, Music } from 'lucide-react';

const Turntable = ({ side }) => (
  <div className="relative w-64 h-64 bg-gray-800 rounded-full flex items-center justify-center">
    <Disc size={200} className="text-gray-600" />
    <div className="absolute w-16 h-16 bg-red-500 rounded-full top-4 right-4"></div>
    <div className="absolute bottom-4 left-4 text-white">{side}</div>
  </div>
);

const Slider = ({ label, value, onChange }) => (
  <div className="flex flex-col items-center">
    <label className="text-sm text-gray-600">{label}</label>
    <input
      type="range"
      min="0"
      max="100"
      value={value}
      onChange={onChange}
      className="w-32 h-2 bg-gray-300 rounded-lg appearance-none"
    />
    <span className="text-xs text-gray-600">{value}</span>
  </div>
);

const BeatPad = ({ color, onClick }) => (
  <button
    className={`w-16 h-16 ${color} rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${color}-500`}
    onClick={onClick}
  ></button>
);

const PianoKey = ({ note, isBlack, onClick }) => (
  <button
    className={`${isBlack ? 'bg-black text-white w-8' : 'bg-white text-black w-12'} h-32 border border-gray-300 focus:outline-none`}
    onClick={() => onClick(note)}
  >
    {note}
  </button>
);

const DJMixerInterface = () => {
  const [leftGain, setLeftGain] = useState(50);
  const [rightGain, setRightGain] = useState(50);
  const [lowEQ, setLowEQ] = useState(50);
  const [midEQ, setMidEQ] = useState(50);
  const [highEQ, setHighEQ] = useState(50);

  const beatPadColors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500',
    'bg-teal-500', 'bg-cyan-500', 'bg-lime-500', 'bg-amber-500',
    'bg-emerald-500', 'bg-fuchsia-500', 'bg-rose-500', 'bg-sky-500'
  ];

  const pianoNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  const playBeat = (color) => {
    console.log(`Playing beat: ${color}`);
  };

  const playNote = (note) => {
    console.log(`Playing note: ${note}`);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">DJ Mixer Interface</h1>
      
      <div className="flex justify-between mb-8">
        <Turntable side="A" />
        <div className="flex flex-col space-y-4">
          <Slider label="Crossfader" value={(leftGain + rightGain) / 2} onChange={(e) => {
            setLeftGain(100 - e.target.value);
            setRightGain(e.target.value);
          }} />
          <Slider label="Low EQ" value={lowEQ} onChange={(e) => setLowEQ(e.target.value)} />
          <Slider label="Mid EQ" value={midEQ} onChange={(e) => setMidEQ(e.target.value)} />
          <Slider label="High EQ" value={highEQ} onChange={(e) => setHighEQ(e.target.value)} />
        </div>
        <Turntable side="B" />
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Beat Pads</h2>
        <div className="grid grid-cols-4 gap-4">
          {beatPadColors.map((color, index) => (
            <BeatPad key={index} color={color} onClick={() => playBeat(color)} />
          ))}
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mb-4">Chord Maker</h2>
        <div className="flex">
          {pianoNotes.map((note, index) => (
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

