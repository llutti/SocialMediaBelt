import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';

import { Alert } from '@components/Alert';
import Heading2 from '@components/Heading2';
import { Input } from '@components/Input';
import { executePatch } from '@lib/fetch';
import { useHttpGet } from '@hooks/api';
import { Link as LinkEntity } from '@prisma/client';

interface NewLinkForm
{
  tenantId: string;
  linkId: string;
  name: string;
  publicName: string;
  slug: string;
  destination: string;
  appLink: string;
}

const schema = yup.object(
  {
    tenantId: yup
      .string(),
    linkId: yup
      .string(),
    name: yup
      .string()
      .required(),
    publicName: yup
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
          const linkId = context.parent.linkId;
          const res = await fetch(`/api/${tenantId}/links?slug=${slug}`, { method: 'GET', headers: { 'Content-Type': 'application/json' }, });
          const data = await res.json();
          let result = !!data?.message;
          if (result === false)
          {
            if (data?.id === linkId)
            {
              result = true;
            }
          }

          return result;
        }),
    destination: yup
      .string()
      .required(),
    appLink: yup
      .string() //.required(),
  }).required();

const EditLink = () =>
{
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const tenantId = router?.query?.tenantid ?? null;
  const linkId = router?.query?.linkid ?? null;

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<NewLinkForm>({ resolver: yupResolver(schema) });
  const onSubmit: SubmitHandler<NewLinkForm> = async (inputs) =>
  {
    setSuccess(false);
    await executePatch({ url: `/api/${tenantId}/links/${linkId}`, data: inputs });
    router.push(`/app/${tenantId}/links`);
  }
  const { data } = useHttpGet<LinkEntity>(tenantId && linkId && `/api/${tenantId}/links/${linkId}`);

  useEffect(
    () =>
    {
      setValue('tenantId', String(tenantId));
      setValue('publicName', String(linkId));

      if (data)
      {
        setValue('name', data.name);
        setValue('publicName', data.publicName);
        setValue('slug', data.slug);
        setValue('destination', data.destination);
        // setValue('appLink', data.appLink);
      }
    },
    [tenantId, linkId, data, setValue]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="container max-w-2xl mx-auto shadow-md md:w-3/4 mt-4">
        <div className="p-4 bg-gray-100 border-t-2 border-indigo-400 rounded-lg bg-opacity-5">
          <div className="max-w-sm mx-auto md:w-full md:mx-0">
            <div className="inline-flex items-center space-x-4">
              <Heading2>Editar Link</Heading2>
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
                label='Nome do Link'
                placeholder='Nome do Link'
                {...register('name')}
                erros={errors?.name}
              />
              <Input
                label='Nome Público'
                placeholder='Nome Público'
                {...register('publicName')}
                erros={errors?.publicName}
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
          <div className="items-center w-full p-4 space-y-4 text-gray-500 md:inline-flex md:space-y-0">
            <h2 className="max-w-sm mx-auto md:w-1/3">Destino</h2>
            <div className="max-w-sm mx-auto space-y-5 md:w-2/3">
              <Input
                label='Link Externo'
                placeholder='https://'
                {...register('destination')}
                erros={errors?.destination}
              />

              <Input
                label='Link Interno'
                placeholder='TBD link interno para app'
                {...register('appLink')}
                erros={errors?.appLink}
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

export default EditLink;
