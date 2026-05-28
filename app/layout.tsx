import './globals.css';

export const metadata = {
  title: "Health & Fitness Coach MCP",
  description: "Personalized health and fitness coaching with MCP tools",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
