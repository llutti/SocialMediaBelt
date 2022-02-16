import type { AppProps } from 'next/app'
import { useRouter } from 'next/router';

import { SessionProvider } from "next-auth/react"

import { LayoutApp, LayoutPublic, LayoutTenant } from '@components/Layout'

import '../styles/globals.css'

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps)
{
  const router = useRouter();
  const { pathname } = router;

  let Layout = LayoutPublic;

  if (pathname.startsWith('/app') === true)
  {
    Layout = LayoutApp;
  }
  else
    if (pathname.startsWith('/[slug]') === true)
    {
      Layout = LayoutTenant;
    }

  return (
    <SessionProvider session={session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  )
}

export default MyApp
