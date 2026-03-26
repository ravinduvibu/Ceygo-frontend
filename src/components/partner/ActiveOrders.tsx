import { useState } from "react";
import { 
    Search, 
    Filter, 
    MessageSquare, 
    CheckCircle2, 
    AlertCircle, 
    Clock, 
    MoreVertical, 
    UploadCloud, 
    Timer,
    CalendarCheck2,
    TrendingUp,
    TrendingDown,
    XCircle
} from "lucide-react";
import Image from "next/image";

const mockOrders = [
    {
        id: "ORD-94281",
        gigTitle: "Sunset TukTuk City Tour",
        gigImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=200&auto=format&fit=crop",
        buyer: { name: "Elena V.", avatar: "EV", location: "UK" },
        date: "Today, 4:30 PM",
        deadline: "2 Hours",
        price: "LKR 2,800",
        status: "In Progress",
        color: "blue"
    },
    {
        id: "ORD-94302",
        gigTitle: "Sunset TukTuk City Tour",
        gigImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=200&auto=format&fit=crop",
        buyer: { name: "Marco R.", avatar: "MR", location: "Italy" },
        date: "Tomorrow, 4:30 PM",
        deadline: "26 Hours",
        price: "LKR 5,600",
        status: "Pending",
        color: "amber"
    },
    {
        id: "ORD-94115",
        gigTitle: "Colombo Local Street Food",
        gigImage: "https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?q=80&w=200&auto=format&fit=crop",
        buyer: { name: "David M.", avatar: "DM", location: "USA" },
        date: "Mar 22, 2026",
        deadline: "Delivered",
        price: "LKR 4,500",
        status: "Completed",
        color: "emerald"
    },
    {
        id: "ORD-94388",
        gigTitle: "Safe Drive to Ella (One-way)",
        gigImage: "https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?q=80&w=200&auto=format&fit=crop",
        buyer: { name: "Sophie T.", avatar: "ST", location: "France" },
        date: "Mar 28, 2026",
        deadline: "4 Days",
        price: "LKR 15,000",
        status: "Priority",
        color: "purple"
    },
    {
        id: "ORD-93992",
        gigTitle: "Colombo Local Street Food",
        gigImage: "https://images.unsplash.com/photo-1628283087284-814d4cedef3f?q=80&w=200&auto=format&fit=crop",
        buyer: { name: "John K.", avatar: "JK", location: "Canada" },
        date: "Mar 20, 2026",
        deadline: "Cancelled",
        price: "LKR 4,500",
        status: "Cancelled",
        color: "red"
    }
];

