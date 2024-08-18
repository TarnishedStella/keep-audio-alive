import React, { createContext, useContext, useRef } from 'react';

const AudioContext = createContext<{ [key: string]: { current: HTMLAudioElement | null } }>({});

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const audioRefs = useRef<{ [key: string]: { current: HTMLAudioElement | null } }>({});
  return <AudioContext.Provider value={audioRefs.current}>{children}</AudioContext.Provider>;
};

export const useAudioRefs = () => useContext(AudioContext);
