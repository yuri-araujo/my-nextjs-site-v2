import { QueryConfig } from "@/config/react-query-config";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import "../styles/main.css";
import 'react-toastify/dist/ReactToastify.css';

import { appWithTranslation } from "next-i18next";
import { ToastifyConfig } from "@/config/toastify-config";
import { ToastContainer } from "react-toastify";

function MyApp({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient(QueryConfig);

  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer {...ToastifyConfig} />
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}

export default appWithTranslation(MyApp);
