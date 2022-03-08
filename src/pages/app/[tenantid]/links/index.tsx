import { useEffect } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';

import { Alert } from '@components/Alert';
import Heading1 from '@components/Heading1';
import Heading2 from '@components/Heading2';
import { useHttpGet } from '@hooks/api';
import { executeDelete } from '@lib/fetch';
import { LinkPaginationWapper } from '@services/links';

const Links = () =>
{
  const router = useRouter();
  const cursor = router?.query?.cursor ? `?cursor=${router?.query?.cursor}` : '';
  const tenantId = router?.query?.tenantid ?? null;
  const { data, mutate } = useHttpGet<LinkPaginationWapper>(tenantId && `/api/${tenantId}/links${cursor}`);

  const deleteLink = async (id: string) =>
  {
    await executeDelete({ url: `/api/${tenantId}/links/${id}` });
    await mutate();
  }

  useEffect(() =>
  {
    if (data && router)
    {
      if (router.query?.cursor)
      {
        if (data?.items?.length === 0)
        {
          router.push(`/app/${tenantId}/links`);
        }
      }
    }

  }, [tenantId, data, router])
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div>
          <Heading1>Gerenciador de Links</Heading1>
          <Heading2>Gerenciador de Links</Heading2>
        </div>
        <div className="flex items-center">
          <Link href={`/app/${tenantId}/links/create`} passHref={true}>
            <button
              type="button"
              className="w-full border-l border-t border-b text-base font-medium rounded-l-md text-black bg-white hover:bg-gray-100 px-4 py-2"
            >
              Criar Link
            </button>
          </Link>
          <button
            type="button"
            className="w-full border text-base font-medium text-black bg-white hover:bg-gray-100 px-4 py-2"
          >
            Criar Grupo
          </button>
        </div>
      </div>

      {
        (data && data?.items?.length === 0) ?
          (
            <Alert type='Info'>Nenhum link cadastrado.</Alert>
          )
          :
          (
            <div className="container mx-auto px-4 sm:px-8 max-w-3xl">
              <div className="py-8">
                <div className="flex flex-row mb-1 sm:mb-0 justify-between w-full">
                  <h2 className="text-2xl leading-tight"> Links
                  </h2>
                  <div className="text-end">
                    <form className="flex flex-col md:flex-row w-3/4 md:w-full max-w-sm md:space-x-3 space-y-3 md:space-y-0 justify-center">
                      <div className=" relative ">
                        <input type="text" id="&quot;form-subscribe-Filter" className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" placeholder="name" />
                      </div>
                      <button className="flex-shrink-0 px-4 py-2 text-base font-semibold text-white bg-purple-600 rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-purple-200" type="submit"> Filter
                      </button>
                    </form>
                  </div>
                </div>

                <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                  <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                    <table className="min-w-full leading-normal">
                      <thead>
                        <tr>
                          <th scope="col" className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal">
                            Name
                          </th>
                          <th scope="col" className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal">
                            Clicks
                          </th>
                          <th scope="col" className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal">
                            status
                          </th>
                          <th scope="col" className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal">
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          data?.items &&
                          data?.items.map(
                            (link) =>
                            {
                              return (
                                <tr key={link.id}>
                                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <div className="flex items-center">
                                      <div className="ml-3">
                                        <p className="text-gray-900 whitespace-no-wrap">
                                          {link.name} - {' '}
                                          <span className='text-xs text-gray-500'>
                                            {link.publicName}
                                          </span>
                                          <br />
                                          {link.destination}
                                        </p>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                                      <span aria-hidden="true" className="absolute inset-0 bg-green-200 opacity-50 rounded-full">
                                      </span>
                                      <Link href={`/app/${tenantId}/links/${link.id}/analitycs`} passHref={true}>
                                        <a className="relative">
                                          {link?.clicks}
                                        </a>
                                      </Link>
                                    </span>
                                  </td>
                                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                                      <span aria-hidden="true" className="absolute inset-0 bg-green-200 opacity-50 rounded-full">
                                      </span>
                                      <span className="relative"> active </span>
                                    </span>
                                  </td>
                                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <Link href={`/app/${tenantId}/links/${link.id}/edit`} passHref={true}>
                                      <button className='inline-block mx-1 text-indigo-600 hover:text-indigo-900' type='button'>
                                        Edit
                                      </button>
                                    </Link>
                                    <button className='inline-block mx-1 text-indigo-600 hover:text-indigo-900' type='button' onClick={() => deleteLink(link.id)}>
                                      Delete
                                    </button>
                                  </td>
                                </tr>
                              )
                            }
                          )
                        }

                      </tbody>
                    </table>
                    <div className="px-5 bg-white py-5 flex flex-col xs:flex-row items-center xs:justify-between">
                      <div className="flex items-center">
                        <Link href={`/app/${tenantId}/links?cursor=${data?.prevCursor}`} passHref={true}>
                          <button
                            type="button"
                            className="w-full p-4 border text-base rounded-l-xl text-gray-600 bg-white hover:bg-gray-100"
                            disabled={!data?.prevCursor}
                          >
                            <svg width="9" fill="currentColor" height="8" className="" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                              <path d="M1427 301l-531 531 531 531q19 19 19 45t-19 45l-166 166q-19 19-45 19t-45-19l-742-742q-19-19-19-45t19-45l742-742q19-19 45-19t45 19l166 166q19 19 19 45t-19 45z">
                              </path>
                            </svg>
                          </button>
                        </Link>
                        <Link href={`/app/${tenantId}/links?cursor=${data?.nextCursor}`} passHref={true}>
                          <button
                            type="button"
                            className="w-full p-4 border-t border-b border-r text-base  rounded-r-xl text-gray-600 bg-white hover:bg-gray-100"
                            disabled={!data?.nextCursor}
                          >
                            <svg width="9" fill="currentColor" height="8" className="" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                              <path d="M1363 877l-742 742q-19 19-45 19t-45-19l-166-166q-19-19-19-45t19-45l531-531-531-531q-19-19-19-45t19-45l166-166q19-19 45-19t45 19l742 742q19 19 19 45t-19 45z">
                              </path>
                            </svg>
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )
      }
    </>
  )
}

export default Links;
