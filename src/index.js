import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from 'react-router-dom'



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();






// "use client"

// import { useState, useEffect, useCallback } from "react"
// import { ArrowLeft, User, Shield, ChevronRight, ChevronDown, CreditCard, Smartphone, Building2, Wallet, IndianRupee, Loader2, Star, CheckCircle, Banknote, AlertCircle, History, Wifi, WifiOff, Download, Trash2, Search, Clock, XCircle, RefreshCw, Eye, EyeOff, Copy, Check } from "lucide-react"

// // Enhanced Payment History Hook
// const usePaymentHistory = () => {
//   const [paymentHistory, setPaymentHistory] = useState([])
//   const [isLoading, setIsLoading] = useState(true)

//   useEffect(() => {
//     const loadHistory = async () => {
//       setIsLoading(true)
//       try {
//         await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate loading
//         const savedHistory = localStorage.getItem("paymentHistory")
//         if (savedHistory) {
//           setPaymentHistory(JSON.parse(savedHistory))
//         }
//       } catch (error) {
//         console.error("Failed to load payment history:", error)
//       } finally {
//         setIsLoading(false)
//       }
//     }
//     loadHistory()
//   }, [])

//   const addPayment = useCallback(
//     (payment) => {
//       const newPayment = {
//         ...payment,
//         id: Date.now().toString(),
//         timestamp: new Date().toISOString(),
//         status: "completed",
//       }

//       const updatedHistory = [newPayment, ...paymentHistory].slice(0, 50)
//       setPaymentHistory(updatedHistory)
//       localStorage.setItem("paymentHistory", JSON.stringify(updatedHistory))
//     },
//     [paymentHistory],
//   )

//   const clearHistory = useCallback(() => {
//     setPaymentHistory([])
//     localStorage.removeItem("paymentHistory")
//   }, [])

//   return { paymentHistory, addPayment, clearHistory, isLoading }
// }

// // Enhanced Validation Functions
// const validateCardNumber = (cardNumber) => {
//   const cleaned = cardNumber.replace(/\s/g, "")
//   if (!cleaned) return "Card number is required"
//   if (cleaned.length < 13 || cleaned.length > 19) return "Card number must be 13-19 digits"
//   if (!/^\d+$/.test(cleaned)) return "Card number must contain only digits"

//   // Luhn algorithm
//   let sum = 0
//   let isEven = false
//   for (let i = cleaned.length - 1; i >= 0; i--) {
//     let digit = Number.parseInt(cleaned.charAt(i), 10)
//     if (isEven) {
//       digit *= 2
//       if (digit > 9) digit -= 9
//     }
//     sum += digit
//     isEven = !isEven
//   }
//   return sum % 10 !== 0 ? "Invalid card number" : ""
// }

// const validateExpiry = (expiry) => {
//   if (!expiry) return "Expiry date is required"
//   const [month, year] = expiry.split("/")
//   if (!month || !year) return "Invalid expiry format (MM/YY)"

//   const monthNum = Number.parseInt(month, 10)
//   const yearNum = Number.parseInt("20" + year, 10)

//   if (monthNum < 1 || monthNum > 12) return "Invalid month"

//   const currentDate = new Date()
//   const currentYear = currentDate.getFullYear()
//   const currentMonth = currentDate.getMonth() + 1

//   if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
//     return "Card has expired"
//   }
//   return ""
// }

// const validateCVV = (cvv) => {
//   if (!cvv) return "CVV is required"
//   if (cvv.length < 3 || cvv.length > 4) return "CVV must be 3-4 digits"
//   if (!/^\d+$/.test(cvv)) return "CVV must contain only digits"
//   return ""
// }

// const validateUPI = (upiId) => {
//   if (!upiId) return "UPI ID is required"
//   const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/
//   return !upiRegex.test(upiId) ? "Invalid UPI ID format" : ""
// }

// // Enhanced Razorpay Service
// class RazorpayService {
//   constructor() {
//     this.isTestMode = !process.env.REACT_APP_RAZORPAY_KEY_ID
//   }

//   async loadRazorpayScript() {
//     return new Promise((resolve) => {
//       if (typeof window.Razorpay !== "undefined") {
//         resolve(true)
//         return
//       }

//       const script = document.createElement("script")
//       script.src = "https://checkout.razorpay.com/v1/checkout.js"
//       script.onload = () => resolve(true)
//       script.onerror = () => resolve(false)
//       document.body.appendChild(script)
//     })
//   }

//   async createOrder(amount, currency = "INR") {
//     // In production, this should call your backend API
//     await new Promise((resolve) => setTimeout(resolve, 1000))

//     if (this.isTestMode) {
//       return {
//         id: "order_" + Math.random().toString(36).substr(2, 9),
//         amount: amount * 100,
//         currency,
//         status: "created",
//       }
//     }

//     // Real API call would go here
//     const response = await fetch("/api/create-order", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ amount, currency }),
//     })
//     return response.json()
//   }

//   async initializePayment(options) {
//     if (this.isTestMode) {
//       return this.mockPayment(options)
//     }

//     const scriptLoaded = await this.loadRazorpayScript()
//     if (!scriptLoaded) {
//       throw new Error("Razorpay SDK failed to load")
//     }

