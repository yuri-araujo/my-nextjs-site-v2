import DivGenerator from "@/components/DivGenerator";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import Ferramentas from "../components/StackCircles/Ferramentas";
import Frameworks from "../components/StackCircles/Frameworks";
import Linguagens from "../components/StackCircles/Linguagens";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["stack"])),
      // Will be passed to the page component as props
    },
  };
}

function Stack() {
  const { t: translate } = useTranslation("stack");

  return (
    <section
      id="stack"
      className="relative flex items-center justify-between w-full h-screen bg-transparent text-[1rem] text-slate-900 dark:text-gray-200 gap-20 font-bold lg:justify-center lg:gap-0"
    >
      <div className="relative flex items-center justify-between lg:border border-sky-900 lg:p-20 rounded lg:bg-slate-800">
        <DivGenerator
          amountOfDivs={27}
          className="absolute left-[-5rem] flex flex-col text-[1.2rem] text-gray-400 lg:relative lg:inset-0 lg:left-[-4rem]"
          useNumbersAsContent
        />
        <div className="text-[1.2rem]">
          <div className="text-sky-600 dark:text-sky-300">&#123;</div>
          <div className="">
            <span className="tracking-[0.5rem] dark:opacity-20">..</span>
            {translate("languages")}:{" "}
            <span className="text-purple-600 dark:text-purple-500">&#91;</span>
          </div>
          <div className="text-yellow-600 dark:text-yellow-200">
            <span className="tracking-[0.5rem] dark:opacity-20">....</span>
            &ldquo;html&ldquo;
            <span className="dark:text-white">,</span>
          </div>
          <div className="text-yellow-600 dark:text-yellow-200">
            <span className="tracking-[0.5rem] dark:opacity-20">....</span>
            &ldquo;css&ldquo;
            <span className="dark:text-white">,</span>
          </div>
          <div className="text-yellow-600 dark:text-yellow-200">
            <span className="tracking-[0.5rem] dark:opacity-20">....</span>
            &ldquo;javascript&ldquo;<span className="dark:text-white">,</span>
          </div>
          <div className="text-yellow-600 dark:text-yellow-200">
            <span className="tracking-[0.5rem] dark:opacity-20">....</span>
            &ldquo;typescript&ldquo;<span className="dark:text-white">,</span>
          </div>
          <div className="text-yellow-600 dark:text-yellow-200">
            <span className="tracking-[0.5rem] dark:opacity-20">....</span>
            &ldquo;react&ldquo;
            <span className="dark:text-white">,</span>
          </div>
          <div className="text-yellow-600 dark:text-yellow-200">
            <span className="tracking-[0.5rem] dark:opacity-20">....</span>
            &ldquo;mysql&ldquo;
            <span className="dark:text-white">,</span>
          </div>
          <div className="text-yellow-600 dark:text-yellow-200">
            <span className="tracking-[0.5rem] dark:opacity-20">....</span>
            &ldquo;java&ldquo;
          </div>
          <div className="text-yellow-600 dark:text-yellow-200">
            <span className="tracking-[0.5rem] dark:opacity-20">....</span>
            &ldquo;ruby&ldquo;
          </div>
          <div className="">
            <span className="tracking-[0.5rem] dark:opacity-20">..</span>
            <span className="text-purple-600 dark:text-purple-500">&#93;</span>,
          </div>
          <div className="">
            <span className="tracking-[0.5rem] dark:opacity-20">..</span>frameworks:{" "}
            <span className="text-purple-600 dark:text-purple-500">&#91;</span>
          </div>
          <div className="text-yellow-600 dark:text-yellow-200 ">
            <span className="tracking-[0.5rem] dark:opacity-20">....</span>
            &ldquo;nextjs&ldquo;
            <span className="dark:text-white">,</span>
          </div>
          <div className="text-yellow-600 dark:text-yellow-200 ">
            <span className="tracking-[0.5rem] dark:opacity-20">....</span>
            &ldquo;angular&ldquo;
            <span className="dark:text-white">,</span>
          </div>
          <div className="text-yellow-600 dark:text-yellow-200 ">
            <span className="tracking-[0.5rem] dark:opacity-20">....</span>
            &ldquo;spring&ldquo;
            <span className="dark:text-white">,</span>
          </div>
          <div className="text-yellow-600 dark:text-yellow-200 ">
            <span className="tracking-[0.5rem] dark:opacity-20">....</span>
            &ldquo;electron&ldquo;
            <span className="dark:text-white">,</span>
          </div>
          <div className="text-yellow-600 dark:text-yellow-200 ">
            <span className="tracking-[0.5rem] dark:opacity-20">....</span>
            &ldquo;vitest&ldquo;
          </div>
          <div className="">
            <span className="tracking-[0.5rem] dark:opacity-20">..</span>
            <span className="text-purple-600 dark:text-purple-500">&#93;</span>,
          </div>
          <div className="">
            <span className="tracking-[0.5rem] dark:opacity-20">..</span>
            {translate("tools")}:{" "}
            <span className="text-purple-600 dark:text-purple-500">&#91;</span>
          </div>
          <div className="text-yellow-600 dark:text-yellow-200 ">
            <span className="tracking-[0.5rem] dark:opacity-20">....</span>
            &ldquo;tailwindcss&ldquo;<span className="dark:text-white">,</span>
          </div>
          <div className="text-yellow-600 dark:text-yellow-200 ">
            <span className="tracking-[0.5rem] dark:opacity-20">....</span>
            &ldquo;docker&ldquo;
            <span className="dark:text-white">,</span>
          </div>
          <div className="text-yellow-600 dark:text-yellow-200 ">
            <span className="tracking-[0.5rem] dark:opacity-20">....</span>
            &ldquo;vscode&ldquo;
            <span className="dark:text-white">,</span>
          </div>
          <div className="text-yellow-600 dark:text-yellow-200 ">
            <span className="tracking-[0.5rem] dark:opacity-20">....</span>
            &ldquo;vim&ldquo;
            <span className="dark:text-white">,</span>
          </div>
          <div className="text-yellow-600 dark:text-yellow-200 ">
            <span className="tracking-[0.5rem] dark:opacity-20">....</span>
            &ldquo;linux&ldquo;
            <span className="dark:text-white">,</span>
          </div>
          <div className="text-yellow-600 dark:text-yellow-200 ">
            <span className="tracking-[0.5rem] dark:opacity-20">....</span>
            &ldquo;git&ldquo;
          </div>
          <div>
            <span className="tracking-[0.5rem] dark:opacity-20">..</span>
            <span className="text-purple-600 dark:text-purple-500">&#93;</span>
          </div>
          <div className="text-sky-600 dark:text-sky-300">&#125;</div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center mr-48 lg:hidden">
        <Linguagens />
        <Frameworks />
        <Ferramentas />
      </div>
      <span className="whitespace-nowrap opacity-[0.04] dark:opacity-[0.012] text-[300px] absolute font-bold inset-0  pointer-events-none lg:text-[200px]">
        Stack
      </span>
    </section>
  );
}

export default Stack;
