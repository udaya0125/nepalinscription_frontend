// import React from 'react'
// import { Link, usePage } from '@inertiajs/react'
// import {
//   LayoutDashboard,
//   Users,
//   FolderKanban,
//   CalendarDays,
//   Ticket,
//   BarChart3,
//   Settings,
//   LifeBuoy,
//   LogOut,
//   ChevronsLeft,
//   ChevronsRight,
//   X,
//   Sparkles,
// } from 'lucide-react'

// const menuGroups = [
//   {
//     label: 'Main',
//     items: [
//       { name: 'Dashboard', href: '/admin-dashboard', icon: LayoutDashboard },
//       { name: 'Projects', href: '/projects', icon: FolderKanban },
//       { name: 'Customers', href: '/customers', icon: Users },
//       { name: 'Schedule', href: '/schedule', icon: CalendarDays },
//     ],
//   },
//   {
//     label: 'Management',
//     items: [
//       { name: 'Tickets', href: '/tickets', icon: Ticket, badge: 4 },
//       { name: 'Reports', href: '/reports', icon: BarChart3 },
//       { name: 'Settings', href: '/settings', icon: Settings },
//     ],
//   },
// ]

// const SideBar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {
//   const { url } = usePage()

//   const isActive = (href) => url === href || url.startsWith(href + '/') || url.startsWith(href + '?')

//   return (
//     <>
//       {/* Mobile overlay */}
//       <div
//         onClick={() => setMobileOpen(false)}
//         className={`fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm transition-opacity lg:hidden ${
//           mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
//         }`}
//       />

//       <aside
//         className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 text-slate-300 shadow-2xl transition-all duration-300 ${
//           collapsed ? 'lg:w-20' : 'lg:w-72'
//         } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
//       >
//         {/* Logo */}
//         <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-5">
//           <Link href="/dashboard" className="flex items-center gap-3">
//             <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/30">
//               <Sparkles size={18} />
//             </span>
//             <span
//               className={`text-lg font-semibold tracking-tight text-white ${
//                 collapsed ? 'lg:hidden' : ''
//               }`}
//             >
//               Admin<span className="text-indigo-400">Panel</span>
//             </span>
//           </Link>

//           <button
//             onClick={() => setMobileOpen(false)}
//             className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"
//             aria-label="Close sidebar"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         {/* Navigation */}
//         <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-6">
//           {menuGroups.map((group) => (
//             <div key={group.label}>
//               <p
//                 className={`mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 ${
//                   collapsed ? 'lg:hidden' : ''
//                 }`}
//               >
//                 {group.label}
//               </p>
//               {collapsed && <div className="mx-3 mb-2 hidden border-t border-white/10 lg:block" />}

//               <ul className="space-y-1">
//                 {group.items.map((item) => {
//                   const active = isActive(item.href)
//                   const Icon = item.icon
//                   return (
//                     <li key={item.name}>
//                       <Link
//                         href={item.href}
//                         title={collapsed ? item.name : undefined}
//                         onClick={() => setMobileOpen(false)}
//                         className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
//                           collapsed ? 'lg:justify-center' : ''
//                         } ${
//                           active
//                             ? 'bg-gradient-to-r from-indigo-500/90 to-violet-500/90 text-white shadow-lg shadow-indigo-500/25'
//                             : 'hover:bg-white/5 hover:text-white'
//                         }`}
//                       >
//                         <Icon
//                           size={20}
//                           className={`shrink-0 transition-transform group-hover:scale-110 ${
//                             active ? 'text-white' : 'text-slate-400 group-hover:text-indigo-300'
//                           }`}
//                         />
//                         <span className={`flex-1 truncate ${collapsed ? 'lg:hidden' : ''}`}>
//                           {item.name}
//                         </span>

//                         {item.badge && (
//                           <span
//                             className={`rounded-full bg-rose-500 px-2 py-0.5 text-[11px] font-semibold text-white ${
//                               collapsed ? 'lg:absolute lg:right-1.5 lg:top-1 lg:px-1.5 lg:py-0 lg:text-[10px]' : ''
//                             }`}
//                           >
//                             {item.badge}
//                           </span>
//                         )}
//                       </Link>
//                     </li>
//                   )
//                 })}
//               </ul>
//             </div>
//           ))}
//         </nav>

//         {/* Footer */}
//         <div className="shrink-0 space-y-2 border-t border-white/10 p-3">
//           <Link
//             href="/support"
//             title={collapsed ? 'Help & Support' : undefined}
//             className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white ${
//               collapsed ? 'lg:justify-center' : ''
//             }`}
//           >
//             <LifeBuoy size={20} className="shrink-0" />
//             <span className={collapsed ? 'lg:hidden' : ''}>Help &amp; Support</span>
//           </Link>

