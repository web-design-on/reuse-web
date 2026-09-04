"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FaComments, FaHeart, FaHome, FaShoppingCart, FaThLarge, FaUser } from "react-icons/fa";

const links = [
  { href: "/", label: "Home", icon: FaHome },
  { href: "/categories", label: "Categorias", icon: FaThLarge },
  { href: "/favorites", label: "Favoritos", icon: FaHeart },
  { href: "/login", label: "Login/Perfil", icon: FaUser },
  { href: "/messages", label: "Chat", icon: FaComments },
  { href: "/cart", label: "Carrinho", icon: FaShoppingCart },
];

export default function Navbar({ isLoggedIn }: { isLoggedIn: boolean }) {
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState(isLoggedIn);

  useEffect(() => {
    const syncSession = () => setLoggedIn(Boolean(localStorage.getItem("@reuse_user")));
    const timer = window.setTimeout(syncSession, 0);
    window.addEventListener("reuse-session-changed", syncSession);
    window.addEventListener("storage", syncSession);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("reuse-session-changed", syncSession);
      window.removeEventListener("storage", syncSession);
    };
  }, []);

  const accountLink = { href: loggedIn ? "/profile" : "/login", label: loggedIn ? "Perfil" : "Login", icon: FaUser };
  const navigationLinks = [
    links[0],
    links[1],
    links[2],
    accountLink,
    links[4],
    links[5],
  ];

  return (
    <nav className="site-navbar" aria-label="Navegação principal">
      <Link className="site-logo" href="/" aria-label="ReUse Home">
        <Image src="/brand/logo.png" alt="ReUse" width={106} height={42} priority />
      </Link>
      <div className="site-nav-links">
        {navigationLinks.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === href : pathname.startsWith(href);
          return (
            <Link className={active ? "active" : ""} href={href} key={href}>
              <Icon aria-hidden="true" />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}