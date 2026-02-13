"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import { GoogleMap, Polygon, DrawingManager, useJsApiLoader, Marker } from "@react-google-maps/api";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
    Undo,
    Redo,
    Trash2,
    Save,
    Map as MapIcon,
    MousePointer2,
    BrainCircuit,
    RefreshCw,
    Plus,
    Pencil,
    User,
    AlertCircle,
    RotateCcw,
    CheckCircle2,
    XCircle,
    Sparkles,
    Layers
} from "lucide-react";
import { MapMode, Plot, LatLng, MapEditorProps } from "@/types/map";
import { MOCK_FARMERS, PLOT_COLORS } from "@/data/mockData";
import { useRouter } from "next/navigation";

// --- Constants & Types ---
const LIBRARIES: ("drawing" | "geometry")[] = ["drawing", "geometry"];
const DEFAULT_CENTER = { lat: 20.5, lng: 78.9 }; // Central India
const DEFAULT_ZOOM = 15;

const POLYGON_OPTIONS = {
    fillColor: "#ffffff",
    fillOpacity: 0.4,
    strokeColor: "#ffffff",
    strokeWeight: 2,
    editable: true,
    draggable: true,
    clickable: true,
};

// --- Helper Functions ---
const calculateAreaAcres = (path: LatLng[]) => {
    if (typeof google === "undefined") return 0;
    const polygonPath = path.map((p) => new google.maps.LatLng(p.lat, p.lng));
    const areaSqMeters = google.maps.geometry.spherical.computeArea(polygonPath);
    return areaSqMeters / 4046.86; // Convert to acres
};

