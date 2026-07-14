import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { AppState } from '../types';
import { initialData } from './initialData';
import { syncBotKnowledge } from '../lib/botSync';

// Keys that are persisted server-side (see SECTIONS in server.ts). `updateState`
// only ever needs to publish the ones that actually changed, so admin saves
// never clobber sections (e.g. `leads`) that this browser's copy is stale on.
// `stats` is deliberately excluded: it's a per-browser visit counter that is
// never published via updateState (only through the local-only effect below),
// so pulling/pushing it here would reset it from the server's stale/zeroed copy.
const SERVER_SECTIONS = [
  'content', 'services', 'prices', 'cases', 'blogPosts',
  'faqItems', 'leads', 'reviews', 'customBlocks', 'leadMagnets',
  'botConfig',
] as const;

interface DataContextType {
  state: AppState;
  updateState: (newState: AppState) => void;
  resetState: () => void;
  addLead: (lead: Omit<AppState['leads'][0], 'id' | 'date'>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  // Per-section revision numbers from the server, used for optimistic
  // concurrency: a save includes the rev it last saw for each section it's
  // touching, so the server can detect (and reject) a write that would
  // silently clobber a change made by another admin/browser in the meantime.
  // A ref, not state — it's write-plumbing, not something that should re-render.
  const revsRef = useRef<Record<string, number>>({});

  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('tarasova_patent_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved); if (parsed?.content?.pricingBlock?.text?.includes("Мои гонорары")) { parsed.content.pricingBlock.text = parsed.content.pricingBlock.text.replace("Мои гонорары фиксируются", "Стоимость услуг фиксируется"); }
        // Ensure all missing root keys from initialData are added to parsed
        for (const key in initialData) {
          if (parsed[key] === undefined) {
            parsed[key] = (initialData as any)[key];
          }
        }
        
        parsed.cases = parsed.cases && parsed.cases.length > 0 ? parsed.cases : initialData.cases;
        parsed.prices = parsed.prices && parsed.prices.length > 0 ? parsed.prices : initialData.prices;
        parsed.reviews = parsed.reviews && parsed.reviews.length > 0 ? parsed.reviews : initialData.reviews;
        parsed.leadMagnets = parsed.leadMagnets && parsed.leadMagnets.length > 0 ? parsed.leadMagnets : initialData.leadMagnets;
        parsed.services = parsed.services && parsed.services.length > 0 ? parsed.services : initialData.services;
        parsed.blogPosts = parsed.blogPosts && parsed.blogPosts.length > 0 ? parsed.blogPosts : initialData.blogPosts;
        
        // Merge missing content keys
        const mergedContent = { ...initialData.content };
        if (parsed.content) {
          for (const key in parsed.content) {
            if (parsed.content[key] !== undefined) {
              (mergedContent as any)[key] = parsed.content[key];
            }
          }
        }
        parsed.content = mergedContent;
        
        parsed.faqItems = parsed.faqItems && parsed.faqItems.length > 0 ? parsed.faqItems : initialData.faqItems;
        
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
    try {
      localStorage.setItem('tarasova_patent_data', JSON.stringify(state));
    } catch (err) {
      console.error("Failed to save state to localStorage. Quota exceeded or other error.", err);
      // Optional: alert the user or implement a fallback
    }
  }, [state]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'tarasova_patent_data' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setState(parsed);
        } catch (err) {
          console.error("Failed to parse cross-tab storage data", err);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    // Pull the server's copy of every section on load, in case this browser's
    // localStorage is stale or empty (new device, cleared cache, incognito).
    // The server is the source of truth for cross-browser sync.
    fetch('/api/data')
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (!data) return;
        const revs = (data as Record<string, unknown>)._revs as Record<string, number> | undefined;
        if (revs) revsRef.current = { ...revsRef.current, ...revs };
        setState(prev => {
          const next: AppState = { ...prev };
          for (const key of SERVER_SECTIONS) {
            const value = (data as Record<string, unknown>)[key];
            if (value !== undefined && value !== null) {
              (next as unknown as Record<string, unknown>)[key] = value;
            }
          }
          return next;
        });
      })
      .catch(err => console.error('Failed to fetch state from server', err));
  }, []);

  const updateState = (newState: AppState) => {
    const syncedState = syncBotKnowledge(newState);
    const previousState = state;
    setState(syncedState);

    // Only publish the sections that actually changed (reference comparison
    // against the previous state, which every admin page produces via
    // `{ ...state, someSection: newValue }`), so a save in one part of the
    // admin never overwrites other sections with this browser's stale copy.
    const changedSections: Record<string, unknown> = {};
    const expectedRevs: Record<string, number> = {};
    for (const key of SERVER_SECTIONS) {
      const before = (previousState as unknown as Record<string, unknown>)[key];
      const after = (syncedState as unknown as Record<string, unknown>)[key];
      if (after !== before) {
        changedSections[key] = after;
        if (revsRef.current[key] !== undefined) expectedRevs[key] = revsRef.current[key];
      }
    }
    if (Object.keys(changedSections).length === 0) return;

    fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...changedSections, _revs: expectedRevs }),
    })
      .then(async (res) => {
        if (res.status === 409) {
          const conflict = await res.json().catch(() => null) as { section?: string; data?: unknown; rev?: number } | null;
          if (conflict?.section) {
            // Someone else saved this section first. Revert this browser's
            // optimistic change for just that section back to the server's
            // current value instead of silently overwriting their save, and
            // tell the admin so they can redo their edit on top of it.
            revsRef.current[conflict.section] = conflict.rev ?? revsRef.current[conflict.section];
            setState(prev => ({ ...prev, [conflict.section as string]: conflict.data }));
            window.alert(
              `Раздел "${conflict.section}" только что был изменён в другом окне/браузере.\n\n` +
              `Ваши последние изменения в этом разделе НЕ сохранены, чтобы не затереть чужие правки. ` +
              `Обновите страницу и внесите изменения заново.`
            );
          }
          return;
        }
        if (res.status === 400) {
          // Request was rejected outright (e.g. a review is missing its
          // required photo) — nothing was written server-side, so revert
          // this browser's optimistic update for the affected sections back
          // to what they were before, instead of showing a "saved" state
          // that never actually landed.
          const err = await res.json().catch(() => null) as { message?: string; reviews?: { id?: string; name?: string }[] } | null;
          setState(prev => {
            const reverted = { ...prev };
            for (const key of Object.keys(changedSections)) {
              (reverted as unknown as Record<string, unknown>)[key] = (previousState as unknown as Record<string, unknown>)[key];
            }
            return reverted;
          });
          const list = err?.reviews?.map(r => r.name || r.id).filter(Boolean).join(', ');
          window.alert(
            (err?.message || 'Сервер отклонил сохранение.') +
            (list ? `\n\nОтзывы без фото: ${list}` : '')
          );
          return;
        }
        if (!res.ok) throw new Error(`Save failed: ${res.status}`);
        const data = await res.json().catch(() => null) as { revs?: Record<string, number> } | null;
        if (data?.revs) revsRef.current = { ...revsRef.current, ...data.revs };
      })
      .catch(err => console.error('Failed to publish changes to server', err));
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
