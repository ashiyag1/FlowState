import PageLayout from '../components/PageLayout'
import TopBorder from '../components/TopBorder'
import HeroSection from '../sections/HeroSection'
import WisdomCarousel from '../sections/WisdomCarousel'
import DailyFlow from '../sections/DailyFlow'
import IndiaSections from '../sections/IndiaSections'
import ImmersiveFooter from '../sections/ImmersiveFooter'
import homeBg from '../assets/home_bg.png'

export default function Home() {
  return (
    <>
      <HeroSection />

      <TopBorder />

      <PageLayout>
      <main
        style={{
          position: 'relative',
          paddingTop: '4.5rem',
          background: `
            linear-gradient(180deg, rgba(253,246,227,0.5) 0%, rgba(253,246,227,0.08) 18%, transparent 28%),
            radial-gradient(ellipse at 50% 45%, rgba(255,248,240,0.5) 0%, rgba(255,248,240,0.08) 55%, transparent 75%),
            radial-gradient(ellipse at 15% 75%, rgba(232,119,34,0.06) 0%, transparent 55%),
            radial-gradient(ellipse at 85% 35%, rgba(201,168,76,0.05) 0%, transparent 55%),
            radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.04) 0%, transparent 35%),
            url(${homeBg}) center top / cover no-repeat
          `,
        }}
      >
        {/* Sacred Om watermark — barely visible, anchors the spiritual atmosphere */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none', zIndex: 0,
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute',
            width: 'clamp(320px, 55vw, 600px)',
            height: 'clamp(320px, 55vw, 600px)',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(201,168,76,0.045) 0%, transparent 65%)',
            pointerEvents: 'none',
          }} />
          <span style={{
            fontFamily: "'Noto Serif Devanagari', serif",
            fontSize: 'clamp(14rem, 38vw, 32rem)',
            color: 'rgba(201, 168, 76, 0.04)',
            lineHeight: 1,
            userSelect: 'none',
            transform: 'translateY(-6%)',
            letterSpacing: '-0.04em',
            fontWeight: 400,
          }}>
            ॐ
          </span>
        </div>

        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: 1100,
            margin: '0 auto',
            padding: '3rem 1.2rem 0',
          }}
        >
          <DailyFlow />
          <WisdomCarousel />
          <IndiaSections />
        </div>

        <ImmersiveFooter />
      </main>
    </PageLayout>
    </>
  )
}