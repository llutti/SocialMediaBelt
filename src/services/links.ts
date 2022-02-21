import { Link, Prisma } from '@prisma/client';
import { prisma } from "@lib/prisma";

interface LinkPaginationWapper
{
  items: Link[],
  nextCursor?: string,
  prevCursor?: string,
}

const save = async (linkData: Prisma.LinkCreateInput): Promise<Link> =>
{
  const savedLink = await prisma.link
    .create({
      data: linkData
    });

  return savedLink;
}


const findPaginated = async (tenantId: string, cursor?: string | string[], take?: string | string[]): Promise<LinkPaginationWapper> =>
{
  const takeNumber = Number(take || 5);
  const args: Prisma.LinkFindManyArgs = {
    where: {
      tenantId: {
        equals: tenantId
      }
    },
    take: takeNumber,
    orderBy: {
      id: 'asc'
    }
  }
  if (cursor)
  {
    args.cursor = {
      id: String(cursor)
    }
  }

  const links = await prisma.link.findMany(args);
  const nextLink = await prisma.link
    .findFirst(
      {
        select: {
          id: true
        },
        where: {
          id: {
            gt: links[links.length - 1]?.id
          }
        },
        orderBy: {
          id: 'asc'
        }
      });
  const prevLink = await prisma.link
    .findMany({
      select: {
        id: true
      },
      where: {
        id: {
          lt: links[0]?.id
        }
      },
      orderBy: {
        id: 'desc'
      },
      take: takeNumber
    });

  return {
    items: links,
    nextCursor: nextLink?.id ?? '',
    prevCursor: prevLink?.[prevLink.length - 1]?.id ?? ''
  }
}


export type { LinkPaginationWapper }
export { findPaginated, save }
