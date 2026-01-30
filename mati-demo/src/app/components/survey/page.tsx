"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Calendar, DollarSign, Check, X, Star, Image as ImageIcon, Video, FileText, Download, Play, Phone, Mail, Copy, Ruler, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

// --- Types ---
type VariantType =
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

interface SurveyItem {
    id: string;
    question: string;
    type: VariantType;
    answer: any;
    meta?: string;
    label: string;
    description: string;
}

// --- Dummy Data ---
const surveyData: SurveyItem[] = [
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
        <div className="group flex items-center gap-2 relative w-full">
            {icon && <div className="flex-shrink-0 text-zinc-500">{icon}</div>}
            <div className="flex-1 min-w-0">
                {children}
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm pl-2">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    onClick={handleCopy}
                >
                    {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3 text-zinc-400" />}
                </Button>
            </div>
        </div>
    );
};


// --- Survey Card Component ---
const SurveyCard = ({ item, style, showDetails }: { item: SurveyItem; style: string; showDetails: boolean }) => {
    // Dynamic Styles based on selection
    const cardStyles = cn(
        "relative overflow-hidden transition-all duration-300",
        style === "current" && "bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-xl flex",
        style === "style-1" && "bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-950 border-transparent shadow-lg hover:scale-[1.02] rounded-2xl ring-1 ring-zinc-200 dark:ring-zinc-800 p-5",
        style === "style-2" && "bg-transparent border border-zinc-200 dark:border-zinc-800 shadow-none rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 p-5",
        style === "style-3" && "bg-transparent border-0 border-b border-zinc-200 dark:border-zinc-800 shadow-none rounded-none p-4 px-0"
    );

    const questionStyles = cn(
        "font-bold mb-2 leading-snug",
        style === "current" && "text-base text-zinc-900 dark:text-zinc-50",
        style === "style-1" && "text-lg text-zinc-800 dark:text-zinc-100",
        style === "style-2" && "text-sm text-zinc-900 dark:text-zinc-50 font-semibold mb-3",
        style === "style-3" && "text-base font-medium text-zinc-900 dark:text-zinc-100 mb-1"
    );

    const renderContent = () => {
        switch (item.type) {
            case "text":
            case "long-text":
                return (
                    <CopyableText text={item.answer}>
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">{item.answer}</p>
                    </CopyableText>
                );

            case "badge":
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
                return (
                    <Dialog>
                        <div className="space-y-2 group relative">
                            <DialogTrigger asChild>
                                <div className="relative aspect-video w-full overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-800 cursor-zoom-in">
                                    <img src={item.answer} alt="Survey upload" className="object-cover w-full h-full" />
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
                            <img src={item.answer} alt="Survey upload full" className="w-full h-auto rounded-lg shadow-2xl" />
                        </DialogContent>
                    </Dialog>
                );

            case "video":
                return (
                    <Dialog>
                        <div className="space-y-2 group relative">
                            <DialogTrigger asChild>
                                <div className="relative aspect-video w-full overflow-hidden rounded-md bg-zinc-900 flex items-center justify-center cursor-pointer">
                                    <video src={item.answer} className="w-full h-full object-cover opacity-80" />
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
                            <video src={item.answer} controls autoPlay className="w-full h-auto rounded-lg shadow-2xl" />
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
                                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{item.answer.name}</p>
                                <p className="text-xs text-zinc-500">{item.answer.size}</p>
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
                    <HoverCard openDelay={0}>
                        <HoverCardTrigger asChild>
                            <div className="flex items-start gap-3 p-3 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-help">
                                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-md text-blue-600 dark:text-blue-400">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-medium text-zinc-900 dark:text-zinc-100">{item.answer}</p>
                                    {item.meta && <p className="text-xs text-zinc-500">{item.meta}</p>}
                                </div>
                            </div>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80 p-0 overflow-hidden" side="bottom" align="start" sideOffset={10}>
                            <div className="relative h-40 bg-zinc-100">
                                <img
                                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=600&auto=format&fit=crop"
                                    alt="Map Preview"
                                    className="w-full h-full object-cover opacity-80"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="bg-black/50 text-white px-2 py-1 rounded text-xs">Map View</span>
                                </div>
                            </div>
                            <div className="p-3 bg-white dark:bg-zinc-950">
                                <p className="text-sm font-semibold">{item.answer}</p>
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
                                    star <= item.answer ? "fill-amber-400 text-amber-400" : "text-zinc-300 dark:text-zinc-700"
                                )}
                            />
                        ))}
                    </div>
                );

            case "currency":
                return (
                    <div className="flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                        <DollarSign className="w-5 h-5 text-zinc-500" />
                        {item.answer.toLocaleString()} <span className="text-xs font-normal text-zinc-500 uppercase">{item.meta}</span>
                    </div>
                );

            case "date":
                return (
                    <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                        <Calendar className="w-4 h-4 text-zinc-500" />
                        {new Date(item.answer).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                );

            case "boolean":
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
                    <CopyableText text={item.answer} icon={<Phone className="w-4 h-4 text-zinc-500" />}>
                        <span className="font-medium text-zinc-900 dark:text-zinc-100">{item.answer}</span>
                    </CopyableText>
                );

            case "email":
                return (
                    <CopyableText text={item.answer} icon={<Mail className="w-4 h-4" />}>
                        <span className="font-medium text-zinc-900 dark:text-zinc-100">{item.answer}</span>
                    </CopyableText>
                );

            case "area":
                return (
                    <div className="flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                        <Ruler className="w-5 h-5 text-zinc-500" />
                        {item.answer} <span className="text-xs font-normal text-zinc-500 uppercase">{item.meta}</span>
                    </div>
                );

            case "quantity":
                return (
                    <div className="flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                        <Package className="w-5 h-5 text-zinc-500" />
                        {item.answer} <span className="text-xs font-normal text-zinc-500 uppercase">{item.meta}</span>
                    </div>
                );

            default:
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
                <div className="flex items-center gap-2 mb-3">
                    {/* Only show ID if NOT Style 3 */}
                    {style !== "style-3" && (
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
                <div className={cn(style !== "style-3" && "pl-8")}>
                    {renderContent()}
                </div>
            </div>
        );
    };

    return (
        <div className="w-full mb-2">
            {showDetails && (
                <div className="mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 pl-1">{item.label}</span>
                </div>
            )}

            <Card className={cn(cardStyles, style !== "current" && "p-4")}>
                {renderCardContent()}
            </Card>

            {showDetails && (
                <div className="mt-2">
                    <p className="text-xs text-zinc-400 italic pl-1">
                        <span className="font-semibold not-italic">Usage:</span> {item.description}
                    </p>
                </div>
            )}
        </div>
    );
};

