import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("Insta-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("Insta-theme", theme);
    set({ theme });
  },
}));