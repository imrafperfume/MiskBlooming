"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, ShoppingBag, User, Menu, X, MapPin, ChevronDown, Heart } from "lucide-react"
import { Button } from "../ui/Button"
import { useCartStore } from "../../store/cartStore"
import { useWishlistStore } from "../../store/wishlistStore"
import { motion, AnimatePresence } from "framer-motion"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  const totalItems = useCartStore((state) => state.getTotalItems())
  const wishlistItems = useWishlistStore((state) => state.getTotalItems())
  const navigation = [
    { name: "Home", href: "/" },
    {
      name: "Collections",
      href: "/products",
      dropdown: [
        { name: "Premium Roses", href: "/products?category=roses", description: "Elegant rose bouquets" },
        {
          name: "Mixed Arrangements",
          href: "/products?category=mixed-arrangements",
          description: "Seasonal flower arrangements",
        },
        { name: "Premium Chocolates", href: "/products?category=chocolates", description: "Luxury Belgian chocolates" },
        { name: "Fresh Cakes", href: "/products?category=cakes", description: "Made fresh daily" },
        { name: "Gift Sets & Hampers", href: "/products?category=gift-sets", description: "Curated gift collections" },
        { name: "Indoor Plants", href: "/products?category=plants", description: "Beautiful home plants" },
      ],
    },
    {
      name: "Occasions",
      href: "/occasions",
      dropdown: [
        { name: "Valentine's Day", href: "/occasions/valentines", description: "Romantic arrangements" },
        { name: "Mother's Day", href: "/occasions/mothers-day", description: "Show your love" },
        { name: "Birthday", href: "/occasions/birthday", description: "Celebration essentials" },
        { name: "Anniversary", href: "/occasions/anniversary", description: "Memorable moments" },
        { name: "Congratulations", href: "/occasions/congratulations", description: "Success celebrations" },
        { name: "Sympathy", href: "/occasions/sympathy", description: "Thoughtful condolences" },
      ],
    },
    {
      name: "Same Day Delivery",
      href: "/same-day-delivery",
      dropdown: [
        { name: "Express Delivery", href: "/delivery/express", description: "2-4 hours delivery" },
        { name: "Standard Delivery", href: "/delivery/standard", description: "Same day delivery" },
        { name: "Scheduled Delivery", href: "/delivery/scheduled", description: "Choose your time" },
        { name: "Corporate Delivery", href: "/delivery/corporate", description: "Business solutions" },
      ],
    },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`
    }
  }

  const handleDropdownToggle = (itemName: string) => {
    setActiveDropdown(activeDropdown === itemName ? null : itemName)
  }

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      
    >
      {/* Top Bar */}
      <div className="bg-charcoal-900 text-cream-50 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              🚚 Free Same-Day Delivery on Orders Above AED 500 | 📞 Call: +971
              4 123 4567
            </motion.span>
            <motion.div
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="flex items-center">
                <span className="mr-1">💎</span>
                AED
              </span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 shadow-md border-b" >
        <div className="flex  justify-between items-center py-2">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <motion.div
              className="lg:text-3xl md:text-3xl text-xl font-cormorant font-bold text-charcoal-900"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              Misk<span className="luxury-text">Blooming</span>
            </motion.div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                placeholder="Search flowers, chocolates, cakes, gifts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-2 pl-12 pr-4 border border-cream-400 rounded-full focus:ring-2 focus:ring-luxury-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            </form>
          </div>

          {/* Right Side */}
          <div className="flex items-center md:space-x-4 lg:space-x-4 space-x-1">
            {/* Delivery Location */}
            <div className="hidden lg:flex items-center text-sm">
              <MapPin className="w-4 h-4 mr-1 text-luxury-500" />
              <span className="mr-1">Deliver To</span>
              <button className="flex items-center luxury-text font-medium hover:text-luxury-600 transition-colors">
                Dubai <ChevronDown className="w-4 h-4 ml-1" />
              </button>
            </div>

            {/* Icons */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden"
            >
              <Search className="w-5 h-5" />
            </Button>

            <Link href="/wishlist">
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="w-5 h-5" />
                {wishlistItems > 0 && (
                  <motion.span
                    className="absolute -top-1 -right-1 bg-luxury-500 text-charcoal-900 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    {wishlistItems}
                  </motion.span>
                )}
              </Button>
            </Link>

            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <motion.span
                    className="absolute -top-1 -right-1 bg-luxury-500 text-charcoal-900 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    {totalItems}
                  </motion.span>
                )}
              </Button>
            </Link>

            <Link
              href="/auth/login"
              className="lg:inline-block md:inline-block hidden"
            >
              <Button variant="ghost" size="icon">
                <User className="w-5 h-5" />
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center justify-center space-x-8 pt-1 pb-4 relative">
          {navigation.map((item, index) => (
            <motion.div
              key={item.name}
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              onMouseEnter={() => item.dropdown && setActiveDropdown(item.name)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                href={item.href}
                className="text-charcoal-900 hover:text-luxury-500 transition-colors font-medium relative group flex items-center"
              >
                {item.name}
                {item.dropdown && <ChevronDown className="w-4 h-4 ml-1" />}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-luxury-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>

              {/* Dropdown Menu */}
              {item.dropdown && activeDropdown === item.name && (
                <motion.div
                  className="absolute  top-full left-0 mt-2 min-w-full bg-white rounded-xl shadow-xl border border-gray-200 p-4  z-50"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="grid gap-2 overflow-y-auto">
                    {item.dropdown.map((dropdownItem) => (
                      <Link
                        key={dropdownItem.name}
                        href={dropdownItem.href}
                        className="block w-60 p-3 rounded-lg hover:bg-luxury-50 transition-colors group"
                      >
                        <div className="font-medium text-charcoal-900 group-hover:text-luxury-600">
                          {dropdownItem.name}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {dropdownItem.description}
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </nav>

        {/* Mobile Search */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              className="md:hidden pb-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search flowers, chocolates, cakes, gifts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-3 pl-12 pr-4 border border-cream-400 rounded-full focus:ring-2 focus:ring-luxury-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              className="md:hidden pb-4 border-t border-cream-300 pt-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="flex flex-col space-y-4">
                {navigation.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <div>
                      <button
                        onClick={() =>
                          item.dropdown && handleDropdownToggle(item.name)
                        }
                        className="flex items-center justify-between w-full text-charcoal-900 hover:text-luxury-500 transition-colors font-medium"
                      >
                        <Link
                          href={item.href}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                        {item.dropdown && (
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${
                              activeDropdown === item.name ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </button>

                      {/* Mobile Dropdown */}
                      {item.dropdown && activeDropdown === item.name && (
                        <motion.div
                          className="mt-2 ml-4 space-y-2"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          {item.dropdown.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.name}
                              href={dropdownItem.href}
                              className="block py-2 text-sm text-gray-600 hover:text-luxury-500 transition-colors"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {dropdownItem.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}
                <Link
                  href="/auth/login"
                  className="flex items-center gap-2 bg-black text-white py-3 px-3 rounded-lg"
                >
                  <User className="w-5 h-5" />
                  <span className="font-semibold ">My Account</span>
                </Link>
                <div className="flex items-center pt-2">
                  <MapPin className="w-4 h-4 mr-1 text-luxury-500" />
                  <span className="mr-1 text-sm">Deliver To</span>
                  <button className="flex items-center luxury-text font-medium text-sm">
                    Dubai <ChevronDown className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}

export default Header
