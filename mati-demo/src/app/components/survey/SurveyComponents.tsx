"use client";

import { useState } from "react";
import { ArrowLeft, MapPin, Calendar, DollarSign, Check, X, Star, Image as ImageIcon, Video, FileText, Download, Play, Phone, Mail, Copy, Ruler, Package, AlertCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

// --- Types ---
export type VariantType =
    | "text"
    | "badge"
    | "image"
    | "video"
    | "file"
    | "map"
    | "rating"
    | "currency"
    | "date"
    | "boolean"
    | "long-text"
    | "phone"
    | "email"
    | "area"
    | "quantity";

export interface SurveyItem {
    id: string;
    question: string;
    type: VariantType;
    answer: string | number | boolean | string[] | { name: string; size: string };
    meta?: string;
    label: string;
    description: string;
}

// --- Dummy Data ---
export const surveyData: SurveyItem[] = [
    {
        id: "1",
        question: "What is your primary feedback on the MRV system?",
        type: "text",
        answer: "The system provides accurate real-time data, but the dashboard load time could be improved in low-bandwidth areas.",
        label: "Text Input",
        description: "Best for displaying concise, single-line text data like names, titles, or short comments.",
    },
    {
        id: "2",
        question: "Select the crops currently being harvested:",
        type: "badge",
        answer: ["Rice (Basmati)", "Wheat", "Mustard"],
        label: "Multi-Select",
        description: "Ideal for rendering lists of tags, categories, or multiple selected attributes.",
    },
    {
        id: "3",
        question: "Upload a photo of the soil sample:",
        type: "image",
        answer: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop", // Placeholder
        label: "Image Upload",
        description: "Used to present visual assets, thumbnails, or document scans with a full-screen preview option.",
    },
    {
        id: "4",
        question: "Record a video of the crop health:",
        type: "video",
        answer: "https://www.w3schools.com/html/mov_bbb.mp4", // Placeholder video
        label: "Video Upload",
        description: "Suitable for showcasing video content, replays, or dynamic visual reports.",
    },
    {
        id: "5",
        question: "Attach the soil test report (PDF):",
        type: "file",
        answer: { name: "Soil_Analysis_Report_2024.pdf", size: "2.4 MB" },
        label: "File Attachment",
        description: "Best for listing downloadable documents, reports, or external references.",
    },
    {
        id: "6",
        question: "Confirm the location of the field:",
        type: "map",
        answer: "Anekal, Karnataka",
        meta: "12.7107° N, 77.6971° E",
        label: "Geolocation",
        description: "Designed to display geospatial coordinates or location names with an interactive map preview.",
    },
    {
        id: "7",
        question: "Measure the total cultivated area:",
        type: "area",
        answer: 4.5,
        meta: "Acres",
        label: "Area Measurement",
        description: "Used for displaying surface area measurements in specific units (e.g., Acres, Hectares).",
    },
    {
        id: "8",
        question: "Enter the quantity of seeds used:",
        type: "quantity",
        answer: 50,
        meta: "tons",
        label: "Quantity Input",
        description: "Best for weight, volume, or unit counts of materials or produce.",
    },
    {
        id: "9",
        question: "How would you rate the new fertilizer efficiency?",
        type: "rating",
        answer: 4, // out of 5
        label: "Rating Scale",
        description: "Perfect for visualizing satisfaction scores, product ratings, or quality levels.",
    },
    {
        id: "10",
        question: "Estimated cost of inputs per acre:",
        type: "currency",
        answer: 12500,
        meta: "INR",
        label: "Currency Input",
        description: "Use this format to display monetary values, prices, or financial figures clearly.",
    },
    {
        id: "11",
        question: "Date of sowing:",
        type: "date",
        answer: "2023-06-15",
        label: "Date Picker",
        description: "Standard format for presenting calendar dates, deadlines, or timestamps.",
    },
    {
        id: "12",
        question: "Did you verify the soil pH level?",

        type: "boolean",
        answer: true,
        label: "Boolean Toggle",
        description: "Best for indicating binary states like Yes/No, On/Off, or Active/Inactive.",
    },
    {
        id: "13",
        question: "Describe any pest issues observed:",
        type: "long-text",
        answer: "Observed minor yellowing of leaves in the north-east corner. Suspected nitrogen deficiency or early signs of stem borer. Recommend immediate testing.",
        label: "Text Area",
        description: "Optimal for displaying long-form content, paragraphs, or detailed descriptions.",
    },
    {
        id: "14",
        question: "Provided Contact Number:",
        type: "phone",
        answer: "+91 98765 43210",
        label: "Phone Number",
        description: "Standard layout for displaying contact phone numbers.",
    },
    {
        id: "15",
        question: "Provided Email Address:",
        type: "email",
        answer: "agro.support@example.com",
        label: "Email Address",
        description: "Standard layout for displaying email addresses.",
    }
];

// --- Copy Button Helper ---
const CopyableText = ({ text, children, icon }: { text: string; children: React.ReactNode; icon?: React.ReactNode }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="group flex items-center gap-2 relative w-full min-w-0">
            {icon && <div className="flex-shrink-0 text-zinc-500">{icon}</div>}
            <div className="flex-1 min-w-0 pr-10">
                {children}
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-0 top-1/2 -translate-y-1/2 flex items-center">
                <Button
                    variant="secondary"
                    size="icon"
                    className="h-7 w-7 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-700"
                    onClick={handleCopy}
                >
                    {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5 text-zinc-400" />}
                </Button>
            </div>
        </div>
    );
};


// --- Survey Card Component ---
export const SurveyCard = ({
    item,
    style,
    showDetails,
    isReporting = false,
    isSelected = false,
    onToggleSelect
}: {
    item: SurveyItem;
    style: string;
    showDetails: boolean;
    isReporting?: boolean;
    isSelected?: boolean;
    onToggleSelect?: (id: string) => void;
}) => {
    // Dynamic Styles based on selection
    const cardStyles = cn(
        "relative overflow-hidden transition-all duration-300",
        style === "current" && "bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-xl flex",
        style === "style-1" && "bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-950 border-transparent shadow-lg hover:scale-[1.02] rounded-2xl ring-1 ring-zinc-200 dark:ring-zinc-800 p-5",
        style === "style-2" && "bg-transparent border border-zinc-200 dark:border-zinc-800 shadow-none rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 p-5",
        style === "style-3" && "bg-transparent border-0 border-b border-zinc-200 dark:border-zinc-800 shadow-none rounded-none p-4 px-0",
        style === "style-5" && "bg-transparent border-0 border-b border-zinc-100 dark:border-zinc-800 shadow-none rounded-none py-3 px-0"
    );

    const questionStyles = cn(
        "font-bold leading-snug",
        style !== "style-5" && "mb-2",
        style === "current" && "text-base text-zinc-900 dark:text-zinc-50",
        style === "style-1" && "text-lg text-zinc-800 dark:text-zinc-100",
        style === "style-2" && "text-sm text-zinc-900 dark:text-zinc-50 font-semibold mb-3",
        style === "style-3" && "text-base font-medium text-zinc-900 dark:text-zinc-100 mb-1",
        style === "style-5" && "text-[13px] font-normal text-zinc-500 dark:text-zinc-400 leading-tight"
    );

    const renderContent = () => {
        switch (item.type) {
            case "text":
            case "long-text":
            case "long-text":
                return (
                    <CopyableText text={item.answer as string}>
                        <p className={cn(
                            "text-zinc-500 dark:text-zinc-400 leading-relaxed",
                            style === "style-5" ? "text-base font-semibold text-zinc-900 dark:text-zinc-100 leading-snug" : "text-sm"
                        )}>{item.answer as string}</p>
                    </CopyableText>
                );

            case "badge":
                if (style === "style-5") {
                    return (
                        <div className="flex flex-wrap gap-1.5">
                            {(item.answer as string[]).map((badge, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800">
                                    {badge}
                                </Badge>
                            ))}
                        </div>
                    );
                }
                return (
                    <div className="flex flex-wrap gap-2">
                        {(item.answer as string[]).map((badge, idx) => (
                            <Badge key={idx} variant="secondary" className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700">
                                {badge}
                            </Badge>
                        ))}
                    </div>
                );

            case "image":
                if (style === "style-5") {
                    const fileName = (item.answer as string).split('/').pop()?.split('?')[0] || "image.jpg";
                    return (
                        <Dialog>
                            <HoverCard openDelay={200}>
                                <HoverCardTrigger asChild>
                                    <div className="group relative w-full">
                                        <DialogTrigger asChild>
                                            <div className="flex items-center p-3 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer pr-10">
                                                <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0 border border-zinc-200 dark:border-zinc-700 bg-zinc-200 mr-3">
                                                    <img src={item.answer as string} alt="Thumbnail" className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{fileName}</p>
                                                    <p className="text-xs text-zinc-500">2.4 MB</p>
                                                </div>
                                            </div>
                                        </DialogTrigger>
                                        <div className="absolute top-[50%] -translate-y-[50%] right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-zinc-200 dark:hover:bg-zinc-700">
                                                <Download className="h-4 w-4 text-zinc-500" />
                                            </Button>
                                        </div>
                                    </div>
                                </HoverCardTrigger>
                                <HoverCardContent className="w-64 p-0 overflow-hidden border-none shadow-xl" side="left" align="start" sideOffset={10}>
                                    <img src={item.answer as string} alt="Preview" className="w-full h-auto" />
                                </HoverCardContent>
                            </HoverCard>
                            <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-none shadow-none">
                                <DialogTitle className="sr-only">Full Image View</DialogTitle>
                                <DialogDescription className="sr-only">Detailed view of the uploaded survey image</DialogDescription>
                                <img src={item.answer as string} alt="Full" className="w-full h-auto rounded-lg shadow-2xl" />
                            </DialogContent>
                        </Dialog>
                    );
                }
                return (
                    <Dialog>
                        <div className="space-y-2 group relative">
                            <DialogTrigger asChild>
                                <div className="relative aspect-video w-full overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-800 cursor-zoom-in">
                                    <img src={item.answer as string} alt="Survey upload" className="object-cover w-full h-full" />
                                </div>
                            </DialogTrigger>

                            {/* Download Button - Top Right */}
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                <Button variant="secondary" size="icon" className="h-8 w-8 shadow-sm bg-white/90 dark:bg-zinc-800/90 hover:bg-white dark:hover:bg-zinc-700">
                                    <Download className="h-4 w-4 text-zinc-700 dark:text-zinc-200" />
                                </Button>
                            </div>
                        </div>
                        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-none shadow-none">
                            <DialogTitle className="sr-only">Survey Image Zoom</DialogTitle>
                            <DialogDescription className="sr-only">Zoomed in view of the submission image</DialogDescription>
                            <img src={item.answer as string} alt="Survey upload full" className="w-full h-auto rounded-lg shadow-2xl" />
                        </DialogContent>
                    </Dialog>
                );

            case "video":
                if (style === "style-5") {
                    const fileName = (item.answer as string).split('/').pop()?.split('?')[0] || "video.mp4";
                    return (
                        <Dialog>
                            <HoverCard openDelay={200}>
                                <HoverCardTrigger asChild>
                                    <div className="group relative w-full">
                                        <DialogTrigger asChild>
                                            <div className="flex items-center p-3 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer pr-10">
                                                <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0 border border-zinc-200 dark:border-zinc-700 bg-zinc-900 flex items-center justify-center mr-3">
                                                    <Play className="w-4 h-4 text-white fill-white" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{fileName}</p>
                                                    <p className="text-xs text-zinc-500">12.8 MB</p>
                                                </div>
                                            </div>
                                        </DialogTrigger>
                                        <div className="absolute top-[50%] -translate-y-[50%] right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-zinc-200 dark:hover:bg-zinc-700">
                                                <Download className="h-4 w-4 text-zinc-500" />
                                            </Button>
                                        </div>
                                    </div>
                                </HoverCardTrigger>
                                <HoverCardContent className="w-64 p-0 overflow-hidden border-none shadow-xl" side="left" align="start" sideOffset={10}>
                                    <div className="relative w-full aspect-video bg-black">
                                        <video src={item.answer as string} className="w-full h-full object-cover" />
                                    </div>
                                </HoverCardContent>
                            </HoverCard>
                            <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-none shadow-none">
                                <DialogTitle className="sr-only">Video Preview</DialogTitle>
                                <DialogDescription className="sr-only">Watching the uploaded survey video in full size</DialogDescription>
                                <video src={item.answer as string} controls autoPlay className="w-full h-auto rounded-lg shadow-2xl" />
                            </DialogContent>
                        </Dialog>
                    );
                }
                return (
                    <Dialog>
                        <div className="space-y-2 group relative">
                            <DialogTrigger asChild>
                                <div className="relative aspect-video w-full overflow-hidden rounded-md bg-zinc-900 flex items-center justify-center cursor-pointer">
                                    <video src={item.answer as string} className="w-full h-full object-cover opacity-80" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full group-hover:scale-110 transition-transform">
                                            <Play className="h-6 w-6 text-white fill-white" />
                                        </div>
                                    </div>
                                </div>
                            </DialogTrigger>

                            {/* Download Button - Top Right */}
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                <Button variant="secondary" size="icon" className="h-8 w-8 shadow-sm bg-white/90 dark:bg-zinc-800/90 hover:bg-white dark:hover:bg-zinc-700">
                                    <Download className="h-4 w-4 text-zinc-700 dark:text-zinc-200" />
                                </Button>
                            </div>
                        </div>
                        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-none shadow-none">
                            <DialogTitle className="sr-only">Video Player</DialogTitle>
                            <DialogDescription className="sr-only">Full screen survey video player</DialogDescription>
                            <video src={item.answer as string} controls autoPlay className="w-full h-auto rounded-lg shadow-2xl" />
                        </DialogContent>
                    </Dialog>
                );

            case "file":
                return (
                    <div className="group relative">
                        <div className="flex items-center p-3 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer pr-10">
                            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-md mr-3">
                                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{(item.answer as { name: string }).name}</p>
                                <p className="text-xs text-zinc-500">{(item.answer as { size: string }).size}</p>
                            </div>
                        </div>
                        {/* Download Button - Top Right (inside the card technically, but absolutely positioned relative to container) */}
                        <div className="absolute top-[50%] -translate-y-[50%] right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-zinc-200 dark:hover:bg-zinc-700">
                                <Download className="h-4 w-4 text-zinc-500" />
                            </Button>
                        </div>
                    </div>
                );

            case "map":
                return (
                    <HoverCard openDelay={200}>
                        <HoverCardTrigger asChild>
                            <div className="flex items-start gap-3 p-3 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-help">
                                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-md text-blue-600 dark:text-blue-400">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{item.answer as string}</p>
                                    {item.meta && <p className="text-xs text-zinc-500">{item.meta}</p>}
                                </div>
                            </div>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80 p-0 overflow-hidden border-none shadow-2xl" side="left" align="start" sideOffset={10}>
                            <div className="relative h-40 bg-zinc-100">
                                <img
                                    src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1000&auto=format&fit=crop"
                                    alt="Map Preview"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="bg-black/50 text-white px-2 py-1 rounded text-xs">Map View</span>
                                </div>
                            </div>
                            <div className="p-3 bg-white dark:bg-zinc-950">
                                <p className="text-sm font-semibold">{item.answer as string}</p>
                                <p className="text-xs text-zinc-500 mt-1">{item.meta}</p>
                            </div>
                        </HoverCardContent>
                    </HoverCard>
                );

            case "rating":
                return (
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={cn(
                                    "w-5 h-5",
                                    star <= (item.answer as number) ? "fill-amber-400 text-amber-400" : "text-zinc-300 dark:text-zinc-700"
                                )}
                            />
                        ))}
                    </div>
                );

            case "currency":
                return (
                    <div className={cn(
                        "flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100",
                        style === "style-5" && "text-base"
                    )}>
                        <DollarSign className={cn("w-5 h-5 text-zinc-500", style === "style-5" && "w-4 h-4")} />
                        {(item.answer as number).toLocaleString()} <span className="text-xs font-normal text-zinc-500 uppercase">{item.meta}</span>
                    </div>
                );

            case "date":
                return (
                    <div className={cn(
                        "flex items-center gap-2 text-zinc-700 dark:text-zinc-300",
                        style === "style-5" && "text-zinc-900 dark:text-zinc-100 font-semibold text-base"
                    )}>
                        <Calendar className="w-4 h-4 text-zinc-500" />
                        {style === "style-5"
                            ? new Date(item.answer as string).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
                            : new Date(item.answer as string).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
                        }
                    </div>
                );

            case "boolean":
                if (style === "style-5") {
                    return (
                        <div className={cn(
                            "inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide",
                            item.answer
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        )}>
                            {item.answer ? "Yes" : "No"}
                        </div>
                    );
                }
                return (
                    <div className={cn(
                        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium",
                        item.answer
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    )}>
                        {item.answer ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        {item.answer ? "Yes" : "No"}
                    </div>
                );

            case "phone":
                return (
                    <CopyableText text={item.answer as string} icon={<Phone className="w-4 h-4" />}>
                        <span className={cn(
                            "font-medium text-zinc-900 dark:text-zinc-100",
                            style === "style-5" && "font-semibold text-base"
                        )}>{item.answer as string}</span>
                    </CopyableText>
                );

            case "email":
                return (
                    <CopyableText text={item.answer as string} icon={<Mail className="w-4 h-4" />}>
                        <span className={cn(
                            "font-medium text-zinc-900 dark:text-zinc-100",
                            style === "style-5" && "font-semibold text-base"
                        )}>{item.answer as string}</span>
                    </CopyableText>
                );

            case "area":
                return (
                    <div className={cn(
                        "flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100",
                        style === "style-5" && "text-base"
                    )}>
                        <Ruler className={cn("w-5 h-5 text-zinc-500", style === "style-5" && "w-4 h-4")} />
                        {item.answer as number} <span className="text-xs font-normal text-zinc-500 uppercase">{item.meta}</span>
                    </div>
                );

            case "quantity":
                return (
                    <div className={cn(
                        "flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100",
                        style === "style-5" && "text-base"
                    )}>
                        <Package className={cn("w-5 h-5 text-zinc-500", style === "style-5" && "w-4 h-4")} />
                        {item.answer as number} <span className="text-xs font-normal text-zinc-500 uppercase">{item.meta}</span>
                    </div>
                );

            default:
                // Text, long-text, phone, email, etc.
                if (style === "style-5") {
                    return <p className="font-semibold text-zinc-900 dark:text-zinc-100 text-base leading-snug">{item.answer as string}</p>;
                }
                return null;
        }
    };

    // Unified render structure for all styles

    const renderCardContent = () => {
        if (style === "current") {
            return (
                <>
                    <div className="w-14 flex-shrink-0 flex items-center justify-center border-r border-zinc-100 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50">
                        <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{item.id}</span>
                    </div>
                    <div className="flex-1 p-4 min-w-0">
                        <h3 className={questionStyles}>
                            {item.question}
                        </h3>
                        <div>
                            {renderContent()}
                        </div>
                    </div>
                </>
            );
        }

        // Standard layout for Modern/Minimal
        return (
            <div className="w-full">
                <div className={cn(
                    "flex items-center gap-2",
                    style === "style-5" ? "mb-1" : "mb-3"
                )}>
                    {/* Only show ID if NOT Style 3 or Style 5 */}
                    {(style !== "style-3" && style !== "style-5") && (
                        <span className={cn(
                            "flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold",
                            style === "style-1" && "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900",
                            style === "style-2" && "text-zinc-400 border border-zinc-200 dark:border-zinc-800"
                        )}>
                            {item.id}
                        </span>
                    )}
                    <h3 className={questionStyles}>
                        {item.question}
                    </h3>
                </div>
                <div className={cn((style !== "style-3" && style !== "style-5") && "pl-8")}>
                    {renderContent()}
                </div>
            </div>
        );
    };

    return (
        <div className={cn("w-full transition-all", style === "style-5" ? "mb-0" : "mb-2")}>
            {(showDetails && style !== "style-5") && (
                <div className="mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 pl-1">{item.label}</span>
                </div>
            )}

            <Card className={cn(
                cardStyles,
                (style !== "current" && style !== "style-3" && style !== "style-5") && "p-4",
                isReporting && isSelected && (
                    style === "style-5"
                        ? "bg-red-50/50 dark:bg-red-900/10 border-l-2 border-l-red-500 pl-3 -ml-1 transition-all"
                        : "ring-1 ring-red-500 bg-red-50/30 dark:bg-red-900/10"
                )
            )}>
                {isReporting ? (
                    <div className="flex items-start gap-4">
                        <div className="pt-1 flex-shrink-0">
                            <Checkbox
                                checked={isSelected}
                                onCheckedChange={() => onToggleSelect?.(item.id)}
                                className="w-4 h-4 border-zinc-300 dark:border-zinc-700 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            {renderCardContent()}
                        </div>
                    </div>
                ) : renderCardContent()}
            </Card>

            {(showDetails && style !== "style-5") && (
                <div className="mt-2">
                    <p className="text-xs text-zinc-400 italic pl-1">
                        <span className="font-semibold not-italic">Usage:</span> {item.description}
                    </p>
                </div>
            )}
        </div>
    );
};

