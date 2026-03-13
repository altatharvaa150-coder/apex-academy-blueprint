import { useState, useMemo } from 'react';
import { useAdmin } from '../context/AdminContext';
import { getTimetable, saveTimetable, getBatches } from '../store/academyData';
import { Clock, CalendarDays, Edit3, X, Plus, Info, Filter } from 'lucide-react';

export default function Timetable() {
  const { isAdmin } = useAdmin();
  const [timetable, setTimetable] = useState(getTimetable());
  const [editingDay, setEditingDay] = useState(null);
  const [draft, setDraft] = useState(null);
  
  // Filtering logic
  const [activeFilter, setActiveFilter] = useState('All');
  const batches = getBatches().filter(b => isAdmin || b.visible);
  
  const filteredTimetable = useMemo(() => {
    if (activeFilter === 'All') return timetable;
    
    // Create a deep copy and filter the slots
    return timetable.map(day => ({
      ...day,
      slots: day.slots.filter(slot => 
        slot.toLowerCase().includes(activeFilter.toLowerCase()) || 
        slot.includes('Doubt') || slot.includes('Test') // Keep general sessions
      )
    }));
  }, [timetable, activeFilter]);

  const openEdit = (entry) => {
    setDraft({ ...entry, slots: [...entry.slots] });
    setEditingDay(entry.day);
  };

  const updateSlot = (idx, val) => {
    const updated = [...draft.slots];
    updated[idx] = val;
    setDraft({ ...draft, slots: updated });
  };

  const addSlot = () => setDraft({ ...draft, slots: [...draft.slots, ''] });
  const removeSlot = (idx) => setDraft({ ...draft, slots: draft.slots.filter((_, i) => i !== idx) });

  const saveEdit = () => {
    const updated = timetable.map(t => t.day === editingDay ? draft : t);
    saveTimetable(updated);
    setTimetable(updated);
    setEditingDay(null);
  };

  return (
    <>
      <section className="timetable-section" id="timetable">
        <div className="container">
          <div className="section-header reveal d-1" style={{ marginBottom: 32 }}>
            <span className="overline">Discipline & Routine</span>
            <h2>Weekly Schedule</h2>
            <p>Structured learning sessions, dedicated doubt-clearing, and rigorous mock tests form the backbone of our program.</p>
          </div>

          <div className="filter-container reveal d-2" style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 48 }}>
            <button 
              className={`filter-btn ${activeFilter === 'All' ? 'active' : ''}`}
              onClick={() => setActiveFilter('All')}
            >
              All Classes
            </button>
            {batches.map(b => (
              <button 
                key={b.id} 
                className={`filter-btn ${activeFilter === b.name ? 'active' : ''}`}
                onClick={() => setActiveFilter(b.name)}
              >
                {b.name}
              </button>
            ))}
          </div>

          <div className="tt-grid reveal d-2">
            {filteredTimetable.map((entry) => (
              <div className="tt-card" key={entry.day}>
                <div className="tt-day">
                  <CalendarDays size={20} strokeWidth={1.5} color="var(--gold-dark)" />
                  {entry.day}
                </div>
                <div className="tt-slots">
                  {entry.slots.length > 0 ? entry.slots.map((slot, si) => (
                    <div className="tt-slot" key={si}>
                      <Clock size={14} color="var(--text-muted)" />
                      {slot}
                    </div>
                  )) : (
                    <div style={{ color: 'var(--text-muted)', fontSize: 13, fontStyle: 'italic', padding: 10 }}>No classes scheduled for this filtered view.</div>
                  )}
                </div>
                {isAdmin && (
                  <button className="admin-edit-action" style={{ marginTop: 16, width: '100%', height: 32 }} onClick={() => openEdit(entry)} title="Edit Day">
                    <Edit3 size={14} /> Edit Schedule
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="tt-note reveal d-3">
            <Info size={20} color="var(--primary)" />
            <span>Schedule is subject to change based on exam proximity. Special revision workshops are announced separately.</span>
          </div>
        </div>
      </section>

      {/* Edit modal */}
      {editingDay && draft && (
        <div className="modal-overlay" onClick={() => setEditingDay(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3><Edit3 size={24} color="var(--primary)" /> Edit {draft.day} Schedule</h3>
            
            <div className="slots-editor" style={{ marginTop: 24, marginBottom: 24 }}>
              {draft.slots.map((slot, i) => (
                <div className="form-group" key={i} style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                  <input
                    value={slot}
                    onChange={e => updateSlot(i, e.target.value)}
                    placeholder="e.g. Physics (8-10 AM)"
                    style={{ flex: 1, marginBottom: 0 }}
                  />
                  <button 
                    onClick={() => removeSlot(i)} 
                    style={{ 
                      background: '#FFF1F2', border: '1px solid #FECDD3', color: '#E11D48', 
                      borderRadius: 4, width: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' 
                    }}
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
            
            <button className="btn btn-outline" onClick={addSlot} style={{ width: '100%', justifyContent: 'center' }}>
              <Plus size={18} /> Add New Slot
            </button>
            
            <div className="modal-actions" style={{ marginTop: 32 }}>
              <button className="btn-cancel" onClick={() => setEditingDay(null)}>Cancel</button>
              <button className="btn-primary" onClick={saveEdit}>Save Schedule</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .timetable-section {
          background: var(--white);
          padding: 120px 0;
          border-bottom: 1px solid var(--border-light);
        }
        .tt-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          margin-bottom: 48px;
        }
        .tt-card {
          background: var(--off-white);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border);
          padding: 24px;
          display: flex;
          flex-direction: column;
          transition: all 0.3s ease;
        }
        .tt-card:hover { 
          transform: translateY(-4px); 
          box-shadow: var(--shadow-sm); 
          border-color: rgba(10, 25, 47, 0.15);
        }
        .tt-day {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          font-weight: 700;
          color: var(--primary);
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .filter-btn {
          background: var(--white);
          border: 1px solid var(--border);
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.02);
        }
        .filter-btn:hover {
          border-color: var(--gold);
          color: var(--primary);
        }
        .filter-btn.active {
          background: var(--primary);
          color: var(--white);
          border-color: var(--primary);
        }
        .tt-slots { display: flex; flex-direction: column; gap: 12px; flex: 1; }
        .tt-slot {
          font-size: 14px;
          color: var(--text-secondary);
          background: var(--white);
          border: 1px solid var(--border-light);
          padding: 10px 14px;
          border-radius: var(--radius);
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .tt-note {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          background: rgba(197, 168, 128, 0.08);
          border: 1px solid rgba(197, 168, 128, 0.3);
          border-radius: var(--radius-lg);
          padding: 20px 24px;
          font-size: 14px;
          color: var(--primary);
          line-height: 1.6;
          font-weight: 500;
        }
        @media (max-width: 1024px) { .tt-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 768px) { .tt-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 500px) { .tt-grid { grid-template-columns: 1fr; } }
      `}</style>
    </>
  );
}
