// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { prisma } from "@lib/prisma";
import { getSession } from 'next-auth/react';
import { Link, Prisma } from '@prisma/client';
import { json } from 'stream/consumers';
import { cursorTo } from 'readline';

type LinkPaginationWapper = {
  cursor?: string,
  take?: number,
  items: Link[],
}

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

      const savedLink = await prisma.link
        .create({
          data: linkData
        })
      res.status(200).json(savedLink)
      return
    }

    if (req.method === 'GET')
    {
      const { cursor: queryCursor, take: queryTake } = req.query;

      const cursor = queryCursor ? { id: queryCursor as string } : undefined;
      const take = Number(queryTake ?? 5);

      const links = await prisma.link
        .findMany({
          take,
          skip: cursor ? 1 : 0,
          where: {
            tenantId: tenantId
          },
          cursor,
          orderBy: {
            id: 'asc'
          }
        });


      // http://localhost:3000/api/ckzpwyhpv002610wg0tif21e1/links?take=2&cursor=ckzsimd6z06292kwgm0ov6ze3
      res.status(200).json({
        cursor: cursor?.id,
        take,
        items: links
      })
      return
    }
  }
  res.status(400).json(null);
}
