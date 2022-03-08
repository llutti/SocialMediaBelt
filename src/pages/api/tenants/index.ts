// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { prisma } from "@lib/prisma";
import { getSession } from 'next-auth/react';
import { Prisma, Tenant } from '@prisma/client';
import { create, findTenantBySlug } from '@services/tenants';

interface TenantId
{
  id: String;
}

interface SessionError
{
  message?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Tenant[] | Tenant | TenantId | SessionError>
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

    if (req.method === 'GET')
    {
      const { slug } = req.query;

      if (slug)
      {
        const tenant = await findTenantBySlug(slug as string);

        if (!tenant)
        {
          return res
            .status(404)
            .json({ message: 'Slug invalid' });
        }

        return res
          .status(200)
          .json(tenant);
      }

      const tenants = await prisma
        .tenant
        .findMany({
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
  }

  return res
    .status(200)
    .json([]);
}
