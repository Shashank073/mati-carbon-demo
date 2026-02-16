
export interface EngagementRecord {
    id: number;
    submittedOn: Date;
    farmer: {
        name: string;
        id: string;
        avatar?: string;
    };
    engagementType: string;
    village: string;
    azs: number;
    surveyor: {
        name: string;
        id: string;
    };
    verified?: {
        verifier: string;
        date: Date;
    } | null;
    status: "Verified" | "Pending" | "Invalid";
    // Keeping some old fields for compatibility with the detail drawer if needed
    comments: string;
    score: number;
}
