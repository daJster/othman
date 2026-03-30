import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Video,
    Clock,
    Users,
    CalendarDays,
    ExternalLink,
    ChevronDown,
    ChevronUp,
    MapPin,
} from "lucide-react";

type Attendee = {
    name: string
    avatar: string
}

type Meeting = {
    id: number
    title: string
    description: string
    date: string
    time: string
    duration: string
    meetLink: string
    status: 'soon' | 'upcoming' | 'scheduled'
    attendees: Attendee[]
    organizer: string
    location: string
}

const mockMeetings: Meeting[] = [
    {
        id: 1,
        title: "Q2 Product Roadmap Review",
        description:
            "Quarterly alignment session to review OKRs, discuss upcoming feature launches, and prioritize the backlog for the next sprint cycle.",
        date: "Today",
        time: "2:00 PM",
        duration: "60 min",
        status: "soon",
        meetLink: "https://meet.google.com/abc-defg-hij",
        attendees: [
            { name: "Sara K.", avatar: "https://i.pravatar.cc/32?img=1" },
            { name: "Tom R.", avatar: "https://i.pravatar.cc/32?img=2" },
            { name: "Lena P.", avatar: "https://i.pravatar.cc/32?img=3" },
            { name: "James W.", avatar: "https://i.pravatar.cc/32?img=4" },
        ],
        organizer: "Sara K.",
        location: "Remote",
    },
    {
        id: 2,
        title: "Design System Sync",
        description:
            "Weekly design-engineering sync to align on component specs, review Figma handoffs, and address any open design debt items.",
        date: "Today",
        time: "4:30 PM",
        duration: "30 min",
        status: "upcoming",
        meetLink: "https://meet.google.com/klm-nopq-rst",
        attendees: [
            { name: "Ana M.", avatar: "https://i.pravatar.cc/32?img=5" },
            { name: "Dev S.", avatar: "https://i.pravatar.cc/32?img=6" },
        ],
        organizer: "Ana M.",
        location: "Remote",
    },
    {
        id: 3,
        title: "Onboarding: New Engineer",
        description:
            "First-day introduction covering team norms, tooling setup, codebase overview, and a walk-through of current sprint goals.",
        date: "Tomorrow",
        time: "10:00 AM",
        duration: "90 min",
        status: "upcoming",
        meetLink: "https://meet.google.com/uvw-xyza-bcd",
        attendees: [
            { name: "Chris B.", avatar: "https://i.pravatar.cc/32?img=7" },
            { name: "Mia F.", avatar: "https://i.pravatar.cc/32?img=8" },
            { name: "Ryo T.", avatar: "https://i.pravatar.cc/32?img=9" },
        ],
        organizer: "Mia F.",
        location: "Remote",
    },
    {
        id: 4,
        title: "Investor Update — Seed Round",
        description:
            "Monthly progress update for seed investors. Covers MRR growth, key metrics, product milestones, and the path to Series A.",
        date: "Wed, Apr 2",
        time: "3:00 PM",
        duration: "45 min",
        status: "scheduled",
        meetLink: "https://meet.google.com/efg-hijk-lmn",
        attendees: [
            { name: "Oliver Q.", avatar: "https://i.pravatar.cc/32?img=10" },
            { name: "Priya N.", avatar: "https://i.pravatar.cc/32?img=11" },
            { name: "Leo C.", avatar: "https://i.pravatar.cc/32?img=12" },
            { name: "Zoe A.", avatar: "https://i.pravatar.cc/32?img=13" },
            { name: "Ben H.", avatar: "https://i.pravatar.cc/32?img=14" },
        ],
        organizer: "Oliver Q.",
        location: "Remote",
    },
];

const statusConfig = {
    soon: {
        label: "Starting soon",
        classes:
            "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
        dot: "bg-emerald-500 animate-pulse",
    },
    upcoming: {
        label: "Today",
        classes:
            "bg-blue-100 text-blue-700 dark:bg-neutral-950 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800",
        dot: "bg-blue-500",
    },
    scheduled: {
        label: "Scheduled",
        classes:
            "bg-slate-100 text-slate-600 dark:bg-neutral-800 dark:text-neutral-400 border-slate-200 dark:border-neutral-700",
        dot: "bg-slate-400",
    },
};

function AttendeeStack({ attendees }: {attendees: Attendee[]}) {
    const visible = attendees.slice(0, 4);
    const extra = attendees.length - 4;
    return (
        <div className="flex items-center -space-x-2">
            {visible.map((a, i) => (
                <TooltipProvider key={i} delayDuration={100}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Avatar className="h-6 w-6 border-2 border-white dark:border-neutral-900 ring-0 cursor-default">
                                <AvatarImage src={a.avatar} alt={a.name} />
                                <AvatarFallback className="text-[9px] font-semibold bg-slate-200 dark:bg-neutral-700 text-neutral-600 dark:text-slate-300">
                                    {a.name[0]}
                                </AvatarFallback>
                            </Avatar>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="text-xs px-2 py-1">
                            {a.name}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ))}
            {extra > 0 && (
                <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white dark:border-neutral-900 bg-slate-100 dark:bg-neutral-700 text-[9px] font-semibold text-slate-500 dark:text-slate-400">
          +{extra}
        </span>
            )}
        </div>
    );
}

