"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import {
  ShieldIcon as UserShield,
  Edit,
  Trash2,
  Plus,
  Search,
  Lock,
  Unlock,
  UserCog,
  IndianRupee,
  Headphones,
  Users,
  Wifi,
  WifiOff,
  Camera,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  User,
} from "lucide-react"
import { useAdminSocket } from "../hooks/useSocket"
import axios from "axios";

// Enhanced Notification Component
const Notification = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isVisible) return null;

  const bgColor = {
    success: 'bg-emerald-500',
    error: 'bg-rose-500',
    info: 'bg-blue-500',
    warning: 'bg-amber-400'
  }[type];

  const icon = {
    success: <Check className="w-5 h-5 mr-2" />,
    error: <X className="w-5 h-5 mr-2" />,
    info: <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    warning: <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
  }[type];

  return (
    <div className={`fixed bottom-7 right-4 z-50 transition-all duration-300 ${isVisible ? 'animate-fade-in-up' : 'animate-fade-out-right'}`}>
      <div className={`${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-start justify-between min-w-[300px] max-w-md`}>
        <div className="flex items-start">
          {icon}
          <span className="text-sm">{message}</span>
        </div>
        <button
          onClick={() => { setIsVisible(false); setTimeout(onClose, 300); }}
          className="ml-4 text-white hover:text-gray-200 focus:outline-none"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Enhanced SkeletonLoader with better animations
const SkeletonLoader = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="h-9 w-56 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-grow h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        </div>
      </div>
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px] space-y-2">
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        </div>
        <div className="flex-1 min-w-[200px] space-y-2">
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {[...Array(4)].map((_, i) => (
                  <th key={i} className="px-6 py-3">
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-600 rounded mx-auto animate-pulse"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {[...Array(5)].map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {[...Array(4)].map((_, cellIndex) => (
                    <td key={cellIndex} className="px-6 py-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// Enhanced role definitions with better colors
const roles = [
  {
    value: "super_admin",
    label: "Super Admin",
    icon: <Users className="w-4 h-4" />,
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
  },
  {
    value: "finance",
    label: "Finance",
    icon: <IndianRupee className="w-4 h-4" />,
    color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
  },
  {
    value: "support",
    label: "Support",
    icon: <Headphones className="w-4 h-4" />,
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
  },
]

const permissionCategories = [
  { name: "users", label: "User Management", icon: <Users className="w-4 h-4" /> },
  { name: "vehicles", label: "Vehicle Management", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg> },
  { name: "bookings", label: "Booking Management", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg> },
  { name: "payments", label: "Payment Management", icon: <IndianRupee className="w-4 h-4" /> },
  { name: "settings", label: "System Settings", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
]

const API_BASE_URL = "https://panalsbackend-production.up.railway.app/api"

export default function AdminManagement() {
  const [admins, setAdmins] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [currentAdmin, setCurrentAdmin] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "support",
    status: "active",
    permissions: {
      users: { read: false, write: false, delete: false },
      vehicles: { read: false, write: false, delete: false },
      bookings: { read: false, write: false, delete: false },
      payments: { read: false, write: false, delete: false },
      settings: { read: false, write: false, delete: false }
    },
  })
  const [adminSelfie, setAdminSelfie] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [realtimeMessage, setRealtimeMessage] = useState("")
  const [notifications, setNotifications] = useState([])
  const [showCamera, setShowCamera] = useState(false)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [expandedPermissions, setExpandedPermissions] = useState({})

  // Notification helpers
  const addNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
  }
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }

  // Socket connection
  const handleAdminEvent = useCallback((eventType, data) => {
    console.log(`🔥 Real-time event: ${eventType}`, data)
    if (!data?.admin) return
    switch (eventType) {
      case "created":
        setAdmins((prev) => [...prev, data.admin]);
        addNotification("New admin added", "info");
        break
      case "updated":
        setAdmins((prev) => prev.map((admin) => (admin.id === data.admin.id ? { ...admin, ...data.admin } : admin)));
        addNotification("Admin updated", "info");
        break
      case "deleted":
        setAdmins((prev) => prev.filter((admin) => admin.id !== data.admin.id));
        addNotification("Admin removed", "info");
        break
      case "status-changed":
        setAdmins((prev) => prev.map((admin) => (admin.id === data.admin.id ? { ...admin, status: data.newStatus } : admin)));
        addNotification(`Admin status changed`, "info");
        break
      default:
        console.log("Unknown event type:", eventType)
    }
  }, [])

  const { isConnected, connectionError } = useAdminSocket(handleAdminEvent)

  // API helper modified to handle FormData
 const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const isFormData = options.body instanceof FormData;

  try {
    const axiosOptions = {
      method: options.method || "GET",
      url,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...options.headers,
      },
      data: isFormData ? options.body : options.body ? JSON.parse(options.body) : undefined,
    };

    const response = await axios(axiosOptions);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "API request failed";
    console.error("API Error:", message);
    throw new Error(message);
  }
};

  // Fetch admins
  const fetchAdmins = async () => {
    try {
      setIsLoading(true)
      const data = await apiCall("/admins")
      setAdmins(data.admins || data || [])
    } catch (error) {
      addNotification("Failed to fetch admins: " + error.message, "error")
      setAdmins([])
    } finally {
      setIsLoading(false)
    }
  }

  // Camera Logic
  useEffect(() => {
    if (showCamera) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [showCamera]);

  const startCamera = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        addNotification("Could not access camera. Please check permissions.", "error");
        setShowCamera(false);
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const handleCaptureSelfie = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d").drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      canvas.toBlob((blob) => {
        const file = new File([blob], `admin-selfie-${Date.now()}.jpg`, { type: "image/jpeg" });
        setAdminSelfie(file);
        setShowCamera(false);
      }, "image/jpeg");
    }
  };

  // Filtered admins with sorting
  const filteredAdmins = admins
    .filter((admin) => {
      const matchesSearch = admin.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          admin.email?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesRole = filterRole === "all" || admin.role === filterRole
      const matchesStatus = filterStatus === "all" || admin.status === filterStatus
      return matchesSearch && matchesRole && matchesStatus
    })
    .sort((a, b) => a.name.localeCompare(b.name))

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePermissionChange = (category, permission, value) => {
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [category]: {
          ...prev.permissions[category],
          [permission]: value,
        },
      },
    }))
  }

  // Toggle permission category expansion
  const togglePermissionCategory = (category) => {
    setExpandedPermissions(prev => ({
      ...prev,
      [category]: !prev[category]
    }))
  }

  // Add new admin (modified for FormData)
  const handleAddAdmin = async () => {
    try {
      setIsSubmitting(true)

      if (!formData.name || !formData.email || !formData.password) {
        addNotification("Please fill in all required fields", "error")
        setIsSubmitting(false);
        return
      }

      const dataToSend = new FormData();
      dataToSend.append('name', formData.name);
      dataToSend.append('email', formData.email);
      dataToSend.append('password', formData.password);
      dataToSend.append('role', formData.role);
      dataToSend.append('status', formData.status);
      dataToSend.append('permissions', JSON.stringify(formData.permissions));

      if (adminSelfie) {
        dataToSend.append('selfie', adminSelfie);
      }

      await apiCall("/admins", {
        method: "POST",
        body: dataToSend,
      })

      setShowAddModal(false)
      resetForm()
      addNotification("Admin created successfully!", "success")
      window.location.reload() // Reload to fetch new admin list
    } catch (error) {
      addNotification(error.message || "Failed to create admin", "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Edit admin
  const handleEditAdmin = async () => {
    try {
      setIsSubmitting(true)
      const adminData = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: formData.status,
        permissions: formData.permissions
      }
      if (formData.password) {
        adminData.password = formData.password
      }
      await apiCall(`/admins/${currentAdmin.id}`, {
        method: "PUT",
        body: JSON.stringify(adminData)
      })
      setShowEditModal(false)
      resetForm()
      addNotification("Admin updated successfully!", "success")
      window.location.reload() // Reload to fetch updated admin list
    } catch (error) {
      addNotification(error.message || "Failed to update admin", "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Delete admin
  const handleDeleteAdmin = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return
    try {
      await apiCall(`/admins/${id}`, { method: "DELETE" })
      addNotification("Admin deleted successfully!", "success")
      window.location.reload() // Reload to fetch updated admin list
    } catch (error) {
      addNotification("Failed to delete admin: " + error.message, "error")
    }
  }

  // Toggle admin status
  const toggleAdminStatus = async (id) => {
    try {
      const admin = admins.find((a) => a.id === id)
      const newStatus = admin.status === "active" ? "inactive" : "active"
      await apiCall(`/admins/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus })
      })
      addNotification(`Admin status updated to ${newStatus}!`, "success")
    } catch (error) {
      addNotification("Failed to update status: " + error.message, "error")
    }
  }

  // Reset form (modified to reset selfie)
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "support",
      status: "active",
      permissions: {
        users: { read: false, write: false, delete: false },
        vehicles: { read: false, write: false, delete: false },
        bookings: { read: false, write: false, delete: false },
        payments: { read: false, write: false, delete: false },
        settings: { read: false, write: false, delete: false }
      },
    })
    setAdminSelfie(null)
    setCurrentAdmin(null)
    setExpandedPermissions({})
  }

  // Load admin for edit
  const loadAdminForEdit = (admin) => {
    if (!admin || !admin.id) {
      addNotification("Invalid admin data", "error");
      return
    }
    try {
      setCurrentAdmin(admin);
      setFormData({
        name: admin.name || "",
        email: admin.email || "",
        password: "",
        role: admin.role || "support",
        status: admin.status || "active",
        permissions: admin.permissions ? JSON.parse(JSON.stringify(admin.permissions)) : {
          users: { read: false, write: false, delete: false },
          vehicles: { read: false, write: false, delete: false },
          bookings: { read: false, write: false, delete: false },
          payments: { read: false, write: false, delete: false },
          settings: { read: false, write: false, delete: false }
        }
      });
      setShowEditModal(true)
    } catch (error) {
      addNotification("Failed to load admin: " + error.message, "error")
    }
  }

  // Permission logic
  useEffect(() => {
    const allPermissions = { read: true, write: true, delete: true };
    const financePermissions = {
      users: { read: true, write: false, delete: false },
      vehicles: { read: true, write: false, delete: false },
      bookings: { read: true, write: false, delete: false },
      payments: { read: true, write: true, delete: false },
      settings: { read: false, write: false, delete: false }
    };
    const supportPermissions = {
      users: { read: true, write: true, delete: false },
      vehicles: { read: true, write: true, delete: false },
      bookings: { read: true, write: true, delete: false },
      payments: { read: false, write: false, delete: false },
      settings: { read: false, write: false, delete: false }
    };

    if (showAddModal || showEditModal) {
      let newPermissions;
      if (formData.role === "super_admin") newPermissions = {
        users: allPermissions,
        vehicles: allPermissions,
        bookings: allPermissions,
        payments: allPermissions,
        settings: allPermissions
      };
      else if (formData.role === "finance") newPermissions = financePermissions;
      else if (formData.role === "support") newPermissions = supportPermissions;
      if (newPermissions) setFormData(prev => ({ ...prev, permissions: newPermissions }));
    }
  }, [formData.role, showAddModal, showEditModal]);

  useEffect(() => {
    fetchAdmins()
  }, [])

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <SkeletonLoader />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <div className="max-w-7xl mx-auto space-y-6">
        {notifications.map((n) => (
          <Notification key={n.id} message={n.message} className="z-50" type={n.type} onClose={() => removeNotification(n.id)} />
        ))}

        {/* Camera Modal */}
        {showCamera && (
          <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-[60] backdrop-blur-sm">
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full max-w-2xl rounded-xl border-2 border-white/20 shadow-2xl"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-xl">
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleCaptureSelfie}
                    className="flex items-center gap-2 bg-white text-gray-900 px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Camera className="w-5 h-5" />
                    Capture
                  </button>
                  <button
                    onClick={() => setShowCamera(false)}
                    className="flex items-center gap-2 bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header and Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
              <UserShield className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Admin Management</h1>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search admins..."
                className="block w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => { resetForm(); setShowAddModal(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Admin
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Filter by Role</label>
            <select
              className="w-full p-2 border border-gray-300 dark:text-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="all" className="dark:bg-gray-800 dark:text-gray-300">All Roles</option>
              {roles.map((role) => (
                <option key={role.value} value={role.value} className="dark:bg-gray-800 dark:text-gray-300">
                  {role.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Filter by Status</label>
            <select
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:text-gray-300 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Admins Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Admin</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredAdmins.length > 0 ? (
                  filteredAdmins.map((admin) => (
                    <tr key={admin.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mr-4">
                            {admin.avatar ? (
                              <img className="h-10 w-10 rounded-full" src={admin.avatar} alt={admin.name} />
                            ) : (
                              <User className="text-blue-500 w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{admin.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{admin.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 dark:text-gray-400 text-gray-900">
                          {roles.find((r) => r.value === admin.role)?.icon}
                          <span className="text-sm">{roles.find((r) => r.value === admin.role)?.label}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${admin.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                          {admin.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => toggleAdminStatus(admin.id)}
                            className={`p-2 rounded-full hover:bg-opacity-20 ${admin.status === 'active' ? 'text-amber-500 hover:bg-amber-500' : 'text-emerald-500 hover:bg-emerald-500'} transition-colors`}
                            title={admin.status === 'active' ? 'Deactivate' : 'Activate'}
                          >
                            {admin.status === 'active' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => loadAdminForEdit(admin)}
                            className="p-2 text-blue-500 hover:bg-blue-500 hover:bg-opacity-20 rounded-full transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteAdmin(admin.id)}
                            className="p-2 text-rose-500 hover:bg-rose-500 hover:bg-opacity-20 rounded-full transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                      No admins found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Admin Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white">Add New Admin</h3>
                  <button
                    onClick={() => { setShowAddModal(false); resetForm(); }}
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      className="w-full p-2 border border-gray-300 dark:text-gray-300 text-gray-900 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
                    <input
                      type="email"
                      name="email"
                      className="w-full p-2 border border-gray-300 dark:text-gray-300 text-gray-900 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password *</label>
                    <input
                      type="password"
                      name="password"
                      className="w-full p-2 border border-gray-300 dark:text-gray-300 text-gray-900 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                    <select
                      name="role"
                      className="w-full p-2 border border-gray-300 dark:text-gray-300 text-gray-900 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      value={formData.role}
                      onChange={handleInputChange}
                    >
                      {roles.map((role) => (
                        <option key={role.value} value={role.value}>{role.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                    <select
                      name="status"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:text-gray-300 text-gray-900 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Admin Selfie</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        name="selfie"
                        accept="image/*"
                        onChange={(e) => setAdminSelfie(e.target.files[0])}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/50 dark:file:text-blue-300 dark:hover:file:bg-blue-900 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCamera(true)}
                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Camera className="w-5 h-5" />
                      </button>
                    </div>
                    {adminSelfie && (
                      <p className="text-sm text-emerald-500 dark:text-emerald-400 mt-1 flex items-center gap-1">
                        <Check className="w-4 h-4" />
                        Selected: {adminSelfie.name}
                      </p>
                    )}
                  </div>
                </div>

                <h4 className="text-md font-semibold text-gray-800 dark:text-white mb-3">Permissions</h4>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6 border border-gray-200 dark:border-gray-600">
                  <div className="space-y-3">
                    {permissionCategories.map((category) => (
                      <div key={category.name} className="border rounded-lg p-3 bg-white dark:bg-gray-800 dark:border-gray-600">
                        <button
                          className="flex items-center justify-between w-full dark:text-gray-400 text-gray-900 text-left"
                          onClick={() => togglePermissionCategory(category.name)}
                        >
                          <div className="flex items-center gap-2">
                            {category.icon}
                            <h5 className="font-medium dark:text-gray-300 text-gray-900">{category.label}</h5>
                          </div>
                          {expandedPermissions[category.name] ? (
                            <ChevronUp className="w-5 h-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          )}
                        </button>

                        {expandedPermissions[category.name] && (
                          <div className="mt-3 space-y-2 pl-6 dark:text-gray-300 text-gray-900">
                            <label className="flex items-center gap-2 text-sm">
                              <input
                                type="checkbox"
                                checked={formData.permissions[category.name].read}
                                onChange={(e) => handlePermissionChange(category.name, "read", e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                              />
                              Read Access
                            </label>
                            <label className="flex items-center gap-2 text-sm">
                              <input
                                type="checkbox"
                                checked={formData.permissions[category.name].write}
                                onChange={(e) => handlePermissionChange(category.name, "write", e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                                disabled={!formData.permissions[category.name].read}
                              />
                              Write Access
                            </label>
                            <label className="flex items-center gap-2 text-sm">
                              <input
                                type="checkbox"
                                checked={formData.permissions[category.name].delete}
                                onChange={(e) => handlePermissionChange(category.name, "delete", e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                                disabled={!formData.permissions[category.name].write}
                              />
                              Delete Access
                            </label>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => { setShowAddModal(false); resetForm(); }}
                    className="px-4 py-2 border border-gray-300 dark:text-gray-300 text-gray-900 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddAdmin}
                    disabled={isSubmitting}
                    className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </span>
                    ) : "Add Admin"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Admin Modal */}
        {showEditModal && currentAdmin && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 -top-[20px] backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white">Edit Admin: {currentAdmin?.name}</h3>
                  <button
                    onClick={() => { setShowEditModal(false); resetForm(); }}
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      className="w-full p-2 border border-gray-300 dark:text-gray-300 text-gray-900 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
                    <input
                      type="email"
                      name="email"
                      className="w-full p-2 border border-gray-300 dark:text-gray-300 text-gray-900 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                    <input
                      type="password"
                      name="password"
                      className="w-full p-2 border border-gray-300 dark:text-gray-300 text-gray-900 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Leave blank to keep current"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                    <select
                      name="role"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:text-gray-300 text-gray-900 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      value={formData.role}
                      onChange={handleInputChange}
                    >
                      {roles.map((role) => (
                        <option key={role.value} value={role.value}>{role.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                  <select
                    name="status"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:text-gray-300 text-gray-900 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <h4 className="text-md font-semibold text-gray-800 dark:text-white mb-3">Permissions</h4>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6 border border-gray-200 dark:border-gray-600">
                  <div className="space-y-3">
                    {permissionCategories.map((category) => (
                      <div key={category.name} className="border rounded-lg p-3 dark:text-gray-300 text-gray-900 bg-white dark:bg-gray-800 dark:border-gray-600">
                        <button
                          className="flex items-center justify-between w-full text-left"
                          onClick={() => togglePermissionCategory(category.name)}
                        >
                          <div className="flex items-center gap-2">
                            {category.icon}
                            <h5 className="font-medium">{category.label}</h5>
                          </div>
                          {expandedPermissions[category.name] ? (
                            <ChevronUp className="w-5 h-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          )}
                        </button>

                        {expandedPermissions[category.name] && (
                          <div className="mt-3 space-y-2 pl-6">
                            <label className="flex items-center gap-2 text-sm">
                              <input
                                type="checkbox"
                                checked={formData.permissions[category.name].read}
                                onChange={(e) => handlePermissionChange(category.name, "read", e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                              />
                              Read Access
                            </label>
                            <label className="flex items-center gap-2 text-sm">
                              <input
                                type="checkbox"
                                checked={formData.permissions[category.name].write}
                                onChange={(e) => handlePermissionChange(category.name, "write", e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                                disabled={!formData.permissions[category.name].read}
                              />
                              Write Access
                            </label>
                            <label className="flex items-center gap-2 text-sm">
                              <input
                                type="checkbox"
                                checked={formData.permissions[category.name].delete}
                                onChange={(e) => handlePermissionChange(category.name, "delete", e.target.checked)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                                disabled={!formData.permissions[category.name].write}
                              />
                              Delete Access
                            </label>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => { setShowEditModal(false); resetForm(); }}
                    className="px-4 py-2 border border-gray-300 dark:text-gray-300 text-gray-900 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEditAdmin}
                    disabled={isSubmitting}
                    className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating...
                      </span>
                    ) : "Update Admin"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}