import { QueryConfig } from "@/config/react-query-config";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import "../styles/main.css";

import { appWithTranslation, useTranslation } from 'next-i18next'

function MyApp({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient(QueryConfig);

  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}

export default appWithTranslation(MyApp);
