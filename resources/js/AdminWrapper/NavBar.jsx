// import React, { useEffect, useRef, useState } from 'react'
// import { Link, usePage } from '@inertiajs/react'
// import { Menu, Search, Bell, ChevronDown, User, Settings, LogOut } from 'lucide-react'

// const NavBar = ({ onMenuClick }) => {
//   const { auth } = usePage().props
//   const user = auth?.user || { name: 'Admin User', email: 'admin@example.com' }

//   const [profileOpen, setProfileOpen] = useState(false)
//   const profileRef = useRef(null)

//   // Close dropdown on outside click
//   useEffect(() => {
//     const handler = (e) => {
//       if (profileRef.current && !profileRef.current.contains(e.target)) {
//         setProfileOpen(false)
//       }
//     }
//     document.addEventListener('mousedown', handler)
//     return () => document.removeEventListener('mousedown', handler)
//   }, [])

//   const initials = user.name
//     .split(' ')
//     .map((n) => n[0])
//     .slice(0, 2)
//     .join('')
//     .toUpperCase()

//   return (
//     <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md sm:px-6 lg:px-8">
//       {/* Left */}
//       <div className="flex items-center gap-3">
//         <button
//           onClick={onMenuClick}
//           className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden"
//           aria-label="Open sidebar"
//         >
//           <Menu size={22} />
//         </button>
//       </div>


//       {/* Right */}
//       <div className="flex items-center gap-2 sm:gap-3">
//         <button className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-indigo-600">
//           <Bell size={20} />
//           <span className="absolute right-2 top-2 flex h-2.5 w-2.5">
//             <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
//             <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-500" />
//           </span>
//         </button>

//         <div className="hidden h-8 w-px bg-slate-200 sm:block" />

//         {/* Profile dropdown */}
//         <div className="relative" ref={profileRef}>
//           <button
//             onClick={() => setProfileOpen(!profileOpen)}
//             className="flex items-center gap-3 rounded-xl p-1.5 pr-2 transition hover:bg-slate-100"
//           >
//             <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-semibold text-white shadow-md shadow-indigo-500/30">
//               {initials}
//             </span>
//             <span className="hidden text-left sm:block">
//               <span className="block text-sm font-semibold leading-tight text-slate-800">
//                 {user.name}
//               </span>
//               <span className="block text-xs text-slate-500">Administrator</span>
//             </span>
//             <ChevronDown
//               size={16}
//               className={`hidden text-slate-400 transition-transform sm:block ${
//                 profileOpen ? 'rotate-180' : ''
//               }`}
//             />
//           </button>

//           {profileOpen && (
//             <div className="absolute right-0 mt-2 w-60 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10">
//               <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">
//                 <p className="truncate text-sm font-semibold text-slate-800">{user.name}</p>
//                 <p className="truncate text-xs text-slate-500">{user.email}</p>
//               </div>

//               <div className="border-t border-slate-100 p-1.5">
//                 <Link
//                   href="/logout"
//                   method="post"
//                   as="button"
//                   className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-rose-600 transition hover:bg-rose-50"
//                 >
//                   <LogOut size={16} /> Logout
//                 </Link>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   )
// }

// export default NavBar


// import React, { useCallback, useEffect, useRef, useState } from 'react'
// import { Link, usePage } from '@inertiajs/react'
// import axios from 'axios'
// import { Menu, Bell, ChevronDown, LogOut, CheckCheck, Check, Trash2 } from 'lucide-react'

// const timeAgo = (dateString) => {
//   const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000)
//   if (seconds < 60) return 'Just now'
//   const minutes = Math.floor(seconds / 60)
//   if (minutes < 60) return `${minutes}m ago`
//   const hours = Math.floor(minutes / 60)
//   if (hours < 24) return `${hours}h ago`
//   const days = Math.floor(hours / 24)
//   return `${days}d ago`
// }

// const NavBar = ({ onMenuClick }) => {
//   const { auth } = usePage().props
//   const user = auth?.user || { name: 'Admin User', email: 'admin@example.com' }

//   const [profileOpen, setProfileOpen] = useState(false)
//   const [notifOpen, setNotifOpen] = useState(false)
//   const [allNotification, setAllNotification] = useState([])
//   const [unreadCount, setUnreadCount] = useState(0)
//   const [reloadTrigger, setReloadTrigger] = useState(0)

//   const profileRef = useRef(null)
//   const notifRef = useRef(null)

//   // Close dropdowns on outside click
//   useEffect(() => {
//     const handler = (e) => {
//       if (profileRef.current && !profileRef.current.contains(e.target)) {
//         setProfileOpen(false)
//       }
//       if (notifRef.current && !notifRef.current.contains(e.target)) {
//         setNotifOpen(false)
//       }
//     }
//     document.addEventListener('mousedown', handler)
//     return () => document.removeEventListener('mousedown', handler)
//   }, [])

