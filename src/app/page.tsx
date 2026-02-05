'use client'

import { Persona } from '@/components/ai-elements/persona'
import STTPage from './stt/page'
import STTClient from './stt/STTClient'
import { Car } from 'lucide-react'

export default function Home () {
  return (
    <>
    <div className='min-h-screen bg-[#545479] text-white-200 font-sans selection:bg-blue-500/30 overflow-x-hidden'>
        
          <STTClient />
      </div>
    </>
  )
}
