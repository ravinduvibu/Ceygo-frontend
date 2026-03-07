import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Ceygo Admin | Control Tower",
    description: "Ceygo Platform Administration Dashboard",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[#0a0f1c] text-white">
            {children}
        </div>
    );
}
