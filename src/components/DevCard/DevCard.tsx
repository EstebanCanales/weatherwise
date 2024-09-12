"use client"
import Image from 'next/image'
import Link from 'next/link'
import { Github } from 'lucide-react'

interface Props {
  name: string
  rol: "Web Developer"
  src: string
  link: string
}

export default function DevCard({ src, rol, name, link }: Props) {
  return (
    <Link href={link} passHref legacyBehavior>
      <a className="block" target="_blank" rel="noopener noreferrer">
        <div className="group mx-3 mt-3 w-80 h-96 relative bg-slate-50 flex flex-col items-center justify-center gap-2 text-center rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-bl from-sky-200 via-blue-200 to-blue-700 transition-all duration-500 group-hover:scale-95 group-hover:rounded-b-2xl" />
          <div className="relative z-10 flex flex-col items-center transition-all duration-500 group-hover:-translate-y-10">
            <div className="w-32 h-32 mt-8 rounded-full border-4 border-slate-50 overflow-hidden transition-all duration-500 group-hover:scale-150 group-hover:-translate-x-24 group-hover:-translate-y-20">
              <Image
                src={`/${src}`}
                alt={`Portrait of ${name}`}
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-4 text-slate-800">
              <h2 className="text-2xl font-semibold">{name}</h2>
              <p className="text-lg">{rol}</p>
            </div>
          </div>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500">
            <span className="inline-flex items-center px-2 py-2 bg-blue-600 text-white rounded-full">
              <Github className="w-5 h-5 mr-2" />
              GitHub Profile
            </span>
          </div>
        </div>
      </a>
    </Link>
  )
}
