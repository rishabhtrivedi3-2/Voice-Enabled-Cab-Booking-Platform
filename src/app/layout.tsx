import type { Metadata } from 'next'
import './globals.css'
import { LocationProvider } from '@/components/context/location-context'
export const metadata: Metadata = {
  title: 'Voice Enabled Cab Booking',
  description: 'Book cabs using voice commands',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <LocationProvider>
        {children}
        </LocationProvider>
        </body>
    </html>
  )
}
