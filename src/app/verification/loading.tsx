import { Skeleton, SkeletonText, SkeletonSidebar, SkeletonHeader } from "@/components/Skeleton";

export default function VerificationLoading() {
    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
            <SkeletonSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <SkeletonHeader />
                <main className="flex-1 overflow-hidden p-5">
                    <div className="max-w-[1400px] mx-auto flex gap-5 h-full">

                        {/* Left: Queue + Timeline */}
                        <div className="w-60 flex-shrink-0 flex flex-col gap-4">
                            {/* Queue */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                                    <SkeletonText className="h-3 w-28" />
                                    <Skeleton className="h-5 w-8 rounded-full" />
                                </div>
                                <div className="divide-y divide-slate-50">
                                    {Array.from({ length: 4 }).map((_, i) => (
                                        <div key={i} className="px-3 py-3 space-y-2">
                                            <SkeletonText className="h-3 w-full" />
                                            <div className="flex items-center justify-between">
                                                <SkeletonText className="h-2.5 w-16" />
                                                <Skeleton className="h-4 w-8 rounded-full" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="px-4 py-2 border-t border-slate-100">
                                    <SkeletonText className="h-3 w-24" />
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                                <SkeletonText className="h-3 w-28 mb-4" />
                                <div className="space-y-0">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <div key={i} className="flex items-start space-x-3">
                                            <div className="flex flex-col items-center">
                                                <Skeleton className="w-6 h-6 rounded-full flex-shrink-0" />
                                                {i < 4 && <div className="w-0.5 h-7 bg-slate-100" />}
                                            </div>
                                            <div className="pb-5 space-y-1.5">
                                                <SkeletonText className="h-3 w-24" />
                                                <SkeletonText className="h-2.5 w-20" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Center */}
                        <div className="flex-1 flex flex-col gap-4 min-w-0">
                            {/* Applicant */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <Skeleton className="w-12 h-12 rounded-xl flex-shrink-0" />
                                        <div className="space-y-2">
                                            <div className="flex items-center space-x-2">
                                                <SkeletonText className="h-5 w-64" />
                                                <Skeleton className="h-5 w-24 rounded-full" />
                                            </div>
                                            <SkeletonText className="h-3 w-56" />
                                        </div>
                                    </div>
                                    <Skeleton className="h-7 w-36 rounded-lg" />
                                </div>
                                <div className="grid grid-cols-4 gap-3">
                                    {[0, 1, 2, 3].map(i => (
                                        <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                                            <SkeletonText className="h-2.5 w-16" />
                                            <SkeletonText className="h-3 w-24" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Documents */}
                            <div className="grid grid-cols-2 gap-4">
                                {[0, 1].map(i => (
                                    <div key={i} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <Skeleton className="w-4 h-4 rounded" />
                                                <SkeletonText className="h-4 w-48" />
                                            </div>
                                            <Skeleton className="h-5 w-16 rounded-full" />
                                        </div>
                                        <Skeleton className="w-full h-36 rounded-xl" />
                                        <div className="space-y-2">
                                            <SkeletonText className="h-2.5 w-36" />
                                            <Skeleton className="h-9 w-full rounded-xl" />
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Skeleton className="w-4 h-4 rounded flex-shrink-0" />
                                            <SkeletonText className="h-3 w-40" />
                                        </div>
                                        <Skeleton className="h-8 w-full rounded-lg" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right: Decision */}
                        <div className="w-64 flex-shrink-0 flex flex-col gap-4">
                            {/* Score */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
                                <SkeletonText className="h-3 w-20" />
                                <div className="flex items-end space-x-2">
                                    <SkeletonText className="h-10 w-12" />
                                    <SkeletonText className="h-4 w-10 mb-1.5" />
                                </div>
                                <Skeleton className="h-2 w-full rounded-full" />
                                {[0, 1, 2, 3].map(i => (
                                    <div key={i} className="flex items-center justify-between">
                                        <SkeletonText className="h-3 w-24" />
                                        <Skeleton className="w-3.5 h-3.5 rounded-full" />
                                    </div>
                                ))}
                            </div>

                            {/* Decision panel */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex-1 flex flex-col space-y-3">
                                <SkeletonText className="h-3 w-36" />
                                <Skeleton className="flex-1 rounded-xl min-h-[120px]" />
                                <Skeleton className="h-11 w-full rounded-xl" />
                                <Skeleton className="h-9 w-full rounded-xl" />
                                <Skeleton className="h-9 w-full rounded-xl" />
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}
