import type { NextApiRequest, NextApiResponse } from 'next'

import { getSession } from 'next-auth/react';
import { Prisma, Tenant } from '@prisma/client';
import { checkTenantPermition } from 'src/services/users';
import { save } from '@services/tenants';

interface SessionError
{
  message?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Tenant | SessionError | null>
)
{
  const session = await getSession({ req });

  if (session)
  {
    const tenantId = req.query.tenantId as string;
    const tenant = await checkTenantPermition(tenantId, session?.user?.id);
    if (!tenant)
    {
      res
        .status(404)
        .json({ message: 'You need be auth.' });


      return;
    }

    if (req.method === 'POST')
    {
      const newData: Prisma.TenantUpdateInput = {
        name: req.body.name,
        slug: req.body.slug,
      }
      const saved = await save(tenantId, newData);

      res.status(200).json(saved);

      return;
    }

  }

  res
    .status(404)
    .json({ message: 'You need be auth.' });

}
