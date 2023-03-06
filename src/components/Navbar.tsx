import React from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import Link from "next/link";
import LogoButton from "./LogoButton";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeSwitcher from "./ThemeSwitcher";

function Navbar() {
  return (
    <nav className="flex bg-slate-300 justify-between items-center dark:bg-slate-800 p-2 dark:text-white text-slate-900 w-full h-12 border-b border-b-1 border-sky-900 fixed z-20">
      <div className="flex gap-8 text-xl items-center justify-center">
        <Link href="/">
          <LogoButton />
        </Link>
        <ThemeSwitcher />
        {/* <LanguageSwitcher /> */}
        {/* <a href="https://github.com/yuri-araujo" target="_blank" rel="noreferrer">
          <FaGithub className="hover:scale-110 hover:text-sky-900 dark:hover:text-sky-400" />
        </a>
        <a
          href="https://www.linkedin.com/in/yuri-araujo-232906256/"
          target="_blank"
          rel="noreferrer"
        >
          <FaLinkedin className="hover:scale-110 hover:text-sky-900 dark:hover:text-sky-400" />
        </a> */}
      </div>
      <div className="flex gap-8 text-xl items-center justify-center">
        <Link href="#inicio" className="group">
          <span className="text-lg hover:text-sky-400">{"< Início /> "}</span>
        </Link>
        <Link href="#sobre" className="group">
          <span className="text-lg hover:text-sky-400">{"< Sobre /> "}</span>
        </Link>
        <Link href="#projetos" className="group">
          <span className="text-lg hover:text-sky-400">{"< Projetos /> "}</span>
        </Link>
        <Link href="#stack" className="group">
          <span className="text-lg hover:text-sky-400">{"< Stack /> "}</span>
        </Link>
        <Link href="#contato" className="group">
          <span className="text-lg hover:text-sky-400">{"< Contato /> "}</span>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
