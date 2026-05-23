import WisdomStreak from '../../components/wisdom/WisdomStreak.jsx'
import ContinueExploring from '../../components/wisdom/ContinueExploring.jsx'
import SavedPages from '../../components/wisdom/SavedPages.jsx'

export default function Sidebar({ onBookOpen }) {
  return (
    <div style={styles.wrapper}>
      <WisdomStreak />
      <ContinueExploring onBookOpen={onBookOpen} />
      <SavedPages onBookOpen={onBookOpen} />
    </div>
  )
}

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
}