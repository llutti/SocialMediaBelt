// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { prisma } from "@lib/prisma";
import { getSession } from 'next-auth/react';
import { Link, Prisma } from '@prisma/client';

interface returnData
{
  success: boolean;
  id?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<returnData>
)
{
  const session = await getSession({ req });

  if (session)
  {
    const tenantId = req.query.tenantId as string;
    const linkId = req.query.linkId as string;

    if (req.method === 'DELETE')
    {
      // TODO: Checar se tenho acesso ao tenant
      const tenants = await prisma.tenant
        .findMany({
          where: {
            users: {
              some: {
                userId: session?.user.id ?? undefined
              }
            }
          }
        });

      await prisma.link
        .delete({
          where: {
            id: linkId
          }
        });

      res.status(200).json({ success: true, id: linkId });
      return
    }
  }
  res.status(400).json({ success: false });
}
