// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { prisma } from "@lib/prisma";
import { getSession } from 'next-auth/react';

type Data = {
  id?: string,
  name?: string | null,
  slug?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
)
{
  const session = await getSession({ req });

  console.log(session);

  if (session?.user)
  {
    res.status(200).json(session.user)
    return
  }
  res.status(400).json({});
}
