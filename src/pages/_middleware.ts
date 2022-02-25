import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest, ev: NextFetchEvent)
{
  const url = req.nextUrl.clone();
  const { pathname, hostname } = url;

  if ((pathname !== '/')
    && (pathname.startsWith('/app') === false)
    && (pathname.startsWith('/api') === false))
  {
    let slug = hostname;
    if (hostname.indexOf('.socialmediabel.com') !== -1)
    {
      slug = hostname.split('.')[0];
    }
    if (hostname === 'localhost')
    {
      slug = 'meutenant'
    }

    url.pathname = `/${slug}${pathname}`;

    return NextResponse.rewrite(url);
  }
}