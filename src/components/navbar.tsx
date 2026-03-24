import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {MoonIcon, SunIcon} from "lucide-react";

interface NavItem {
  title: string
  href?: string
  items?: { title: string; href: string; description?: string }[]
}

interface NavConfig {
  guest: NavItem[]
  user: NavItem[]
  admin: NavItem[]
  superadmin: NavItem[]
}

interface NavbarProps {
  className?: string
}

export function Navbar({ className }: NavbarProps) {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY < 0) return

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY, isMounted])

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ar" : "en"
    i18n.changeLanguage(newLang)
  }

  const toggleTheme = () => {
    const root = document.documentElement
    const isDark = root.classList.contains("dark")
    if (isDark) {
      root.classList.remove("dark")
    } else {
      root.classList.add("dark")
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate("/")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const navConfig: NavConfig = {
    guest: [
      { title: t("nav.home"), href: "/" },
      { title: t("nav.quran"), href: "/quran" },
      { title: t("nav.books"), items: [
        { title: t("nav.allBooks"), href: "/books", description: t("nav.booksDesc") },
        { title: t("nav.favorites"), href: "/favorites", description: t("nav.favoritesDesc") },
      ]},
    ],
    user: [
      { title: t("nav.home"), href: "/" },
      { title: t("nav.quran"), href: "/quran" },
      { title: t("nav.books"), items: [
        { title: t("nav.allBooks"), href: "/books", description: t("nav.booksDesc") },
        { title: t("nav.favorites"), href: "/favorites", description: t("nav.favoritesDesc") },
      ]},
      { title: t("nav.profile"), href: "/profile" },
    ],
    admin: [
      { title: t("nav.home"), href: "/" },
      { title: t("nav.quran"), href: "/quran" },
      { title: t("nav.books"), items: [
        { title: t("nav.allBooks"), href: "/books", description: t("nav.booksDesc") },
        { title: t("nav.favorites"), href: "/favorites", description: t("nav.favoritesDesc") },
      ]},
      { title: t("nav.profile"), href: "/profile" },
      { title: t("nav.admin"), items: [
        { title: t("nav.dashboard"), href: "/admin/dashboard", description: t("nav.dashboardDesc") },
        { title: t("nav.users"), href: "/admin/users", description: t("nav.usersDesc") },
        { title: t("nav.content"), href: "/admin/content", description: t("nav.contentDesc") },
      ]},
    ],
    superadmin: [
      { title: t("nav.home"), href: "/" },
      { title: t("nav.quran"), href: "/quran" },
      { title: t("nav.books"), items: [
        { title: t("nav.allBooks"), href: "/books", description: t("nav.booksDesc") },
        { title: t("nav.favorites"), href: "/favorites", description: t("nav.favoritesDesc") },
      ]},
      { title: t("nav.profile"), href: "/profile" },
      { title: t("nav.admin"), items: [
        { title: t("nav.dashboard"), href: "/admin/dashboard", description: t("nav.dashboardDesc") },
        { title: t("nav.users"), href: "/admin/users", description: t("nav.usersDesc") },
        { title: t("nav.content"), href: "/admin/content", description: t("nav.contentDesc") },
      ]},
      { title: t("nav.superAdmin"), items: [
        { title: t("nav.settings"), href: "/superadmin/settings", description: t("nav.settingsDesc") },
        { title: t("nav.analytics"), href: "/superadmin/analytics", description: t("nav.analyticsDesc") },
      ]},
    ],
  }

  const role = user?.role || "guest"
  const navItems = navConfig[role] || navConfig.guest

  const getInitials = (name: string | null) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <TooltipProvider>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50",
          isVisible ? "translate-y-0" : "-translate-y-full",
          "bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 shadow-2xl",
          className
        )}
      >
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <a href="/" className="flex items-center gap-2">
                <img
                  src={"/othman-dark.png"}
                  alt={t("app.name")}
                  className="h-10 w-auto scale-0 dark:scale-100"
                />
                <img
                    src={"/othman-light.png"}
                    alt={t("app.name")}
                    className="absolute h-10 w-auto scale-100 dark:scale-0"
                />
              </a>
            </div>

            {/* Navigation */}
            <div className="hidden md:flex">
              <NavigationMenu>
                <NavigationMenuList>
                  {navItems.map((item, index) => (
                    <NavigationMenuItem key={index}>
                      {item.items ? (
                        <>
                          <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
                          <NavigationMenuContent>
                            <ul className="grid gap-3 p-6 md:w-100 lg:w-125 lg:grid-cols-[.75fr_1fr]">
                              {item.items.map((subItem, subIndex) => (
                                <li key={subIndex}>
                                  <NavigationMenuLink asChild>
                                    <a
                                      href={subItem.href}
                                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                    >
                                      <div className="text-sm font-medium leading-none">
                                        {subItem.title}
                                      </div>
                                      {subItem.description && (
                                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                          {subItem.description}
                                        </p>
                                      )}
                                    </a>
                                  </NavigationMenuLink>
                                </li>
                              ))}
                            </ul>
                          </NavigationMenuContent>
                        </>
                      ) : (
                        <NavigationMenuLink asChild>
                          <a
                            href={item.href}
                            className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50"
                          >
                            {item.title}
                          </a>
                        </NavigationMenuLink>
                      )}
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Language Toggle */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleLanguage}
                    className="h-9 w-9"
                  >
                    <span className="text-sm font-medium">{i18n.language.toUpperCase()}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("nav.toggleLanguage")}</p>
                </TooltipContent>
              </Tooltip>

              {/* Theme Toggle */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleTheme}
                    className="h-9 w-9 cursor-pointer"
                  >
                    <MoonIcon className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"/>
                    <SunIcon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("nav.toggleTheme")}</p>
                </TooltipContent>
              </Tooltip>

              {/* User Menu */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-9 w-9 rounded-full p-0">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user.photoURL || ""} alt={user.displayName || ""} />
                        <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.displayName || t("nav.user")}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      {t("nav.profile")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/settings")}>
                      {t("nav.settings")}
                    </DropdownMenuItem>
                    {(role === "admin" || role === "superadmin") && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate("/admin/dashboard")}>
                          {t("nav.adminPanel")}
                        </DropdownMenuItem>
                      </>
                    )}
                    {role === "superadmin" && (
                      <DropdownMenuItem onClick={() => navigate("/superadmin/settings")}>
                        {t("nav.superAdminPanel")}
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                      {t("nav.logout")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
                    {t("nav.login")}
                  </Button>
                  <Button size="sm" onClick={() => navigate("/register")}>
                    {t("nav.register")}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </TooltipProvider>
  )
}