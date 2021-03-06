import NextAuth from "next-auth"
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GithubProvider from "next-auth/providers/github"

import { prisma } from "@lib/prisma";
import generate from 'project-name-generator';

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  session: {
    strategy: 'jwt'
  },
  // pages: {
  //   signOut: '/'
  // },
  callbacks: {
    // async signIn({ user, account, profile, email, credentials }) {
    //   return true
    // },
    // async redirect({ url, baseUrl }) {
    //   return baseUrl
    // },
    async session({ session, token, user })
    {
      // console.log('session', { session, token, user });
      session.user.id = token.sub;

      return session;
    },
    async jwt({ token, user, account, profile, isNewUser })
    {
      // console.log('jwt', { token, user });

      if ((isNewUser === true)
        && (user?.id))
      {
        const tenant = await prisma.tenant.findFirst({
          where: {
            users: {
              some: {
                userId: user.id
              }
            }
          }
        });

        if (tenant === null)
        {
          const newTenantName = generate().dashed;

          await prisma.tenant.create({
            data: {
              name: newTenantName,
              image: '',
              slug: newTenantName,
              plan: 'free',
              users: {
                create: [
                  {
                    role: '',
                    user: {
                      connect: {
                        id: user.id
                      }
                    }
                  }
                ]
              }
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
