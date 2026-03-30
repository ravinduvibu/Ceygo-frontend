"use client";

import { useState } from "react";

type RoleToggleProps = {
    roles: [string, string];
    defaultRole?: string;
    onRoleChange?: (role: string) => void;
};

export default function RoleToggle({ roles, defaultRole, onRoleChange }: RoleToggleProps) {
    const [activeRole, setActiveRole] = useState(defaultRole || roles[0]);

    const handleToggle = (role: string) => {
        setActiveRole(role);
        if (onRoleChange) onRoleChange(role);
    };

    const isFirstActive = activeRole === roles[0];

    return (
        <div className="relative flex w-full rounded-full bg-slate-100 p-1 shadow-inner overflow-hidden">
            <div
                className={`absolute inset-1 w-1/2 rounded-full bg-white shadow-sm transition-transform duration-300 ease-in-out ${isFirstActive ? "translate-x-0" : "translate-x-full"
                    }`}
            />
            {roles.map((role) => (
                <button
                    key={role}
                    onClick={() => handleToggle(role)}
                    className={`relative z-10 flex-1 py-2 text-sm font-semibold transition-colors duration-300 ${activeRole === role
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
