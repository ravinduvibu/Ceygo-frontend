"use client";

import { useState } from "react";

type RoleToggleProps = {
    roles: [string, string] | [string, string, string];
    defaultRole?: string;
    onRoleChange?: (role: string) => void;
};

export default function RoleToggle({ roles, defaultRole, onRoleChange }: RoleToggleProps) {
    const [activeRole, setActiveRole] = useState(defaultRole || roles[0]);

    const handleToggle = (role: string) => {
        setActiveRole(role);
        if (onRoleChange) onRoleChange(role);
    };

    const count = roles.length;
    const activeIndex = roles.indexOf(activeRole as typeof roles[number]);
    const widthPct = 100 / count;

    return (
        <div className="relative flex w-full rounded-full bg-slate-100 p-1 shadow-inner overflow-hidden">
            <div
                className="absolute inset-1 rounded-full bg-white shadow-sm transition-transform duration-300 ease-in-out"
                style={{
                    width: `calc(${widthPct}% - ${(count - 1) * 2}px)`,
                    transform: `translateX(calc(${activeIndex * 100}% + ${activeIndex * 2}px))`,
                }}
            />
            {roles.map((role) => (
                <button
                    key={role}
                    onClick={() => handleToggle(role)}
                    className={`relative z-10 flex-1 py-2 text-sm font-semibold transition-colors duration-300 ${
                        activeRole === role
                            ? "text-slate-900"
                            : "text-slate-500 hover:text-slate-700"
                    }`}
                >
                    {role}
                </button>
            ))}
        </div>
    );
}
