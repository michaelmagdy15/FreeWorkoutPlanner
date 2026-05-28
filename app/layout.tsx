import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { ClerkProvider } from '@clerk/nextjs';

export const metadata = {
  title: "Free Workout Planner",
  description: "Personalized health and fitness coaching with MCP tools",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Free Workout Planner",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const isMock = !clerkKey || clerkKey === 'your_clerk_publishable_key_here';
  
  // Use a valid format dummy test key to prevent ClerkProvider from throwing an error in development mock mode
  const publishableKey = isMock 
    ? 'pk_test_bW9jay1jbGVyay1rZXktOTk5LmNsZXJrLmFjY291bnRzLmRldiQ' 
    : clerkKey;

  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/assets/images/logo_icon.png" />
        <meta name="theme-color" content="#f97316" />
      </head>
      <body className="antialiased selection:bg-primary/30">
        <ClerkProvider publishableKey={publishableKey}>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}

