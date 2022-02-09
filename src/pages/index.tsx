import type { NextPage } from 'next'

import Link from 'next/link'

import Seo from '@components/Seo'


const Home: NextPage = () =>
{
  return (
    <div className={''}>

      <Seo title='Social Media Belt' description='Social Media Belt' />

      <h1 className='font-bold text-4xl'>HOME</h1>

      <ul>
        <li><Link href='/app'><a>App</a></Link></li>
        <li><Link href='/llutti'><a>Tenant Llutti</a></Link></li>
      </ul>
    </div>
  )
}

export default Home
