import { useEffect, useRef, useState } from "react";
import { useIssues } from "../hooks/useIssues";
import {
  APIProvider,
  Map,
  Marker,
  InfoWindow,
} from "@vis.gl/react-google-maps";

const STATUS_COLORS = {
  Reported: "#fbbf24",
  Verified: "#818cf8",
  "In Progress": "#22d3ee",
  Resolved: "#4ade80",
};

function createMarkerIcon(color) {
  return {
    path: "M 0 0 C -24 -12 -24 -48 0 -64 C 24 -48 24 -12 0 0 Z",
    fillColor: color,
    fillOpacity: 1,
    strokeColor: "#fff",
    strokeWeight: 2,
    scale: 0.8,
    anchor: { x: 0, y: 32 },
  };
}

function InnerMap({ validIssues }) {
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [map, setMap] = useState(null);
  const mapRef = useRef(null);

  const defaultCenter = { lat: 20.5937, lng: 78.9629 };
  const defaultZoom = 4;

  useEffect(() => {
    if (map && validIssues.length > 0 && window.google?.maps) {
      const bounds = new window.google.maps.LatLngBounds();
      validIssues.forEach((issue) => {
        bounds.extend({ lat: issue.latitude, lng: issue.longitude });
      });
      map.fitBounds(bounds, { padding: 50 });
    }
  }, [map, validIssues]);

  const center = validIssues[0]
    ? { lat: validIssues[0].latitude, lng: validIssues[0].longitude }
    : defaultCenter;

  return (
    <>
      <div className="glass rounded-2xl overflow-hidden" style={{ height: "600px" }}>
        <Map
          ref={(ref) => {
            mapRef.current = ref;
            if (ref) setMap(ref);
          }}
          defaultCenter={center}
          defaultZoom={defaultZoom}
          mapId="civiq-map"
          gestureHandling="cooperative"
          style={{ width: "100%", height: "100%" }}
          onIdle={() => {}}
          options={{
            styles: [
              { elementType: "geometry", stylers: [{ color: "#060609" }] },
              { elementType: "labels.text.stroke", stylers: [{ color: "#060609" }] },
              { elementType: "labels.text.fill", stylers: [{ color: "#ffffff" }] },
              {
                featureType: "road",
                elementType: "geometry",
                stylers: [{ color: "#1a1a2e" }],
              },
              {
                featureType: "road",
                elementType: "geometry.stroke",
                stylers: [{ color: "#2a2a4a" }],
              },
              {
                featureType: "road.local",
                elementType: "labels.text.fill",
                stylers: [{ color: "#888" }],
              },
              {
                featureType: "water",
                elementType: "geometry",
                stylers: [{ color: "#0d1b2a" }],
              },
              {
                featureType: "water",
                elementType: "labels.text.fill",
                stylers: [{ color: "#4a90d9" }],
              },
              {
                featureType: "landscape",
                elementType: "geometry",
                stylers: [{ color: "#0a0a0f" }],
              },
              {
                featureType: "poi",
                elementType: "geometry",
                stylers: [{ color: "#0f0f1a" }],
              },
              {
                featureType: "poi.park",
                elementType: "geometry",
                stylers: [{ color: "#1a2a1a" }],
              },
            ],
            disableDefaultUI: true,
            zoomControl: true,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
          }}
        >
          {validIssues.map((issue) => (
            <Marker
              key={issue.id}
              position={{ lat: issue.latitude, lng: issue.longitude }}
              title={issue.title}
              icon={createMarkerIcon(STATUS_COLORS[issue.status] || "#6366f1")}
              onClick={() => setSelectedIssue(issue)}
            />
          ))}

          {selectedIssue && (
            <InfoWindow
              position={{
                lat: selectedIssue.latitude,
                lng: selectedIssue.longitude,
              }}
              onCloseClick={() => setSelectedIssue(null)}
            >
              <div className="p-2 min-w-[240px] text-white">
                <h3 className="font-bold text-[14px] mb-1">{selectedIssue.title}</h3>
                <p className="text-[11px] text-white/60 mb-2">
                  <span className="font-medium text-white/80">{selectedIssue.category}</span>
                  {" • Severity: "}{selectedIssue.severity}/10
                </p>
                <p className="text-[11px] text-white/50 mb-2 line-clamp-2">
                  {selectedIssue.location}
                </p>
                <div className="flex items-center gap-2">
                  <span
                    className="pill text-[10px] px-2 py-1"
                    style={{
                      background: `${STATUS_COLORS[selectedIssue.status]}20`,
                      color: STATUS_COLORS[selectedIssue.status],
                      borderColor: `${STATUS_COLORS[selectedIssue.status]}40`,
                    }}
                  >
                    {selectedIssue.status}
                  </span>
                </div>
              </div>
            </InfoWindow>
          )}
        </Map>
      </div>

      {validIssues.length > 0 && (
        <div className="mt-6 glass rounded-2xl p-4">
          <p className="eyebrow mb-3">Issues on Map ({validIssues.length})</p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 max-h-48 overflow-y-auto">
            {validIssues.map((issue) => (
              <button
                key={issue.id}
                onClick={() => {
                  setSelectedIssue(issue);
                  if (mapRef.current) {
                    mapRef.current.panTo({
                      lat: issue.latitude,
                      lng: issue.longitude,
                    });
                    mapRef.current.setZoom(15);
                  }
                }}
                className="glass-hover p-3 rounded-xl text-left transition-all hover:border-violet/30"
                style={{
                  border: "0.5px solid rgba(255,255,255,0.06)",
                  background: selectedIssue?.id === issue.id
                    ? "rgba(99,102,241,0.1)"
                    : "rgba(255,255,255,0.02)",
                  borderColor:
                    selectedIssue?.id === issue.id
                      ? "rgba(99,102,241,0.3)"
                      : "rgba(255,255,255,0.06)",
                }}
              >
                <p className="font-semibold text-[12px] text-white line-clamp-1">
                  {issue.title}
                </p>
                <p className="text-[10px] text-white/40 mt-1 truncate">
                  {issue.location}
                </p>
                <div className="flex items-center gap-1.5 mt-2">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: STATUS_COLORS[issue.status] }}
                  />
                  <span className="text-[10px] text-white/60">
                    {issue.status}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default function MapView() {
  const { issues } = useIssues();

  const validIssues = issues.filter(
    (i) => i.latitude != null && i.longitude != null
  );

  if (!validIssues.length) {
    return (
      <div className="min-h-screen pt-[58px] relative z-10">
        <div className="max-w-4xl mx-auto px-6 py-14 text-center">
          <div className="glass rounded-2xl p-16">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                boxShadow: "0 0 40px rgba(99,102,241,0.4)",
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-white"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <h2 className="text-[22px] font-black tracking-tight mb-2">No Location Data</h2>
            <p className="text-[14px] text-white/35 mb-1">
              No issues with coordinates found yet.
            </p>
            <p className="text-[12px] text-white/20">
              Report issues with location to see them on the map.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[58px] relative z-10">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_KEY}>
          <InnerMap validIssues={validIssues} />
        </APIProvider>
      </div>
    </div>
  );
}