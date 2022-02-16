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
  callbacks: {
    async session({ session, token, user })
    {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token?.accessToken;
      session.user = user;

      return session;
    }
  }
});
