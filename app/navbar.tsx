"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { FaBars, FaComments, FaHeart, FaHome, FaShoppingCart, FaSignOutAlt, FaThLarge, FaTimes } from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";

const loggedInLinks = [
  { href: "/", label: "Início", icon: FaHome },
  { href: "/categories", label: "Produtos", icon: FaThLarge },
  { href: "/favorites", label: "Favoritos", icon: FaHeart },
  { href: "/messages", label: "Chat", icon: FaComments },
  { href: "/cart", label: "Carrinho", icon: FaShoppingCart },
];

const loggedOutLinks = [
  { href: "/", label: "Início", icon: FaHome },
  { href: "/categories", label: "Produtos", icon: FaThLarge },
];

export default function Navbar({ isLoggedIn }: { isLoggedIn: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const loggedIn = loading ? isLoggedIn : Boolean(user);
  const navigationLinks = loggedIn ? loggedInLinks : loggedOutLinks;

  async function handleSignOut() {
    await signOut();
    setMenuOpen(false);
    router.push("/login");
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <nav className="site-navbar" aria-label="Navegação principal">
      <Link className="site-logo" href="/" aria-label="ReUse Home">
        <Image src="/brand/logo.png" alt="ReUse" width={106} height={42} priority />
      </Link>
      <button
        type="button"
        className="site-menu-toggle"
        onClick={() => setMenuOpen((open) => !open)}
        aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
        aria-expanded={menuOpen}
        aria-controls="main-navigation"
      >
        {menuOpen ? <FaTimes aria-hidden="true" /> : <FaBars aria-hidden="true" />}
      </button>
      <div id="main-navigation" className={`site-nav-links${menuOpen ? " menu-open" : ""}`}>
        {navigationLinks.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              className={`${active ? "active " : ""}${href === "/cart" ? "cart-link" : ""}`}
              href={href}
              key={href}
              onClick={closeMenu}
            >
              <Icon aria-hidden="true" />
              <span>{label}</span>
            </Link>
          );
        })}
        {loggedIn ? (
            <button type="button" className="site-nav-signout" onClick={handleSignOut}>
            <FaSignOutAlt aria-hidden="true" />
          </button>
        ) : (
          <div className="site-nav-auth">
            <Link className="site-nav-signin" href="/login" onClick={closeMenu}>Entrar</Link>
            <Link className="site-nav-signup" href="/register" onClick={closeMenu}>Cadastrar</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
