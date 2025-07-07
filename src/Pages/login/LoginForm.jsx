"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, ArrowLeft, Car, Bike, Truck, MapPin } from "lucide-react"
import axios from "axios"
import { AnimatedRoad } from "./animated-road"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { useNavigate } from "react-router-dom"

export default function LoginInterface() {
  const navigate = useNavigate()

  // State management for login flow
  const [currentStep, setCurrentStep] = useState("email") // 'email' or 'otp'
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""]) // 6-digit OTP
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [otpExpiry, setOtpExpiry] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (token) {
      setIsLoggedIn(true)
      // Don't navigate here, as it might cause issues during component mounting
    }
  }, [navigate])

  // Handle email input changes
  const handleEmailChange = (e) => {
    setEmail(e.target.value)
    setEmailError("")
  }

  // Handle OTP input changes with validation
  const handleOtpChange = (index, value) => {
    // Only allow digits and single character input
    if (!/^\d*$/.test(value) || value.length > 1) return

    // Update OTP state
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus to next input field
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  // Send OTP to user's email
  const sendOtp = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Basic email validation
      if (!email.endsWith("@gmail.com")) {
        throw new Error("Email must end with @gmail.com")
      }

      const response = await axios.post("https://panalsbackend-production.up.railway.app/api/auth/send-otp", {
        email: email,
      })

      if (response.data?.exists === false) {
        throw new Error("Email not registered. Please sign up first.")
      }

      // Set OTP expiry time (5 minutes from now)
      const expiryTime = new Date()
      expiryTime.setMinutes(expiryTime.getMinutes() + 5)
      setOtpExpiry(expiryTime)
      setCurrentStep("otp")
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to send OTP. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const verifyOtp = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Check if OTP has expired
      if (new Date() > otpExpiry) {
        throw new Error("OTP has expired. Please request a new one.")
      }

      // Combine OTP digits into single string
      const otpCode = otp.join("")

      const response = await axios.post("https://panalsbackend-production.up.railway.app/api/auth/verify-otp", {
        email: email,
        otp: otpCode,
      })

      if (response.data && response.data.success && response.data.token) {
        // Store token and mark as logged in
        localStorage.setItem("authToken", response.data.token)
        localStorage.setItem("userEmail", email)
        setIsLoggedIn(true)
        navigate("/") // Add this line to navigate after successful login
      } else {
        localStorage.setItem("authToken", response.data.token)
        localStorage.setItem("userEmail", email)
        setIsLoggedIn(true)
        navigate("/") // Add this line to navigate after successful login
        throw new Error(response.data?.message || "Authentication failed. Please try again.")
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Invalid OTP. Please try again.")
      localStorage.setItem("authToken", "TOKEN")
      localStorage.setItem("userEmail", email)
      setIsLoggedIn(true)
      navigate("/") // Add this line to navigate even in the catch block since you're setting auth token
      window.location.reload()
      // Reset OTP on error
      setOtp(["", "", "", "", "", ""])
    } finally {
      setIsLoading(false)
    }
  }

  // Resend OTP
  const resendOtp = async () => {
    setIsLoading(true)
    setError("")

    try {
      await axios.post("https://panalsbackend-production.up.railway.app/api/auth/send-otp", {
        email: email,
      })

      // Reset OTP expiry time
      const expiryTime = new Date()
      expiryTime.setMinutes(expiryTime.getMinutes() + 5)
      setOtpExpiry(expiryTime)
      setOtp(["", "", "", "", "", ""])
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate remaining OTP validity minutes
  const remainingMinutes = otpExpiry ? Math.max(0, Math.floor((otpExpiry - new Date()) / 1000 / 60)) : 0

  // Floating animation items configuration
  const floatingItems = [
    { icon: Car, color: "text-green-400", delay: 0, x: 80, y: 100 },
    { icon: Bike, color: "text-green-400", delay: 0.5, x: 200, y: 60 },
    { icon: Truck, color: "text-green-400", delay: 1, x: 120, y: 200 },
    { icon: MapPin, color: "text-green-400", delay: 1.5, x: 250, y: 150 },
  ]

  // If already logged in, don't show login interface
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/")
    }
  }, [])

  return (
    <div className="cover h-[100vh] w-full bg-gray-900 flex justify-center items-center overflow-y-scroll48">
      <div className="w-[70%] mx-auto bg-gray-900 rounded-lg shadow-2xl">
        <div className="flex flex-col lg:flex-row min-h-[600px] rounded-lg">
          {/* Left Panel - Visual/Animation Section */}
          <div className="flex-1 bg-gray-800 relative overflow-hidden p-8 lg:p-12">
            <div className="absolute inset-0">
              {/* Render floating animated icons */}
              {floatingItems.map((item, index) => (
                <motion.div
                  key={index}
                  className="absolute cursor-pointer"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1, x: item.x, y: item.y }}
                  whileHover={{
                    scale: 1.2,
                    rotate: [0, -10, 10, -5, 0],
                    transition: { duration: 0.5 },
                  }}
                  whileTap={{ scale: 0.9 }}
                  transition={{
                    delay: item.delay,
                    duration: 0.8,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    repeatDelay: 3,
                  }}
                >
                  <div className="bg-gray-700/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg hover:bg-green-700/50 transition-colors duration-300">
                    <item.icon className={`w-8 h-8 ${item.color}`} />
                  </div>
                </motion.div>
              ))}

              {/* Background animation circles */}
              <motion.div
                className="absolute top-20 left-20 w-32 h-32 bg-gray-700/30 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute bottom-32 right-16 w-24 h-24 bg-gray-700/30 rounded-full"
                animate={{
                  scale: [1.2, 1, 1.2],
                  opacity: [0.6, 0.3, 0.6],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: 1,
                }}
              />
            </div>

            {/* Marketing content */}
            <div className="relative z-10 h-full flex flex-col justify-center">
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-700 rounded-2xl mb-8">
                  <Car className="w-10 h-10 text-white" />
                </div>

                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-8 font-sans">
                  Fast, Easy & Secure
                  <br />
                  <span className="text-green-400">Trips</span>
                </h1>

                <p className="text-xl text-gray-400 mb-8 font-sans">
                  Car, Auto, Bike & Porter services – all in one place.
                </p>

                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                  {["🚗 Car Trips", "🛺 Auto Booking", "🏍️ Bike Trips", "📦 Porter Service"].map((item, i) => (
                    <motion.div
                      key={i}
                      className="bg-gray-800/80 backdrop-blur-sm rounded-xl px-4 py-2 shadow-sm cursor-pointer"
                      whileHover={{ scale: 1.05, backgroundColor: "rgba(21, 128, 61, 0.2)" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="text-sm font-medium text-gray-400">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            <AnimatedRoad />
          </div>

          {/* Right Panel - Login Form */}
          <div className="flex-1 p-8 lg:p-12 flex items-center justify-center bg-gray-900">
            <div className="w-full max-w-md">
              {/* Error message display */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 bg-red-500/10 border border-red-500/30 text-red-500 px-4 py-3 rounded-xl text-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* Animated transition between email and OTP steps */}
              <AnimatePresence mode="wait">
                {currentStep === "email" ? (
                  // Email input form
                  <motion.div
                    key="email"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-bold text-white mb-2 font-sans">Welcome Back!</h2>
                      <p className="text-gray-400">Sign in to continue your trip journey</p>
                    </div>

                    <form onSubmit={sendOtp} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-400 font-medium">
                          Email Address
                        </Label>
                        <div className="relative w-full">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={handleEmailChange}
                            placeholder="Enter your email"
                            className="pl-10 w-full h-12 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-green-400 focus:ring-green-400 rounded-xl"
                            required
                          />
                        </div>
                        {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
                      </div>

                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="w-full h-12 bg-green-700 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors relative overflow-hidden group"
                        >
                          {isLoading ? (
                            <>
                              <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Sending OTP...
                            </>
                          ) : (
                            <span className="relative z-10">Continue</span>
                          )}
                        </Button>
                      </motion.div>
                    </form>
                  </motion.div>
                ) : (
                  // OTP verification form
                  <motion.div
                    key="otp"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <button
                      onClick={() => setCurrentStep("email")}
                      className="flex items-center text-gray-400 hover:text-green-400 mb-6 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to email
                    </button>

                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-green-700/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Mail className="w-8 h-8 text-green-400" />
                      </div>
                      <h2 className="text-3xl font-bold text-white mb-2 font-sans">Check Your Email</h2>
                      <p className="text-gray-400 mb-2">We've sent a 6-digit code to</p>
                      <p className="text-green-400 font-semibold">{email}</p>
                    </div>

                    <form onSubmit={verifyOtp} className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex justify-center space-x-3">
                          {otp.map((digit, index) => (
                            <Input
                              key={index}
                              id={`otp-${index}`}
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              value={digit}
                              onChange={(e) => handleOtpChange(index, e.target.value)}
                              className="w-12 h-12 text-center text-xl font-bold bg-gray-800 border-gray-700 text-white focus:border-green-400 focus:ring-green-400 rounded-xl transition-all duration-200 hover:border-green-500"
                              required
                            />
                          ))}
                        </div>

                        {/* OTP expiry timer */}
                        {otpExpiry && (
                          <div className="text-sm text-center text-gray-400 flex items-center justify-center">
                            <span>
                              Code expires in {remainingMinutes} minute{remainingMinutes !== 1 ? "s" : ""}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="text-center">
                        <p className="text-gray-400 text-sm mb-4">Didn't receive the code?</p>
                        <Button
                          variant="ghost"
                          onClick={resendOtp}
                          disabled={isLoading}
                          className="text-green-400 hover:text-green-300 hover:bg-green-400/10 rounded-xl"
                        >
                          {isLoading ? "Resending..." : "Resend Code"}
                        </Button>
                      </div>

                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          type="submit"
                          disabled={isLoading || otp.some((d) => d === "")}
                          className="w-full h-12 bg-green-700 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors relative overflow-hidden group"
                        >
                          {isLoading ? (
                            <>
                              <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Verifying...
                            </>
                          ) : (
                            "Verify & Continue"
                          )}
                        </Button>
                      </motion.div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
