'use client'

import { Persona } from '@/components/ai-elements/persona'
import STTPage from './stt/page'
import STTClient from './stt/STTClient'
import { Car, MapPin } from 'lucide-react'
import { useLocation } from '@/components/context/location-context'
export default function Home () {
  const location=useLocation();
  return (
    <>
      <div className='min-h-screen bg-[#34343f] text-white-200 font-sans selection:bg-blue-500/30 overflow-x-hidden'>
        <div className='flex justify-center items-center h-full'>
          <p className='cursor typewriter-animation'>
            Hi there, I'm a Typewriter Animation made in pure CSS!
          </p>
        </div>
        <div>
          {location && (
            <div className='flex items-center gap-2 text-blue-300 justify-center mb-6'>
              <MapPin className='size-5' /> 
              <span>
{location.city}, {location.country}
              </span>
            </div>  
)}
        </div>
        <STTClient />
      </div>
    </>
  )
}
