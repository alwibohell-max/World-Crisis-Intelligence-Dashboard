"use client";
import dynamic from "next/dynamic";
import type { EarthquakeEvent, OSMInfrastructurePoint, SavedLocation, WeatherForecast } from "@/lib/types";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";

const LeafletMap = dynamic(() => import("./LeafletCrisisMap"), { ssr: false, loading: () => <div className="h-[520px] rounded-lg border p-5"><LoadingSkeleton lines={8} /></div> });
export function CrisisMap(props: { earthquakes?: EarthquakeEvent[]; forecasts?: WeatherForecast[]; infrastructure?: OSMInfrastructurePoint[]; savedLocations?: SavedLocation[] }) { return <LeafletMap {...props} />; }