//   // Fetch notifications
//   useEffect(() => {
//     const fetchNotification = async () => {
//       try {
//         const response = await axios.get(route('ournotifications.index'))
//         setAllNotification(response.data.notifications?.data || [])
//         setUnreadCount(response.data.unread_count || 0)
//       } catch (error) {
//         console.error('fetching error ', error)
//       }
//     }

//     fetchNotification()
//   }, [reloadTrigger])

//   // Poll every 30 seconds for new registrations
//   useEffect(() => {
//     const interval = setInterval(() => setReloadTrigger((t) => t + 1), 30000)
//     return () => clearInterval(interval)
//   }, [])

//   const markAsRead = useCallback(async (id) => {
//     // Optimistic update
//     setAllNotification((prev) =>
//       prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
//     )
//     setUnreadCount((c) => Math.max(0, c - 1))

//     try {
//       await axios.patch(route('ournotifications.mark-as-read', id))
//     } catch (error) {
//       console.error('mark as read error ', error)
//     } finally {
//       setReloadTrigger((t) => t + 1)
//     }
//   }, [])

//   const markAllAsRead = useCallback(async () => {
//     try {
//       await axios.patch(route('ournotifications.mark-all-as-read'))
//       setReloadTrigger((t) => t + 1)
//     } catch (error) {
//       console.error('mark all as read error ', error)
//     }
//   }, [])

//   const deleteNotification = useCallback(async (notification) => {
//     // Optimistic update
//     setAllNotification((prev) => prev.filter((n) => n.id !== notification.id))
//     if (!notification.is_read) {
//       setUnreadCount((c) => Math.max(0, c - 1))
//     }

//     try {
//       await axios.delete(route('ournotifications.destroy', notification.id))
//     } catch (error) {
//       console.error('delete notification error ', error)
//     } finally {
//       setReloadTrigger((t) => t + 1)
//     }
//   }, [])

//   const initials = user.name
//     .split(' ')
//     .map((n) => n[0])
//     .slice(0, 2)
//     .join('')
//     .toUpperCase()

//   return (
//     <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md sm:px-6 lg:px-8">
//       {/* Left */}
//       <div className="flex items-center gap-3">
//         <button
//           onClick={onMenuClick}
//           className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden"
//           aria-label="Open sidebar"
//         >
//           <Menu size={22} />
//         </button>
//       </div>

//       {/* Right */}
//       <div className="flex items-center gap-2 sm:gap-3">
//         {/* Notifications dropdown */}
//         <div className="relative" ref={notifRef}>
//           <button
//             onClick={() => {
//               setNotifOpen(!notifOpen)
//               setProfileOpen(false)
//             }}
//             className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-indigo-600"
//             aria-label="Notifications"
//           >
//             <Bell size={20} />
//             {unreadCount > 0 && (
//               <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center">
//                 <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
//                 <span className="relative inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white">
//                   {unreadCount > 99 ? '99+' : unreadCount}
//                 </span>
//               </span>
//             )}
//           </button>

//           {notifOpen && (
//             <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 sm:w-96">
//               <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3">
//                 <p className="text-sm font-semibold text-slate-800">
//                   Notifications
//                   {unreadCount > 0 && (
//                     <span className="ml-2 rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-600">
//                       {unreadCount} new
//                     </span>
//                   )}
//                 </p>
//                 {unreadCount > 0 && (
//                   <button
//                     onClick={markAllAsRead}
//                     className="flex items-center gap-1 text-xs font-medium text-indigo-600 transition hover:text-indigo-800"
//                   >
//                     <CheckCheck size={14} /> Mark all read
//                   </button>
//                 )}
//               </div>

//               <div className="max-h-96 overflow-y-auto">
//                 {allNotification.length === 0 ? (
//                   <p className="px-4 py-8 text-center text-sm text-slate-500">
//                     No notifications yet
//                   </p>
//                 ) : (
//                   allNotification.map((n) => (
//                     <div
//                       key={n.id}
//                       className={`group flex w-full items-start gap-3 border-b border-slate-100 px-4 py-3 text-left transition last:border-b-0 hover:bg-slate-50 ${
//                         n.is_read ? 'bg-white' : 'bg-indigo-50/50'
//                       }`}
//                     >
//                       <span
//                         className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
//                           n.is_read ? 'bg-transparent' : 'bg-indigo-500'
//                         }`}
//                       />

