import { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
import { AppState } from '../types';
import { initialData } from './initialData';

interface DataContextType {
  state: AppState;
  updateState: (newState: AppState) => void;
  resetState: () => void;
  addLead: (lead: Omit<AppState['leads'][0], 'id' | 'date'>) => void;
  isLoaded: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialData);
  const [loaded, setLoaded] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Загрузка данных с сервера при старте
  useEffect(() => {
    fetch('/api/data')
      .then(r => r.json())
      .then(data => {
        const merged = { ...initialData };
        for (const key in data) {
          if (data[key] !== null && data[key] !== undefined) {
            (merged as any)[key] = data[key];
          }
        }
        setState(merged);
        setLoaded(true);
      })
      .catch(() => {
        // Fallback на localStorage если сервер недоступен
        const saved = localStorage.getItem('tarasova_patent_data');
        if (saved) {
          try { setState(JSON.parse(saved)); } catch {}
        }
        setLoaded(true);
      });
  }, []);

  // Сохранение на сервер с debounce 500ms
  useEffect(() => {
    if (!loaded) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state),
      }).catch(() => {
        // Fallback на localStorage
        try {
          localStorage.setItem('tarasova_patent_data', JSON.stringify(state));
        } catch {}
      });
    }, 500);
  }, [state, loaded]);

  const updateState = (newState: AppState) => setState(newState);

  const resetState = () => setState(initialData);

  const addLead = (leadData: Omit<AppState['leads'][0], 'id' | 'date'>) => {
    const newLead = {
      ...leadData,
      id: Math.random().toString(36).substring(2, 9),
      date: new Date().toISOString()
    };
    setState(prev => ({ ...prev, leads: [newLead, ...prev.leads] }));
  };

  return (
    <DataContext.Provider value={{ state, updateState, resetState, addLead, isLoaded: loaded }}>
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