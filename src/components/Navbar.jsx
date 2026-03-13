import { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Menu, X, BookOpen, User, GraduationCap, Unlock } from 'lucide-react';

const NAV_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'courses', label: 'Courses' },
  { id: 'faculty', label: 'Faculty' },
  { id: 'results', label: 'Results' },
  { id: 'timetable', label: 'Timetable' },
  { id: 'contact', label: 'Contact' },
];

export default function Navbar({ activePage, setActivePage, isMobile }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  const { isAdmin, login, logout } = useAdmin();

  const handleNav = (id) => {
    if (isMobile) {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      setActivePage(id);
    }
    setMenuOpen(false);
  };

  const handleLogin = () => {
    if (login(pw)) {
      setShowLogin(false);
      setPw('');
      setError('');
    } else {
      setError('Incorrect password. Try again.');
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="container navbar-inner">
          {/* Logo */}
          <div className="logo" onClick={() => handleNav('home')}>
            <div className="logo-icon">
              <BookOpen size={24} strokeWidth={2.5} />
            </div>
            <div>
              <span className="logo-name">Apex Academy</span>
              <span className="logo-tag">PREMIER INSTITUTE</span>
            </div>
          </div>

          {/* Desktop nav links */}
          <ul className="nav-links">
            {NAV_LINKS.map(l => (
              <li key={l.id}>
                <button
                  className={`nav-link ${activePage === l.id ? 'active' : ''}`}
                  onClick={() => handleNav(l.id)}
                >
                  {l.label}
                </button>
              </li>
            ))}
          </ul>

          {/* CTA + Admin */}
          <div className="nav-actions">
            {isAdmin ? (
              <button className="btn btn-outline" style={{ padding: '10px 16px' }} onClick={logout}>
                <Unlock size={16} /> Exit Admin
              </button>
            ) : (
              <button className="btn-admin-login" onClick={() => setShowLogin(true)} title="Teacher Portal">
                <User size={18} />
              </button>
            )}
            <button className="btn btn-primary" onClick={() => handleNav('contact')}>
              Admissions Open
            </button>
            <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="mobile-menu">
            {NAV_LINKS.map(l => (
              <button key={l.id} className="mobile-link" onClick={() => handleNav(l.id)}>
                {l.label}
              </button>
            ))}
            <div style={{ padding: '20px' }}>
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => handleNav('contact')}>
                <GraduationCap size={18} /> Enroll Now
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Admin login modal */}
      {showLogin && (
        <div className="modal-overlay" onClick={() => setShowLogin(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3><Unlock size={24} color="var(--primary)" /> Teacher Portal</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24, fontSize: 14 }}>
              Access the administrative dashboard to manage content.
            </p>
            <div className="form-group">
              <label>Authorization Token</label>
              <input
                type="password"
                value={pw}
                onChange={e => setPw(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                placeholder="Enter password"
                autoFocus
              />
            </div>
            {error && <p style={{ color: '#E11D48', fontSize: 13, marginBottom: 16 }}>{error}</p>}
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => { setShowLogin(false); setError(''); }}>Cancel</button>
              <button className="btn-primary" onClick={handleLogin}>Authenticate</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .navbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          height: var(--nav-height);
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-light);
          z-index: 1000;
          transition: all 0.3s ease;
        }
        .navbar-inner {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 16px;
          cursor: pointer;
        }
        .logo-icon {
          width: 44px; height: 44px;
          background: var(--primary);
          color: var(--white);
          border-radius: var(--radius);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(10, 25, 47, 0.2);
        }
        .logo-name {
          display: block;
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          font-size: 20px;
          color: var(--primary);
          line-height: 1.1;
          letter-spacing: -0.5px;
        }
        .logo-tag {
          display: block;
          font-size: 10px;
          color: var(--gold-dark);
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 32px;
          list-style: none;
        }
        @media (max-width: 1024px) {
          .nav-links { gap: 16px; }
        }
        .nav-link {
          background: none;
          border: none;
          font-size: 14px;
          font-weight: 600;
          color: var(--text-secondary);
          transition: all 0.2s;
          padding: 8px 0;
          position: relative;
        }
        .nav-link:hover { color: var(--primary); }
        .nav-link.active { color: var(--primary); }
        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 2px;
          background: var(--gold);
          border-radius: 2px;
        }
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .btn-admin-login {
          background: none;
          border: none;
          color: var(--text-muted);
          width: 40px; height: 40px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 50%;
          transition: all 0.2s;
        }
        .btn-admin-login:hover {
          background: var(--bg-subtle);
          color: var(--primary);
        }
        .hamburger {
          display: none;
          background: none; border: none;
          color: var(--text-primary);
        }
        .mobile-menu {
          position: absolute;
          top: var(--nav-height);
          left: 0; right: 0;
          background: var(--white);
          border-bottom: 1px solid var(--border);
          box-shadow: var(--shadow-md);
          display: flex; flex-direction: column;
        }
        .mobile-link {
          padding: 20px 24px;
          text-align: left;
          background: none; border: none; border-top: 1px solid var(--border-light);
          font-size: 16px; font-weight: 600; color: var(--text-primary);
        }
        @media (max-width: 900px) {
          .nav-links { display: none; }
          .hamburger { display: block; }
        }
      `}</style>
    </>
  );
}
