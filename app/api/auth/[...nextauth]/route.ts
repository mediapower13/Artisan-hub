import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { supabaseAdmin } from "@/lib/supabase"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }: any) {
      if (session?.user?.email) {
        // Get user details from Supabase
        const { data: user } = await supabaseAdmin
          .from('users')
          .select('id, role, first_name, last_name, student_id, department, level, phone')
          .eq('email', session.user.email)
          .single()
        
        if (user) {
          session.user.id = user.id
          session.user.role = user.role
          session.user.firstName = user.first_name
          session.user.lastName = user.last_name
          session.user.studentId = user.student_id
          session.user.department = user.department
          session.user.level = user.level
          session.user.phone = user.phone
        }
      }
      return session
    },
    async signIn({ user, account, profile }: any) {
      if (account?.provider === "google") {
        try {
          // Check if user already exists
          const { data: existingUser } = await supabaseAdmin
            .from('users')
            .select('id, email')
            .eq('email', user.email)
            .single()

          if (!existingUser) {
            // Create new user with Google info
            const firstName = profile?.given_name || user.name?.split(' ')[0] || ''
            const lastName = profile?.family_name || user.name?.split(' ').slice(1).join(' ') || ''
            
            await supabaseAdmin
              .from('users')
              .insert([{
                email: user.email,
                first_name: firstName,
                last_name: lastName,
                full_name: user.name || `${firstName} ${lastName}`,
                role: 'student', // Default role for Google signups
                password: 'google_oauth', // Placeholder for OAuth users
              }])
          }
          
          return true
        } catch (error) {
          console.error("Error during Google sign in:", error)
          return false
        }
      }
      return true
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt' as const,
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
