import React, { createContext, useContext, useRef } from 'react';

type AudioRefs = Record<string, { current: HTMLAudioElement | null }>;

const AudioContext = createContext<AudioRefs>({});

export const AudioProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const audioRefs = useRef<AudioRefs>({});
  return <AudioContext.Provider value={audioRefs.current}>{children}</AudioContext.Provider>;
};

export const useAudioRefs = (): AudioRefs => useContext(AudioContext);
