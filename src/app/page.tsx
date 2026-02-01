'use client'


import { Persona } from '@/components/ai-elements/persona'
import STTPage from './stt/page'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 text-gray-900">Voice Enabled Cab Booking</h1>
        <p className="text-xl text-gray-600">Book your ride with voice commands</p>
          <Persona state="listening" variant="halo" />

      </div>
      
      <STTPage />
    </main>
  )
}
