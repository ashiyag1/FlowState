import pageBg from '../../assets/page.webp'

export default function ManuscriptCard({ children }) {
  return (
    <div style={styles.wrapper}>
      <div style={styles.frame}>
        <div style={styles.bg} />
        <div style={styles.inner}>
          {children}
        </div>
      </div>
    </div>
  )
}

const styles = {
  wrapper: {
    width: '100%',
  },
  frame: {
    position: 'relative',
    width: '100%',
    aspectRatio: '5 / 1',
    borderRadius: '6px',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.03)',
    border: '1px solid rgba(201,168,76,0.10)',
  },
  bg: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `url(${pageBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    pointerEvents: 'none',
  },
  inner: {
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'min(1.5rem, 4%)',
    padding: '0.35rem min(2.5rem, 6%)',
    boxSizing: 'border-box',
  },
}