import { Farmer } from "@/types/map";

export const PLOT_COLORS = {
    fill: "#FFFFFF",
    stroke: "#000000"
};

export const MOCK_FARMERS: Farmer[] = [
    {
        id: "f1",
        name: "Farmer A",
        date: "01/01/23",
        calArea: "8.71 Acres",
        trailersDeployed: 21,
        village: "Village A",
        deployed: "85 Tons",
        location: { lat: 20.5, lng: 78.9 },
        plots: [
            {
                id: "2554377",
                farmerId: "f1",
                name: "Alpha Field",
                area: 2.1,
                deployedTons: 0.5,
                location: { lat: 20.502, lng: 78.902 },
                color: PLOT_COLORS.fill,
                path: [
                    { lat: 20.501, lng: 78.901 },
                    { lat: 20.504, lng: 78.902 },
                    { lat: 20.503, lng: 78.905 },
                    { lat: 20.500, lng: 78.904 },
                ]
            },
            {
                id: "3884192",
                farmerId: "f1",
                name: "Beta Sector",
                area: 2.5,
                deployedTons: 1.2,
                location: { lat: 20.499, lng: 78.900 },
                color: PLOT_COLORS.fill
            },
            {
                id: "1122334",
                farmerId: "f1",
                name: "Gamma Plot",
                area: 1.8,
                deployedTons: 0.8,
                location: { lat: 20.505, lng: 78.895 },
                color: PLOT_COLORS.fill
            },
            {
                id: "4455667",
                farmerId: "f1",
                name: "Delta Ridge",
                area: 2.3,
                deployedTons: 2.1,
                location: { lat: 20.495, lng: 78.905 },
                color: PLOT_COLORS.fill
            }
        ]
    },
    {
        id: "f2",
        name: "Farmer B",
        date: "01/01/23",
        calArea: "4.5 Acres",
        trailersDeployed: 12,
        village: "Village B",
        deployed: "42 Tons",
        location: { lat: 20.51, lng: 78.91 },
        plots: [
            {
                id: "1994231",
                farmerId: "f2",
                name: "North Plot",
                area: 1.5,
                deployedTons: 1.2,
                location: { lat: 20.511, lng: 78.914 },
                color: PLOT_COLORS.fill
            },
            {
                id: "1994232",
                farmerId: "f2",
                name: "South Plot",
                area: 1.0,
                deployedTons: 0.8,
                location: { lat: 20.508, lng: 78.910 },
                color: PLOT_COLORS.fill
            },
            {
                id: "1994233",
                farmerId: "f2",
                name: "East Field",
                area: 1.0,
                deployedTons: 1.1,
                location: { lat: 20.515, lng: 78.918 },
                color: PLOT_COLORS.fill
            },
            {
                id: "1994234",
                farmerId: "f2",
                name: "West Zone",
                area: 1.0,
                deployedTons: 1.1,
                location: { lat: 20.505, lng: 78.905 },
                color: PLOT_COLORS.fill
            }
        ]
    },
    {
        id: "f3",
        name: "Farmer C",
        date: "01/02/23",
        calArea: "12.3 Acres",
        trailersDeployed: 35,
        village: "Village C",
        deployed: "150 Tons",
        location: { lat: 20.52, lng: 78.89 },
        plots: [
            { id: "3001", farmerId: "f3", name: "P1", area: 3.0, deployedTons: 20, location: { lat: 20.520, lng: 78.890 }, color: PLOT_COLORS.fill },
            { id: "3002", farmerId: "f3", name: "P2", area: 3.0, deployedTons: 20, location: { lat: 20.525, lng: 78.895 }, color: PLOT_COLORS.fill },
            { id: "3003", farmerId: "f3", name: "P3", area: 3.0, deployedTons: 20, location: { lat: 20.515, lng: 78.885 }, color: PLOT_COLORS.fill },
            { id: "3004", farmerId: "f3", name: "P4", area: 3.3, deployedTons: 90, location: { lat: 20.510, lng: 78.880 }, color: PLOT_COLORS.fill }
        ]
    }
];
