// import Wrapper from '@/AdminWrapper/Wrapper'
// import React, { useEffect, useMemo, useState } from 'react'
// import axios from 'axios'

// const ActivityLogs = () => {
//     const [activityLogs, setActivityLogs] = useState([])
//     const [loading, setLoading] = useState(true)
//     const [error, setError] = useState(null)
//     const [search, setSearch] = useState('')

//     const fetchLogs = async () => {
//         try {
//             setLoading(true)
//             setError(null)

//             const response = await axios.get(route('ourlogs.index'))
//             const responseData = response.data

//             if (responseData.success && Array.isArray(responseData.data)) {
//                 setActivityLogs(responseData.data)
//             } else {
//                 console.error('Unexpected response structure:', responseData)
//                 setActivityLogs([])
//                 setError('Unexpected data format received from server.')
//             }
//         } catch (err) {
//             console.error('Error fetching logs:', err)
//             setError('Failed to fetch logs. Please try again later.')
//             setActivityLogs([])
//         } finally {
//             setLoading(false)
//         }
//     }

//     useEffect(() => {
//         fetchLogs()
//     }, [])

//     const filteredLogs = useMemo(() => {
//         const term = search.trim().toLowerCase()
//         if (!term) return activityLogs

//         return activityLogs.filter((log) =>
//             [log.name, log.title, log.ip_address]
//                 .filter(Boolean)
//                 .some((value) => String(value).toLowerCase().includes(term)),
//         )
//     }, [activityLogs, search])

//     const formatDate = (value) => {
//         if (!value) return '-'
//         return new Date(value).toLocaleString()
//     }

//     return (
//         <Wrapper>
//             <div className="p-6">
//                 <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
//                     <h1 className="text-2xl font-semibold">Activity Logs</h1>

//                     <div className="flex items-center gap-2">
//                         <input
//                             type="text"
//                             value={search}
//                             onChange={(e) => setSearch(e.target.value)}
//                             placeholder="Search name, title or IP..."
//                             className="w-64 rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
//                         />
//                         <button
//                             type="button"
//                             onClick={fetchLogs}
//                             disabled={loading}
//                             className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
//                         >
//                             {loading ? 'Loading...' : 'Refresh'}
//                         </button>
//                     </div>
//                 </div>

//                 {error && (
//                     <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//                         {error}
//                     </div>
//                 )}

//                 <div className="overflow-x-auto rounded border border-gray-200 bg-white">
//                     <table className="min-w-full divide-y divide-gray-200 text-sm">
//                         <thead className="bg-gray-50">
//                             <tr>
//                                 <th className="px-4 py-3 text-left font-medium text-gray-600">#</th>
//                                 <th className="px-4 py-3 text-left font-medium text-gray-600">Name</th>
//                                 <th className="px-4 py-3 text-left font-medium text-gray-600">Title</th>
//                                 <th className="px-4 py-3 text-left font-medium text-gray-600">IP Address</th>
//                                 <th className="px-4 py-3 text-left font-medium text-gray-600">Date</th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-100">
//                             {loading ? (
//                                 <tr>
//                                     <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
//                                         Loading logs...
//                                     </td>
//                                 </tr>
//                             ) : filteredLogs.length === 0 ? (
//                                 <tr>
//                                     <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
//                                         No activity logs found.
//                                     </td>
//                                 </tr>
//                             ) : (
//                                 filteredLogs.map((log, index) => (
//                                     <tr key={log.id} className="hover:bg-gray-50">
//                                         <td className="px-4 py-3 text-gray-500">{index + 1}</td>
//                                         <td className="px-4 py-3">{log.name}</td>
//                                         <td className="px-4 py-3">{log.title}</td>
//                                         <td className="px-4 py-3">{log.ip_address}</td>
//                                         <td className="px-4 py-3 whitespace-nowrap">
//                                             {formatDate(log.created_at)}
//                                         </td>
//                                     </tr>
//                                 ))
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </Wrapper>
//     )
// }

// export default ActivityLogs


import Wrapper from "@/AdminWrapper/Wrapper";
import MyTable from "@/MyTable/MyTable";
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const formatDate = (value) => {
    if (!value) return "-";
    return new Date(value).toLocaleString();
};

const ActivityLogs = () => {
    const [activityLogs, setActivityLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");

    const fetchLogs = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.get(route("ourlogs.index"));
            const responseData = response.data;

            if (responseData.success && Array.isArray(responseData.data)) {
                setActivityLogs(responseData.data);
            } else {
                console.error("Unexpected response structure:", responseData);
                setActivityLogs([]);
                setError("Unexpected data format received from server.");
            }
        } catch (err) {
            console.error("Error fetching logs:", err);
            setError("Failed to fetch logs. Please try again later.");
            setActivityLogs([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const filteredLogs = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return activityLogs;

        return activityLogs.filter((log) =>
            [log.name, log.title, log.ip_address]
                .filter(Boolean)
                .some((value) => String(value).toLowerCase().includes(term)),
        );
    }, [activityLogs, search]);

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
                Header: "Name",
                accessor: "name",
            },
            {
                Header: "Title",
                accessor: "title",
                Cell: ({ value }) => (
                    <span className="whitespace-normal">{value}</span>
                ),
            },
            {
                Header: "IP Address",
                accessor: "ip_address",
            },
            {
                Header: "Date",
                accessor: "created_at",
                Cell: ({ value }) => (
                    <span className="whitespace-nowrap">{formatDate(value)}</span>
                ),
            },
        ],
        [],
    );

    return (
        <Wrapper>
            <div className="">
                <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <h1 className="text-2xl font-semibold">Activity Logs</h1>

                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search name, title or IP..."
                            className="w-64 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                        />
                        <button
                            type="button"
                            onClick={fetchLogs}
                            disabled={loading}
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {loading ? "Loading..." : "Refresh"}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <MyTable
                    columns={columns}
                    data={filteredLogs}
                    isLoading={loading}
                    emptyMessage="No activity logs found."
                />
            </div>
        </Wrapper>
    );
};

export default ActivityLogs;
