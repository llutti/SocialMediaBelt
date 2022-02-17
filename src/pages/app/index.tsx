import { useSession } from 'next-auth/react';
import Image from 'next/image'
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

// @ts-ignore
const fetcher = (...args: any[]) => fetch(...args).then(res => res.json())

const IndexApp = () =>
{
  const router = useRouter();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const { data, error } = useSWR('/api/tenants', fetcher);
  const { data: session } = useSession();

  useEffect(() =>
  {
    if (data?.length === 1)
    {
      setShouldRedirect(true);
    }
  }, [data])

  useEffect(() =>
  {
    if (shouldRedirect === true)
    {
      setTimeout(() =>
      {
        router.push(`/app/${data[0].id}`);
      }, 3000);
      setShouldRedirect(false);
    }
  }, [shouldRedirect, data, router])

  return (
    <div className='max-w-lg mx-auto text-center my-6'>
      {session?.user?.image &&
        <div className='relative rounded-full h-16 w-16 inline-block'>
          <Image
            src={session?.user?.image}
            alt={session?.user?.name ?? 'Avatar'}
            layout='fill'
          />
        </div>
      }
      <h1>{session?.user?.name}</h1>
      <div className="mt-6">
        {
          data &&
          data.length > 1 &&
          data
            .map(
              (tenant: any) =>
              {
                return (
                  <Link key={tenant.id} href={`/app/${tenant.id}`}>
                    <a className='inline-block w-full text-center border text-base font-medium rounded-md text-black bg-white hover:bg-gray-100 px-4 py-2'>{tenant.name}</a>
                  </Link>
                );
              }
            )
        }
      </div>
      {
        (data?.length === 1) &&
        <div>
          <button type="button" className="py-2 px-4 flex justify-center items-center  bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
            <svg width="20" height="20" fill="currentColor" className="mr-2 animate-spin" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
              <path d="M526 1394q0 53-37.5 90.5t-90.5 37.5q-52 0-90-38t-38-90q0-53 37.5-90.5t90.5-37.5 90.5 37.5 37.5 90.5zm498 206q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-704-704q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm1202 498q0 52-38 90t-90 38q-53 0-90.5-37.5t-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-964-996q0 66-47 113t-113 47-113-47-47-113 47-113 113-47 113 47 47 113zm1170 498q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-640-704q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm530 206q0 93-66 158.5t-158 65.5q-93 0-158.5-65.5t-65.5-158.5q0-92 65.5-158t158.5-66q92 0 158 66t66 158z">
              </path>
            </svg>
            loading
          </button>

        </div>
      }
    </div>
  )
}

export default IndexApp;
