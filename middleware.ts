import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/api/mcp(.*)', // MCP standard routing
  '/api/chat(.*)', // AI chat coaching
  '/api/context(.*)', // Fallback local fetch context
  '/api/log(.*)', // Fallback logging endpoint
  '/api/plan(.*)', // Fallback plan generator
  '/manifest.json', // PWA manifest files
  '/sw.js', // PWA service workers
  '/assets/(.*)', // Illustrations and images
  '/favicon.ico',
]);

export default clerkMiddleware(async (auth, request) => {
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const isMock = !clerkKey || clerkKey === 'your_clerk_publishable_key_here';
  
  // If Clerk is not set up yet in development environment, bypass all routes
  if (isMock) {
    return;
  }

  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
