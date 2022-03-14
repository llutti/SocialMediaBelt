import { useRouter } from 'next/router';

import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';

import Heading2 from '@components/Heading2';
import { executePost } from '@lib/fetch';
import { Input } from '@components/Input';
import { useEffect } from 'react';

interface NewDomainForm
{
  tenantId: string;
  domainName: string;
}

const schema = yup.object(
  {
    domainName: yup
      .string()
      .required()
      .test(
        'isUniqueDomain',
        'Este DOMÍNIO já está sendo utilizado.',
        async (domainName, context) =>
        {
          const tenantId = context.parent.tenantId;
          const res = await fetch(`/api/${tenantId}/domains?domainName=${domainName}`, { method: 'GET', headers: { 'Content-Type': 'application/json' }, });
          const data = await res.json();

          return !!data?.message;
        }),
  }).required();

const CreateDomain = () =>
{
  const router = useRouter();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<NewDomainForm>({ resolver: yupResolver(schema) });
  const tenantId = router?.query?.tenantid ?? null;
  const onSubmit: SubmitHandler<NewDomainForm> = async (inputs) =>
  {
    await executePost({ url: `/api/${tenantId}/domains`, data: inputs });
    router.push(`/app/${tenantId}/settings/domains`);
  }
  useEffect(
    () =>
    {
      setValue('tenantId', String(tenantId));
    },
    [tenantId, setValue]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="container max-w-2xl mx-auto shadow-md md:w-3/4 mt-4">
        <div className="p-4 bg-gray-100 border-t-2 border-indigo-400 rounded-lg bg-opacity-5">
          <div className="max-w-sm mx-auto md:w-full md:mx-0">
            <div className="inline-flex items-center space-x-4">
              <Heading2>Criar novo Domínio</Heading2>
            </div>
          </div>
        </div>
        <div className="space-y-6 bg-white">
          <div className="items-center w-full p-4 space-y-4 text-gray-500 md:inline-flex md:space-y-0">
            <h2 className="max-w-sm mx-auto md:w-1/3">Identificação</h2>
            <div className="max-w-sm mx-auto md:w-2/3 space-y-5">
              <Input
                label='Nome do Domínio'
                placeholder='Nome do Domínio'
                {...register('domainName')}
                erros={errors?.domainName}
              />
            </div>
          </div>

          <hr />

          <div className="w-full px-4 pb-4 ml-auto text-gray-500 md:w-1/3">
            <button
              type="submit"
              className="py-2 px-4  bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </>
  )
}

export default CreateDomain;
