import Head from 'next/head';
import AuthLayout from '../components/layouts/AuthLayout'
import { AuthContextProvider } from '../hooks/useAuth'
import { Toaster } from 'react-hot-toast'
import '../styles/globals.css'
import '../styles/animations.css'
import 'react-loading-skeleton/dist/skeleton.css'

import React, { useEffect, useRef } from 'react'
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from "react-query/devtools";
import { AuthLayoutProvider } from '../hooks/useAuthLayout';
import { NotificationContextProvider } from '../hooks/useNotifications';
import accountService from "../services/account";
import { AccountProvider } from '../hooks/useAccount';
import { LibraryContextProvider } from '../hooks/useLibraries';
import NextNProgress from 'nextjs-progressbar';


function MyApp({ Component, pageProps }) {

  // const [queryClient] = React.useState(() => new QueryClient())

  const queryClient = useRef(new QueryClient())
  // layout
  const Layout = Component.getLayout || AuthLayout;

  const resourceExpirCheck = async () => {
    try {
      await accountService.checkResourceExpiryService()
    } catch (e) {
      // console.log(e.response || e);
    }
  }

  useEffect(() => {
    resourceExpirCheck();
  }, [])

  return (
    <>
      <QueryClientProvider client={queryClient.current} >
        <Hydrate state={pageProps.dehydratedState} >
          <AuthContextProvider>
            <AuthLayoutProvider>
              <AccountProvider>
                <LibraryContextProvider>
                  <NotificationContextProvider>


                    <Head>
                      <link rel="icon" type="image/png" href="/assets/logo.png" />
                      <title>Prakria Direct</title>
                    </Head>
                    <Layout>
                      <NextNProgress
                        color="#29d"
                        startPosition={0.3}
                        stopDelayMs={200}
                        height={4}
                        showOnShallow={true}
                        options={{showSpinner:false}}
                      />
                      <Toaster
                        position="top-right"
                        reverseOrder={false}
                      />
                      <Component {...pageProps} />
                    </Layout>

                  </NotificationContextProvider>
                </LibraryContextProvider>
              </AccountProvider>
            </AuthLayoutProvider>
          </AuthContextProvider>
        </Hydrate>
        <ReactQueryDevtools initialIsOpen={false} position={'bottom-right'} />
      </QueryClientProvider>
    </>

  )
}

export default MyApp
