import DivGenerator from "@/components/DivGenerator";
import Ferramentas from "../components/StackCircles/Ferramentas";
import Frameworks from "../components/StackCircles/Frameworks";
import Linguagens from "../components/StackCircles/Linguagens";

function Stack() {
  return (
    <section
      id="stack"
      className="relative flex items-center justify-between w-4/5 h-screen bg-transparent text-[1rem] text-slate-900 dark:text-gray-200 gap-20 font-bold"
    >
      <DivGenerator
        amountOfDivs={26}
        className="absolute left-[-5rem] flex flex-col text-[1.2rem] text-gray-400"
        useNumbersAsContent
      />
      <div className="text-[1.2rem]">
        <div className="text-sky-300">&#123;</div>
        <div className="">
          <span className="tracking-[0.5rem] opacity-20">..</span>linguagens:{" "}
          <span className="text-purple-500">&#91;</span>
        </div>
        <div className="text-yellow-200">
          <span className="tracking-[0.5rem] opacity-20">....</span>&ldquo;html&ldquo;
          <span className="text-white">,</span>
        </div>
        <div className="text-yellow-200">
          <span className="tracking-[0.5rem] opacity-20">....</span>&ldquo;css&ldquo;
          <span className="text-white">,</span>
        </div>
        <div className="text-yellow-200">
          <span className="tracking-[0.5rem] opacity-20">....</span>
          &ldquo;javascript&ldquo;<span className="text-white">,</span>
        </div>
        <div className="text-yellow-200">
          <span className="tracking-[0.5rem] opacity-20">....</span>
          &ldquo;typescript&ldquo;<span className="text-white">,</span>
        </div>
        <div className="text-yellow-200">
          <span className="tracking-[0.5rem] opacity-20">....</span>&ldquo;react&ldquo;
          <span className="text-white">,</span>
        </div>
        <div className="text-yellow-200">
          <span className="tracking-[0.5rem] opacity-20">....</span>&ldquo;mysql&ldquo;
          <span className="text-white">,</span>
        </div>
        <div className="text-yellow-200">
          <span className="tracking-[0.5rem] opacity-20">....</span>&ldquo;java&ldquo;
        </div>
        <div className="">
          <span className="tracking-[0.5rem] opacity-20">..</span>
          <span className="text-purple-500">&#93;</span>,
        </div>
        <div className="">
          <span className="tracking-[0.5rem] opacity-20">..</span>frameworks:{" "}
          <span className="text-purple-500">&#91;</span>
        </div>
        <div className="text-yellow-200 ">
          <span className="tracking-[0.5rem] opacity-20">....</span>&ldquo;nextjs&ldquo;
          <span className="text-white">,</span>
        </div>
        <div className="text-yellow-200 ">
          <span className="tracking-[0.5rem] opacity-20">....</span>&ldquo;angular&ldquo;
          <span className="text-white">,</span>
        </div>
        <div className="text-yellow-200 ">
          <span className="tracking-[0.5rem] opacity-20">....</span>&ldquo;spring&ldquo;
          <span className="text-white">,</span>
        </div>
        <div className="text-yellow-200 ">
          <span className="tracking-[0.5rem] opacity-20">....</span>&ldquo;electron&ldquo;
          <span className="text-white">,</span>
        </div>
        <div className="text-yellow-200 ">
          <span className="tracking-[0.5rem] opacity-20">....</span>&ldquo;dotnet&ldquo;
        </div>
        <div className="">
          <span className="tracking-[0.5rem] opacity-20">..</span>
          <span className="text-purple-500">&#93;</span>,
        </div>
        <div className="">
          <span className="tracking-[0.5rem] opacity-20">..</span>ferramentas:{" "}
          <span className="text-purple-500">&#91;</span>
        </div>
        <div className="text-yellow-200 ">
          <span className="tracking-[0.5rem] opacity-20">....</span>
          &ldquo;tailwindcss&ldquo;<span className="text-white">,</span>
        </div>
        <div className="text-yellow-200 ">
          <span className="tracking-[0.5rem] opacity-20">....</span>&ldquo;docker&ldquo;
          <span className="text-white">,</span>
        </div>
        <div className="text-yellow-200 ">
          <span className="tracking-[0.5rem] opacity-20">....</span>&ldquo;vscode&ldquo;
          <span className="text-white">,</span>
        </div>
        <div className="text-yellow-200 ">
          <span className="tracking-[0.5rem] opacity-20">....</span>&ldquo;vim&ldquo;
          <span className="text-white">,</span>
        </div>
        <div className="text-yellow-200 ">
          <span className="tracking-[0.5rem] opacity-20">....</span>&ldquo;linux&ldquo;
          <span className="text-white">,</span>
        </div>
        <div className="text-yellow-200 ">
          <span className="tracking-[0.5rem] opacity-20">....</span>&ldquo;git&ldquo;
        </div>
        <div>
          <span className="tracking-[0.5rem] opacity-20">..</span>
          <span className="text-purple-500">&#93;</span>
        </div>
        <div className="text-sky-300">&#125;</div>
      </div>
      <div className="flex flex-col items-center justify-center">
        <Linguagens />
        <Frameworks />
        <Ferramentas />
      </div>
      <span className="whitespace-nowrap opacity-[0.15] dark:opacity-[0.012] text-[300px] absolute font-bold inset-0  pointer-events-none">
        Stack
      </span>
    </section>
  );
}

export default Stack;
