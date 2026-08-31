import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { type User } from '@/types';

export function UserInfo({ user, showEmail = false }: { user: User | null; showEmail?: boolean }) {
    const getInitials = useInitials();

    if (!user) return null;

    return (
        <>
            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                {user.avatar ? (
                    <img
                        src={user.avatar.startsWith('http') ? user.avatar : `/storage/${user.avatar}`}
                        alt={user.name}
                        className="h-full w-full object-cover"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                ) : null}
                <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                    {getInitials(user.name)}
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                {showEmail && <span className="text-muted-foreground truncate text-xs">{user.email}</span>}
            </div>
        </>
    );
}
