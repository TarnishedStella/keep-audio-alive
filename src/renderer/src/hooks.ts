import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './store'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()


import { useEffect, useRef } from 'react';

/**
 * Custom React Hook that listens to a channel. When a new message arrives `listener` is called with `listener(event, args...)`.
 * @param {string} channel - The name of the channel
 * @param {Function} listener - The handler function
 */
const useIpcListener = (channel: string, listener: (event: any, ...args: any[]) => void) => {
  const savedHandler = useRef(listener);

  useEffect(() => {
    savedHandler.current = listener;
  }, [listener]);

  useEffect(() => {
    const eventHandler = (event: any, ...args: any[]) => savedHandler.current(event, ...args);

    // Access the electron API exposed via contextBridge
    const unsubscribe = window.api.on(channel, eventHandler);

    return () => {
      unsubscribe();
    };
  }, [channel]);
};

export default useIpcListener;
