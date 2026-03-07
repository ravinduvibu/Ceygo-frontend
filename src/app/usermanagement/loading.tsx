import { Skeleton, SkeletonText, SkeletonSidebar, SkeletonHeader } from "@/components/Skeleton";

export default function UserManagementLoading() {
    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
            <SkeletonSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <SkeletonHeader />
                <main className="flex-1 overflow-hidden flex">
                    <div className="flex-1 overflow-hidden p-6">
                        <div className="max-w-[1100px] mx-auto space-y-4">
                            {/* Filter bar */}
                            <div className="flex items-center space-x-3">
                                <Skeleton className="flex-1 h-10 rounded-xl" />
                                <Skeleton className="h-10 w-72 rounded-xl" />
                            </div>
                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-3">
                                {[0, 1, 2].map(i => (
                                    <div key={i} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center space-x-4">
                                        <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0" />
                                        <div className="space-y-2">
                                            <SkeletonText className="h-7 w-8" />
                                            <SkeletonText className="h-3 w-20" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* Table */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                                    <SkeletonText className="h-4 w-56" />
                                    <SkeletonText className="h-3 w-16" />
                                </div>
                                <div className="divide-y divide-slate-50">
                                    {Array.from({ length: 8 }).map((_, i) => (
                                        <div key={i} className="px-5 py-3.5 flex items-center space-x-6">
                                            <div className="flex items-center space-x-3 w-44 flex-shrink-0">
                                                <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                                                <SkeletonText className="h-3 w-28" />
                                            </div>
                                            <div className="flex-1 space-y-1.5">
                                                <SkeletonText className="h-3 w-40" />
                                                <SkeletonText className="h-2.5 w-28" />
                                            </div>
                                            <SkeletonText className="h-3 w-24 flex-shrink-0" />
                                            <Skeleton className="h-6 w-24 rounded-full flex-shrink-0" />
                                            <Skeleton className="h-5 w-14 rounded-full flex-shrink-0" />
                                            <Skeleton className="h-7 w-28 rounded-xl flex-shrink-0" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
