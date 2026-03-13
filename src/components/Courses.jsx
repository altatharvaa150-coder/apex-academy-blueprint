import { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { getBatches, saveBatches } from '../store/academyData';
import { Users, Calendar, Banknote, Edit3, EyeOff, Eye, Trash2, Plus, ArrowRight } from 'lucide-react';

const EMPTY_BATCH = {
  id: Date.now(),
  name: '', description: '',
  seats: 20, startDate: '',
  monthlyFee: '', yearlyFee: '',
  visible: true, tag: 'New Admission',
};

export default function Courses() {
  const { isAdmin } = useAdmin();
  const [batches, setBatches] = useState(getBatches());
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newBatch, setNewBatch] = useState({ ...EMPTY_BATCH });
  const [pricingMode, setPricingMode] = useState('yearly'); // 'monthly' | 'yearly'

  const displayed = isAdmin ? batches : batches.filter(b => b.visible);

  const openEdit = (b) => { setDraft({ ...b }); setEditingId(b.id); };
  const saveEdit = () => {
    const updated = batches.map(b => b.id === editingId ? draft : b);
    saveBatches(updated);
    setBatches(updated);
    setEditingId(null);
  };

  const toggleVisible = (id) => {
    const updated = batches.map(b => b.id === id ? { ...b, visible: !b.visible } : b);
    saveBatches(updated);
    setBatches(updated);
  };

  const deleteBatch = (id) => {
    const updated = batches.filter(b => b.id !== id);
    saveBatches(updated);
    setBatches(updated);
  };

  const addBatch = () => {
    const updated = [...batches, { ...newBatch, id: Date.now() }];
    saveBatches(updated);
    setBatches(updated);
    setShowAdd(false);
    setNewBatch({ ...EMPTY_BATCH });
  };

  return (
    <>
      <section className="courses-section" id="courses">
        <div className="container">
          <div className="section-header reveal d-1">
            <span className="overline">Academic Programs</span>
            <h2>Structured for Success</h2>
            <p>Our courses are crafted by IITians, designed for deep conceptual clarity and rigorous practice. Small batches ensure personalized attention.</p>
          </div>

          {/* Pricing toggle */}
          <div className="pricing-toggle-wrap reveal d-1">
            <span className={pricingMode === 'monthly' ? 'active' : ''} onClick={() => setPricingMode('monthly')}>Monthly</span>
            <button
              className={`toggle-switch ${pricingMode === 'yearly' ? 'on' : ''}`}
              onClick={() => setPricingMode(p => p === 'yearly' ? 'monthly' : 'yearly')}
              aria-label="Toggle pricing"
            >
              <span className="toggle-thumb" />
            </button>
            <span className={pricingMode === 'yearly' ? 'active' : ''} onClick={() => setPricingMode('yearly')}>
              Yearly <em className="save-badge">Save up to 10%</em>
            </span>
          </div>

          {isAdmin && (
            <div style={{ textAlign: 'center', marginBottom: 40 }} className="reveal d-2">
              <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
                <Plus size={18} /> Add New Program
              </button>
            </div>
          )}

          <div className="batches-grid reveal d-2">
            {displayed.map(b => (
              <div key={b.id} className={`batch-card ${!b.visible && isAdmin ? 'batch-hidden' : ''}`}>
                {b.tag && <div className="batch-tag">{b.tag}</div>}
                {!b.visible && isAdmin && (
                  <div className="hidden-badge"><EyeOff size={12} /> Hidden from Public</div>
                )}

                <h3 className="batch-name">{b.name}</h3>
                <p className="batch-desc">{b.description}</p>

                <div className="batch-meta">
                  <div className="meta-item"><Calendar size={16} color="var(--primary)" /> <span>{b.startDate}</span></div>
                  <div className="meta-item fee-item">
                    <Banknote size={16} color="var(--primary)" />
                    <span>{pricingMode === 'monthly' ? (b.monthlyFee || b.yearlyFee) : (b.yearlyFee || b.monthlyFee)}</span>
                  </div>
                  <div className="meta-item"><Users size={16} color="var(--primary)" /> <span>{b.seats} Seats Left</span></div>
                </div>

                <div className="batch-actions">
                  {!isAdmin && (
                    <a
                      href="#contact"
                      onClick={() => {
                        const price = pricingMode === 'monthly' ? (b.monthlyFee || b.yearlyFee) : (b.yearlyFee || b.monthlyFee);
                        sessionStorage.setItem('enquiryCourse', `${b.name} — ${price}`);
                        window.dispatchEvent(new Event('courseSelected'));
                      }}
                      className="btn btn-outline"
                      style={{ display: 'flex', width: '100%', justifyContent: 'space-between', textDecoration: 'none' }}
                    >
                      Enquire Program <ArrowRight size={18} />
                    </a>
                  )}
                  {isAdmin && (
                    <div className="admin-batch-actions">
                      <button className="admin-edit-action" onClick={() => openEdit(b)} title="Edit"><Edit3 size={16} /></button>
                      <button className="admin-edit-action" onClick={() => toggleVisible(b.id)} title="Toggle Visibility">
                        {b.visible ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button className="admin-edit-action delete" onClick={() => deleteBatch(b.id)} title="Delete"><Trash2 size={16} /></button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Edit Batch Modal */}
      {editingId && draft && (
        <div className="modal-overlay" onClick={() => setEditingId(null)}>
          <div className="modal" style={{ maxWidth: 640 }} onClick={e => e.stopPropagation()}>
            <h3><Edit3 size={24} color="var(--primary)" /> Edit Program Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label>Program Name</label>
                <input value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} />
              </div>
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label>Tag (e.g. Most Popular)</label>
                <input value={draft.tag} onChange={e => setDraft({ ...draft, tag: e.target.value })} />
              </div>
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label>Description</label>
                <textarea value={draft.description} onChange={e => setDraft({ ...draft, description: e.target.value })} rows={3} />
              </div>
              <div className="form-group">
                <label>Seats Left</label>
                <input type="number" value={draft.seats} onChange={e => setDraft({ ...draft, seats: +e.target.value })} />
              </div>
              <div className="form-group">
                <label>Start Date</label>
                <input value={draft.startDate} onChange={e => setDraft({ ...draft, startDate: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Monthly Fee (e.g. ₹7,500/mo)</label>
                <input value={draft.monthlyFee || ''} onChange={e => setDraft({ ...draft, monthlyFee: e.target.value })} placeholder="₹7,500/mo" />
              </div>
              <div className="form-group">
                <label>Yearly Fee (e.g. ₹80,000/yr)</label>
                <input value={draft.yearlyFee || ''} onChange={e => setDraft({ ...draft, yearlyFee: e.target.value })} placeholder="₹80,000/yr" />
              </div>
            </div>
            <div className="modal-actions" style={{ marginTop: 32 }}>
              <button className="btn-cancel" onClick={() => setEditingId(null)}>Cancel</button>
              <button className="btn-primary" onClick={saveEdit}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Batch Modal */}
      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal" style={{ maxWidth: 640 }} onClick={e => e.stopPropagation()}>
            <h3><Plus size={24} color="var(--primary)" /> Add New Program</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label>Program Name</label>
                <input value={newBatch.name} onChange={e => setNewBatch({ ...newBatch, name: e.target.value })} placeholder="e.g. VITEEE Intensive" />
              </div>
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label>Tag</label>
                <input value={newBatch.tag} onChange={e => setNewBatch({ ...newBatch, tag: e.target.value })} placeholder="e.g. New Admission" />
              </div>
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label>Description</label>
                <textarea value={newBatch.description} onChange={e => setNewBatch({ ...newBatch, description: e.target.value })} rows={3} />
              </div>
              <div className="form-group">
                <label>Seats Available</label>
                <input type="number" value={newBatch.seats} onChange={e => setNewBatch({ ...newBatch, seats: +e.target.value })} />
              </div>
              <div className="form-group">
                <label>Start Date</label>
                <input value={newBatch.startDate} onChange={e => setNewBatch({ ...newBatch, startDate: e.target.value })} placeholder="April 2026" />
              </div>
              <div className="form-group">
                <label>Monthly Fee</label>
                <input value={newBatch.monthlyFee || ''} onChange={e => setNewBatch({ ...newBatch, monthlyFee: e.target.value })} placeholder="₹7,500/mo" />
              </div>
              <div className="form-group">
                <label>Yearly Fee</label>
                <input value={newBatch.yearlyFee || ''} onChange={e => setNewBatch({ ...newBatch, yearlyFee: e.target.value })} placeholder="₹80,000/yr" />
              </div>
            </div>
            <div className="modal-actions" style={{ marginTop: 32 }}>
              <button className="btn-cancel" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="btn-primary" onClick={addBatch}>Create Program</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .courses-section { background: var(--white); padding: 120px 0; }
        
        /* Pricing Toggle */
        .pricing-toggle-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-bottom: 56px;
          font-size: 15px;
          color: var(--text-secondary);
          font-weight: 600;
        }
        .pricing-toggle-wrap span { cursor: pointer; transition: color 0.2s; }
        .pricing-toggle-wrap span.active { color: var(--primary); }
        .toggle-switch {
          width: 52px; height: 28px;
          background: var(--border);
          border: none;
          border-radius: 14px;
          position: relative;
          cursor: pointer;
          transition: background 0.3s;
          padding: 0;
        }
        .toggle-switch.on { background: var(--primary); }
        .toggle-thumb {
          position: absolute;
          top: 3px; left: 3px;
          width: 22px; height: 22px;
          background: white;
          border-radius: 50%;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          display: block;
        }
        .toggle-switch.on .toggle-thumb { transform: translateX(24px); }
        .save-badge {
          display: inline-block;
          background: rgba(197,168,128,0.15);
          color: var(--gold-dark);
          border: 1px solid rgba(197,168,128,0.3);
          font-size: 11px;
          font-weight: 700;
          font-style: normal;
          padding: 2px 8px;
          border-radius: 4px;
          margin-left: 6px;
          letter-spacing: 0.3px;
        }

        /* Batch cards */
        .batches-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
        .batch-card {
          background: var(--white);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border);
          padding: 40px 32px;
          box-shadow: var(--shadow-sm);
          position: relative;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex; flex-direction: column;
        }
        .batch-card:hover { transform: translateY(-8px); box-shadow: var(--shadow-lg); border-color: rgba(10, 25, 47, 0.15); }
        .batch-hidden { opacity: 0.6; }
        .batch-tag {
          position: absolute; top: -12px; left: 32px;
          background: var(--primary);
          color: var(--white); font-size: 11px; font-weight: 700;
          letter-spacing: 1px; text-transform: uppercase;
          padding: 6px 12px; border-radius: 4px;
          box-shadow: 0 4px 12px rgba(10, 25, 47, 0.2);
        }
        .hidden-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: #FEF2F2; color: #E11D48;
          font-size: 11px; font-weight: 700; text-transform: uppercase;
          padding: 6px 10px; border-radius: 4px; margin-bottom: 16px;
          border: 1px solid #FECDD3; align-self: flex-start;
        }
        .batch-name { font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 700; color: var(--primary); margin-bottom: 16px; margin-top: 12px; line-height: 1.2; }
        .batch-desc { font-size: 15px; color: var(--text-secondary); line-height: 1.6; margin-bottom: 32px; flex: 1; }
        .batch-meta { display: flex; flex-direction: column; gap: 12px; margin-bottom: 32px; padding-top: 24px; border-top: 1px solid var(--border-light); }
        .meta-item { display: flex; align-items: center; gap: 12px; font-size: 14px; color: var(--text-primary); font-weight: 600; }
        .fee-item span { color: var(--primary); font-size: 16px; }
        .batch-actions { margin-top: auto; }
        .admin-batch-actions { display: flex; gap: 8px; background: var(--bg-subtle); padding: 8px; border-radius: 6px; justify-content: center; }
        .admin-edit-action {
          background: var(--white); border: 1px solid var(--border); border-radius: 4px;
          width: 36px; height: 36px;
          display: flex; align-items: center; justify-content: center;
          color: var(--text-secondary); transition: all 0.2s; cursor: pointer;
        }
        .admin-edit-action:hover { color: var(--primary); border-color: var(--border-dark); box-shadow: var(--shadow-sm); }
        .admin-edit-action.delete:hover { color: #E11D48; border-color: #FECDD3; background: #FFF1F2; }
        @media (max-width: 1024px) { .batches-grid { grid-template-columns: repeat(2, 1fr); gap: 24px; } }
        @media (max-width: 640px) { .batches-grid { grid-template-columns: 1fr; } .batch-card { padding: 32px 24px; } }
      `}</style>
    </>
  );
}
