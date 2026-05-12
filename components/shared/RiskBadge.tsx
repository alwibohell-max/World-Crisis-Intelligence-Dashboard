import type { Severity } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

const styles: Record<Severity, string> = { Low: "border-green-500/40 bg-green-500/15 text-green-300", Guarded: "border-yellow-500/40 bg-yellow-500/15 text-yellow-300", Elevated: "border-orange-500/40 bg-orange-500/15 text-orange-300", High: "border-red-500/40 bg-red-500/15 text-red-300", Critical: "border-purple-500/40 bg-purple-500/15 text-purple-300" };
export function RiskBadge({ level }: { level: Severity }) { return <Badge className={styles[level]}>{level}</Badge>; }
