import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";
import { useTranslation } from "next-i18next";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["about"])),
      // Will be passed to the page component as props
    },
  };
}

function About() {
  const { t: translate } = useTranslation("about");

  return (
    <section
      id="sobre"
      className="relative flex flex-col items-start justify-center w-3/4 h-screen bg-transparent text-[3rem] text-slate-900 dark:text-gray-200 font-bold md:text-[1.5rem] lg:text-[1.75rem] xl:text-[2.5rem] sm:items-center xl:w-full 2xl:w-[90%] pr-[10px]"
    >
      <span className="first-letter:text-[6rem] whitespace-nowrap h-[8rem]">
        {translate("first-paragraph")}
        <span className="text-sky-700 dark:text-sky-500">Yuri Araujo</span>
      </span>
      <span className="whitespace-nowrap xl:tracking-tight text-center sm:hidden">
        <span className="text-sky-700 dark:text-sky-500">
          {translate("second-paragraph.first-line")}
        </span>{" "}
        {translate("second-paragraph.second-line")}
      </span>
      <span className="sm:text-center">
        {translate("third-paragraph.first-line")}
        <span className="text-sky-700 dark:text-sky-500">
          {translate("third-paragraph.second-line")}
        </span>
        {translate("third-paragraph.third-line")}
        <span className="text-sky-700 dark:text-sky-500">ReactJS</span>
        {translate("third-paragraph.fourth-line")}
        <span className="text-sky-700 dark:text-sky-500">
          {translate("third-paragraph.fifth-line")}
        </span>{" "}
        {translate("third-paragraph.sixth-line")}
      </span>
      <span className="whitespace-nowrap opacity-[0.04] dark:opacity-[0.012] text-[300px] absolute font-bold inset-0 pointer-events-none lg:text-[200px]">
        {translate("page-indicator")}
      </span>
    </section>
  );
}

export default About;
