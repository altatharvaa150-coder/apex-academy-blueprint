import { Award, Target, BookOpen, GraduationCap, Users, TrendingUp } from 'lucide-react';

export default function Stats() {
  const stats = [
    { num: "500+", label: "IIT/NIT Selections", icon: Award },
    { num: "98.4%", label: "Best Board Score", icon: TrendingUp },
    { num: "12+", label: "Years of Excellence", icon: Target },
    { num: "3", label: "IITian Faculties", icon: GraduationCap },
    { num: "20", label: "Max Batch Size", icon: Users },
    { num: "100%", label: "Syllabus Coverage", icon: BookOpen },
  ];

  return (
    <>
      <section className="stats-section" id="stats">
        <div className="container">
          <div className="stats-grid reveal d-2">
            {stats.map((s, i) => (
              <div className="stat-card" key={i}>
                <div className="stat-icon">
                  <s.icon size={28} strokeWidth={1.5} color="var(--gold)" />
                </div>
                <div className="stat-num">{s.num}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .stats-section {
          background: var(--off-white);
          padding: 80px 0;
          border-bottom: 1px solid var(--border-light);
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 24px;
        }
        .stat-card {
          background: var(--white);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border);
          padding: 32px 20px;
          text-align: center;
          box-shadow: var(--shadow-sm);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
        }
        .stat-card:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-md);
          border-color: rgba(197, 168, 128, 0.3);
        }
        .stat-icon { 
          margin-bottom: 16px; 
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 56px; height: 56px;
          border-radius: 50%;
          background: rgba(197, 168, 128, 0.1);
        }
        .stat-num {
          font-family: 'Playfair Display', serif;
          font-size: 32px;
          font-weight: 700;
          color: var(--primary);
          line-height: 1;
          margin-bottom: 8px;
        }
        .stat-label {
          font-size: 13px;
          color: var(--text-secondary);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        @media (max-width: 1024px) { .stats-grid { grid-template-columns: repeat(3, 1fr); gap: 16px; } }
        @media (max-width: 600px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
      `}</style>
    </>
  );
}
