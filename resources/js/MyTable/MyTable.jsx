import React from "react";
import { useTable, useSortBy, usePagination } from "react-table";

/* ----------------------------- Icons ----------------------------- */

const Svg = ({ className = "w-4 h-4", children }) => (
    <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        {children}
    </svg>
);

const IconSortAsc = () => (
    <Svg className="w-3.5 h-3.5">
        <path d="M12 19V5M5 12l7-7 7 7" />
    </Svg>
);
const IconSortDesc = () => (
    <Svg className="w-3.5 h-3.5">
        <path d="M12 5v14M19 12l-7 7-7-7" />
    </Svg>
);
const IconSelector = () => (
    <Svg className="w-3.5 h-3.5">
        <path d="M8 9l4-4 4 4M16 15l-4 4-4-4" />
    </Svg>
);
const IconChevronLeft = () => (
    <Svg>
        <path d="M15 18l-6-6 6-6" />
    </Svg>
);
const IconChevronRight = () => (
    <Svg>
        <path d="M9 18l6-6-6-6" />
    </Svg>
);
const IconChevronsLeft = () => (
    <Svg>
        <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5" />
    </Svg>
);
const IconChevronsRight = () => (
    <Svg>
        <path d="M13 17l5-5-5-5M6 17l5-5-5-5" />
    </Svg>
);
const IconChevronDown = () => (
    <Svg className="w-3.5 h-3.5">
        <path d="M6 9l6 6 6-6" />
    </Svg>
);
const IconInbox = () => (
    <Svg className="w-10 h-10">
        <path d="M22 12h-6l-2 3h-4l-2-3H2" />
        <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </Svg>
);

/* ----------------------------- Helpers ----------------------------- */

const PAGE_SIZE_OPTIONS = [10, 20, 30, 50];

const pagerBtn =
    "inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-400 disabled:cursor-not-allowed transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300";

/* ----------------------------- Component ----------------------------- */

/**
 * Props:
 *  - columns, data          react-table v7 columns / rows
 *  - isLoading              shows skeleton rows
 *  - emptyMessage           text for the empty state
 *  - serverPagination       optional. When provided, your API paginates:
 *      {
 *        page,              1-based current page
 *        lastPage,
 *        total,             total records
 *        from, to,          range shown (Laravel's `from` / `to`)
 *        perPage,
 *        onPageChange(page),
 *        onPageSizeChange(size)   optional; hides the select if omitted
 *      }
 */
