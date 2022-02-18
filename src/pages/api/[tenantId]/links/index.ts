// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { prisma } from "@lib/prisma";
import { getSession } from 'next-auth/react';
import { Link, Prisma } from '@prisma/client';

interface LinksData
{
  link?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Link | Link[] | null>
)
{
  const session = await getSession({ req });

  if (session)
  {
    const tenantId = req.query.tenantId as string;
    if (req.method === 'POST')
    {
      const linkData: Prisma.LinkCreateInput = {
        name: req.body.name,
        publicName: req.body.publicName,
        slug: req.body.slug,
        destination: req.body.destination,
        tenant: {
          connect: {
            id: tenantId
          }
        }
      }

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

      const savedLink = await prisma.link
        .create({
          data: linkData
        })
      res.status(200).json(savedLink)
      return
    }

    if (req.method === 'GET')
    {
      const links = await prisma.link
        .findMany({
          where: {
            tenantId: tenantId
          }
        });

      res.status(200).json(links)
      return
    }
  }
  res.status(200).json(null);
}