// --- Main Page Component ---
export default function SurveyPage() {
    const [currentStyle, setCurrentStyle] = useState<"current" | "style-1" | "style-2" | "style-3">("current");
    const [showDetails, setShowDetails] = useState(true);

    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/components">
                            <Button variant="outline" size="icon" className="h-10 w-10 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Survey Responses</h1>
                            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Review feedback across various data types.</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-6">
                        {/* Visibility Toggle */}
                        <div className="flex items-center space-x-2">
                            <Switch id="show-details" checked={showDetails} onCheckedChange={setShowDetails} />
                            <label htmlFor="show-details" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 cursor-pointer select-none">Show Usage Details</label>
                        </div>

                        {/* Style Selector */}
                        <div className="flex items-center gap-3">
                            <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Card Style:</label>
                            <Select value={currentStyle} onValueChange={(val: any) => setCurrentStyle(val)}>
                                <SelectTrigger className="w-[180px] bg-white dark:bg-zinc-900">
                                    <SelectValue placeholder="Select style" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="current">Current</SelectItem>
                                    <SelectItem value="style-1">Style 1</SelectItem>
                                    <SelectItem value="style-2">Style 2</SelectItem>
                                    <SelectItem value="style-3">Style 3</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Filters/Grid */}
                <div className="flex flex-col max-w-3xl mx-auto gap-6 transition-all duration-500">
                    {surveyData.map((item) => (
                        <SurveyCard key={item.id} item={item} style={currentStyle} showDetails={showDetails} />
                    ))}
                </div>
            </div>
        </main>
    );
}
