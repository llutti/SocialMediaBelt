import NextAuth from "next-auth"
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GithubProvider from "next-auth/providers/github"

import { prisma } from "@lib/prisma";

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  // jwt:{

  // },
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    // async signIn({ user, account, profile, email, credentials }) {
    //   return true
    // },
    // async redirect({ url, baseUrl }) {
    //   return baseUrl
    // },
    // async session({ session, token, user })
    // {
    //   return session;
    // },
    async jwt({ token, user, account, profile, isNewUser })
    {
      // console.log('jwt callback');
      // console.log({ user, token, isNewUser });

      if ((isNewUser === true)
        && (user?.id))
      {
        const tenant = await prisma.tenant.findFirst({
          where: {
            userId: user.id
          }
        });

        if (tenant === null)
        {
          await prisma.tenant.create({
            data: {
              name: 'Meu Tenant',
              userId: user.id,
              image: '',
              slug: 'meutenant',
              plan: 'free',
            }
          })
        }

      }
      return token
    },
  },
  events: {},
  debug: false,
});
