import { prisma } from "@lib/prisma";

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

export { findTenantBySlug }
