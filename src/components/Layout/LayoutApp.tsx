import React from 'react';
import Image from 'next/image'
import Link from 'next/link';

import LinkMenu from '@components/LinkMenu';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useHttpGet } from 'src/hooks/api';

interface Props
{
  children: React.ReactNode
}

const LayoutApp = ({ children }: Props) =>
{
  const router = useRouter();
  const { data: session } = useSession();
  const tenantId = router?.query?.tenantid as string;
  const { data: tenant } = useHttpGet(tenantId ? `/api/tenants/${tenantId}` : null);
  console.log(tenantId);

  return (
    <>
      <main className='bg-gray-100 dark:bg-gray-800 h-screen overflow-hidden relative'>
        <div className='flex items-start justify-between'>
          <div className='h-screen hidden lg:block shadow-lg relative w-80'>
            <div className='bg-white h-full dark:bg-gray-700'>
              <div className='flex items-center justify-start pt-6 ml-8'>
                <p className='font-bold dark:text-white text-xl'>
                  Social Media Belt
                </p>
              </div>
              <nav className='mt-6'>
                {
                  !tenantId &&
                  (
                    <div>
                      <LinkMenu href={`/app`}>
                        <span className='text-left'>
                          <svg width={20} height={20} fill='currentColor' viewBox='0 0 1792 1792' xmlns='http://www.w3.org/2000/svg'>
                            <path d='M1472 992v480q0 26-19 45t-45 19h-384v-384h-256v384h-384q-26 0-45-19t-19-45v-480q0-1 .5-3t.5-3l575-474 575 474q1 2 1 6zm223-69l-62 74q-8 9-21 11h-3q-13 0-21-7l-692-577-692 577q-12 8-24 7-13-2-21-11l-62-74q-8-10-7-23.5t11-21.5l719-599q32-26 76-26t76 26l244 204v-195q0-14 9-23t23-9h192q14 0 23 9t9 23v408l219 182q10 8 11 21.5t-7 23.5z'>
                            </path>
                          </svg>
                        </span>
                        <span className='mx-2 text-sm font-normal'>
                          Voltar
                        </span>
                      </LinkMenu>
                    </div>
                  )
                }

                {
                  tenantId &&
                  (
                    <div>
                      <LinkMenu href={`/app/${tenantId}`}>
                        <span className='text-left'>
                          <svg width={20} height={20} fill='currentColor' viewBox='0 0 1792 1792' xmlns='http://www.w3.org/2000/svg'>
                            <path d='M1472 992v480q0 26-19 45t-45 19h-384v-384h-256v384h-384q-26 0-45-19t-19-45v-480q0-1 .5-3t.5-3l575-474 575 474q1 2 1 6zm223-69l-62 74q-8 9-21 11h-3q-13 0-21-7l-692-577-692 577q-12 8-24 7-13-2-21-11l-62-74q-8-10-7-23.5t11-21.5l719-599q32-26 76-26t76 26l244 204v-195q0-14 9-23t23-9h192q14 0 23 9t9 23v408l219 182q10 8 11 21.5t-7 23.5z'>
                            </path>
                          </svg>
                        </span>
                        <span className='mx-2 text-sm font-normal'>
                          Home
                        </span>
                      </LinkMenu>
                      <LinkMenu href={`/app/${tenantId}`}>
                        <span className='text-left'>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                        </span>
                        <span className='mx-2 text-sm font-normal'>
                          Conta: {tenant?.name}
                          <span className='p-1 ml-4 rounded-lg w-4 h-2 bg-gray-200 text-gray-400 text-xs'>
                            {tenant?.plan}
                          </span>
                        </span>
                      </LinkMenu>
                      <LinkMenu href={`/app/${tenantId}/links`}>
                        <span className='text-left'>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                          </svg>
                        </span>
                        <span className='mx-2 text-sm font-normal'>
                          Links
                        </span>
                      </LinkMenu>
                      <LinkMenu href={`/app/${tenantId}/settings`}>
                        <span className='text-left'>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>

                        </span>
                        <span className='mx-2 text-sm font-normal'>
                          Configurações
                        </span>

                      </LinkMenu>
                    </div>
                  )
                }
              </nav>
            </div>
          </div>
          <div className='flex flex-col w-full md:space-y-4'>
            <header className='w-full h-16 z-40 flex items-center justify-between'>
              <div className='block lg:hidden ml-6'>
                <button className='flex p-2 items-center rounded-full bg-white shadow text-gray-500 text-md'>
                  <svg width={20} height={20} className='text-gray-400' fill='currentColor' viewBox='0 0 1792 1792' xmlns='http://www.w3.org/2000/svg'>
                    <path d='M1664 1344v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45zm0-512v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45zm0-512v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45z'>
                    </path>
                  </svg>
                </button>
              </div>
              <div className='relative z-20 flex flex-col justify-end h-full px-3 md:w-full'>
                <div className='relative p-1 flex items-center w-full space-x-4 justify-end'>
                  <Link href={'/app/tenants'} passHref={true}>
                    <button className='flex p-2 items-center rounded text-gray-400 hover:text-gray-700 bg-white shadow text-md'>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                      Gerenciar
                    </button>
                  </Link>
                  <Link href={'/app'} passHref={true}>
                    <button className='flex p-2 items-center rounded bg-white shadow text-gray-400 hover:text-gray-700 text-md'>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                      </svg>
                      Alterar Contas
                    </button>
                  </Link>
                  <span className='w-1 h-8 rounded-lg bg-gray-200'>
                  </span>
                  <span className='block relative mx-auto object-cover rounded-full h-10 w-10'>
                    {
                      session?.user.image &&
                      <Image
                        src={session.user.image}
                        alt={session.user.name ?? 'Avatar'}
                        layout='fill'
                      />
                    }
                  </span>
                  <button
                    className='flex items-center text-gray-500 dark:text-white text-md'
                    onClick={() => signOut({ callbackUrl: '/' })}
                  >
                    {session?.user.name}
                    <svg width={20} height={20} className='ml-2 text-gray-400' fill='currentColor' viewBox='0 0 1792 1792' xmlns='http://www.w3.org/2000/svg'>
                      <path d='M1408 704q0 26-19 45l-448 448q-19 19-45 19t-45-19l-448-448q-19-19-19-45t19-45 45-19h896q26 0 45 19t19 45z'>
                      </path>
                    </svg>
                  </button>
                </div>
              </div>
            </header>
            <div className='overflow-auto h-screen pb-24 px-4 md:px-6'>
              {children}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default LayoutApp;
