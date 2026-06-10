import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AppState } from '../types';
import { initialData } from './initialData';

interface DataContextType {
  state: AppState;
  updateState: (newState: AppState) => void;
  resetState: () => void;
  addLead: (lead: Omit<AppState['leads'][0], 'id' | 'date'>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('tarasova_patent_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        parsed.cases = initialData.cases;
        parsed.prices = initialData.prices;
        parsed.reviews = initialData.reviews;
        parsed.leadMagnets = initialData.leadMagnets;
        return parsed;
      } catch (e) {
        return initialData;
      }
    }
    return initialData;
  });

  useEffect(() => {
    localStorage.setItem('tarasova_patent_data', JSON.stringify(state));
  }, [state]);

  const updateState = (newState: AppState) => {
    setState(newState);
  };

  const resetState = () => {
    setState(initialData);
  };

  const addLead = (leadData: Omit<AppState['leads'][0], 'id' | 'date'>) => {
    const newLead = {
      ...leadData,
      id: Math.random().toString(36).substring(2, 9),
      date: new Date().toISOString()
    };
    setState(prev => ({
      ...prev,
      leads: [newLead, ...prev.leads]
    }));
  };

  return (
    <DataContext.Provider value={{ state, updateState, resetState, addLead }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
