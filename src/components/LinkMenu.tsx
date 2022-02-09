import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

interface Props
{
  href: string;
  children: React.ReactNode;
}

const LinkMenu = ({ href, children }: Props) =>
{
  const router = useRouter();
  const { pathname } = router;
  const selected = (pathname === href);

  return (
    <Link href={href}>
      <a className={
        selected ?
          'w-full text-gray-800 dark:text-white flex items-center pl-6 p-2 my-2 transition-colors duration-200 justify-start border-l-4 border-purple-500' :
          'w-full text-gray-400 flex items-center pl-6 p-2 my-2 transition-colors duration-200 justify-start hover:text-gray-800 border-l-4 border-transparent'
      }>
        {children}
      </a>
    </Link>
  )
}

export default LinkMenu;