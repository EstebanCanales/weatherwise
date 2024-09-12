"use client";

import Link from "next/link";
import { ForecastWeatherDetail } from "@/components/Forecast";
import Navbar from "@/components/Navbar/Navbar";
import { convertWindSpeed } from "@/utils/convertWindSpeed";
import { metersToKilometers } from "@/utils/metersToKilometers";
import { convertKelvinToCelsius } from "@/utils/convertKelvinToCelsius";
import axios from "axios";
import { format, fromUnixTime, parseISO } from "date-fns";
import { useQuery } from "react-query";
import { placeAtom } from "../atom";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { WeatherData } from "../types/types";
import {
  ArrowLeft,
  Loader2,
  Thermometer,
  Droplets,
  Sun,
  Wind,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { IoSpeedometer } from "react-icons/io5";

export default function Forecast() {
  const [place] = useAtom(placeAtom);
  const [selectedMetric, setSelectedMetric] = useState<
    "temperature" | "humidity" | "windSpeed"
  >("temperature");

  const { isLoading, error, data, refetch } = useQuery<WeatherData>(
    "forecastData",
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

  const uniqueDates = [
    ...new Set(
      data?.list.map(
        (entry) => new Date(entry.dt * 1000).toISOString().split("T")[0]
      )
    ),
  ].slice(0, 6); // Limit to 6 days

  const firstDataForEachDate = uniqueDates.map((date) => {
    return data?.list.find((entry) => {
      const entryDate = new Date(entry.dt * 1000).toISOString().split("T")[0];
      const entryTime = new Date(entry.dt * 1000).getHours();
      return entryDate === date && entryTime >= 6;
    });
  });

  const chartData = data?.list.map((item) => ({
    time: format(parseISO(item.dt_txt), "dd MMM HH:mm"),
    temperature: Number(convertKelvinToCelsius(item.main.temp)),
    humidity: item.main.humidity,
    windSpeed: Number(convertWindSpeed(item.wind.speed).split(" ")[0]), // Extract numeric value
  }));

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
        <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-500">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p className="text-red-500 text-xl">
            An error occurred: {(error as Error).message}
          </p>
          <Link
            href="/"
            className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col gap-4 bg-gradient-to-br from-blue-100  to-blue-300 min-h-screen">
      <Navbar location={data?.city.name} />
      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-6 w-full pt-4 pb-8">
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-800 mb-2 sm:mb-4">
            6-Day Forecast for {data?.city.name}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mb-1 sm:mb-2">
            Latitude: {data?.city.coord.lat}°, Longitude: {data?.city.coord.lon}
            °
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-blue-700 mb-4">
            Weather Trend
          </h2>
          <div className="flex flex-wrap gap-2 sm:gap-4 mb-4">
            <button
              onClick={() => setSelectedMetric("temperature")}
              className={`px-3 py-1 sm:px-4 sm:py-2 rounded text-sm sm:text-base ${
                selectedMetric === "temperature"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              <Thermometer className="inline-block mr-1 sm:mr-2 w-4 h-4 sm:w-5 sm:h-5" />
              Temperature
            </button>
            <button
              onClick={() => setSelectedMetric("humidity")}
              className={`px-3 py-1 sm:px-4 sm:py-2 rounded text-sm sm:text-base ${
                selectedMetric === "humidity"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              <Droplets className="inline-block mr-1 sm:mr-2 w-4 h-4 sm:w-5 sm:h-5" />
              Humidity
            </button>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="5 5" />
                <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey={selectedMetric}
                  stroke="#8884d8"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-blue-700 mb-4">
            Daily Forecast
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {firstDataForEachDate.map((d, index) => (
              <ForecastWeatherDetail
                key={index}
                description={d?.weather[0].description ?? ""}
                weatehrIcon={d?.weather[0].icon ?? "01d"}
                date={d ? format(parseISO(d.dt_txt), "dd.MM") : ""}
                day={d ? format(parseISO(d.dt_txt), "EEEE") : ""}
                feels_like={d?.main.feels_like ?? 0}
                temp={d?.main.temp ?? 0}
                temp_max={d?.main.temp_max ?? 0}
                temp_min={d?.main.temp_min ?? 0}
                airPressure={`${d?.main.pressure} hPa`}
                humidity={`${d?.main.humidity}%`}
                sunrise={format(
                  fromUnixTime(data?.city.sunrise ?? 1702517657),
                  "H:mm"
                )}
                sunset={format(
                  fromUnixTime(data?.city.sunset ?? 1702517657),
                  "H:mm"
                )}
                visability={`${metersToKilometers(d?.visibility ?? 10000)}`}
                windSpeed={`${convertWindSpeed(d?.wind.speed ?? 1.64)}`}
              />
            ))}
          </div>
        </div>


        <Link
          href="/"
					className="text-blue-700 hover:text-blue-800 font-bold text-xl transition-colors duration-200 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          Back to Home
        </Link>
      </main>
    </div>
  );
}
