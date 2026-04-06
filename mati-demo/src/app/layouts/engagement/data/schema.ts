
export interface VerificationComment {
    id: string;
    verifier: string;
    date: Date;
    text: string;
}

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
    base?: string;
    block?: string;
    state?: string;
    country?: string;
    azs: number;
    azName?: string;
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
    verificationComments?: VerificationComment[];
    score: number;
}
