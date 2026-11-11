"use client";

import { useEffect, useEffectEvent, useRef } from "react";
import type { Map as MapLibreMap, Marker as MapLibreMarker } from "maplibre-gl";

const TILE_URL =
  process.env.NEXT_PUBLIC_MAP_TILE_URL ||
  "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

const MAP_STYLE = {
  version: 8 as const,
  sources: {
    osm: {
      type: "raster" as const,
      tiles: [TILE_URL],
      tileSize: 256,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    },
  },
  layers: [{ id: "osm", type: "raster" as const, source: "osm" }],
};

type Coordinate = { latitude: number; longitude: number } | null;

type RasterMapProps = {
  center: { latitude: number; longitude: number };
  zoom: number;
  marker?: Coordinate;
  interactive?: boolean;
  onLocationChange?: (latitude: number, longitude: number) => void;
  className?: string;
};

export default function RasterMap({
  center,
  zoom,
  marker = null,
  interactive = true,
  onLocationChange,
  className,
}: RasterMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialViewRef = useRef({ center, zoom });
  const mapRef = useRef<MapLibreMap | null>(null);
  const markerRef = useRef<MapLibreMarker | null>(null);
  const getMarkerPosition = useEffectEvent(() => marker);
  const notifyLocationChange = useEffectEvent((latitude: number, longitude: number) => {
    onLocationChange?.(latitude, longitude);
  });

  useEffect(() => {
    let disposed = false;

    void import("maplibre-gl").then((maplibregl) => {
      if (disposed || !containerRef.current) return;

      const map = new maplibregl.Map({
        container: containerRef.current,
        style: MAP_STYLE,
        center: [initialViewRef.current.center.longitude, initialViewRef.current.center.latitude],
        zoom: initialViewRef.current.zoom,
        interactive,
        scrollZoom: false,
      });
      mapRef.current = map;

      if (interactive) {
        map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
        map.on("click", (event) => {
          notifyLocationChange(event.lngLat.lat, event.lngLat.lng);
        });
      }

      const position = getMarkerPosition();
      if (position) {
        markerRef.current = new maplibregl.Marker()
          .setLngLat([position.longitude, position.latitude])
          .addTo(map);
      }
    });

    return () => {
      disposed = true;
      markerRef.current?.remove();
      markerRef.current = null;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [interactive]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (!marker) {
      markerRef.current?.remove();
      markerRef.current = null;
      return;
    }

    if (markerRef.current) {
      markerRef.current.setLngLat([marker.longitude, marker.latitude]);
      return;
    }

    void import("maplibre-gl").then((maplibregl) => {
      const currentMap = mapRef.current;
      const currentMarker = getMarkerPosition();
      if (!currentMap || markerRef.current || !currentMarker) return;
      markerRef.current = new maplibregl.Marker()
        .setLngLat([currentMarker.longitude, currentMarker.latitude])
        .addTo(currentMap);
    });
  }, [marker]);

  return <div ref={containerRef} className={className} style={{ width: "100%", height: "100%" }} />;
}
