import { Prisma, Tenant } from '@prisma/client';

import { prisma } from "@lib/prisma";


const save = async (id: string, newData: Prisma.TenantUpdateInput): Promise<Tenant> =>
{
  const saved = await prisma.tenant
    .update({
      where: {
        id
      },
      data: newData
    });

  return saved;
}

const findTenantBySlug = async (slug: string) =>
{
  const tenant = await prisma.tenant
    .findFirst({
      select: {
        id: true,
        name: true,
      },
      where: {
        slug
      }
    });

  return tenant;
}

export { findTenantBySlug, save }
