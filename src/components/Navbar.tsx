import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeSwitcher from "./ThemeSwitcher";

import MySimpleLogo from "./MySimpleLogo";
import { useRouter } from "next/router";

function Navbar() {

  const router = useRouter();

  return (
    <nav className="flex bg-slate-300 justify-between items-center dark:bg-slate-800 dark:text-white text-slate-900 w-full h-12 border-b border-b-1 pt-[1px] border-sky-900 fixed z-20 pr-4">
      <div className="flex gap-[1rem] text-xl items-center justify-center">
        <Link href="#inicio">
          <MySimpleLogo />
        </Link>
        <ThemeSwitcher />
        <LanguageSwitcher />
      </div>
      <div className="flex gap-4 text-xl items-center justify-center tracking-wider">
        <Link href="#inicio" className="group">
          <span className="text-lg hover:text-sky-700 dark:hover:text-sky-400 hover:border-b dark:border-sky-400 border-sky-700 pb-1 px-2">Início</span>
        </Link>
        <Link href="#sobre" className="group">
          <span className="text-lg hover:text-sky-700 dark:hover:text-sky-400 hover:border-b dark:border-sky-400 border-sky-700 pb-1 px-2">Sobre</span>
        </Link>
        <Link href="#projetos" className="group">
          <span className="text-lg hover:text-sky-700 dark:hover:text-sky-400 hover:border-b dark:border-sky-400 border-sky-700 pb-1 px-2">Projetos</span>
        </Link>
        <Link href="#stack" className="group">
          <span className="text-lg hover:text-sky-700 dark:hover:text-sky-400 hover:border-b dark:border-sky-400 border-sky-700 pb-1 px-2">Stack</span>
        </Link>
        <Link href="#contato" className="group">
          <span className="text-lg hover:text-sky-700 dark:hover:text-sky-400 hover:border-b dark:border-sky-400 border-sky-700 pb-1 px-2">Contato</span>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
