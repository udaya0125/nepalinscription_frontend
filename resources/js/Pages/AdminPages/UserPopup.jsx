import React, { useEffect, useState } from "react";
import {
    X,
    Mail,
    MapPin,
    Building2,
    Shield,
    CalendarPlus,
    CalendarClock,
    Pencil,
} from "lucide-react";

const STATUS_STYLES = {
    pending: {
        badge: "bg-yellow-50 text-yellow-700 ring-yellow-200",
        dot: "bg-yellow-500",
    },
    approved: {
        badge: "bg-green-50 text-green-700 ring-green-200",
        dot: "bg-green-500",
    },
    rejected: {
        badge: "bg-red-50 text-red-700 ring-red-200",
        dot: "bg-red-500",
    },
};

const getInitials = (name) => {
    const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "?";
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
        parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
    ).toUpperCase();
};

const formatDate = (value) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

// Defined OUTSIDE the main component so it keeps its own state across re-renders.
const PopupAvatar = ({ name, image }) => {
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        setFailed(false);
    }, [image]);

    if (image && !failed) {
        return (
            <img
                src={`/storage/${image}`}
                alt={name}
                onError={() => setFailed(true)}
                className="h-20 w-20 shrink-0 rounded-2xl object-cover ring-4 ring-indigo-50"
            />
        );
    }

    return (
        <div className="flex h-20 w-20 shrink-0 select-none items-center justify-center rounded-2xl bg-indigo-600 text-2xl font-semibold text-white ring-4 ring-indigo-50">
            {getInitials(name)}
        </div>
    );
};

const InfoRow = ({ icon: Icon, label, children }) => (
    <div className="flex items-center justify-between gap-4 py-3">
        <div className="flex shrink-0 items-center gap-2 text-sm text-gray-500">
            <Icon size={16} className="text-gray-400" />
            <span>{label}</span>
        </div>
        <div className="min-w-0 break-words text-right text-sm font-medium text-gray-900">
            {children}
        </div>
    </div>
);

const UserPopup = ({ showPopup, setShowPopup, user, onEdit }) => {
    const open = showPopup && !!user;

    // Lock background scroll while the popup is open
    useEffect(() => {
        if (!open) return undefined;
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, [open]);

    // Close on Escape
    useEffect(() => {
        if (!open) return undefined;
        const handleKey = (e) => {
            if (e.key === "Escape") setShowPopup(false);
        };
        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [open, setShowPopup]);

    if (!open) return null;

    const status = user.is_approved || "pending";
    const statusStyle = STATUS_STYLES[status] ?? STATUS_STYLES.pending;
    const location = [user.city, user.country].filter(Boolean).join(", ");

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 p-4 backdrop-blur-sm"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) setShowPopup(false);
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-label="User details"
                className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-2xl"
            >
                <button
                    type="button"
                    onClick={() => setShowPopup(false)}
                    className="absolute right-4 top-4 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                    aria-label="Close"
                >
                    <X size={20} />
                </button>

                {/* Profile */}
                <div className="flex items-center gap-4 px-6 pb-5 pt-6 pr-14">
                    <PopupAvatar name={user.name} image={user.image} />
                    <div className="min-w-0">
                        <h2 className="truncate text-xl font-bold text-gray-900">
                            {user.name}
                        </h2>
                        <p className="truncate text-sm text-gray-500">
                            {user.email || "—"}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                            <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium capitalize ring-1 ring-inset ${statusStyle.badge}`}
                            >
                                <span
                                    className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`}
                                />
                                {status}
                            </span>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium capitalize text-gray-700">
                                <Shield size={12} />
                                {user.role || "—"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Details */}
                <div className="mx-6 divide-y divide-gray-100 border-y border-gray-100">
                    <InfoRow icon={Mail} label="Email">
                        {user.email || "—"}
                    </InfoRow>
                    <InfoRow icon={MapPin} label="Location">
                        {location || "—"}
                    </InfoRow>
                    <InfoRow icon={Building2} label="Institution">
                        {user.affiliated_institution || "—"}
                    </InfoRow>
                    <InfoRow icon={CalendarPlus} label="Created">
                        {formatDate(user.created_at)}
                    </InfoRow>
                    <InfoRow icon={CalendarClock} label="Updated">
                        {formatDate(user.updated_at)}
                    </InfoRow>
                </div>

                {/* Footer */}
                <div className="flex gap-3 px-6 py-5">
                    <button
                        type="button"
                        onClick={() => setShowPopup(false)}
                        className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
                    >
                        Close
                    </button>
                    {onEdit && (
                        <button
                            type="button"
                            onClick={() => onEdit(user)}
                            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700"
                        >
                            <Pencil size={16} />
                            Edit User
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserPopup;