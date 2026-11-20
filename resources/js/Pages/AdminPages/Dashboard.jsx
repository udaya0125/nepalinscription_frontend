import Wrapper from '@/AdminWrapper/Wrapper'
import { Link, usePage } from '@inertiajs/react'
import axios from 'axios'
import {
  ArrowUpRight,
  BookOpen,
  Clock3,
  LayoutDashboard,
  ListChecks,
  RefreshCw,
  ScrollText,
  UserCheck,
  Users,
} from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'

const Dashboard = () => {
  const { auth } = usePage().props
  const firstName = auth?.user?.name?.split(' ')[0] || 'Admin'
  const [now, setNow] = useState(new Date())
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ users: 0, approved: 0, pending: 0, logs: 0 })

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      const [usersResult, logsResult] = await Promise.allSettled([
        axios.get(route('ourusers.index'), { params: { per_page: 100 } }),
        axios.get(route('ourlogs.index')),
      ])
      const users = usersResult.status === 'fulfilled' ? usersResult.value.data?.data || [] : []
      const logs = logsResult.status === 'fulfilled' ? logsResult.value.data?.data || [] : []

      setStats({
        users: usersResult.status === 'fulfilled' ? usersResult.value.data?.total ?? users.length : 0,
        approved: users.filter((user) => user.is_approved === 'approved').length,
        pending: users.filter((user) => user.is_approved === 'pending').length,
        logs: logs.length,
      })
      setLoading(false)
    }

    fetchStats()
  }, [])

  const greeting = useMemo(() => {
    const hour = now.getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }, [now])

  const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  const date = now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })
  const secondProgress = `${((now.getSeconds() + 1) / 60) * 360}deg`

  const metricCards = [
    { label: 'Users', value: stats.users, helper: 'Registered researchers and visitors', href: '/user-management', icon: Users, theme: 'bg-indigo-50 text-indigo-600' },
    { label: 'Approved', value: stats.approved, helper: 'Accounts ready to access the archive', href: '/user-management', icon: UserCheck, theme: 'bg-emerald-50 text-emerald-600' },
    { label: 'Pending', value: stats.pending, helper: 'Accounts awaiting your review', href: '/user-management', icon: Clock3, theme: 'bg-amber-50 text-amber-600' },
    { label: 'Activity logs', value: stats.logs, helper: 'Recorded administration actions', href: '/activity-logs', icon: ScrollText, theme: 'bg-violet-50 text-violet-600' },
  ]

  const quickActions = [
    { label: 'Manage users', description: 'Review profiles and access requests', href: '/user-management', icon: Users },
    { label: 'Review activity logs', description: 'See recent administrative actions', href: '/activity-logs', icon: ListChecks },
    { label: 'Browse inscriptions', description: 'Open the public inscription collection', href: '/inscriptions', icon: BookOpen },
  ]

  return (
    <Wrapper>
      <div className="space-y-5">
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-950 via-indigo-800 to-violet-600 px-7 py-8 text-white shadow-lg shadow-indigo-950/20 md:px-10 md:py-9">
          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/[0.08] blur-2xl" />
          <div className="pointer-events-none absolute -bottom-24 right-10 h-56 w-56 rounded-full bg-black/[0.12] blur-2xl" />
          <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07]" aria-hidden="true">
            <defs><pattern id="inscriptionDotGrid" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.4" fill="white" /></pattern></defs>
            <rect width="100%" height="100%" fill="url(#inscriptionDotGrid)" />
          </svg>

          <div className="relative z-10 flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium backdrop-blur-sm">
                <LayoutDashboard size={13} /> Nepal Inscription Dashboard
                <span className="ml-1 h-1.5 w-1.5 rounded-full bg-indigo-200 shadow-[0_0_6px_2px_rgba(199,210,254,0.6)]" />
              </div>
              <h1 className="text-3xl font-semibold tracking-tight md:text-[2.1rem]">{greeting}, {firstName}.</h1>
              <p className="mt-2.5 max-w-md text-sm leading-relaxed text-indigo-100/85 md:text-[0.925rem]">Manage researcher access, monitor activity, and keep the Nepal inscription archive organised.</p>
            </div>

            <div className="flex items-center gap-5 rounded-3xl border border-white/10 bg-white/[0.07] px-5 py-4 backdrop-blur-sm">
              <div className="relative grid h-[92px] w-[92px] place-items-center rounded-full" style={{ background: `conic-gradient(#c7d2fe ${secondProgress}, rgba(255,255,255,.16) 0)` }}>
                <div className="grid h-[82px] w-[82px] place-items-center rounded-full bg-indigo-800"><div className="text-center"><span className="block text-[10px] font-semibold tracking-[0.18em] text-indigo-200">LIVE</span><span className="text-xl font-bold tabular-nums">{String(now.getSeconds()).padStart(2, '0')}</span></div></div>
              </div>
              <div><p className="text-3xl font-bold tracking-tight md:text-4xl">{time}</p><p className="mt-1 text-sm text-indigo-100/85">{date}</p><p className="mt-1 text-xs text-indigo-200/75">Archive administration</p></div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metricCards.map((card) => {
            const Icon = card.icon
            return <Link key={card.label} href={card.href} className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md">
              <div className="flex items-start justify-between"><div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.theme}`}><Icon size={19} /></div><ArrowUpRight size={16} className="text-slate-300 transition-colors group-hover:text-indigo-500" /></div>
              <div className="mt-5">{loading ? <span className="block h-9 w-14 animate-pulse rounded-lg bg-slate-100" /> : <p className="text-4xl font-bold leading-none tracking-tight text-slate-900">{card.value}</p>}<p className="mt-2.5 text-sm font-semibold text-slate-700">{card.label}</p><p className="mt-0.5 text-xs text-slate-400">{card.helper}</p></div>
            </Link>
          })}
        </section>

        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between"><div><h2 className="text-[15px] font-bold text-slate-900">Quick access</h2><p className="mt-0.5 text-xs text-slate-400">Jump to the areas you manage most often.</p></div><RefreshCw size={16} className={loading ? 'animate-spin text-indigo-400' : 'text-slate-300'} /></div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {quickActions.map((action) => {
              const Icon = action.icon
              return <Link key={action.label} href={action.href} className="group flex items-center gap-3.5 rounded-xl border border-slate-100 p-3.5 transition-all hover:border-indigo-100 hover:bg-indigo-50/50">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition-all group-hover:bg-white group-hover:text-indigo-600"><Icon size={17} /></div>
                <div className="min-w-0 flex-1"><p className="text-sm font-semibold text-slate-800">{action.label}</p><p className="mt-0.5 truncate text-[11px] text-slate-400">{action.description}</p></div><ArrowUpRight size={15} className="shrink-0 text-slate-300 group-hover:text-indigo-500" />
              </Link>
            })}
          </div>
        </section>
      </div>
    </Wrapper>
  )
}

export default Dashboard


// import Wrapper from '@/AdminWrapper/Wrapper'
// import React from 'react'

// const Dashboard = () => {
//   return (
//     <div>
//       <Wrapper>
//         <div className="rounded-lg border-2 border-dashed border-slate-200 p-6 text-center">
//           <h2 className="text-2xl font-semibold text-slate-800">Welcome to the Admin Dashboard</h2>
//           <p className="mt-2 text-sm text-slate-500">
//             This is the main dashboard where you can manage your application settings and view
//             important information.
//           </p>
//         </div>
//       </Wrapper>
//     </div>
//   )
// }

// export default Dashboard
