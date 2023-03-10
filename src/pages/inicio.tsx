import { useThemeStore } from "@/state/theme-store";

import DragonCurveSvg from "@/components/DragonCurveSvg";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["start"])),
      // Will be passed to the page component as props
    },
  };
}

function Start() {
  const { isDark } = useThemeStore();

  const { t: translate } = useTranslation("start");

  return (
    <section
      id="inicio"
      className="relative flex flex-col items-start justify-center w-full h-screen bg-transparent text-[6.5rem] text-slate-900 dark:text-gray-200 gap-4 font-bold"
    >
      <DragonCurveSvg />
      <div className="flex flex-col z-10">
        <span className="tracking-[-0.25rem]">
          {translate("title")}
          <span className="">Yuri,</span>
        </span>
        <span
          className="bg-clip-text text-transparent bg-gradient-to-r from-sky-900 to-indigo-900 italic
        dark:bg-clip-text dark:text-transparent dark:bg-gradient-to-r dark:from-sky-500 dark:to-indigo-600"
        >
          {translate("role")}
        </span>
      </div>
      <span className="text-sm text-gray-500 ">
        {translate("subtitle") + new Date().getFullYear()}
      </span>
      <span className="whitespace-nowrap opacity-[0.04] dark:opacity-[0.012] text-[300px] absolute font-bold inset-0 pointer-events-none">
        {translate("page-indicator")}
      </span>
    </section>
  );
}

export default Start;
