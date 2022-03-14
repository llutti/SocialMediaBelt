import Link from 'next/link';
import { useRouter } from 'next/router';

import { Alert } from '@components/Alert';
import Heading1 from '@components/Heading1';
import { useHttpGet } from '@hooks/api';
import { executeDelete } from '@lib/fetch';
import { LinkPaginationWapper } from '@services/links';
import { CustomDomain } from '@prisma/client';

const Domains = () =>
{
  const router = useRouter();
  const tenantId = router?.query?.tenantid ?? null;
  const { data, mutate } = useHttpGet<CustomDomain[]>(tenantId && `/api/${tenantId}/domains`);

  const deleteLink = async (id: string) =>
  {
    await executeDelete({ url: `/api/${tenantId}/domains/${id}` });
    await mutate();
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div>
          <Heading1>Domínios Customizados</Heading1>
        </div>

        <div className="flex items-center">
          <Link href={`/app/${tenantId}/settings/domains/create`} passHref={true}>
            <button
              type="button"
              className="w-full border-l border-t border-b text-base font-medium rounded-l-md text-black bg-white hover:bg-gray-100 px-4 py-2"
            >
              Criar Domínio
            </button>
          </Link>
        </div>
      </div>

      {
        (data && data?.length === 0) ?
          (
            <Alert type='Info'>Nenhum Domínio cadastrado.</Alert>
          )
          :
          (
            <div className="container mx-auto px-4 sm:px-8 max-w-3xl">
              <div className="py-8">
                <div className="flex flex-row mb-1 sm:mb-0 justify-between w-full">
                  <h2 className="text-2xl leading-tight"> Domínios
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
                            status
                          </th>
                          <th scope="col" className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal">
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          data &&
                          data?.map(
                            (domain) =>
                            {
                              return (
                                <tr key={domain.id}>
                                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <div className="flex items-center">
                                      <div className="ml-3">
                                        <p className="text-gray-900 whitespace-no-wrap">
                                          {domain.domainName}
                                        </p>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                                      <span aria-hidden="true" className="absolute inset-0 bg-green-200 opacity-50 rounded-full">
                                      </span>
                                      <span className="relative">
                                        {domain.active && <span> active </span>}
                                        {!domain.active && <span> inactive </span>}
                                      </span>
                                    </span>
                                  </td>
                                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <Link href={`/app/${tenantId}/settings/domains/${domain.id}/edit`} passHref={true}>
                                      <button className='inline-block mx-1 text-indigo-600 hover:text-indigo-900' type='button'>
                                        Edit
                                      </button>
                                    </Link>
                                    <button className='inline-block mx-1 text-indigo-600 hover:text-indigo-900' type='button' onClick={() => deleteLink(domain.id)}>
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
                  </div>
                </div>

              </div>
            </div>
          )
      }
    </>
  )
}

export default Domains;
