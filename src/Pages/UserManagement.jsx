import React, { useState, useEffect } from 'react';
import { userService } from '../services/api';
import { User, Search, Eye, Edit, Ban, Phone, Mail, MapPin, Star, Calendar, ChevronUp, ChevronDown, Plus, Check, X, AlertCircle, Clock, Info, Trash2, MessageSquare } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

// Toast Notification Component
const Toast = ({ message, type = 'info', onClose }) => {
  const bgColor = {
    info: 'bg-blue-600 dark:bg-blue-600',
    success: 'bg-emerald-600 dark:bg-emerald-600',
    warning: 'bg-amber-500 dark:bg-amber-500',
    error: 'bg-red-600 dark:bg-red-600'
  }[type];

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-4 right-4 z-50 p-4 rounded-lg shadow-lg text-white ${bgColor} flex items-center gap-2 animate-fade-in`}>
      {type === 'info' && <Info className="h-5 w-5" />}
      {type === 'success' && <Check className="h-5 w-5" />}
      {type === 'warning' && <AlertCircle className="h-5 w-5" />}
      {type === 'error' && <AlertCircle className="h-5 w-5" />}
      <span>{message}</span>
    </div>
  );
};

// UI Components
const Card = ({ children, className, ...props }) => (
  <div className={`rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm transition-all hover:shadow-md ${className}`} {...props}>
    {children}
  </div>
);

const CardContent = ({ children, className, ...props }) => (
  <div className={`p-5 ${className}`} {...props}>
    {children}
  </div>
);

const Badge = ({ children, variant = "default", className, ...props }) => {
  const baseClasses = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";
  const variantClasses = {
    default: "bg-blue-600 text-white",
    secondary: "bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white",
    destructive: "bg-red-600 text-white",
    outline: "border border-gray-300 dark:border-gray-500 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200",
    success: "bg-emerald-600 text-white",
    warning: "bg-amber-500 text-white",
    info: "bg-blue-500 text-white",
  };
  
  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
};

const Button = ({ children, variant = "default", size = "default", className, icon, ...props }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none";
  const variantClasses = {
    default: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
    destructive: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
    outline: "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700",
    secondary: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 shadow-sm",
    ghost: "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200",
    link: "text-blue-500 dark:text-blue-400 hover:underline",
    success: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm",
  };
  const sizeClasses = {
    default: "h-10 py-2 px-4 text-sm",
    sm: "h-9 px-3 text-xs",
    lg: "h-11 px-6 text-md",
  };
  
  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`} {...props}>
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

const Input = ({ className, icon, ...props }) => (
  <div className="relative">
    {icon && (
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
        {icon}
      </div>
    )}
    <input
      className={`flex h-10 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 ${icon ? 'pl-10' : ''} ${className}`}
      {...props}
    />
  </div>
);

