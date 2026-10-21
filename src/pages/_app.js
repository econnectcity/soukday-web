import { useEffect, useState } from "react";
import "@/styles/globals.css";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import "react-toastify/dist/ReactToastify.css";
import Loader from "@/components/loader/Loader";
import { useRouter } from "next/router";
import { ThemeProvider } from "next-themes";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Nunito } from 'next/font/google';
import { SoukdayCartProvider } from "@/context/SoukdayCartContext";

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['200','300','400','500','600','700','800','900'],
  variable: '--font-family',
  display: 'swap',
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  return (
    <>
      {loading && <Loader screen="full" />}
      <Component {...pageProps} />
    </>
  );
}

export default function App({ Component, pageProps }) {
  return (
    <main className={`${nunito.variable} `}>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <Provider store={store}>
            <SoukdayCartProvider>
              <ThemeProvider attribute="class" defaultTheme="light">
                <AppContent Component={Component} pageProps={pageProps} />
              </ThemeProvider>
            </SoukdayCartProvider>
          </Provider>
        </QueryClientProvider>
      </ErrorBoundary>
    </main>
  );
}
