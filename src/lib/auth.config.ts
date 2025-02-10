import { NextAuthConfig } from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';
import { toast } from 'sonner';

const authConfig = {
  providers: [
    CredentialProvider({
      credentials: {
        name: {
          type: 'name'
        },
        email: {
          type: 'email'
        }
      },
      async authorize(credentials, req) {
        const user = {
          name: credentials?.name as string,
          email: credentials?.email as string
        };
        console.log('user', user);
        if (user) {
          try {
            const res = await fetch(
              process.env.NEXT_PUBLIC_API_URL + '/auth/login',
              {
                method: 'POST',
                body: JSON.stringify(user),
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
              }
            );
            console.log('res', res);
            if (res.ok) {
              return user;
            }

            console.error('Login failed:', await res.text());
            throw new Error('Invalid credentials.');
          } catch (error) {
            console.error('Authorize Error:', error);
            throw new Error('Login failed. Please check your credentials.');
          }
        }
        return null;
      }
    })
  ],
  secret: process.env.SECRET,
  pages: {
    signIn: '/' //sigin page
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
      return session;
    }
  }
} satisfies NextAuthConfig;

export default authConfig;
