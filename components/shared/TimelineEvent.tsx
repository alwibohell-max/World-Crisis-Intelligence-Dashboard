import type { CrisisEvent } from "@/lib/types";
import { RiskBadge } from "./RiskBadge";
import { formatDate } from "@/lib/utils";
export function TimelineEvent({ event }: { event: CrisisEvent }) { return <div className="relative border-l pl-5 pb-5"><div className="absolute -left-1.5 top-1 h-3 w-3 rounded-full bg-primary" /><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold">{event.title}</h3><RiskBadge level={event.risk.level} /></div><p className="mt-1 text-sm text-muted-foreground">{event.description}</p><div className="mt-2 text-xs text-muted-foreground">{formatDate(event.time)} · {event.source}</div></div>; }
