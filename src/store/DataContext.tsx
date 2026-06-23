import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
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
  const [isLoaded, setIsLoaded] = useState(false);
  const saveTimeout = useRef<ReturnType<typeof setTimeout>>();

  // Load data from the server on first mount.
  useEffect(() => {
    fetch('/api/data')
      .then((res) => (res.ok ? res.json() : Promise.reject(res.statusText)))
      .then((data: Partial<AppState>) => {
        setState((prev) => ({ ...prev, ...data }));
      })
      .catch((e) => {
        console.warn('Не удалось загрузить данные с сервера, использую дефолтные:', e);
      })
      .finally(() => setIsLoaded(true));
  }, []);

  // Record visit stats once data is loaded.
  useEffect(() => {
    if (!isLoaded) return;
    const today = new Date().toISOString().split('T')[0];
    setState((prev) => {
      const currentStats = prev.stats || {
        totalVisits: 0,
        todayVisits: 0,
        lastVisitDate: today,
        viewsHistory: []
      };

      const isNewDay = currentStats.lastVisitDate !== today;
      let newHistory = [...(currentStats.viewsHistory || [])];

      if (isNewDay && currentStats.todayVisits > 0) {
        const lastDateInHistory = newHistory.length > 0 ? newHistory[newHistory.length - 1].date : null;
        if (lastDateInHistory !== currentStats.lastVisitDate) {
          newHistory.push({ date: currentStats.lastVisitDate, visits: currentStats.todayVisits });
        }
      }

      return {
        ...prev,
        stats: {
          totalVisits: currentStats.totalVisits + 1,
          todayVisits: isNewDay ? 1 : currentStats.todayVisits + 1,
          lastVisitDate: today,
          viewsHistory: newHistory
        }
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  // Persist to the server (debounced) whenever state changes after load.
  useEffect(() => {
    if (!isLoaded) return;
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state),
      }).catch((e) => console.warn('Не удалось сохранить данные на сервере:', e));
    }, 500);
    return () => clearTimeout(saveTimeout.current);
  }, [state, isLoaded]);

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
    <DataContext.Provider value={{ state, updateState, resetState, addLead, isLoaded }}>
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
