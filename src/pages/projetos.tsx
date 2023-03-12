import ProjectCard from "@/components/ProjectCard";
import mySiteLogo from "../assets/logocomcorcomborda.svg";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["projects"])),
      // Will be passed to the page component as props
    },
  };
}

function Projects() {
  const { t: translate } = useTranslation("projects");

  return (
    <section
      id="projetos"
      className="relative flex flex-col items-center justify-center w-full h-screen bg-transparent text-[3rem] text-slate-900 dark:text-gray-200 gap-4 font-bold"
    >
      <ProjectCard
        className="w-[300px] sm:w-[200px]"
        image={mySiteLogo}
        title={translate("first-project.title")}
        description={translate("first-project.description")}
      />
      <span className="whitespace-nowrap opacity-[0.04] dark:opacity-[0.012] text-[300px] absolute font-bold inset-0  pointer-events-none lg:text-[200px]">
        Projetos
      </span>
    </section>
  );
}

export default Projects;
