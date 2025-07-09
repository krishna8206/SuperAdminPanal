// import { useState, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";

// export default function MainSideBar({ isOpen, toggleSidebar }) {
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
//   const location = useLocation();

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 768);
//       if (window.innerWidth < 768 && isOpen) {
//         toggleSidebar();
//       }
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, [isOpen, toggleSidebar]);

//   const isActive = (path) => {
//     if (path === "") {
//       return location.pathname === "/";
//     }
//     return location.pathname.includes(path);
//   };

//   const options = [
//     {
//       name: "Dashboard",
//       icon: "fas fa-tachometer-alt",
//       path: "",
//     },
//     {
//       name: "Trips",
//       icon: "fas fa-route",
//       path: "rides",
//     },
//     {
//       name: "Vehicle Management",
//       icon: "fas fa-car",
//       path: "vehicle-management",
//     },
//     {
//       name: "Earnings",
//       icon: "fas fa-chart-line",
//       path: "reports-earnings",
//     },
//     {
//       name: "Admins",
//       icon: "fas fa-user-shield",
//       path: "admins",
//     },
//     {
//       name: "Users",
//       icon: "fas fa-users",
//       path: "users",
//     },
//     {
//       name: "Drivers Management",
//       icon: "fas fa-id-card",
//       path: "drivers",
//     },
//     {
//       name: "Live Tracking",
//       icon: "fas fa-map-marker-alt",
//       path: "live-tracking",
//     },
//   ];

//   return (
//     <>
//       {/* Mobile overlay */}
//       {isMobile && isOpen && (
//         <div
//           className="fixed inset-0 bg-black/50 z-40 md:hidden"
//           onClick={toggleSidebar}
//         />
//       )}

//       <div
//         className={`fixed md:static h-full ${
//           isMobile ? "w-64" : isOpen ? "w-56" : "w-20"
//         } ${
//           isMobile
//             ? `transform ${isOpen ? "translate-x-0" : "-translate-x-full"}`
//             : ""
//         } border-r-[1px] border-gray-300 dark:border-gray-400/20 flex flex-col items-center pt-10 bg-white dark:bg-gray-900 z-50 transition-all duration-300`}
//       >
//         {options.map((option, index) => {
//           const active = isActive(option.path);
//           return (
//             <Link
//               key={index}
//               to={`/${option.path}`}
//               className={`MenuOption h-12 ${
//                 isOpen ? "w-[90%]" : "w-12"
//               } rounded-lg flex ${
//                 isOpen ? "justify-start px-4" : "justify-center"
//               } items-center group relative z-50 ${
//                 active
//                   ? "bg-green-600/30 text-green-400"
//                   : "text-gray-600 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600/20 hover:text-green-500"
//               } transition-all duration-200`}
//               onClick={() => isMobile && toggleSidebar()}
//             >
//               <i className={`${option.icon} text-lg ${isOpen ? "mr-3" : ""}`}></i>
              
//               {/* Show name when sidebar is expanded */}
//               {isOpen && (
//                 <span className="text-sm whitespace-nowrap">{option.name}</span>
//               )}
              
//               {/* Show tooltip with both icon and name when sidebar is collapsed */}
//               {!isOpen && (
//                 <div className="OptionInfo absolute left-full ml-2 min-w-[120px] px-3 py-2 bg-green-600/90 text-white hidden rounded-lg group-hover:flex items-center transition-all duration-200 z-auto">
//                   <i className={`${option.icon} text-lg mr-2`}></i>
//                   <span>{option.name}</span>
//                 </div>
//               )}
              
//               {/* Active indicator - shows when sidebar is expanded and item is active */}
//               {isOpen && active && (
//                 <div className="absolute left-2 w-1 h-6 bg-green-400 rounded-full"></div>
//               )}
//             </Link>
//           );
//         })}
//       </div>
//     </>
//   );
// }



import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Car,
  MapPin,
  MessageSquareMore,
  Route,
  Users,
  CreditCard,
  BarChart3,
  Globe,
  User,
  LogOut,
  Bell,
  X,
  Menu,
} from 'lucide-react';

const menuItems = [
  {
      title: "Dashboard",
      icon: "fas fa-tachometer-alt",
      url: "",
    },
    {
      title: "Trips",
      icon: "fas fa-route",
      url: "rides",
    },
    {
      title: "Vehicle Management",
      icon: "fas fa-car",
      url: "vehicle-management",
    },
    {
      title: "Earnings",
      icon: "fas fa-chart-line",
      url: "reports-earnings",
    },
    {
      title: "Admins",
      icon: "fas fa-user-shield",
      url: "admins",
    },
    {
      title: "Users",
      icon: "fas fa-users",
      url: "users",
    },
    {
      title: "Drivers Management",
      icon: "fas fa-id-card",
      url: "drivers",
    },
    {
      title: "Live Tracking",
      icon: "fas fa-map-marker-alt",
      url: "live-tracking",
    },
];

export default function MainSideBar({ isOpen, onToggle, logout }) {
  const pathname = useLocation().pathname;
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile && isOpen) onToggle();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen, onToggle]);

  return (
    <>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gray-950 border-r border-gray-800 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 md:block
      `}>
        <div className="flex h-full flex-col">
          {/* Navigation */}
          <div className="flex-1 overflow-y-auto p-2">
            <div className="text-gray-400 text-xs uppercase tracking-wider px-3 py-2">Main Navigation</div>
            <div className="space-y-1">
              {menuItems.map(({ title, url, icon }) => {
                const active = pathname === url;
                return (
                  <Link
                    key={title}
                    to={url}
                    onClick={() => isMobile && onToggle()}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition duration-200 group
                      ${active ? 'bg-green-600 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-800'}
                    `}
                  >
                    <i className={`h-5 w-5 flex-shrink-0 ${icon}`} />
                    <span className="font-medium truncate">{title}</span>
                  </Link>
                );
              })}
            </div>
          </div>

         
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={onToggle} />
      )}
    </>
  );
}
