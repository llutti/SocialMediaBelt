import { Click, Link, Prisma } from '@prisma/client';
import { prisma } from "@lib/prisma";

interface LinkPaginationWapper
{
  items: (Link & { clicks: number })[],
  nextCursor?: string,
  prevCursor?: string,
}

interface ClickPaginationWapper
{
  items: Click[],
  nextCursor?: string,
  prevCursor?: string,
}

const save = async (tenantId: string, linkData: Prisma.LinkCreateInput): Promise<Link | null> =>
{
  const currentLink = await findLinkBySlug(tenantId, linkData.slug as string);
  if (currentLink !== null)
  {
    return null;
  }

  const savedLink = await prisma.link
    .create({
      data: linkData
    });

  return savedLink;
}

const update = async (tenantId: string, id: string, linkData: Prisma.LinkUpdateInput): Promise<Link | null> =>
{
  const currentLink = await findLinkBySlug(tenantId, linkData.slug as string);
  if ((currentLink !== null)
    && (currentLink?.id !== id))
  {
    return null;
  }

  const savedLink = await prisma.link
    .update({
      where: { id },
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
      where: {
        link: {
          tenantId
        }
      },
      by: ['linkId'],
      _count: {
        id: true
      }
    });

  const linksWithAnalitycs = links
    .map(link =>
    {
      const clicks = linksWithClicks.find(lnk => lnk.linkId === link.id)?._count.id || 0;
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

const findAnalitycsPaginated = async (linkId: string, cursor?: string | string[], take?: string | string[]): Promise<ClickPaginationWapper> =>
{
  const takeNumber = Number(take || 5);
  const args: Prisma.ClickFindManyArgs = {
    where: {
      linkId: {
        equals: linkId
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

  const clicks = await prisma.click.findMany(args);
  let nextClick: { id: string; } | null = null;
  if (clicks.length > 0)
  {
    nextClick = await prisma.click
      .findFirst(
        {
          select: {
            id: true
          },
          where: {
            id: {
              gt: clicks[clicks.length - 1]?.id
            }
          },
          orderBy: {
            id: 'asc'
          }
        });
  }

  let prevClick: { id: string; }[] | null = null;
  if (clicks.length > 0)
  {
    prevClick = await prisma.click
      .findMany({
        select: {
          id: true
        },
        where: {
          id: {
            lt: clicks[0]?.id
          }
        },
        orderBy: {
          id: 'desc'
        },
        take: takeNumber
      });
  }

  return {
    items: clicks,
    nextCursor: nextClick?.id ?? '',
    prevCursor: prevClick?.[prevClick.length - 1]?.id ?? ''
  }
}

const findLinkById = async (id: string) =>
{
  const link = await prisma.link
    .findFirst({
      where: {
        id
      }
    });

  return link;
}

const findLinkBySlug = async (tenantId: string, slug: string) =>
{
  const link = await prisma.link
    .findFirst({
      // select: {
      //   id: true,
      //   destination: true,
      // },
      where: {
        tenantId,
        slug
      }
    });

  return link;
}

export type { LinkPaginationWapper, ClickPaginationWapper }
export { findPaginated, findAnalitycsPaginated, findLinkBySlug, findLinkById, save, update }
