export default function EmbedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div data-embed-root className="h-full w-full bg-transparent">
      {children}
    </div>
  );
}
