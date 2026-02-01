# Voice Enabled Cab Booking

A modern Next.js application for booking cabs using voice commands, built with TypeScript, Tailwind CSS, and shadcn/ui components.

## Features

- Voice-enabled booking interface
- Built with Next.js 16 and React 19
- Tailwind CSS for styling
- shadcn/ui component library
- TypeScript support
- ESLint configuration

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Build

```bash
npm run build
npm run start
```

### Linting

```bash
npm run lint
```

## Project Structure

```
├── app/              # Next.js app directory
│   ├── layout.tsx    # Root layout
│   ├── page.tsx      # Home page
│   └── globals.css   # Global styles
├── components/       # React components
│   ├── ui/          # UI components (shadcn/ui style)
│   └── voice-input.tsx # Voice input component
├── public/          # Static files
├── tailwind.config.js # Tailwind configuration
└── tsconfig.json    # TypeScript configuration
```

## Technologies Used

- **Next.js** - React framework for production
- **React** - JavaScript library for building UI
- **TypeScript** - Typed JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components

## License

ISC
