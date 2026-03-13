import { useAdmin } from '../context/AdminContext';
import { LogOut, RefreshCw } from 'lucide-react';

export default function AdminBar() {
  const { logout } = useAdmin();

  const resetData = () => {
    if (window.confirm('This will reset ALL content (faculty, courses, toppers, timetable) to defaults. Are you sure?')) {
      localStorage.removeItem('academy_toppers');
      localStorage.removeItem('academy_batches');
      localStorage.removeItem('academy_faculty');
      localStorage.removeItem('academy_timetable');
      localStorage.removeItem('academy_hero');
      window.location.reload();
    }
  };

  return (
    <div className="admin-banner">
      <span style={{ fontSize: 18 }}>🔑</span>
      <div>
        <div style={{ fontWeight: 800 }}>Admin Mode Active</div>
        <div style={{ fontSize: 11, color: 'rgba(255,200,50,.7)', fontWeight: 400 }}>
          Editing controls are visible. All changes auto-save.
        </div>
      </div>

      <button
        onClick={resetData}
        title="Reset all content to defaults"
        style={{
          background: 'rgba(255,100,50,.12)',
          border: '1px solid rgba(255,100,50,.35)',
          borderRadius: 8,
          color: 'rgba(255,200,150,1)',
          padding: '6px 14px',
          fontSize: 12,
          fontWeight: 700,
          cursor: 'pointer',
          transition: 'all .2s',
          marginLeft: 8,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <RefreshCw size={14} /> Reset Data
      </button>

      <button
        onClick={logout}
        style={{
          background: 'rgba(255,255,255,.08)',
          border: '1px solid rgba(255,255,255,.2)',
          borderRadius: 8,
          color: 'white',
          padding: '6px 14px',
          fontSize: 12,
          fontWeight: 700,
          cursor: 'pointer',
          transition: 'all .2s',
          marginLeft: 8,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <LogOut size={14} /> Exit
      </button>
    </div>
  );
}