const MeetingCard = ({ meeting }: {meeting: Meeting}) => {
    const [expanded, setExpanded] = useState(false);
    const cfg = statusConfig[meeting.status];

    return (
        <Card className="group relative overflow-hidden border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-none hover:shadow-md hover:shadow-slate-100 dark:hover:shadow-neutral-950 transition-all duration-200 hover:-translate-y-px">
            {/* Subtle left accent */}
            <div
                className={`absolute left-0 top-0 bottom-0 w-0.75 rounded-l-xl transition-opacity duration-200 ${
                    meeting.status === "soon"
                        ? "bg-emerald-500 opacity-100"
                        : meeting.status === "upcoming"
                            ? "bg-blue-500 opacity-60 group-hover:opacity-100"
                            : "bg-slate-300 dark:bg-slate-600 opacity-40 group-hover:opacity-80"
                }`}
            />

            <CardHeader className="pl-5 pr-4 pt-4 pb-0">
                <div className="flex items-start justify-between gap-3">
                    {/* Title + badge */}
                    <div className="flex flex-col gap-1.5 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full border ${cfg.classes}`}
                        >
                        <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                          {cfg.label}
                        </span>
                        </div>
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 leading-snug truncate">
                                {meeting.title}
                            </h3>
                        </div>
                </div>
            </CardHeader>

            <CardContent className="pl-5 pr-4 pt-3 pb-4 space-y-3">
                {/* Meta row */}
                <div className="flex items-center gap-3 flex-wrap text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {meeting.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {meeting.time} · {meeting.duration}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        {meeting.location}
                    </span>
                </div>

                <Separator className="bg-slate-100 dark:bg-slate-800" />

                {/* Attendees + expand */}
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <Users className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                        <AttendeeStack attendees={meeting.attendees} />
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                            {meeting.attendees.length} attendee
                            {meeting.attendees.length !== 1 ? "s" : ""}
                        </span>
                    </div>

                    <button
                        onClick={() => setExpanded((p) => !p)}
                        className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                        {expanded ? (
                            <>
                                Less <ChevronUp className="h-3.5 w-3.5" />
                            </>
                        ) : (
                            <>
                                Details <ChevronDown className="h-3.5 w-3.5" />
                            </>
                        )}
                    </button>
                </div>

                {/* Join button */}
                <a href={meeting.meetLink} target="_blank" rel="noreferrer">
                    <Button
                        size="sm"
                        className="shrink-0 h-8 gap-1.5 text-xs font-medium bg-neutral-900 hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 transition-colors rounded-lg"
                    >
                        <Video className="h-3.5 w-3.5" />
                        Join
                        <ExternalLink className="h-3 w-3 opacity-60" />
                    </Button>
                </a>

                {/* Expandable description */}
                <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out py-2 ${
                        expanded ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                    }`}
                >
                    <Separator className="bg-slate-100 dark:bg-slate-800 mb-3" />
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {meeting.description}
                    </p>
                    <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                        Organized by{" "}
                        <span className="text-slate-600 dark:text-slate-300 font-medium">
                          {meeting.organizer}
                        </span>
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

export const MeetingsList = () => {
    const todayMeetings = mockMeetings.filter((m) =>
        ["soon", "upcoming"].includes(m.status)
    );
    const scheduledMeetings = mockMeetings.filter((m) => m.status === "scheduled");

    return (
        <div className="min-h-screen bg-white dark:bg-green-950 rounded-xl border border-neutral-300/70 dark:border-green-500/30 shadow-md p-6 font-sans">
            <div className="mx-auto max-w-xl space-y-6">
                {/* Header */}
                <div className="space-y-1">
                    <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-slate-50">
                        Upcoming Meetings
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        {mockMeetings.length} meetings scheduled
                    </p>
                </div>

                {/* Today */}
                {todayMeetings.length > 0 && (
                    <section className="space-y-3">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                             Today
                            </span>
                            <div className="flex-1 h-px bg-slate-400 dark:bg-slate-500" />
                            <Badge
                                variant="outline"
                                className="text-[10px] font-medium border-slate-500 dark:border-slate-500 text-slate-500 dark:text-slate-400 px-1.5 py-0"
                            >
                                {todayMeetings.length}
                            </Badge>
                        </div>
                        <div className="space-y-2.5">
                            {todayMeetings.map((m) => (
                                <MeetingCard key={m.id} meeting={m} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Scheduled */}
                {scheduledMeetings.length > 0 && (
                    <section className="space-y-3">
                        <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                                Upcoming
                              </span>
                              <div className="flex-1 h-px bg-slate-400 dark:bg-slate-500" />
                              <Badge
                                variant="outline"
                                className="text-[10px] font-medium border-slate-500 dark:border-slate-500 text-slate-500 dark:text-slate-400 px-1.5 py-0"
                              >
                                {scheduledMeetings.length}
                              </Badge>
                        </div>
                        <div className="space-y-2.5">
                            {scheduledMeetings.map((m) => (
                                <MeetingCard key={m.id} meeting={m} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}