import { useTheme } from '../context/ThemeContext'
import DiyaLamp from '../icons/DiyaLamp'

export default function ImmersiveFooter() {
  const { dark } = useTheme()
  const year = new Date().getFullYear()

  return (
    <footer className="immersive-footer">
      <style>{`
        .immersive-footer {
          padding: 2rem 1.5rem 6rem;
          position: relative;
          text-align: center;
          background: ${dark ? 'rgba(18, 18, 18, 0.85)' : 'rgba(253, 250, 243, 0.85)'};
          backdrop-filter: blur(12px);
          border-top: 1px solid ${dark ? 'rgba(201,168,76,0.15)' : 'rgba(139,105,20,0.15)'};
          transition: all 0.3s ease;
        }
        
        .footer-content {
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .footer-brand {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .footer-title {
          font-family: 'Cinzel', serif;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: ${dark ? '#e8c46a' : '#8a5a12'};
          text-transform: uppercase;
        }

        .footer-divider {
          width: 30px;
          height: 1px;
          background: ${dark ? 'rgba(201,168,76,0.2)' : 'rgba(139,105,20,0.25)'};
        }

        .footer-mantra {
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.95rem;
          font-style: italic;
          color: ${dark ? '#e8d9b5' : '#5C3D1E'};
          letter-spacing: 0.05em;
        }

        .footer-desc {
          font-family: 'Lora', serif;
          font-size: 0.72rem;
          font-style: italic;
          color: ${dark ? 'rgba(232,217,181,0.6)' : 'rgba(92,61,30,0.65)'};
          line-height: 1.5;
          max-width: 440px;
          margin: 0;
        }

        .feedback-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 4px;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
        }

        .footer-feedback-btn {
          font-family: 'Lora', serif;
          font-size: 0.72rem;
          font-style: italic;
          color: ${dark ? '#e8c46a' : '#8a5a12'};
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 12px;
          border-radius: 99px;
          background: ${dark ? 'rgba(201,168,76,0.08)' : 'rgba(138,90,18,0.06)'};
          border: 1px solid ${dark ? 'rgba(201,168,76,0.2)' : 'rgba(138,90,18,0.15)'};
          transition: all 0.2s ease;
        }

        .footer-feedback-btn:hover {
          background: ${dark ? 'rgba(201,168,76,0.15)' : 'rgba(138,90,18,0.12)'};
          transform: translateY(-1px);
        }

        .footer-credits {
          font-family: 'Lora', serif;
          font-size: 0.7rem;
          color: ${dark ? 'rgba(232,217,181,0.45)' : 'rgba(92,61,30,0.55)'};
        }

        .footer-copyright {
          font-family: 'Cinzel', serif;
          font-size: 0.55rem;
          letter-spacing: 0.08em;
          color: ${dark ? 'rgba(201,168,76,0.25)' : 'rgba(92,61,30,0.35)'};
          margin-top: 0.25rem;
        }

        @media (min-width: 768px) {
          .immersive-footer {
            padding: 2.5rem 1.5rem 2rem;
          }
        }
      `}</style>
      <div className="footer-content">
        <div className="footer-brand">
          <DiyaLamp size={24} />
          <span className="footer-title">Tarang · FlowState</span>
        </div>
        
        <div className="footer-divider" />

        <div className="footer-mantra">
          स्वस्थस्य स्वास्थ्यं रक्षणं
        </div>

        <p className="footer-desc">
          Flow with Ashiya — Transform ancient wellness wisdom into modern consistency. 
          A sanctuary for quiet reflection, ritual tracker, and inner space.
        </p>

        <div className="feedback-actions">
          <span style={{ fontSize: '0.72rem', color: dark ? 'rgba(232,217,181,0.6)' : 'rgba(92,61,30,0.65)', fontStyle: 'italic', marginRight: '2px', fontFamily: "'Lora', serif" }}>
            ✉ Share Feedback:
          </span>
          <a 
            href="https://mail.google.com/mail/?view=cm&fs=1&to=ashiyagarg75@gmail.com&su=FlowState%20Feedback" 
            target="_blank"
            rel="noopener noreferrer"
            className="footer-feedback-btn"
          >
            Gmail
          </a>
          <a 
            href="https://outlook.live.com/mail/0/deeplink/compose?to=ashiyagarg75@gmail.com&subject=FlowState%20Feedback" 
            target="_blank"
            rel="noopener noreferrer"
            className="footer-feedback-btn"
          >
            Outlook
          </a>
        </div>

        <div className="footer-credits">
          Made with <span style={{ color: '#b45a3c', fontSize: '0.8rem' }}>♥</span> by Ashiya
        </div>

        <div className="footer-copyright">
          © {year} FLOWSTATE · ALL RIGHTS RESERVED · MADE IN INDIA
        </div>
      </div>
    </footer>
  )
}
