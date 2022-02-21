import type { NextApiRequest, NextApiResponse } from 'next'

import { prisma } from "@lib/prisma";
import { getSession } from 'next-auth/react';
import { Link, Prisma } from '@prisma/client';
import { findPaginated, LinkPaginationWapper, save } from 'src/services/links';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Link | LinkPaginationWapper | null>
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

      const savedLink = await save(linkData);

      res.status(200).json(savedLink);

      return;
    }

    if (req.method === 'GET')
    {
      const { cursor, take } = req.query;
      const links = await findPaginated(tenantId, cursor, take);

      res.status(200)
        .json({
          items: links.items,
          nextCursor: links.nextCursor,
          prevCursor: links.prevCursor,
        });

      return;
    }
  }
  res.status(400).json(null);
}
