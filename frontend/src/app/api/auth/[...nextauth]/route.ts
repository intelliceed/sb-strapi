// outsource dependencies
import NextAuth from 'next-auth'
import {signIn} from "@/services/auth";
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Sign in with Email',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize (credentials) {
                const { user, jwt, ...attr } = await signIn({
                    email: credentials?.email,
                    password: credentials?.password,
                });
                const session = { ...user, jwt }
                const isSession = Object.keys(session).length;
                return isSession ? session : null;
            },
        })
    ],
    callbacks: {
        session: async ({ session, token }) => {
            session.id = token.id as string;
            session.jwt = token.jwt as string;
            console.log('session', session)
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
})

export { handler as GET, handler as POST }
