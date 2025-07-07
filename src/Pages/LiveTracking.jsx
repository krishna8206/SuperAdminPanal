"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import {
  FaCar,
  FaMotorcycle,
  FaTruck,
  FaUserAlt,
  FaRupeeSign,
  FaChartLine,
  FaPhone,
  FaStar,
  FaFilter,
} from "react-icons/fa"
import { RiRestaurantFill } from "react-icons/ri"
import { Bar, Pie } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js"
import { dashboardService } from "../services/api"
import io from "socket.io-client"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-routing-machine"
import "leaflet-routing-machine/dist/leaflet-routing-machine.css"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

// Default state values
const DEFAULT_STATS = {
  todayRides: 0,
  ridesPercentageChange: 0,
  totalDrivers: 0,
  newDriversThisWeek: 0,
  driversPercentageChange: 0,
  todayIncome: 0,
  incomePercentageChange: 0,
  completedRides: 0,
  completedPercentageChange: 0,
  cancelledRides: 0,
  cancelledPercentageChange: 0,
  successRate: 0,
  cancellationRate: 0,
}

const DEFAULT_REVENUE_DATA = {
  labels: [],
  datasets: [
    {
      label: "Revenue (₹)",
      data: [],
      backgroundColor: "rgba(34, 197, 94, 0.7)",
      borderColor: "rgba(34, 197, 94, 1)",
      borderWidth: 1,
    },
  ],
}

