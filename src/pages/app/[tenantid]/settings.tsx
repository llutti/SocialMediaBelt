import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { SubmitHandler, useForm } from 'react-hook-form';
import { mutate } from 'swr';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { Tenant } from '@prisma/client';

import { Alert } from '@components/Alert';
import Heading2 from '@components/Heading2';
import { Input } from '@components/Input';
import { useHttpGet } from '@hooks/api';
import { executePost } from '@lib/fetch';

interface TenantSettingsForm
{
  tenantId: string;
  name: string;
  slug: string;
}

const schema = yup.object(
  {
    tenantId: yup
      .string(),
    name: yup
      .string()
      .required(),
    slug: yup
      .string()
      .required()
      .test(
        'isUniqueSlug',
        'Este SLUG já está sendo utilizado.',
        async (slug, context) =>
        {
          const tenantId = context.parent.tenantId;
          const res = await fetch(`/api/tenants?slug=${slug}`, { method: 'GET', headers: { 'Content-Type': 'application/json' }, });
          const data = await res.json();
          let result = !!data?.message;
          if (result === false)
          {
            if (data?.id === tenantId)
            {
              result = true;
            }
          }

          return result;
        }),
  }).required();


const Settings = () =>
{
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<TenantSettingsForm>({ resolver: yupResolver(schema) });
  const tenantId = router?.query?.tenantid ?? null;
  const onSubmit: SubmitHandler<TenantSettingsForm> = async (inputs) =>
  {
    await executePost({ url: `/api/${tenantId}/settings`, data: inputs });
    mutate(`/api/tenants/${tenantId}`);
    setSuccess(true);
  };

  const { data } = useHttpGet<Tenant>(tenantId && `/api/${tenantId}/settings`);

  useEffect(
    () =>
    {
      setValue('tenantId', String(tenantId));
      if (data)
      {
        setValue('name', data.name);
        setValue('slug', data.slug);
      }
    },
    [tenantId, data, setValue]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="container max-w-2xl mx-auto shadow-md md:w-3/4 mt-4">
        <div className="p-4 bg-gray-100 border-t-2 border-indigo-400 rounded-lg bg-opacity-5">
          <div className="max-w-sm mx-auto md:w-full md:mx-0">
            <div className="inline-flex items-center space-x-4">
              <Heading2>Configurações de Conta</Heading2>
            </div>
          </div>
        </div>
        <div className="space-y-6 bg-white">
          <div className="items-center w-full p-4 space-y-4 text-gray-500 md:inline-flex md:space-y-0">
            <h2 className="max-w-sm mx-auto md:w-1/3">Identificação</h2>
            <div className="max-w-sm mx-auto md:w-2/3 space-y-5">

              {
                success &&
                <Alert type='Success'>Alteração realizada com sucesso!</Alert>
              }

              <Input
                label='Nome da Conta'
                placeholder='Nome da Conta'
                {...register('name')}
                erros={errors?.name}
              />

              <Input
                label='Identificador (slug)'
                placeholder='Identificador (slug)'
                {...register('slug')}
                erros={errors?.slug}
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

export default Settings;