import NextAuth from "next-auth"
import GoogleAuthProvider from "next-auth/providers/google"

const handler = NextAuth({
    providers: [GoogleAuthProvider({
        clientId: process.env.NEXTAUTH_GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.NEXTAUTH_GOOGLE_CLIENT_SECRET as string,
    })],
    secret: process.env.NEXTAUTH_SECRET as string,
    session: {
        maxAge: 10 * 24 * 60 * 60,
        // generateSessionToken
    },
    // pages: {
    //     signIn: '/auth/signin',
    //     signOut: '/auth/signout',
    //     error: '/auth/error', // Error code passed in query string as ?error=
    //     verifyRequest: '/auth/verify-request', // (used for check email message)
    //     newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
    // },
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            console.log(user, account, profile, "SIGN IN")
            return true
        },
        async redirect({ url, baseUrl }) {
            return baseUrl
        },
        async session({ session, token, user }) {
            return session
        },
        async jwt({ token, user, account, profile, isNewUser }) {
            return token
        }
    }


})

export {handler as GET, handler as POST}