import ProjectCard from "@/components/ProjectCard";
import { FaDiceD20 } from "react-icons/fa";
import LogoButton from "../components/LogoButton";
import TypeWriter from "../components/TypeWriter";

import mySiteLogo from "../assets/mysite.jpg";

function Projects() {
  return (
    <section
      id="projetos"
      className="relative flex flex-col items-start justify-center w-3/4 h-screen bg-transparent text-[3rem] text-slate-900 dark:text-gray-200 gap-4 font-bold"
    >
      <ProjectCard image={mySiteLogo} title="Meu site" description="Meu site pessoal" />
      <span className="whitespace-nowrap opacity-[0.15] dark:opacity-[0.012] text-[300px] absolute font-bold inset-0  pointer-events-none">
        Projetos
      </span>
    </section>
  );
}

export default Projects;
