'use client'

import { useState, useRef, useEffect } from 'react'
import { Persona, type PersonaState } from '@/components/ai-elements/persona'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from '@/components/ui/tooltip'
import { MicIcon, SquareIcon, Loader2Icon } from 'lucide-react'

export default function VoiceSTT () {
  const [text, setText] = useState('')
  const [personaState, setPersonaState] = useState<PersonaState>('idle')
  const [isInitializing, setIsInitializing] = useState(false)

  const socketRef = useRef<WebSocket | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const cachedToken = useRef<string | null>(null)

  // Clean up resources on unmount (Crucial for Amazon-level code quality)
  useEffect(() => {
    return () => {
      recorderRef.current?.stop()
      socketRef.current?.close()
    }
  }, [])

  async function startSTT () {
    setIsInitializing(true)
    setText('')

    try {
      //   if (!cachedToken.current) {
      //     const res = await fetch("/api/deepgram/token");
      //     const { token } = await res.json();
      //     cachedToken.current = token;
      //   }
      //   const socket = new WebSocket(
      //     "wss://api.deepgram.com/v1/listen?model=nova-2&punctuate=true&interim_results=true",
      //     ["token", cachedToken.current!]
      //   );
      //   socketRef.current = socket;
      //   socket.onopen = async () => {
      //     setPersonaState("listening");
      //     setIsInitializing(false);
      //     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      //     const recorder = new MediaRecorder(stream, { mimeType: "audio/webm;codecs=opus" });
      //     recorderRef.current = recorder;
      //     recorder.ondataavailable = (e) => {
      //       if (socket.readyState === WebSocket.OPEN && e.data.size > 0) {
      //         socket.send(e.data);
      //       }
      //     };
      //     recorder.start(500);
      //   };
      //   socket.onmessage = (msg) => {
      //     const data = JSON.parse(msg.data);
      //     const transcript = data.channel?.alternatives?.[0]?.transcript;
      //     // Only append to text if the result is final to avoid duplication
      //     if (transcript && data.is_final) {
      //       setText((prev) => prev + " " + transcript);
      //     }
      //   };
      //   socket.onclose = () => setPersonaState("idle");
      //   socket.onerror = () => {
      //     setPersonaState("asleep");
      //     setIsInitializing(false);
      //   };
    } catch (error) {
      console.error('Voice Error:', error)
      setPersonaState('asleep')
      setIsInitializing(false)
    }
  }

  function stopSTT () {
    setPersonaState('thinking')
    recorderRef.current?.stop()
    socketRef.current?.close()
    // Brief delay to show 'thinking' state before returning to idle
    setTimeout(() => setPersonaState('idle'), 1000)
  }

  return (
    <>
      <TooltipProvider>
        <div className='flex flex-col items-center justify-center gap-12 p-8 min-h-[400px]'>
          {/* Visual Persona State Display */}
          <div className='relative'>
            {isInitializing && (
                <div className='absolute inset-0 flex items-center justify-center'>
                  <Persona className='size-100' state="speaking" variant='halo' />
                <Loader2Icon className='size-8 animate-spin text-white/50' />
              </div>
            )}
          </div>

          {/* User Controls */}
          <div className='flex flex-col items-center gap-6 w-full max-w-md'>
            <div className='flex items-center gap-4 bg-background/80 backdrop-blur-md p-2 rounded-2xl border shadow-2xl'>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={personaState === 'listening' ? stopSTT : startSTT}
                    disabled={isInitializing}
                    size='icon'
                    variant={
                      personaState === 'listening' ? 'destructive' : 'default'
                    }
                    className='size-12 rounded-xl transition-all duration-300'
                  >
                    {personaState === 'listening' ? (
                      <SquareIcon className='size-6 fill-current' />
                    ) : (
                      <MicIcon className='size-6' />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side='bottom'>
                  <p>
                    {personaState === 'listening'
                      ? 'Stop AI'
                      : 'Start Listening'}
                  </p>
                </TooltipContent>
              </Tooltip>

              {/* Horizontal Divider */}
              <div className='h-8 w-1px bg-border mx-2' />

              <p className='pr-4 text-xs font-mono uppercase tracking-widest text-muted-foreground italic'>
                {personaState}
              </p>
            </div>

            {/* Transcript Output Window */}
            <div className='w-full bg-black/20 rounded-2xl p-6 border border-white/5 min-h-[120px] shadow-inner'>
              <p className='text-sm leading-relaxed text-slate-300 font-medium italic'>
                {text ||
                  (isInitializing ? 'Connecting...' : 'Awaiting your voice...')}
              </p>
            </div>
          </div>
        </div>
      </TooltipProvider>
    </>
  )
}