const Select = ({ children, value, onValueChange, ...props }) => {
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);

  const handleValueChange = (value) => {
    setSelectedValue(value);
    onValueChange(value);
    setOpen(false);
  };

  return (
    <div className="relative" {...props}>
      <div
        className={`flex h-10 w-full items-center justify-between rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
        onClick={() => setOpen(!open)}
      >
        <span className="truncate">{selectedValue || "Select..."}</span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </div>
      {open && (
        <div className="absolute z-50 mt-1 w-full min-w-[8rem] overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
          <div className="p-1">
            {React.Children.map(children, (child) =>
              React.isValidElement(child)
                ? React.cloneElement(child, {
                    onClick: () => handleValueChange(child.props.value),
                  })
                : child
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const SelectItem = ({ children, value, onClick }) => (
  <div
    className="relative flex w-full cursor-default select-none items-center rounded-md py-1.5 pl-8 pr-2 text-sm text-gray-900 dark:text-white outline-none hover:bg-gray-100 dark:hover:bg-gray-700"
    onClick={onClick}
  >
    {children}
  </div>
);

const Dialog = ({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {React.Children.map(children, (child) => {
        if (child.type === DialogTrigger) {
          return React.cloneElement(child, { onClick: () => setOpen(true) });
        }
        if (child.type === DialogContent) {
          return open && React.cloneElement(child, { onClose: () => setOpen(false) });
        }
        return child;
      })}
    </>
  );
};

const DialogTrigger = ({ children, ...props }) => (
  <div {...props}>
    {children}
  </div>
);

const DialogContent = ({ children, className, onClose, ...props }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div
      className={`relative z-50 grid w-full max-w-lg gap-4 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-lg rounded-xl ${className}`}
      {...props}
    >
      {children}
      <button
        className="absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
        onClick={onClose}
      >
        <X className="h-5 w-5" />
        <span className="sr-only">Close</span>
      </button>
    </div>
  </div>
);

const DialogHeader = ({ children, className, ...props }) => (
  <div className={`flex flex-col space-y-1.5 text-center sm:text-left ${className}`} {...props}>
    {children}
  </div>
);

const DialogTitle = ({ children, className, ...props }) => (
  <h2 className={`text-lg font-semibold leading-none tracking-tight text-gray-900 dark:text-white ${className}`} {...props}>
    {children}
  </h2>
);

const Tabs = ({ children, defaultValue }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <div className="Tabs">
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) {
          return child;
        }
        if (child.type === TabsList) {
          return React.cloneElement(child, { activeTab, setActiveTab });
        }
        if (child.type === TabsContent) {
          return React.cloneElement(child, { activeTab });
        }
        return child;
      })}
    </div>
  );
};

const TabsList = ({ children, activeTab, setActiveTab, className, ...props }) => (
  <div
    className={`inline-flex h-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 p-1 text-gray-500 dark:text-gray-300 ${className}`}
    {...props}
  >
    {React.Children.map(children, (child) => {
      if (!React.isValidElement(child)) {
        return null;
      }
      return React.cloneElement(child, { activeTab, setActiveTab });
    })}
  </div>
);

const TabsTrigger = ({ children, value, activeTab, setActiveTab, className, ...props }) => (
  <button
    className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 disabled:pointer-events-none disabled:opacity-50 ${
      activeTab === value ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm" : "hover:text-gray-900 dark:hover:text-white"
    } ${className}`}
    onClick={() => setActiveTab(value)}
    {...props}
  >
    {children}
  </button>
);

