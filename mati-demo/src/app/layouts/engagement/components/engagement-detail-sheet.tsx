"use client"

import * as React from "react"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogPortal,
    DialogOverlay,
} from "@/components/ui/dialog"
import { EngagementRecord } from "../data/schema"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar, XCircle } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, MessageSquareText, AlertCircle, CheckCircle2, X, Check, Image as ImageIcon, Play, FileText, MapPin, Download, Info, MessageSquareWarning, Trash2, ZoomIn, ZoomOut, RotateCw, Maximize2, Minimize2, Scaling, AlignCenter, SlidersHorizontal, RotateCcw, Loader2, ChevronDown } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SurveyItem, surveyData, SurveyCard } from "@/app/components/survey/SurveyComponents"
import { GoogleMap, useJsApiLoader, Marker, Polygon, InfoWindow } from "@react-google-maps/api"
import { MOCK_FARMERS } from "@/data/mockData"
import { Farmer, Plot } from "@/types/map"

const LIBRARIES: ("drawing" | "geometry")[] = ["drawing", "geometry"];
const DEFAULT_CENTER = { lat: 20.5, lng: 78.9 };
const DEFAULT_ZOOM = 5;

function MapPreviewContent({ selectedFarmer }: { selectedFarmer: Farmer | null }) {
    const mapRef = React.useRef<google.maps.Map | null>(null);

    const onLoad = React.useCallback((map: google.maps.Map) => {
        mapRef.current = map;
        map.setMapTypeId("satellite");
    }, []);

    const onUnmount = React.useCallback(() => {
        mapRef.current = null;
    }, []);

    React.useEffect(() => {
        if (selectedFarmer && mapRef.current) {
            mapRef.current.panTo(selectedFarmer.location);
            mapRef.current.setZoom(17);
        }
    }, [selectedFarmer]);

    return (
        <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={selectedFarmer?.location || DEFAULT_CENTER}
            zoom={selectedFarmer ? 17 : DEFAULT_ZOOM}
            onLoad={onLoad}
            onUnmount={onUnmount}
            mapTypeId="satellite"
            options={{
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false,
                zoomControl: true,
            }}
        >
            {selectedFarmer && (
                <>
                    {selectedFarmer.plots.map(plot => (
                        <React.Fragment key={plot.id}>
                            {plot.path && plot.path.length > 0 && (
                                <Polygon
                                    path={plot.path}
                                    options={{
                                        fillColor: "#ffffff",
                                        fillOpacity: 0.3,
                                        strokeColor: "#ffffff",
                                        strokeWeight: 2,
                                        clickable: false,
                                    }}
                                />
                            )}
                            <Marker
                                position={plot.location}
                                clickable={false}
                            />
                        </React.Fragment>
                    ))}
                </>
            )}
        </GoogleMap>
    );
}

interface EngagementDetailSheetProps {
    record: EngagementRecord | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onNext: () => void
    onPrevious: () => void
    isFirst: boolean
    isLast: boolean
    currentIndex: number
    totalCount: number
}

function ImagePreview({ item, zoom, rotation, imageMode }: { item: SurveyItem, zoom: number, rotation: number, imageMode: "fill" | "fit" | "stretch" | "center" }) {
    const containerRef = React.useRef<HTMLDivElement>(null)
    const [containerSize, setContainerSize] = React.useState({ width: 0, height: 0 })

    React.useLayoutEffect(() => {
        const updateSize = () => {
            if (containerRef.current) {
                setContainerSize({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetHeight
                });
            }
        };

        const observer = new ResizeObserver(updateSize);
        if (containerRef.current) {
            observer.observe(containerRef.current);
            updateSize();
        }

        return () => observer.disconnect();
    }, []);

    const isRotated = rotation % 180 !== 0;
    
    // Calculate dimensions for the image wrapper when rotated
    const wrapperStyle: React.CSSProperties = isRotated && containerSize.width > 0 ? {
        width: `${containerSize.height}px`,
        height: `${containerSize.width}px`,
    } : {
        width: "100%",
        height: "100%",
    };

    return (
        <div ref={containerRef} className="flex-1 w-full h-full overflow-hidden p-0 flex items-center justify-center bg-zinc-100 dark:bg-zinc-900/50 cursor-grab active:cursor-grabbing relative">
            <div 
                className="transition-all duration-300 ease-out flex items-center justify-center"
                style={{ 
                    ...wrapperStyle,
                    transform: `scale(${zoom}) rotate(${rotation}deg)`,
                }}
            >
                <img 
                    src={item.answer as string} 
                    alt="Preview" 
                    className={cn(
                        "transition-all duration-300",
                        imageMode === "fill" && "w-full h-full object-cover",
                        imageMode === "fit" && "w-full h-full object-contain",
                        imageMode === "stretch" && "w-full h-full object-fill",
                        imageMode === "center" && "max-w-none max-h-none w-auto h-auto object-none"
                    )}
                />
            </div>
        </div>
    );
}

