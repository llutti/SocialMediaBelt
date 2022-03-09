import React from 'react';

interface Props
{
  children: React.ReactNode
}

const LayoutTenant = ({ children }: Props) =>
{
  return (
    <>
      {children}
    </>
  )
}

export default LayoutTenant;
