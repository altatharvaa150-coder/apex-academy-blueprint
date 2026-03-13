import { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { getHero, saveHero } from '../store/academyData';
import { Medal, Star, ShieldCheck, ArrowRight, Play, Edit2 } from 'lucide-react';

export default function Hero() {
  const { isAdmin } = useAdmin();
  const [hero, setHero] = useState(getHero());
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(hero);

  useEffect(() => {
    setHero(getHero());
  }, []);

  const handleSave = () => {
    saveHero(draft);
    setHero(draft);
    setEditing(false);
  };

  return (
    <>
      <section className="hero-section" id="home">
        <div className="bg-noise"></div>
        
        {/* Announcement banner */}
        <div className="announcement-bar">
          <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <span className="announcement-dot" />
            <span>{hero.announcement}</span>
            {isAdmin && (
              <button className="admin-badge" onClick={() => setEditing(true)}>
                <Edit2 size={12} /> Edit Banner
              </button>
            )}
          </div>
        </div>

        <div className="container hero-content">
          <div className="hero-left reveal d-1">
            <div className="badge badge-gold" style={{ marginBottom: 24 }}>
              <Star size={12} fill="currentColor" /> IITian Faculty · Proven Results
            </div>
            <h1 className="hero-headline">
              {hero.headline}
            </h1>
            <p className="hero-sub">{hero.subheadline}</p>

            <div className="hero-ctas">
              <a href="#contact" className="btn btn-gold">
                Admissions Open <ArrowRight size={18} />
              </a>
              <a href="#courses" className="btn btn-outline" style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}>
                <Play size={18} /> View Programs
              </a>
            </div>

            <div className="hero-trust" style={{ marginTop: 48, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              <div className="trust-item">
                <Medal size={24} color="var(--gold)" />
                <div>
                  <strong>500+</strong>
                  <span>IIT Selections</span>
                </div>
              </div>
              <div className="trust-divider" />
              <div className="trust-item">
                <ShieldCheck size={24} color="var(--gold)" />
                <div>
                  <strong>12+ Years</strong>
                  <span>Legacy of Trust</span>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-right reveal d-2">
            <div className="hero-images">
              <div className="image-main">
                <img src="/teacher_physics.png" alt="Faculty" />
              </div>
              <div className="image-float top-right reveal d-3">
                <div className="float-card">
                  <div className="fc-icon"><Medal size={20} color="var(--gold)" /></div>
                  <div>
                    <div className="fc-title">AIR 142</div>
                    <div className="fc-sub">JEE Advanced '25</div>
                  </div>
                </div>
              </div>
              <div className="image-float bottom-left reveal d-3" style={{ animationDelay: '0.4s' }}>
                <div className="float-card">
                  <div className="fc-icon"><Star size={20} fill="var(--gold)" color="var(--gold)" /></div>
                  <div>
                    <div className="fc-title">98.4%</div>
                    <div className="fc-sub">Board Topper</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Edit modal */}
      {editing && (
        <div className="modal-overlay" onClick={() => setEditing(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3><Edit2 size={24} color="var(--primary)" /> Edit Hero Section</h3>
            <div className="form-group">
              <label>Main Headline</label>
              <input value={draft.headline} onChange={e => setDraft({ ...draft, headline: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Sub-headline</label>
              <textarea value={draft.subheadline} onChange={e => setDraft({ ...draft, subheadline: e.target.value })} rows={2} />
            </div>
            <div className="form-group">
              <label>Announcement Bar</label>
              <input value={draft.announcement} onChange={e => setDraft({ ...draft, announcement: e.target.value })} />
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setEditing(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleSave}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .hero-section {
          min-height: calc(100vh - var(--nav-height));
          background-color: var(--primary);
          background-image: radial-gradient(circle at top right, var(--primary-light), var(--primary) 70%);
          position: relative;
          overflow: hidden;
          padding-top: var(--nav-height);
          display: flex;
          flex-direction: column;
        }
        .announcement-bar {
          background: rgba(255,255,255,0.03);
          border-bottom: 1px solid rgba(255,255,255,0.08);
          padding: 12px 0;
          font-size: 13px;
          color: rgba(255,255,255,0.9);
          font-weight: 500;
          letter-spacing: 0.5px;
          position: relative;
          z-index: 10;
        }
        .announcement-dot {
          width: 8px; height: 8px;
          background: var(--gold);
          border-radius: 50%;
          flex-shrink: 0;
          box-shadow: 0 0 12px var(--gold);
        }
        .hero-content {
          flex: 1;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 64px;
          align-items: center;
          padding-top: 60px;
          padding-bottom: 80px;
          position: relative;
          z-index: 10;
        }
        .hero-left {
          color: var(--white);
        }
        .hero-headline {
          font-size: clamp(40px, 6vw, 64px);
          font-weight: 700;
          line-height: 1.1;
          color: var(--white);
          margin-bottom: 24px;
        }
        .hero-sub {
          font-size: 18px;
          color: rgba(255,255,255,0.7);
          line-height: 1.6;
          margin-bottom: 40px;
          max-width: 520px;
        }
        .hero-ctas { display: flex; gap: 16px; flex-wrap: wrap; }
        .hero-trust { margin-top: 48px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 32px; }
        .trust-item { display: flex; align-items: center; gap: 16px; }
        .trust-item strong { display: block; font-family: 'Playfair Display', serif; font-size: 24px; color: var(--gold); line-height: 1.2; }
        .trust-item span { font-size: 13px; color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }
        .trust-divider { width: 1px; height: 40px; background: rgba(255,255,255,0.1); }
        
        .hero-right {
          position: relative;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }
        .hero-images {
          position: relative;
          width: 100%;
          max-width: 500px;
        }
        .image-main {
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 24px 80px rgba(0,0,0,0.6);
          aspect-ratio: 4/5;
          max-height: 560px;
          background: var(--primary-dark);
        }
        .image-main img {
          width: 100%; height: 100%; object-fit: cover; opacity: 0.9;
        }
        .image-float { position: absolute; }
        .image-float.top-right { top: -20px; right: -30px; }
        .image-float.bottom-left { bottom: -30px; left: -40px; }
        .float-card {
          background: rgba(10, 25, 47, 0.7);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 16px 20px;
          border-radius: 12px;
          display: flex; align-items: center; gap: 16px;
          box-shadow: 0 12px 32px rgba(0,0,0,0.4);
          color: white;
        }
        .fc-icon {
          width: 40px; height: 40px;
          border-radius: 8px;
          background: rgba(197, 168, 128, 0.1);
          display: flex; align-items: center; justify-content: center;
        }
        .fc-title { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; color: var(--gold); }
        .fc-sub { font-size: 11px; color: rgba(255,255,255,0.7); text-transform: uppercase; letter-spacing: 1px; font-weight: 600; margin-top: 2px; }

        @media (max-width: 1024px) {
          .hero-content { grid-template-columns: 1fr; text-align: center; gap: 40px; }
          .hero-sub { margin: 0 auto 32px; }
          .hero-ctas { justify-content: center; }
          .hero-trust { justify-content: center; border-top: none; }
          .hero-right { display: none; }
        }
      `}</style>
    </>
  );
}
