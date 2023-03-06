import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import { QueryConfig } from "@/config/react-query-config";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { QueryClient, QueryClientProvider } from "react-query";
import "../styles/main.css";
import Contato from "./contato";
import Projetos from "./projetos";
import Inicio from "./inicio";
import Stack from "./stack";
import Sobre from "./sobre";

function MyApp({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient(QueryConfig);

  const router = useRouter();

  return (
    <QueryClientProvider client={queryClient}>
      <main className="flex flex-col w-full h-full bg-slate-200 dark:bg-slate-900 overflow-hidden selection:text-white selection:bg-teal-900 scroll-smooth">
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
    </QueryClientProvider>
  );
}

export default MyApp;
