import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { FaLinux, FaGitAlt, FaDocker } from "react-icons/fa";
import { SiVim, SiVisualstudiocode, SiTailwindcss } from "react-icons/si";

function Ferramentas() {
  const { t: translate } = useTranslation("stack");

  return (
    <>
      <div className="absolute dark:text-white text-[2rem] flex gap-4 flex-col w-[220px] h-[220px] animate-rotate border rounded-full group hover:border-sky-600 dark:hover:border-sky-400 hover:pause peer/ferramentas border-slate-900 dark:border-white">
        <div className="flex justify-between items-center h-full w-[60%] place-self-center">
          <span className="transition-all hover:text-yellow-400 relative  animate-rotate-reverse group-hover:pause">
            <FaLinux className="peer hover:scale-125" />
            <span className="absolute left-10 top-0 w-0 peer-hover:w-32 transition-all duration-500 text-2xl font-bold overflow-hidden peer-hover:animate-slideright">
              Linux
            </span>
          </span>
          <span className="transition-all hover:text-orange-400 relative  animate-rotate-reverse group-hover:pause">
            <FaGitAlt className="peer hover:scale-125" />
            <span className="absolute left-10 top-0 w-0 peer-hover:w-32 transition-all duration-500 text-2xl font-bold overflow-hidden peer-hover:animate-slideright">
              Git
            </span>
          </span>
        </div>
        <div className="flex justify-between items-center h-full w-[95%] place-self-center">
          <span className="transition-all hover:text-blue-400 relative  animate-rotate-reverse group-hover:pause">
            <FaDocker className="peer hover:scale-125" />
            <span className="absolute left-10 top-0 w-0 peer-hover:w-32 transition-all duration-500 text-2xl font-bold overflow-hidden peer-hover:animate-slideright">
              Docker
            </span>
          </span>
          <span className="transition-all hover:text-green-400 relative  animate-rotate-reverse group-hover:pause">
            <SiVim className="peer hover:scale-125" />
            <span className="absolute left-10 top-0 w-0 peer-hover:w-32 transition-all duration-500 text-2xl font-bold overflow-hidden peer-hover:animate-slideright">
              Vim
            </span>
          </span>
        </div>
        <div className="flex justify-between items-center h-full w-[60%] place-self-center">
          <span className="transition-all hover:text-blue-400 relative  animate-rotate-reverse group-hover:pause">
            <SiVisualstudiocode className="peer hover:scale-125" />
            <span className="absolute left-10 top-0 w-0 peer-hover:w-32 transition-all duration-500 text-2xl font-bold overflow-hidden peer-hover:animate-slideright">
              VsCode
            </span>
          </span>
          <span className="transition-all hover:text-sky-400 relative  animate-rotate-reverse group-hover:pause">
            <SiTailwindcss className="peer hover:scale-125" />
            <span className="absolute left-10 top-0 w-0 peer-hover:w-48 whitespace-nowrap transition-all duration-500 text-2xl font-bold overflow-hidden peer-hover:animate-slideright">
              Tailwind CSS
            </span>
          </span>
        </div>
      </div>
      <span className="text-3xl font-bold tracking-[1rem] absolute top-[50px] opacity-0 peer-hover/ferramentas:opacity-100 first-letter:uppercase">
        {translate("tools")}
      </span>
    </>
  );
}

export default Ferramentas;
