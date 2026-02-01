import STTClient from "./STTClient"

export default function STTPage() {
  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">
        🎙 Live Speech to Text
      </h1>
      <STTClient />
    </div>
  )
}
