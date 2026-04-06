import { getHeatmapColor } from "@/lib/utils";


export function Legend() {
    const levels = [0, 25, 50, 75, 100];

    return (
        <div className="flex items-center gap-2 mb-4 w-full justify-center">
            <span className="text-sm text-muted-foreground">Less</span>
            {levels.map((lvl) => (
                <div key={lvl} className={`w-5 h-5 rounded ${getHeatmapColor(lvl)}`} />
            ))}
            <span className="text-sm text-muted-foreground">More</span>
        </div>
    );
}
