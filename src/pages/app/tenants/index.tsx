import { useEffect } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';

import { Tenant as TenantEntity } from '@prisma/client';

import Heading1 from '@components/Heading1';
import { useHttpGet } from 'src/hooks/api';
import { executeDelete } from '@lib/fetch';
import Alert from '@components/Alert';

const Tenants = () =>
{
  const router = useRouter();
  const { data, mutate } = useHttpGet(`/api/tenants`);

  const deleteLink = async (id: string) =>
  {
    await executeDelete({ url: `/api/${router?.query?.tenantId}/links/${id}` });
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
          router.push(`/app/${router?.query?.tenantId}/links`);
        }
      }
    }

  }, [data, router])
  return (
    <>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div>
          <Heading1>Minhas Contas</Heading1>
        </div>
        <div className="flex items-center">
          <Link href={`/app/tenants/create`} passHref={true}>
            <button
              type="button"
              className="w-full border text-base font-medium rounded-md text-black bg-white hover:bg-gray-100 px-4 py-2"
            >
              Criar nova conta
            </button>
          </Link>
        </div>
      </div>

      {
        (data && data?.length === 0) ?
          (
            <Alert>Nenhuma conta cadastrada.</Alert>
          )
          :
          (
            <div className="container mx-auto px-4 sm:px-8 max-w-3xl">
              <div className="py-8">
                <div className="flex flex-row mb-1 sm:mb-0 justify-between w-full">
                  <h2 className="text-2xl leading-tight">
                    Contas
                  </h2>
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
                            (tenant: TenantEntity) =>
                            {
                              return (
                                <tr key={tenant.id}>
                                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <div className="flex items-center">
                                      <div className="ml-3">
                                        <p className="text-gray-900 whitespace-no-wrap">
                                          {tenant.name}
                                          <br/>
                                          <span className='text-xs text-gray-500'>
                                            {tenant.slug}.socialmediabelt.com
                                          </span>
                                        </p>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                                      <span aria-hidden="true" className="absolute inset-0 bg-green-200 opacity-50 rounded-full">
                                      </span>
                                      <span className="relative"> {tenant.plan}
                                      </span>
                                    </span>
                                  </td>
                                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <button className='inline-block mx-1 text-indigo-600 hover:text-indigo-900' type='button'>
                                      Edit
                                    </button>
                                    <button className='inline-block mx-1 text-indigo-600 hover:text-indigo-900' type='button' onClick={() => deleteLink(tenant.id)}>
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

export default Tenants;
