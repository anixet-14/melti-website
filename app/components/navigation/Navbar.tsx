// app/components/navigation/Navbar.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Search,
  User,
  LogOut,
  Menu,
  X,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { MELTI_PRODUCTS } from '@/app/config/productsConfig';

interface NavbarProps {
  /** Optional external cart count if lifted to page/context state later */
  cartCount?: number;
  /** Optional custom handler when the bag icon is clicked */
  onOpenCart?: () => void;
}

interface SessionUser {
  userId?: string;
  name: string;
  email: string;
}

const CREAM = '#FFF8F0';
const COCOA = '#1A120B';
const COCOA_DEEP = '#120B06';
const GOLD = '#D4A373';
const GOLD_LIGHT = '#EBC593';
const TERRACOTTA = '#C86D51';

const LINKS = [
  { href: '#products', id: 'products', label: 'Products' },
  { href: '#why-melti', id: 'why-melti', label: 'Why Melti' },
  { href: '#recipes', id: 'recipes', label: 'Recipes' },
  { href: '#story', id: 'story', label: 'Our Story' },
];

const NAVBAR_CSS = `
.mnav-shell {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  transition:
    background-color 0.4s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.4s ease,
    border-color 0.4s ease;
}

.mnav-ribbon {
  overflow: hidden;
  background: linear-gradient(90deg, #1E0F07 0%, #2E170B 50%, #1E0F07 100%);
  border-bottom: 1px solid rgba(212, 163, 115, 0.16);
  color: ${GOLD_LIGHT};
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  text-align: center;
  transition: max-height 0.35s ease, opacity 0.25s ease, padding 0.35s ease;
}

.mnav-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  transition: padding 0.35s ease;
}

.mnav-brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  position: relative;
}

.mnav-brand-text {
  font-size: 26px;
  font-weight: 900;
  letter-spacing: 0.12em;
  color: ${CREAM};
  transition: color 0.25s ease;
}

.mnav-brand:hover .mnav-brand-text {
  color: ${GOLD_LIGHT};
}

.mnav-link {
  position: relative;
  color: rgba(255, 248, 240, 0.84);
  text-decoration: none;
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  padding: 6px 2px;
  transition: color 0.2s ease;
  white-space: nowrap;
  cursor: pointer;
}

.mnav-link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 0%;
  height: 1.5px;
  background: linear-gradient(90deg, ${GOLD_LIGHT}, ${GOLD});
  transition: width 0.25s ease;
}

.mnav-link:hover,
.mnav-link.active {
  color: ${GOLD_LIGHT};
}

.mnav-link:hover::after,
.mnav-link.active::after {
  width: 100%;
}

.mnav-icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 9999px;
  color: rgba(255, 248, 240, 0.88);
  background: rgba(255, 248, 240, 0.03);
  border: 1px solid rgba(212, 163, 115, 0.14);
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease, transform 0.15s ease;
}

.mnav-icon-btn:hover {
  background: rgba(212, 163, 115, 0.14);
  border-color: rgba(212, 163, 115, 0.42);
  color: ${GOLD_LIGHT};
}

.mnav-icon-btn:active {
  transform: scale(0.95);
}

.mnav-user-pill {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 38px;
  padding: 0 13px;
  border-radius: 9999px;
  background: rgba(212, 163, 115, 0.12);
  border: 1px solid rgba(212, 163, 115, 0.34);
  color: ${GOLD_LIGHT};
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;
}

.mnav-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 11px 24px;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${COCOA};
  background: linear-gradient(135deg, ${GOLD_LIGHT} 0%, ${GOLD} 55%, #B9824F 100%);
  text-decoration: none;
  border: none;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(212, 163, 115, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.35);
  transition: filter 0.2s ease, transform 0.12s ease;
  white-space: nowrap;
}

.mnav-cta:hover {
  filter: brightness(1.08);
}

.mnav-cta:active {
  transform: scale(0.96);
}

.mnav-burger {
  display: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 9999px;
  border: 1px solid rgba(212, 163, 115, 0.24);
  background: rgba(255, 248, 240, 0.05);
  color: ${CREAM};
  cursor: pointer;
}

.mnav-desktop {
  display: flex;
}

.mnav-mobile-panel {
  display: none;
}

@media (max-width: 960px) {
  .mnav-desktop {
    display: none;
  }
  .mnav-burger {
    display: inline-flex;
  }
  .mnav-mobile-panel {
    display: block;
  }
}

.mnav-mobile-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${CREAM};
  text-decoration: none;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 6px 0;
}

.mnav-mobile-link:hover,
.mnav-mobile-link.active {
  color: ${GOLD_LIGHT};
}

/* ===== Search Overlay ===== */
.mnav-search-backdrop {
  position: fixed;
  inset: 0;
  z-index: 10002;
  background: rgba(10, 5, 3, 0.78);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 96px 20px 24px;
}

.mnav-search-box {
  width: 100%;
  max-width: 580px;
  border-radius: 26px;
  background: linear-gradient(160deg, #28150A 0%, #140B06 100%);
  border: 1.5px solid rgba(212, 163, 115, 0.38);
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.75);
  overflow: hidden;
  color: ${CREAM};
}

.mnav-search-input-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 22px;
  border-bottom: 1px solid rgba(212, 163, 115, 0.16);
}

.mnav-search-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: ${CREAM};
  font-size: 15px;
  font-weight: 600;
}

.mnav-search-input::placeholder {
  color: rgba(235, 197, 147, 0.45);
}

.mnav-search-result {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 13px 22px;
  text-decoration: none;
  color: ${CREAM};
  border-bottom: 1px solid rgba(212, 163, 115, 0.08);
  transition: background 0.18s ease;
}

.mnav-search-result:hover {
  background: rgba(212, 163, 115, 0.1);
}

/* ===== Slide-Over Bag Drawer ===== */
.mnav-drawer-backdrop {
  position: fixed;
  inset: 0;
  z-index: 10002;
  background: rgba(10, 5, 3, 0.72);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  display: flex;
  justify-content: flex-end;
}

.mnav-drawer {
  width: 100%;
  max-width: 400px;
  height: 100%;
  background: linear-gradient(180deg, #231208 0%, #120B06 100%);
  border-left: 1px solid rgba(212, 163, 115, 0.25);
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: ${CREAM};
  box-shadow: -24px 0 60px rgba(0, 0, 0, 0.65);
}
`;

