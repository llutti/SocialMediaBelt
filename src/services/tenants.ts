import { Prisma, Tenant } from '@prisma/client';

import { prisma } from "@lib/prisma";


const create = async (newData: Prisma.TenantCreateInput): Promise<Tenant> =>
{
  const saved = await prisma.tenant
    .create({
      data: newData
    });

  return saved;
}

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

const findTenantById = async (id: string) =>
{
  const tenant = await prisma.tenant
    .findFirst({
      where: {
        id
      }
    });

  return tenant;
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

export { create, findTenantBySlug, findTenantById, save }
