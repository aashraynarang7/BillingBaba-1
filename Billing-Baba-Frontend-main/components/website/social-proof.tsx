import React from 'react'

const stats = [
  {
    icon: <IconHappy />,
    title: <>1 Crore+</>,
    description: "Happy Customers",
  },
  {
    icon: <IconMobile />,
    title: <>Free</>,
    description: "Android Mobile App",
  },
  {
    icon: <IconPlayStore />,
    title: (
      <>
        Rated 4.7/<span className="text-primary">5</span>
      </>
    ),
    description: "On Google Play Store",
  },
  {
    icon: <IconMultiDevice />,
    title: (
      <>
        Multi-<span className="text-primary">Device</span>
      </>
    ),
    description: "Use together on Mobile/Desktop",
  },
  {
    icon: <IconMultiUser />,
    title: (
      <>
        Multi-<span className="text-primary">User</span>
      </>
    ),
    description: "User Management Feature",
  },
]

export default function SocialProof() {
  return (
    <section className="bg-secondary">
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-10 gap-x-4">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center text-center space-y-3">
              <div className="text-primary">{stat.icon}</div>
              <h3 className="text-2xl font-bold text-foreground leading-tight">{stat.title}</h3>
              <p className="text-sm text-foreground leading-snug">{stat.description}</p>
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
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="red"
      strokeWidth="1.5"
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
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="red"
      strokeWidth="1.5"
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
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="red"
      strokeWidth="1.5"
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
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="red"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="7" width="20" height="13" rx="2" />
      <path d="M20 7V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v1" />
      <path d="M12 20v-2" />
      <path d="M8 22h8" />
      <path d="M18 11.5v-3a.5.5 0 0 0-.5-.5h-2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5z" />
    </svg>
  )
}

function IconMultiUser() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="red"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 11h-6" />
      <path d="M19 8v6" />
      <path d="M19.5 17.5a3.5 3.5 0 0 1 0-7H19" />
    </svg>
  )
}