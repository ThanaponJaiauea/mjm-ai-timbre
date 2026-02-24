"use client";
import React, { createContext, useContext, useState, useCallback } from "react";
import * as Tone from "tone";

interface PlaybackContextType {
  playingInstance: Tone.GrainPlayer | null;
  setPlayingInstance: (instance: Tone.GrainPlayer | null) => void;
}

const PlaybackContext = createContext<PlaybackContextType>({
  playingInstance: null,
  setPlayingInstance: () => {},
});

export const usePlayback = () => useContext(PlaybackContext);

export const PlaybackProvider = ({ children }: { children: React.ReactNode }) => {
  const [playingInstance, setPlayingInstance] = useState<Tone.GrainPlayer | null>(null);

  const setInstance = useCallback(
    (instance: Tone.GrainPlayer | null) => {
      if (playingInstance && playingInstance !== instance) {
        playingInstance.stop();
      }
      setPlayingInstance(instance);
    },
    [playingInstance]
  );

  return (
    <PlaybackContext.Provider value={{ playingInstance, setPlayingInstance: setInstance }}>
      {children}
    </PlaybackContext.Provider>
  );
};
