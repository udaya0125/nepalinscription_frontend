// import React, { useState, useEffect, useMemo } from "react";
// import axios from "axios";
// import { Plus, Pencil, Trash2 } from "lucide-react";
// import AddUserForm from "@/AddFormComponents/AddUserForm";
// import Wrapper from "@/AdminWrapper/Wrapper";
// import MyTable from "@/MyTable/MyTable";

// const UserManagement = () => {
//     const [users, setUsers] = useState([]);
//     const [pagination, setPagination] = useState({
//         current_page: 1,
//         last_page: 1,
//         total: 0,
//         from: 0,
//         to: 0,
//     });
//     const [page, setPage] = useState(1);
//     const [perPage, setPerPage] = useState(10);
//     const [isLoading, setIsLoading] = useState(false);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingUser, setEditingUser] = useState(null);
//     const [showForm, setShowForm] = useState(false);

//     useEffect(() => {
//         const fetchUsers = async () => {
//             try {
//                 setIsLoading(true);
//                 const response = await axios.get(
//                     route("ourusers.index", { page, per_page: perPage }),
//                 );
//                 // paginate() returns { data: [...], current_page, last_page, total, from, to, ... }
//                 const { data, current_page, last_page, total, from, to } =
//                     response.data;

//                 // Deleted the last user on the final page: step back one page
//                 if (data.length === 0 && page > 1) {
//                     setPage((p) => p - 1);
//                     return;
//                 }

//                 setUsers(data);
//                 setPagination({
//                     current_page,
//                     last_page,
//                     total,
//                     from: from ?? 0,
//                     to: to ?? 0,
//                 });
//             } catch (error) {
//                 console.error("Fetching error", error);
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//         fetchUsers();
//     }, [reloadTrigger, page, perPage]);

//     const handleDelete = async (id) => {
//         if (!window.confirm("Delete this user?")) return;
//         try {
//             await axios.delete(route("ourusers.destroy", { user: id }));
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.error("Delete error", error);
//             alert(error.response?.data?.message ?? "Could not delete user.");
//         }
//     };

//     const handleEdit = (user) => {
//         setEditingUser(user);
//         setShowForm(true);
//     };

//     const handleUpdate = async (formData, id) => {
//         formData.append("_method", "PUT");
//         const response = await axios.post(
//             route("ourusers.update", { user: id }),
//             formData,
//             { headers: { "Content-Type": "multipart/form-data" } },
//         );
//         setReloadTrigger((prev) => !prev);
//         return response.data;
//     };

//     const handlePageSizeChange = (size) => {
//         setPerPage(size);
//         setPage(1);
//     };

//     const columns = useMemo(
//         () => [
//             {
//                 id: "user",
//                 Header: "User",
//                 Cell: ({ row }) => {
//                     const user = row.original;
//                     return (
//                         <div className="flex items-center gap-3">
//                             {user.image ? (
//                                 <img
//                                     src={`/storage/${user.image}`}
//                                     alt={user.name}
//                                     className="w-8 h-8 rounded-full object-cover"
//                                 />
//                             ) : (
//                                 <div className="w-8 h-8 rounded-full bg-gray-200" />
//                             )}
//                             {user.name}
//                         </div>
//                     );
//                 },
//             },
//             {
//                 Header: "Email",
//                 accessor: "email",
//             },
//             {
//                 Header: "Role",
//                 accessor: "role",
//             },
//             {
//                 id: "location",
//                 Header: "Location",
//                 Cell: ({ row }) =>
//                     [row.original.city, row.original.country]
//                         .filter(Boolean)
//                         .join(", "),
//             },
//             {
//                 Header: "Approved",
//                 accessor: "is_approved",
//                 Cell: ({ value }) => (
//                     <span
//                         className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
//                             value === "approved"
//                                 ? "bg-green-100 text-green-700"
//                                 : value === "rejected"
//                                 ? "bg-red-100 text-red-700"
//                                 : "bg-yellow-100 text-yellow-700"
//                         }`}
//                     >
//                         {value}
//                     </span>
//                 ),
//             },
//             {
//                 id: "actions",
//                 Header: "Actions",
//                 disableSortBy: true,
//                 Cell: ({ row }) => (
//                     <div className="flex gap-2">
//                         <button
//                             onClick={() => handleEdit(row.original)}
//                             className="p-2 hover:bg-gray-100 rounded-full"
//                         >
//                             <Pencil size={16} />
//                         </button>
//                         <button
//                             onClick={() => handleDelete(row.original.id)}
//                             className="p-2 hover:bg-red-50 text-red-600 rounded-full"
//                         >
//                             <Trash2 size={16} />
//                         </button>
//                     </div>
//                 ),
//             },
//         ],
//         [],
//     );

