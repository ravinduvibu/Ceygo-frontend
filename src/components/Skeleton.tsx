// Reusable skeleton building blocks with shimmer animation

export function Skeleton({ className = "" }: { className?: string }) {
    return (
        <div
            className={`animate-pulse bg-slate-200 rounded-xl ${className}`}
        />
    );
}

export function SkeletonText({ className = "" }: { className?: string }) {
    return <div className={`animate-pulse bg-slate-200 rounded-full ${className}`} />;
}

export function SkeletonCard({ className = "" }: { className?: string }) {
    return (
        <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm p-5 ${className}`}>
            <div className="flex items-start justify-between mb-4">
                <div className="space-y-2">
                    <SkeletonText className="h-3 w-24" />
                    <SkeletonText className="h-7 w-32" />
                </div>
                <Skeleton className="h-4 w-12 rounded-full" />
            </div>
            <Skeleton className="h-9 w-20" />
        </div>
    );
}

export function SkeletonSidebar() {
    return (
        <aside className="w-64 flex-shrink-0 flex flex-col bg-white border-r border-slate-200">
            {/* Logo */}
            <div className="px-5 py-5 flex items-center space-x-3 border-b border-slate-100">
                <Skeleton className="h-9 w-28" />
                <Skeleton className="h-5 w-14 rounded-full" />
            </div>
            {/* Nav items */}
            <nav className="flex-1 px-3 py-4 space-y-1.5">
                {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-3 px-3 py-2.5 rounded-xl">
                        <Skeleton className="h-4 w-4 rounded-lg flex-shrink-0" />
                        <SkeletonText className={`h-3 ${i === 0 ? "w-20" : i % 3 === 0 ? "w-32" : "w-28"}`} />
                    </div>
                ))}
            </nav>
            {/* User */}
            <div className="p-4 border-t border-slate-100">
                <div className="flex items-center space-x-3 px-2">
                    <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-1.5">
                        <SkeletonText className="h-3 w-24" />
                        <SkeletonText className="h-2.5 w-32" />
                    </div>
                </div>
            </div>
        </aside>
    );
}

export function SkeletonHeader() {
    return (
        <header className="h-16 flex-shrink-0 flex items-center justify-between px-6 bg-white border-b border-slate-200">
            <div className="space-y-1.5">
                <SkeletonText className="h-4 w-40" />
                <SkeletonText className="h-3 w-56" />
            </div>
            <div className="flex items-center space-x-3">
                <Skeleton className="h-9 w-52 rounded-xl" />
                <Skeleton className="h-9 w-9 rounded-xl" />
            </div>
        </header>
    );
}