//           <Link
//             href="/logout"
//             method="post"
//             as="button"
//             title={collapsed ? 'Logout' : undefined}
//             className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-300 transition hover:bg-rose-500/10 hover:text-rose-200 ${
//               collapsed ? 'lg:justify-center' : ''
//             }`}
//           >
//             <LogOut size={20} className="shrink-0" />
//             <span className={collapsed ? 'lg:hidden' : ''}>Logout</span>
//           </Link>

//           {/* Collapse toggle (desktop only) */}
//           <button
//             onClick={() => setCollapsed(!collapsed)}
//             className="hidden w-full items-center justify-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-xs font-medium text-slate-400 transition hover:bg-white/10 hover:text-white lg:flex"
//           >
//             {collapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
//             {!collapsed && <span>Collapse</span>}
//           </button>
//         </div>
//       </aside>
//     </>
//   )
// }

// export default SideBar



import React from 'react'
import { Link, usePage } from '@inertiajs/react'
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  ChevronsLeft,
  ChevronsRight,
  X,
} from 'lucide-react'

const menuGroups = [
  {
    label: '',
    items: [
      { name: 'Dashboard', href: '/admin-dashboard', icon: LayoutDashboard },
      { name: 'User Management', href: '/user-management', icon: FolderKanban },
      { name: 'Activity Logs', href: '/activity-logs', icon: Users },
    ],
  },
]

const SideBar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {
  const { url } = usePage()

  const isActive = (href) => url === href || url.startsWith(href + '/') || url.startsWith(href + '?')

  return (
    <>
      {/* Mobile overlay */}
      <div
        onClick={() => setMobileOpen(false)}
        className={`fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity lg:hidden ${
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white text-slate-600 shadow-xl shadow-slate-900/5 transition-all duration-300 ${
          collapsed ? 'lg:w-20' : 'lg:w-72'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Logo + collapse toggle */}
        <div
          className={`flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-5 ${
            collapsed ? 'lg:justify-center lg:px-0' : ''
          }`}
        >
          {/* <Link href="/dashboard" className={`flex items-center gap-3 ${collapsed ? 'lg:hidden' : ''}`}>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/30">
              <Sparkles size={18} />
            </span>
            <span className="text-lg font-semibold tracking-tight text-slate-800">
              Admin<span className="text-indigo-600">Panel</span>
            </span>
          </Link> */}

   <Link href="/" className={`flex items-center gap-3 ${collapsed ? 'lg:hidden' : ''}`}>
  <img
    src="/images/new2.png"
    alt="Logo"
    className="h-14 w-auto shrink-0 object-contain"
  />
  <span className="whitespace-nowrap text-lg font-semibold tracking-tight text-slate-800">
    Nepal <span className="text-indigo-600">Inscription</span>
  </span>
</Link>

          {/* Collapse toggle (desktop only) */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-indigo-600 lg:flex"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronsRight size={20} /> : <ChevronsLeft size={20} />}
          </button>

          {/* Close button (mobile only) */}
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-6">
          {menuGroups.map((group) => (
            <div key={group.label}>
              <p
                className={`mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 ${
                  collapsed ? 'lg:hidden' : ''
                }`}
              >
                {group.label}
              </p>
              {collapsed && <div className="mx-3 mb-2 hidden border-t border-slate-200 lg:block" />}

              <ul className="space-y-1">
                {group.items.map((item) => {
                  const active = isActive(item.href)
                  const Icon = item.icon
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        title={collapsed ? item.name : undefined}
                        onClick={() => setMobileOpen(false)}
                        className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                          collapsed ? 'lg:justify-center' : ''
                        } ${
                          active
                            ? 'bg-indigo-50 text-indigo-600'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-indigo-600'
                        }`}
                      >
                        {active && (
                          <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-indigo-500 to-violet-500" />
                        )}

                        <Icon
                          size={20}
                          className={`shrink-0 transition-transform group-hover:scale-110 ${
                            active ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-600'
                          }`}
                        />
                        <span className={`flex-1 truncate ${collapsed ? 'lg:hidden' : ''}`}>
                          {item.name}
                        </span>

                        {item.badge && (
                          <span
                            className={`rounded-full bg-rose-500 px-2 py-0.5 text-[11px] font-semibold text-white ${
                              collapsed ? 'lg:absolute lg:right-1.5 lg:top-1 lg:px-1.5 lg:py-0 lg:text-[10px]' : ''
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  )
}

export default SideBar