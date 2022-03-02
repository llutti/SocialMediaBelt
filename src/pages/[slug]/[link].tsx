import { GetServerSideProps, NextPage } from 'next';
import { prisma } from "@lib/prisma";
import { findLinkBySlug } from 'src/services/links';
import { findTenantBySlug } from 'src/services/tenants';

const GoPage: NextPage = (props) =>
{
  return (
    <>
      <h1>Go Page</h1>
      {JSON.stringify(props, null, 2)}
    </>
  )
}
export default GoPage;

export const getServerSideProps: GetServerSideProps = async (context) =>
{
  const slug = context?.params?.slug;
  let tenant = null;
  if (slug?.indexOf('.') === -1)
  {
    tenant = await findTenantBySlug(String(context?.params?.slug));
    if (!tenant)
    {
      return {
        notFound: true,
      }
    }
  }

  const link = await findLinkBySlug(String(tenant?.id), String(context?.params?.link));
  if (!link)
  {
    return {
      notFound: true,
    }
  }

  // Counting Clicks

  const clicks = await prisma
    .click
    .create({
      data: {
        metadata: JSON.stringify(context.req.headers),
        link: {
          connect: {
            id: link.id,
          }
        }
      }
    })

  // return {
  //   redirect: {
  //     destination: link.destination
  //   }
  // }

  return {
    props: {
      message: 'O REDIRECT ESTÁ DESATIVADO PARA FACITAR OS TESTES',
      ...context?.params,
      tenant,
      link
    }
  }
}