//                       <span className="min-w-0 flex-1">
//                         <span
//                           className={`block text-sm ${
//                             n.is_read ? 'text-slate-600' : 'font-medium text-slate-800'
//                           }`}
//                         >
//                           {n.message}
//                         </span>
//                         <span className="mt-0.5 block text-xs text-slate-400">
//                           {timeAgo(n.created_at)}
//                         </span>
//                       </span>

//                       <span className="flex shrink-0 items-center gap-0.5 ">
//                         {!n.is_read && (
//                           <button
//                             type="button"
//                             onClick={() => markAsRead(n.id)}
//                             className="rounded-lg p-1.5 text-slate-400 transition hover:bg-indigo-100 hover:text-indigo-600"
//                             aria-label="Mark as read"
//                             title="Mark as read"
//                           >
//                             <Check size={15} />
//                           </button>
//                         )}
//                         <button
//                           type="button"
//                           onClick={() => deleteNotification(n)}
//                           className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-200 hover:text-rose-600"
//                           aria-label="Delete notification"
//                           title="Delete"
//                         >
//                           <Trash2 size={15} />
//                         </button>
//                       </span>
//                     </div>
//                   ))
//                 )}
//               </div>
//             </div>
//           )}
//         </div>

//         <div className="hidden h-8 w-px bg-slate-200 sm:block" />

//         {/* Profile dropdown */}
//         <div className="relative" ref={profileRef}>
//           <button
//             onClick={() => {
//               setProfileOpen(!profileOpen)
//               setNotifOpen(false)
//             }}
//             className="flex items-center gap-3 rounded-xl p-1.5 pr-2 transition hover:bg-slate-100"
//           >
//             <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-semibold text-white shadow-md shadow-indigo-500/30">
//               {initials}
//             </span>
//             <span className="hidden text-left sm:block">
//               <span className="block text-sm font-semibold leading-tight text-slate-800">
//                 {user.name}
//               </span>
//               <span className="block text-xs text-slate-500">Administrator</span>
//             </span>
//             <ChevronDown
//               size={16}
//               className={`hidden text-slate-400 transition-transform sm:block ${
//                 profileOpen ? 'rotate-180' : ''
//               }`}
//             />
//           </button>

//           {profileOpen && (
//             <div className="absolute right-0 mt-2 w-60 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10">
//               <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">
//                 <p className="truncate text-sm font-semibold text-slate-800">{user.name}</p>
//                 <p className="truncate text-xs text-slate-500">{user.email}</p>
//               </div>

//               <div className="border-t border-slate-100 p-1.5">
//                 <Link
//                   href="/logout"
//                   method="post"
//                   as="button"
//                   className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-rose-600 transition hover:bg-rose-50"
//                 >
//                   <LogOut size={16} /> Logout
//                 </Link>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   )
// }

// export default NavBar


import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Link, usePage } from '@inertiajs/react'
import axios from 'axios'
import { Menu, Bell, ChevronDown, LogOut, CheckCheck, Check, Trash2 } from 'lucide-react'

const timeAgo = (dateString) => {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000)
  if (seconds < 60) return 'Just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}


