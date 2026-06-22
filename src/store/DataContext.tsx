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
        
        // Merge missing content keys
        const mergedContent = { ...initialData.content };
        if (parsed.content) {
          for (const key in parsed.content) {
            if (parsed.content[key] !== undefined) {
              (mergedContent as any)[key] = parsed.content[key];
            }
          }
          // Force fix for badges: if they had exactly 3, add the 4th back in
          if (mergedContent.badges && mergedContent.badges.length === 3) {
            mergedContent.badges = initialData.content.badges;
          }
        }
        parsed.content = mergedContent;
        
        // Restore the full FAQ list since user requested all original questions back
        if (!parsed.faqItems || parsed.faqItems.length < 15) {
          parsed.faqItems = initialData.faqItems;
        }
        
        // Ensure stats exists
        if (!parsed.stats) {
          parsed.stats = {
            totalVisits: 0,
            todayVisits: 0,
            lastVisitDate: new Date().toISOString().split('T')[0],
            viewsHistory: []
          };
        }
        
        return parsed;
      } catch (e) {
        return initialData;
      }
    }
    return initialData;
  });

  useEffect(() => {
    // Record visit on mount
    const today = new Date().toISOString().split('T')[0];
    setState(prev => {
      const currentStats = prev.stats || {
        totalVisits: 0,
        todayVisits: 0,
        lastVisitDate: today,
        viewsHistory: []
      };

      const isNewDay = currentStats.lastVisitDate !== today;
      let newHistory = [...(currentStats.viewsHistory || [])];
      
      if (isNewDay && currentStats.todayVisits > 0) {
        // Save yesterday's stats if it wasn't saved already
        const lastDateInHistory = newHistory.length > 0 ? newHistory[newHistory.length - 1].date : null;
        if (lastDateInHistory !== currentStats.lastVisitDate) {
          newHistory.push({ date: currentStats.lastVisitDate, visits: currentStats.todayVisits });
          // keep last 7 days optionally
        }
      }

      // Check if today already exists in history and we just need to update it? 
      // Actually, we can just push yesterday, and today is tracked in todayVisits.

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
  }, []);

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
