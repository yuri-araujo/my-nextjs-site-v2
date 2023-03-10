import Navbar from '@/components/Navbar'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from "next/head";
import React from 'react'
import Contato from './contato'
import Inicio from './inicio'
import Projetos from './projetos'
import Sobre from './sobre'
import Stack from './stack'

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "start", "about", "projects", "stack", "contact"])),
      // Will be passed to the page component as props
    },
  };
}

function index() {
  return (
    <main className="flex flex-col w-full h-full bg-slate-200 dark:bg-slate-900 overflow-hidden selection:text-white selection:bg-sky-900">
        <Head>
          <title>Yuri - Frontend developer</title>
          <link rel="shortcut icon" href="/favicon.ico" />
        </Head>
        <Navbar />
        <div className="fixed h-full w-[1px] bg-sky-900 left-12 top-12" />
        <div className="ml-24">
          <Inicio />
          <Sobre />
          <Projetos />
          <Stack />
          <Contato />
        </div>
      </main>
  )
}

export default index
