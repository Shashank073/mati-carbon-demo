"use client"

import * as React from "react"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet"
import { EngagementRecord } from "../data/schema"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar, XCircle } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, MessageSquareText, AlertCircle, CheckCircle2, X, Image as ImageIcon, Play, FileText, MapPin, Download, Info, MessageSquareWarning, Trash2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
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
}

export function EngagementDetailSheet({
    record,
    open,
    onOpenChange,
    onNext,
    onPrevious,
    isFirst,
    isLast
}: EngagementDetailSheetProps) {
    const [comment, setComment] = React.useState("")
    const [isApproving, setIsApproving] = React.useState(false)
    const [showCommentInput, setShowCommentInput] = React.useState(false)
    const [isReporting, setIsReporting] = React.useState(false)
    const [reportedIds, setReportedIds] = React.useState<string[]>([])
    const [previewItem, setPreviewItem] = React.useState<SurveyItem | null>(null)

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        libraries: LIBRARIES
    });

    // Reset state when record changes
    React.useEffect(() => {
        setComment("")
        setIsApproving(false)
        setShowCommentInput(false)
        setIsReporting(false)
        setReportedIds([])
        setPreviewItem(null);
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
        console.log("Approving record:", record.id, "with comment:", comment)
        onOpenChange(false)
    }

    const handleItemClick = (item: SurveyItem) => {
        if (["image", "video", "file", "map"].includes(item.type)) {
            setPreviewItem(item)
        }
    }

    const handleCloseAll = () => {
        setPreviewItem(null)
        onOpenChange(false)
    }

    // Determine if we should show the persistent map
    const showPersistentMap = open && record;
    // Determine if we are previewing something else (image, video, file)
    const activePreview = previewItem && previewItem.type !== "map" ? previewItem : null;

    return (
        <Sheet open={open} onOpenChange={(val) => {
            if (!val) {
                handleCloseAll();
            }
        }}>
            {/* Persistent Map Module - Elevated to z-[100] to be above backdrop */}
            {showPersistentMap && (
                <div 
                    className="bottom-preview-module fixed inset-0 z-[100] bg-white dark:bg-zinc-950 flex flex-col animate-in fade-in slide-in-from-bottom duration-500 ease-in-out fill-mode-forwards"
                    style={{ 
                        width: "calc(100vw - 500px)", 
                        height: "100vh",
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
            )}

            <SheetContent 
                className="w-full sm:max-w-[500px] p-0 flex flex-col gap-0 border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl overflow-visible z-[200]"
                onPointerDownOutside={(e) => {
                    const target = e.target as HTMLElement;
                    if (target.closest('.bottom-preview-module')) {
                        e.preventDefault();
                    }
                }}
            >
                {/* Header section */}
                <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-30">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-14 w-14 border-2 border-white dark:border-zinc-800 shadow-sm">
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
                                variant={
                                    record.status === "Verified" ? "default" :
                                        record.status === "Invalid" ? "destructive" : "secondary"
                                }
                                className={cn(
                                    "px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest border-none shadow-none pointer-events-none select-none",
                                    record.status === "Verified" ? "bg-green-500 text-white dark:bg-green-600" :
                                        record.status === "Invalid" ? "bg-red-500 text-white dark:bg-red-600" :
                                            "bg-amber-500 text-white dark:bg-amber-600"
                                )}
                            >
                                {record.status}
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Content section - Style 5 (Feedback based) */}
                <ScrollArea className="flex-1">
                    {isReporting && (
                        <div className="sticky top-0 z-20 bg-amber-50 dark:bg-[#1a1608] border-b border-amber-100 dark:border-amber-900/30 px-6 py-2 flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-200 shadow-sm">
                            <div className="flex items-center gap-3">
                                <Checkbox 
                                    id="select-all" 
                                    checked={reportedIds.length === surveyData.length}
                                    onCheckedChange={toggleSelectAll}
                                    className="h-4 w-4 border-amber-400 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600 rounded"
                                />
                                <label 
                                    htmlFor="select-all" 
                                    className="text-[10px] font-bold text-amber-800 dark:text-amber-500 uppercase tracking-widest cursor-pointer"
                                >
                                    Report whole survey
                                </label>
                            </div>
                            <span className="text-[9px] font-bold text-amber-700 dark:text-amber-500 uppercase tracking-widest bg-white dark:bg-zinc-900 px-2 py-0.5 rounded-full border border-amber-100 dark:border-amber-900/40">
                                {reportedIds.length} SELECTED
                            </span>
                        </div>
                    )}
                    <div className="p-6">
                        <div className="mb-4 flex items-center justify-between text-xs font-semibold text-zinc-900 dark:text-zinc-50 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                            <span className="tracking-tight">{record.engagementType}</span>
                            <span className="text-zinc-300 dark:text-zinc-700 font-light">•</span>
                            <span className="tracking-tight text-zinc-500 font-medium">AZ-{record.azs}</span>
                        </div>

                        <div className="space-y-1">
                            {surveyData.map((item) => (
                                <div key={item.id} onClick={() => handleItemClick(item)} className="cursor-pointer">
                                    <SurveyCard
                                        item={item}
                                        style="style-5-feedback"
                                        showDetails={false}
                                        isReporting={isReporting}
                                        isSelected={reportedIds.includes(item.id) || previewItem?.id === item.id}
                                        onToggleSelect={() => toggleReportId(item.id)}
                                        disableDialog={true}
                                    />
                                </div>
                            ))}
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
                <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 z-20 flex items-center justify-between gap-4">
                    {/* Left: Navigation */}
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
                            onClick={onPrevious}
                            disabled={isFirst}
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
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
                                {record.status !== "Verified" && (
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
                                                className="h-9 px-5 text-xs font-bold shadow-md transition-all active:scale-[0.98] bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900"
                                                onClick={handleApprove}
                                            >
                                                <CheckCircle2 className="mr-2 h-3.5 w-3.5" /> Approve
                                            </Button>
                                        )}

                                        {/* Show Report Selected button when in reporting mode */}
                                        {isReporting && (
                                            <Button
                                                className={cn(
                                                    "h-9 px-5 text-xs font-bold shadow-md transition-all active:scale-[0.98] bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:text-white"
                                                )}
                                                onClick={() => { /* Report logic */ }}
                                                disabled={reportedIds.length === 0}
                                            >
                                                <AlertCircle className="mr-2 h-3.5 w-3.5" />
                                                {reportedIds.length === 0 ? "Report" : `Report Selected (${reportedIds.length})`}
                                            </Button>
                                        )}
                                    </div>
                                )}
                </div>

                {/* Overlay Preview Module (Image, Video, File) - Rendered INSIDE Sheet to be above backdrop */}
                {activePreview && (
                    <div 
                        key={activePreview.id}
                        className="bottom-preview-module fixed bottom-0 left-0 z-[300] bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.2)] transition-all duration-500 animate-in slide-in-from-bottom flex flex-col"
                        style={{ 
                            width: "calc(100vw - 500px)", 
                            height: "75vh",
                            pointerEvents: "auto"
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/50 relative z-[310]">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-white dark:bg-zinc-800 shadow-sm border border-zinc-200 dark:border-zinc-700">
                                    {activePreview.type === "image" && <ImageIcon className="h-4 w-4 text-zinc-500" />}
                                    {activePreview.type === "video" && <Play className="h-4 w-4 text-zinc-500" />}
                                    {activePreview.type === "file" && <FileText className="h-4 w-4 text-zinc-500" />}
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-tight">{activePreview.label}</h4>
                                    <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-widest">Previewing Attachment</p>
                                </div>
                            </div>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 relative z-[320] pointer-events-auto"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setPreviewItem(null);
                                }}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex-1 overflow-hidden p-0 flex items-center justify-center bg-zinc-100 dark:bg-zinc-900/50">
                            {activePreview.type === "image" && (
                                <div className="w-full h-full flex items-center justify-center">
                                    <img src={activePreview.answer as string} alt="Preview" className="w-full h-full object-contain shadow-2xl" />
                                </div>
                            )}
                            {activePreview.type === "video" && (
                                <div className="w-full h-full bg-black flex items-center justify-center">
                                    <video src={activePreview.answer as string} controls autoPlay className="w-full h-full object-contain" />
                                </div>
                            )}
                            {activePreview.type === "file" && (
                                <div className="w-full h-full flex flex-col bg-zinc-100 dark:bg-zinc-900">
                                    <iframe 
                                        src="https://docs.google.com/viewer?url=https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf&embedded=true" 
                                        className="w-full h-full border-none"
                                        title="PDF Preview"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    )
}
