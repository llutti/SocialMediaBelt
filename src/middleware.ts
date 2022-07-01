import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest, ev: NextFetchEvent)
{
  const url = req.nextUrl.clone();
  const { pathname } = url;
  const hostname = req.headers.get('host') ?? '';

  if ((pathname !== '/')
    && (pathname.startsWith('/app') === false)
    && (pathname.startsWith('/api') === false))
  {
    let slug = hostname.split(':')[0]?.trim();

    if ((hostname.indexOf('.socialmediabel.com') !== -1)
      || (hostname.indexOf('.smb-local') !== -1))
    {
      slug = hostname.split('.')[0];
    }

    if ((hostname === 'localhost:3000')
      || (hostname === 'localhost'))
    {
      slug = 'meutenant'
    }

    url.pathname = `/${slug}${pathname}`;

    if ((hostname !== 'localhost:3000')
      && (hostname !== 'localhost'))
    {
      return NextResponse.rewrite(url);
    }
  }
}