'use client'

import { useState, useRef, useEffect } from 'react'
import { Persona, type PersonaState } from '@/components/ai-elements/persona'

import {
  Mic,
  Square,
  Loader2,
  Car,
  Navigation,
  ShieldCheck
} from 'lucide-react'

export default function VoiceSTT () {
  const [text, setText] = useState('Book a cab from Corrigo Park. To Airport.')
  const [personaState, setPersonaState] = useState<PersonaState>('idle')

  const [isInitializing, setIsInitializing] = useState(false)

  const socketRef = useRef<WebSocket | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const cachedToken = useRef<string | null>(null)

  useEffect(() => {
    return () => {
      recorderRef.current?.stop()
      socketRef.current?.close()
    }
  }, [])

 
  async function startSTT () {

    setIsInitializing(true)

    setText('')

    console.log('good to go',text);
    try {

      // its working ,actual after comment out

        // if (!cachedToken.current) {

        //   const res = await fetch("/api/deepgram/token");

        //   const { token } = await res.json();

        //   cachedToken.current = token;

        // }

        // const socket = new WebSocket(

        //   "wss://api.deepgram.com/v1/listen?model=nova-2&punctuate=true&interim_results=true",

        //   ["token", cachedToken.current!]

        // );

        // socketRef.current = socket;

        // socket.onopen = async () => {

        //   setPersonaState("listening");

        //   setIsInitializing(false);

        //   const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        //   const recorder = new MediaRecorder(stream, { mimeType: "audio/webm;codecs=opus" });

        //   recorderRef.current = recorder;

        //   recorder.ondataavailable = (e) => {

        //     if (socket.readyState === WebSocket.OPEN && e.data.size > 0) {

        //       socket.send(e.data);

        //     }

        //   };

        //   recorder.start(500);

        // };

        // socket.onmessage = (msg) => {

        //   const data = JSON.parse(msg.data);

        //   const transcript = data.channel?.alternatives?.[0]?.transcript;

        //   // Only append to text if the result is final to avoid duplication

        //   if (transcript && data.is_final) {

        //     setText((prev) => prev + " " + transcript);

        //   }

        // };

        // socket.onclose = () => setPersonaState("idle");

        // socket.onerror = () => {

        //   setPersonaState("asleep");

        //   setIsInitializing(false);

        // };
  setPersonaState("asleep");

          setIsInitializing(false);


    } catch (error) {

      console.error('Voice Error:', error)

      setPersonaState('asleep')

      setIsInitializing(false)

    }

  }



  function stopSTT () {
    console.log('Stopping STT...')

    setPersonaState('thinking')

    setTimeout(() => {
      setPersonaState('speaking')

      setTimeout(() => {
        setPersonaState('idle')
      }, 1000)
    }, 800)

    recorderRef.current?.stop()
    socketRef.current?.close()
  }

  return (
    <div className='min-h-screen bg-[#70709c] text-blue-200 flex flex-col items-center justify-center'>
      <div className='relative flex flex-col items-center gap-10'>
        <Persona
          state={personaState}
          variant='halo'
          className='size-[420px] '
        />

        {/* Loader Overlay */}
        {isInitializing && (
          <div className='absolute inset-0 flex items-center justify-center bg-black/30 rounded-[32px]'>
            <Loader2 className='size-14 animate-spin text-blue-400 opacity-60' />
          </div>
        )}

        {/* Transcript Box */}
        <div className='max-w-xl w-full bg-white/5 border border-white/10 rounded-[32px] p-6 text-center'>
          <p className='text-lg'>
            {text ||
              (isInitializing
                ? 'Initializing neural link...'
                : 'Waiting for your command...')}
          </p>
        </div>

        {/* Controls */}
        <div className='flex flex-column column-gap-2 '>
          <div className='text-red-50'>

            <span className='border-2  italic rounded-md px-3 py-1'>
            {personaState}
          </span>
          </div>
          <button
            onClick={() =>
              personaState === 'listening' ? stopSTT() : startSTT()
            }
            disabled={isInitializing}
            className={`flex items-center gap-3 px-10 py-5 rounded-[24px] font-bold text-lg transition-all active:scale-95 ${
              personaState === 'listening'
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-blue-600 hover:bg-blue-500'
            }`}
          >
            {personaState === 'listening' ? (
              <>
                <Square className='size-6' />
                I'm Done
              </>
            ) : (
              <>
                <Mic className='size-6' />
                Tap to Speak
              </>
            )}
          </button>
            
        </div>

        {/* Safety Footer */}
        <div className='mt-6 flex items-center gap-3 text-sm text-slate-400'>
          <ShieldCheck className='size-5 text-blue-400' />
          Verified rides protected by Voyage AI.
        </div>
      </div>
    </div>
  )
}
