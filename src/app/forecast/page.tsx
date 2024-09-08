/** @format */
"use client";
import Link from 'next/link'
import { ForecastWeatherDetail } from "@/components/Forecast";
import Navbar from "@/components/Navbar/Navbar";
import { convertWindSpeed } from "@/utils/convertWindSpeed";
import { metersToKilometers } from "@/utils/metersToKilometers";
import axios from "axios";
import { format, fromUnixTime, parseISO } from "date-fns";
import { useQuery } from "react-query";
import { placeAtom } from "../atom";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { WeatherData } from "../types/types";

export default function Forecast() {
	const [place] = useAtom(placeAtom);

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
	];

	const firstDataForEachDate = uniqueDates.map((date) => {
		return data?.list.find((entry) => {
			const entryDate = new Date(entry.dt * 1000).toISOString().split("T")[0];
			const entryTime = new Date(entry.dt * 1000).getHours();
			return entryDate === date && entryTime >= 6;
		});
	});

	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>An error occurred: {(error as Error).message}</div>;

	return (
		<div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
			<Navbar location={data?.city.name} />
			<main className="px-3 max-w-7xl mx-auto flex flex-col gap-2 w-full pt-4">
				<section className="flex w-full flex-col gap-4">
					<h2 className="text-2xl">7-Day Forecast</h2>
					{firstDataForEachDate.map((d, i) => (
						<ForecastWeatherDetail
							key={i}
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
				</section>
				<Link
					href="/"
					className="text-blue-500 hover:text-blue-600"
				>
				Page before 
				</Link>
			</main>
		</div>
	);
}
