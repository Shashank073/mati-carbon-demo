"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import MapEditor from "@/components/map/MapEditor";
import { MapMode } from "@/types/map";

function MapEditorContent() {
    const searchParams = useSearchParams();
    const modeParam = searchParams.get("mode");
    const farmerId = searchParams.get("farmerId") || undefined;
    const mode: MapMode = modeParam === "ml" ? "ml" : "manual";

    return (
        <div className="h-screen w-full overflow-hidden">
            <MapEditor
                mode={mode}
                farmerId={farmerId}
                onSave={(plots: any[]) => console.log("Saved plots:", plots)}
            />
        </div>
    );
}

export default function MapEditorPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading Editor...</div>}>
            <MapEditorContent />
        </Suspense>
    );
}