// --- Style 4: Bulk Selection Card ---
export const BulkSubmissionCard = ({
    submissionId,
    data,
    showHeader = true,
    compact = false,
    isReporting = false,
    selectedIds = [],
    onToggleId
}: {
    submissionId: number;
    data: SurveyItem[];
    showHeader?: boolean;
    compact?: boolean;
    isReporting?: boolean;
    selectedIds?: string[];
    onToggleId?: (id: string) => void;
}) => {

    const renderCompactValue = (item: SurveyItem) => {
        switch (item.type) {
            case "image":
                const imgFileName = (item.answer as string).split('/').pop()?.split('?')[0] || "image.jpg";
                return (
                    <Dialog>
                        <HoverCard openDelay={200} closeDelay={0}>
                            <HoverCardTrigger asChild>
                                <div className="group relative w-full">
                                    <DialogTrigger asChild>
                                        <div className="flex items-center p-3 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer pr-10">
                                            <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0 border border-zinc-200 dark:border-zinc-700 bg-zinc-200 mr-3">
                                                <img src={item.answer as string} alt="Thumbnail" className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">{imgFileName}</p>
                                                <p className="text-xs text-zinc-500 uppercase">2.4 MB</p>
                                            </div>
                                        </div>
                                    </DialogTrigger>
                                    <div className="absolute top-[50%] -translate-y-[50%] right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-zinc-200 dark:hover:bg-zinc-700">
                                            <Download className="h-4 w-4 text-zinc-500" />
                                        </Button>
                                    </div>
                                </div>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-64 p-0 overflow-hidden border-none shadow-xl" side="left" align="start" sideOffset={10}>
                                <img src={item.answer as string} alt="Preview" className="w-full h-auto" />
                            </HoverCardContent>
                        </HoverCard>
                        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-none shadow-none">
                            <DialogTitle className="sr-only">Bulk Image View</DialogTitle>
                            <DialogDescription className="sr-only">Enlarged view of the bulk submitted image</DialogDescription>
                            <img src={item.answer as string} alt="Full" className="w-full h-auto rounded-lg shadow-2xl" />
                        </DialogContent>
                    </Dialog>
                );
            case "video":
                const vidFileName = (item.answer as string).split('/').pop()?.split('?')[0] || "video.mp4";
                return (
                    <Dialog>
                        <HoverCard openDelay={200} closeDelay={0}>
                            <HoverCardTrigger asChild>
                                <div className="group relative w-full">
                                    <DialogTrigger asChild>
                                        <div className="flex items-center p-3 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer pr-10">
                                            <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0 border border-zinc-200 dark:border-zinc-700 bg-zinc-900 flex items-center justify-center mr-3">
                                                <Play className="w-4 h-4 text-white fill-white" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">{vidFileName}</p>
                                                <p className="text-xs text-zinc-500 uppercase">12.8 MB</p>
                                            </div>
                                        </div>
                                    </DialogTrigger>
                                    <div className="absolute top-[50%] -translate-y-[50%] right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-zinc-200 dark:hover:bg-zinc-700">
                                            <Download className="h-4 w-4 text-zinc-500" />
                                        </Button>
                                    </div>
                                </div>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-64 p-0 overflow-hidden border-none shadow-xl" side="left" align="start" sideOffset={10}>
                                <div className="relative w-full aspect-video bg-black">
                                    <video src={item.answer as string} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Play className="w-8 h-8 text-white/50" />
                                    </div>
                                </div>
                            </HoverCardContent>
                        </HoverCard>
                        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-none shadow-none">
                            <DialogTitle className="sr-only">Bulk Video View</DialogTitle>
                            <DialogDescription className="sr-only">Full screen playback of the bulk submitted video</DialogDescription>
                            <video src={item.answer as string} controls autoPlay loop className="w-full h-auto rounded-lg shadow-2xl" />
                        </DialogContent>
                    </Dialog>
                );
            case "file":
                return (
                    <div className="group relative w-full">
                        <div className="flex items-center p-3 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer pr-10">
                            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded flex-shrink-0 text-blue-600 dark:text-blue-400 mr-3">
                                <FileText className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">{(item.answer as { name: string }).name}</p>
                                <p className="text-xs text-zinc-500 uppercase">{(item.answer as { size: string }).size}</p>
                            </div>
                        </div>
                        <div className="absolute top-[50%] -translate-y-[50%] right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-zinc-200 dark:hover:bg-zinc-700">
                                <Download className="h-4 w-4 text-zinc-500" />
                            </Button>
                        </div>
                    </div>
                );
            case "map":
                return (
                    <HoverCard openDelay={200}>
                        <HoverCardTrigger asChild>
                            <div className="flex items-center p-3 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors w-full cursor-help group">
                                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded flex-shrink-0 text-green-600 dark:text-green-400 mr-3">
                                    <MapPin className="h-5 w-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">{item.answer as string}</p>
                                    <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-tight truncate">{item.meta || "GEO COORD"}</p>
                                </div>
                            </div>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80 p-0 overflow-hidden border-none shadow-2xl" side="left" align="start" sideOffset={10}>
                            <div className="relative h-40 bg-zinc-100">
                                <img
                                    src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1000&auto=format&fit=crop"
                                    alt="Map Preview"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="bg-black/50 text-white px-2 py-1 rounded text-xs">Map View</span>
                                </div>
                            </div>
                            <div className="p-3 bg-white dark:bg-zinc-950">
                                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{item.answer as string}</p>
                                <p className="text-xs text-zinc-500 mt-1">{item.meta || "GEO COORD"}</p>
                            </div>
                        </HoverCardContent>
                    </HoverCard>
                );
            case "badge":
                return (
                    <div className="flex flex-wrap gap-1.5">
                        {(item.answer as string[]).map((badge, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 font-semibold px-2">
                                {badge}
                            </Badge>
                        ))}
                    </div>
                );
            case "rating":
                return (
                    <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={cn(
                                    "w-4 h-4",
                                    star <= (item.answer as number) ? "fill-amber-400 text-amber-400" : "text-zinc-200 dark:text-zinc-800"
                                )}
                            />
                        ))}
                    </div>
                );
            case "boolean":
                return (
                    <div className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider",
                        item.answer
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    )}>
                        {item.answer ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        {item.answer ? "Yes" : "No"}
                    </div>
                );
            case "currency":
            case "area":
            case "quantity":
                return (
                    <div className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                        {item.type === "area" && <Ruler className="w-4 h-4 text-zinc-500" />}
                        {item.type === "quantity" && <Package className="w-4 h-4 text-zinc-500" />}
                        {item.type === "currency" && <DollarSign className="w-4 h-4 text-zinc-500" />}
                        <span className="text-lg tabular-nums tracking-tight">{item.answer as number}</span>
                        {(item.meta || item.type === "currency") && (
                            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wide">{item.meta || "USD"}</span>
                        )}
                    </div>
                );
            case "date":
                return (
                    <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                        <Calendar className="w-4 h-4 text-zinc-500" />
                        <span className="font-semibold text-base leading-snug">
                            {new Date(item.answer as string).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                            })}
                        </span>
                    </div>
                );
            case "phone":
                return (
                    <CopyableText text={item.answer as string} icon={<Phone className="w-4 h-4 text-zinc-500" />}>
                        <p className="font-semibold text-zinc-900 dark:text-zinc-100 text-base leading-snug break-all">
                            {item.answer as string}
                        </p>
                    </CopyableText>
                );
            case "email":
                return (
                    <CopyableText text={item.answer as string} icon={<Mail className="w-4 h-4 text-zinc-500" />}>
                        <p className="font-semibold text-zinc-900 dark:text-zinc-100 text-base leading-snug break-all">
                            {item.answer as string}
                        </p>
                    </CopyableText>
                );
            default:
                // Text, long-text, phone, email, etc.
                return (
                    <CopyableText text={item.answer as string}>
                        <p className="font-semibold text-zinc-900 dark:text-zinc-100 text-base leading-snug">
                            {item.answer as string}
                        </p>
                    </CopyableText>
                );
        }
    };

    return (
        <Card className={cn(
            "p-0 md:p-4 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-sm transition-shadow",
            compact ? "border-0 shadow-none bg-transparent" : "border hover:shadow-md"
        )}>
            {showHeader && (
                <div className="flex items-center justify-between mb-4 border-b border-zinc-100 dark:border-zinc-900 pb-3 p-4 md:p-0">
                    <div className="flex items-center gap-3">
                        <Badge variant="outline" className="bg-zinc-50 dark:bg-zinc-900 h-6 px-2 min-w-8 justify-center font-bold">#{submissionId}</Badge>
                        <span className="text-xs text-zinc-400 font-medium">Submitted 2 mins ago</span>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="h-7 text-xs text-green-600 hover:text-green-700 hover:bg-green-50"><Check className="w-3 h-3 mr-1" /> Approve</Button>
                        <Button variant="ghost" size="sm" className="h-7 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"><X className="w-3 h-3 mr-1" /> Reject</Button>
                    </div>
                </div>
            )}

            <div className={cn(
                "grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5",
                compact ? "p-0" : "p-4 md:p-0"
            )}>
                {data.map((item) => {
                    const isSelected = selectedIds.includes(item.id);
                    return (
                        <div key={item.id} className={cn(
                            "flex flex-col gap-1 min-w-0 transition-colors p-2 -m-2 rounded-lg",
                            isReporting && isSelected && "bg-red-50/50 dark:bg-red-900/10"
                        )}>
                            <div className="flex items-start gap-3">
                                {isReporting && (
                                    <div className="pt-1 flex-shrink-0">
                                        <Checkbox
                                            checked={isSelected}
                                            onCheckedChange={() => onToggleId?.(item.id)}
                                            className="w-4 h-4 border-zinc-300 dark:border-zinc-700 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
                                        />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0 flex flex-col gap-1">
                                    <span className="text-[13px] text-zinc-500 font-normal pr-2" title={item.question}>
                                        {item.question}
                                    </span>
                                    <div className="min-h-[24px] flex items-center">
                                        {renderCompactValue(item)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}

