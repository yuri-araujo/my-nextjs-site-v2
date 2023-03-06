import { FaCss3, FaHtml5, FaReact } from "react-icons/fa";
import { IoLogoJavascript } from "react-icons/io";

import Image from "next/image";

import EssencialLogo from "../assets/essencial.png";

function Start() {
  return (
    <section
      id="inicio"
      className="relative flex flex-col items-start justify-center w-full h-screen bg-transparent text-[6.5rem] text-slate-900 dark:text-gray-200 gap-4 font-bold"
    >
      <div className="flex flex-col">
        <span className="tracking-[-0.25rem]">
          Olá, Eu sou <span className="">Yuri,</span>
        </span>
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-indigo-500 italic">{"<Desenvolvedor web />"}</span>
      </div>
      <span className="text-sm text-gray-500 ">Desenvolvedor Front-end júnior ~ {new Date().getFullYear()}</span>
      <span className="whitespace-nowrap opacity-[0.15] dark:opacity-[0.012] text-[300px] absolute font-bold inset-0 pointer-events-none">
        Início
      </span>
    </section>
  );
}

export default Start;
