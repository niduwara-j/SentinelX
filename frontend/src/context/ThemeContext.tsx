import { createContext, useContext, ReactNode } from "react";

// SentinelX Version 1 ships with a permanent dark enterprise SOC theme.
// The context provides a stable interface without requiring theme switching.
interface ThemeContextValue {
  theme: "dark";
}

export const ThemeContext = createContext<ThemeContextValue>({ theme: "dark" });

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeContext.Provider value={{ theme: "dark" }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
