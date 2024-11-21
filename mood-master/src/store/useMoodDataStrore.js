import { create } from "zustand";

export const useMoodDataStore = create((set) => ({
    moodData: null,
    setMoodData: (moodData) => set({ moodData }),
    clearMoodData: () => set({ moodData: null }),
}));


