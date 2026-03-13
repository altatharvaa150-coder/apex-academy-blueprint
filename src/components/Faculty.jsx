import { useState, useRef } from 'react';
import { useAdmin } from '../context/AdminContext';
import { getFaculty, saveFaculty } from '../store/academyData';
import { Image as ImageIcon, Camera, Edit3, Linkedin, Phone } from 'lucide-react';

export default function Faculty({ fullPage }) {
  const { isAdmin } = useAdmin();
  const [faculty, setFaculty] = useState(getFaculty());
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(null);
  const fileRef = useRef();
  const [previewUrl, setPreviewUrl] = useState(null);

  const openEdit = (f) => { setDraft({ ...f }); setEditingId(f.id); setPreviewUrl(null); };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreviewUrl(ev.target.result);
      setDraft(d => ({ ...d, photo: ev.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const saveEdit = () => {
    const updated = faculty.map(f => f.id === editingId ? draft : f);
    saveFaculty(updated);
    setFaculty(updated);
    setEditingId(null);
  };

  return (
    <>
      <section className="faculty-section" id="faculty">
        <div className="container">
          <div className="section-header reveal d-1">
            <span className="overline">Academic Leaders</span>
            <h2>Meet Our Faculty</h2>
            <p>Learn from IITians and seasoned educators who have mentored top rankers for over a decade.</p>
          </div>

          <div className="faculty-grid reveal d-2">
            {faculty.map(f => (
              <div className="faculty-card" key={f.id}>
                <div className="faculty-photo-wrap">
                  <img src={f.photo} alt={f.name} className="faculty-photo" />
                  <div className="faculty-overlay"></div>
                  <div className="faculty-subject-badge">{f.subject}</div>
                </div>
                <div className="faculty-info">
                  <h3 className="faculty-name">{f.name}</h3>
                  <div className="faculty-qual">{f.qualification}</div>
                  <div className="faculty-exp">{f.experience} of Excellence</div>
                  <p className="faculty-bio">{f.bio}</p>
                  
                  {/* Make sure icons always render if data exists, pushing them up slightly */}
                  {(f.phone || f.linkedIn) && (
                    <div className="faculty-contacts" style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                      {f.phone && (
                        <a href={`tel:${f.phone}`} className="faculty-contact-link" title="Call">
                          <Phone size={16} />
                        </a>
                      )}
                      {f.linkedIn && (
                        <a href={f.linkedIn} target="_blank" rel="noreferrer" className="faculty-contact-link" title="LinkedIn">
                          <Linkedin size={16} />
                        </a>
                      )}
                    </div>
                  )}
                  
                  {isAdmin && (
                    <button className="btn btn-outline" style={{ marginTop: 20, width: '100%' }} onClick={() => openEdit(f)}>
                      <Edit3 size={16} /> Edit Profile
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Edit Faculty Modal */}
      {editingId && draft && (
        <div className="modal-overlay" onClick={() => setEditingId(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3><Edit3 size={24} color="var(--primary)" /> Edit Faculty Profile</h3>
            
            <div className="photo-upload-section">
              <img src={previewUrl || draft.photo} alt="preview" className="photo-preview" />
              <div>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoChange} />
                <button className="btn btn-outline" onClick={() => fileRef.current.click()}>
                  <Camera size={16} /> Upload New Portrait
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group" style={{ gridColumn: '1/-1' }}><label>Name</label><input value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} /></div>
              <div className="form-group"><label>Subject</label><input value={draft.subject} onChange={e => setDraft({ ...draft, subject: e.target.value })} /></div>
              <div className="form-group"><label>Qualification</label><input value={draft.qualification} onChange={e => setDraft({ ...draft, qualification: e.target.value })} /></div>
              <div className="form-group"><label>Phone Number</label><input value={draft.phone || ''} onChange={e => setDraft({ ...draft, phone: e.target.value })} /></div>
              <div className="form-group"><label>LinkedIn URL</label><input value={draft.linkedIn || ''} onChange={e => setDraft({ ...draft, linkedIn: e.target.value })} /></div>
              <div className="form-group" style={{ gridColumn: '1/-1' }}><label>Experience</label><input value={draft.experience} onChange={e => setDraft({ ...draft, experience: e.target.value })} /></div>
              <div className="form-group" style={{ gridColumn: '1/-1' }}><label>Bio</label><textarea value={draft.bio} onChange={e => setDraft({ ...draft, bio: e.target.value })} rows={4} /></div>
            </div>
            
            <div className="modal-actions" style={{ marginTop: 32 }}>
              <button className="btn-cancel" onClick={() => setEditingId(null)}>Cancel</button>
              <button className="btn-primary" onClick={saveEdit}>Save Profile</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .faculty-section { background: var(--bg-subtle); padding: 120px 0; }
        .faculty-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 40px;
        }
        .faculty-card {
          background: var(--white);
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--border);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .faculty-card:hover { 
          transform: translateY(-8px); 
          box-shadow: var(--shadow-lg); 
        }
        .faculty-photo-wrap {
          position: relative;
          height: 320px;
          overflow: hidden;
          background: var(--border-light);
        }
        .faculty-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .faculty-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(10, 25, 47, 0.6) 0%, transparent 40%);
        }
        .faculty-card:hover .faculty-photo { transform: scale(1.05); }
        .faculty-subject-badge {
          position: absolute;
          bottom: 20px; left: 24px;
          background: var(--white);
          color: var(--primary);
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 11px;
          font-weight: 800;
          padding: 6px 14px;
          border-radius: 4px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }
        .faculty-info { padding: 32px 24px; }
        .faculty-name {
          font-family: 'Playfair Display', serif;
          font-size: 24px;
          font-weight: 700;
          color: var(--primary);
          margin-bottom: 8px;
          letter-spacing: -0.5px;
        }
        .faculty-qual { font-size: 14px; color: var(--gold-dark); font-weight: 700; margin-bottom: 6px; letter-spacing: 0.5px; }
        .faculty-exp { font-size: 13px; color: var(--text-muted); margin-bottom: 20px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;}
        .faculty-bio { font-size: 15px; color: var(--text-secondary); line-height: 1.6; }
        
        .faculty-contact-link {
          width: 36px; height: 36px;
          border-radius: 50%;
          background: var(--bg-subtle);
          color: var(--primary);
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
        }
        .faculty-contact-link:hover {
          background: var(--primary);
          color: var(--white);
          transform: translateY(-2px);
        }
        
        .photo-upload-section {
          display: flex; flex-direction: column; align-items: center; gap: 20px;
          margin-bottom: 32px; padding: 24px; background: var(--bg-subtle); border-radius: var(--radius-lg);
        }
        .photo-preview {
          width: 120px; height: 120px; 
          border-radius: 50%; object-fit: cover; 
          border: 4px solid var(--white);
          box-shadow: var(--shadow-md);
        }
        
        @media (max-width: 1024px) { .faculty-grid { gap: 24px; } .faculty-photo-wrap { height: 280px; } }
        @media (max-width: 900px) { .faculty-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { .faculty-grid { grid-template-columns: 1fr; max-width: 400px; margin: 0 auto; } }
      `}</style>
    </>
  );
}
