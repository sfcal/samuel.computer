import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AppContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
  mobileMenu: boolean;
  setMobileMenu: (value: boolean) => void;
  activeSection: string;
  setActiveSection: (value: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  const [mobileMenu, setMobileMenu] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <AppContext.Provider value={{
      darkMode,
      toggleDarkMode,
      mobileMenu,
      setMobileMenu,
      activeSection,
      setActiveSection,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};