// --- Component ---
export default function MapEditor({ mode, farmerId, initialPlots = [], onSave }: MapEditorProps) {
    const router = useRouter();
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        libraries: LIBRARIES
    });

    // State
    const [plots, setPlots] = useState<Plot[]>(initialPlots);
    const [history, setHistory] = useState<Plot[][]>([initialPlots]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [selectedPlotId, setSelectedPlotId] = useState<string | null>(null);
    const [drawingMode, setDrawingMode] = useState<google.maps.drawing.OverlayType | null>(null);
    const [isLabelDialogOpen, setIsLabelDialogOpen] = useState(false);
    const [editingLabel, setEditingLabel] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [mapType, setMapType] = useState<google.maps.MapTypeId | string>("satellite");
    const [pendingFarmerId, setPendingFarmerId] = useState<string | null>(null);
    const [showExitConfirm, setShowExitConfirm] = useState(false);

    // Refs
    const mapRef = useRef<google.maps.Map | null>(null);

    // Initialize plots from farmerId
    useEffect(() => {
        if (farmerId) {
            const farmer = MOCK_FARMERS.find(f => f.id === farmerId);
            if (farmer) {
                setPlots(farmer.plots);
                setHistory([farmer.plots]);
                setHistoryIndex(0);
                setIsDirty(false);
                // Pan to farmer's location
                if (mapRef.current) {
                    mapRef.current.panTo(farmer.location);
                    mapRef.current.setZoom(16);
                }
            }
        }
    }, [farmerId, isLoaded]);

    // --- Map Handlers ---
    const onLoad = useCallback((map: google.maps.Map) => {
        mapRef.current = map;
        map.setMapTypeId("satellite"); // Force satellite view on load
        if (farmerId) {
            const farmer = MOCK_FARMERS.find(f => f.id === farmerId);
            if (farmer) {
                map.panTo(farmer.location);
                map.setZoom(16);
            }
        }
    }, [farmerId]);

    const onUnmount = useCallback(() => {
        mapRef.current = null;
    }, []);

    const toggleMapType = () => {
        setMapType(prev => prev === "satellite" ? "roadmap" : "satellite");
    };

    // --- History Management ---
    const addToHistory = (newPlots: Plot[]) => {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newPlots);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
        setPlots(newPlots);
        setIsDirty(true);
    };

    const undo = () => {
        if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1);
            setPlots(history[historyIndex - 1]);
            setSelectedPlotId(null);
        }
    };

    const redo = () => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(historyIndex + 1);
            setPlots(history[historyIndex + 1]);
            setSelectedPlotId(null);
        }
    };

    // --- Polygon Handlers ---
    const handlePolygonComplete = (polygon: google.maps.Polygon) => {
        const path = polygon.getPath();
        const coordinates: LatLng[] = [];
        for (let i = 0; i < path.getLength(); i++) {
            const xy = path.getAt(i);
            coordinates.push({ lat: xy.lat(), lng: xy.lng() });
        }

        // Clean up the temporary polygon drawn by DrawingManager
        polygon.setMap(null);

        if (!selectedPlotId) {
            alert("Please select a plot pointer on the map before drawing a shape.");
            setDrawingMode(null);
            return;
        }

        const updatedPlots = plots.map(p =>
            p.id === selectedPlotId ? { ...p, path: coordinates } : p
        );

        addToHistory(updatedPlots);
        setDrawingMode(null); // Exit drawing mode
    };

    const handlePlotClick = (id: string) => {
        setSelectedPlotId(id);
        setDrawingMode(null);

        // Zoom to plot location
        const plot = plots.find(p => p.id === id);
        if (plot && mapRef.current) {
            mapRef.current.panTo(plot.location);
            mapRef.current.setZoom(18); // Close-up view for editing
        }
    };

    // --- Toolbar Actions ---
    const handleDeleteShape = () => {
        if (selectedPlotId) {
            const updatedPlots = plots.map((p) =>
                p.id === selectedPlotId ? { ...p, path: undefined, generationStatus: undefined } : p
            );
            addToHistory(updatedPlots);
            setSelectedPlotId(null);
        }
    };

    const handleClearAllShapes = () => {
        if (confirm("Are you sure you want to clear all drawn shapes for this farmer? This will not delete the plots themselves, only the mapping shapes.")) {
            const updatedPlots = plots.map(p => ({ ...p, path: undefined, generationStatus: undefined }));
            addToHistory(updatedPlots);
            setSelectedPlotId(null);
        }
    };

    const handleSave = () => {
        console.log("Saving plots:", plots);
        if (onSave) onSave(plots);
        setIsDirty(false);
        alert("Plots saved! (Check console for data)");
    };

    const handleLabelUpdate = () => {
        if (selectedPlotId && editingLabel) {
            const updatedPlots = plots.map((p) =>
                p.id === selectedPlotId ? { ...p, name: editingLabel } : p
            );
            addToHistory(updatedPlots);
            setIsLabelDialogOpen(false);
            setEditingLabel("");
        }
    };

    const handleFarmerChange = (id: string) => {
        if (isDirty) {
            setPendingFarmerId(id);
        } else {
            router.push(`/map-editor?mode=${mode}&farmerId=${id}`);
        }
    };

    const confirmFarmerChange = () => {
        if (pendingFarmerId) {
            router.push(`/map-editor?mode=${mode}&farmerId=${pendingFarmerId}`);
            setPendingFarmerId(null);
            setIsDirty(false);
        }
    };

    const saveAndConfirmFarmerChange = () => {
        handleSave();
        confirmFarmerChange();
    };

    const saveAndExit = () => {
        handleSave();
        setIsDirty(false);
        router.push("/map-view");
    };

    const handleBackClick = (e: React.MouseEvent) => {
        if (isDirty) {
            e.preventDefault();
            setShowExitConfirm(true);
        }
    };

    // --- ML Refinement Logic ---
    const generateMLPlots = async (targetPlotId?: string, forceRegenerate = false) => {
        setIsGenerating(true);

        // Determine which plots to process
        const plotsToProcess = targetPlotId
            ? plots.filter(p => p.id === targetPlotId)
            : plots.filter(p => forceRegenerate || !p.path || p.generationStatus === 'failed');

        if (plotsToProcess.length === 0) {
            setIsGenerating(false);
            return;
        }

        // Update their status to pending
        const updatedPlotsWithPending = plots.map(p =>
            plotsToProcess.find(tp => tp.id === p.id)
                ? { ...p, generationStatus: 'pending' as const }
                : p
        );
        setPlots(updatedPlotsWithPending);

        // Simulate generation delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        const resultPlots = plots.map(p => {
            const isTarget = plotsToProcess.find(tp => tp.id === p.id);
            if (!isTarget) return p;

            // Simulate 20% failure rate for correction testing
            const isFailure = Math.random() < 0.2;

            if (isFailure) {
                return { ...p, generationStatus: 'failed' as const };
            }

            const centerLat = p.location.lat;
            const centerLng = p.location.lng;

            // Generate a simple square centered at the plot's location
            const size = 0.002; // Base size for ML simulation
            const path = [
                { lat: centerLat - size / 2, lng: centerLng - size / 2 },
                { lat: centerLat + size / 2, lng: centerLng - size / 2 },
                { lat: centerLat + size / 2, lng: centerLng + size / 2 },
                { lat: centerLat - size / 2, lng: centerLng + size / 2 },
            ];

            return {
                ...p,
                path,
                generationStatus: 'success' as const,
                area: calculateAreaAcres(path)
            };
        });

        addToHistory(resultPlots);
        setIsGenerating(false);
    };

    const retryFailed = () => generateMLPlots(undefined, false);
    const regenerateAll = () => generateMLPlots(undefined, true);

    if (!isLoaded) {
        return <div className="flex h-screen items-center justify-center">Loading Map...</div>;
    }

    return (
        <div className="flex h-screen flex-col md:flex-row bg-zinc-50 dark:bg-zinc-900 overflow-hidden">

            {/* Sidebar / Toolbar */}
            <aside className="w-full md:w-80 bg-white dark:bg-zinc-950 border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800 flex flex-col z-10 overflow-hidden shadow-sm">
                <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center gap-3">
                        <Link href="/map-view" onClick={handleBackClick}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full border border-zinc-200 dark:border-zinc-800">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <h2 className="font-bold text-lg tracking-tight">Draw mode</h2>
                    </div>
                </div>

                <div className="p-4 space-y-6 flex-1 overflow-y-auto">
                    {/* Section 1: Farmer Details */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between mb-1">
                            <Label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Farmer</Label>
                            {farmerId && (
                                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                                    {plots.length} Plots
                                </span>
                            )}
                        </div>
                        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
                            <div className="space-y-2">
                                <Select onValueChange={handleFarmerChange} value={farmerId}>
                                    <SelectTrigger className="w-full bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 h-10 shadow-sm rounded-xl font-medium">
                                        <div className="flex items-center gap-2">
                                            <div className="h-5 w-5 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                                                <User className="h-3 w-3 text-zinc-500" />
                                            </div>
                                            <SelectValue placeholder="Select farmer" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        {MOCK_FARMERS.map(f => (
                                            <SelectItem key={f.id} value={f.id} className="rounded-lg">
                                                {f.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Area Comparison Graph */}
                            {farmerId && (() => {
                                const totalArea = plots.reduce((sum, p) => sum + p.area, 0);
                                const calArea = plots.reduce((sum, p) => sum + (p.path ? calculateAreaAcres(p.path) : 0), 0);
                                const maxVal = Math.max(totalArea, calArea, 0.1);

                                return (
                                    <div className="space-y-4 pt-2">
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-tight text-zinc-900 dark:text-zinc-100">
                                                <span>Tol. Area</span>
                                                <span>{totalArea.toFixed(1)} <span className="text-[9px] font-bold text-zinc-400 tracking-normal">Acres</span></span>
                                            </div>
                                            <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800/50 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-zinc-300 dark:bg-zinc-700 rounded-full transition-all duration-700 ease-out"
                                                    style={{ width: `${(totalArea / maxVal) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-tight text-zinc-900 dark:text-zinc-100">
                                                <span>Cal. Area</span>
                                                <span>{calArea.toFixed(1)} <span className="text-[9px] font-bold text-zinc-400 tracking-normal">Acres</span></span>
                                            </div>
                                            <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800/50 rounded-full overflow-hidden border border-zinc-200/20 dark:border-zinc-700/20">
                                                <div
                                                    className="h-full bg-zinc-900 dark:bg-zinc-100 rounded-full transition-all duration-700 ease-out shadow-sm"
                                                    style={{ width: `${(calArea / maxVal) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}


                        </div>
                    </div>

                    {/* Section 2: Editor Tools */}
                    <div className="space-y-3">
                        <Label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Edit Tools</Label>
                        <div className="space-y-3">
                            {/* Primary Drawing Actions */}
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    variant={drawingMode === google.maps.drawing.OverlayType.POLYGON ? "default" : "outline"}
                                    className="h-10 justify-start font-bold"
                                    onClick={() => setDrawingMode(google.maps.drawing.OverlayType.POLYGON)}
                                >
                                    <Pencil className="mr-2 h-4 w-4" /> Draw
                                </Button>
                                <Button
                                    variant={!drawingMode ? "default" : "outline"}
                                    className="h-10 justify-start font-bold"
                                    onClick={() => setDrawingMode(null)}
                                >
                                    <MousePointer2 className="mr-2 h-4 w-4" /> Select
                                </Button>
                            </div>

                            {/* ML Actions */}
                            <div className="space-y-2">
                                <Button
                                    variant="secondary"
                                    className="w-full h-10 justify-center font-bold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100"
                                    onClick={() => generateMLPlots()}
                                    disabled={isGenerating}
                                >
                                    {isGenerating ? (
                                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Sparkles className="mr-2 h-4 w-4" />
                                    )}
                                    {isGenerating ? "Processing..." : "Generate shapes"}
                                </Button>

                                {(plots.some(p => p.generationStatus === 'failed' || p.path)) && (
                                    <div className="grid grid-cols-2 gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 text-[10px] font-bold uppercase border-zinc-200 dark:border-zinc-800"
                                            onClick={retryFailed}
                                            disabled={isGenerating || !plots.some(p => p.generationStatus === 'failed')}
                                        >
                                            <RefreshCw className={`mr-1.5 h-3 w-3 ${isGenerating ? 'animate-spin' : ''}`} /> Retry Failed
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 text-[10px] font-bold uppercase border-zinc-200 dark:border-zinc-800"
                                            onClick={regenerateAll}
                                            disabled={isGenerating}
                                        >
                                            <RotateCcw className="mr-1.5 h-3 w-3" /> Regenerate All
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* History & Reset Actions */}
                            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-900">
                                <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold uppercase" onClick={undo} disabled={historyIndex <= 0}>
                                    <Undo className="mr-1.5 h-3 w-3" /> Undo
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold uppercase" onClick={redo} disabled={historyIndex >= history.length - 1}>
                                    <Redo className="mr-1.5 h-3 w-3" /> Redo
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold uppercase text-zinc-400 hover:text-red-500" onClick={handleClearAllShapes}>
                                    <Trash2 className="mr-1.5 h-3 w-3" /> Clear All
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Plot Details (Permanent List) */}
                    <div className="space-y-3 flex-1 flex flex-col min-h-0">
                        <Label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Plot Details</Label>
                        <div className="flex-1 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
                            {plots.map((plot) => (
                                <Card
                                    key={plot.id}
                                    className={`border shadow-sm transition-all cursor-pointer ${selectedPlotId === plot.id
                                        ? "border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-900/50 ring-1 ring-zinc-900 dark:ring-zinc-100"
                                        : "border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-950"
                                        }`}
                                    onClick={() => handlePlotClick(plot.id)}
                                >
                                    <div className="p-3 space-y-3">
                                        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-2 mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Plot ID: {plot.id}</span>
                                                {plot.generationStatus === 'success' && <CheckCircle2 className="h-3 w-3 text-emerald-500" />}
                                                {plot.generationStatus === 'failed' && <XCircle className="h-3 w-3 text-red-500" />}
                                                {plot.generationStatus === 'pending' && <RefreshCw className="h-3 w-3 text-zinc-400 animate-spin" />}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {/* Individual Action Buttons */}
                                                {(plot.generationStatus === 'failed' || (!plot.path && !plot.generationStatus)) && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            generateMLPlots(plot.id);
                                                        }}
                                                        disabled={isGenerating}
                                                        title={plot.generationStatus === 'failed' ? "Retry shape" : "Generate shape"}
                                                    >
                                                        <Sparkles className="h-3 w-3" />
                                                    </Button>
                                                )}
                                                {plot.path && plot.generationStatus !== 'failed' && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            generateMLPlots(plot.id, true);
                                                        }}
                                                        disabled={isGenerating}
                                                        title="Regenerate shape"
                                                    >
                                                        <RotateCcw className="h-3 w-3" />
                                                    </Button>
                                                )}
                                                {plot.path && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6 text-zinc-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedPlotId(plot.id);
                                                            handleDeleteShape();
                                                        }}
                                                        title="Delete shape"
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 text-[10px]">
                                            <div className="bg-zinc-50 dark:bg-zinc-900 p-2 rounded-lg border border-zinc-100 dark:border-zinc-800">
                                                <span className="block text-zinc-500 font-semibold uppercase mb-0.5 tracking-tight">Area</span>
                                                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{plot.area.toFixed(2)} Acres</span>
                                            </div>
                                            <div className="bg-zinc-50 dark:bg-zinc-900 p-2 rounded-lg border border-zinc-100 dark:border-zinc-800">
                                                <span className="block text-zinc-500 font-semibold uppercase mb-0.5 tracking-tight">Cal. Area</span>
                                                <span className={`text-sm font-bold ${plot.path ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-400"}`}>
                                                    {plot.path ? `${calculateAreaAcres(plot.path).toFixed(2)} Acres` : "No Shape"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <Button className="w-full h-12 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 font-bold shadow-lg" onClick={handleSave}>
                        <Save className="mr-2 h-4 w-4" /> Save All Work
                    </Button>
                </div>

            </aside>

            {/* Map Area */}
            <div className="flex-1 relative">
                <GoogleMap
                    mapContainerStyle={{ width: "100%", height: "100%" }}
                    center={DEFAULT_CENTER}
                    zoom={DEFAULT_ZOOM}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                    mapTypeId={mapType}
                    options={{
                        mapTypeControl: false,
                        streetViewControl: false,
                        fullscreenControl: false,
                        styles: [
                            {
                                featureType: "all",
                                elementType: "labels",
                                stylers: [{ visibility: "off" }]
                            }
                        ]
                    }}
                >
                    {/* Drawing Manager */}
                    <DrawingManager
                        onPolygonComplete={handlePolygonComplete}
                        drawingMode={drawingMode}
                        options={{
                            drawingControl: false,
                            polygonOptions: POLYGON_OPTIONS,
                        }}
                    />

                    {/* Render Plots & Markers */}
                    {plots.map((plot) => (
                        <React.Fragment key={plot.id}>
                            {plot.path && (
                                <Polygon
                                    path={plot.path}
                                    options={{
                                        ...POLYGON_OPTIONS,
                                        fillColor: plot.id === selectedPlotId ? "#000000" : (plot.color || "#FFFFFF"),
                                        strokeColor: plot.id === selectedPlotId ? "#000000" : (plot.color || "#FFFFFF"),
                                    }}
                                    onClick={() => handlePlotClick(plot.id)}
                                />
                            )}

                            {/* Plot Pointer */}
                            <Marker
                                position={plot.location}
                                onClick={() => handlePlotClick(plot.id)}
                                label={plot.id === selectedPlotId ? {
                                    text: "SELECTED",
                                    color: "white",
                                    fontSize: "10px",
                                    fontWeight: "bold",
                                    className: "bg-black/50 px-1 rounded -mt-8"
                                } : undefined}
                            />
                        </React.Fragment>
                    ))}

                </GoogleMap>

                {/* Floating Map Visualization Options */}
                <div className="absolute top-6 right-6 z-10">
                    <Select onValueChange={setMapType} value={mapType}>
                        <SelectTrigger className="h-10 w-10 flex items-center justify-center bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-xl p-0 hover:bg-white dark:hover:bg-zinc-900 transition-all [&>span]:hidden [&>svg:last-child]:hidden">
                            <MapIcon className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent align="end" className="bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-zinc-200 dark:border-zinc-800">
                            <SelectItem value="roadmap">Roadmap</SelectItem>
                            <SelectItem value="satellite">Satellite</SelectItem>
                            <SelectItem value="hybrid">Hybrid</SelectItem>
                            <SelectItem value="terrain">Terrain</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Unsaved Changes Confirmation Dialogs */}
                <Dialog open={!!pendingFarmerId} onOpenChange={(open) => !open && setPendingFarmerId(null)}>
                    <DialogContent className="sm:max-w-md bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-2xl p-0 gap-0">
                        <div className="p-6 pb-4 space-y-3">
                            <div className="h-12 w-12 rounded-2xl bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center mb-2">
                                <AlertCircle className="h-6 w-6 text-amber-500" />
                            </div>
                            <DialogHeader>
                                <DialogTitle className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Unsaved Progress</DialogTitle>
                            </DialogHeader>
                            <p className="text-[15px] text-zinc-500 leading-relaxed font-medium">
                                You have unsaved changes on the current map. Would you like to save your work before switching to the next farmer?
                            </p>
                        </div>
                        <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-900 flex flex-col sm:flex-row gap-3">
                            <Button variant="ghost" className="flex-1 h-11 text-zinc-500 dark:text-zinc-400 font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800" onClick={() => setPendingFarmerId(null)}>
                                Cancel & Go Back
                            </Button>
                            <Button className="flex-1 h-11 bg-zinc-900 dark:bg-zinc-50 dark:text-zinc-900 text-white font-bold shadow-md hover:shadow-lg transition-all" onClick={saveAndConfirmFarmerChange}>
                                Save & Continue
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                <Dialog open={showExitConfirm} onOpenChange={setShowExitConfirm}>
                    <DialogContent className="sm:max-w-md bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-2xl p-0 gap-0">
                        <div className="p-6 pb-4 space-y-3">
                            <div className="h-12 w-12 rounded-2xl bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center mb-2">
                                <AlertCircle className="h-6 w-6 text-amber-500" />
                            </div>
                            <DialogHeader>
                                <DialogTitle className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Discard Changes?</DialogTitle>
                            </DialogHeader>
                            <p className="text-[15px] text-zinc-500 leading-relaxed font-medium">
                                Your map edits aren't saved. Would you like to save your work before leaving the editor?
                            </p>
                        </div>
                        <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-900 flex flex-col sm:flex-row gap-3">
                            <Button variant="ghost" className="flex-1 h-11 text-zinc-500 dark:text-zinc-400 font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800" onClick={() => setShowExitConfirm(false)}>
                                Cancel & Go Back
                            </Button>
                            <Button className="flex-1 h-11 bg-zinc-900 dark:bg-zinc-50 dark:text-zinc-900 text-white font-bold shadow-md hover:shadow-lg transition-all" onClick={saveAndExit}>
                                Save & Exit
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
