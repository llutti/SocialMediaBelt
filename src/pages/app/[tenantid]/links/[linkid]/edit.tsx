import Heading1 from '@components/Heading1';
import Heading2 from '@components/Heading2';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useRouter } from 'next/router';
import { executePatch } from '@lib/fetch';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useHttpGet } from 'src/hooks/api';
import { Link as LinkEntity } from '@prisma/client';
import { Alert } from '@components/Alert';
import { Input } from '@components/Input';

interface NewLinkForm
{
  name: string;
  publicName: string;
  slug: string;
  destination: string;
  appLink: string;
}

const EditLink = () =>
{
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const tenantId = router?.query?.tenantid ?? null;
  const linkId = router?.query?.linkid ?? null;
  const schema = yup.object(
    {
      name: yup.string().required(),
      publicName: yup.string().required(),
      slug: yup.string().required()
        .test(
          'uniqueSlug',  // Name
          'This SLUG is already registered.',               // Msg
          async (slug) =>
          {
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
      destination: yup.string().required(),
      // appLink: yup.string().required(),
    }).required();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<NewLinkForm>({ resolver: yupResolver(schema) });
  const onSubmit: SubmitHandler<NewLinkForm> = async (inputs) =>
  {
    setSuccess(false);
    const res = await executePatch({ url: `/api/${tenantId}/links/${linkId}`, data: inputs });
    router.push(`/app/${tenantId}/links`);
  }
  const { data } = useHttpGet<LinkEntity>(tenantId && linkId && `/api/${tenantId}/links/${linkId}`);

  useEffect(
    () =>
    {
      if (data)
      {
        setValue('name', data.name);
        setValue('publicName', data.publicName);
        setValue('slug', data.slug);
        setValue('destination', data.destination);
        // setValue('appLink', data.appLink);
      }
    },
    [data, setValue]);

  const validarSlug = async (value: string) =>
  {

    return !!data;
  }
  return (
    <>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2">
        <div>
          <Heading1>Editar Link</Heading1>
          <Heading2>Gerenciador de Links</Heading2>
        </div>
        <div className="flex items-center">
          <Link href={`/app/${router?.query?.tenantid}/links/create`} passHref={true}>
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
      </div> */}
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
