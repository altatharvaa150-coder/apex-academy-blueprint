import { BookOpen, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';

export default function Footer({ setActivePage }) {
  const nav = (page) => {
    if (setActivePage) setActivePage(page);
    else {
      const el = document.getElementById(page);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <footer className="footer">
        <div className="container footer-inner">
          {/* Brand */}
          <div className="footer-brand">
            <div className="logo" onClick={() => nav('home')} style={{ marginBottom: 24 }}>
              <div className="logo-icon">
                <BookOpen size={24} strokeWidth={2.5} />
              </div>
              <div>
                <span className="logo-name" style={{ color: 'white' }}>Apex Academy</span>
                <span className="logo-tag">PREMIER INSTITUTE</span>
              </div>
            </div>
            <p className="footer-bio">
              Premium coaching for IIT/JEE, Class 11 & 12 with IITian faculty. Small batches. Maximum attention. Giant results.
            </p>
            <div className="footer-social">
              <a href="#" className="social-btn">WhatsApp</a>
              <a href="#" className="social-btn">Facebook</a>
              <a href="#" className="social-btn">Instagram</a>
            </div>
          </div>

          {/* Quick links */}
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><button onClick={() => nav('home')}>Home</button></li>
              <li><button onClick={() => nav('courses')}>Courses</button></li>
              <li><button onClick={() => nav('faculty')}>Our Faculty</button></li>
              <li><button onClick={() => nav('results')}>Results</button></li>
              <li><button onClick={() => nav('timetable')}>Timetable</button></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-col">
            <h4>Reach Us</h4>
            <ul className="footer-contact-list">
              <li><MapPin size={16} color="var(--gold)" /> 101, Education Hub, City Center</li>
              <li><Phone size={16} color="var(--gold)" /> +91 98765 43210</li>
              <li><Mail size={16} color="var(--gold)" /> admissions@apexacademy.in</li>
            </ul>
          </div>

          {/* CTA */}
          <div className="footer-col">
            <h4>Admissions Open</h4>
            <p style={{ color: 'rgba(255,255,255,.6)', fontSize: 13, marginBottom: 16, lineHeight: 1.6 }}>
              Batch starting April 2026. Limited seats — only 20 per batch.
            </p>
            <button className="btn btn-gold" onClick={() => nav('contact')}>
              Enroll Now <ArrowRight size={16} />
            </button>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <span>© {new Date().getFullYear()} Apex Academy. All Rights Reserved.</span>
            <span>Designed for Excellence.</span>
          </div>
        </div>
      </footer>

      <style>{`
        .footer {
          background: var(--primary-dark);
          padding-top: 80px;
          color: var(--white);
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .footer-inner {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 64px;
          padding-bottom: 60px;
          border-bottom: 1px solid rgba(255,255,255,.08);
        }
        .footer-bio {
          color: rgba(255,255,255,.6);
          font-size: 14px;
          line-height: 1.7;
          margin-bottom: 24px;
          max-width: 320px;
        }
        .footer-social { display: flex; gap: 12px; flex-wrap: wrap; }
        .social-btn {
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.1);
          border-radius: var(--radius);
          padding: 8px 16px;
          font-size: 13px;
          color: rgba(255,255,255,.8);
          transition: all .2s;
          font-weight: 600;
        }
        .social-btn:hover { background: rgba(255,255,255,.1); border-color: rgba(255,255,255,.2); color: var(--gold); }
        .footer-col h4 {
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          font-weight: 700;
          color: var(--white);
          margin-bottom: 24px;
          letter-spacing: 0.5px;
        }
        .footer-col ul { list-style: none; display: flex; flex-direction: column; gap: 12px; }
        .footer-col ul li button {
          background: none;
          border: none;
          color: rgba(255,255,255,.6);
          font-size: 14px;
          cursor: pointer;
          transition: color .2s;
          padding: 0;
          text-align: left;
        }
        .footer-col ul li button:hover { color: var(--gold); }
        .footer-contact-list li {
          display: flex; gap: 12px; align-items: flex-start;
          font-size: 13px; color: rgba(255,255,255,.6); line-height: 1.6;
          margin-bottom: 12px;
        }
        .footer-bottom { padding: 24px 0; background: #040A12; }
        .footer-bottom span { font-size: 13px; color: rgba(255,255,255,.4); }
        @media (max-width: 1024px) {
          .footer-inner { grid-template-columns: 1fr 1fr; gap: 48px; }
          .footer-brand { grid-column: 1/-1; }
          .footer-bio { max-width: 100%; }
        }
        @media (max-width: 600px) {
          .footer-inner { grid-template-columns: 1fr; gap: 40px; }
          .footer-bottom .container { justify-content: center; text-align: center; }
        }
      `}</style>
    </>
  );
}
