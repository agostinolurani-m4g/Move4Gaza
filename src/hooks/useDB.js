import { useState, useEffect, useMemo } from 'react';
import { DB_KEY, defaultDB } from '../config.js';

// Local persistence hook storing pledges and registrations in localStorage.
// Provides helper methods to mutate the DB and derived aggregations.
export function useDB() {
  const [db, setDB] = useState(defaultDB);
  // hydrate from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DB_KEY);
      if (raw) setDB(JSON.parse(raw));
    } catch {
      /* ignore parse errors */
    }
  }, []);
  // persist to localStorage when state changes
  useEffect(() => {
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(db));
    } catch {
      /* storage might fail in private mode */
    }
  }, [db]);

  const addPledge = (p) => {
    const id = `plg_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
    const rec = { id, status: "pledged", createdAt: new Date().toISOString(), ...p };
    setDB((d) => ({ ...d, pledges: [rec, ...d.pledges] }));
    return rec;
  };

  const markPledgePaid = (id, reference = "", confirmedAmount) => {
    setDB((d) => ({
      ...d,
      pledges: d.pledges.map((pl) =>
        pl.id === id
          ? {
              ...pl,
              status: "paid",
              paidAt: new Date().toISOString(),
              reference,
              amount: confirmedAmount ?? pl.amount,
            }
          : pl
      ),
    }));
  };

  const addRegistration = (type, rec) => {
    const id = `reg_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
    const record = { id, createdAt: new Date().toISOString(), ...rec };
    setDB((d) => ({
      ...d,
      registrations: { ...d.registrations, [type]: [record, ...d.registrations[type]] },
    }));
    return record;
  };

  const derived = useMemo(() => {
    const raised = db.pledges
      .filter((p) => p.status === "paid")
      .reduce((s, p) => s + (Number(p.amount) || 0), 0);
    const teamsSoccer = new Set(
      db.registrations.soccer.map((t) => (t.teamName || "").trim().toLowerCase())
    ).size;
    const runnersRun = new Set(
      db.registrations.run.map((t) => (t.teamName || "").trim().toLowerCase())
    ).size;
    const riders = db.registrations.bike.length;
    return { raised, teamsSoccer, runnersRun, riders };
  }, [db]);

  return { db, addPledge, markPledgePaid, addRegistration, derived };
}