//     return new Promise((resolve, reject) => {
//       const rzp = new window.Razorpay({
//         key: process.env.REACT_APP_RAZORPAY_KEY_ID,
//         amount: options.amount * 100,
//         currency: "INR",
//         name: options.merchantName,
//         description: options.description,
//         order_id: options.orderId,
//         handler: (response) => {
//           resolve({
//             success: true,
//             paymentId: response.razorpay_payment_id,
//             orderId: response.razorpay_order_id,
//             signature: response.razorpay_signature,
//             method: options.method,
//           })
//         },
//         modal: {
//           ondismiss: () => reject(new Error("Payment cancelled by user")),
//         },
//         theme: { color: "#22c55e" },
//         prefill: options.prefill || {},
//       })
//       rzp.open()
//     })
//   }

//   async mockPayment(options) {
//     await new Promise((resolve) => setTimeout(resolve, 2000))
//     const isSuccess = Math.random() > 0.1 // 90% success rate

//     if (isSuccess) {
//       return {
//         success: true,
//         paymentId: "pay_" + Math.random().toString(36).substr(2, 9),
//         orderId: options.orderId,
//         signature: "sig_" + Math.random().toString(36).substr(2, 9),
//         method: options.method || "upi",
//       }
//     } else {
//       throw new Error("Payment failed. Please try again.")
//     }
//   }
// }

// // Payment History Component
// const PaymentHistory = ({ paymentHistory, onClearHistory, isLoading }) => {
//   const [searchTerm, setSearchTerm] = useState("")
//   const [statusFilter, setStatusFilter] = useState("all")
//   const [copiedId, setCopiedId] = useState("")

//   const filteredHistory = paymentHistory.filter((payment) => {
//     const matchesSearch =
//       payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       payment.paymentId.toLowerCase().includes(searchTerm.toLowerCase())
//     const matchesStatus = statusFilter === "all" || payment.status === statusFilter
//     return matchesSearch && matchesStatus
//   })

//   const formatDate = (timestamp) => {
//     return new Date(timestamp).toLocaleString("en-IN", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     })
//   }

//   const copyToClipboard = async (text, id) => {
//     try {
//       await navigator.clipboard.writeText(text)
//       setCopiedId(id)
//       setTimeout(() => setCopiedId(""), 2000)
//     } catch (err) {
//       console.error("Failed to copy:", err)
//     }
//   }

//   const downloadReceipt = (payment) => {
//     const receipt = `
// PAYMENT RECEIPT
// ===============
// Transaction ID: ${payment.paymentId}
// Order ID: ${payment.orderId}
// Amount: ₹${payment.amount.toLocaleString()}
// Method: ${payment.method}
// Status: ${payment.status}
// Date: ${formatDate(payment.timestamp)}
// Description: ${payment.description}
// ===============
// Thank you for your payment!`

//     const blob = new Blob([receipt], { type: "text/plain" })
//     const url = URL.createObjectURL(blob)
//     const a = document.createElement("a")
//     a.href = url
//     a.download = `receipt_${payment.paymentId}.txt`
//     document.body.appendChild(a)
//     a.click()
//     document.body.removeChild(a)
//     URL.revokeObjectURL(url)
//   }

//   if (isLoading) {
//     return (
//       <div className="bg-black/60 border border-green-500/20 rounded-lg backdrop-blur-sm">
//         <div className="p-8 text-center">
//           <Loader2 className="h-8 w-8 text-green-400 mx-auto mb-4 animate-spin" />
//           <p className="text-gray-400">Loading payment history...</p>
//         </div>
//       </div>
//     )
//   }

//   if (paymentHistory.length === 0) {
//     return (
//       <div className="bg-black/60 border border-green-500/20 rounded-lg backdrop-blur-sm">
//         <div className="p-8 text-center">
//           <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//           <h3 className="text-lg font-semibold text-white mb-2">No Payment History</h3>
//           <p className="text-gray-400">Your payment transactions will appear here</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-4">
//       {/* Search and Filter */}
//       <div className="bg-black/60 border border-green-500/20 rounded-lg backdrop-blur-sm">
//         <div className="p-4">
//           <div className="flex flex-col sm:flex-row gap-4">
//             <div className="relative flex-1">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//               <input
//                 placeholder="Search transactions..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 bg-gray-800/50 border border-green-500/30 rounded-md py-2 px-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500"
//               />
//             </div>
//             <div className="flex gap-2 flex-wrap">
//               {["all", "completed", "failed", "pending"].map((status) => (
//                 <button
//                   key={status}
//                   onClick={() => setStatusFilter(status)}
//                   className={`px-3 py-1 rounded-md text-sm capitalize ${
//                     statusFilter === status
//                       ? "bg-green-600 hover:bg-green-700 text-white"
//                       : "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700"
//                   }`}
//                 >
//                   {status}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Payment History List */}
//       <div className="bg-black/60 border border-green-500/20 rounded-lg backdrop-blur-sm">
//         <div className="p-0">
//           <div className="flex justify-between items-center p-4 pb-3">
//             <h3 className="text-lg font-semibold text-white">Payment History</h3>
//             <button
//               onClick={onClearHistory}
//               className="flex items-center gap-1 px-3 py-1 rounded-md text-sm text-red-400 border border-red-500/30 hover:bg-red-500/20"
//             >
//               <Trash2 className="h-4 w-4" />
//               Clear All
//             </button>
//           </div>

