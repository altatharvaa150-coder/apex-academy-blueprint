import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedExam, setSelectedExam] = useState('');
  const [questions, setQuestions] = useState('');

  const checkPreFill = () => {
    const preFill = sessionStorage.getItem('enquiryCourse');
    if (preFill) {
      // Logic to somewhat map the predefined batch name to the dropdown
      const lower = preFill.toLowerCase();
      if (lower.includes('jee adv')) setSelectedExam('JEE Advanced');
      else if (lower.includes('jee main')) setSelectedExam('JEE Mains');
      else if (lower.includes('12')) setSelectedExam('Class 12 Boards');
      else if (lower.includes('11')) setSelectedExam('Class 11 Foundation');
      else if (lower.includes('bitsat') || lower.includes('mht')) setSelectedExam('BITSAT / MHT-CET');
      else {
        setSelectedExam('Other');
        setQuestions(`I am interested in the ${preFill} program.`);
      }
      sessionStorage.removeItem('enquiryCourse'); // Clear after reading
    }
  };

  useEffect(() => {
    checkPreFill();
    window.addEventListener('courseSelected', checkPreFill);
    return () => window.removeEventListener('courseSelected', checkPreFill);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      e.target.reset();
    }, 1500);
  };

  return (
    <>
      <section className="contact-section" id="contact">
        <div className="bg-noise"></div>
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info reveal d-1">
              <span className="overline">Get in Touch</span>
              <h2>Start Your Success Journey</h2>
              <p>Admission for the 2026 batches is now open. Book a free counselling session with our academic experts.</p>
              
              <div className="info-cards">
                <div className="info-card">
                  <div className="icon-wrap"><MapPin size={20} color="var(--gold)" /></div>
                  <div>
                    <strong>Campus Address</strong>
                    <p>101, Education Hub, Near Metro, City Center - 400001</p>
                  </div>
                </div>
                <div className="info-card">
                  <div className="icon-wrap"><Phone size={20} color="var(--gold)" /></div>
                  <div>
                    <strong>Phone Support</strong>
                    <p>+91 98765 43210<br/>+91 98765 43211</p>
                  </div>
                </div>
                <div className="info-card">
                  <div className="icon-wrap"><Mail size={20} color="var(--gold)" /></div>
                  <div>
                    <strong>Email Us</strong>
                    <p>admissions@apexacademy.in</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-form-wrap reveal d-2">
              <div className="form-card">
                {success ? (
                  <div className="success-state">
                    <CheckCircle2 size={64} color="var(--success)" strokeWidth={1.5} />
                    <h3>Request Received!</h3>
                    <p>Thank you for reaching out. Our academic counselor will call you within 24 hours.</p>
                    <button className="btn btn-outline" onClick={() => setSuccess(false)}>Submit another</button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="contact-form">
                    <h3 className="form-title">Request a Callback</h3>
                    <div className="form-group">
                      <label>Student Name</label>
                      <input required placeholder="Enter full name" />
                    </div>
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input required type="tel" placeholder="10-digit mobile number" />
                    </div>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Target Exam</label>
                        <select required value={selectedExam} onChange={e => setSelectedExam(e.target.value)}>
                          <option value="" disabled>Select...</option>
                          <option>JEE Advanced</option>
                          <option>JEE Mains</option>
                          <option>Class 12 Boards</option>
                          <option>Class 11 Foundation</option>
                          <option>BITSAT / MHT-CET</option>
                          <option>Other</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Current Class</label>
                        <select required defaultValue="">
                          <option value="" disabled>Select...</option>
                          <option>Class 10 (Moving to 11)</option>
                          <option>Class 11</option>
                          <option>Class 12</option>
                          <option>Dropper</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Any Questions? (Optional)</label>
                      <textarea rows="3" placeholder="How can we help you?" value={questions} onChange={e => setQuestions(e.target.value)}></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '16px' }} disabled={loading}>
                      {loading ? 'Submitting...' : <><Send size={18} /> Book Free Counselling</>}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .contact-section {
          background: var(--primary);
          padding: 120px 0;
          color: var(--white);
          position: relative;
        }
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: center;
          position: relative;
          z-index: 10;
        }
        .contact-info .overline { color: var(--gold); }
        .contact-info h2 {
          font-size: clamp(36px, 5vw, 48px);
          font-weight: 700;
          color: var(--white);
          margin-bottom: 24px;
          line-height: 1.1;
        }
        .contact-info p {
          font-size: 18px;
          color: rgba(255,255,255,0.7);
          line-height: 1.6;
          margin-bottom: 48px;
          max-width: 480px;
        }
        .info-cards { display: flex; flex-direction: column; gap: 32px; }
        .info-card { display: flex; gap: 24px; align-items: flex-start; }
        .info-card .icon-wrap {
          width: 56px; height: 56px;
          background: rgba(197, 168, 128, 0.1);
          border: 1px solid rgba(197, 168, 128, 0.2);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .info-card strong { display: block; font-family: 'Playfair Display', serif; font-size: 20px; color: var(--gold-light); margin-bottom: 8px; }
        .info-card p { font-size: 15px; color: rgba(255,255,255,0.6); margin-bottom: 0; }
        
        .contact-form-wrap { position: relative; }
        .contact-form-wrap::before {
          content: ''; position: absolute; inset: -20px;
          background: radial-gradient(circle at center, rgba(197,168,128,0.15) 0%, transparent 70%);
          z-index: -1;
        }
        .form-card {
          background: var(--white);
          border-radius: 16px;
          padding: 48px;
          color: var(--text-primary);
          box-shadow: 0 32px 64px rgba(0,0,0,0.5);
        }
        .form-title {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          color: var(--primary);
          margin-bottom: 32px;
          text-align: center;
        }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .form-group { margin-bottom: 24px; }
        .success-state {
          text-align: center;
          padding: 40px 20px;
        }
        .success-state h3 { font-family: 'Playfair Display', serif; font-size: 28px; color: var(--primary); margin: 24px 0 16px; }
        .success-state p { font-size: 15px; color: var(--text-secondary); margin-bottom: 32px; }
        
        @media (max-width: 1024px) {
          .contact-grid { grid-template-columns: 1fr; gap: 48px; }
          .contact-info { text-align: center; }
          .contact-info p { margin: 0 auto 48px; }
          .info-card { text-align: left; }
        }
        @media (max-width: 600px) { .form-card { padding: 32px 24px; } .form-grid { grid-template-columns: 1fr; } }
      `}</style>
    </>
  );
}