const getInitials = (name) => {
  const parts = (name ?? '').trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

// Defined OUTSIDE the main component. Shows the photo, or initials when there is
// no photo (or the photo fails to load).
const UserAvatar = ({ name, image }) => {
  const [failed, setFailed] = useState(false)

  // Reset the error state if the user's image changes
  useEffect(() => {
    setFailed(false)
  }, [image])

  if (image && !failed) {
    return (
      <img
        src={`/storage/${image}`}
        alt={name}
        onError={() => setFailed(true)}
        className="h-9 w-9 shrink-0 rounded-full object-cover shadow-md shadow-indigo-500/30"
      />
    )
  }

  return (
    <span
      className="flex h-9 w-9 shrink-0 select-none items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-semibold text-white shadow-md shadow-indigo-500/30"
      title={name}
    >
      {getInitials(name)}
    </span>
  )
}

const NavBar = ({ onMenuClick }) => {
  const { auth } = usePage().props
  const user = auth?.user || { name: 'Admin User', email: 'admin@example.com' }

  const [profileOpen, setProfileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [allNotification, setAllNotification] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [reloadTrigger, setReloadTrigger] = useState(0)

  const profileRef = useRef(null)
  const notifRef = useRef(null)

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

      const handleLogout = () => {
        axios
            .post(route("logout"))
            .then((response) => {
                if (response.data.redirect) {
                    window.location.href = response.data.redirect;
                } else {
                    window.location.href = "/login";
                }
            })
            .catch((error) => {
                console.error("Logout error:", error);
                window.location.href = "/login";
            });
    };

  // Fetch notifications
  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const response = await axios.get(route('ournotifications.index'))
        setAllNotification(response.data.notifications?.data || [])
        setUnreadCount(response.data.unread_count || 0)
      } catch (error) {
        console.error('fetching error ', error)
      }
    }

    fetchNotification()
  }, [reloadTrigger])

  // Poll every 30 seconds for new registrations
  useEffect(() => {
    const interval = setInterval(() => setReloadTrigger((t) => t + 1), 30000)
    return () => clearInterval(interval)
  }, [])

  const markAsRead = useCallback(async (id) => {
    // Optimistic update
    setAllNotification((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    )
    setUnreadCount((c) => Math.max(0, c - 1))

    try {
      await axios.patch(route('ournotifications.mark-as-read', id))
    } catch (error) {
      console.error('mark as read error ', error)
    } finally {
      setReloadTrigger((t) => t + 1)
    }
  }, [])

  const markAllAsRead = useCallback(async () => {
    try {
      await axios.patch(route('ournotifications.mark-all-as-read'))
      setReloadTrigger((t) => t + 1)
    } catch (error) {
      console.error('mark all as read error ', error)
    }
  }, [])

  const deleteNotification = useCallback(async (notification) => {
    // Optimistic update
    setAllNotification((prev) => prev.filter((n) => n.id !== notification.id))
    if (!notification.is_read) {
      setUnreadCount((c) => Math.max(0, c - 1))
    }

    try {
      await axios.delete(route('ournotifications.destroy', notification.id))
    } catch (error) {
      console.error('delete notification error ', error)
    } finally {
      setReloadTrigger((t) => t + 1)
    }
  }, [])

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notifications dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setNotifOpen(!notifOpen)
              setProfileOpen(false)
            }}
            className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-indigo-600"
            aria-label="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 sm:w-96">
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3">
                <p className="text-sm font-semibold text-slate-800">
                  Notifications
                  {unreadCount > 0 && (
                    <span className="ml-2 rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-600">
                      {unreadCount} new
                    </span>
                  )}
                </p>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="flex items-center gap-1 text-xs font-medium text-indigo-600 transition hover:text-indigo-800"
                  >
                    <CheckCheck size={14} /> Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-96 overflow-y-auto">
                {allNotification.length === 0 ? (
                  <p className="px-4 py-8 text-center text-sm text-slate-500">
                    No notifications yet
                  </p>
                ) : (
                  allNotification.map((n) => (
                    <div
                      key={n.id}
                      className={`group flex w-full items-start gap-3 border-b border-slate-100 px-4 py-3 text-left transition last:border-b-0 hover:bg-slate-50 ${
                        n.is_read ? 'bg-white' : 'bg-indigo-50/50'
                      }`}
                    >
                      <span
                        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                          n.is_read ? 'bg-transparent' : 'bg-indigo-500'
                        }`}
                      />

                      <span className="min-w-0 flex-1">
                        <span
                          className={`block text-sm ${
                            n.is_read ? 'text-slate-600' : 'font-medium text-slate-800'
                          }`}
                        >
                          {n.message}
                        </span>
                        <span className="mt-0.5 block text-xs text-slate-400">
                          {timeAgo(n.created_at)}
                        </span>
                      </span>

                      <span className="flex shrink-0 items-center gap-0.5 ">
                        {!n.is_read && (
                          <button
                            type="button"
                            onClick={() => markAsRead(n.id)}
                            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-indigo-100 hover:text-indigo-600"
                            aria-label="Mark as read"
                            title="Mark as read"
                          >
                            <Check size={15} />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => deleteNotification(n)}
                          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-200 hover:text-rose-600"
                          aria-label="Delete notification"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="hidden h-8 w-px bg-slate-200 sm:block" />

        {/* Profile dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => {
              setProfileOpen(!profileOpen)
              setNotifOpen(false)
            }}
            className="flex items-center gap-3 rounded-xl p-1.5 pr-2 transition hover:bg-slate-100"
          >
            <UserAvatar name={user.name} image={user.image} />
            <span className="hidden text-left sm:block">
              <span className="block text-sm font-semibold leading-tight text-slate-800">
                {user.name}
              </span>
              <span className="block text-xs text-slate-500">{user.role}</span>
            </span>
            <ChevronDown
              size={16}
              className={`hidden text-slate-400 transition-transform sm:block ${
                profileOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-60 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10">
              <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">
                <p className="truncate text-sm font-semibold text-slate-800">{user.name}</p>
                <p className="truncate text-xs text-slate-500">{user.email}</p>
              </div>

              <div className="border-t border-slate-100 p-1.5">
                <button
                  onClick={handleLogout}
                  method="post"
                  as="button"
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-rose-600 transition hover:bg-rose-50"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default NavBar