export function EngagementDetailSheet({
    record,
    open,
    onOpenChange,
    onNext,
    onPrevious,
    isFirst,
    isLast,
    currentIndex,
    totalCount
}: EngagementDetailSheetProps) {
    const [comment, setComment] = React.useState("")
    const [isApproving, setIsApproving] = React.useState(false)
    const [showCommentInput, setShowCommentInput] = React.useState(false)
    const [isReporting, setIsReporting] = React.useState(false)
    const [reportedIds, setReportedIds] = React.useState<string[]>([])
    const [previewItem, setPreviewItem] = React.useState<SurveyItem | null>(null)
    const [zoom, setZoom] = React.useState(1)
    const [rotation, setRotation] = React.useState(0)
    const [imageMode, setImageMode] = React.useState<"fill" | "fit" | "stretch" | "center">("fit")
    
    // Reporting states
    const [isReportingFinalStep, setIsReportingFinalStep] = React.useState(false)
    const [reportComment, setReportComment] = React.useState("")
    const [isSubmittingReport, setIsSubmittingReport] = React.useState(false)
    const [reportSuccess, setReportSuccess] = React.useState(false)
    const [isReportCommentMinimized, setIsReportCommentMinimized] = React.useState(false)

    // Approval countdown states
    const [countdown, setCountdown] = React.useState<number | null>(null)
    const [isHoveringApprove, setIsHoveringApprove] = React.useState(false)
    const countdownTimerRef = React.useRef<NodeJS.Timeout | null>(null)

    // Determine if we are previewing something else (image, video, file)
    const activePreview = previewItem && previewItem.type !== "map" ? previewItem : null;

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        libraries: LIBRARIES
    });

    const [mapVisible, setMapVisible] = React.useState(false)

    // Cleanup timer on unmount
    React.useEffect(() => {
        return () => {
            if (countdownTimerRef.current) clearInterval(countdownTimerRef.current)
        }
    }, [])

    // Reset state when record changes
    React.useEffect(() => {
        setComment("")
        setIsApproving(false)
        setShowCommentInput(false)
        setIsReporting(false)
        setReportedIds([])
        setPreviewItem(null);
        setZoom(1);
        setRotation(0);
        setImageMode("fit");
        
        if (open) {
            // Delay map visibility to sync with side module animation
            const timer = setTimeout(() => {
                setMapVisible(true);
            }, 600); // Increased to ensure side module is fully settled
            return () => clearTimeout(timer);
        } else {
            setMapVisible(false);
        }
    }, [record?.id, open])

    if (!record) return null

    // Find the farmer in MOCK_FARMERS to get plot data
    const farmerData = MOCK_FARMERS.find(f => f.name === record.farmer.name) || MOCK_FARMERS[0];

    const toggleReportId = (id: string) => {
        setReportedIds(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (reportedIds.length === surveyData.length) {
            setReportedIds([])
        } else {
            setReportedIds(surveyData.map(item => item.id))
        }
    }

    const handleApprove = () => {
        if (countdown !== null) {
            // Cancel process
            if (countdownTimerRef.current) clearInterval(countdownTimerRef.current)
            setCountdown(null)
            setIsApproving(false)
            return
        }

        setIsApproving(true)
        setCountdown(3)

        countdownTimerRef.current = setInterval(() => {
            setCountdown(prev => {
                if (prev === null) return null
                if (prev <= 1) {
                    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current)
                    // Final approval logic
                    console.log("Approving record:", record.id, "with comment:", comment)
                    
                    // Move to next record if available, otherwise close
                    if (!isLast) {
                        onNext()
                        setCountdown(null)
                        setIsApproving(false)
                    } else {
                        onOpenChange(false)
                    }
                    return null
                }
                return prev - 1
            })
        }, 1000)
    }

    const handleItemClick = (item: SurveyItem) => {
        if (["image", "video", "file", "map"].includes(item.type)) {
            setPreviewItem(item)
        }
    }

    const handleCloseAll = () => {
        setPreviewItem(null)
        setIsReportingFinalStep(false)
        onOpenChange(false)
    }

    const handleReportSubmit = () => {
        setIsSubmittingReport(true)
        // Simulate API call
        setTimeout(() => {
            console.log("Reporting items:", reportedIds, "with comment:", reportComment)
            setIsSubmittingReport(false)
            setReportSuccess(true)
            
            // Show success state for 1.5 seconds then move to next
            setTimeout(() => {
                setReportSuccess(false)
                setIsReportingFinalStep(false)
                setIsReporting(false)
                setReportedIds([])
                setReportComment("")
                
                // Move to next record if available, otherwise close
                if (!isLast) {
                    onNext()
                } else {
                    onOpenChange(false)
                }
            }, 1500)
        }, 1000)
    }

    // Determine if we should show the persistent map
    const showPersistentMap = mapVisible && record;

    const renderPreviewContent = (item: SurveyItem) => {
        switch (item.type) {
            case "image":
                const imgFileName = (item.answer as string).split('/').pop()?.split('?')[0] || "image.jpg";
                return (
                    <div className="w-full h-full flex flex-col bg-white overflow-hidden">
                        {/* Header Bar */}
                        <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-white shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="bg-amber-50 p-2 rounded-lg">
                                    <ImageIcon className="h-5 w-5 text-amber-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-zinc-900 leading-none">{imgFileName}</p>
                                    <p className="text-[11px] text-zinc-500 mt-1 font-medium">2.4 MB</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                {/* Zoom Controls */}
                                <div className="flex items-center gap-1 mr-2 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-full">
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-7 w-7 rounded-full hover:bg-white dark:hover:bg-zinc-700" 
                                        onClick={() => setZoom(prev => Math.max(0.5, prev - 0.25))}
                                        title="Zoom Out"
                                    >
                                        <ZoomOut className="h-3.5 w-3.5" />
                                    </Button>
                                    <span className="text-[10px] font-bold w-8 text-center">{Math.round(zoom * 100)}%</span>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-7 w-7 rounded-full hover:bg-white dark:hover:bg-zinc-700" 
                                        onClick={() => setZoom(prev => Math.min(3, prev + 0.25))}
                                        title="Zoom In"
                                    >
                                        <ZoomIn className="h-3.5 w-3.5" />
                                    </Button>
                                </div>

                                {/* Rotation */}
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-9 w-9 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-full"
                                    onClick={() => setRotation(prev => (prev + 90) % 360)}
                                    title="Rotate 90°"
                                >
                                    <RotateCw className="h-4 w-4" />
                                </Button>

                                {/* Fit/Mode Menu */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-9 w-9 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-full"
                                            title="View Modes"
                                        >
                                            <SlidersHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-[140px] z-[10005]">
                                        <DropdownMenuItem onClick={() => setImageMode("fill")} className="flex items-center gap-2">
                                            <Maximize2 className="h-3.5 w-3.5" />
                                            <span>Fill</span>
                                            {imageMode === "fill" && <Check className="ml-auto h-3.5 w-3.5" />}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setImageMode("fit")} className="flex items-center gap-2">
                                            <Minimize2 className="h-3.5 w-3.5" />
                                            <span>Fit</span>
                                            {imageMode === "fit" && <Check className="ml-auto h-3.5 w-3.5" />}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setImageMode("stretch")} className="flex items-center gap-2">
                                            <Scaling className="h-3.5 w-3.5" />
                                            <span>Stretch</span>
                                            {imageMode === "stretch" && <Check className="ml-auto h-3.5 w-3.5" />}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setImageMode("center")} className="flex items-center gap-2">
                                            <AlignCenter className="h-3.5 w-3.5" />
                                            <span>Center</span>
                                            {imageMode === "center" && <Check className="ml-auto h-3.5 w-3.5" />}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-800 mx-1" />

                                <Button asChild variant="ghost" size="icon" className="h-9 w-9 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-full">
                                    <a href={item.answer as string} download title="Download Image">
                                        <Download className="h-4 w-4" />
                                    </a>
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-9 w-9 text-zinc-500 hover:text-red-600 hover:bg-red-50 rounded-full"
                                    onClick={() => setPreviewItem(null)}
                                    title="Close"
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                        <ImagePreview 
                            item={item} 
                            zoom={zoom} 
                            rotation={rotation} 
                            imageMode={imageMode} 
                        />
                    </div>
                );
            case "video":
                const vidFileName = (item.answer as string).split('/').pop()?.split('?')[0] || "video.mp4";
                return (
                    <div className="w-full h-full flex flex-col bg-white overflow-hidden">
                        {/* Header Bar */}
                        <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-white shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="bg-red-50 p-2 rounded-lg">
                                    <Play className="h-5 w-5 text-red-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-zinc-900 leading-none">{vidFileName}</p>
                                    <p className="text-[11px] text-zinc-500 mt-1 font-medium">12.8 MB</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                {/* Fit Toggle */}
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-9 w-9 rounded-full text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                                    onClick={() => setImageMode(prev => prev === "fill" ? "fit" : "fill")}
                                    title={imageMode === "fill" ? "Switch to Fit" : "Switch to Fill"}
                                >
                                    {imageMode === "fill" ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                                </Button>

                                <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-800 mx-1" />

                                <Button asChild variant="ghost" size="icon" className="h-9 w-9 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-full">
                                    <a href={item.answer as string} download title="Download Video">
                                        <Download className="h-4 w-4" />
                                    </a>
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-9 w-9 text-zinc-500 hover:text-red-600 hover:bg-red-50 rounded-full"
                                    onClick={() => setPreviewItem(null)}
                                    title="Close"
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-hidden p-0 flex items-center justify-center bg-black">
                            <video 
                                src={item.answer as string} 
                                controls 
                                autoPlay 
                                className={cn(
                                    "w-full h-full transition-all duration-300 bg-black",
                                    imageMode === "fill" ? "object-cover" : "object-contain"
                                )}
                            />
                        </div>
                    </div>
                );
            case "file":
                return (
                    <div className="w-full h-full flex flex-col bg-white overflow-hidden">
                        {/* Header Bar */}
                        <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-white shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-50 p-2 rounded-lg">
                                    <FileText className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-zinc-900 leading-none">{(item.answer as { name: string }).name || "Document.pdf"}</p>
                                    <p className="text-[11px] text-zinc-500 mt-1 font-medium">{(item.answer as { size: string }).size || "2.4 MB"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button asChild variant="ghost" size="icon" className="h-9 w-9 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-full">
                                    <a href="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" target="_blank" rel="noopener noreferrer" title="Download PDF">
                                        <Download className="h-4 w-4" />
                                    </a>
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-9 w-9 text-zinc-500 hover:text-red-600 hover:bg-red-50 rounded-full"
                                    onClick={() => setPreviewItem(null)}
                                    title="Close"
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                        
                        {/* PDF Content */}
                        <div className="flex-1 w-full bg-zinc-100 flex items-center justify-center overflow-hidden">
                            <iframe 
                                src={`https://docs.google.com/viewer?url=https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf&embedded=true`}
                                className="w-full h-full border-none"
                                title="PDF Preview"
                            />
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <>
            {/* Persistent Map Module - Positioned next to the side module, sliding with it */}
            <div 
                className={cn(
                    "map-preview-module fixed top-0 bottom-0 bg-white dark:bg-zinc-950 flex flex-col shadow-2xl border-r border-zinc-200 dark:border-zinc-800 transition-all duration-500 ease-in-out z-[100]",
                    open ? "right-[500px] opacity-100" : "-right-full opacity-0"
                )}
                style={{ 
                    width: "50vw", 
                    pointerEvents: "auto"
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex-1 overflow-hidden p-0 flex items-center justify-center bg-zinc-100 dark:bg-zinc-900/50">
                    <div className="w-full h-full relative overflow-hidden">
                        {isLoaded ? (
                            <MapPreviewContent selectedFarmer={farmerData} />
                        ) : (
                            <div className="flex h-full items-center justify-center text-zinc-500">
                                Loading Map...
                            </div>
                        )}
                        <div className="absolute top-6 left-6 z-20 pointer-events-none">
                            <div className="flex items-center gap-2 pointer-events-auto">
                                <div className="px-3 py-1.5 bg-white/95 dark:bg-zinc-950/95 shadow-xl border border-zinc-200 dark:border-zinc-800 rounded-lg text-[14px] font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-50 whitespace-nowrap backdrop-blur-md">
                                    {farmerData.calArea}
                                </div>
                                <div className="px-3 py-1.5 bg-white/95 dark:bg-zinc-950/95 shadow-xl border border-zinc-200 dark:border-zinc-800 rounded-lg text-[14px] font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-50 whitespace-nowrap backdrop-blur-md">
                                    {farmerData.plots.length} Plots
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Sheet open={open} onOpenChange={(val) => {
                if (!val) {
                    handleCloseAll();
                }
            }}>
                <SheetContent 
                    className="w-full sm:max-w-[500px] p-0 flex flex-col gap-0 border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl overflow-visible z-[200]"
                    onPointerDownOutside={(e) => {
                        const target = e.target as HTMLElement;
                        if (target.closest('.map-preview-module')) {
                            e.preventDefault();
                        }
                    }}
                >
                {/* Header section */}
                <div className="shrink-0 border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 z-30">
                    <div className="p-5">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-12 w-12 border border-zinc-100 dark:border-zinc-800 shadow-sm">
                                    <AvatarImage src={record.farmer.avatar} />
                                    <AvatarFallback className="bg-zinc-100 text-zinc-600 font-bold">{record.farmer.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="text-left">
                                    <SheetTitle className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
                                        {record.farmer.name}
                                    </SheetTitle>
                                    <SheetDescription asChild>
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <span className="flex items-center gap-1 text-xs text-zinc-500 font-medium">
                                                <MapPin className="h-3 w-3" />
                                                {record.village}
                                            </span>
                                        </div>
                                    </SheetDescription>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2 h-14 justify-center">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all active:scale-95 -mr-1"
                                    onClick={handleCloseAll}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                                <Badge
                                    variant="outline"
                                    className={cn(
                                        "px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-full border shadow-none pointer-events-none select-none",
                                        record.status === "Verified" && "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50",
                                        record.status === "Pending" && "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50",
                                        record.status === "Invalid" && "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50"
                                    )}
                                >
                                    {record.status === "Invalid" ? "Need Correction" : record.status}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Fixed Engagement Details Bar */}
                    <div className="bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-800 px-6 py-2.5 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider">
                        <div className="flex items-center gap-3">
                            <span className="text-zinc-900 dark:text-zinc-50">{record.engagementType}</span>
                        </div>
                        <div className="text-zinc-400 font-medium">
                            AZ-{record.azs}
                        </div>
                    </div>

                    {/* Report Comment Bar for Need Correction */}
                    {record.status === "Invalid" && (
                        <div className="bg-red-50 dark:bg-red-950/20 border-t border-red-100 dark:border-red-900/30 px-6 py-3 flex flex-col gap-2">
                            <div 
                                className="flex items-center justify-between cursor-pointer group"
                                onClick={() => setIsReportCommentMinimized(!isReportCommentMinimized)}
                            >
                                <div className="flex items-center gap-3">
                                    <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0" />
                                    <p className="text-[10px] font-bold text-red-800 dark:text-red-400 uppercase tracking-widest">Report Comment</p>
                                </div>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-5 w-5 text-red-400 group-hover:text-red-600 transition-colors"
                                >
                                    <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-300", isReportCommentMinimized ? "rotate-0" : "rotate-180")} />
                                </Button>
                            </div>
                            {!isReportCommentMinimized && (
                                <div className="flex items-start gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
                                    <div className="w-4 shrink-0" /> {/* Spacer to align with icon above */}
                                    <p className="text-xs text-red-700 dark:text-red-300 leading-relaxed font-medium">
                                        {record.reportComment || "The soil analysis report seems to be missing the nitrogen levels. Please re-upload the correct document."}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Content section - Style 5 (Feedback based) */}
                <ScrollArea className="flex-1">
                    <div className="p-6">
                        <div className="space-y-1">
                            {surveyData.map((item) => {
                                    // Custom question text logic for questions 8, 9, and 11
                                    let displayQuestion = item.question;
                                    if (item.id === "8") displayQuestion = "Measure the total cultivated area: (in Acres)";
                                    if (item.id === "9") displayQuestion = "Enter the quantity of seeds used: (in Tons)";
                                    if (item.id === "11") displayQuestion = "Estimated cost of inputs per acre: (in INR)";

                                    return (
                                        <div 
                                            key={item.id} 
                                            className="relative"
                                        >
                                            <div 
                                                className="cursor-pointer"
                                                onClick={(e) => {
                                                    // If the click came from the attachment preview trigger, open the pop-up
                                                    const target = e.target as HTMLElement;
                                                    if (target.closest('.attachment-preview-trigger')) {
                                                        handleItemClick(item);
                                                    }
                                                }}
                                            >
                                                <SurveyCard
                                                    item={{
                                                        ...item,
                                                        question: displayQuestion
                                                    }}
                                                    style="style-5-feedback"
                                                    showDetails={false}
                                                    isReporting={isReporting}
                                                    isSelected={reportedIds.includes(item.id)}
                                                    onToggleSelect={() => toggleReportId(item.id)}
                                                    disableDialog={true}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                        {/* Approval Comment Section for Pending */}
                        {record.status === "Pending" && !isReporting && (
                            <div className="mt-8 space-y-4">
                                {!showCommentInput ? (
                                    <div className="space-y-3">
                                        <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">
                                            Add a comment for any specific feedback or observations (optional).
                                        </p>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 px-0 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-transparent transition-colors group flex items-center gap-2"
                                            onClick={() => setShowCommentInput(true)}
                                        >
                                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700 transition-colors">
                                                <MessageSquareText className="h-3.5 w-3.5 opacity-70 group-hover:opacity-100" />
                                            </div>
                                            <span className="text-xs font-bold uppercase tracking-tight">Add a comment</span>
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                                                Comment <span className="font-medium opacity-70">(Optional)</span>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 px-2 text-[10px] font-bold text-zinc-400 hover:text-red-500 transition-colors"
                                                onClick={() => {
                                                    setShowCommentInput(false)
                                                    setComment("")
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                        <Textarea
                                            placeholder="Type your comment here..."
                                            className="min-h-[100px] w-full bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 rounded-lg text-sm resize-none focus-visible:ring-1 focus-visible:ring-zinc-200 dark:focus-visible:ring-zinc-800 p-3 placeholder:text-zinc-400"
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            autoFocus
                                        />
                                        <div className="h-px bg-zinc-100 dark:bg-zinc-800 w-full" />
                                        <p className="text-[10px] text-zinc-400 font-medium italic">
                                            This comment will be permanently attached to the verified record.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Display Comment for Verified */}
                        {record.status === "Verified" && (record.verified?.comment || record.approvalComment) && (
                            <div className="mt-8 space-y-3">
                                <div className="flex items-center gap-2 text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                                    Comment
                                </div>
                                <div className="text-sm text-zinc-900 dark:text-zinc-50 leading-relaxed">
                                    {record.verified?.comment || record.approvalComment}
                                </div>
                                <div className="flex items-center gap-2 pt-1">
                                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                                        {record.verified?.verifier}
                                    </span>
                                    <span className="text-zinc-300 dark:text-zinc-700">•</span>
                                    <span className="text-[10px] text-zinc-400 font-medium uppercase">
                                        {record.verified?.date ? format(record.verified.date, "dd MMM yyyy") : ""}
                                    </span>
                                </div>
                                <div className="h-px bg-zinc-100 dark:bg-zinc-800 w-full" />
                            </div>
                        )}
                    </div>
                </ScrollArea>

                {/* Footer section */}
                <div className="border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 z-20 flex flex-col">
                    {/* Report Selection Bar - Only visible during reporting */}
                    {isReporting && (
                        <div className="bg-amber-50/50 dark:bg-[#1a1608]/50 border-b border-amber-100/50 dark:border-amber-900/20 px-6 py-2 flex items-center justify-between animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="flex items-center gap-3">
                                <Checkbox 
                                    id="select-all-footer" 
                                    checked={reportedIds.length === surveyData.length}
                                    onCheckedChange={toggleSelectAll}
                                    className="h-4 w-4 border-amber-400 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600 rounded"
                                />
                                <label 
                                    htmlFor="select-all-footer" 
                                    className="text-[10px] font-bold text-amber-800 dark:text-amber-500 uppercase tracking-widest cursor-pointer select-none"
                                >
                                    Report whole survey
                                </label>
                            </div>
                            <span className="text-[9px] font-bold text-amber-700 dark:text-amber-500 uppercase tracking-widest bg-white dark:bg-zinc-900 px-2 py-0.5 rounded-full border border-amber-100 dark:border-amber-900/40">
                                {reportedIds.length} SELECTED
                            </span>
                        </div>
                    )}

                    <div className="p-4 flex items-center justify-between gap-4">
                        {/* Left: Navigation */}
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
                            onClick={onPrevious}
                            disabled={isFirst}
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <span className="text-[11px] font-bold text-zinc-500 tabular-nums">
                            {currentIndex + 1} / {totalCount}
                        </span>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
                            onClick={onNext}
                            disabled={isLast}
                        >
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                    </div>

                                {/* Right: Actions */}
                                {record.status !== "Verified" && record.status !== "Invalid" && (
                                    <div className="flex items-center gap-2">
                                        {isReporting ? (
                                            <Button
                                                variant="outline"
                                                className="h-9 px-4 text-xs font-bold border-zinc-100 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 transition-all"
                                                onClick={() => {
                                                    setIsReporting(false)
                                                    setReportedIds([])
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="outline"
                                                className="h-9 px-4 text-xs font-bold border-zinc-100 text-zinc-500 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all"
                                                onClick={() => setIsReporting(true)}
                                            >
                                                <AlertCircle className="mr-2 h-3.5 w-3.5" /> Report
                                            </Button>
                                        )}
                                        
                                        {/* Only show Approve button for Pending records and when not in reporting mode */}
                                        {record.status === "Pending" && !isReporting && (
                                            <Button
                                                className={cn(
                                                    "h-9 px-5 text-xs font-bold shadow-md transition-all duration-500 ease-in-out overflow-hidden",
                                                    countdown !== null 
                                                        ? isHoveringApprove
                                                            ? "w-[145px] bg-red-50 text-red-600 hover:bg-red-100 border-red-100"
                                                            : "w-[145px] bg-zinc-100 text-muted-foreground border-zinc-200"
                                                        : "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900"
                                                )}
                                                onClick={handleApprove}
                                                onMouseEnter={() => setIsHoveringApprove(true)}
                                                onMouseLeave={() => setIsHoveringApprove(false)}
                                            >
                                                <div className="flex items-center justify-center gap-2 w-full transition-all duration-300">
                                                    {countdown !== null ? (
                                                        isHoveringApprove ? (
                                                            <>
                                                                <X className="h-3.5 w-3.5 animate-in fade-in zoom-in duration-300" />
                                                                <span className="animate-in fade-in slide-in-from-right-2 duration-300">Cancel</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Loader2 className="h-3.5 w-3.5 animate-spin duration-1000" />
                                                                <span className="animate-in fade-in slide-in-from-left-2 duration-300">Approving in {countdown}</span>
                                                            </>
                                                        )
                                                    ) : (
                                                        <>
                                                            <CheckCircle2 className="mr-2 h-3.5 w-3.5" />
                                                            <span>Approve</span>
                                                        </>
                                                    )}
                                                </div>
                                            </Button>
                                        )}

                                        {/* Show Report Selected button when in reporting mode */}
                                        {isReporting && (
                                            <Button
                                                className={cn(
                                                    "h-9 px-5 text-xs font-bold shadow-md transition-all active:scale-[0.98] bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:text-white"
                                                )}
                                                onClick={() => setIsReportingFinalStep(true)}
                                                disabled={reportedIds.length === 0}
                                            >
                                                <AlertCircle className="mr-2 h-3.5 w-3.5" />
                                                {reportedIds.length === 0 ? "Report" : `Report Selected (${reportedIds.length})`}
                                            </Button>
                                        )}
                                    </div>
                                )}
                    </div>
                </div>

            </SheetContent>
        </Sheet>

            <Dialog open={!!activePreview} onOpenChange={(val) => {
                if (!val) setPreviewItem(null);
            }}>
                <DialogPortal>
                    <DialogContent className="max-w-[1200px] w-[95vw] h-[800px] max-h-[90vh] p-0 overflow-hidden bg-white dark:bg-zinc-950 border-none shadow-2xl z-[10001] flex items-center justify-center rounded-2xl [&>button]:hidden">
                        <DialogTitle className="sr-only">Attachment Preview</DialogTitle>
                        <DialogDescription className="sr-only">Basic view of the survey attachment</DialogDescription>
                        
                        <div className="relative w-full h-full flex flex-col items-center justify-center bg-black/5">
                            {activePreview && renderPreviewContent(activePreview)}
                        </div>
                    </DialogContent>
                </DialogPortal>
            </Dialog>

            {/* New Report Comment Pop-up */}
            <Dialog open={isReportingFinalStep} onOpenChange={setIsReportingFinalStep}>
                <DialogContent className="max-w-[480px] p-0 overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-lg z-[10002] rounded-xl [&>button]:hidden">
                    <DialogTitle className="sr-only">Finalize Report</DialogTitle>
                    <DialogDescription className="sr-only">Add additional comments before submitting the report</DialogDescription>
                    
                    <div className="bg-white dark:bg-zinc-950">
                        {reportSuccess ? (
                            <div className="p-12 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in duration-300">
                                <div className="h-16 w-16 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center mb-2">
                                    <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Reported Successfully</h3>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Moving to the next farmer...</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Header */}
                                <div className="p-6 pb-0 flex items-start justify-between">
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Report Survey</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            You are reporting <span className="font-semibold text-zinc-900 dark:text-zinc-100">{reportedIds.length} items</span>.
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 rounded-md text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-all"
                                        onClick={() => setIsReportingFinalStep(false)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>

                                {/* Body */}
                                <div className="p-6 space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Additional Comments <span className="text-red-500">*</span></Label>
                                        <Textarea 
                                            placeholder="Describe what needs to be corrected..."
                                            className="min-h-[120px] resize-none border-zinc-200 dark:border-zinc-800 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-50 rounded-md bg-transparent p-3 text-sm leading-relaxed"
                                            value={reportComment}
                                            onChange={(e) => setReportComment(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="p-6 pt-0 flex items-center justify-end gap-3">
                                    <Button 
                                        variant="outline"
                                        className="h-9 px-4 text-xs font-bold"
                                        onClick={() => setIsReportingFinalStep(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        className="h-9 px-4 text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-none"
                                        onClick={handleReportSubmit}
                                        disabled={isSubmittingReport || !reportComment.trim()}
                                    >
                                        {isSubmittingReport ? (
                                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                        ) : (
                                            <>
                                                <AlertCircle className="mr-2 h-3.5 w-3.5" />
                                                Submit Report
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
