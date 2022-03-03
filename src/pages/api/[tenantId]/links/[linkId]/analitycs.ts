// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { prisma } from "@lib/prisma";
import { getSession } from 'next-auth/react';
import { checkTenantPermition } from 'src/services/users';
import { ClickPaginationWapper, findAnalitycsPaginated } from '@services/links';

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
  res: NextApiResponse<ClickPaginationWapper | returnData | SessionError>
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

    const { cursor, take } = req.query;
    const clicks = await findAnalitycsPaginated(linkId, cursor, take);

    return res
      .status(200)
      .json(clicks);
  }

  return res
    .status(400)
    .json({ success: false });
}
