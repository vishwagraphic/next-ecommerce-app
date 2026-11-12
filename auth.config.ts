import type { NextAuthConfig } from "next-auth"
import { NextResponse } from "next/dist/server/web/spec-extension/response"

export const authConfig = {
  pages: {
    signIn: "/sign-in",
    signOut: "/sign-out",
    error: "/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [],
  callbacks: {
    authorized({ request, auth }: any) {
      const protectedPaths = [
        /\/shipping-address/,
        /\/payment-method/,
        /\/place-order/,
        /\/profile/,
        /\/user\/(.*)/,
        /\/order\/(.*)/,
        /\/admin/,
      ]
      const isProtectedPath = protectedPaths.some((path) => path.test(request.nextUrl.pathname))

      if (!auth && isProtectedPath) return false

      if (!request.cookies.get("sessionCartId")) {
        const response = NextResponse.next()
        response.cookies.set("sessionCartId", crypto.randomUUID())
        return response
      }

      return true
    },
  },
} satisfies NextAuthConfig