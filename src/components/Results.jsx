import { useState, useRef } from 'react';
import { useAdmin } from '../context/AdminContext';
import { getToppers, saveToppers } from '../store/academyData';
import { Trophy, Image as ImageIcon, Camera, Edit3, Trash2, Plus, Star, EyeOff, Eye } from 'lucide-react';

const EMPTY_TOPPER = { id: Date.now(), name: '', score: '', exam: '', year: new Date().getFullYear().toString(), rank: '', photo: '/topper_default.png', visible: true };

export default function Results() {
  const { isAdmin } = useAdmin();
  const [toppers, setToppers] = useState(getToppers());
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(null);
  const [adding, setAdding] = useState(false);
  const [newT, setNewT] = useState({ ...EMPTY_TOPPER });
  const fileRef = useRef();
  const addFileRef = useRef();

  const openEdit = (t) => { setDraft({ ...t }); setEditingId(t.id); };

  const handlePhotoChange = (file, setter) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setter(d => ({ ...d, photo: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const saveEdit = () => {
    const updated = toppers.map(t => t.id === editingId ? draft : t);
    saveToppers(updated);
    setToppers(updated);
    setEditingId(null);
  };

  const deleteTopper = (id) => {
    const updated = toppers.filter(t => t.id !== id);
    saveToppers(updated);
    setToppers(updated);
  };

  const toggleVisible = (id) => {
    const updated = toppers.map(t => t.id === id ? { ...t, visible: !t.visible } : t);
    saveToppers(updated);
    setToppers(updated);
  };

  const addTopper = () => {
    const updated = [{ ...newT, id: Date.now() }, ...toppers];
    saveToppers(updated);
    setToppers(updated);
    setAdding(false);
    setNewT({ ...EMPTY_TOPPER });
  };

  // Visible toppers for the public (admin sees all)
  const displayed = isAdmin ? toppers : toppers.filter(t => t.visible !== false);

  return (
    <>
      <section className="results-section" id="results">
        <div className="container">
          <div className="section-header reveal d-1">
            <span className="overline">Hall of Fame</span>
            <h2>Our Top Achievers</h2>
            <p>Real students. Real results. Every topper is a testament to the power of structured, small-batch coaching.</p>
          </div>

          {isAdmin && (
            <div style={{ textAlign: 'center', marginBottom: 40 }} className="reveal d-2">
              <button className="btn btn-gold" onClick={() => setAdding(true)}>
                <Plus size={18} color="var(--primary-dark)" /> Add New Achiever
              </button>
            </div>
          )}

          <div className="toppers-grid reveal d-2">
            {displayed.map((t, i) => (
              <div className={`topper-card ${i === 0 ? 'topper-card--featured' : ''} ${t.visible === false ? 'topper-hidden' : ''}`} key={t.id}>
                {i === 0 && (
                  <div className="featured-badge">
                    <Trophy size={16} color="var(--gold-dark)" />
                    RANK #1
                  </div>
                )}
                {!t.visible && isAdmin && (
                  <div className="topper-hidden-label"><EyeOff size={12} /> Hidden</div>
                )}
                
                <div className="topper-content-wrap">
                  <div className="topper-photo-wrap">
                    <img src={t.photo} alt={t.name} className="topper-photo" />
                    <div className="topper-score-badge">{t.score}</div>
                  </div>
                  
                  <div className="topper-info">
                    <h4 className="topper-name">{t.name}</h4>
                    <div className="topper-exam">
                      <Star size={12} fill="var(--gold)" color="var(--gold)" />
                      {t.exam} · {t.year}
                    </div>
                    <div className="topper-rank">{t.rank}</div>
                  </div>
                </div>

                {isAdmin && (
                  <div className="topper-admin-actions">
                    <button className="admin-edit-action" onClick={() => openEdit(t)} title="Edit">
                      <Edit3 size={16} />
                    </button>
                    <button className="admin-edit-action" onClick={() => toggleVisible(t.id)} title={t.visible === false ? 'Show' : 'Hide'}>
                      {t.visible === false ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    <button className="admin-edit-action delete" onClick={() => deleteTopper(t.id)} title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Edit Topper Modal */}
      {editingId && draft && (
        <div className="modal-overlay" onClick={() => setEditingId(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3><Edit3 size={24} color="var(--primary)" /> Edit Achiever</h3>
            
            <div className="photo-upload-section">
              <img src={draft.photo} alt="preview" className="photo-preview" />
              <div>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handlePhotoChange(e.target.files[0], setDraft)} />
                <button className="btn btn-outline" onClick={() => fileRef.current.click()}>
                  <Camera size={16} /> Upload New Portrait
                </button>
                <button
                  className="btn btn-outline"
                  style={{ marginLeft: 8, borderColor: '#FECDD3', color: '#E11D48' }}
                  onClick={() => setDraft({ ...draft, photo: '' })}
                >
                  <EyeOff size={16} /> No Photo
                </button>
              </div>
            </div>

            <div className="form-group"><label>Student Name</label><input value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} /></div>
            <div className="form-group"><label>Score / Percentile</label><input value={draft.score} onChange={e => setDraft({ ...draft, score: e.target.value })} placeholder="e.g. 99.2%ile or 96.5%" /></div>
            <div className="form-group"><label>Exam</label><input value={draft.exam} onChange={e => setDraft({ ...draft, exam: e.target.value })} /></div>
            <div className="form-group"><label>Year</label><input value={draft.year} onChange={e => setDraft({ ...draft, year: e.target.value })} /></div>
            <div className="form-group"><label>Achievement / Rank</label><input value={draft.rank} onChange={e => setDraft({ ...draft, rank: e.target.value })} /></div>
            
            <div className="modal-actions" style={{ marginTop: 32 }}>
              <button className="btn-cancel" onClick={() => setEditingId(null)}>Cancel</button>
              <button className="btn-primary" onClick={saveEdit}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Topper Modal */}
      {adding && (
        <div className="modal-overlay" onClick={() => setAdding(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3><Plus size={24} color="var(--primary)" /> Add New Achiever</h3>
            
            <div className="photo-upload-section">
              <img src={newT.photo} alt="preview" className="photo-preview" />
              <div>
                <input ref={addFileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handlePhotoChange(e.target.files[0], setNewT)} />
                <button className="btn btn-outline" onClick={() => addFileRef.current.click()}>
                  <Camera size={16} /> Upload Portrait
                </button>
              </div>
            </div>

            <div className="form-group"><label>Student Name</label><input value={newT.name} onChange={e => setNewT({ ...newT, name: e.target.value })} /></div>
            <div className="form-group"><label>Score / Percentile</label><input value={newT.score} onChange={e => setNewT({ ...newT, score: e.target.value })} placeholder="e.g. 99.2%ile" /></div>
            <div className="form-group"><label>Exam</label><input value={newT.exam} onChange={e => setNewT({ ...newT, exam: e.target.value })} placeholder="JEE Advanced / Class 12..." /></div>
            <div className="form-group"><label>Year</label><input value={newT.year} onChange={e => setNewT({ ...newT, year: e.target.value })} /></div>
            <div className="form-group"><label>Achievement / Rank</label><input value={newT.rank} onChange={e => setNewT({ ...newT, rank: e.target.value })} placeholder="AIR 142 etc..." /></div>
            
            <div className="modal-actions" style={{ marginTop: 32 }}>
              <button className="btn-cancel" onClick={() => setAdding(false)}>Cancel</button>
              <button className="btn-primary" onClick={addTopper}>Create Achiever</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .results-section { background: var(--off-white); padding: 120px 0; position: relative; }
        .toppers-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
        .topper-card {
          background: var(--white); border-radius: var(--radius-lg);
          border: 1px solid var(--border); box-shadow: var(--shadow-sm);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative; display: flex; flex-direction: column;
        }
        .topper-card:hover { transform: translateY(-8px); box-shadow: var(--shadow-lg); border-color: rgba(197, 168, 128, 0.4); }
        .topper-card--featured { box-shadow: 0 0 0 1px var(--gold), var(--shadow-md); }
        .topper-hidden { opacity: 0.5; }
        .featured-badge {
          position: absolute; top: -15px; left: 50%; transform: translateX(-50%);
          background: linear-gradient(135deg, var(--gold-light), var(--gold));
          color: var(--primary-dark); padding: 6px 16px; border-radius: 24px;
          font-size: 11px; font-weight: 800; letter-spacing: 1.5px;
          display: flex; align-items: center; gap: 6px;
          box-shadow: 0 4px 12px rgba(197, 168, 128, 0.4); z-index: 10;
        }
        .topper-hidden-label {
          position: absolute; top: 12px; right: 12px;
          background: #FEF2F2; color: #E11D48;
          font-size: 11px; font-weight: 700;
          padding: 4px 10px; border-radius: 4px;
          display: flex; align-items: center; gap: 4px;
          border: 1px solid #FECDD3; z-index: 10;
        }
        .topper-content-wrap { padding: 12px; }
        .topper-photo-wrap { position: relative; height: 280px; background: var(--bg-subtle); border-radius: calc(var(--radius-lg) - 4px); overflow: hidden; margin-bottom: 20px; }
        .topper-photo { width: 100%; height: 100%; object-fit: cover; object-position: top; }
        .topper-score-badge {
          position: absolute; bottom: 16px; right: 16px;
          background: var(--white); color: var(--primary);
          font-size: 16px; font-family: 'Playfair Display', serif; font-weight: 800;
          padding: 8px 16px; border-radius: 4px;
          box-shadow: 0 4px 12px rgba(10, 25, 47, 0.15);
        }
        .topper-info { padding: 0 16px 24px; flex: 1; text-align: center; }
        .topper-name { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; color: var(--text-primary); margin-bottom: 8px; }
        .topper-exam { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: var(--text-secondary); margin-bottom: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
        .topper-rank { font-size: 14px; font-weight: 700; color: var(--gold-dark); background: rgba(197, 168, 128, 0.1); display: inline-block; padding: 4px 16px; border-radius: 4px; }
        .topper-admin-actions { display: flex; gap: 8px; padding: 12px 24px; background: var(--bg-subtle); border-top: 1px solid var(--border); justify-content: center; border-radius: 0 0 var(--radius-lg) var(--radius-lg); }
        .photo-upload-section { display: flex; flex-direction: column; align-items: center; gap: 20px; margin-bottom: 32px; padding: 24px; background: var(--bg-subtle); border-radius: var(--radius-lg); }
        .photo-preview { width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 4px solid var(--white); box-shadow: var(--shadow-md); }
        @media (max-width: 1024px) { .toppers-grid { grid-template-columns: repeat(2, 1fr); gap: 24px; } }
        @media (max-width: 600px) { .toppers-grid { grid-template-columns: 1fr; max-width: 400px; margin: 0 auto; } }
      `}</style>
    </>
  );
}
