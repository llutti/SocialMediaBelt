import { GetServerSideProps, NextPage } from 'next';

import { findTenantBySlug } from '@services/tenants';

const TenantHome: NextPage = (props) =>
{
  return (
    <>
      <h1>Tenant Home</h1>
      {JSON.stringify(props, null, 2)}
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
    if (!tenant)
    {
      return {
        notFound: true,
      }
    }
  }




  return {
    props: {
      ...context?.params,
      tenant,
    }
  }
}