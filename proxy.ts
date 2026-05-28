import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Define protected admin and debug routes
const isProtectedRoute = createRouteMatcher([
  '/admin(.*)',
  '/api/debug(.*)'
])

export default clerkMiddleware(async (auth, req) => {
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const isMock = !clerkKey || clerkKey === 'your_clerk_publishable_key_here' || (clerkKey && clerkKey.includes('mock-clerk'));

  if (isMock) {
    return;
  }

  if (isProtectedRoute(req)) {
    await auth.protect();
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for Clerk's auto-proxy path
    '/__clerk/(.*)',
    '/(api|trpc)(.*)',
  ],
}
