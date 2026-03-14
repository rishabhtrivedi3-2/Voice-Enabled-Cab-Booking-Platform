'use client'

import { useState, useRef, useEffect } from 'react'
import { Persona, type PersonaState } from '@/components/ai-elements/persona'
import { useLocation } from '@/components/context/location-context'
import {
  Mic,
  Square,
  Loader2,
  Car,
  Navigation,
  ShieldCheck
} from 'lucide-react'

export default function VoiceSTT () {
  const [text, setText] = useState('book a cab from Koregaon Park to airport') // have to change for real
  const [personaState, setPersonaState] = useState<PersonaState>('idle')
  const [isInitializing, setIsInitializing] = useState(false)
  const location = useLocation()
  const socketRef = useRef<WebSocket | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const cachedToken = useRef<string | null>(null)
  const [err, setError] = useState(null)
  const transcriptRef = useRef<string>('')
function convertFloat32ToInt16(buffer: Float32Array) {
  const l = buffer.length;
  const buf = new Int16Array(l);

  for (let i = 0; i < l; i++) {
    buf[i] = Math.max(-1, Math.min(1, buffer[i])) * 0x7fff;
  }

  return buf.buffer;
}

  useEffect(() => {
    return () => {
      recorderRef.current?.stop()
      socketRef.current?.close()
    }
  }, [])

  async function startSTT () {
    setIsInitializing(true)
    transcriptRef.current = '' // Reset transcript ref
    setText('') // Reset text state

    console.log('good to go', text)
    console.log('go', location)
    //mock token
    if (process.env.NEXT_PUBLIC_MOCK_TOKEN === 'true') {

  try {
    console.log('Mock token mode enabled. Simulating API calls...')
             const response=await fetch('/api/ride-flow',{
                method:'POST',
                headers: {
                  'Content-Type': 'application/json'  
                },
                body: JSON.stringify({
                  sentence: "book a cab from Koregaon Park to airport",
                  userLocation: location,
                })
              }
              
            )
            setIsInitializing(false)
            const data = await response.json();
            console.log('Ride Flow Response:', data)
            try{
                if (data.success && data.result.tssData) {
                  const audio = new Audio(data.result.tssData);
                  audio.play().catch(err=>console.error('Error playing audio:', err));
                  
                }
              }catch(err){
                console.error('Error playing audio:', err)  
            }
          }
          
            catch (error) {
              setError(error.message || 'An error occurred during STT initialization.')
              console.error('Voice Error:', error)
              setPersonaState('asleep')
              setIsInitializing(false)
            }
  }
    else{

      try {
        // STT ,its working ,actual after comment out
        console.log("actual mode")
        // transcriptRef.current = 'book a cab from Koregaon Park to airport' // Reset transcript ref
      if (!cachedToken.current) {
        const res = await fetch('/api/deepgram/token')

        const { token } = await res.json()

        cachedToken.current = token
      }
      try {
        const socket = new WebSocket(
          'wss://api.deepgram.com/v1/listen?model=nova-2&punctuate=true&interim_results=true&encoding=linear16&sample_rate=16000',

          ['token', cachedToken.current!]
        )

        socketRef.current = socket

        socket.onopen = async () => {
          setPersonaState('listening')

          setIsInitializing(false)
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: true
          })

          const audioContext = new AudioContext({ sampleRate: 16000 })

          const source = audioContext.createMediaStreamSource(stream)

          const processor = audioContext.createScriptProcessor(4096, 1, 1)

          source.connect(processor)
          processor.connect(audioContext.destination)

          processor.onaudioprocess = e => {
            const input = e.inputBuffer.getChannelData(0)

            const pcmData = convertFloat32ToInt16(input)

            if (socket.readyState === WebSocket.OPEN) {
              socket.send(pcmData)
            }
          }
        }

        socket.onerror = err => {
          console.error('WebSocket error:', err)
          setPersonaState('asleep')
          setIsInitializing(false)
        }

        socket.onmessage = msg => {
          const data = JSON.parse(msg.data)

          const transcript = data.channel?.alternatives?.[0]?.transcript
          console.log('Received message:', transcript && data.is_final)
          // setText("book a cab from Koregaon Park to airport")
          // transcriptRef.current = "book a cab from Koregaon Park to airport"
          // Only append to text if the result is final to avoid duplication
          if (transcript && data.is_final) {
            const newTranscript = transcriptRef.current + ' ' + transcript
            transcriptRef.current = newTranscript
            setText(newTranscript)
          }
          else if (!transcript && !data.is_final) {
            setError('No speech detected. Please try again.')
          }
          console.log('Transcript:', transcript, 'Is Final:', data.is_final, 'text:', transcriptRef.current);
        }

        socket.onclose = async () => {
          setPersonaState('idle')
          
          // Trigger POST requests after transcript is received and socket closes
          if (location && transcriptRef.current) {
            console.log('Final Transcript for Intent Extraction:', transcriptRef.current)
            try{
              const response=await fetch('/api/ride-flow',{
                method:'POST',
                headers: {
                  'Content-Type': 'application/json'  
                },
                body: JSON.stringify({
                  sentence: transcriptRef.current,
                  userLocation: location,
                })
              })
              
              const data = await response.json();
            console.log('Ride Flow Response:', data)
            try{
                if (data.success && data.result.tssData) {
                  const audio = new Audio(data.result.tssData);
                  audio.play().catch(err=>console.error('Error playing audio:', err));
                  
                }
              }catch(err){
                console.error('Error playing audio:', err)  
            }
          }
            catch (error) {
              setError(error.message || 'An error occurred during STT initialization.')
              console.error('Voice Error:', error.message)
              
              setPersonaState('asleep')
              
              setIsInitializing(false)
            }
          }
        }
      }catch(err){
        setError(err.message || 'An error occurred during STT initialization.')
        console.error('Voice Error:', err)
      }
    }catch(err){

    }
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
    <div className='min-h-screen bg-[#34343f] text-blue-200 flex flex-col items-center justify-center'>
      <div className='relative flex flex-col items-center gap-10'>
        <div>{err && <p className='text-red-500 '>{err}</p>}</div>
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
            className={`flex items-center gap-3 px-10 py-5 rounded-[24px] font-bold text-lg transition-all active:scale-95 border border-white/30 backdrop-blur-xl shadow-xl group/btn hover:bg-white-500 ${
              personaState === 'listening'
                ? 'bg-red-500/60 hover:bg-red-600/70'
                : 'bg-blue-600/60 hover:bg-blue-500/70'
            }before:absolute before:inset-0 before:bg-linear-to-br before:from-white/20 before:to-transparent before:opacity-50 before:pointer-events-none`}
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
        <div className='mt-6 flex items-center gap-3 text-sm text-slate-400px-4 py-2 bg-white/5 backdrop-blur-lg'>
          <ShieldCheck className='size-5 text-blue-400' />
          Verified rides protected by Voyage AI.
        </div>
      </div>
    </div>
  )
}
