import { Badge } from '@/components/ui/badge';
import { MeetingCard } from './MeetingCard';
import type { Meeting } from '@/types';
import { useTranslation } from 'react-i18next';

interface MeetingsListProps {
    meetings: Meeting[];
}

export const MeetingsList = ({ meetings }: MeetingsListProps) => {
    const { t } = useTranslation();

    return (
        <div className="px-3 pt-2 pb-10 font-sans">
            <div className="mx-auto max-w-xl space-y-6">
                {meetings.length > 0 && (
                    <section className="space-y-3">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold tracking-widest text-slate-500 dark:text-slate-300">
                                {t('page.meetings.list.title')}
                            </span>
                            <div className="flex-1 h-px bg-slate-500 dark:bg-slate-200" />
                            <Badge
                                variant="outline"
                                className="text-[10px] font-medium border-slate-500 dark:border-slate-200 text-slate-500 dark:text-slate-300 px-1.5 py-0"
                            >
                                {meetings.length}
                            </Badge>
                        </div>
                        <div className="space-y-2.5">
                            {meetings.map((m) => (
                                <MeetingCard key={m.id} meeting={m} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};
