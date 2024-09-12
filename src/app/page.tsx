"use client";

import { convertKelvinToCelsius } from "@/utils/convertKelvinToCelsius";
import { metersToKilometers } from "@/utils/metersToKilometers";
import { getDayOrNightIcon } from "@/utils/getDayOrNightIcon";
import { WeatherDetails } from "@/components/WeatherDetails";
import { convertWindSpeed } from "@/utils/convertWindSpeed";
import { WeatherIcon } from "@/components/WeatherIcon";
import { loadingCityAtom, placeAtom } from "./atom";
import { Container } from "@/components/Container";
import DevCard from "@/components/DevCard/DevCard";
import { Navbar } from "@/components/Navbar";
import { format, parseISO } from "date-fns";
import { WeatherData } from "./types/types";
import { useQuery } from "react-query";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import Link from "next/link";
import axios from "axios";
import {
  Sun,
  Moon,
  CloudRain,
  Wind,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function Home() {
  const [place, setPlace] = useAtom(placeAtom);
  const [loadingCity] = useAtom(loadingCityAtom);

  const { isLoading, error, data, refetch } = useQuery<WeatherData>(
    "repoData",
    async () => {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`
      );
      return data;
    }
  );

  useEffect(() => {
    refetch();
  }, [place, refetch]);

  const firstData = data?.list[0];

  const developers = [
    {
      name: "Gabriel Chacon",
      role: "Web Developer",
      src: "foto-chacon.jpeg",
      link: "https://github.com/Chaconsio",
    },
    {
      name: "Esteban Canales",
      role: "Web Developer",
      src: "foto-esteban.jpeg",
      link: "https://github.com/EstebanCanales",
    },
  ];

  const [currentDev, setCurrentDev] = useState(0);

  const nextDev = () => {
    setCurrentDev((prev) => (prev + 1) % developers.length);
  };

  const prevDev = () => {
    setCurrentDev((prev) => (prev - 1 + developers.length) % developers.length);
  };

  if (isLoading)
    return (
      <div className="flex items-center min-h-screen justify-center">
        <div className="flex-col gap-4 w-full flex items-center justify-center">
          <div className="w-28 h-28 border-8 text-blue-400 text-4xl animate-spin border-gray-300 flex items-center justify-center border-t-blue-400 rounded-full"></div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center min-h-screen justify-center">
        <p className="text-red-400">{(error as Error).message}</p>
      </div>
    );

  return (
    <div className="flex flex-col gap-4 bg-gradient-to-br from-blue-100 to-blue-300 min-h-screen">
      <Navbar location={data?.city.name} />
      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-2 w-full pb-10 pt-4">
        {loadingCity ? (
          <WeatherSkeleton />
        ) : (
          <>
            <section className="space-y-4">
              <div className="text-2xl md:text-4xl font-bold flex justify-center items-center">
                <h1 className="text-blue-700 drop-shadow-md">
                  WeatherWise{" "}
                  <span className="text-gray-700">
                    The best app to find the weather.
                  </span>
                </h1>
              </div>
              <div className="w-full h-1 bg-gradient-to-r from-blue-400 to-blue-700 rounded-full shadow-md"></div>
              <div className="space-y-2">
                <h2 className="flex gap-1 text-2xl items-end text-gray-700">
                  <p>{format(parseISO(firstData?.dt_txt ?? ""), "EEEE")}</p>
                  <p className="text-lg">
                    ({format(parseISO(firstData?.dt_txt ?? ""), "dd.MM.yyyy")})
                  </p>
                </h2>
                <Container className="gap-10 px-6 items-center bg-white/80 backdrop-blur-sm rounded-xl shadow-lg">
                  <div className="flex flex-col px-4">
                    <span className="text-5xl font-bold text-blue-700">
                      {convertKelvinToCelsius(firstData?.main.temp ?? 296.37)}°
                    </span>
                    <p className="text-sm space-x-1 whitespace-nowrap">
                      <span>Feels like</span>
                      <span className="font-semibold">
                        {convertKelvinToCelsius(
                          firstData?.main.feels_like ?? 0
                        )}
                        °
                      </span>
                    </p>
                    <p className="text-sm space-x-2">
                      <span className="text-blue-600">
                        {convertKelvinToCelsius(firstData?.main.temp_min ?? 0)}
                        °↓
                      </span>
                      <span className="text-red-600">
                        {convertKelvinToCelsius(firstData?.main.temp_max ?? 0)}
                        °↑
                      </span>
                    </p>
                  </div>
                  <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3">
                    {data?.list.slice(0, 5).map((d, i) => (
                      <div
                        key={i}
                        className="flex flex-col justify-between gap-2 items-center text-xs font-semibold"
                      >
                        <p className="whitespace-nowrap">
                          {format(parseISO(d.dt_txt), "h:mm a")}
                        </p>
                        <WeatherIcon
                          iconName={getDayOrNightIcon(
                            d.weather[0].icon,
                            d.dt_txt
                          )}
                          className="w-10 h-10"
                        />
                        <p className="text-blue-700">
                          {convertKelvinToCelsius(d?.main.temp ?? 0)}°
                        </p>
                      </div>
                    ))}
                  </div>
                </Container>
              </div>
              <div className="flex gap-4">
                <Container className="w-fit bg-blue-400/30 backdrop-blur-sm rounded-xl shadow-lg justify-center flex-col px-4 items-center">
                  <p className="capitalize text-center text-blue-700 font-semibold">
                    {firstData?.weather[0].description}
                  </p>
                  <WeatherIcon
                    iconName={getDayOrNightIcon(
                      firstData?.weather[0].icon ?? "",
                      firstData?.dt_txt ?? ""
                    )}
                    className="w-20 h-20"
                  />
                </Container>
                <Container className="bg-blue-400/30 backdrop-blur-sm rounded-xl shadow-lg px-6 gap-4 justify-between overflow-x-auto">
                  <WeatherDetails
                    visability={metersToKilometers(
                      firstData?.visibility ?? 10000
                    )}
                    airPressure={`${firstData?.main.pressure} hPa`}
                    humidity={`${firstData?.main.humidity}%`}
                    sunrise={format(data?.city.sunrise ?? 1702949452, "H:mm")}
                    sunset={format(data?.city.sunset ?? 1702517657, "H:mm")}
                    windSpeed={convertWindSpeed(firstData?.wind.speed ?? 1.64)}
                  />
                </Container>
              </div>
            </section>

            <Link
              href="/forecast"
              className="text-blue-700 hover:text-blue-800 mb-0.5 font-bold text-xl transition-colors duration-200 flex items-center gap-2"
            >
              <CloudRain className="w-6 h-6" />
              Forecast of the next 6 days
            </Link>
          </>
        )}
        <div className="w-full h-1 bg-gradient-to-r from-blue-400 to-blue-700 rounded-full shadow-md mt-8"></div>
        <div className="flex justify-center items-center">
          <h2 className="text-3xl text-blue-700 font-bold mt-6 mb-4 drop-shadow-md">
            Our Team
          </h2>
        </div>
        <div className="flex justify-center items-center">
          <button
            onClick={prevDev}
            className="p-2 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition-colors duration-200"
            aria-label="Previous developer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="w-full max-w-sm mx-4">
            <DevCard
              name={developers[currentDev].name}
              rol={developers[currentDev].role as "Web Developer"}
              src={developers[currentDev].src}
              link={developers[currentDev].link}
            />
          </div>
          <button
            onClick={nextDev}
            className="p-2 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition-colors duration-200"
            aria-label="Next developer"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </main>
    </div>
  );
}

function WeatherSkeleton() {
  return (
    <section className="space-y-8 animate-pulse">
      <div className="space-y-2">
        <div className="flex gap-1 text-2xl items-end">
          <div className="h-6 w-24 bg-gray-300 rounded"></div>
          <div className="h-6 w-24 bg-gray-300 rounded"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="flex flex-col items-center space-y-2">
              <div className="h-6 w-16 bg-gray-300 rounded"></div>
              <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
              <div className="h-6 w-16 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
