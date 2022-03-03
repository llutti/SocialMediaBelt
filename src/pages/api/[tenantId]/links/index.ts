import type { NextApiRequest, NextApiResponse } from 'next'

import { getSession } from 'next-auth/react';
import { Link, Prisma } from '@prisma/client';
import { findPaginated, LinkPaginationWapper, save } from 'src/services/links';
import { checkTenantPermition } from 'src/services/users';

interface SessionError
{
  message?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Link | LinkPaginationWapper | SessionError | null>
)
{
  const session = await getSession({ req });

  if (session)
  {
    const tenantId = req.query.tenantid as string;
    const tenant = await checkTenantPermition(tenantId, session?.user?.id);
    if (!tenant)
    {
      return res
        .status(404)
        .json({ message: 'You need be auth.' });
    }

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
      const savedLink = await save(linkData);

      return res
        .status(200)
        .json(savedLink);
    }

    if (req.method === 'GET')
    {
      const { cursor, take } = req.query;
      const links = await findPaginated(tenantId, cursor, take);

      return res
        .status(200)
        .json({
          items: links.items,
          nextCursor: links.nextCursor,
          prevCursor: links.prevCursor,
        });
    }
  }

  return res
    .status(404)
    .json({ message: 'You need be auth.' });
}