//           <div className="max-h-96 overflow-y-auto">
//             {filteredHistory.map((payment, index) => (
//               <div key={payment.id}>
//                 <div className="p-4 hover:bg-gray-800/30 transition-colors">
//                   <div className="flex justify-between items-start mb-2">
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center gap-2 mb-1 flex-wrap">
//                         {payment.status === "completed" && <CheckCircle className="h-4 w-4 text-green-500" />}
//                         {payment.status === "failed" && <XCircle className="h-4 w-4 text-red-500" />}
//                         {payment.status === "pending" && <Clock className="h-4 w-4 text-yellow-500" />}
//                         <span
//                           className={`px-2 py-0.5 rounded-full text-xs ${
//                             payment.status === "completed"
//                               ? "bg-green-500/20 text-green-400"
//                               : payment.status === "failed"
//                               ? "bg-red-500/20 text-red-400"
//                               : "bg-yellow-500/20 text-yellow-400"
//                           }`}
//                         >
//                           {payment.status}
//                         </span>
//                         <span className="text-xs text-gray-400">{formatDate(payment.timestamp)}</span>
//                       </div>
//                       <p className="text-sm text-gray-300 mb-1 truncate">{payment.description}</p>
//                       <div className="flex items-center gap-2 text-xs text-gray-400 flex-wrap">
//                         <span className="flex items-center gap-1">
//                           ID: {payment.paymentId.slice(0, 12)}...
//                           <button
//                             onClick={() => copyToClipboard(payment.paymentId, payment.id)}
//                             className="h-4 w-4 p-0 hover:text-green-400"
//                           >
//                             {copiedId === payment.id ? (
//                               <Check className="h-3 w-3 text-green-400" />
//                             ) : (
//                               <Copy className="h-3 w-3" />
//                             )}
//                           </button>
//                         </span>
//                         <span>Method: {payment.method}</span>
//                       </div>
//                     </div>
//                     <div className="text-right ml-4">
//                       <div className="flex items-center gap-1 text-lg font-bold text-green-400 mb-2">
//                         <IndianRupee className="h-4 w-4" />
//                         {payment.amount.toLocaleString()}
//                       </div>
//                       <button
//                         onClick={() => downloadReceipt(payment)}
//                         className="text-green-400 hover:text-green-300 p-1"
//                       >
//                         <Download className="h-3 w-3" />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//                 {index < filteredHistory.length - 1 && (
//                   <div className="h-px bg-green-500/10 w-full"></div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// // Main Component
// export default function EnhancedRazorpayInterface() {
//   const [selectedMethod, setSelectedMethod] = useState("")
//   const [isProcessing, setIsProcessing] = useState(false)
//   const [showSuccessPopup, setShowSuccessPopup] = useState(false)
//   const [showErrorPopup, setShowErrorPopup] = useState(false)
//   const [expandedSection, setExpandedSection] = useState(null)
//   const [activeTab, setActiveTab] = useState("payment")
//   const [isOnline, setIsOnline] = useState(navigator.onLine)
//   const [errorMessage, setErrorMessage] = useState("")
//   const [loadingStates, setLoadingStates] = useState({
//     validation: false,
//     orderCreation: false,
//     paymentProcessing: false,
//   })
//   const [showCVV, setShowCVV] = useState(false)
//   const [paymentProgress, setPaymentProgress] = useState(0)

//   const { paymentHistory, addPayment, clearHistory, isLoading: historyLoading } = usePaymentHistory()
//   const razorpayService = new RazorpayService()

//   const [cardDetails, setCardDetails] = useState({
//     number: "",
//     expiry: "",
//     cvv: "",
//     name: "",
//   })

//   const [upiDetails, setUpiDetails] = useState({ upiId: "" })
//   const [validationErrors, setValidationErrors] = useState({})
//   const [touchedFields, setTouchedFields] = useState({})

//   const paymentDetails = {
//     amount: 6000,
//     description: "Idhar Udhar Premium Service",
//     orderId: "ORDER_" + Date.now(),
//     merchant: "Idhar Udhar",
//   }

//   // Network monitoring
//   useEffect(() => {
//     const handleOnline = () => setIsOnline(true)
//     const handleOffline = () => setIsOnline(false)
//     window.addEventListener("online", handleOnline)
//     window.addEventListener("offline", handleOffline)
//     return () => {
//       window.removeEventListener("online", handleOnline)
//       window.removeEventListener("offline", handleOffline)
//     }
//   }, [])

//   // Real-time validation
//   useEffect(() => {
//     const validateFields = async () => {
//       if (Object.keys(touchedFields).length === 0) return

//       setLoadingStates((prev) => ({ ...prev, validation: true }))

//       // Simulate validation delay
//       await new Promise((resolve) => setTimeout(resolve, 300))

//       const errors = {}

//       if (touchedFields.cardNumber) {
//         const cardError = validateCardNumber(cardDetails.number)
//         if (cardError) errors.cardNumber = cardError
//       }

//       if (touchedFields.expiry) {
//         const expiryError = validateExpiry(cardDetails.expiry)
//         if (expiryError) errors.expiry = expiryError
//       }

//       if (touchedFields.cvv) {
//         const cvvError = validateCVV(cardDetails.cvv)
//         if (cvvError) errors.cvv = cvvError
//       }

//       if (touchedFields.name && cardDetails.name.length < 2) {
//         errors.name = "Name must be at least 2 characters"
//       }

//       if (touchedFields.upiId) {
//         const upiError = validateUPI(upiDetails.upiId)
//         if (upiError) errors.upiId = upiError
//       }

//       setValidationErrors(errors)
//       setLoadingStates((prev) => ({ ...prev, validation: false }))
//     }

//     validateFields()
//   }, [cardDetails, upiDetails, touchedFields])

//   const handleFieldTouch = (fieldName) => {
//     setTouchedFields((prev) => ({ ...prev, [fieldName]: true }))
//   }

