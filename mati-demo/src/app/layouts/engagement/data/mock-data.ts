import { EngagementRecord } from "./schema";

const baseNames = ["Farmer A", "Farmer B", "Farmer C", "Farmer D", "Farmer E", "Farmer F", "Farmer G", "Farmer H"];
const surveyorNames = ["Surveyor A", "Surveyor B", "Surveyor C"];
const verifierNames = ["Verifier B", "Verifier E", "Verifier G", "Verifier H", "Verifier I"];
const villages = ["Village A", "Village B", "Village C"];
const engagementTypes = ["Engagement 1", "Con. Engagement 1", "Engagement 4", "Engagement 2", "Engagement 3"];
const cropNames = ["Wheat", "Rice", "Maize", "Cotton", "Sugarcane", "Soybean", "Barley", "Mustard", "Potato", "Tomato", "Onion"];

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

    const azCode = (i % 9) + 1;
    const azName = cropNames[(azCode - 1) % cropNames.length];

    const village = villages[i % villages.length];
    const block = "Block " + String.fromCharCode(65 + (i % 5));
    const state = "Karnataka";
    const country = "India";

    return {
        id: 2481 + i,
        submittedOn,
        farmer: {
            name: farmerName,
            id: `99658742${11 + i % 100}`,
            avatar: `https://i.pravatar.cc/150?u=${farmerName.replace(' ', '')}`,
            phoneNumber: `+91 98765 ${43210 + i}`
        },
        engagementType: engagementTypes[i % engagementTypes.length],
        village,
        block,
        state,
        country,
        azs: azCode,
        azName: azName,
        surveyor: {
            name: surveyorName,
            id: `99658742${21 + i % 100}`,
            phoneNumber: `+91 91234 ${56789 + i}`
        },
        verified: status === "Verified" ? {
            verifier: verifierName,
            date: verifiedDate,
            comment: i === 1 ? "The farmer has successfully implemented the new irrigation techniques. Yield is expected to increase by 20%." : undefined
        } : null,
        status,
        comments: "Routine interaction regarding crop health and water usage.",
        approvalComment: i === 1 ? "The farmer has successfully implemented the new irrigation techniques. Yield is expected to increase by 20%." : undefined,
        score: (i % 5) + 1,
    };
});
