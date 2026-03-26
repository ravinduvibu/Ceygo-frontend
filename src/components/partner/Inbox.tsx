import { useState } from "react";
import { 
    Search, 
    MoreVertical, 
    Paperclip, 
    Smile, 
    Send, 
    Check, 
    CheckCheck,
    Image as ImageIcon,
    Clock,
    AlertCircle,
    Star
} from "lucide-react";
import Image from "next/image";

// Mock data
const conversations = [
    {
        id: "convo_1",
        user: { name: "Elena V.", avatar: "EV", status: "online", location: "UK" },
        gigTitle: "Sunset TukTuk City Tour",
        gigImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=100&auto=format&fit=crop",
        lastMessage: "I'll be waiting at the Galle Face Hotel entrance.",
        time: "3h",
        unread: 0,
        messages: [
            { id: 1, sender: "Elena V.", text: "Hi Nuwan! Is the Sunset TukTuk tour available tomorrow at 4 PM?", time: "10:30 AM", isMe: false, status: "read" },
            { id: 2, sender: "Me", text: "Hello Elena! Yes, I have space for tomorrow at 4 PM. How many people will be joining?", time: "10:45 AM", isMe: true, status: "read" },
            { id: 3, sender: "Elena V.", text: "Just me and my husband. We are staying at the Galle Face Hotel.", time: "11:15 AM", isMe: false, status: "read" },
            { id: 4, sender: "Me", text: "Perfect. I can pick you up directly from the hotel lobby. Please go ahead and book the gig so I can confirm the time slot.", time: "11:20 AM", isMe: true, status: "read" },
            { id: 5, sender: "System", text: "Elena V. booked 'Sunset TukTuk City Tour' for LKR 5,600", time: "12:00 PM", isSystem: true },
            { id: 6, sender: "Elena V.", text: "Great, I've booked it!", time: "12:05 PM", isMe: false, status: "read" },
            { id: 7, sender: "Elena V.", text: "I'll be waiting at the Galle Face Hotel entrance.", time: "12:10 PM", isMe: false, status: "read" }
        ]
    },
    {
        id: "convo_2",
        user: { name: "Sarah J.", avatar: "SJ", status: "offline", location: "Australia" },
        gigTitle: "Safe Drive to Ella (One-way)",
        gigImage: "https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?q=80&w=100&auto=format&fit=crop",
        lastMessage: "Do you have space for two people this friday?",
        time: "12m",
        unread: 2,
        messages: [
            { id: 1, sender: "Sarah J.", text: "Hi! I saw your gig for the drive to Ella.", time: "2:00 PM", isMe: false, status: "read" },
            { id: 2, sender: "Sarah J.", text: "Do you have space for two people this friday?", time: "2:02 PM", isMe: false, status: "delivered" },
        ]
    },
    {
        id: "convo_3",
        user: { name: "Miguel O.", avatar: "MO", status: "online", location: "Spain" },
        gigTitle: "Colombo Local Street Food",
        gigImage: "https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?q=80&w=100&auto=format&fit=crop",
        lastMessage: "Thanks for the amazing tour yesterday!",
        time: "1d",
        unread: 0,
        messages: [
            { id: 1, sender: "Miguel O.", text: "Thanks for the amazing tour yesterday! The Kottu was incredible.", time: "Yesterday", isMe: false, status: "read" }
        ]
    }
];

