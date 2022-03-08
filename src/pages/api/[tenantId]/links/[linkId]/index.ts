// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { prisma } from "@lib/prisma";
import { getSession } from 'next-auth/react';
import { checkTenantPermition } from 'src/services/users';
import { findLinkById, update } from '@services/links';
import { Link, Prisma } from '@prisma/client';

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
  res: NextApiResponse<Link | returnData | SessionError | null>
)
{
  const session = await getSession({ req });

  if (session)
  {
    const tenantId = String(req.query.tenantid);
    const tenant = await checkTenantPermition(tenantId, session?.user?.id);
    if (!tenant)
    {
      return res
        .status(404)
        .json({ message: 'Needs to be auth' });
    }
    const linkId = req.query.linkid as string;

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
        return res
          .status(404)
          .json({ message: 'Needs to be auth' });
      }

      await prisma.link
        .delete({
          where: {
            id: linkId
          }
        });

      return res
        .status(200)
        .json({ success: true, id: linkId });
    }

    if (req.method === 'PATCH')
    {
      const link = await prisma.link.findFirst({
        where: {
          id: linkId,
          tenantId
        }
      });

      if (!link)
      {
        return res
          .status(404)
          .json({ message: 'Needs to be auth' });
      }

      const linkData: Prisma.LinkUpdateInput = {
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

      const savedLink = await update(tenantId, linkId, linkData);

      if (!savedLink)
      {
        return res
          .status(404)
          .json({ message: 'Slug invalid' });
      }

      return res
        .status(200)
        .json(savedLink);
    }

    if (req.method === 'GET')
    {
      const link = await findLinkById(linkId);

      return res
        .status(200)
        .json(link);
    }
  }
  return res
    .status(400)
    .json({ success: false });
}
