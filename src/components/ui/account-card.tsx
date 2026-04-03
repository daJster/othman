import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { cn, fullNavigate } from '@/lib/utils';

import type { AccountData } from '@/firebase/auth/type';
import { SquareArrowOutUpRightIcon } from 'lucide-react';

interface AccountCardProps {
    account: AccountData;
    className?: string;
}

function getInitials(name: string | null): string {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
}

function AccountCard({
    account,
    className,
}: AccountCardProps) {
    const { email, displayName, photoURL } = account;
    return (
        <button onClick={() => fullNavigate('/account')} className={cn('block', className)}>
            <Card className="flex flex-row rounded-md cursor-pointer items-center gap-4 px-4 py-3 transition-colors hover:bg-muted/50">
                <Avatar size="lg">
                    {photoURL && (
                        <AvatarImage
                            src={photoURL}
                            alt={displayName ?? email ?? undefined}
                        />
                    )}
                    <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-col text-start">
                    <span className="truncate font-medium">
                        {displayName ?? 'No name'}
                    </span>
                    <span className="truncate text-sm text-muted-foreground">
                        {email}
                    </span>
                </div>
                <SquareArrowOutUpRightIcon className='h-5 w-5 ml-5 text-neutral-600 dark:text-slate-200'/>
            </Card>
        </button>
    );
}

export { AccountCard };
