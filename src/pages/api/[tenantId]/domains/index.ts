import type { NextApiRequest, NextApiResponse } from 'next'

import { getSession } from 'next-auth/react';
import { CustomDomain , Prisma } from '@prisma/client';
import { checkTenantPermition } from 'src/services/users';
import { create, findAll, findDomainByDomainName  } from '@services/domains';

interface SessionError
{
  message?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CustomDomain | CustomDomain[] | SessionError | null>
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
      const domainData: Prisma.CustomDomainCreateInput = {
        domainName: req.body.domainName,
        active: true,
        tenant: {
          connect: {
            id: tenantId
          }
        }
      }

      const saved = await create(tenantId, domainData);

      if (!saved)
      {
        return res
          .status(404)
          .json({ message: 'Domain invalid' });
      }

      return res
        .status(200)
        .json(saved);
    }

    if (req.method === 'GET')
    {
      const { cursor, take, domainName } = req.query;

      if (domainName)
      {
        const domains = await findDomainByDomainName(tenantId, domainName as string);

        if (!domains)
        {
          return res
            .status(404)
            .json({ message: 'DomainName invalid' });
        }

        return res
          .status(200)
          .json(domains);
      }

      const domains = await findAll(tenantId);

      return res
        .status(200)
        .json(domains);
    }
  }

  return res
    .status(404)
    .json({ message: 'You need be auth.' });
}