export default function Inbox() {
    const [activeConvoId, setActiveConvoId] = useState(conversations[0].id);
    const [inputText, setInputText] = useState("");
    
    // In a real app we'd use complex state, but here we'll just derive it
    const activeConvo = conversations.find(c => c.id === activeConvoId) || conversations[0];

    return (
        <div className="w-full h-[calc(100vh-140px)] animate-in fade-in duration-500 flex flex-col">
            {/* Header section */}
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Inbox</h2>
                    <p className="text-sm text-slate-500 mt-1">Communicate with buyers, send custom offers, and manage orders.</p>
                </div>
            </div>

            {/* Main Chat Layout Area */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-1 w-full min-h-0">
                
                {/* Left Pane - Conversations List */}
                <div className="w-80 flex-shrink-0 border-r border-slate-200 flex flex-col bg-slate-50/30">
                    
                    {/* Search & Filters */}
                    <div className="p-4 border-b border-slate-200 bg-white">
                        <div className="relative mb-3">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input 
                                type="text" 
                                placeholder="Search messages..." 
                                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <button className="flex-1 py-1.5 text-xs font-bold text-slate-800 bg-slate-200/50 rounded-lg hover:bg-slate-200 transition-colors">All</button>
                            <button className="flex-1 py-1.5 text-xs font-bold text-slate-500 bg-transparent rounded-lg hover:bg-slate-100 transition-colors">Unread</button>
                            <button className="flex-1 py-1.5 text-xs font-bold text-slate-500 bg-transparent rounded-lg hover:bg-slate-100 transition-colors">Starred</button>
                        </div>
                    </div>

                    {/* Thread List */}
                    <div className="flex-1 overflow-y-auto">
                        {conversations.map((convo) => (
                            <div 
                                key={convo.id} 
                                onClick={() => setActiveConvoId(convo.id)}
                                className={`p-4 border-b border-slate-100 hover:bg-emerald-50/50 transition-colors cursor-pointer flex items-start space-x-3 relative ${
                                    activeConvoId === convo.id ? "bg-emerald-50/80 border-l-4 border-l-emerald-500" : "border-l-4 border-l-transparent bg-white"
                                }`}
                            >
                                <div className="relative flex-shrink-0">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm ${
                                        convo.unread > 0 ? "bg-gradient-to-br from-[#ff6b35] to-[#f59e0b]" : "bg-gradient-to-br from-slate-400 to-slate-500"
                                    }`}>
                                        {convo.user.avatar}
                                    </div>
                                    <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                                        convo.user.status === "online" ? "bg-emerald-500" : "bg-slate-300"
                                    }`} />
                                </div>
                                
                                <div className="flex-1 min-w-0 pr-6">
                                    <div className="flex items-center justify-between mb-0.5">
                                        <p className={`text-sm truncate ${convo.unread > 0 ? "font-bold text-slate-900" : "font-semibold text-slate-700"}`}>
                                            {convo.user.name}
                                        </p>
                                        <span className={`text-[10px] flex-shrink-0 ml-2 font-medium ${convo.unread > 0 ? "text-emerald-600" : "text-slate-400"}`}>
                                            {convo.time}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-medium mb-1 truncate flex items-center space-x-1">
                                        <span>•</span>
                                        <span>{convo.gigTitle}</span>
                                    </p>
                                    <p className={`text-xs w-full truncate ${convo.unread > 0 ? "font-semibold text-slate-800" : "text-slate-500"}`}>
                                        {convo.lastMessage}
                                    </p>
                                </div>

                                {convo.unread > 0 && (
                                    <div className="absolute top-1/2 -translate-y-1/2 right-4 w-5 h-5 bg-[#ff6b35] rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                                        {convo.unread}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Pane - Active Conversation Area */}
                <div className="flex-1 flex flex-col min-w-0 bg-slate-50 relative">
                    
                    {/* Active Chat Header */}
                    <div className="h-20 border-b border-slate-200 bg-white px-6 flex items-center justify-between flex-shrink-0 shadow-sm z-10">
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ff6b35] to-[#f59e0b] flex items-center justify-center text-sm font-bold text-white">
                                    {activeConvo.user.avatar}
                                </div>
                                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                                    activeConvo.user.status === "online" ? "bg-emerald-500" : "bg-slate-300"
                                }`} />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                                    <span>{activeConvo.user.name}</span>
                                    {activeConvo.user.status === "online" && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded uppercase tracking-wider font-bold">Online</span>}
                                </h3>
                                <p className="text-xs font-medium text-slate-500 flex items-center space-x-1">
                                    <span>{activeConvo.user.location}</span>
                                    <span>•</span>
                                    <span>Local time: 10:24 AM</span>
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button className="text-sm font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-xl transition-colors">
                                Create Custom Offer
                            </button>
                            <button className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors">
                                <Star className="w-5 h-5" />
                            </button>
                            <button className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors">
                                <MoreVertical className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Gig Context Banner */}
                    <div className="bg-slate-100 border-b border-slate-200 p-3 px-6 flex items-center space-x-4 flex-shrink-0">
                        <div className="w-12 h-8 relative rounded overflow-hidden shadow-sm border border-slate-200">
                            <Image src={activeConvo.gigImage} alt="Gig" fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">Inquiry regarding</p>
                            <p className="text-sm font-bold text-slate-800 truncate hover:text-emerald-600 cursor-pointer">{activeConvo.gigTitle}</p>
                        </div>
                        <button className="text-xs font-bold text-slate-600 border border-slate-300 bg-white hover:bg-slate-50 px-3 py-1.5 rounded-lg shadow-sm transition-colors">
                            View Gig
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        <div className="flex justify-center">
                            <span className="text-xs font-bold text-slate-400 bg-slate-200/50 px-3 py-1 rounded-full text-center">
                                Today, April 2nd
                            </span>
                        </div>
                        
                        {activeConvo.messages.map((msg) => {
                            if (msg.isSystem) {
                                return (
                                    <div key={msg.id} className="flex justify-center my-4">
                                        <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-sm">
                                            <AlertCircle className="w-4 h-4" />
                                            <span>{msg.text}</span>
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <div key={msg.id} className={`flex w-full ${msg.isMe ? "justify-end" : "justify-start"}`}>
                                    {!msg.isMe && (
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff6b35] to-[#f59e0b] flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 mr-3 mt-auto shadow-sm">
                                            {activeConvo.user.avatar}
                                        </div>
                                    )}
                                    
                                    <div className={`flex flex-col max-w-[70%] ${msg.isMe ? "items-end" : "items-start"}`}>
                                        <div className={`px-4 py-3 rounded-2xl shadow-sm relative ${
                                            msg.isMe 
                                                ? "bg-emerald-500 text-white rounded-br-sm" 
                                                : "bg-white border border-slate-200 text-slate-800 rounded-bl-sm"
                                        }`}>
                                            <p className="text-sm leading-relaxed">{msg.text}</p>
                                        </div>
                                        <div className="flex items-center space-x-1 mt-1.5 px-1">
                                            <span className="text-[10px] font-medium text-slate-400">{msg.time}</span>
                                            {msg.isMe && (
                                                msg.status === "read" 
                                                    ? <CheckCheck className="w-3.5 h-3.5 text-emerald-500" />
                                                    : <Check className="w-3.5 h-3.5 text-slate-400" />
                                            )}
                                        </div>
                                    </div>

                                    {msg.isMe && (
                                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600 flex-shrink-0 ml-3 mt-auto shadow-sm">
                                            Me
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Chat Input Area */}
                    <div className="bg-white border-t border-slate-200 p-4 flex-shrink-0 z-10">
                        <div className="flex items-end space-x-3 bg-slate-50 border border-slate-200 rounded-2xl p-2 shadow-inner focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all">
                            <button className="p-2.5 text-slate-400 hover:text-emerald-500 hover:bg-white rounded-xl transition-all h-[42px]">
                                <Paperclip className="w-5 h-5" />
                            </button>
                            <textarea 
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder={`Write a message to ${activeConvo.user.name}...`}
                                className="flex-1 max-h-32 min-h-[42px] bg-transparent resize-none focus:outline-none text-sm font-medium py-3 text-slate-700 placeholder:text-slate-400"
                                rows={1}
                            />
                            <div className="flex items-center space-x-1 h-[42px] pr-1">
                                <button className="p-2 text-slate-400 hover:text-amber-500 hover:bg-white rounded-xl transition-all">
                                    <Smile className="w-5 h-5" />
                                </button>
                                <button className="px-4 h-[36px] bg-[#ff6b35] hover:bg-[#e55a2b] active:scale-95 text-white font-bold text-sm rounded-xl transition-all flex items-center space-x-2 shadow-sm shadow-orange-200">
                                    <span>Send</span>
                                    <Send className="w-4 h-4 ml-1" />
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between mt-2 px-2">
                            <div className="flex items-center space-x-4">
                                <button className="text-xs font-bold text-slate-400 hover:text-emerald-600 transition-colors flex items-center space-x-1">
                                    <ImageIcon className="w-3.5 h-3.5" />
                                    <span>Attach Image</span>
                                </button>
                                <button className="text-xs font-bold text-slate-400 hover:text-emerald-600 transition-colors flex items-center space-x-1">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>Use Quick Reply</span>
                                </button>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                Press Enter to send
                            </span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
