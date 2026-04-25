"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";

// Fix Leaflet default icon paths broken by webpack
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// ── Sri Lanka city → [lat, lng] ────────────────────────────────
const SL_CITIES: Record<string, [number, number]> = {
    colombo:       [6.9271,  79.8612],
    "fort":        [6.9344,  79.8428],
    galle:         [6.0535,  80.2210],
    kandy:         [7.2906,  80.6337],
    ella:          [6.8667,  81.0467],
    nuwara:        [6.9497,  80.7891],
    "nuwara eliya":[6.9497,  80.7891],
    sigiriya:      [7.9570,  80.7603],
    anuradhapura:  [8.3114,  80.4037],
    polonnaruwa:   [7.9403,  81.0188],
    trincomalee:   [8.5874,  81.2152],
    batticaloa:    [7.7167,  81.7000],
    jaffna:        [9.6615,  80.0255],
    matara:        [5.9485,  80.5353],
    negombo:       [7.2083,  79.8358],
    bentota:       [6.4244,  79.9967],
    hikkaduwa:     [6.1395,  80.1054],
    mirissa:       [5.9483,  80.4716],
    tangalle:      [6.0244,  80.7967],
    unawatuna:     [6.0100,  80.2492],
    arugam:        [6.8406,  81.8358],
    "arugam bay":  [6.8406,  81.8358],
    dambulla:      [7.8742,  80.6511],
    pinnawala:     [7.3000,  80.3833],
    horton:        [6.8024,  80.8047],
    yala:          [6.3667,  81.5167],
    minneriya:     [8.0333,  80.8667],
    pettah:        [6.9396,  79.8513],
    mount:         [6.9022,  80.5000],
    "mount lavinia":[6.8361, 79.8636],
};

export function cityToCoords(location: string): [number, number] {
    const loc = location.toLowerCase().trim();
    for (const [key, coords] of Object.entries(SL_CITIES)) {
        if (loc.includes(key)) return coords;
    }
    // Default: centre of Sri Lanka
    return [7.8731, 80.7718];
}

// Custom marker icons
function makeIcon(color: "green" | "blue") {
    const svg = encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
            <path d="M14 0C6.268 0 0 6.268 0 14c0 9.333 14 22 14 22S28 23.333 28 14C28 6.268 21.732 0 14 0z"
                fill="${color === "blue" ? "#0ea5e9" : "#10b981"}" />
            <circle cx="14" cy="14" r="6" fill="white" />
        </svg>
    `);
    return L.icon({
        iconUrl: `data:image/svg+xml,${svg}`,
        iconSize: [28, 36],
        iconAnchor: [14, 36],
        popupAnchor: [0, -36],
    });
}

// Sub-component: smoothly pans the map when focusCoords changes
function MapFocus({ coords }: { coords: [number, number] }) {
    const map = useMap();
    const prev = useRef<[number, number] | null>(null);

    useEffect(() => {
        if (
            prev.current &&
            prev.current[0] === coords[0] &&
            prev.current[1] === coords[1]
        ) return;
        map.flyTo(coords, 13, { duration: 0.8 });
        prev.current = coords;
    }, [coords, map]);

    return null;
}

// ── Types ─────────────────────────────────────────────────────
export interface GigMapItem {
    id: string;
    title: string;
    price: number;
    location: string | null;
    category: string | null;
}

interface GigMapProps {
    gigs: GigMapItem[];
    focusedId: string | null;
    onMarkerClick: (id: string) => void;
}

export default function GigMap({ gigs, focusedId, onMarkerClick }: GigMapProps) {
    const focusedGig = gigs.find(g => g.id === focusedId);
    const focusCoords: [number, number] = focusedGig?.location
        ? cityToCoords(focusedGig.location)
        : [7.8731, 80.7718];

    return (
        <MapContainer
            center={[7.8731, 80.7718]}
            zoom={8}
            className="w-full h-full z-0"
            scrollWheelZoom
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />

            <MapFocus coords={focusCoords} />

            {gigs.map(gig => {
                const coords = cityToCoords(gig.location ?? "");
                const isFocused = gig.id === focusedId;
                return (
                    <Marker
                        key={gig.id}
                        position={coords}
                        icon={makeIcon(isFocused ? "blue" : "green")}
                        eventHandlers={{ click: () => onMarkerClick(gig.id) }}
                        zIndexOffset={isFocused ? 1000 : 0}
                    >
                        <Popup>
                            <div className="min-w-[160px]">
                                <p className="font-bold text-slate-800 text-sm leading-snug mb-1">{gig.title}</p>
                                <p className="text-xs text-slate-500 mb-2">{gig.location ?? "Sri Lanka"}</p>
                                <p className="text-xs font-black text-emerald-600 mb-2">
                                    LKR {gig.price.toLocaleString("en-LK")}
                                </p>
                                <Link
                                    href={`/gig/${gig.id}`}
                                    className="block text-center text-[11px] font-bold text-white bg-emerald-500 hover:bg-emerald-600 py-1.5 px-3 rounded-lg transition-colors"
                                >
                                    View Gig
                                </Link>
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
}
