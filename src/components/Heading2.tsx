import React from 'react';

interface Props
{
  children: React.ReactNode;
}

const Heading2 = ({ children }: Props) =>
{
  return (
    <h2 className='text-md text-gray-400'>
      {children}
    </h2>
  )
}

export default Heading2;
