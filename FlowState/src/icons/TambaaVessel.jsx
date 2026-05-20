import React from 'react';
import { motion } from 'framer-motion';
import StatCard from '../components/StatCard';
import copperVesselImg from '../assets/dashboard/copper-vessel.png';
import { fadeUp } from '../animations';


const TambaaVessel = ({ todayTotal, waterGoal, waterPct, onClick }) => {
  return (
    <motion.div variants={fadeUp(0.06)} initial="hidden" whileInView="show" viewport={{ once: true }}>
      <StatCard
        type="water"
        icon={
          <span className="fs-real-icon fs-real-icon--water">
            <img src={copperVesselImg} alt="Copper water vessel" />
          </span>
        }
        value={todayTotal}
        unit="ml"
        label="Water consumed"
        sub={`Goal: ${waterGoal} ml`}
        to="/water"
        onClick={onClick}
        pct={waterPct}
      />
    </motion.div>
  );
}

export default TambaaVessel;
