import { SiSpringboot, SiNextdotjs, SiElectron, SiAngular, SiDotnet } from "react-icons/si";

function Frameworks() {
  return (
    <>
      <div className="absolute dark:text-white text-[2rem] flex gap-4 flex-col w-[400px] h-[400px] animate-rotate-reverse group-hover:pause-reverse border rounded-full group hover:border-teal-600 dark:hover:border-teal-400 hover:pause peer/frameworks border-slate-900 dark:border-white">
        <div className="flex justify-center items-start h-full">
          <span className="transition-all hover:text-green-500 relative  animate-rotate group-hover:pause">
            <SiSpringboot className="peer hover:scale-125" />
            <span className="absolute left-10 top-0 w-0 whitespace-nowrap peer-hover:w-48 transition-all duration-500 text-2xl font-bold overflow-hidden peer-hover:animate-slideright">
              Spring Boot
            </span>
          </span>
        </div>
        <div className="flex justify-between items-center h-full w-[95%] place-self-center">
          <span className="transition-all hover:text-gray-400 relative -top-10 animate-rotate group-hover:pause">
            <SiNextdotjs className="peer hover:scale-125" />
            <span className="absolute left-10 top-0 w-0 peer-hover:w-20 transition-all duration-500 text-2xl font-bold overflow-hidden peer-hover:animate-slideright">
              Next
            </span>
          </span>
          <span className="transition-all hover:text-sky-400 relative -top-10 animate-rotate group-hover:pause">
            <SiElectron className="peer hover:scale-125" />
            <span className="absolute left-10 top-0 w-0 peer-hover:w-32 transition-all duration-500 text-2xl font-bold overflow-hidden peer-hover:animate-slideright">
              Electron
            </span>
          </span>
        </div>
        <div className="flex justify-between items-center h-full w-[60%] place-self-center">
          <span className="transition-all hover:text-red-500 relative  animate-rotate group-hover:pause">
            <SiAngular className="peer hover:scale-125" />
            <span className="absolute left-10 top-0 w-0 peer-hover:w-32 transition-all duration-500 text-2xl font-bold overflow-hidden peer-hover:animate-slideright">
              Angular
            </span>
          </span>
          <span className="transition-all hover:text-violet-400 relative animate-rotate group-hover:pause">
            <SiDotnet className="peer hover:scale-125" />
            <span className="absolute left-10 top-0 w-0 whitespace-nowrap peer-hover:w-48 transition-all duration-500 text-2xl font-bold overflow-hidden peer-hover:animate-slideright">
              .Net Core
            </span>
          </span>
        </div>
      </div>
      <span className="text-white text-3xl font-bold tracking-[1rem] absolute top-[50px] opacity-0 peer-hover/frameworks:opacity-100">Frameworks</span>
    </>
  );
}

export default Frameworks