// Component to handle map updates
function MapUpdater({ center }) {
  const map = useMap()

  useEffect(() => {
    map.setView(center, map.getZoom())
  }, [center, map])

  return null
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("all")
  const [stats, setStats] = useState(DEFAULT_STATS)
  const [recentRides, setRecentRides] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [socket, setSocket] = useState(null)
  const [connectionStatus, setConnectionStatus] = useState("Connecting...")
  const [revenueData, setRevenueData] = useState(DEFAULT_REVENUE_DATA)
  const [errors, setErrors] = useState({})
  const [showAllActivities, setShowAllActivities] = useState(true)
  const [userLocation, setUserLocation] = useState(null)
  const [locationError, setLocationError] = useState(null)
  const [routingControl, setRoutingControl] = useState(null)

  // Map-specific state - Updated to Ahmedabad coordinates
  const [mapCenter, setMapCenter] = useState([23.0225, 72.5714]) // Ahmedabad coordinates
  const [selectedService, setSelectedService] = useState("all")
  const [showCompleted, setShowCompleted] = useState(true)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [drivers, setDrivers] = useState([])
  const [selectedDriver, setSelectedDriver] = useState(null)

  // New filter states
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  // Use refs to store data and prevent dependency loops
  const lastValidStatsRef = useRef(null)
  const socketRef = useRef(null)
  const isInitializedRef = useRef(false)
  const mapRef = useRef(null)

  // Safe number parsing function
  const safeParseFloat = (value) => {
    const parsed = Number.parseFloat(value)
    return isNaN(parsed) ? 0 : parsed
  }

  // Filter rides by current month
  const filterRidesByCurrentMonth = (rides) => {
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()

    return rides.filter((ride) => {
      if (!ride.rideTime) return false
      const rideDate = new Date(ride.rideTime)
      return rideDate.getMonth() === currentMonth && rideDate.getFullYear() === currentYear
    })
  }

  // Custom icons for different services
  const createCustomIcon = (color, service) => {
    if (typeof window === "undefined") return null

    const iconHtml = `
      <div style="
        background-color: ${color};
        width: 35px;
        height: 35px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 3px 6px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: white;
        font-weight: bold;
        position: relative;
      ">
        ${service === "Ride" ? "🚗" : service === "Food-Delivery" ? "🍕" : "📦"}
        <div style="
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 12px;
          height: 12px;
          background-color: #10B981;
          border: 2px solid white;
          border-radius: 50%;
        "></div>
      </div>
    `

    return L.divIcon({
      html: iconHtml,
      className: "custom-marker",
      iconSize: [35, 35],
      iconAnchor: [17.5, 17.5],
      popupAnchor: [0, -17.5],
    })
  }

  // Enhanced driver icon with different icons for different statuses
  const createDriverIcon = (status, vehicleType) => {
    if (typeof window === "undefined") return null

    let color, statusIcon
    switch (status) {
      case "active":
        color = "#F59E0B" // Yellow for active/on-trip
        statusIcon = "🚗" // Car icon for active
        break
      case "idle":
        color = "#10B981" // Green for idle/available
        statusIcon = "⏸️" // Pause icon for idle
        break
      case "emergency":
        color = "#EF4444" // Red for emergency
        statusIcon = "🚨" // Emergency icon
        break
      case "offline":
      default:
        color = "#6B7280" // Gray for offline or unknown status
        statusIcon = "⭕" // Offline icon
        break
    }

    // Vehicle type icon
    let vehicleIcon = "🚗"
    if (vehicleType) {
      switch (vehicleType.toLowerCase()) {
        case "bike":
        case "motorcycle":
          vehicleIcon = "🏍️"
          break
        case "truck":
          vehicleIcon = "🚛"
          break
        case "three-wheeler":
        case "auto":
          vehicleIcon = "🛺"
          break
        default:
          vehicleIcon = "🚗"
      }
    }

    const iconHtml = `
      <div style="
        background-color: ${color};
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: white;
        font-weight: bold;
        position: relative;
      ">
        ${vehicleIcon}
        <div style="
          position: absolute;
          bottom: -3px;
          right: -3px;
          width: 16px;
          height: 16px;
          background-color: white;
          border: 1px solid ${color};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 8px;
        ">
          ${statusIcon}
        </div>
      </div>
    `

    return L.divIcon({
      html: iconHtml,
      className: "driver-marker",
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -18],
    })
  }

  // Filter drivers based on vehicle type and status
  const getFilteredDrivers = () => {
    return drivers.filter((driver) => {
      const vehicleMatch =
        vehicleTypeFilter === "all" ||
        (vehicleTypeFilter === "bike" &&
          (driver.vehicleType?.toLowerCase().includes("bike") ||
            driver.vehicleType?.toLowerCase().includes("motorcycle"))) ||
        (vehicleTypeFilter === "truck" && driver.vehicleType?.toLowerCase().includes("truck")) ||
        (vehicleTypeFilter === "three-wheeler" &&
          (driver.vehicleType?.toLowerCase().includes("three") || driver.vehicleType?.toLowerCase().includes("auto")))

      const statusMatch = statusFilter === "all" || driver.status === statusFilter

      return vehicleMatch && statusMatch
    })
  }

  // Calculate summary statistics
  const calculateSummaryStats = () => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const thisWeekStart = new Date(today)
    thisWeekStart.setDate(today.getDate() - today.getDay())

    const lastWeekStart = new Date(thisWeekStart)
    lastWeekStart.setDate(lastWeekStart.getDate() - 7)
    const lastWeekEnd = new Date(thisWeekStart)
    lastWeekEnd.setDate(lastWeekEnd.getDate() - 1)

    const sameLastWeekDay = new Date(today)
    sameLastWeekDay.setDate(sameLastWeekDay.getDate() - 7)

    // Filter rides for different periods
    const todayRides = recentRides.filter((ride) => {
      const rideDate = new Date(ride.rideTime)
      return rideDate.toDateString() === today.toDateString()
    })

    const yesterdayRides = recentRides.filter((ride) => {
      const rideDate = new Date(ride.rideTime)
      return rideDate.toDateString() === yesterday.toDateString()
    })

    const thisWeekRides = recentRides.filter((ride) => {
      const rideDate = new Date(ride.rideTime)
      return rideDate >= thisWeekStart && rideDate <= today
    })

    const lastWeekRides = recentRides.filter((ride) => {
      const rideDate = new Date(ride.rideTime)
      return rideDate >= lastWeekStart && rideDate <= lastWeekEnd
    })

    const sameLastWeekDayRides = recentRides.filter((ride) => {
      const rideDate = new Date(ride.rideTime)
      return rideDate.toDateString() === sameLastWeekDay.toDateString()
    })

    // Calculate totals
    const todayTotal = todayRides.reduce((sum, ride) => sum + (ride.amount || 0), 0)
    const yesterdayTotal = yesterdayRides.reduce((sum, ride) => sum + (ride.amount || 0), 0)
    const thisWeekTotal = thisWeekRides.reduce((sum, ride) => sum + (ride.amount || 0), 0)
    const lastWeekTotal = lastWeekRides.reduce((sum, ride) => sum + (ride.amount || 0), 0)
    const sameLastWeekDayTotal = sameLastWeekDayRides.reduce((sum, ride) => sum + (ride.amount || 0), 0)

    return {
      todayVsYesterday: {
        today: { rides: todayRides.length, revenue: todayTotal },
        yesterday: { rides: yesterdayRides.length, revenue: yesterdayTotal },
        change: {
          rides:
            yesterdayRides.length > 0
              ? (((todayRides.length - yesterdayRides.length) / yesterdayRides.length) * 100).toFixed(1)
              : 0,
          revenue: yesterdayTotal > 0 ? (((todayTotal - yesterdayTotal) / yesterdayTotal) * 100).toFixed(1) : 0,
        },
      },
      todayVsSameLastWeek: {
        today: { rides: todayRides.length, revenue: todayTotal },
        sameLastWeek: { rides: sameLastWeekDayRides.length, revenue: sameLastWeekDayTotal },
        change: {
          rides:
            sameLastWeekDayRides.length > 0
              ? (((todayRides.length - sameLastWeekDayRides.length) / sameLastWeekDayRides.length) * 100).toFixed(1)
              : 0,
          revenue:
            sameLastWeekDayTotal > 0
              ? (((todayTotal - sameLastWeekDayTotal) / sameLastWeekDayTotal) * 100).toFixed(1)
              : 0,
        },
      },
      thisWeekVsLastWeek: {
        thisWeek: { rides: thisWeekRides.length, revenue: thisWeekTotal },
        lastWeek: { rides: lastWeekRides.length, revenue: lastWeekTotal },
        change: {
          rides:
            lastWeekRides.length > 0
              ? (((thisWeekRides.length - lastWeekRides.length) / lastWeekRides.length) * 100).toFixed(1)
              : 0,
          revenue: lastWeekTotal > 0 ? (((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100).toFixed(1) : 0,
        },
      },
    }
  }

  // feth-driver ----
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await fetch("https://panalsbackend-production.up.railway.app/api/driver")
        const data = await response.json()
        if (data.success) {
          setDrivers(data.data)
        }
      } catch (error) {
        console.error("Error fetching drivers:", error)
      }
    }

    fetchDrivers()
  }, [])

  useEffect(() => {
    const fetchRecentRides = async () => {
      try {
        const response = await fetch("https://panalsbackend-production.up.railway.app/api/dashboard/recent-rides")
        const data = await response.json()
        setRecentRides(data)
      } catch (error) {
        console.error("Error fetching recent trips:", error)
      }
    }

    fetchRecentRides()
  }, [])

  // Custom user location icon
  const createUserLocationIcon = () => {
    if (typeof window === "undefined") return null

    const iconHtml = `
      <div style="
        background-color: #8B5CF6;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 3px 6px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        color: white;
        font-weight: bold;
        position: relative;
      ">
        👤
        <div style="
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 14px;
          height: 14px;
          background-color: #10B981;
          border: 2px solid white;
          border-radius: 50%;
        "></div>
      </div>
    `

    return L.divIcon({
      html: iconHtml,
      className: "user-location-marker",
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      popupAnchor: [0, -20],
    })
  }

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "active":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "pending":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
    }
  }

  // Get status color for map markers
  const getMapStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "#10B981" // Green
      case "in-progress":
        return "#F59E0B" // Yellow
      case "pending":
        return "#3B82F6" // Blue
      case "cancelled":
        return "#EF4444" // Red
      default:
        return "#6B7280" // Gray
    }
  }

  // Filter rides for map based on selected service and completion status
  const getFilteredRidesForMap = () => {
    return recentRides.filter((ride) => {
      const serviceMatch = selectedService === "all" || ride.service === selectedService
      const statusMatch = showCompleted || ride.status !== "completed"
      return serviceMatch && statusMatch
    })
  }

  // Handle driver call with real phone number
  const handleDriverCall = (driver) => {
    if (driver.phone) {
      // Create a tel: link to initiate call
      window.location.href = `tel:${driver.phone}`
    } else {
      alert(`Phone number not available for ${driver.name}`)
    }
  }

  // Update route between two points
  const updateRoute = useCallback(
    (from, to) => {
      // Remove existing routing control if it exists
      if (routingControl && mapRef.current) {
        mapRef.current.removeControl(routingControl)
      }

      if (!mapRef.current || !from || !to) return

      // Create new routing control
      const newRoutingControl = L.Routing.control({
        waypoints: [L.latLng(from[0], from[1]), L.latLng(to[0], to[1])],
        routeWhileDragging: false,
        showAlternatives: false,
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: false,
        lineOptions: {
          styles: [{ color: "#8B5CF6", opacity: 0.8, weight: 5 }],
        },
        createMarker: () => null, // Disable default markers
      }).addTo(mapRef.current)

      setRoutingControl(newRoutingControl)
    },
    [routingControl],
  )

  // Handle driver selection
  const handleDriverSelect = useCallback(
    (driver) => {
      setSelectedDriver(driver)

      if (userLocation) {
        updateRoute(userLocation, [driver.location.lat, driver.location.lng])
      } else {
        alert("Your location is not available. Please enable location services.")
      }
    },
    [userLocation, updateRoute],
  )

  // Stable update functions without problematic dependencies
  const updateStats = useCallback((newStats) => {
    if (!newStats || typeof newStats !== "object") {
      console.warn("⚠️ Received invalid stats data:", newStats)
      return
    }

    // Check if the new stats have valid data
    const hasValidData =
      (newStats.todayRides && newStats.todayRides > 0) ||
      (newStats.totalDrivers && newStats.totalDrivers > 0) ||
      (newStats.todayIncome && newStats.todayIncome > 0) ||
      (newStats.completedRides && newStats.completedRides > 0)

    // If new data seems invalid and we have last valid stats, keep the old ones
    if (!hasValidData && lastValidStatsRef.current) {
      console.warn("⚠️ New stats appear invalid, keeping previous valid stats")
      return
    }

    try {
      const updatedStats = {
        todayRides: Number.parseInt(newStats.todayRides) || 0,
        ridesPercentageChange: safeParseFloat(newStats.ridesPercentageChange),
        totalDrivers: Number.parseInt(newStats.totalDrivers) || 0,
        newDriversThisWeek: Number.parseInt(newStats.newDriversThisWeek) || 0,
        driversPercentageChange: safeParseFloat(newStats.driversPercentageChange),
        todayIncome: safeParseFloat(newStats.todayIncome),
        incomePercentageChange: safeParseFloat(newStats.incomePercentageChange),
        completedRides: Number.parseInt(newStats.completedRides) || 0,
        completedPercentageChange: safeParseFloat(newStats.completedPercentageChange),
        cancelledRides: Number.parseInt(newStats.cancelledRides) || 0,
        cancelledPercentageChange: safeParseFloat(newStats.cancelledPercentageChange),
        successRate: safeParseFloat(newStats.successRate),
        cancellationRate: safeParseFloat(newStats.cancellationRate),
        timestamp: newStats.timestamp || new Date().toISOString(),
      }

      setStats(updatedStats)
      lastValidStatsRef.current = updatedStats
      console.log("✅ Stats updated successfully")
    } catch (error) {
      console.error("❌ Error updating stats:", error)
    }
  }, []) // No dependencies to avoid loops

  const updateRecentRides = useCallback((newRides) => {
    if (!Array.isArray(newRides)) {
      console.warn("⚠️ Received invalid trips data:", newRides)
      return
    }

    try {
      setRecentRides(newRides)
      console.log("✅ Recent trips updated successfully")
    } catch (error) {
      console.error("❌ Error updating recent trips:", error)
    }
  }, []) // No dependencies

  const updateRevenueData = useCallback((newRevenueData) => {
    if (!newRevenueData || typeof newRevenueData !== "object") {
      console.warn("⚠️ Received invalid revenue data:", newRevenueData)
      return
    }

    try {
      if (
        newRevenueData.labels &&
        newRevenueData.data &&
        Array.isArray(newRevenueData.labels) &&
        Array.isArray(newRevenueData.data)
      ) {
        setRevenueData((prev) => ({
          ...prev,
          labels: newRevenueData.labels,
          datasets: [
            {
              ...prev.datasets[0],
              data: newRevenueData.data,
            },
          ],
        }))
        console.log("✅ Revenue data updated successfully")
      } else {
        console.warn("⚠️ Revenue data missing required fields:", newRevenueData)
      }
    } catch (error) {
      console.error("❌ Error updating revenue data:", error)
    }
  }, []) // No dependencies

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle("dark")
  }

  // Check if we're on client side for map rendering
  useEffect(() => {
    setIsMapLoaded(true)
  }, [])

  // Get user location
  useEffect(() => {
    if (!isMapLoaded) return

    // Check if geolocation is supported
    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation([latitude, longitude])
          setLocationError(null)

          // Center map on user's location when first obtained
          if (mapRef.current) {
            mapRef.current.setView([latitude, longitude], 15)
          }
        },
        (error) => {
          setLocationError(error.message)
          console.error("Geolocation error:", error)
        },
        {
          enableHighAccuracy: true,
          maximumAge: 10000,
          timeout: 5000,
        },
      )

      return () => {
        navigator.geolocation.clearWatch(watchId)
      }
    } else {
      setLocationError("Geolocation is not supported by your browser")
    }
  }, [isMapLoaded])

  // Clean up routing control
  useEffect(() => {
    return () => {
      if (routingControl && mapRef.current) {
        mapRef.current.removeControl(routingControl)
      }
    }
  }, [routingControl])

  const revenueOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#adb5bd",
        },
      },
      title: {
        display: true,
        text: "Weekly Revenue",
        color: "#adb5bd",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "#adb5bd",
        },
        grid: {
          color: "rgba(209, 213, 219, 0.5)",
        },
      },
      x: {
        ticks: {
          color: "#6b7280",
        },
        grid: {
          color: "rgba(209, 213, 219, 0.5)",
        },
      },
    },
  }

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#adb5bd",
        },
      },
      title: {
        display: true,
        text: "Service Distribution",
        color: "#adb5bd",
      },
    },
  }

  // Initialize Socket.IO connection - only once
  useEffect(() => {
    if (socketRef.current) {
      console.log("Socket already exists, skipping initialization")
      return
    }

    console.log("Initializing socket connection...")
    const newSocket = io("https://panalsbackend-production.up.railway.app", {
      timeout: 20000,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      maxReconnectionAttempts: 5,
    })

    socketRef.current = newSocket
    setSocket(newSocket)

    newSocket.on("connect", () => {
      console.log("✅ Connected to server")
      setConnectionStatus("Connected")
      setErrors({})
    })

    newSocket.on("disconnect", (reason) => {
      console.log("❌ Disconnected from server:", reason)
      setConnectionStatus("Disconnected")
    })

    newSocket.on("connect_error", (error) => {
      console.error("Connection error:", error)
      setConnectionStatus("Connection Error")
      setErrors((prev) => ({ ...prev, connection: error.message }))
    })

    newSocket.on("reconnect", (attemptNumber) => {
      console.log("🔄 Reconnected after", attemptNumber, "attempts")
      setConnectionStatus("Connected")
      setErrors({})
    })

    newSocket.on("reconnect_error", (error) => {
      console.error("Reconnection error:", error)
      setConnectionStatus("Reconnection Failed")
    })

    // Listen for real-time dashboard stats updates
    newSocket.on("dashboardStats", (newStats) => {
      console.log("📊 Received real-time stats update:", newStats)
      updateStats(newStats)
    })

    // Listen for real-time recent rides updates
    newSocket.on("recentRidesUpdate", (newRecentRides) => {
      console.log("🚗 Received real-time recent trips update")
      updateRecentRides(newRecentRides)
    })

    // Listen for real-time revenue data updates
    newSocket.on("revenueDataUpdate", (newRevenueData) => {
      console.log("💰 Received real-time revenue data update")
      updateRevenueData(newRevenueData)
    })

    // Listen for error events
    newSocket.on("dashboardError", (error) => {
      console.error("📊 Dashboard error:", error)
      setErrors((prev) => ({ ...prev, dashboard: error.message }))
    })

    newSocket.on("ridesError", (error) => {
      console.error("🚗 Trips error:", error)
      setErrors((prev) => ({ ...prev, rides: error.message }))
    })

    newSocket.on("revenueError", (error) => {
      console.error("💰 Revenue error:", error)
      setErrors((prev) => ({ ...prev, revenue: error.message }))
    })

    return () => {
      console.log("Cleaning up socket connection...")
      newSocket.close()
      socketRef.current = null
    }
  }, []) // Empty dependency array - only run once

  // Initial data fetch - only once
  useEffect(() => {
    if (isInitializedRef.current) {
      console.log("Dashboard already initialized, skipping initial fetch")
      return
    }

    const fetchDashboardData = async () => {
      try {
        console.log("Fetching initial dashboard data...")
        setIsLoading(true)
        setErrors({})

        const [statsRes, recentRidesRes, revenueRes] = await Promise.all([
          dashboardService.getStats().catch((err) => {
            console.error("Error fetching stats:", err)
            return { data: DEFAULT_STATS }
          }),
          dashboardService.getRecentRides().catch((err) => {
            console.error("Error fetching recent trips:", err)
            return { data: [] }
          }),
          dashboardService.getRevenueData().catch((err) => {
            console.error("Error fetching revenue data:", err)
            return { data: { labels: [], data: [] } }
          }),
        ])

        updateStats(statsRes.data)
        updateRecentRides(recentRidesRes.data)
        updateRevenueData(revenueRes.data)

        setIsLoading(false)
        isInitializedRef.current = true
        console.log("✅ Initial dashboard data loaded successfully")
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        setErrors((prev) => ({ ...prev, fetch: "Failed to load dashboard data" }))
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, []) // Empty dependency array - only run once

  const getServiceIcon = (service) => {
    switch (service) {
      case "Ride":
        return <FaCar className="text-blue-500" />
      case "Food-Delivery":
        return <RiRestaurantFill className="text-orange-500" />
      case "Courier-Delivery":
        return <FaTruck className="text-green-500" />
      default:
        return <FaMotorcycle className="text-purple-500" />
    }
  }

  const currentMonthRides = filterRidesByCurrentMonth(recentRides)
  const baseFilteredRides =
    activeTab === "all" ? currentMonthRides : currentMonthRides.filter((ride) => ride.service === activeTab)
  const filteredRides = showAllActivities ? baseFilteredRides : baseFilteredRides.slice(0, 5)
  const filteredRidesForMap = getFilteredRidesForMap()
  const filteredDrivers = getFilteredDrivers()
  const summaryStats = calculateSummaryStats()

  const serviceCounts = recentRides.reduce((acc, ride) => {
    if (ride && ride.service) {
      if (!acc[ride.service]) {
        acc[ride.service] = 0
      }
      acc[ride.service]++
    }
    return acc
  }, {})

  const serviceDistributionData = {
    labels: ["Trips", "Food Delivery", "Courier Delivery"],
    datasets: [
      {
        data: [serviceCounts["Trip"] || 0, serviceCounts["Food-Delivery"] || 0, serviceCounts["Courier-Delivery"] || 0],
        backgroundColor: ["rgba(59, 130, 246, 0.7)", "rgba(249, 115, 22, 0.7)", "rgba(22, 163, 74, 0.7)"],
        borderColor: ["rgba(59, 130, 246, 1)", "rgba(249, 115, 22, 1)", "rgba(22, 163, 74, 1)"],
        borderWidth: 1,
      },
    ],
  }

  // Reset show all activities when tab changes
  useEffect(() => {
    setShowAllActivities(false)
  }, [activeTab])

  return (
    <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      {/* Dashboard Content */}
      <div className="p-4 md:p-6">
        {/* <div className="flex justify-between items-center mb-4 md:mb-6">
          <div className="flex items-center gap-3">
            {locationError && (
              <div className="px-3 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 text-xs">
                Location: {locationError}
              </div>
            )}
            <div
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                connectionStatus === "Connected"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : connectionStatus === "Disconnected"
                    ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
              }`}
            >
              {connectionStatus}
            </div>
            {lastValidStatsRef.current && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Last updated: {new Date(lastValidStatsRef.current.timestamp).toLocaleTimeString()}
              </div>
            )}
          </div>
        </div> */}

        {/* Live Tracking Map Section */}
        <div className="mb-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Live Vehicle Tracking</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Real-time tracking of drivers and ongoing deliveries across Ahmedabad
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-300px)]">
            {/* Map Area */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 relative overflow-hidden">
              <div className="absolute top-4 left-4 z-[1000]">
                <div className="bg-white/90 dark:bg-gray-900/90 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2 text-green-500 dark:text-green-400 text-sm">
                    <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full animate-pulse"></div>
                    <span>Live Tracking Active</span>
                  </div>
                </div>
              </div>

              {/* Filter Controls */}
              <div className="absolute top-4 right-4 z-[1000] flex flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <FaFilter className="text-gray-500 text-sm" />
                  <select
                    value={vehicleTypeFilter}
                    onChange={(e) => setVehicleTypeFilter(e.target.value)}
                    className="px-3 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded-md bg-white/90 dark:bg-gray-900/90 text-gray-700 dark:text-gray-300"
                  >
                    <option value="all">All Vehicles</option>
                    <option value="bike">🏍️ Bike</option>
                    <option value="truck">🚛 Truck</option>
                    <option value="three-wheeler">🛺 Three Wheeler</option>
                  </select>
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded-md bg-white/90 dark:bg-gray-900/90 text-gray-700 dark:text-gray-300"
                >
                  <option value="all">All Status</option>
                  <option value="active">🚗 Active</option>
                  <option value="idle">⏸️ Idle</option>
                  <option value="offline">⭕ Offline</option>
                  <option value="emergency">🚨 Emergency</option>
                </select>
              </div>

              {/* Map */}
              <div className="w-full h-full relative">
                {isMapLoaded ? (
                  <MapContainer
                    center={mapCenter}
                    zoom={12}
                    style={{ height: "100%", width: "100%" }}
                    className="rounded-lg z-0"
                    ref={mapRef}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                    <MapUpdater center={mapCenter} />

                    {/* User location marker */}
                    {userLocation && (
                      <Marker position={userLocation} icon={createUserLocationIcon()}>
                        <Popup className="min-w-[180px]">
                          <div className="p-2">
                            <h3 className="font-semibold text-sm text-gray-800 mb-1">Your Location</h3>
                            <div className="text-xs text-gray-600 space-y-1">
                              <div>Lat: {userLocation[0].toFixed(6)}</div>
                              <div>Lng: {userLocation[1].toFixed(6)}</div>
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    )}

                    {/* Render filtered driver markers */}
                    {filteredDrivers.map((driver) => (
                      <Marker
                        key={driver._id}
                        position={[driver.location.lat, driver.location.lng]}
                        icon={createDriverIcon(driver.status, driver.vehicleType)}
                        eventHandlers={{
                          click: () => handleDriverSelect(driver),
                        }}
                      >
                        <Popup className="min-w-[200px]">
                          <div className="p-3">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold text-sm text-gray-800">{driver.name}</h3>
                              <span
                                className={`px-2 py-1 rounded-full text-[10px] font-medium ${
                                  driver.status === "idle"
                                    ? "bg-green-100 text-green-800"
                                    : driver.status === "active"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : driver.status === "emergency"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {driver.status}
                              </span>
                            </div>
                            <div className="text-xs text-gray-600 space-y-1 mb-3">
                              <div className="flex justify-between">
                                <span className="text-gray-500">Vehicle:</span>
                                <span>{driver.vehicleType || "N/A"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Rating:</span>
                                <span>⭐ {driver.rating?.toFixed(1) || "N/A"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Phone:</span>
                                <span>{driver.phone || "N/A"}</span>
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDriverCall(driver)
                              }}
                              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-xs font-medium transition-colors"
                            >
                              <FaPhone className="text-[10px]" />
                              Call {driver.phone}
                            </button>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                ) : (
                  <div className="h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 animate-pulse flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                        <FaCar className="text-white text-lg" />
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Loading map...</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Driver List */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Active Drivers</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-500 dark:text-green-400 text-sm">
                    {filteredDrivers.filter((d) => d.status === "active" || d.status === "idle").length} Active
                  </span>
                </div>
              </div>

              <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto">
                {filteredDrivers.map((driver) => (
                  <div
                    key={driver._id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                      selectedDriver?._id === driver._id
                        ? "border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-400/10"
                        : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                    }`}
                    onClick={() => handleDriverSelect(driver)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <FaUserAlt className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <span className="text-gray-800 dark:text-white font-medium">{driver.name}</span>
                      </div>
                      <div
                        className={`px-2 py-1 rounded-full text-xs ${
                          driver.status === "active"
                            ? "bg-yellow-100 dark:bg-yellow-700 text-yellow-700 dark:text-yellow-400"
                            : driver.status === "idle"
                              ? "bg-green-100 dark:bg-green-700 text-green-700 dark:text-green-400"
                              : driver.status === "emergency"
                                ? "bg-red-100 dark:bg-red-700 text-red-700 dark:text-red-400"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        {driver.status}
                      </div>
                    </div>

                    <div className="space-y-1 text-sm">
                      <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                        <FaCar className="w-3 h-3" />
                        <span>{driver.vehicleType || "N/A"}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                        <FaPhone className="w-3 h-3" />
                        <span>{driver.phone || "N/A"}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                        <FaStar className="w-3 h-3" />
                        <span>Rating: {driver.rating?.toFixed(1) || "N/A"}</span>
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">
                        <span>Trips: {driver.completedTrips || 0}</span>
                      </div>
                    </div>

                    <div className="mt-3 flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setMapCenter([driver.location.lat, driver.location.lng])
                        }}
                        className="flex-1 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white py-1 px-3 rounded text-xs transition-colors"
                      >
                        Track
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDriverCall(driver)
                        }}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-1 px-3 rounded text-xs transition-colors"
                      >
                        Contact
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Trip Statistics */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center space-x-2">
                <FaCar className="w-5 h-5 text-green-500 dark:text-green-400" />
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Active Trips</p>
                  <p className="text-gray-800 dark:text-white text-xl font-bold">
                    {drivers.filter((d) => d.status === "active").length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center space-x-2">
                <FaUserAlt className="w-5 h-5 text-green-500 dark:text-green-400" />
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Total Drivers</p>
                  <p className="text-gray-800 dark:text-white text-xl font-bold">{drivers.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center space-x-2">
                <FaChartLine className="w-5 h-5 text-green-500 dark:text-green-400" />
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Avg Rating</p>
                  <p className="text-gray-800 dark:text-white text-xl font-bold">
                    {drivers.length > 0
                      ? (drivers.reduce((sum, d) => sum + (d.rating || 0), 0) / drivers.length).toFixed(1)
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center space-x-2">
                <FaTruck className="w-5 h-5 text-green-500 dark:text-green-400" />
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Coverage Area</p>
                  <p className="text-gray-800 dark:text-white text-xl font-bold">25 km</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Messages */}
        {Object.keys(errors).length > 0 && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <h4 className="font-bold">Errors:</h4>
            <ul className="list-disc list-inside">
              {Object.entries(errors).map(([key, message]) => (
                <li key={key}>
                  {key}: {message}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Stats Cards */}

      </div>
    </div>
  )
}