const MyTable = ({
    columns,
    data,
    isLoading = false,
    emptyMessage = "No records found.",
    serverPagination,
}) => {
    const isServer = Boolean(serverPagination);
    const plugins = isServer ? [useSortBy] : [useSortBy, usePagination];

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        rows,
        page,
        pageCount,
        gotoPage,
        setPageSize,
        state: { pageIndex, pageSize: tablePageSize },
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0, pageSize: 10 },
            autoResetSortBy: false,
        },
        ...plugins,
    );

    const { key: _tableKey, ...tableProps } = getTableProps();

    const displayRows = isServer ? rows : page;
    const currentIndex = isServer ? serverPagination.page - 1 : pageIndex;
    const totalPages = Math.max(
        1,
        isServer ? serverPagination.lastPage : pageCount,
    );
    const pageSize = isServer ? serverPagination.perPage : tablePageSize;
    const onPageSizeChange = isServer
        ? serverPagination.onPageSizeChange
        : setPageSize;

    const goTo = (index) =>
        isServer ? serverPagination.onPageChange(index + 1) : gotoPage(index);

    const totalRows = isServer ? serverPagination.total ?? 0 : rows.length;
    const from = isServer
        ? serverPagination.from ?? 0
        : totalRows === 0
        ? 0
        : pageIndex * pageSize + 1;
    const to = isServer
        ? serverPagination.to ?? 0
        : Math.min((pageIndex + 1) * pageSize, totalRows);

    const canPrev = currentIndex > 0;
    const canNext = currentIndex < totalPages - 1;

    const sizeOptions = PAGE_SIZE_OPTIONS.includes(pageSize)
        ? PAGE_SIZE_OPTIONS
        : [...PAGE_SIZE_OPTIONS, pageSize].sort((a, b) => a - b);

    return (
        <div className="w-full mt-6 rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            {/* Table */}
            <div className="overflow-x-auto">
                <table {...tableProps} className="w-full text-sm">
                    <thead>
                        {headerGroups.map((headerGroup) => {
                            const { key: hgKey, ...hgProps } =
                                headerGroup.getHeaderGroupProps();
                            return (
                                <tr
                                    key={hgKey}
                                    {...hgProps}
                                    className="bg-gray-50/80 border-b border-gray-200"
                                >
                                    {headerGroup.headers.map((column) => {
                                        const { key: hKey, ...hProps } =
                                            column.getHeaderProps(
                                                column.getSortByToggleProps(),
                                            );
                                        const sortable = column.canSort;
                                        return (
                                            <th
                                                key={hKey}
                                                {...hProps}
                                                aria-sort={
                                                    column.isSorted
                                                        ? column.isSortedDesc
                                                            ? "descending"
                                                            : "ascending"
                                                        : "none"
                                                }
                                                className={`group px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap select-none ${
                                                    column.isSorted
                                                        ? "text-indigo-600"
                                                        : "text-gray-500"
                                                } ${
                                                    sortable
                                                        ? "cursor-pointer hover:text-gray-800"
                                                        : ""
                                                }`}
                                            >
                                                <div className="flex items-center gap-1.5">
                                                    {column.render("Header")}
                                                    {sortable && (
                                                        <span
                                                            className={
                                                                column.isSorted
                                                                    ? "text-indigo-600"
                                                                    : "text-gray-300 group-hover:text-gray-500"
                                                            }
                                                        >
                                                            {column.isSorted ? (
                                                                column.isSortedDesc ? (
                                                                    <IconSortDesc />
                                                                ) : (
                                                                    <IconSortAsc />
                                                                )
                                                            ) : (
                                                                <IconSelector />
                                                            )}
                                                        </span>
                                                    )}
                                                </div>
                                            </th>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </thead>

                    <tbody {...getTableBodyProps()}>
                        {/* Loading skeleton */}
                        {isLoading &&
                            Array.from({ length: 5 }).map((_, r) => (
                                <tr
                                    key={`sk-${r}`}
                                    className="border-b border-gray-100"
                                >
                                    {columns.map((_, c) => (
                                        <td key={c} className="px-5 py-4">
                                            <div className="h-4 rounded bg-gray-100 animate-pulse" />
                                        </td>
                                    ))}
                                </tr>
                            ))}

                        {/* Empty state */}
                        {!isLoading && displayRows.length === 0 && (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-5 py-16"
                                >
                                    <div className="flex flex-col items-center gap-2 text-gray-400">
                                        <IconInbox />
                                        <p className="text-sm font-medium text-gray-500">
                                            {emptyMessage}
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        )}

                        {/* Rows */}
                        {!isLoading &&
                            displayRows.map((row) => {
                                prepareRow(row);
                                const { key: _rowKey, ...rowProps } =
                                    row.getRowProps();
                                return (
                                    <tr
                                        key={row.original.id ?? row.id}
                                        {...rowProps}
                                        className="border-b border-gray-100 last:border-b-0 transition-colors hover:bg-indigo-50/40"
                                    >
                                        {row.cells.map((cell) => {
                                            const { key: cellKey, ...cellProps } =
                                                cell.getCellProps();
                                            return (
                                                <td
                                                    key={cellKey}
                                                    {...cellProps}
                                                    className="px-5 py-3.5 text-gray-700 whitespace-nowrap"
                                                >
                                                    {cell.render("Cell")}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3.5 border-t border-gray-100 bg-gray-50/50 text-sm text-gray-500">
                {/* Left: summary */}
                <span>
                    Showing {from}–{to} of {totalRows}
                </span>

                {/* Right: page size + pager */}
                <div className="flex items-center gap-3">
                    {onPageSizeChange && (
                        <div className="relative">
                            <select
                                value={pageSize}
                                onChange={(e) =>
                                    onPageSizeChange(Number(e.target.value))
                                }
                                aria-label="Rows per page"
                                className="h-9 appearance-none rounded-lg border border-gray-200 bg-white pl-3 pr-9 text-sm text-gray-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300"
                            >
                                {sizeOptions.map((size) => (
                                    <option key={size} value={size}>
                                        {size} / page
                                    </option>
                                ))}
                            </select>
                            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <IconChevronDown />
                            </span>
                        </div>
                    )}

                    <nav
                        className="flex items-center gap-1"
                        aria-label="Pagination"
                    >
                        <button
                            type="button"
                            onClick={() => goTo(0)}
                            disabled={!canPrev}
                            aria-label="First page"
                            className={pagerBtn}
                        >
                            <IconChevronsLeft />
                        </button>
                        <button
                            type="button"
                            onClick={() => goTo(currentIndex - 1)}
                            disabled={!canPrev}
                            aria-label="Previous page"
                            className={pagerBtn}
                        >
                            <IconChevronLeft />
                        </button>

                        <span className="px-3 text-gray-600 whitespace-nowrap">
                            Page {currentIndex + 1} of {totalPages}
                        </span>

                        <button
                            type="button"
                            onClick={() => goTo(currentIndex + 1)}
                            disabled={!canNext}
                            aria-label="Next page"
                            className={pagerBtn}
                        >
                            <IconChevronRight />
                        </button>
                        <button
                            type="button"
                            onClick={() => goTo(totalPages - 1)}
                            disabled={!canNext}
                            aria-label="Last page"
                            className={pagerBtn}
                        >
                            <IconChevronsRight />
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default MyTable;