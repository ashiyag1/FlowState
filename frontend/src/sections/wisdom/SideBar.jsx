import WisdomStreak from '../../components/wisdom/WisdomStreak.jsx'
import ContinueExploring from '../../components/wisdom/ContinueExploring.jsx'
import SavedPages from '../../components/wisdom/SavedPages.jsx'
import LotusOracle from '../../components/wisdom/LotusOracle.jsx'

export default function Sidebar({ onBookOpen }) {
  return (
    <div className="flex flex-col gap-4">
      <WisdomStreak />
      <LotusOracle />
      <ContinueExploring onBookOpen={onBookOpen} />
      <SavedPages onBookOpen={onBookOpen} />
    </div>
  )
}