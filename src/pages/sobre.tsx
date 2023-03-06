import React from "react";

function About() {
  return (
    <section
      id="sobre"
      className="relative flex flex-col items-start justify-center w-3/4 h-screen bg-transparent text-[3rem] text-slate-900 dark:text-gray-200 gap-4 font-bold"
    >
      <p className="first-letter:text-[6rem]">
        Meu nome é <span className="text-indigo-500">Yuri Araujo</span>
      </p>
      <p>
        <span className="text-indigo-500">Desenvolvedor Front-end</span> brasileiro de 21
        anos
      </p>
      <p>
        Eu gosto de <span className="text-indigo-500">desenvolver aplicações web</span>,
        principalmente com <span className="text-indigo-500">ReactJS</span>, porém também
        tenho interesses em <span className="text-indigo-500">outras tecnologias</span> e
        busco aprender cada vez mais expandir meu conhecimento e poder atuar como
        desenvolvedor full-stack.
      </p>
      <span className="whitespace-nowrap opacity-[0.15] dark:opacity-[0.012] text-[300px] absolute font-bold inset-0 pointer-events-none">
        Sobre
      </span>
    </section>
  );
}

export default About;
