import React from 'react';

interface Props
{
  children: React.ReactNode
}

const LayoutEmpty = ({ children }: Props) =>
{
  return (
    <>
      {children}
    </>
  )
}

export default LayoutEmpty;