//   const validateForm = (method) => {
//     const errors = {}

//     if (method === "card" || method === "card-quick") {
//       const cardError = validateCardNumber(cardDetails.number)
//       const expiryError = validateExpiry(cardDetails.expiry)
//       const cvvError = validateCVV(cardDetails.cvv)
//       const nameError = cardDetails.name.length < 2 ? "Name is required" : ""

//       if (cardError) errors.cardNumber = cardError
//       if (expiryError) errors.expiry = expiryError
//       if (cvvError) errors.cvv = cvvError
//       if (nameError) errors.name = nameError
//     }

//     if (method === "upi" && upiDetails.upiId) {
//       const upiError = validateUPI(upiDetails.upiId)
//       if (upiError) errors.upiId = upiError
//     }

//     setValidationErrors(errors)
//     return Object.keys(errors).length === 0
//   }

//   const handlePayment = async () => {
//     if (!isOnline) {
//       setErrorMessage("No internet connection. Please check your network and try again.")
//       setShowErrorPopup(true)
//       return
//     }

//     const method = selectedMethod || "upi"

//     if (!validateForm(method)) {
//       setErrorMessage("Please fix the validation errors before proceeding.")
//       setShowErrorPopup(true)
//       return
//     }

//     setIsProcessing(true)
//     setPaymentProgress(0)
//     setErrorMessage("")

//     try {
//       // Step 1: Create order
//       setLoadingStates((prev) => ({ ...prev, orderCreation: true }))
//       setPaymentProgress(25)

//       const order = await razorpayService.createOrder(paymentDetails.amount)

//       setLoadingStates((prev) => ({ ...prev, orderCreation: false, paymentProcessing: true }))
//       setPaymentProgress(50)

//       // Step 2: Initialize payment
//       const paymentOptions = {
//         amount: paymentDetails.amount,
//         orderId: order.id,
//         merchantName: paymentDetails.merchant,
//         description: paymentDetails.description,
//         method: method,
//         prefill: {
//           name: cardDetails.name,
//           email: "user@example.com", // In real app, get from user profile
//           contact: "9999999999", // In real app, get from user profile
//         },
//       }

//       setPaymentProgress(75)
//       const result = await razorpayService.initializePayment(paymentOptions)

//       setPaymentProgress(100)

//       if (result.success) {
//         // Add to payment history
//         addPayment({
//           paymentId: result.paymentId,
//           orderId: result.orderId,
//           amount: paymentDetails.amount,
//           method: result.method || method,
//           description: paymentDetails.description,
//         })

//         setShowSuccessPopup(true)
//       }
//     } catch (error) {
//       console.error("Payment failed:", error)
//       setErrorMessage(error.message || "Payment failed. Please try again.")
//       setShowErrorPopup(true)
//     } finally {
//       setIsProcessing(false)
//       setPaymentProgress(0)
//       setLoadingStates({
//         validation: false,
//         orderCreation: false,
//         paymentProcessing: false,
//       })
//     }
//   }

//   const formatCardNumber = (value) => {
//     const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
//     const matches = v.match(/\d{4,16}/g)
//     const match = (matches && matches[0]) || ""
//     const parts = []
//     for (let i = 0, len = match.length; i < len; i += 4) {
//       parts.push(match.substring(i, i + 4))
//     }
//     return parts.length ? parts.join(" ") : v
//   }

//   const formatExpiry = (value) => {
//     const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
//     if (v.length >= 2) {
//       return v.substring(0, 2) + "/" + v.substring(2, 4)
//     }
//     return v
//   }

//   const toggleSection = (section) => {
//     setExpandedSection(expandedSection === section ? null : section)
//   }

//   const handleMethodSelect = (method) => {
//     setSelectedMethod(method)
//   }

//   const renderValidationError = (fieldName) => {
//     if (validationErrors[fieldName]) {
//       return (
//         <div className="flex items-center gap-1 text-red-400 text-xs mt-1">
//           <AlertCircle className="h-3 w-3" />
//           {validationErrors[fieldName]}
//         </div>
//       )
//     }
//     return null
//   }

//   const renderLoadingIndicator = (isLoading, text) => {
//     if (!isLoading) return null
//     return (
//       <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
//         <Loader2 className="h-3 w-3 animate-spin" />
//         {text}
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-900 relative overflow-hidden">
//       {/* Network Status */}
//       {!isOnline && (
//         <div className="fixed top-0 left-0 right-0 bg-red-600 text-white text-center py-2 z-50">
//           <div className="flex items-center justify-center gap-2">
//             <WifiOff className="h-4 w-4" />
//             <span className="text-sm">No internet connection</span>
//           </div>
//         </div>
//       )}

//       {/* Payment Progress */}
//       {isProcessing && (
//         <div className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-sm z-40 p-4">
//           <div className="max-w-md mx-auto">
//             <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
//               <div
//                 className="bg-green-500 h-2 rounded-full transition-all duration-300"
//                 style={{ width: `${paymentProgress}%` }}
//               ></div>
//             </div>
//             <div className="text-center text-white text-sm">
//               {loadingStates.orderCreation && "Creating order..."}
//               {loadingStates.paymentProcessing && "Processing payment..."}
//               {paymentProgress === 100 && "Payment successful!"}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Background Effects */}
//       <div className="absolute inset-0 opacity-10">
//         <div className="absolute top-20 left-10 w-32 h-32 bg-green-500 rounded-full blur-3xl animate-pulse"></div>
//         <div className="absolute top-40 right-20 w-24 h-24 bg-green-400 rounded-full blur-2xl animate-pulse delay-1000"></div>
//         <div className="absolute bottom-20 left-20 w-40 h-40 bg-green-600 rounded-full blur-3xl animate-pulse delay-2000"></div>
//         <div className="absolute bottom-40 right-10 w-28 h-28 bg-green-300 rounded-full blur-2xl animate-pulse delay-3000"></div>
//       </div>

