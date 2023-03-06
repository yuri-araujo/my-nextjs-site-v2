import { FaHtml5, FaCss3, FaReact } from "react-icons/fa";
import { SiJavascript, SiTypescript, SiJava, SiMysql, SiElixir } from "react-icons/si";

function Linguagens() {
  return (
    <>
      <div className="dark:text-white text-[2rem] flex gap-4 flex-col w-[650px] h-[650px] animate-rotate border rounded-full group hover:border-teal-600 dark:hover:border-teal-400 hover:pause peer/linguagens border-slate-900 dark:border-white">
        <div className="flex justify-center h-full relative top-2">
          <span className="transition-all hover:text-orange-400 place-self-start animate-rotate-reverse group-hover:pause flex">
            <FaHtml5 className="hover:scale-125 peer" />
            <span className="absolute left-10 w-0 peer-hover:w-20 transition-all duration-500 text-2xl font-bold overflow-hidden peer-hover:animate-slideright">
              HTML
            </span>
          </span>
        </div>
        <div className="flex justify-around items-center h-full">
          <span className="transition-all hover:text-sky-400 relative -top-14 -left-14 animate-rotate-reverse group-hover:pause">
            <FaCss3 className="peer hover:scale-125" />
            <span className="absolute left-10 top-0 w-0 peer-hover:w-20 transition-all duration-500 text-2xl font-bold overflow-hidden peer-hover:animate-slideright">
              CSS
            </span>
          </span>
          <span className="transition-all hover:text-yellow-400 relative -top-14 -right-14 animate-rotate-reverse group-hover:pause">
            <SiJavascript className="peer hover:scale-125" />
            <span className="absolute left-10 top-0 w-0 peer-hover:w-32 transition-all duration-500 text-2xl font-bold overflow-hidden peer-hover:animate-slideright">
              Javascript
            </span>
          </span>
        </div>
        <div className="flex justify-between items-center h-full w-[95%] place-self-center">
          <span className="transition-all relative hover:text-blue-400 animate-rotate-reverse group-hover:pause">
            <SiTypescript className="peer hover:scale-125" />
            <span className="absolute left-10 top-0 w-0 peer-hover:w-32 transition-all duration-500 text-2xl font-bold overflow-hidden peer-hover:animate-slideright">
              Typescript
            </span>
          </span>
          <span className="transition-all hover:text-sky-400 animate-rotate-reverse group-hover:pause">
            <FaReact className="peer hover:scale-125" />
            <span className="absolute left-10 top-0 w-0 peer-hover:w-20 transition-all duration-500 text-2xl font-bold overflow-hidden peer-hover:animate-slideright">
              React
            </span>
          </span>
        </div>
        <div className="flex justify-around items-center h-full">
          <span className="transition-all hover:text-red-500 relative -bottom-14 -left-14 animate-rotate-reverse group-hover:pause">
            <SiJava className="peer hover:scale-125" />
            <span className="absolute left-10 top-0 w-0 peer-hover:w-20 transition-all duration-500 text-2xl font-bold overflow-hidden peer-hover:animate-slideright">
              Java
            </span>
          </span>
          <span className="transition-all hover:text-blue-400 relative -bottom-14 -right-14 animate-rotate-reverse group-hover:pause ">
            <SiMysql className="peer hover:scale-125" />
            <span className="absolute left-10 top-0 w-0 peer-hover:w-20 transition-all duration-500 text-2xl font-bold overflow-hidden peer-hover:animate-slideright">
              MySQL
            </span>
          </span>
        </div>
        <div className="flex justify-center h-full relative bottom-2">
          <span className="transition-all hover:text-violet-500 place-self-end animate-rotate-reverse group-hover:pause">
            <SiElixir className="peer hover:scale-125" />
            <span className="absolute left-10 top-0 w-0 peer-hover:w-20 transition-all duration-500 text-2xl font-bold overflow-hidden peer-hover:animate-slideright">
              Elixir
            </span>
          </span>
        </div>
      </div>
      <span className="text-white text-3xl font-bold tracking-[1rem] absolute top-[50px] opacity-0 peer-hover/linguagens:opacity-100">Linguagens</span>
    </>
  );
}

export default Linguagens
