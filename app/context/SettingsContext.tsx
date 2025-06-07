import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the shape of the context data
interface SettingsContextType {
  difficulty: string;
  setDifficulty: (difficulty: string) => void;
}

// Create the context with a default value
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Define the props for the provider component
interface SettingsProviderProps {
  children: ReactNode;
}

// Create the provider component
export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [difficulty, setDifficulty] = useState<string>('medium'); // Default difficulty

  return (
    <SettingsContext.Provider value={{ difficulty, setDifficulty }}>
      {children}
    </SettingsContext.Provider>
  );
};

// Create a custom hook to use the SettingsContext
export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
