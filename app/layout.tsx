export const metadata = {
  title: 'Domain Name Generator',
  description: 'Name Generator that uses Peter Thomsons communication framework to help you find the perfect domain name.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
