import React from 'react';

interface Props
{
  children: React.ReactNode
}

const LayoutPublic = ({ children }: Props) =>
{
  return (
    <>
      {children}
    </>
  )
}

export default LayoutPublic;
