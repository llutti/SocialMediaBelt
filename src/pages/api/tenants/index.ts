// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { prisma } from "@lib/prisma";
import { getSession } from 'next-auth/react';
import { Tenant } from '@prisma/client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Tenant[]>
)
{
  const session = await getSession({ req });

  if (session)
  {
    const tenants = await prisma.tenant.findMany({
      where: {
        users: {
          some: {
            userId: session?.user.id ?? undefined
          }
        }
      }
    });

    res.status(200).json(tenants)
    return
  }
  res.status(200).json([]);
}
