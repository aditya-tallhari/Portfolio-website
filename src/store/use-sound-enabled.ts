import { create } from 'zustand';

interface SoundState {
  isSoundEnabled: boolean;
  toggleSound: () => void;
  setSoundEnabled: (enabled: boolean) => void;
}

export const useIsSoundEnabled = create<SoundState>((set) => ({
  isSoundEnabled: true,
  toggleSound: () => set((state) => ({ isSoundEnabled: !state.isSoundEnabled })),
  setSoundEnabled: (enabled: boolean) => set({ isSoundEnabled: enabled }),
}));
