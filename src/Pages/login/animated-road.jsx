"use client"

import { motion } from "framer-motion"
import { AnimatedVehicle } from "./animated-vehicle"

export function AnimatedRoad() {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden">
      {/* Road */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gray-900/50 backdrop-blur-sm">
        {/* Road markings */}
        <div className="relative h-full">
          {/* <motion.div
            className=""
            initial={{ x: 0 }}
            animate={{ x: "-100%" }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="w-10 h-1 bg-green-400/70 mr-6" />
            ))}
          </motion.div> */}
          <div className="absolute top-1/2 left-0 right-0 h-1 flex">
          {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="w-10 h-1 bg-orange-600 mr-6" />
            ))}
          </div>
        </div>
      </div>

      {/* Animated vehicles */}
      <AnimatedVehicle type="car" startPosition={50} delay={0} />
      <AnimatedVehicle type="bike" startPosition={200} delay={2} />
      <AnimatedVehicle type="truck" startPosition={100} delay={4} />
    </div>
  )
}
