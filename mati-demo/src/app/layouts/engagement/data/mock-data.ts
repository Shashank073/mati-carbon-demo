import { EngagementRecord } from "./schema";

const baseNames = ["Farmer A", "Farmer B", "Farmer C", "Farmer D", "Farmer E", "Farmer F", "Farmer G", "Farmer H"];
const surveyorNames = ["Surveyor A", "Surveyor B", "Surveyor C"];
const verifierNames = ["Verifier B", "Verifier E", "Verifier G", "Verifier H", "Verifier I"];
const villages = ["Village A", "Village B", "Village C"];
const engagementTypes = ["Engagement 1", "Con. Engagement 1", "Engagement 4", "Engagement 2", "Engagement 3"];

export const engagementData: EngagementRecord[] = Array.from({ length: 60 }, (_, i) => {
    const status: "Verified" | "Pending" | "Invalid" =
        i % 4 === 0 ? "Invalid" :
            i % 3 === 0 ? "Pending" :
                "Verified";
    const farmerName = baseNames[i % baseNames.length];
    const surveyorName = surveyorNames[i % surveyorNames.length];
    const verifierName = verifierNames[i % verifierNames.length];

    // Dates
    const submittedOn = new Date(2025, 10 - (i % 5), 15 - (i % 10)); // Varying dates in 2025
    const verifiedDate = new Date(submittedOn);
    verifiedDate.setMonth(verifiedDate.getMonth() + 2);

    return {
        id: 2481 + i,
        submittedOn,
        farmer: {
            name: farmerName,
            id: `99658742${11 + i % 100}`,
            avatar: `https://i.pravatar.cc/150?u=${farmerName.replace(' ', '')}`
        },
        engagementType: engagementTypes[i % engagementTypes.length],
        village: villages[i % villages.length],
        azs: (i % 9) + 1,
        surveyor: {
            name: surveyorName,
            id: `99658742${21 + i % 100}`
        },
        verified: status === "Verified" ? {
            verifier: verifierName,
            date: verifiedDate
        } : null,
        status,
        comments: "Routine interaction regarding crop health and water usage.",
        score: (i % 5) + 1,
    };
});