export default function ActiveOrders() {
    const [filter, setFilter] = useState("All");

    const filteredOrders = mockOrders.filter(order => {
        if (filter === "All") return true;
        if (filter === "Active") return ["In Progress", "Priority", "Pending"].includes(order.status);
        if (filter === "Completed") return order.status === "Completed";
        if (filter === "Cancelled") return order.status === "Cancelled";
        return true;
    });

    return (
        <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header section */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Manage Orders</h2>
                    <p className="text-sm text-slate-500 mt-1">Track your bookings, deliver experiences, and communicate with travelers.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input 
                            type="text" 
                            placeholder="Search orders..." 
                            className="pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all w-64 shadow-sm"
                        />
                    </div>
                    <button className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-bold shadow-sm transition-colors">
                        <Filter className="w-4 h-4" />
                        <span>Filter</span>
                    </button>
                </div>
            </div>

            {/* Top KPI Cards for Orders */}
            <div className="grid grid-cols-4 gap-4">
                {[
                    { label: "Active Orders", value: "3", sub: "LKR 23,400 expected", icon: Timer, color: "blue", trend: "+1 this week", trendUp: true },
                    { label: "Completed (30d)", value: "24", sub: "LKR 112,500 earned", icon: CheckCircle2, color: "emerald", trend: "+12% MoM", trendUp: true },
                    { label: "Pending Review", value: "1", sub: "Action required", icon: AlertCircle, color: "amber", trend: "Needs attention", trendUp: false },
                    { label: "Cancellation Rate", value: "2.1%", sub: "Below 5% target", icon: XCircle, color: "red", trend: "-0.5% MoM", trendUp: true },
                ].map((kpi, i) => (
                    <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                            <div className={`w-10 h-10 rounded-xl bg-${kpi.color}-50 flex items-center justify-center flex-shrink-0`}>
                                <kpi.icon className={`w-5 h-5 text-${kpi.color}-500`} />
                            </div>
                            <div className={`flex items-center space-x-1 text-xs font-bold px-2 py-0.5 rounded-full ${kpi.trendUp ? "text-emerald-600 bg-emerald-50" : "text-amber-600 bg-amber-50"}`}>
                                {kpi.trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                <span>{kpi.trend}</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-2xl font-black text-slate-900">{kpi.value}</p>
                            <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">{kpi.label}</p>
                            <p className="text-[10px] font-medium text-slate-400 mt-0.5">{kpi.sub}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Orders Table Area */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                
                {/* Tabs */}
                <div className="flex items-center space-x-6 px-6 border-b border-slate-200 bg-slate-50/50">
                    {["Active", "Completed", "Cancelled", "All"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`py-4 text-sm font-bold transition-all relative ${
                                filter === tab
                                    ? "text-emerald-600"
                                    : "text-slate-500 hover:text-slate-800"
                            }`}
                        >
                            {tab}
                            <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                                filter === tab ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"
                            }`}>
                                {tab === "All" ? mockOrders.length : 
                                 tab === "Active" ? mockOrders.filter(o => ["In Progress", "Priority", "Pending"].includes(o.status)).length :
                                 mockOrders.filter((s) => s.status === tab).length}
                            </span>
                            {filter === tab && (
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500 rounded-t-full" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Table */}
                <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                                <th className="py-4 px-6 font-semibold">Buyer</th>
                                <th className="py-4 px-6 font-semibold">Gig Details</th>
                                <th className="py-4 px-6 font-semibold">Delivery Time</th>
                                <th className="py-4 px-6 font-semibold">Total Price</th>
                                <th className="py-4 px-6 font-semibold">Status</th>
                                <th className="py-4 px-6 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-16 text-center">
                                        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <CalendarCheck2 className="w-6 h-6 text-slate-300" />
                                        </div>
                                        <p className="text-sm font-bold text-slate-900">No orders found</p>
                                        <p className="text-xs text-slate-500 mt-1">There are no orders matching the '{filter}' filter.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-slate-50/80 transition-colors group">
                                        {/* Buyer */}
                                        <td className="py-4 px-6 align-top">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-sm font-bold text-slate-700 flex-shrink-0 shadow-sm border border-slate-100">
                                                    {order.buyer.avatar}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900 hover:text-emerald-600 cursor-pointer">{order.buyer.name}</p>
                                                    <p className="text-xs font-medium text-slate-500">{order.buyer.location}</p>
                                                    <button className="flex items-center space-x-1 text-[10px] font-bold text-slate-400 hover:text-slate-700 mt-1 transition-colors">
                                                        <MessageSquare className="w-3 h-3" />
                                                        <span>Message</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                        
                                        {/* Gig Details */}
                                        <td className="py-4 px-6 align-top max-w-[280px]">
                                            <div className="flex items-start space-x-3">
                                                <div className="w-14 h-10 relative rounded-md overflow-hidden flex-shrink-0 border border-slate-200">
                                                    <Image src={order.gigImage} alt={order.gigTitle} fill className="object-cover" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-800 leading-snug line-clamp-2 hover:text-emerald-600 cursor-pointer">{order.gigTitle}</p>
                                                    <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-wider">{order.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        
                                        {/* Delivery Time */}
                                        <td className="py-4 px-6 align-top">
                                            <p className="text-sm font-bold text-slate-900">{order.date}</p>
                                            <p className={`text-xs font-semibold mt-1 flex items-center space-x-1 ${
                                                order.deadline.includes("Hours") ? "text-amber-500" :
                                                order.deadline === "Delivered" ? "text-emerald-500" :
                                                order.deadline === "Cancelled" ? "text-red-500" :
                                                "text-blue-500"
                                            }`}>
                                                <Clock className="w-3 h-3" />
                                                <span>{order.deadline}</span>
                                            </p>
                                        </td>
                                        
                                        {/* Price */}
                                        <td className="py-4 px-6 align-top">
                                            <p className="text-base font-black text-slate-900">{order.price}</p>
                                        </td>
                                        
                                        {/* Status */}
                                        <td className="py-4 px-6 align-top">
                                            <span className={`inline-flex items-center space-x-1.5 text-xs font-bold px-2.5 py-1 rounded-md shadow-sm border border-${order.color}-200 bg-${order.color}-50 text-${order.color}-700`}>
                                                <span className={`w-1.5 h-1.5 rounded-full bg-${order.color}-500 ${["In Progress", "Priority"].includes(order.status) ? "animate-pulse" : ""}`} />
                                                <span>{order.status}</span>
                                            </span>
                                        </td>
                                        
                                        {/* Actions */}
                                        <td className="py-4 px-6 align-top text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                {order.status === "In Progress" || order.status === "Priority" ? (
                                                    <button className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm shadow-emerald-200 transition-all flex items-center space-x-1.5">
                                                        <UploadCloud className="w-3.5 h-3.5" />
                                                        <span>Confirm Order</span>
                                                    </button>
                                                ) : (
                                                    <button className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold shadow-sm transition-all">
                                                        View Order
                                                    </button>
                                                )}
                                                <button className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}
