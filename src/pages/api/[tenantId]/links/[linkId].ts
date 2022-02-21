// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { prisma } from "@lib/prisma";
import { getSession } from 'next-auth/react';
import { checkTenantPermition } from 'src/services/users';

interface SessionError
{
  message?: string
}

interface returnData
{
  success: boolean;
  id?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<returnData | SessionError>
)
{
  const session = await getSession({ req });

  if (session)
  {
    const tenantId = String(req.query.tenantId);
    const tenant = await checkTenantPermition(tenantId, session?.user?.id);
    if (!tenant)
    {
      res.status(404)
      .json({
        message: 'Needs to be auth'
      });

      return;
    }
    const linkId = req.query.linkId as string;

    if (req.method === 'DELETE')
    {
      const link = await prisma.link.findFirst({
        where: {
          id: linkId,
          tenantId
        }
      });

      if (!link)
      {
        res.status(404)
        .json({
          message: 'Needs to be auth'
        });

        return;
      }

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