//       <div
//         className={`relative z-10 flex items-center justify-center min-h-screen p-2 sm:p-4 ${!isOnline ? "pt-16" : ""}`}
//       >
//         <div className="w-full max-w-md">
//           {/* Header */}
//           <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg mb-4 sm:mb-6 shadow-2xl">
//             <div className="p-3 sm:p-4">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2 sm:gap-3">
//                   <button className="text-white hover:bg-white/10 rounded-full p-2">
//                     <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
//                   </button>
//                   <div>
//                     <h1 className="text-lg sm:text-xl font-bold text-white">{paymentDetails.merchant}</h1>
//                     <div className="flex items-center gap-1">
//                       <Shield className="h-3 w-3 text-green-200" />
//                       <span className="text-green-200 text-xs">Razorpay Trusted Business</span>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   {isOnline ? (
//                     <Wifi className="h-4 w-4 text-green-200" />
//                   ) : (
//                     <WifiOff className="h-4 w-4 text-red-300" />
//                   )}
//                   <button className="text-white hover:bg-white/10 rounded-full p-2">
//                     <User className="h-4 w-4 sm:h-5 sm:w-5" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Main Tabs */}
//           <div className="space-y-4">
//             <div className="grid w-full grid-cols-2 bg-black/60 border border-green-500/20 rounded-lg p-1">
//               <button
//                 onClick={() => setActiveTab("payment")}
//                 className={`rounded-md py-1.5 px-3 text-sm font-medium transition-all flex items-center justify-center ${
//                   activeTab === "payment" ? "bg-green-600 text-white" : "text-gray-300 hover:text-white"
//                 }`}
//               >
//                 <CreditCard className="h-4 w-4 mr-2" />
//                 <span className="hidden sm:inline">Payment</span>
//                 <span className="sm:hidden">Pay</span>
//               </button>
//               <button
//                 onClick={() => setActiveTab("history")}
//                 className={`rounded-md py-1.5 px-3 text-sm font-medium transition-all flex items-center justify-center ${
//                   activeTab === "history" ? "bg-green-600 text-white" : "text-gray-300 hover:text-white"
//                 }`}
//               >
//                 <History className="h-4 w-4 mr-2" />
//                 <span className="hidden sm:inline">History</span>
//                 <span className="sm:hidden">History</span>
//                 {paymentHistory.length > 0 && (
//                   <span className="ml-2 bg-gray-700 text-xs rounded-full px-2 py-0.5">
//                     {paymentHistory.length}
//                   </span>
//                 )}
//               </button>
//             </div>

//             {activeTab === "payment" && (
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <h2 className="text-xl sm:text-2xl font-bold text-white">Payment Options</h2>
//                   {loadingStates.validation && <Loader2 className="h-4 w-4 text-green-400 animate-spin" />}
//                 </div>

//                 {/* Recommended Section */}
//                 <div className="bg-black/80 border-2 border-green-500 rounded-lg backdrop-blur-sm shadow-xl">
//                   <div className="p-3 sm:p-4">
//                     <div className="flex items-center justify-between mb-3">
//                       <span className="px-2 py-0.5 rounded-md text-xs bg-green-500/20 text-green-400 border border-green-500/30">
//                         💡 Recommended
//                       </span>
//                       <div className="flex items-center gap-1">
//                         <Star className="h-3 w-3 text-yellow-400 fill-current" />
//                         <span className="text-yellow-400 text-xs">Fastest</span>
//                       </div>
//                     </div>

//                     <div className="space-y-3">
//                       <button
//                         onClick={() => handleMethodSelect("upi-recommended")}
//                         className="w-full flex justify-between items-center h-10 sm:h-12 hover:bg-green-500/20 border border-green-500/30 text-white hover:text-white text-sm sm:text-base rounded-md px-3"
//                       >
//                         <div className="flex items-center gap-2 sm:gap-3">
//                           <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded flex items-center justify-center">
//                             <Smartphone className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
//                           </div>
//                           <span className="font-medium">UPI (Google Pay, PhonePe)</span>
//                         </div>
//                         <ChevronRight className="h-4 w-4 text-green-400" />
//                       </button>

//                       {/* Quick Card Payment */}
//                       <div className="space-y-3">
//                         <button
//                           onClick={() => toggleSection("card-quick")}
//                           className="w-full flex justify-between items-center h-10 sm:h-12 hover:bg-green-500/20 border border-green-500/30 text-white hover:text-white text-sm sm:text-base rounded-md px-3"
//                         >
//                           <div className="flex items-center gap-2 sm:gap-3">
//                             <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
//                             <span className="font-medium">Pay Via Card</span>
//                           </div>
//                           <ChevronDown
//                             className={`h-4 w-4 text-green-400 transition-transform ${
//                               expandedSection === "card-quick" ? "rotate-180" : ""
//                             }`}
//                           />
//                         </button>