export default function Navbar({ cartCount = 0, onOpenCart }: NavbarProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [bagOpen, setBagOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sync authenticated user from HTTP-only session cookie
  useEffect(() => {
    let active = true;
    fetch('/api/auth/me', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : { user: null }))
      .then((data) => {
        if (active) setCurrentUser(data.user || null);
      })
      .catch(() => {
        if (active) setCurrentUser(null);
      });

    return () => {
      active = false;
    };
  }, [pathname]);

  // Track scroll depth, sticky glass state, and active section highlight
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 30);

      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? Math.min(100, (y / docHeight) * 100) : 0);

      let current = '';
      for (const link of LINKS) {
        const el = document.getElementById(link.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 180 && rect.bottom >= 180) {
            current = link.id;
            break;
          }
        }
      }
      setActiveSection(current);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on desktop resize
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 960) setMobileMenuOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Keyboard shortcuts: Cmd/Ctrl + K to search, Escape to close overlays
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
        setBagOpen(false);
        setMobileMenuOpen(false);
      } else if (e.key === 'Escape') {
        setSearchOpen(false);
        setBagOpen(false);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Focus input when search opens
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 60);
    } else {
      setQuery('');
    }
  }, [searchOpen]);

  // Smoothly scroll to in-page sections even if hash is already active
  const handleAnchorClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (!href.startsWith('#')) return;
    const target = document.getElementById(href.slice(1));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.pushState(null, '', href);
      setMobileMenuOpen(false);
      setSearchOpen(false);
      setBagOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      setCurrentUser(null);
      setMobileMenuOpen(false);
    }
  };

  const matchingProducts = (MELTI_PRODUCTS || []).filter((p) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      p.name?.toLowerCase().includes(q) ||
      p.tagline?.toLowerCase().includes(q) ||
      p.cocoaPercent?.toLowerCase().includes(q) ||
      (Array.isArray(p.tastingNotes) &&
        p.tastingNotes.some((n) => n.toLowerCase().includes(q)))
    );
  });

  const handleBagClick = () => {
    if (onOpenCart) {
      onOpenCart();
    } else {
      setBagOpen(true);
    }
  };

  const firstName = currentUser?.name?.trim().split(' ')[0] || 'Member';

  return (
    <>
      <nav
        className="mnav-shell"
        style={{
          backgroundColor: isScrolled
            ? 'rgba(18, 11, 6, 0.82)'
            : 'rgba(18, 11, 6, 0.18)',
          backdropFilter: isScrolled ? 'blur(20px) saturate(150%)' : 'blur(6px)',
          WebkitBackdropFilter: isScrolled
            ? 'blur(20px) saturate(150%)'
            : 'blur(6px)',
          borderBottom: isScrolled
            ? '1px solid rgba(212, 163, 115, 0.18)'
            : '1px solid rgba(255, 248, 240, 0.06)',
          boxShadow: isScrolled ? '0 10px 34px rgba(0, 0, 0, 0.35)' : 'none',
        }}
      >
        <style>{NAVBAR_CSS}</style>

        {/* Collapsible Top D2C Announcement Strip */}
        <div
          className="mnav-ribbon"
          style={{
            maxHeight: isScrolled ? '0px' : '34px',
            opacity: isScrolled ? 0 : 1,
            padding: isScrolled ? '0 16px' : '8px 16px',
            borderBottomWidth: isScrolled ? '0px' : '1px',
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={11} /> Free Insulated Shipping Above ₹999 • Use Code{' '}
            <strong style={{ color: CREAM }}>FIRSTPOUR15</strong>
          </span>
        </div>

        {/* Main Bar */}
        <div
          className="mnav-inner"
          style={{ padding: isScrolled ? '13px 24px' : '17px 24px' }}
        >
          {/* Left: Brand Wordmark with Molten Gold Dot */}
          <Link href="/" className="mnav-brand" aria-label="Mèlti Home">
            <span className="mnav-brand-text">
              MÈLTI
              <span
                style={{
                  color: GOLD,
                  textShadow: '0 0 16px rgba(212, 163, 115, 0.45)',
                }}
              >
                .
              </span>
            </span>
          </Link>

          {/* Right: Navigation Links + Divider + Utility Controls */}
          <div className="mnav-desktop" style={{ alignItems: 'center', gap: '34px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
              {LINKS.map((l) => (
                <a
                  key={l.href}
                  href={pathname === '/' ? l.href : `/${l.href}`}
                  onClick={(e) => handleAnchorClick(e, l.href)}
                  className={`mnav-link ${activeSection === l.id ? 'active' : ''}`}
                >
                  {l.label}
                </a>
              ))}
            </div>

            <div style={{ width: '1px', height: '20px', background: `${GOLD}40` }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => setSearchOpen(true)}
                className="mnav-icon-btn"
                aria-label="Search chocolate blends"
                title="Search blends (⌘K)"
              >
                <Search size={16} strokeWidth={2.1} />
              </button>

              <button
                onClick={handleBagClick}
                className="mnav-icon-btn"
                style={{ position: 'relative' }}
                aria-label="Open pour bag"
              >
                <ShoppingBag size={16} strokeWidth={2.1} />
                <span
                  style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-2px',
                    minWidth: '16px',
                    height: '16px',
                    padding: '0 4px',
                    borderRadius: '9999px',
                    background: TERRACOTTA,
                    color: CREAM,
                    fontSize: '9px',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 0 0 2px ${COCOA_DEEP}`,
                  }}
                >
                  {cartCount}
                </span>
              </button>

              {currentUser ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="mnav-user-pill" title={currentUser.email}>
                    <User size={14} strokeWidth={2.2} />
                    Hi, {firstName}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="mnav-icon-btn"
                    aria-label="Log out"
                    title="Log out"
                  >
                    <LogOut size={15} strokeWidth={2.1} />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="mnav-icon-btn"
                  style={{
                    width: 'auto',
                    gap: '6px',
                    padding: '0 13px',
                    textDecoration: 'none',
                  }}
                >
                  <User size={15} strokeWidth={2.1} />
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.09em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Login
                  </span>
                </Link>
              )}

              <a
                href={pathname === '/' ? '#products' : '/#products'}
                onClick={(e) => handleAnchorClick(e, '#products')}
                className="mnav-cta"
              >
                Shop Now
              </a>
            </div>
          </div>

          {/* Mobile Controls (Search + Bag + Burger) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="mnav-mobile-panel">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => setSearchOpen(true)}
                className="mnav-icon-btn"
                aria-label="Search blends"
              >
                <Search size={17} />
              </button>

              <button
                onClick={handleBagClick}
                className="mnav-icon-btn"
                style={{ position: 'relative' }}
                aria-label="Open pour bag"
              >
                <ShoppingBag size={17} />
                <span
                  style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-2px',
                    minWidth: '16px',
                    height: '16px',
                    borderRadius: '9999px',
                    background: TERRACOTTA,
                    color: CREAM,
                    fontSize: '9px',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {cartCount}
                </span>
              </button>

              <button
                className="mnav-burger"
                onClick={() => setMobileMenuOpen((v) => !v)}
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Reading Progress Hairline */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            height: '1.5px',
            width: `${scrollProgress}%`,
            background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT}, ${TERRACOTTA})`,
            transition: 'width 0.12s ease-out',
            pointerEvents: 'none',
          }}
        />

        {/* Mobile Dropdown Panel */}
        <div
          className="mnav-mobile-panel"
          style={{
            maxHeight: mobileMenuOpen ? '460px' : '0px',
            overflow: 'hidden',
            transition: 'max-height 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
            background: 'rgba(18, 11, 6, 0.98)',
            backdropFilter: 'blur(22px)',
            WebkitBackdropFilter: 'blur(22px)',
            borderTop: mobileMenuOpen ? '1px solid rgba(212, 163, 115, 0.16)' : 'none',
          }}
        >
          <div style={{ padding: '22px 24px 28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={pathname === '/' ? l.href : `/${l.href}`}
                className={`mnav-mobile-link ${activeSection === l.id ? 'active' : ''}`}
                onClick={(e) => handleAnchorClick(e, l.href)}
              >
                <span>{l.label}</span>
                <ArrowRight size={14} style={{ color: GOLD }} />
              </a>
            ))}

            <div style={{ height: '1px', background: `${GOLD}2E`, margin: '4px 0' }} />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              {currentUser ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="mnav-user-pill">
                    <User size={14} /> Hi, {firstName}
                  </span>
                  <button
                    onClick={handleLogout}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      color: TERRACOTTA,
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 800,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                    }}
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: CREAM,
                    textDecoration: 'none',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                  }}
                >
                  <User size={16} style={{ color: GOLD }} /> Login / Signup
                </Link>
              )}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleBagClick();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: GOLD_LIGHT,
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                <ShoppingBag size={16} /> Bag ({cartCount})
              </button>
            </div>

            <a
              href={pathname === '/' ? '#products' : '/#products'}
              onClick={(e) => handleAnchorClick(e, '#products')}
              className="mnav-cta"
              style={{ width: '100%', padding: '13px 0', marginTop: '4px' }}
            >
              Explore Blends
            </a>
          </div>
        </div>
      </nav>

      {/* Quick-Blend Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSearchOpen(false)}
            className="mnav-search-backdrop"
          >
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.97 }}
              transition={{ duration: 0.22 }}
              onClick={(e) => e.stopPropagation()}
              className="mnav-search-box"
              role="dialog"
              aria-label="Search Melti chocolate blends"
            >
              <div className="mnav-search-input-row">
                <Search size={18} style={{ color: GOLD, flexShrink: 0 }} />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search blends, cocoa % or tasting notes (e.g. Hazelnut, 72%, Cardamom)..."
                  className="mnav-search-input"
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  aria-label="Close search"
                  className="mnav-icon-btn"
                  style={{ width: '32px', height: '32px' }}
                >
                  <X size={15} />
                </button>
              </div>

              <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                {matchingProducts.length > 0 ? (
                  matchingProducts.map((prod) => (
                    <a
                      key={prod.id}
                      href={pathname === '/' ? '#products' : '/#products'}
                      onClick={(e) => handleAnchorClick(e, '#products')}
                      className="mnav-search-result"
                    >
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: CREAM }}>
                          {prod.name}{' '}
                          <span style={{ fontSize: '11px', color: GOLD_LIGHT, fontWeight: 700 }}>
                            ({prod.cocoaPercent})
                          </span>
                        </div>
                        <div style={{ fontSize: '12px', color: 'rgba(235, 197, 147, 0.7)', marginTop: '2px' }}>
                          {prod.tastingNotes.join(' • ')}
                        </div>
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 900, color: GOLD_LIGHT }}>
                        ₹{prod.price200g}
                      </span>
                    </a>
                  ))
                ) : (
                  <div style={{ padding: '28px 22px', textAlign: 'center', fontSize: '13px', color: 'rgba(235, 197, 147, 0.7)' }}>
                    No blends matched &ldquo;{query}&rdquo;. Try searching 72%, Caramel, or Spiced.
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slide-Over Pour Bag Drawer */}
      <AnimatePresence>
        {bagOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setBagOpen(false)}
            className="mnav-drawer-backdrop"
          >
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 260 }}
              onClick={(e) => e.stopPropagation()}
              className="mnav-drawer"
              aria-label="Your Pour Bag"
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: '18px',
                    borderBottom: '1px solid rgba(212, 163, 115, 0.18)',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', color: GOLD }}>
                      Small-Batch Cart
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: 900, margin: '2px 0 0' }}>
                      Your Pour Bag ({cartCount})
                    </h3>
                  </div>
                  <button
                    onClick={() => setBagOpen(false)}
                    aria-label="Close bag"
                    className="mnav-icon-btn"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Free Shipping Progress Indicator */}
                <div
                  style={{
                    marginTop: '18px',
                    padding: '14px',
                    borderRadius: '16px',
                    background: 'rgba(212, 163, 115, 0.08)',
                    border: '1px solid rgba(212, 163, 115, 0.2)',
                  }}
                >
                  <div style={{ fontSize: '11.5px', fontWeight: 700, color: GOLD_LIGHT }}>
                    Add ₹999+ for complimentary cold-pack insulated shipping
                  </div>
                  <div
                    style={{
                      marginTop: '8px',
                      height: '5px',
                      borderRadius: '9999px',
                      background: 'rgba(255, 248, 240, 0.1)',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: cartCount > 0 ? '65%' : '0%',
                        height: '100%',
                        background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})`,
                        transition: 'width 0.35s ease',
                      }}
                    />
                  </div>
                </div>

                {/* Empty Bag State */}
                <div style={{ textAlign: 'center', padding: '56px 12px' }}>
                  <div
                    style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '9999px',
                      margin: '0 auto 14px',
                      background: 'rgba(212, 163, 115, 0.1)',
                      border: '1px solid rgba(212, 163, 115, 0.28)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: GOLD_LIGHT,
                    }}
                  >
                    <ShoppingBag size={22} />
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: CREAM }}>
                    Your mug is waiting
                  </div>
                  <p style={{ fontSize: '13px', color: 'rgba(235, 197, 147, 0.72)', marginTop: '6px', lineHeight: 1.55 }}>
                    Pick a single-origin couverture tin to start building your hot chocolate ritual.
                  </p>
                </div>
              </div>

              <a
                href={pathname === '/' ? '#products' : '/#products'}
                onClick={(e) => handleAnchorClick(e, '#products')}
                className="mnav-cta"
                style={{ width: '100%', padding: '14px 0' }}
              >
                Browse Signature Blends
              </a>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}