import { GetServerSideProps, NextPage } from 'next';

import { findTenantBySlug } from '@services/tenants';
import { getPublicLinks, LinkPublicType } from '@services/links';
import Head from 'next/head';

interface Props
{
  tenant: { id: string, name: string };
  links: LinkPublicType[];
}

const TenantHome: NextPage<Props> = ({ tenant, links, ...props }) =>
{
  return (
    <>
      <Head>
        <title>{tenant.name} - Social Media Belt</title>
        <meta name='description' content="Todos os link's do LLUTTI's Tenant"/>
      </Head>

      <div className='max-w-xl mx-auto pt-4'>
        <h1 className='text-center font-bold text-4xl'>{tenant.name}</h1>
        {
          links.map(
            link =>
            {
              return (
                <a
                  key={link.id}
                  href={link.destination}
                  className='bg-gray-800 text-white py-4 w-full block text-center hover:bg-gray-200 hover:text-gray-800 border-2 border-solid my-4 transition-all'
                  target='_blank'
                  rel='noreferrer'
                >
                  {link.publicName}
                </a>
              )
            }
          )
        }

        <hr />
        <footer className='text-center text-sm mt-2'>
          Construído com Social Media Belt
        </footer>
      </div>
    </>
  );
}

export default TenantHome;

export const getServerSideProps: GetServerSideProps = async (context) =>
{
  const slug = context?.params?.slug;
  let tenant = null;
  if (slug?.indexOf('.') === -1)
  {
    tenant = await findTenantBySlug(String(context?.params?.slug));
  }

  if (!tenant)
  {
    return {
      notFound: true,
    }
  }

  const links = await getPublicLinks(tenant?.id);

  return {
    props: {
      ...context?.params,
      tenant,
      links,
    }
  }
}