//                         {expandedSection === "card-quick" && (
//                           <div className="space-y-3 p-3 bg-gray-800/30 rounded-lg">
//                             <div className="space-y-2">
//                               <label className="text-gray-300 text-sm">Card Number</label>
//                               <input
//                                 placeholder="1234 5678 9012 3456"
//                                 value={cardDetails.number}
//                                 onChange={(e) =>
//                                   setCardDetails({ ...cardDetails, number: formatCardNumber(e.target.value) })
//                                 }
//                                 onBlur={() => handleFieldTouch("cardNumber")}
//                                 maxLength={19}
//                                 className={`w-full bg-gray-800/50 border border-green-500/30 rounded-md py-2 px-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500 ${
//                                   validationErrors.cardNumber ? "border-red-500" : ""
//                                 }`}
//                               />
//                               {renderValidationError("cardNumber")}
//                               {renderLoadingIndicator(
//                                 loadingStates.validation && touchedFields.cardNumber,
//                                 "Validating...",
//                               )}
//                             </div>

//                             <div className="grid grid-cols-2 gap-3">
//                               <div className="space-y-2">
//                                 <label className="text-gray-300 text-sm">Expiry</label>
//                                 <input
//                                   placeholder="MM/YY"
//                                   value={cardDetails.expiry}
//                                   onChange={(e) =>
//                                     setCardDetails({ ...cardDetails, expiry: formatExpiry(e.target.value) })
//                                   }
//                                   onBlur={() => handleFieldTouch("expiry")}
//                                   maxLength={5}
//                                   className={`w-full bg-gray-800/50 border border-green-500/30 rounded-md py-2 px-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500 ${
//                                     validationErrors.expiry ? "border-red-500" : ""
//                                   }`}
//                                 />
//                                 {renderValidationError("expiry")}
//                               </div>
//                               <div className="space-y-2">
//                                 <label className="text-gray-300 text-sm">CVV</label>
//                                 <div className="relative">
//                                   <input
//                                     placeholder="123"
//                                     value={cardDetails.cvv}
//                                     onChange={(e) =>
//                                       setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/g, "") })
//                                     }
//                                     onBlur={() => handleFieldTouch("cvv")}
//                                     maxLength={4}
//                                     type={showCVV ? "text" : "password"}
//                                     className={`w-full bg-gray-800/50 border border-green-500/30 rounded-md py-2 px-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500 pr-10 ${
//                                       validationErrors.cvv ? "border-red-500" : ""
//                                     }`}
//                                   />
//                                   <button
//                                     type="button"
//                                     onClick={() => setShowCVV(!showCVV)}
//                                     className="absolute right-0 top-0 h-full w-10 flex items-center justify-center hover:bg-transparent"
//                                   >
//                                     {showCVV ? (
//                                       <EyeOff className="h-4 w-4 text-gray-400" />
//                                     ) : (
//                                       <Eye className="h-4 w-4 text-gray-400" />
//                                     )}
//                                   </button>
//                                 </div>
//                                 {renderValidationError("cvv")}
//                               </div>
//                             </div>

//                             <div className="space-y-2">
//                               <label className="text-gray-300 text-sm">Cardholder Name</label>
//                               <input
//                                 placeholder="Name on card"
//                                 value={cardDetails.name}
//                                 onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
//                                 onBlur={() => handleFieldTouch("name")}
//                                 className={`w-full bg-gray-800/50 border border-green-500/30 rounded-md py-2 px-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500 ${
//                                   validationErrors.name ? "border-red-500" : ""
//                                 }`}
//                               />
//                               {renderValidationError("name")}
//                             </div>
//                           </div>
//                         )}
//                       </div>
                    
//                                         </div>
//                   </div>
//                 </div>

//                 {/* All Payment Options */}
//                 <div className="space-y-3">
//                   <h3 className="text-base sm:text-lg font-semibold text-gray-300">All Payment Options</h3>

//                   {/* UPI Section */}
//                   <div className="bg-black/60 border border-green-500/20 rounded-lg backdrop-blur-sm hover:border-green-500/40 transition-all">
//                     <button
//                       onClick={() => toggleSection("upi")}
//                       className="w-full flex justify-between items-center h-12 sm:h-14 p-3 sm:p-4 text-white hover:text-white hover:bg-green-500/10 text-sm sm:text-base"
//                     >
//                       <div className="flex items-center gap-2 sm:gap-3">
//                         <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded flex items-center justify-center">
//                           <Smartphone className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
//                         </div>
//                         <span className="font-medium">UPI</span>
//                         <div className="flex items-center gap-1">
//                           {["G", "P", "₹"].map((icon, i) => (
//                             <div
//                               key={i}
//                               className={`w-4 h-4 sm:w-5 sm:h-5 ${
//                                 ["bg-blue-500", "bg-purple-600", "bg-blue-600"][i]
//                               } rounded-sm flex items-center justify-center`}
//                             >
//                               <span className="text-xs font-bold text-white">{icon}</span>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                       <ChevronDown
//                         className={`h-4 w-4 text-green-400 transition-transform ${
//                           expandedSection === "upi" ? "rotate-180" : ""
//                         }`}
//                       />
//                     </button>

