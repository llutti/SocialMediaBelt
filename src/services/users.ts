import { prisma } from "@lib/prisma";

const checkTenantPermition = async (tenantId: string, userId?: string) =>
{
  const tenant = await prisma.usersOnTenants
    .findFirst({
      where: {
        userId: userId,
        tenantId: tenantId
      }
    });

    return tenant;
}

export { checkTenantPermition }