const TabsContent = ({ children, value, activeTab, className, ...props }) => (
  activeTab === value && (
    <div
      className={`mt-2 rounded-lg bg-white dark:bg-gray-800 p-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
);

const StatusIndicator = ({ status }) => {
  const statusConfig = {
    completed: { icon: <Check className="h-3 w-3 text-emerald-500" />, color: "bg-emerald-500" },
    updated: { icon: <Clock className="h-3 w-3 text-blue-500" />, color: "bg-blue-500" },
    added: { icon: <Plus className="h-3 w-3 text-amber-500" />, color: "bg-amber-500" },
    pending: { icon: <AlertCircle className="h-3 w-3 text-yellow-500" />, color: "bg-yellow-500" },
    verified: { icon: <Check className="h-3 w-3 text-emerald-500" />, color: "bg-emerald-500" },
    default: { icon: null, color: "bg-gray-400 dark:bg-gray-500" }
  };

  const config = statusConfig[status] || statusConfig.default;

  return (
    <div className={`w-2 h-2 rounded-full ${config.color} flex items-center justify-center`}>
      {config.icon}
    </div>
  );
};

const UserAvatar = ({ user }) => (
  <div className="relative">
    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center shadow-md">
      {user.avatar ? (
        <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
      ) : (
        <User className="h-5 w-5 text-white" />
      )}
    </div>
    {user.status === "Active" && (
      <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1 border-2 border-white dark:border-gray-800">
        <Check className="h-3 w-3 text-white" />
      </div>
    )}
  </div>
);

const UserInfoCard = ({ icon, title, value, subValue, iconColor = "blue-500" }) => (
  <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
    <div className="flex items-center space-x-2 mb-2">
      {React.cloneElement(icon, { className: `h-4 w-4 text-${iconColor}` })}
      <span className={`text-${iconColor} font-medium text-sm`}>{title}</span>
    </div>
    <p className="text-gray-900 dark:text-white text-sm">{value || 'N/A'}</p>
    {subValue && <p className="text-gray-500 dark:text-gray-400 text-xs truncate">{subValue}</p>}
  </div>
);

const ConfirmationDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative z-50 w-full max-w-md rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-lg">
        <div className="flex flex-col space-y-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-6 w-6 text-amber-500 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1">{message}</p>
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={onConfirm}>
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [actionToConfirm, setActionToConfirm] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'Active',
    location: '',
    notes: ''
  });

  // Add toast notification
  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  // Remove toast notification
  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await userService.getAllUsers();
        setUsers(response.data);
      } catch (err) {
        setError(err.message);
        console.error('Failed to fetch users:', err);
        addToast('Failed to fetch users', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Sorting functionality
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? 
      <ChevronUp className="h-4 w-4 ml-1" /> : 
      <ChevronDown className="h-4 w-4 ml-1" />
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (sortConfig.key) {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
    }
    return 0;
  });

  // Filter users based on search and filters
  const filteredUsers = sortedUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phone && user.phone.includes(searchTerm));
    const matchesStatus = statusFilter === "All" || user.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // View user details
  const handleView = async (userId) => {
    try {
      const response = await userService.getUserById(userId);
      setSelectedUser({
        ...response.data,
        activities: [
          {
            id: 1,
            type: "login",
            title: "Last activity",
            time: new Date(response.data.lastLogin || response.data.joinDate).toLocaleString(),
            status: "updated",
            details: "User logged in to the system"
          },
          {
            id: 2,
            type: "profile",
            title: "Profile update",
            time: new Date(response.data.lastUpdate || response.data.joinDate).toLocaleString(),
            status: "updated",
            details: "User updated their profile"
          },
          {
            id: 3,
            type: "account",
            title: "Account created",
            time: new Date(response.data.joinDate).toLocaleString(),
            status: "added",
            details: "User account was created"
          }
        ]
      });
    } catch (err) {
      console.error('Failed to fetch user details:', err);
      addToast('Failed to load user details', 'error');
    }
  };

  // Edit user
  const handleEdit = (user) => {
    setEditingUser({ 
      ...user,
      notes: user.notes || ""
    });
  };

  // Save edited user
  const handleSaveEdit = async () => {
    if (!editingUser.name || !editingUser.email) {
      addToast('Name and email are required fields', 'warning');
      return;
    }
    
    try {
      await userService.updateUser(editingUser._id, editingUser);
      setUsers(users.map(u => u._id === editingUser._id ? editingUser : u));
      setEditingUser(null);
      addToast(`User ${editingUser.name} updated successfully!`, 'success');
    } catch (err) {
      console.error('Failed to update user:', err);
      addToast('Failed to update user', 'error');
    }
  };

  // Confirm action
  const confirmAction = (action) => {
    setActionToConfirm(() => action);
    setShowConfirmDialog(true);
  };

  // Execute confirmed action
  const executeConfirmedAction = async () => {
    if (actionToConfirm) {
      await actionToConfirm();
    }
    setShowConfirmDialog(false);
  };

  // Suspend/unsuspend user
  const handleSuspend = async (user) => {
    confirmAction(async () => {
      try {
        await userService.suspendUser(user._id);
        setUsers(users.map(u => 
          u._id === user._id 
            ? { ...u, status: u.status === 'Suspended' ? 'Active' : 'Suspended' }
            : u
        ));
        addToast(`User ${user.name} has been ${user.status === 'Suspended' ? 'unsuspended' : 'suspended'}`, 'success');
      } catch (err) {
        console.error('Failed to update user status:', err);
        addToast('Failed to update user status', 'error');
      }
    });
  };

  // Delete user
  const handleDelete = async (user) => {
    confirmAction(async () => {
      try {
        await userService.deleteUser(user._id);
        setUsers(users.filter(u => u._id !== user._id));
        addToast(`User ${user.name} has been deleted`, 'success');
      } catch (err) {
        console.error('Failed to delete user:', err);
        addToast('Failed to delete user', 'error');
      }
    });
  };

  // Add new user
  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) {
      addToast('Name and email are required fields', 'warning');
      return;
    }

    try {
      const response = await userService.createUser(newUser);
      setUsers([...users, response.data]);
      setShowAddUserDialog(false);
      setNewUser({
        name: '',
        email: '',
        phone: '',
        status: 'Active',
        location: '',
        notes: ''
      });
      addToast(`New user ${response.data.name} added successfully!`, 'success');
    } catch (err) {
      console.error('Failed to create user:', err);
      addToast('Failed to create user', 'error');
    }
  };

  // Status styling helper
  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "success";
      case "Pending":
        return "warning";
      case "Suspended":
        return "destructive";
      default:
        return "secondary";
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 flex items-center justify-center">
        <div className="text-gray-900 dark:text-white">Loading users...</div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 flex items-center justify-center">
        <div className="text-red-500">Error loading users: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* Toast Notifications */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <Toast 
            key={toast.id} 
            message={toast.message} 
            type={toast.type} 
            onClose={() => removeToast(toast.id)} 
          />
        ))}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={executeConfirmedAction}
        title="Confirm Action"
        message="Are you sure you want to perform this action? This cannot be undone."
      />

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage all registered users</p>
          </div>
          <Button 
            variant="success"
            onClick={() => setShowAddUserDialog(true)}
            icon={<Plus className="h-4 w-4" />}
          >
            Add User
          </Button>
        </div>

        {/* Summary Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-gray-200 dark:border-gray-700">
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{users.length}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Total Users</p>
                </div>
                <div className="p-3 rounded-full bg-blue-100 dark:bg-gray-700/50">
                  <User className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-gray-200 dark:border-gray-700">
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {users.filter(u => u.status === 'Active').length}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Active Users</p>
                </div>
                <div className="p-3 rounded-full bg-emerald-100 dark:bg-emerald-900/20">
                  <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-gray-200 dark:border-gray-700">
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-amber-600 dark:text-amber-500">
                    {users.filter(u => u.status === 'Pending').length}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Pending Users</p>
                </div>
                <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/20">
                  <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Section */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search users by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                  icon={<Search className="h-4 w-4 text-gray-400" />}
                />
              </div>
              <div className="flex gap-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users List Section */}
        <div className="space-y-3">
          {/* Sorting Header */}
          <div className="hidden md:flex items-center bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-sm font-medium">
            <div 
              className="flex-1 flex items-center cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors"
              onClick={() => requestSort('name')}
            >
              <span>Name</span>
              {getSortIcon('name')}
            </div>
            <div 
              className="w-1/4 flex items-center cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors"
              onClick={() => requestSort('email')}
            >
              <span>Email</span>
              {getSortIcon('email')}
            </div>
            <div 
              className="w-1/4 flex items-center cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors"
              onClick={() => requestSort('status')}
            >
              <span>Status</span>
              {getSortIcon('status')}
            </div>
            <div 
              className="w-1/4 flex items-center justify-end cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <span>Actions</span>
            </div>
          </div>

          {filteredUsers.length === 0 ? (
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="py-8 text-center">
                <Search className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No users found</h3>
                <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filter criteria</p>
              </CardContent>
            </Card>
          ) : (
            filteredUsers.map((user) => (
              <Card key={user._id} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                <CardContent>
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center space-x-4">
                      <UserAvatar user={user} />
                      <div>
                        <h3 className="text-gray-900 dark:text-white font-medium text-lg">{user.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant={getStatusColor(user.status)}>
                            {user.status}
                          </Badge>
                          {user.lastLogin && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Last login: {new Date(user.lastLogin).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-gray-500 dark:text-gray-400 text-sm">
                        Joined {new Date(user.joinDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                    <UserInfoCard 
                      icon={<Mail />} 
                      title="Email" 
                      value={user.email} 
                      iconColor="blue-500"
                    />
                    <UserInfoCard 
                      icon={<Phone />} 
                      title="Contact" 
                      value={user.phone || 'N/A'} 
                      iconColor="emerald-500"
                    />
                    <UserInfoCard 
                      icon={<MapPin />} 
                      title="Location" 
                      value={user.location || 'N/A'} 
                      subValue={`Last login: ${new Date(user.lastLogin || user.joinDate).toLocaleString()}`}
                      iconColor="amber-600"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleView(user._id)}
                          icon={<Eye className="h-3.5 w-3.5" />}
                        >
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 px-3 pt-10 max-w-2xl">
                        {selectedUser ? (
                          <>
                            <DialogHeader>
                              <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                  <UserAvatar user={selectedUser} />
                                  <div>
                                    <DialogTitle className="text-xl flex items-center gap-2">
                                      {selectedUser?.name}
                                      <Badge variant={getStatusColor(selectedUser?.status)}>
                                        {selectedUser?.status}
                                      </Badge>
                                    </DialogTitle>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                      Member since {new Date(selectedUser?.joinDate).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => window.open(`tel:${selectedUser?.phone}`)}
                                    icon={<Phone className="h-3.5 w-3.5" />}
                                  />
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => window.open(`sms:${selectedUser?.phone}`)}
                                    icon={<MessageSquare className="h-3.5 w-3.5" />}
                                  />
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => window.open(`https://wa.me/${selectedUser?.phone}`)}
                                    icon={<FaWhatsapp className="h-3.5 w-3.5 text-green-500" />}
                                  />
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleSuspend(selectedUser)}
                                    icon={<Ban className="h-3.5 w-3.5" />}
                                  >
                                    {selectedUser?.status === "Suspended" ? "Unsuspend" : "Suspend"}
                                  </Button>
                                </div>
                              </div>
                            </DialogHeader>

                            <Tabs defaultValue="profile">
                              <TabsList className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                <TabsTrigger value="profile">Profile</TabsTrigger>
                                <TabsTrigger value="activity">Activity</TabsTrigger>
                                <TabsTrigger value="actions">Actions</TabsTrigger>
                              </TabsList>

                              <TabsContent value="profile" className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 px-0">
                                  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                    <h4 className="text-gray-900 dark:text-white font-medium mb-3 flex items-center gap-2">
                                      <User className="h-4 w-4" /> Personal Information
                                    </h4>
                                    <div className="space-y-3">
                                      <div>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm">Full Name</p>
                                        <p className="text-gray-900 dark:text-white font-medium text-ellipsis w-full overflow-hidden">{selectedUser?.name}</p>
                                      </div>
                                      <div>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm">Email Address</p>
                                        <p className="text-gray-900 dark:text-white font-medium text-ellipsis w-full overflow-hidden">{selectedUser?.email}</p>
                                      </div>
                                      <div>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm">Phone Number</p>
                                        <p className="text-gray-900 dark:text-white font-medium">{selectedUser?.phone || 'N/A'}</p>
                                      </div>
                                      <div>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm">Location</p>
                                        <p className="text-gray-900 dark:text-white font-medium">{selectedUser?.location || 'N/A'}</p>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg border border-gray-200 dark:border-gray-700">
                                    <h4 className="text-gray-900 dark:text-white font-medium mb-3 flex items-center gap-2">
                                      <Star className="h-4 w-4" /> Account Information
                                    </h4>
                                    <div className="space-y-3">
                                      <div className="flex justify-between items-center">
                                        <p className="text-gray-500 dark:text-gray-400 text-sm">Status</p>
                                        <Badge variant={getStatusColor(selectedUser?.status)}>
                                          {selectedUser?.status}
                                        </Badge>
                                      </div>
                                      <div className="flex justify-between items-center">
                                        <p className="text-gray-500 dark:text-gray-400 text-sm">Member Since</p>
                                        <p className="text-gray-900 dark:text-white font-medium">{new Date(selectedUser?.joinDate).toLocaleDateString()}</p>
                                      </div>
                                      <div className="flex justify-between items-center">
                                        <p className="text-gray-500 dark:text-gray-400 text-sm">Last Login</p>
                                        <p className="text-gray-900 dark:text-white font-medium">{new Date(selectedUser?.lastLogin || selectedUser?.joinDate).toLocaleString()}</p>
                                      </div>
                                      <div className="flex justify-between items-center">
                                        <p className="text-gray-500 dark:text-gray-400 text-sm">Last Update</p>
                                        <p className="text-gray-900 dark:text-white font-medium">{new Date(selectedUser?.lastUpdate || selectedUser?.joinDate).toLocaleString()}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </TabsContent>

                              <TabsContent value="activity" className="space-y-4">
                                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                  <h4 className="text-gray-900 dark:text-white font-medium mb-3 flex items-center gap-2">
                                    <Clock className="h-4 w-4" /> Recent Activity
                                  </h4>
                                  <div className="space-y-4">
                                    {selectedUser?.activities?.map((activity) => (
                                      <div key={activity.id} className="flex items-start space-x-3">
                                        <div className="flex-shrink-0 mt-1">
                                          <StatusIndicator status={activity.status} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="text-gray-900 dark:text-white text-sm font-medium">{activity.title}</p>
                                          <p className="text-gray-500 dark:text-gray-400 text-xs">{activity.details}</p>
                                          <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">{activity.time}</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </TabsContent>

                              <TabsContent value="actions" className="space-y-4">
                                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                  <h4 className="text-gray-900 dark:text-white font-medium mb-3 flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4" /> Account Actions
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <Button
                                      variant="outline"
                                      onClick={() => handleEdit(selectedUser)}
                                      icon={<Edit className="h-4 w-4" />}
                                    >
                                      Edit Profile
                                    </Button>
                                    <Button
                                      variant={selectedUser?.status === "Suspended" ? "default" : "destructive"}
                                      onClick={() => handleSuspend(selectedUser)}
                                      icon={<Ban className="h-4 w-4" />}
                                    >
                                      {selectedUser?.status === "Suspended" ? "Unsuspend User" : "Suspend User"}
                                    </Button>
                                    <Button
                                      variant="outline"
                                      onClick={() => window.open(`mailto:${selectedUser?.email}`)}
                                      icon={<Mail className="h-4 w-4" />}
                                    >
                                      Send Email
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      onClick={() => handleDelete(selectedUser)}
                                      icon={<Trash2 className="h-4 w-4" />}
                                    >
                                      Delete Account
                                    </Button>
                                  </div>
                                </div>
                              </TabsContent>
                            </Tabs>
                          </>
                        ) : (
                          <div className="text-center p-8 text-gray-900 dark:text-white">Loading user details...</div>
                        )}
                      </DialogContent>
                    </Dialog>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(user)}
                      icon={<Edit className="h-3.5 w-3.5" />}
                    >
                      Edit
                    </Button>

                    <Button
                      size="sm"
                      variant={user.status === "Suspended" ? "default" : "destructive"}
                      onClick={() => handleSuspend(user)}
                      icon={<Ban className="h-3.5 w-3.5" />}
                    >
                      {user.status === "Suspended" ? "Unsuspend" : "Suspend"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Add User Dialog */}
        {showAddUserDialog && (
          <DialogContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl">Add New User</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddUserSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                  <Input
                    type="text"
                    name="name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    required
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                  <Input
                    type="email"
                    name="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    required
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                  <Input
                    type="tel"
                    name="phone"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                  <Select 
                    value={newUser.status} 
                    onValueChange={(value) => setNewUser({...newUser, status: value})}
                  >
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Suspended">Suspended</SelectItem>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                  <Input
                    type="text"
                    name="location"
                    value={newUser.location}
                    onChange={(e) => setNewUser({...newUser, location: e.target.value})}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
                  <textarea
                    className="flex h-20 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                    value={newUser.notes}
                    onChange={(e) => setNewUser({...newUser, notes: e.target.value})}
                    placeholder="Optional notes about this user..."
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddUserDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="success"
                >
                  Add User
                </Button>
              </div>
            </form>
          </DialogContent>
        )}

        {/* Edit User Dialog */}
        {editingUser && (
          <DialogContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl">Edit User - {editingUser.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                <Input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                  className="w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                <Input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                  className="w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <Select 
                  value={editingUser.status} 
                  onValueChange={(value) => setEditingUser({...editingUser, status: value})}
                >
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                <Input
                  type="tel"
                  value={editingUser.phone}
                  onChange={(e) => setEditingUser({...editingUser, phone: e.target.value})}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                <Input
                  type="text"
                  value={editingUser.location}
                  onChange={(e) => setEditingUser({...editingUser, location: e.target.value})}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
                <textarea
                  className="flex h-20 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                  value={editingUser.notes}
                  onChange={(e) => setEditingUser({...editingUser, notes: e.target.value})}
                  placeholder="Add any notes about this user..."
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setEditingUser(null)}
              >
                Cancel
              </Button>
              <Button
                variant="success"
                onClick={handleSaveEdit}
              >
                Save Changes
              </Button>
            </div>
          </DialogContent>
        )}
      </div>
    </div>
  );
}