//                     {expandedSection === "upi" && (
//                       <div className="p-3 sm:p-4 pt-0 space-y-3">
//                         <div className="grid grid-cols-2 gap-2 sm:gap-3">
//                           {[
//                             { name: "Google Pay", color: "bg-blue-500", icon: "G" },
//                             { name: "PhonePe", color: "bg-purple-600", icon: "P" },
//                             { name: "Paytm", color: "bg-blue-600", icon: "₹" },
//                             { name: "BHIM UPI", color: "bg-orange-600", icon: "B" },
//                           ].map((app) => (
//                             <button
//                               key={app.name}
//                               onClick={() => handleMethodSelect(app.name)}
//                               className="h-10 sm:h-12 bg-gray-800/50 hover:bg-green-500/20 border border-green-500/30 text-white hover:text-white text-xs sm:text-sm rounded-md flex items-center justify-center gap-1 sm:gap-2"
//                             >
//                               <div
//                                 className={`w-5 h-5 sm:w-6 sm:h-6 ${app.color} rounded flex items-center justify-center`}
//                               >
//                                 <span className="text-xs font-bold text-white">{app.icon}</span>
//                               </div>
//                               <span className="font-medium">{app.name}</span>
//                             </button>
//                           ))}
//                         </div>
//                         <div className="h-px bg-green-500/20 w-full"></div>
//                         <div className="space-y-2">
//                           <label className="text-gray-300 text-sm">Enter UPI ID</label>
//                           <input
//                             placeholder="yourname@upi"
//                             value={upiDetails.upiId}
//                             onChange={(e) => setUpiDetails({ ...upiDetails, upiId: e.target.value })}
//                             onBlur={() => handleFieldTouch("upiId")}
//                             className={`w-full bg-gray-800/50 border border-green-500/30 rounded-md py-2 px-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500 ${
//                               validationErrors.upiId ? "border-red-500" : ""
//                             }`}
//                           />
//                           {renderValidationError("upiId")}
//                           {renderLoadingIndicator(
//                             loadingStates.validation && touchedFields.upiId,
//                             "Validating UPI ID...",
//                           )}
//                         </div>
//                       </div>
//                     )}
//                   </div>

//                   {/* Cards Section */}
//                   <div className="bg-black/60 border border-green-500/20 rounded-lg backdrop-blur-sm hover:border-green-500/40 transition-all">
//                     <button
//                       onClick={() => toggleSection("cards")}
//                       className="w-full flex justify-between items-center h-12 sm:h-14 p-3 sm:p-4 text-white hover:text-white hover:bg-green-500/10 text-sm sm:text-base"
//                     >
//                       <div className="flex items-center gap-2 sm:gap-3">
//                         <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
//                         <span className="font-medium">Cards</span>
//                         <div className="flex items-center gap-1">
//                           {["V", "M", "R"].map((icon, i) => (
//                             <div
//                               key={i}
//                               className={`w-5 h-3 sm:w-6 sm:h-4 ${
//                                 ["bg-blue-600", "bg-red-600", "bg-orange-600"][i]
//                               } rounded-sm flex items-center justify-center`}
//                             >
//                               <span className="text-xs font-bold text-white">{icon}</span>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                       <ChevronDown
//                         className={`h-4 w-4 text-green-400 transition-transform ${
//                           expandedSection === "cards" ? "rotate-180" : ""
//                         }`}
//                       />
//                     </button>

//                     {expandedSection === "cards" && (
//                       <div className="p-3 sm:p-4 pt-0 space-y-3">
//                         <div className="bg-blue-500/10 border border-blue-500/30 rounded-md p-3 flex items-start gap-2">
//                           <AlertCircle className="h-4 w-4 text-blue-400 mt-0.5" />
//                           <p className="text-blue-300 text-sm">
//                             Your card details are encrypted and secure
//                           </p>
//                         </div>

//                         <div className="space-y-3 p-3 bg-gray-800/30 rounded-lg">
//                           <div className="space-y-2">
//                             <label className="text-gray-300 text-sm">Card Number</label>
//                             <input
//                               placeholder="1234 5678 9012 3456"
//                               value={cardDetails.number}
//                               onChange={(e) =>
//                                 setCardDetails({ ...cardDetails, number: formatCardNumber(e.target.value) })
//                               }
//                               onBlur={() => handleFieldTouch("cardNumber")}
//                               maxLength={19}
//                               className={`w-full bg-gray-800/50 border border-green-500/30 rounded-md py-2 px-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500 ${
//                                 validationErrors.cardNumber ? "border-red-500" : ""
//                               }`}
//                             />
//                             {renderValidationError("cardNumber")}
//                           </div>

//                           <div className="grid grid-cols-2 gap-3">
//                             <div className="space-y-2">
//                               <label className="text-gray-300 text-sm">Expiry</label>
//                               <input
//                                 placeholder="MM/YY"
//                                 value={cardDetails.expiry}
//                                 onChange={(e) =>
//                                   setCardDetails({ ...cardDetails, expiry: formatExpiry(e.target.value) })
//                                 }
//                                 onBlur={() => handleFieldTouch("expiry")}
//                                 maxLength={5}
//                                 className={`w-full bg-gray-800/50 border border-green-500/30 rounded-md py-2 px-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500 ${
//                                   validationErrors.expiry ? "border-red-500" : ""
//                                 }`}
//                               />
//                               {renderValidationError("expiry")}
//                             </div>
//                             <div className="space-y-2">
//                               <label className="text-gray-300 text-sm">CVV</label>
//                               <div className="relative">
//                                 <input
//                                   placeholder="123"
//                                   value={cardDetails.cvv}
//                                   onChange={(e) =>
//                                     setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/g, "") })
//                                   }
//                                   onBlur={() => handleFieldTouch("cvv")}
//                                   maxLength={4}
//                                   type={showCVV ? "text" : "password"}
//                                   className={`w-full bg-gray-800/50 border border-green-500/30 rounded-md py-2 px-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500 pr-10 ${
//                                     validationErrors.cvv ? "border-red-500" : ""
//                                   }`}
//                                 />
//                                 <button
//                                   type="button"
//                                   onClick={() => setShowCVV(!showCVV)}
//                                   className="absolute right-0 top-0 h-full w-10 flex items-center justify-center hover:bg-transparent"
//                                 >
//                                   {showCVV ? (
//                                     <EyeOff className="h-4 w-4 text-gray-400" />
//                                   ) : (
//                                     <Eye className="h-4 w-4 text-gray-400" />
//                                   )}
//                                 </button>
//                               </div>
//                               {renderValidationError("cvv")}
//                             </div>
//                           </div>

