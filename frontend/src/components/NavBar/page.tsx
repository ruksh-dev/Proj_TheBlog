import React, { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { Moon, Sun, Menu, X } from "lucide-react"
import { useRecoilValue } from "recoil"
import { profileAtom } from "../atoms"
import ProfileComp from "./Profile/page"

const defaultNavItems = [
  { name: "Home", path: "/" },
  { name: "Signin", path: "/signin" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
]

const loggedInNavItems = [
  { name: "Home", path: "/" },
  { name: "Create", path: "/blogform" },
  // { name: "Drafts", path: "/showdrafts" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
]


export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const profile=useRecoilValue(profileAtom)
  const location = useLocation()

  const navItems = profile!=null ? loggedInNavItems : defaultNavItems

  const toggleMenu = () => setIsOpen(!isOpen)
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-lg `}
    >
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8" >
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-3xl font-bold text-zinc-700 dark:text-white">THE BLOG</span>
            </Link>
          </div>
          <div className="flex item-center justify-between">
          <div className="hidden md:flex md:items-center md:space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-4 py-2 rounded-md text-3xl font-medium ${
                  location.pathname === item.path
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-zinc-700 hover:text-blue-600 dark:text-white"
                } transition-colors duration-200`}
              >
                {item.name}
              </Link>
            ))}
          </div>
          
          <div className="flex items-center space-x-4">
          {profile && (
              <div className="flex items-center justify-center pt-1">
                <ProfileComp />
              </div>
            )}
            <button
              onClick={toggleTheme}
              className="pt-1 pl-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none"
                aria-expanded={isOpen}
                aria-label="Toggle navigation menu"
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === item.path
                    ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900"
                    : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                } transition-colors duration-200`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {profile &&  (
              <div className="mt-4 px-3 py-2">
                <ProfileComp />
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

