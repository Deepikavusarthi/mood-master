
import { create } from "zustand";

export const useProfileDataStore = create((set) => ({
    profile: null,
    setProfile: (profile) => set({ profile }),
    clearProfile: () => set({ profile: null }),

}));

export const useRewardsDataStore = create((set) => ({
    rewards: null,
    setRewards: (rewards) => set({ rewards }),
    clearRewards: () => set({ rewards: null }),
}));

export const useCustomActivitiesDataStore = create((set) => ({
    customActivities: [],
    setCustomActivities: (customActivities) => set({ customActivities }),
    clearCustomActivities: () => set({ customActivities: [] }),
}));

export const useSettingsDataStore = create((set) => ({
    settings: [],
    setSettings: (settings) => set({ settings }),
    clearSettings: () => set({ settings:    [] }),
}));

