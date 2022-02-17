// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { prisma } from "@lib/prisma";
import { Account } from '@prisma/client';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Account[]>
)
{
  const accounts = await prisma?.account.findMany();
  res.status(200).json(accounts ?? [])
}
