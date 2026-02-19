
export interface EngagementRecord {
    id: number;
    submittedOn: Date;
    farmer: {
        name: string;
        id: string;
        avatar?: string;
        phoneNumber?: string;
    };
    engagementType: string;
    village: string;
    azs: number;
    surveyor: {
        name: string;
        id: string;
        phoneNumber?: string;
    };
    verified?: {
        verifier: string;
        date: Date;
        comment?: string;
    } | null;
    status: "Verified" | "Pending" | "Invalid";
    reportComment?: string;
    // Keeping some old fields for compatibility with the detail drawer if needed
    comments: string;
    approvalComment?: string;
    score: number;
}
