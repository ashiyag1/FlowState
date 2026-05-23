import realLotusImg from '../assets/dashboard/real-lotus.webp'

/* ─────────────────────────────────────────────────────────────
   LotusRow.jsx
   Renders `total` small lotus icons with `done` of them lit
   and the rest faded. Used as the bottomSlot in the habits card.

   Props:
     done  – number of completed habits
     total – total habit count
─────────────────────────────────────────────────────────────── */
export default function LotusRow({ done = 0, total = 5 }) {
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end' }}>
      {Array.from({ length: total }, (_, i) => (
        <img
          key={i}
          src={realLotusImg}
          alt=""
          aria-hidden="true"
          style={{
            width: 20,
            height: 20,
            objectFit: 'contain',
            opacity: i >= done ? 0.22 : 1,
            filter: i >= done
              ? 'grayscale(0.2) saturate(0.55)'
              : 'drop-shadow(0 2px 3px rgba(121,64,79,0.18))',
          }}
        />
      ))}
    </div>
  )
}
