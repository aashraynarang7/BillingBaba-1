import React from "react"

const stats = [
  {
    icon: <IconHappy />,
    title: <>1 Cr+</>,
    description: "Happy Customers",
  },
  {
    icon: <IconMobile />,
    title: <>FREE</>,
    description: "Android/iOS App",
  },
  {
    icon: <IconPlayStore />,
    title: <>Rated 4.7 / 5</>,
    description: "On Google Play Store",
  },
  {
    icon: <IconMultiDevice />,
    title: <>Multi-Device</>,
    description: "Access on Mobile/Desktop",
  },
  {
    icon: <IconMultiUser />,
    title: <>Multi-User</>,
    description: "User Management Feature",
  },
]

export default function SocialProof() {
  return (
    <section className="bg-background border-t-2 border-red-100">
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-10 gap-x-4">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center text-center space-y-2">
              <div className="text-[var(--primary-red)] mb-1">{stat.icon}</div>
              <h3 className="text-lg font-bold text-[var(--text-foreground)] leading-tight">{stat.title}</h3>
              <p className="text-sm text-[var(--text-foreground)] leading-tight">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function IconHappy() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" y1="9" x2="9.01" y2="9" />
      <line x1="15" y1="9" x2="15.01" y2="9" />
    </svg>
  )
}

function IconMobile() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  )
}

function IconPlayStore() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 20.5v-17L19.5 12Z" />
      <path d="m3 3.5 11 8.5" />
      <path d="M3 20.5 14 12" />
    </svg>
  )
}

function IconMultiDevice() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="14" height="14" x="8" y="2" rx="2" ry="2" />
      <rect width="14" height="14" x="2" y="8" rx="2" ry="2" />
    </svg>
  )
}

function IconMultiUser() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" x2="19" y1="8" y2="14" />
      <line x1="22" x2="16" y1="11" y2="11" />
    </svg>
  )
}