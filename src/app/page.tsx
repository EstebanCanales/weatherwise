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
import { useEffect } from "react";
import { useAtom } from "jotai";
import Link from "next/link";
import axios from "axios";

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

  console.log("data", data);

  if (isLoading)
    return (
      <div className="flex items-center min-h-screen justify-center">
        <div className="flex-col gap-4 w-full flex items-center justify-center">
          <div className="w-28 h-28 border-8 text-blue-400 text-4xl animate-spin border-gray-300 flex items-center justify-center border-t-blue-400 rounded-full">

          </div>
        </div>
      </div>
    );
  if (error)
    return (
      <div className="flex items-center min-h-screen justify-center">
        {/* @ts-ignore */}
        <p className="text-red-400">{error.message}</p>
      </div>
    );
  return (
    <div className="flex flex-col gap-4 bg-gray-100 min-h-screen ">
      <Navbar location={data?.city.name} />
      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-2  w-full  pb-10 pt-4 ">
        {loadingCity ? (
          <WeatherSkeleton />
        ) : (
          <>
            <section className="space-y-4 ">
			<div className="text-2xl md:text-4xl font-bold flex justify-center items-center">
                <h1 className="text-blue-500">
                  WeatherWise{" "}
                  <p className="text-black">
                    {" "}
                    The best app to find the weather.
                  </p>
                </h1>
              </div>
              <div className="w-full h-0.5 bg-blue-500"></div>
              <div className="space-y-2">
                <h2 className="flex gap-1 text-2xl  items-end ">
                  <p>{format(parseISO(firstData?.dt_txt ?? ""), "EEEE")}</p>
                  <p className="text-lg">
                    ({format(parseISO(firstData?.dt_txt ?? ""), "dd.MM.yyyy")})
                  </p>
                </h2>
                <Container className="gap-10 px-6 items-center">
                  {/* temperature */}
                  <div className=" flex flex-col px-4 ">
                    <span className="text-5xl">
                      {convertKelvinToCelsius(firstData?.main.temp ?? 296.37)}°
                    </span>
                    <p className="text-xs space-x-1 whitespace-nowrap">
                      <span> Feels like</span>
                      <span>
                        {convertKelvinToCelsius(
                          firstData?.main.feels_like ?? 0
                        )}
                        °
                      </span>
                    </p>
                    <p className="text-xs space-x-2">
                      <span>
                        {convertKelvinToCelsius(firstData?.main.temp_min ?? 0)}
                        °↓{" "}
                      </span>
                      <span>
                        {" "}
                        {convertKelvinToCelsius(firstData?.main.temp_max ?? 0)}
                        °↑
                      </span>
                    </p>
                  </div>
                  {/* time and weather icon */}
                  <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3">
                    {data?.list.map((d, i) => (
                      <div
                        key={i}
                        className="flex flex-col justify-between gap-2 items-center text-xs font-semibold "
                      >
                        <p className="whitespace-nowrap">
                          {format(parseISO(d.dt_txt), "h:mm a")}
                        </p>
                        <WeatherIcon
                          iconName={getDayOrNightIcon(
                            d.weather[0].icon,
                            d.dt_txt
                          )}
                        />
                        <p>{convertKelvinToCelsius(d?.main.temp ?? 0)}°</p>
                      </div>
                    ))}
                  </div>
                </Container>
              </div>
              <div className=" flex gap-4">
                {/* left */}
                <Container className="w-fit bg-blue-50 justify-center flex-col px-4 items-center ">
                  <p className=" capitalize text-center">
                    {firstData?.weather[0].description}{" "}
                  </p>
                  <WeatherIcon
                    iconName={getDayOrNightIcon(
                      firstData?.weather[0].icon ?? "",
                      firstData?.dt_txt ?? ""
                    )}
                  />
                </Container>
                <Container className="bg-blue-300/80  px-6 gap-4 justify-between overflow-x-auto">
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

            {/* Link to forecast page */}
            <Link
              href="/forecast"
              className="text-blue-500 hover:text-blue-600 mb-0.5 font-bold text-xl"
            >
              Forecast of the last 7 days
            </Link>
          </>
        )}
        <div className="w-full h-0.5 bg-blue-500"></div>
        <div className="flex justify-center items-center">
          <h2 className="text-3xl text-blue-500 font-bold mt-2">Developers</h2>
        </div>
        <div className="flex justify-center items-center flex-warp">
          <DevCard
            name={"Gabriel Chacon"}
            rol={"Web Developer"}
            src={"foto-chacon.jpeg"}
			link={
				"https://github.com/Chaconsio"
			}
          />
          <DevCard
            name={"Esteban Canales"}
            rol={"Web Developer"}
            src={"foto-esteban.jpeg"}
			link={"https://github.com/EstebanCanales"}
          />
        </div>
      </main>
    </div>
  );
}

function WeatherSkeleton() {
  return (
    <section className="space-y-8 ">
      {/* Today's data skeleton */}
      <div className="space-y-2 animate-pulse">
        {/* Date skeleton */}
        <div className="flex gap-1 text-2xl items-end ">
          <div className="h-6 w-24 bg-gray-300 rounded"></div>
          <div className="h-6 w-24 bg-gray-300 rounded"></div>
        </div>

        {/* Time wise temperature skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="flex flex-col items-center space-y-2">
              <div className="h-6 w-16 bg-gray-300 rounded"></div>
              <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
              <div className="h-6 w-16 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
