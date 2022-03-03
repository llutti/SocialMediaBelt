// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { prisma } from "@lib/prisma";
import { getSession } from 'next-auth/react';
import { Prisma, Tenant } from '@prisma/client';
import { create } from '@services/tenants';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Tenant[] | Tenant>
)
{
  const session = await getSession({ req });

  if (session)
  {

    if (req.method === 'POST')
    {
      const newData: Prisma.TenantCreateInput = {
        name: req.body.name,
        slug: req.body.slug,
        plan: req.body.plan,
        image: '',
        users: {
          create: {
            user: {
              connect: {
                id: session.user.id,
              }
            },
            role: 'admin'
          }
        }
      }
      const saved = await create(newData);

      return res
        .status(200)
        .json(saved);
    }

    const tenants = await prisma.tenant.findMany({
      where: {
        users: {
          some: {
            userId: session?.user.id ?? undefined
          }
        }
      }
    });

    return res
      .status(200)
      .json(tenants);
  }
  return res
    .status(200)
    .json([]);
}
