import { create } from 'zustand';

const storedCreateMood = localStorage.getItem('createMood');
const initialCreateMood = storedCreateMood ? JSON.parse(storedCreateMood) : {activities: [],journal: [],date: new Date().toISOString()};

export const useCreateMoodStore = create((set) => ({
    createMood: initialCreateMood,
    setCreateMood: (newCreateMood) => {
        localStorage.setItem('createMood', JSON.stringify(newCreateMood));
        set({ createMood: newCreateMood });
    },
    clearCreateMood: () => {
        localStorage.setItem('createMood', JSON.stringify({activities: [],journal: []}));
        set({ createMood: {activities: [],journal: []} });
    },
}));