//                           <div className="space-y-2">
//                             <label className="text-gray-300 text-sm">Cardholder Name</label>
//                             <input
//                               placeholder="Name on card"
//                               value={cardDetails.name}
//                               onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
//                               onBlur={() => handleFieldTouch("name")}
//                               className={`w-full bg-gray-800/50 border border-green-500/30 rounded-md py-2 px-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500 ${
//                                 validationErrors.name ? "border-red-500" : ""
//                               }`}
//                             />
//                             {renderValidationError("name")}
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </div>




//                 </div>

//                 {/* Bottom Payment Section */}
//                 <div className="bg-black/80 border border-green-500/30 rounded-lg backdrop-blur-sm mt-6 sticky bottom-2 sm:bottom-4">
//                   <div className="p-3 sm:p-4">
//                     <div className="flex items-center justify-between mb-4">
//                       <div>
//                         <div className="flex items-center gap-1">
//                           <IndianRupee className="h-5 w-5 sm:h-6 sm:w-6 text-green-400" />
//                           <span className="text-2xl sm:text-3xl font-bold text-white">
//                             {paymentDetails.amount.toLocaleString()}
//                           </span>
//                         </div>
//                         <button className="text-green-400 text-sm hover:text-green-300">
//                           View Details
//                         </button>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <Shield className="h-4 w-4 text-green-400" />
//                         <span className="text-xs text-gray-400">Secured</span>
//                       </div>
//                     </div>

//                     <button
//                       onClick={handlePayment}
//                       disabled={isProcessing || !isOnline}
//                       className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 sm:py-4 text-base sm:text-lg rounded-md shadow-lg disabled:opacity-50 relative overflow-hidden"
//                     >
//                       {isProcessing ? (
//                         <>
//                           <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin inline" />
//                           {loadingStates.orderCreation && "Creating Order..."}
//                           {loadingStates.paymentProcessing && "Processing Payment..."}
//                           {!loadingStates.orderCreation && !loadingStates.paymentProcessing && "Processing..."}
//                         </>
//                       ) : (
//                         "Continue"
//                       )}
//                     </button>

//                     <div className="text-center mt-3">
//                       <p className="text-xs text-gray-500">
//                         By proceeding, you agree to our{" "}
//                         <button className="text-green-400 hover:text-green-300">
//                           Terms & Conditions
//                         </button>
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {activeTab === "history" && (
//               <PaymentHistory
//                 paymentHistory={paymentHistory}
//                 onClearHistory={clearHistory}
//                 isLoading={historyLoading}
//               />
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Success Popup */}
//       {showSuccessPopup && (
//         <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//           <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg max-w-sm w-full p-6">
//             <div className="text-center">
//               <div className="mx-auto mb-4 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
//                 <CheckCircle className="h-8 w-8 text-white" />
//               </div>
//               <h2 className="text-2xl font-bold text-green-800 mb-2">Payment Successful!</h2>
//             </div>
//             <div className="text-center space-y-4">
//               <div className="bg-white/80 rounded-lg p-4 space-y-2">
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-600">Amount Paid</span>
//                   <span className="font-bold text-green-700">₹{paymentDetails.amount.toLocaleString()}</span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-600">Transaction ID</span>
//                   <span className="font-mono text-sm text-gray-800">{paymentDetails.orderId}</span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-600">Payment Method</span>
//                   <span className="text-gray-800 capitalize">{selectedMethod || "UPI"}</span>
//                 </div>
//               </div>

//               <div className="space-y-3">
//                 <button
//                   onClick={() => setShowSuccessPopup(false)}
//                   className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md"
//                 >
//                   Continue
//                 </button>
//                 <button
//                   onClick={() => setShowSuccessPopup(false)}
//                   className="w-full border border-green-300 text-green-700 hover:bg-green-50 py-2 rounded-md"
//                 >
//                   Download Receipt
//                 </button>
//               </div>

//               <p className="text-xs text-gray-500 mt-4">
//                 A confirmation message has been sent to your registered email and phone number.
//               </p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Error Popup */}
//       {showErrorPopup && (
//         <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//           <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-lg max-w-sm w-full p-6">
//             <div className="text-center">
//               <div className="mx-auto mb-4 w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
//                 <AlertCircle className="h-8 w-8 text-white" />
//               </div>
//               <h2 className="text-2xl font-bold text-red-800 mb-2">Payment Failed</h2>
//             </div>
//             <div className="text-center space-y-4">
//               <div className="bg-white/80 rounded-lg p-4">
//                 <p className="text-red-700 text-sm">{errorMessage}</p>
//               </div>

//               <div className="space-y-3">
//                 <button
//                   onClick={() => setShowErrorPopup(false)}
//                   className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md flex items-center justify-center"
//                 >
//                   <RefreshCw className="h-4 w-4 mr-2" />
//                   Try Again
//                 </button>
//                 <button
//                   onClick={() => setShowErrorPopup(false)}
//                   className="w-full border border-red-300 text-red-700 hover:bg-red-50 py-2 rounded-md"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }