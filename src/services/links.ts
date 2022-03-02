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
  let nextLink: { id: string; } | null = null;
  if (links.length > 0)
  {
    nextLink = await prisma.link
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
  }

  let prevLink: { id: string; }[] | null = null;
  if (links.length > 0)
  {
    prevLink = await prisma.link
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
  }

  const linksWithClicks = await prisma
    .click
    .groupBy({
      by: ['linkId'],
      _count: {
        id: true
      }
    });

  const linksWithAnalitycs = links
    .map(link =>
    {
      const clicks = linksWithClicks
        .find(lnk => lnk.linkId = link.id)
        ?._count.id || 0;
      return {
        ...link,
        clicks
      }
    });

  return {
    items: linksWithAnalitycs,
    nextCursor: nextLink?.id ?? '',
    prevCursor: prevLink?.[prevLink.length - 1]?.id ?? ''
  }
}

const findLinkBySlug = async (tenantId: string, slug: string) =>
{
  const link = await prisma.link
    .findFirst({
      select: {
        id: true,
        destination: true,
      },
      where: {
        tenantId,
        slug
      }
    });

  return link;
}

export type { LinkPaginationWapper }
export { findPaginated, findLinkBySlug, save }
