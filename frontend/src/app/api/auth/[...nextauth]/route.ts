// outsource dependencies
import { signIn } from "@/services/auth";
import NextAuth, { Session } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const nextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Sign in with Email',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize (credentials) {
        const { user, jwt, ...ignored } = await signIn({
          email: credentials?.email,
          password: credentials?.password,
        });
        const session = { ...user, jwt };
        const isSession = Object.keys(session).length;
        return isSession ? session : null;
      },
    })
  ],
  callbacks: {
    session: async ({ session, token }): Promise<Session> => {
      if ("id" in token) session.id = token.id;
      if ("jwt" in token) session.jwt = token.jwt;
      console.log('session', session);
      return session;
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.jwt = user.jwt;
      }
      
      console.log('jwt callback', token);
      
      return token;
    },
  },
};

const handler = NextAuth(nextAuthOptions);

export { handler as GET, handler as POST };
