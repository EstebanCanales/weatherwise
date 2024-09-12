'use client'

import React, { useState, useRef, useEffect } from "react"
import { MdOutlineLocationOn, MdSearch } from "react-icons/md"
import { SearchBox } from "../SearchBox"
import Link from "next/link"
import Image from "next/image"
import axios from "axios"
import { loadingCityAtom, placeAtom } from "@/app/atom"
import { useAtom } from "jotai"
import { useDebounce } from "@/hooks/useDebounce"

type Props = { location?: string }

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_KEY

export default function Navbar({ location }: Props) {
  const [city, setCity] = useState("")
  const [error, setError] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [place, setPlace] = useAtom(placeAtom)
  const [_, setLoadingCity] = useAtom(loadingCityAtom)
  const suggestionBoxRef = useRef<HTMLDivElement>(null)

  const debouncedCity = useDebounce(city, 300)

  useEffect(() => {
    async function fetchSuggestions() {
      if (debouncedCity.length >= 3) {
        try {
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/find?q=${debouncedCity}&appid=${API_KEY}`
          )
          const suggestions = response.data.list.map((item: any) => item.name)
          setSuggestions(suggestions)
          setError("")
          setShowSuggestions(true)
        } catch (error) {
          setSuggestions([])
          setShowSuggestions(false)
          setError("Unable to fetch suggestions")
        }
      } else {
        setSuggestions([])
        setShowSuggestions(false)
      }
    }

    fetchSuggestions()
  }, [debouncedCity])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionBoxRef.current && !suggestionBoxRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  function handleInputChange(value: string) {
    setCity(value)
    if (value.length < 3) {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  function handleSuggestionClick(value: string) {
    setCity(value)
    setShowSuggestions(false)
    setPlace(value)
  }

  function handleSubmitSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoadingCity(true)
    if (city.length === 0) {
      setError("Please enter a location")
      setLoadingCity(false)
    } else {
      setError("")
      setTimeout(() => {
        setLoadingCity(false)
        setPlace(city)
        setShowSuggestions(false)
      }, 500)
    }
  }

  return (
    <>
      <nav className="sticky top-0 left-0 z-50 bg-white shadow-sm">
        <div className="h-20 w-full flex justify-between items-center max-w-7xl px-3 mx-auto">
          <Link href="/" className="flex items-center justify-center gap-2">
            <Image src="/WeatherWise.svg" alt="WeatherWise Logo" width={165} height={165} />
          </Link>
          <section className="flex gap-2 items-center">
            <MdOutlineLocationOn className="text-3xl text-blue-500" />
            <p className="text-slate-900/80 text-sm font-medium">{location}</p>
            <div className="relative hidden md:block">
              <SearchBox
                value={city}
                onSubmit={handleSubmitSearch}
                onChange={(e) => handleInputChange(e.target.value)}
              />
              <SuggestionBox
                showSuggestions={showSuggestions}
                suggestions={suggestions}
                handleSuggestionClick={handleSuggestionClick}
                error={error}
                ref={suggestionBoxRef}
              />
            </div>
          </section>
        </div>
      </nav>
      <section className="flex max-w-7xl px-3 md:hidden mt-2">
        <div className="relative w-full">
          <SearchBox
            value={city}
            onSubmit={handleSubmitSearch}
            onChange={(e) => handleInputChange(e.target.value)}
          />
          <SuggestionBox
            showSuggestions={showSuggestions}
            suggestions={suggestions}
            handleSuggestionClick={handleSuggestionClick}
            error={error}
            ref={suggestionBoxRef}
          />
        </div>
      </section>
    </>
  )
}

const SuggestionBox = React.forwardRef<
  HTMLDivElement,
  {
    showSuggestions: boolean
    suggestions: string[]
    handleSuggestionClick: (item: string) => void
    error: string
  }
>(({ showSuggestions, suggestions, handleSuggestionClick, error }, ref) => {
  return (
    <div ref={ref} className="absolute z-10 w-full">
      {((showSuggestions && suggestions.length > 0) || error) && (
        <ul className="bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
          {error && (
            <li className="text-red-500 p-2">{error}</li>
          )}
          {suggestions.map((item, i) => (
            <li
              key={i}
              onClick={() => handleSuggestionClick(item)}
              className="cursor-pointer p-2 hover:bg-gray-100 transition-colors duration-200"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
})

SuggestionBox.displayName = 'SuggestionBox'