//     return (
//         <Wrapper>
//             <div className="mb-8 flex justify-between items-center">
//                 <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
//                     User Management
//                 </h1>
//                 <button
//                     onClick={() => {
//                         setEditingUser(null);
//                         setShowForm(true);
//                     }}
//                     className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
//                 >
//                     <Plus size={18} />
//                     <span>Create</span>
//                 </button>
//             </div>

//             <MyTable
//                 columns={columns}
//                 data={users}
//                 isLoading={isLoading}
//                 emptyMessage="No users found."
//                 serverPagination={{
//                     page,
//                     lastPage: pagination.last_page,
//                     total: pagination.total,
//                     from: pagination.from,
//                     to: pagination.to,
//                     perPage,
//                     onPageChange: setPage,
//                     onPageSizeChange: handlePageSizeChange,
//                 }}
//             />

//             <AddUserForm
//                 showForm={showForm}
//                 setShowForm={setShowForm}
//                 setReloadTrigger={setReloadTrigger}
//                 editingUser={editingUser}
//                 setEditingUser={setEditingUser}
//                 handleUpdate={handleUpdate}
//             />
//         </Wrapper>
//     );
// };

// export default UserManagement;



import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import { Plus, Pencil, Trash2, Search, X, ChevronDown, Check, Loader2 } from "lucide-react";
import AddUserForm from "@/AddFormComponents/AddUserForm";
import Wrapper from "@/AdminWrapper/Wrapper";
import MyTable from "@/MyTable/MyTable";

const STATUS_OPTIONS = [
    { value: "pending", label: "Pending", badge: "bg-yellow-100 text-yellow-700" },
    { value: "approved", label: "Approved", badge: "bg-green-100 text-green-700" },
    { value: "rejected", label: "Rejected", badge: "bg-red-100 text-red-700" },
];

const getStatusMeta = (value) =>
    STATUS_OPTIONS.find((o) => o.value === value) ?? STATUS_OPTIONS[0];

const MENU_WIDTH = 150;
const MENU_HEIGHT = STATUS_OPTIONS.length * 40 + 8;


const getInitials = (name) => {
    const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "?";
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
        parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
    ).toUpperCase();
};

// Defined OUTSIDE the main component. Shows the photo, or initials when there is
// no photo (or the photo fails to load).
const UserAvatar = ({ name, image }) => {
    const [failed, setFailed] = useState(false);

    // Reset the error state if the user's image changes
    useEffect(() => {
        setFailed(false);
    }, [image]);

    if (image && !failed) {
        return (
            <img
                src={`/storage/${image}`}
                alt={name}
                onError={() => setFailed(true)}
                className="w-8 h-8 rounded-full object-cover shrink-0"
            />
        );
    }

    return (
        <div
            className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold flex items-center justify-center shrink-0 select-none"
            title={name}
        >
            {getInitials(name)}
        </div>
    );
};

