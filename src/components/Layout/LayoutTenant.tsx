import React from 'react';

interface Props
{
  children: React.ReactNode
}

const LayoutTenant = ({ children }: Props) =>
{
  return (
    <>
      <h1>Layout Tenant</h1>
      {children}
    </>
  )
}

export default LayoutTenant;
