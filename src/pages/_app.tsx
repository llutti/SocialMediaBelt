import type { AppProps } from 'next/app'
import { useRouter } from 'next/router';

import { LayoutApp, LayoutPublic, LayoutTenant } from '@components/Layout'

import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps)
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
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp
