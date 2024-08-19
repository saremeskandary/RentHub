"use client";

import { FC, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeftRight, House, MessageCircle, User } from "lucide-react";
import { useMediaQuery } from "react-responsive";
import { Bars3Icon, BugAntIcon, DocumentIcon } from "@heroicons/react/24/outline";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useOutsideClick } from "~~/hooks/scaffold-eth";

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export const menuLinks: HeaderMenuLink[] = [
  {
    label: "Home",
    href: "/",
    icon: <House size={20} />,
  },
  {
    label: "Listings",
    href: "/listings",
    icon: <ArrowLeftRight size={20} />,
  },
  {
    label: "SocialFI",
    href: "/socialfi",
    icon: <MessageCircle size={20} />,
  },
  {
    label: "Profile",
    href: "/profile",
    icon: <User size={20} />,
  },
];

export const Header: FC = () => {
  const [menu, setMenu] = useState<boolean>(false);
  const isTablet = useMediaQuery({ maxWidth: 992.98 });
  const pathname = usePathname();

  useEffect(() => {
    if (menu) document.body.classList.add("lock");
    else document.body.classList.remove("lock");
  }, [menu]);

  return (
    <header className="fixed z-[999] w-full bg-white shadow-md">
      <div className="px-3">
        <div className="flex h-[70px] items-center gap-10">
          {!isTablet && (
            <Link href="/" className="flex gap-5">
              <Image alt="SE2 logo" src="/logo.svg" width={40} height={40} />

              <div className="flex flex-col">
                <span className="font-bold leading-tight">Scaffold-ETH</span>
                <span className="text-xs">Ethereum dev stack</span>
              </div>
            </Link>
          )}

          <div className="flex-1">
            <div onClick={() => setMenu(!menu)} className={`icon-menu ${menu ? "active" : ""}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>

            <nav className={`menu__body ${menu ? "active" : ""}`}>
              <ul className="flex items-center gap-5 md2:flex-col">
                {menuLinks.map(({ label, href, icon }) => (
                  <li key={href}>
                    <Link
                      onClick={() => setMenu(false)}
                      href={href}
                      passHref
                      className={`${
                        pathname === href ? "bg-secondary shadow-md" : ""
                      } flex gap-2 rounded-full px-3 py-2 text-sm transition hover:bg-secondary hover:shadow-md`}
                    >
                      {icon}
                      <span>{label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="relative z-[600] flex">
            <RainbowKitCustomConnectButton />
            <FaucetButton />
          </div>
        </div>
      </div>
    </header>
  );
};
