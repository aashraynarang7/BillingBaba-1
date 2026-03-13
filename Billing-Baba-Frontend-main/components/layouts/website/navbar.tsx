"use client"

import { useState, useEffect, useRef, ReactNode, Fragment } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Menu, X, Smartphone, ChevronDown,
  Receipt, Warehouse, FileText, Scan, Store, Computer,
  HeartPulse, ShoppingBasket, UtensilsCrossed, Gem, Shirt, ArrowRight,
} from "lucide-react"

// ---------------- Login Modal ----------------
interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

function LoginModal({ isOpen, onClose }: LoginModalProps) {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/60 z-[100] flex justify-end animate-in fade-in-0"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative h-full w-full max-w-md bg-white p-8 shadow-xl animate-in slide-in-from-right-full duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-700"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col h-full pt-10">
          <div className="flex justify-between items-baseline mb-10">
            <h2 className="text-3xl font-bold text-gray-800">Login</h2>
            <Link href="/create-account" onClick={onClose} className="text-blue-600 font-medium hover:underline">
              Create Account
            </Link>
          </div>

          <form className="flex flex-col gap-5">
            <div className="flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500">
              <div className="flex select-none items-center gap-2 p-3 border-r border-gray-300 text-gray-600">
                <span>🇮🇳</span>
                <span>+91</span>
              </div>
              <input
                type="tel"
                placeholder="Enter Phone"
                className="w-full p-3 border-none outline-none bg-transparent placeholder:text-gray-400"
              />
            </div>

            <div className="text-center">
              <button type="button" className="text-sm text-blue-600 font-medium hover:underline">
                Login using email
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-bold py-3 rounded-md flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors"
            >
              <span>Login</span>
              <ArrowRight size={20} />
            </button>
          </form>

          <div className="mt-4 text-center">
            <Link href="/forgot-password" onClick={onClose} className="text-sm text-blue-600 font-medium hover:underline">
              Forgot Password
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------- Header with Nav ----------------
const colorClasses = {
  red: "bg-red-50 text-red-600",
  green: "bg-green-50 text-green-600",
  purple: "bg-purple-50 text-purple-600",
  cyan: "bg-cyan-50 text-cyan-600",
  orange: "bg-orange-50 text-orange-600",
  blue: "bg-blue-50 text-blue-600",
}

type IconColor = keyof typeof colorClasses

const SolutionIcon = ({ icon, color }: { icon: ReactNode; color: IconColor }) => (
  <div className={`flex h-8 w-8 items-center justify-center rounded-md ${colorClasses[color]}`}>{icon}</div>
)

const solutionItems = {
  business: [
    { icon: <Receipt size={16} />, name: "Accounting", href: "/solutions/bms/accounting", color: "red" },
    { icon: <Warehouse size={16} />, name: "Inventory", href: "/solutions/bms/inventory", color: "green" },
    { icon: <FileText size={16} />, name: "Invoicing", href: "/solutions/bms/invoicing", color: "purple" },
    { icon: <Scan size={16} />, name: "E-Invoice", href: "/solutions/bms/einvoice", color: "cyan" },
    { icon: <Store size={16} />, name: "POS", href: "/solutions/bms/pos", color: "orange" },
    { icon: <Computer size={16} />, name: "OCR", href: "/solutions/bms/ocr", color: "blue" },
  ],
  industry: [
    { icon: <Store size={16} />, name: "Retail", href: "/solutions/is/retail", color: "red" },
    { icon: <HeartPulse size={16} />, name: "Pharmacy", href: "/solutions/is/pharmacy", color: "green" },
    { icon: <ShoppingBasket size={16} />, name: "Grocery", href: "/solutions/is/grocery", color: "blue" },
    { icon: <UtensilsCrossed size={16} />, name: "Restaurant", href: "/solutions/is/restaurant", color: "purple" },
    { icon: <Gem size={16} />, name: "Jewellery", href: "/solutions/is/jewellery", color: "orange" },
    { icon: <Shirt size={16} />, name: "Clothing/Apparel", href: "/solutions/is/clothing", color: "cyan" },
  ],
}


const baseNavLinks = [
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About Us" },
  { href: "/desktop", label: "Desktop" },
  { href: "/career", label: "Careers" },
  { href: "/partner", label: "Partner with us" },
]

export default function HeaderWithLoginModal() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSolutionOpen, setIsSolutionOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  const pathname = usePathname()
  const solutionRef = useRef<HTMLDivElement | null>(null)

  const isHomePage = pathname === "/"
  const navLinks = isHomePage ? baseNavLinks : [{ href: "/", label: "Home" }, ...baseNavLinks]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (solutionRef.current && !solutionRef.current.contains(event.target as Node)) {
        setIsSolutionOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const linkClasses =
    "text-[var(--foreground)] transition-colors hover:text-gray-900 font-medium text-[15px] cursor-pointer"

  const closeAllMenus = () => {
    setIsMenuOpen(false)
    setIsSolutionOpen(false)
  }

  return (
    <Fragment>
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto flex h-20 items-center justify-between px-4">
          {/* Logo */}
          <Link href="/" onClick={closeAllMenus}>
            <Image src="/Logo2.svg" alt="Billing Baba Logo" width={160} height={48} priority className="h-12 w-auto" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#mobile-app" className={`flex items-center gap-1.5 ${linkClasses}`}>
              <Smartphone className="h-4 w-4" />
              <span>Try mobile app</span>
            </a>

            {/* Solutions dropdown */}
            <div className="relative" ref={solutionRef}>
              <button
                onClick={() => setIsSolutionOpen(!isSolutionOpen)}
                className={`flex items-center gap-1.5 ${linkClasses}`}
              >
                <span>Solutions</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isSolutionOpen ? "rotate-180" : ""}`} />
              </button>

              {isSolutionOpen && (
                <div className="absolute top-full left-1/2 mt-4 w-max -translate-x-1/2 rounded-xl bg-white p-6 shadow-xl ring-1 ring-black ring-opacity-5 animate-in fade-in-0 zoom-in-95">
                  <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                    onClick={() => setIsSolutionOpen(false)}
                  >
                    <X size={18} />
                  </button>
                  <div className="flex gap-8">
                    {/* Business */}
                    <div className="flex flex-col">
                      <h3 className="mb-3 font-semibold text-gray-900">Business Management Solutions</h3>
                      <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                        {solutionItems.business.map((item) => (
                          <Link
                            href={item.href}
                            key={item.name}
                            onClick={closeAllMenus}
                            className="flex items-center gap-3 rounded-md p-1 -m-1 transition-colors hover:bg-gray-50"
                          >
                            <SolutionIcon icon={item.icon} color={item.color as IconColor} />
                            <span className="text-sm font-medium text-gray-700">{item.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className="w-px bg-gray-200"></div>

                    {/* Industry */}
                    <div className="flex flex-col">
                      <h3 className="mb-3 font-semibold text-gray-900">Industry Solutions</h3>
                      <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                        {solutionItems.industry.map((item) => (
                          <Link
                            href={item.href}
                            key={item.name}
                            onClick={closeAllMenus}
                            className="flex items-center gap-3 rounded-md p-1 -m-1 transition-colors hover:bg-gray-50"
                          >
                            <SolutionIcon icon={item.icon} color={item.color as IconColor} />
                            <span className="text-sm font-medium text-gray-700">{item.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={linkClasses}>
                {link.label}
              </Link>
            ))}

            <button onClick={() => setIsLoginModalOpen(true)} className={linkClasses}>
              Login
            </button>
          </nav>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden animate-in fade-in slide-in-from-top-2 duration-300">
            <nav className="container flex flex-col gap-4 py-5 border-t">
              <a href="#mobile-app" onClick={closeAllMenus} className={`flex items-center gap-2 ${linkClasses}`}>
                <Smartphone className="h-4 w-4" />
                <span>Try mobile app</span>
              </a>
              <Link href="/solutions" onClick={closeAllMenus} className={linkClasses}>
                Solutions
              </Link>
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={closeAllMenus} className={linkClasses}>
                  {link.label}
                </Link>
              ))}
              <button
                onClick={() => {
                  closeAllMenus()
                  setIsLoginModalOpen(true)
                }}
                className={`text-left ${linkClasses}`}
              >
                Login
              </button>
            </nav>
          </div>
        )}
      </header>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </Fragment>
  )
}
