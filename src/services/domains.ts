import { Prisma, CustomDomain } from '@prisma/client';

import { prisma } from "@lib/prisma";


const create = async (tenantId: string, newData: Prisma.CustomDomainCreateInput): Promise<CustomDomain | null> =>
{
  const currentdomain = await findDomainByDomainName(tenantId, newData.domainName);
  if (currentdomain !== null)
  {
    return null;
  }

  const saved = await prisma.customDomain
    .create({
      data: newData
    });

  return saved;
}

const update = async (tenantId: string, id: string, newData: Prisma.CustomDomainUpdateInput): Promise<CustomDomain|null> =>
{
  const currentdomain = await findDomainByDomainName(tenantId, newData?.domainName as string);
  if (currentdomain !== null)
  {
    return null;
  }

  const saved = await prisma.customDomain
    .update({
      where: {
        id
      },
      data: newData
    });

  return saved;
}

const findDomainById = async (id: string) =>
{
  const customDomain = await prisma.customDomain
    .findFirst({
      where: {
        id
      }
    });

  return customDomain;
}

const findDomainByDomainName = async (tenantId: string, domainName: string) =>
{
  const domain = await prisma.customDomain
    .findFirst({
      // select: {
      //   id: true,
      //   domainName: true,
      // },
      where: {
        tenantId,
        domainName: domainName
      }
    });

  return domain;
}
const findAll = async (tenantId: string): Promise<CustomDomain[]> =>
{
  const domains = await prisma
    .customDomain
    .findMany(
      {
        where: {
          tenantId: tenantId
        }
      }
    );

  return domains || [];
}

export { create, findAll, findDomainById, findDomainByDomainName, update as save }
