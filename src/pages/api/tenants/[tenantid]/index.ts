// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { prisma } from "@lib/prisma";
import { getSession } from 'next-auth/react';
import { Tenant } from '@prisma/client';

interface SessionError
{
  message?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Tenant | SessionError>
)
{
  const session = await getSession({ req });

  if (session)
  {
    const tenantId = req.query.tenantid as string;
    const tenant = await prisma.tenant.findFirst({
      where: {
        id: tenantId
      }
    });

    if (!tenant)
    {
      res.status(200).json({ message: `Tenant [${tenantId}] not found.` });
      return
    }

    res.status(200).json(tenant);

    return
  }
  res.status(200).json({ message: 'You need be auth.' });
}
