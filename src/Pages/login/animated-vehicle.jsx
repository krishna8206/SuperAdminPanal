import React from "react"
import { motion } from "framer-motion"
import { Car, Bike, Truck } from "lucide-react"

export function AnimatedVehicle({ type, startPosition, delay }) {
  const icons = {
    car: Car,
    bike: Bike,
    truck: Truck,
  }

  const Icon = icons[type] || Car 

  return (
    <motion.div
      className="absolute bottom-10"
      initial={{ x: -100 }}
      animate={{ x: "100vw" }}
      transition={{
        duration: 8,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
      style={{ left: `${startPosition-160}px` }}
    >
      <div className="p-2 bg-orange-600 rounded-full shadow-lg">
        <Icon className="w-6 h-6 text-white" />
      </div>
    </motion.div>
  )
}
