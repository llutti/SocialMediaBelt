import { GetServerSideProps, NextPage } from 'next';

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
  const tenant = await findTenantBySlug(String(context?.params?.slug));
  if (!tenant)
  {
    return {
      notFound: true,
    }
  }

  const link = await findLinkBySlug(String(tenant?.id), String(context?.params?.link));
  if (!link)
  {
    return {
      notFound: true,
    }
  }

  // return {
  //   redirect: {
  //     destination: link.destination
  //   }
  // }

  return {
    props: {
      ...context?.params,
      tenant,
      link
    }
  }
}