// Defined OUTSIDE the main component so it keeps its own state across re-renders.
// Badge button -> click opens a floating menu -> pick a status -> onChange(newValue).
const StatusSelect = ({ value, onChange }) => {
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const buttonRef = useRef(null);
    const menuRef = useRef(null);

    const current = getStatusMeta(value);

    const openMenu = () => {
        if (saving) return;
        const rect = buttonRef.current.getBoundingClientRect();
        const openUp = window.innerHeight - rect.bottom < MENU_HEIGHT + 8;
        const left = Math.min(rect.left, window.innerWidth - MENU_WIDTH - 8);
        setPosition({
            top: openUp ? rect.top - MENU_HEIGHT - 4 : rect.bottom + 4,
            left: Math.max(8, left),
        });
        setOpen(true);
    };

    // Close on outside click, Escape, scroll or resize
    useEffect(() => {
        if (!open) return undefined;

        const handleClick = (e) => {
            if (
                menuRef.current?.contains(e.target) ||
                buttonRef.current?.contains(e.target)
            ) {
                return;
            }
            setOpen(false);
        };
        const handleKey = (e) => {
            if (e.key === "Escape") setOpen(false);
        };
        const close = () => setOpen(false);

        document.addEventListener("mousedown", handleClick);
        document.addEventListener("keydown", handleKey);
        window.addEventListener("resize", close);
        window.addEventListener("scroll", close, true);
        return () => {
            document.removeEventListener("mousedown", handleClick);
            document.removeEventListener("keydown", handleKey);
            window.removeEventListener("resize", close);
            window.removeEventListener("scroll", close, true);
        };
    }, [open]);

    const handleSelect = async (next) => {
        setOpen(false);
        if (next === value) return;
        setSaving(true);
        try {
            await onChange(next);
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <button
                ref={buttonRef}
                type="button"
                onClick={openMenu}
                disabled={saving}
                title="Click to change status"
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium capitalize transition hover:ring-2 hover:ring-offset-1 hover:ring-gray-300 disabled:opacity-60 disabled:cursor-not-allowed ${current.badge}`}
            >
                {value || "pending"}
                {saving ? (
                    <Loader2 size={12} className="animate-spin" />
                ) : (
                    <ChevronDown size={12} />
                )}
            </button>

            {open &&
                createPortal(
                    <div
                        ref={menuRef}
                        style={{
                            position: "fixed",
                            top: position.top,
                            left: position.left,
                            width: MENU_WIDTH,
                            zIndex: 9999,
                        }}
                        className="rounded-xl border border-gray-200 bg-white p-1 shadow-xl"
                    >
                        {STATUS_OPTIONS.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => handleSelect(option.value)}
                                className="flex h-10 w-full items-center justify-between rounded-lg px-3 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                <span
                                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${option.badge}`}
                                >
                                    {option.label}
                                </span>
                                {option.value === value && (
                                    <Check size={16} className="text-indigo-600" />
                                )}
                            </button>
                        ))}
                    </div>,
                    document.body,
                )}
        </>
    );
};

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        total: 0,
        from: 0,
        to: 0,
    });
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [isLoading, setIsLoading] = useState(false);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [showForm, setShowForm] = useState(false);

    // Filters
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    // The columns are memoized once, so read the live filter through a ref
    const statusFilterRef = useRef(statusFilter);
    statusFilterRef.current = statusFilter;

    // Debounce the search box; reset to page 1 in the same batched update
    useEffect(() => {
        const timer = setTimeout(() => {
            const trimmed = searchInput.trim();
            if (trimmed !== search) {
                setSearch(trimmed);
                setPage(1);
            }
        }, 400);
        return () => clearTimeout(timer);
    }, [searchInput, search]);

    useEffect(() => {
        let ignore = false;

        const fetchUsers = async () => {
            try {
                setIsLoading(true);

                const params = { page, per_page: perPage };
                if (search) params.search = search;
                if (statusFilter) params.is_approved = statusFilter;

                const response = await axios.get(route("ourusers.index"), {
                    params,
                });
                if (ignore) return;

                // paginate() returns { data: [...], current_page, last_page, total, from, to, ... }
                const { data, current_page, last_page, total, from, to } =
                    response.data;

                // Deleted the last user on the final page: step back one page
                if (data.length === 0 && page > 1) {
                    setPage((p) => p - 1);
                    return;
                }

                setUsers(data);
                setPagination({
                    current_page,
                    last_page,
                    total,
                    from: from ?? 0,
                    to: to ?? 0,
                });
            } catch (error) {
                if (!ignore) console.error("Fetching error", error);
            } finally {
                if (!ignore) setIsLoading(false);
            }
        };
        fetchUsers();

        return () => {
            ignore = true;
        };
    }, [reloadTrigger, page, perPage, search, statusFilter]);

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this user?")) return;
        try {
            await axios.delete(route("ourusers.destroy", { user: id }));
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.error("Delete error", error);
            alert(error.response?.data?.message ?? "Could not delete user.");
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setShowForm(true);
    };

    const handleUpdate = async (formData, id) => {
        formData.append("_method", "PUT");
        const response = await axios.post(
            route("ourusers.update", { user: id }),
            formData,
            { headers: { "Content-Type": "multipart/form-data" } },
        );
        setReloadTrigger((prev) => !prev);
        return response.data;
    };

    // Inline status change straight from the table
    const handleStatusUpdate = useCallback(async (id, newStatus) => {
        try {
            const response = await axios.put(
                route("ourusers.update", { user: id }),
                { is_approved: newStatus },
            );
            const updated = response.data?.user;

            // Update the row in place so the table doesn't flash a loading state
            setUsers((prev) =>
                prev.map((u) =>
                    u.id === id
                        ? { ...u, ...(updated ?? {}), is_approved: newStatus }
                        : u,
                ),
            );

            // If a status filter is active the row may no longer belong: refetch
            if (statusFilterRef.current) {
                setReloadTrigger((prev) => !prev);
            }
        } catch (error) {
            console.error("Status update error", error);
            const message =
                error.response?.data?.errors?.is_approved?.[0] ??
                error.response?.data?.message ??
                "Could not update status.";
            alert(message);
        }
    }, []);

    const handlePageSizeChange = (size) => {
        setPerPage(size);
        setPage(1);
    };

    const handleStatusChange = (e) => {
        setStatusFilter(e.target.value);
        setPage(1);
    };

    const clearFilters = () => {
        setSearchInput("");
        setSearch("");
        setStatusFilter("");
        setPage(1);
    };

    const hasFilters = searchInput !== "" || search !== "" || statusFilter !== "";

    const columns = useMemo(
        () => [
             {
                id: "index",
                Header: "S/N",
                disableSortBy: true,
                Cell: ({ row }) => (
                    <span className="text-gray-500">{row.index + 1}</span>
                ),
            },
            {
                id: "user",
                Header: "User",
                Cell: ({ row }) => {
                    const user = row.original;
                    return (
                        <div className="flex items-center gap-3">
                            <UserAvatar name={user.name} image={user.image} />
                            {user.name}
                        </div>
                    );
                },
            },
            {
                Header: "Email",
                accessor: "email",
            },
            {
                Header: "Role",
                accessor: "role",
            },
            {
                id: "location",
                Header: "Location",
                Cell: ({ row }) =>
                    [row.original.city, row.original.country]
                        .filter(Boolean)
                        .join(", "),
            },
            {
                Header: "Approved",
                accessor: "is_approved",
                Cell: ({ value, row }) => (
                    <StatusSelect
                        value={value}
                        onChange={(next) =>
                            handleStatusUpdate(row.original.id, next)
                        }
                    />
                ),
            },
            {
                id: "actions",
                Header: "Actions",
                disableSortBy: true,
                Cell: ({ row }) => (
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleEdit(row.original)}
                            className="p-2 hover:bg-gray-100 rounded-full"
                        >
                            <Pencil size={16} />
                        </button>
                        <button
                            onClick={() => handleDelete(row.original.id)}
                            className="p-2 hover:bg-red-50 text-red-600 rounded-full"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ),
            },
        ],
        [handleStatusUpdate],
    );

    return (
        <Wrapper>
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
                    User Management
                </h1>
                <button
                    onClick={() => {
                        setEditingUser(null);
                        setShowForm(true);
                    }}
                    className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
                >
                    <Plus size={18} />
                    <span>Create</span>
                </button>
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-col sm:flex-row gap-3 sm:items-center">
                <div className="relative flex-1 max-w-md">
                    <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Search name, email, role, city, country..."
                        className="w-full border border-gray-300 rounded-full pl-10 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {searchInput && (
                        <button
                            type="button"
                            onClick={() => setSearchInput("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            aria-label="Clear search"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>

                <select
                    value={statusFilter}
                    onChange={handleStatusChange}
                    className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                    <option value="">All statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </select>

                {hasFilters && (
                    <button
                        type="button"
                        onClick={clearFilters}
                        className="px-4 py-2 rounded-full border text-gray-600 hover:bg-gray-50 transition"
                    >
                        Clear filters
                    </button>
                )}
            </div>

            <MyTable
                columns={columns}
                data={users}
                isLoading={isLoading}
                emptyMessage={
                    hasFilters
                        ? "No users match your filters."
                        : "No users found."
                }
                serverPagination={{
                    page,
                    lastPage: pagination.last_page,
                    total: pagination.total,
                    from: pagination.from,
                    to: pagination.to,
                    perPage,
                    onPageChange: setPage,
                    onPageSizeChange: handlePageSizeChange,
                }}
            />

            <AddUserForm
                showForm={showForm}
                setShowForm={setShowForm}
                setReloadTrigger={setReloadTrigger}
                editingUser={editingUser}
                setEditingUser={setEditingUser}
                handleUpdate={handleUpdate}
            />
        </Wrapper>
    );
};

export default UserManagement;



// import React, { useState, useEffect, useMemo } from "react";
// import axios from "axios";
// import { Plus, Pencil, Trash2, Search, X } from "lucide-react";
// import AddUserForm from "@/AddFormComponents/AddUserForm";
// import Wrapper from "@/AdminWrapper/Wrapper";
// import MyTable from "@/MyTable/MyTable";

// const UserManagement = () => {
//     const [users, setUsers] = useState([]);
//     const [pagination, setPagination] = useState({
//         current_page: 1,
//         last_page: 1,
//         total: 0,
//         from: 0,
//         to: 0,
//     });
//     const [page, setPage] = useState(1);
//     const [perPage, setPerPage] = useState(10);
//     const [isLoading, setIsLoading] = useState(false);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingUser, setEditingUser] = useState(null);
//     const [showForm, setShowForm] = useState(false);

//     // Filters
//     const [searchInput, setSearchInput] = useState("");
//     const [search, setSearch] = useState("");
//     const [statusFilter, setStatusFilter] = useState("");

//     // Debounce the search box; reset to page 1 in the same batched update
//     useEffect(() => {
//         const timer = setTimeout(() => {
//             const trimmed = searchInput.trim();
//             if (trimmed !== search) {
//                 setSearch(trimmed);
//                 setPage(1);
//             }
//         }, 400);
//         return () => clearTimeout(timer);
//     }, [searchInput, search]);

//     useEffect(() => {
//         let ignore = false;

//         const fetchUsers = async () => {
//             try {
//                 setIsLoading(true);

//                 const params = { page, per_page: perPage };
//                 if (search) params.search = search;
//                 if (statusFilter) params.is_approved = statusFilter;

//                 const response = await axios.get(route("ourusers.index"), {
//                     params,
//                 });
//                 if (ignore) return;

//                 // paginate() returns { data: [...], current_page, last_page, total, from, to, ... }
//                 const { data, current_page, last_page, total, from, to } =
//                     response.data;

//                 // Deleted the last user on the final page: step back one page
//                 if (data.length === 0 && page > 1) {
//                     setPage((p) => p - 1);
//                     return;
//                 }

//                 setUsers(data);
//                 setPagination({
//                     current_page,
//                     last_page,
//                     total,
//                     from: from ?? 0,
//                     to: to ?? 0,
//                 });
//             } catch (error) {
//                 if (!ignore) console.error("Fetching error", error);
//             } finally {
//                 if (!ignore) setIsLoading(false);
//             }
//         };
//         fetchUsers();

//         return () => {
//             ignore = true;
//         };
//     }, [reloadTrigger, page, perPage, search, statusFilter]);

//     const handleDelete = async (id) => {
//         if (!window.confirm("Delete this user?")) return;
//         try {
//             await axios.delete(route("ourusers.destroy", { user: id }));
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.error("Delete error", error);
//             alert(error.response?.data?.message ?? "Could not delete user.");
//         }
//     };

//     const handleEdit = (user) => {
//         setEditingUser(user);
//         setShowForm(true);
//     };

//     const handleUpdate = async (formData, id) => {
//         formData.append("_method", "PUT");
//         const response = await axios.post(
//             route("ourusers.update", { user: id }),
//             formData,
//             { headers: { "Content-Type": "multipart/form-data" } },
//         );
//         setReloadTrigger((prev) => !prev);
//         return response.data;
//     };

//     const handlePageSizeChange = (size) => {
//         setPerPage(size);
//         setPage(1);
//     };

//     const handleStatusChange = (e) => {
//         setStatusFilter(e.target.value);
//         setPage(1);
//     };

//     const clearFilters = () => {
//         setSearchInput("");
//         setSearch("");
//         setStatusFilter("");
//         setPage(1);
//     };

//     const hasFilters = searchInput !== "" || search !== "" || statusFilter !== "";

//     const columns = useMemo(
//         () => [
//             {
//                 id: "user",
//                 Header: "User",
//                 Cell: ({ row }) => {
//                     const user = row.original;
//                     return (
//                         <div className="flex items-center gap-3">
//                             {user.image ? (
//                                 <img
//                                     src={`/storage/${user.image}`}
//                                     alt={user.name}
//                                     className="w-8 h-8 rounded-full object-cover"
//                                 />
//                             ) : (
//                                 <div className="w-8 h-8 rounded-full bg-gray-200" />
//                             )}
//                             {user.name}
//                         </div>
//                     );
//                 },
//             },
//             {
//                 Header: "Email",
//                 accessor: "email",
//             },
//             {
//                 Header: "Role",
//                 accessor: "role",
//             },
//             {
//                 id: "location",
//                 Header: "Location",
//                 Cell: ({ row }) =>
//                     [row.original.city, row.original.country]
//                         .filter(Boolean)
//                         .join(", "),
//             },
//             {
//                 Header: "Approved",
//                 accessor: "is_approved",
//                 Cell: ({ value }) => (
//                     <span
//                         className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
//                             value === "approved"
//                                 ? "bg-green-100 text-green-700"
//                                 : value === "rejected"
//                                 ? "bg-red-100 text-red-700"
//                                 : "bg-yellow-100 text-yellow-700"
//                         }`}
//                     >
//                         {value}
//                     </span>
//                 ),
//             },
//             {
//                 id: "actions",
//                 Header: "Actions",
//                 disableSortBy: true,
//                 Cell: ({ row }) => (
//                     <div className="flex gap-2">
//                         <button
//                             onClick={() => handleEdit(row.original)}
//                             className="p-2 hover:bg-gray-100 rounded-full"
//                         >
//                             <Pencil size={16} />
//                         </button>
//                         <button
//                             onClick={() => handleDelete(row.original.id)}
//                             className="p-2 hover:bg-red-50 text-red-600 rounded-full"
//                         >
//                             <Trash2 size={16} />
//                         </button>
//                     </div>
//                 ),
//             },
//         ],
//         [],
//     );

//     return (
//         <Wrapper>
//             <div className="mb-6 flex justify-between items-center">
//                 <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
//                     User Management
//                 </h1>
//                 <button
//                     onClick={() => {
//                         setEditingUser(null);
//                         setShowForm(true);
//                     }}
//                     className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
//                 >
//                     <Plus size={18} />
//                     <span>Create</span>
//                 </button>
//             </div>

//             {/* Filters */}
//             <div className="mb-6 flex flex-col sm:flex-row gap-3 sm:items-center">
//                 <div className="relative flex-1 max-w-md">
//                     <Search
//                         size={18}
//                         className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                     />
//                     <input
//                         type="text"
//                         value={searchInput}
//                         onChange={(e) => setSearchInput(e.target.value)}
//                         placeholder="Search name, email, role, city, country..."
//                         className="w-full border border-gray-300 rounded-full pl-10 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                     />
//                     {searchInput && (
//                         <button
//                             type="button"
//                             onClick={() => setSearchInput("")}
//                             className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                             aria-label="Clear search"
//                         >
//                             <X size={16} />
//                         </button>
//                     )}
//                 </div>

//                 <select
//                     value={statusFilter}
//                     onChange={handleStatusChange}
//                     className="border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
//                 >
//                     <option value="">All statuses</option>
//                     <option value="pending">Pending</option>
//                     <option value="approved">Approved</option>
//                     <option value="rejected">Rejected</option>
//                 </select>

//                 {hasFilters && (
//                     <button
//                         type="button"
//                         onClick={clearFilters}
//                         className="px-4 py-2 rounded-full border text-gray-600 hover:bg-gray-50 transition"
//                     >
//                         Clear filters
//                     </button>
//                 )}
//             </div>

//             <MyTable
//                 columns={columns}
//                 data={users}
//                 isLoading={isLoading}
//                 emptyMessage={
//                     hasFilters
//                         ? "No users match your filters."
//                         : "No users found."
//                 }
//                 serverPagination={{
//                     page,
//                     lastPage: pagination.last_page,
//                     total: pagination.total,
//                     from: pagination.from,
//                     to: pagination.to,
//                     perPage,
//                     onPageChange: setPage,
//                     onPageSizeChange: handlePageSizeChange,
//                 }}
//             />

//             <AddUserForm
//                 showForm={showForm}
//                 setShowForm={setShowForm}
//                 setReloadTrigger={setReloadTrigger}
//                 editingUser={editingUser}
//                 setEditingUser={setEditingUser}
//                 handleUpdate={handleUpdate}
//             />
//         </Wrapper>
//     );
// };

// export default UserManagement;



// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Plus, Pencil, Trash2 } from "lucide-react";
// import AddUserForm from "@/AddFormComponents/AddUserForm";
// import Wrapper from "@/AdminWrapper/Wrapper";

// const UserManagement = () => {
//     const [users, setUsers] = useState([]);
//     const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 });
//     const [page, setPage] = useState(1);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingUser, setEditingUser] = useState(null);
//     const [showForm, setShowForm] = useState(false);

//     useEffect(() => {
//         const fetchUsers = async () => {
//             try {
//                 const response = await axios.get(route("ourusers.index", { page }));
//                 // paginate() returns { data: [...], current_page, last_page, ... }
//                 setUsers(response.data.data);
//                 setPagination({
//                     current_page: response.data.current_page,
//                     last_page: response.data.last_page,
//                 });
//             } catch (error) {
//                 console.error("Fetching error", error);
//             }
//         };
//         fetchUsers();
//     }, [reloadTrigger, page]);

//     const handleDelete = async (id) => {
//         if (!window.confirm("Delete this user?")) return;
//         try {
//             await axios.delete(route("ourusers.destroy", { user: id }));
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.error("Delete error", error);
//             alert(error.response?.data?.message ?? "Could not delete user.");
//         }
//     };

//     const handleEdit = (user) => {
//         setEditingUser(user);
//         setShowForm(true);
//     };

//     const handleUpdate = async (formData, id) => {
//         formData.append("_method", "PUT");
//         const response = await axios.post(
//             route("ourusers.update", { user: id }),
//             formData,
//             { headers: { "Content-Type": "multipart/form-data" } },
//         );
//         setReloadTrigger((prev) => !prev);
//         return response.data;
//     };

//     return (
//         <Wrapper>
//             <div className="mb-8 flex justify-between items-center">
//                 <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
//                     User Management
//                 </h1>
//                 <button
//                     onClick={() => {
//                         setEditingUser(null);
//                         setShowForm(true);
//                     }}
//                     className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
//                 >
//                     <Plus size={18} />
//                     <span>Create</span>
//                 </button>
//             </div>

//             <div className="bg-white rounded-xl shadow overflow-x-auto">
//                 <table className="w-full text-left text-sm">
//                     <thead className="bg-gray-50 text-gray-600">
//                         <tr>
//                             <th className="p-3">User</th>
//                             <th className="p-3">Email</th>
//                             <th className="p-3">Role</th>
//                             <th className="p-3">Location</th>
//                             <th className="p-3">Approved</th>
//                             <th className="p-3 text-right">Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {users.length === 0 && (
//                             <tr>
//                                 <td colSpan={6} className="p-6 text-center text-gray-500">
//                                     No users found.
//                                 </td>
//                             </tr>
//                         )}
//                         {users.map((user) => (
//                             <tr key={user.id} className="border-t">
//                                 <td className="p-3">
//                                     <div className="flex items-center gap-3">
//                                         {user.image ? (
//                                             <img
//                                                 src={`/storage/${user.image}`}
//                                                 alt={user.name}
//                                                 className="w-8 h-8 rounded-full object-cover"
//                                             />
//                                         ) : (
//                                             <div className="w-8 h-8 rounded-full bg-gray-200" />
//                                         )}
//                                         {user.name}
//                                     </div>
//                                 </td>
//                                 <td className="p-3">{user.email}</td>
//                                 <td className="p-3">{user.role}</td>
//                                 <td className="p-3">
//                                     {[user.city, user.country].filter(Boolean).join(", ")}
//                                 </td>
//                                 <td className="p-3">
//     <span
//         className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
//             user.is_approved === "approved"
//                 ? "bg-green-100 text-green-700"
//                 : user.is_approved === "rejected"
//                 ? "bg-red-100 text-red-700"
//                 : "bg-yellow-100 text-yellow-700"
//         }`}
//     >
//         {user.is_approved}
//     </span>
// </td>
//                                 <td className="p-3">
//                                     <div className="flex justify-end gap-2">
//                                         <button
//                                             onClick={() => handleEdit(user)}
//                                             className="p-2 hover:bg-gray-100 rounded-full"
//                                         >
//                                             <Pencil size={16} />
//                                         </button>
//                                         <button
//                                             onClick={() => handleDelete(user.id)}
//                                             className="p-2 hover:bg-red-50 text-red-600 rounded-full"
//                                         >
//                                             <Trash2 size={16} />
//                                         </button>
//                                     </div>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>

//             <div className="flex justify-end items-center gap-3 mt-4">
//                 <button
//                     disabled={pagination.current_page <= 1}
//                     onClick={() => setPage((p) => p - 1)}
//                     className="px-3 py-1 border rounded disabled:opacity-40"
//                 >
//                     Prev
//                 </button>
//                 <span className="text-sm text-gray-600">
//                     Page {pagination.current_page} of {pagination.last_page}
//                 </span>
//                 <button
//                     disabled={pagination.current_page >= pagination.last_page}
//                     onClick={() => setPage((p) => p + 1)}
//                     className="px-3 py-1 border rounded disabled:opacity-40"
//                 >
//                     Next
//                 </button>
//             </div>

//             <AddUserForm
//                 showForm={showForm}
//                 setShowForm={setShowForm}
//                 setReloadTrigger={setReloadTrigger}
//                 editingUser={editingUser}
//                 setEditingUser={setEditingUser}
//                 handleUpdate={handleUpdate}
//             />
//         </Wrapper>
//     );
// };

// export default UserManagement;
