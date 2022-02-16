import type { NextPage } from 'next'
import Link from 'next/link'

import { signIn, signOut, useSession } from 'next-auth/react'

import Seo from '@components/Seo'


const Home: NextPage = () =>
{
  const { data: session } = useSession()

  return (
    <div className={''}>

      <Seo title='Social Media Belt' description='Social Media Belt' />

      <h1 className='font-bold text-4xl'>HOME</h1>

      <ul>
        <li><Link href='/app'><a>App</a></Link></li>
        <li><Link href='/llutti'><a>Tenant Llutti</a></Link></li>
        <li><button onClick={() => signIn()}>Sign in</button></li>
        <li>Signed in as {session?.user?.email} <br /></li>
        <li><button onClick={() => signOut()}>Sign out</button></li>
      </ul>
    </div>
  )
}

export default Home
