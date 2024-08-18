import Footer from '@/components/footer/Footer'
import type { Metadata } from 'next'
import '../styles/global.scss'

export const metadata: Metadata = {
  title: {
    default: 'RentHub',
    template: `%s | RentHub`
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <div className="wrapper">
          {children}
          <Footer />
        </div>
      </body>
    </html>
  )
}
