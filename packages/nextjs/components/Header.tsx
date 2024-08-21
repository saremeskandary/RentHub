"use client";

import { FC, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeftRight, House, Key, MessageCircle, User } from "lucide-react";
import { useMediaQuery } from "react-responsive";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export const menuLinks: HeaderMenuLink[] = [
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
    label: "MyRentals",
    href: "/myrentals",
    icon: <Key size={20} />,
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
        <div className="flex h-[70px] items-center gap-10 md2:gap-2">
          <Link href="/" className="relative z-[600] flex items-center gap-5 md2:flex-1">
            <Image alt="SE2 logo" src="/image.png" width={40} height={40} />
            <span className="font-bold leading-tight md4:hidden">RentHub</span>
          </Link>

          <div className="flex-1 md2:order-3 md2:flex-[0_1_30px]">
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
                        pathname === href ? "bg-[#DAE8FF] shadow-md" : ""
                      } flex gap-2 rounded-full px-3 py-2 text-sm transition hover:bg-[#DAE8FF] hover:shadow-md`}
                    >
                      {icon}
                      <span>{label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="relative z-[600] flex items-center">
            <RainbowKitCustomConnectButton />
            <FaucetButton />
          </div>
        </div>
      </div>
    </header>
  );
};
