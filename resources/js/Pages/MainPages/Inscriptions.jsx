// import React, { useEffect, useState } from "react";
// import { Link } from "@inertiajs/react";
// import axios from "axios";
// import GuestLayout from "@/Layouts/GuestLayout";

// const ITEMS_PER_PAGE = 10;

// const Inscriptions = () => {
//   const [inscriptions, setInscriptions] = useState([]);
//   const [filtered, setFiltered] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

//   const [dateSort, setDateSort] = useState("oldest");

//   const imgurl = import.meta.env.VITE_IMAGE_PATH;

//   // FETCH DATA
//   useEffect(() => {
//     const fetchInscription = async () => {
//       try {
//         // IMPORTANT: request a high per_page so we get ALL inscriptions,
//         // not just the server's default top-10 newest. Without this,
//         // anything beyond the 10 most recently added records never
//         // reaches the frontend at all.
//         const response = await axios.get(`${API_BASE_URL}/inscriptions`, {
//           params: {
//             per_page: 1000, // effectively "all" — adjust if you expect more
//             page: 1,
//           },
//         });

//         const data = response.data;
//         let fetchedData = [];

//         if (data?.results) fetchedData = data.results;
//         else if (data?.data) fetchedData = data.data;
//         else if (Array.isArray(data)) fetchedData = data;

//         const published = fetchedData.filter(
//           (item) => item.status === "published",
//         );

//         setInscriptions(published);
//       } catch (error) {
//         console.error("fetch error", error);
//       }
//     };

//     fetchInscription();
//   }, []);

//   // SORT
//   useEffect(() => {
//     let data = [...inscriptions];

//     if (dateSort === "latest") {
//       data.sort((a, b) => b.id - a.id);
//     } else {
//       data.sort((a, b) => a.id - b.id);
//     }

//     setFiltered(data);
//     setCurrentPage(1); // reset to first page whenever the sorted list changes
//   }, [dateSort, inscriptions]);

//   const getPosterImageIndex = (inscription) => {
//     if (inscription?.inscription_number === "INSN 00003") return 1;
//     return 0;
//   };

//   // PAGINATION
//   const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
//   const paginatedItems = filtered.slice(
//     (currentPage - 1) * ITEMS_PER_PAGE,
//     currentPage * ITEMS_PER_PAGE,
//   );

//   const goToPage = (page) => {
//     if (page < 1 || page > totalPages) return;
//     setCurrentPage(page);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   // Build a compact page-number list (with ellipses) so it stays readable
//   // even if there are many pages.
//   const getPageNumbers = () => {
//     const pages = [];
//     const delta = 1;
//     const range = [];

//     for (
//       let i = Math.max(2, currentPage - delta);
//       i <= Math.min(totalPages - 1, currentPage + delta);
//       i++
//     ) {
//       range.push(i);
//     }

//     if (totalPages > 1) pages.push(1);
//     if (range[0] > 2) pages.push("...");
//     pages.push(...range);
//     if (range[range.length - 1] < totalPages - 1) pages.push("...");
//     if (totalPages > 1) pages.push(totalPages);

//     return pages;
//   };

//   return (
//     <>
//       {/* HERO */}
//       <div className="relative h-[50vh] mt-12 flex items-center justify-center">
//         <img
//           src="/images/inscription/main.jpg"
//           alt="Inscriptions"
//           className="absolute inset-0 w-full h-full object-cover"
//         />
//         <div className="absolute inset-0 bg-black/40"></div>
//         <div className="absolute top-16 left-6 z-10 text-white p-3 flex items-center gap-2 text-base leading-6 tracking-wide">
//           <Link href="/" className="hover:underline">
//             Home
//           </Link>
//           <span>/</span>
//           <span className="opacity-80"> Inscriptions</span>
//         </div>
//         <h1 className="relative z-10 text-5xl text-white font-semibold">
//           Inscriptions
//         </h1>
//       </div>

//       <div className="max-w-6xl px-4 mx-auto py-24">
//         <h2 className="text-3xl mb-4">INSCRIPTIONS</h2>
//         <p className="text-lg mb-8">
//           Inscriptions constitute some of the earliest extant forms of writing
//           in human civilisation, a claim that holds equally true for Nepal and
//           its history. These artefacts serve as enduring records and provide
//           invaluable insights into language, history, religion, and social
//           practices. Across Nepal, inscriptions have been produced throughout
//           all major historical periods and appear on a wide range of sites,
//           including monuments, temples, monasteries, water spouts, shelters, and
//           other architectural structures. However, many of these materials are
//           increasingly at risk due to both natural processes and human-made
//           factors, leading to their deterioration, displacement, or loss of
//           original context. In response to these challenges, this initiative
//           undertakes the systematic documentation and study of Nepal's
//           epigraphic heritage through extensive fieldwork. The research involves
//           on-site visits and the collection of first-hand primary data. A
//           central component of the project is the development and dissemination
//           of a digital database that provides structured access to these
//           materials. This resource is designed to offer detailed visual
//           documentation and metadata for a wide corpus of ancient and historical
//           inscriptions from Nepal to the scholarly community and the general
//           public.
//         </p>
//         <p className="text-lg mb-8">
//           Our database continues to expand through the ongoing addition of new
//           materials. Visit and explore the collection documenting ancient and
//           historical epigraphic records from Nepal!
//         </p>

//         {/* FILTERS */}
//         <div className="grid sm:grid-cols-3 gap-6 mb-12">
//           <select className="border p-3 rounded">
//             <option>All Languages</option>
//             <option>Newari</option>
//             <option>Sanskrit</option>
//             <option>Nepali</option>
//           </select>

//           <select className="border p-3 rounded">
//             <option>All Scripts</option>
//             <option>Licchavi</option>
//           </select>

//           <select
//             className="border p-3 rounded"
//             value={dateSort}
//             onChange={(e) => setDateSort(e.target.value)}>
//             <option value="oldest">Oldest</option>
//             <option value="latest">Latest</option>
//           </select>
//         </div>

//         {/* LIST */}
//         {filtered.length === 0 ? (
//           <div className="text-center py-20">
//             <p className="text-xl text-gray-600">No inscriptions found.</p>
//           </div>
//         ) : (
//           <>
//             {paginatedItems.map((pub) => (
//               <Link key={pub.id} href={`/${pub.slug}/details`}>
//                 <div className="group grid sm:grid-cols-5 mt-12 gap-12 p-4 rounded-lg transition">
//                   {/* IMAGE */}
//                   <div className="overflow-hidden sm:col-span-2">
//                     {pub.images?.length > 0 ? (
//                       <img
//                         src={`${imgurl}/${pub.images[getPosterImageIndex(pub)]?.image_path}`}
//                         className="w-full h-64 object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
//                         alt={pub.title}
//                         // onError={(e) =>
//                         //   (e.target.src = "images/inscription/placeholder.jpg")
//                         // }
//                       />
//                     ) : (
//                       <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
//                         No Image
//                       </div>
//                     )}
//                   </div>

//                   {/* CONTENT */}
//                   <div className="sm:col-span-3">
//                     <h2 className="text-xl font-medium group-hover:text-blue-700 transition-colors duration-200">
//                       {pub.inscription_number}. {pub.title}
//                     </h2>

//                     {pub.author && (
//                       <p className="text-gray-600">Author: {pub.author}</p>
//                     )}

//                     {pub.location && (
//                       <p className="text-gray-600">Location: {pub.location}</p>
//                     )}

//                     {pub.language && (
//                       <p className="text-gray-600">Language: {pub.language}</p>
//                     )}

//                     <button className="mt-4 mb-2 underline text-gray-700 group-hover:text-blue-700 transition-colors duration-200 text-sm font-medium cursor-pointer">
//                       View details →
//                     </button>
//                   </div>
//                 </div>
//               </Link>
//             ))}

//             {/* PAGINATION */}
//             {totalPages > 1 && (
//               <div className="flex items-center justify-center gap-2 mt-16">
//                 <button
//                   onClick={() => goToPage(currentPage - 1)}
//                   disabled={currentPage === 1}
//                   className="px-3 py-2 border rounded disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition">
//                   Prev
//                 </button>

//                 {getPageNumbers().map((page, idx) =>
//                   page === "..." ? (
//                     <span
//                       key={`ellipsis-${idx}`}
//                       className="px-2 text-gray-500">
//                       ...
//                     </span>
//                   ) : (
//                     <button
//                       key={page}
//                       onClick={() => goToPage(page)}
//                       className={`px-3 py-2 border rounded transition ${
//                         currentPage === page
//                           ? "bg-blue-700 text-white border-blue-700"
//                           : "hover:bg-gray-100"
//                       }`}>
//                       {page}
//                     </button>
//                   ),
//                 )}

//                 <button
//                   onClick={() => goToPage(currentPage + 1)}
//                   disabled={currentPage === totalPages}
//                   className="px-3 py-2 border rounded disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition">
//                   Next
//                 </button>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </>
//   );
// };

// Inscriptions.layout = (page) => <GuestLayout>{page}</GuestLayout>;

// export default Inscriptions;


import React, { useEffect, useMemo, useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import axios from "axios";
import GuestLayout from "@/Layouts/GuestLayout";

const ITEMS_PER_PAGE = 10;

// Inscriptions numbered INSN 00011 and above require login to view details.
const LOGIN_REQUIRED_FROM = 11;

const requiresLogin = (inscriptionNumber) => {
  const match = String(inscriptionNumber ?? "").match(/(\d+)/);
  if (!match) return false;
  return parseInt(match[1], 10) >= LOGIN_REQUIRED_FROM;
};

const Inscriptions = () => {
  const [inscriptions, setInscriptions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [dateSort, setDateSort] = useState("oldest");

  const imgurl = import.meta.env.VITE_IMAGE_PATH;

  const { props } = usePage();
  const isLoggedIn = Boolean(props?.auth?.user);

  // FETCH DATA
  useEffect(() => {
    const fetchInscription = async () => {
      try {
        setLoading(true);

        // IMPORTANT: request a high per_page so we get ALL inscriptions,
        // not just the server's default top-10 newest. Without this,
        // anything beyond the 10 most recently added records never
        // reaches the frontend at all.
        const response = await axios.get(`${API_BASE_URL}/inscriptions`, {
          params: {
            per_page: 1000, // effectively "all" — adjust if you expect more
            page: 1,
          },
        });

        const data = response.data;
        let fetchedData = [];

        if (data?.results) fetchedData = data.results;
        else if (data?.data) fetchedData = data.data;
        else if (Array.isArray(data)) fetchedData = data;

        const published = fetchedData.filter(
          (item) => item.status === "published",
        );

        setInscriptions(published);
      } catch (error) {
        console.error("fetch error", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInscription();
  }, []);

  // SORT (derived directly, so the list is ready in the same render as `loading = false`)
  const filtered = useMemo(() => {
    const data = [...inscriptions];

    if (dateSort === "latest") {
      data.sort((a, b) => b.id - a.id);
    } else {
      data.sort((a, b) => a.id - b.id);
    }

    return data;
  }, [dateSort, inscriptions]);

  // reset to first page whenever the sort or data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [dateSort, inscriptions]);

  const getPosterImageIndex = (inscription) => {
    if (inscription?.inscription_number === "INSN 00003") return 1;
    return 0;
  };

  // PAGINATION
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginatedItems = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Build a compact page-number list (with ellipses) so it stays readable
  // even if there are many pages.
  const getPageNumbers = () => {
    const pages = [];
    const delta = 1;
    const range = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (totalPages > 1) pages.push(1);
    if (range[0] > 2) pages.push("...");
    pages.push(...range);
    if (range[range.length - 1] < totalPages - 1) pages.push("...");
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  return (
    <>
      {/* HERO */}
      <div className="relative h-[50vh] mt-12 flex items-center justify-center">
        <img
          src="/images/inscription/main.jpg"
          alt="Inscriptions"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute top-16 left-6 z-10 text-white p-3 flex items-center gap-2 text-base leading-6 tracking-wide">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <span>/</span>
          <span className="opacity-80"> Inscriptions</span>
        </div>
        <h1 className="relative z-10 text-5xl text-white font-semibold">
          Inscriptions
        </h1>
      </div>

      <div className="max-w-6xl px-4 mx-auto py-24">
        <h2 className="text-3xl mb-4">INSCRIPTIONS</h2>
        <p className="text-lg mb-8">
          Inscriptions constitute some of the earliest extant forms of writing
          in human civilisation, a claim that holds equally true for Nepal and
          its history. These artefacts serve as enduring records and provide
          invaluable insights into language, history, religion, and social
          practices. Across Nepal, inscriptions have been produced throughout
          all major historical periods and appear on a wide range of sites,
          including monuments, temples, monasteries, water spouts, shelters, and
          other architectural structures. However, many of these materials are
          increasingly at risk due to both natural processes and human-made
          factors, leading to their deterioration, displacement, or loss of
          original context. In response to these challenges, this initiative
          undertakes the systematic documentation and study of Nepal's
          epigraphic heritage through extensive fieldwork. The research involves
          on-site visits and the collection of first-hand primary data. A
          central component of the project is the development and dissemination
          of a digital database that provides structured access to these
          materials. This resource is designed to offer detailed visual
          documentation and metadata for a wide corpus of ancient and historical
          inscriptions from Nepal to the scholarly community and the general
          public.
        </p>
        <p className="text-lg mb-8">
          Our database continues to expand through the ongoing addition of new
          materials. Visit and explore the collection documenting ancient and
          historical epigraphic records from Nepal!
        </p>

        {/* FILTERS */}
        <div className="grid sm:grid-cols-3 gap-6 mb-12">
          <select className="border !border-black bg-transparent bg-none [appearance:auto] p-3 rounded focus:ring-0 focus:border-black">
            <option>All Languages</option>
            <option>Newari</option>
            <option>Sanskrit</option>
            <option>Nepali</option>
          </select>

          <select className="border !border-black bg-transparent bg-none [appearance:auto] p-3 rounded focus:ring-0 focus:border-black">
            <option>All Scripts</option>
            <option>Licchavi</option>
          </select>

          <select
            className="border !border-black bg-transparent bg-none [appearance:auto] p-3 rounded focus:ring-0 focus:border-black"
            value={dateSort}
            onChange={(e) => setDateSort(e.target.value)}>
            <option value="oldest">Oldest</option>
            <option value="latest">Latest</option>
          </select>
        </div>

        {/* LIST */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-700 rounded-full animate-spin"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600">No inscriptions found.</p>
          </div>
        ) : (
          <>
            {paginatedItems.map((pub) => {
              const locked = requiresLogin(pub.inscription_number) && !isLoggedIn;

              return (
                <Link key={pub.id} href={`/${pub.slug}/details`}>
                  <div className="group grid sm:grid-cols-5 mt-12 gap-12 p-4 rounded-lg transition">
                    {/* IMAGE */}
                    <div className="relative overflow-hidden sm:col-span-2">
                      {pub.images?.length > 0 ? (
                        <img
                          src={`${imgurl}/${pub.images[getPosterImageIndex(pub)]?.image_path}`}
                          className="w-full h-64 object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                          alt={pub.title}
                          // onError={(e) =>
                          //   (e.target.src = "images/inscription/placeholder.jpg")
                          // }
                        />
                      ) : (
                        <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                          No Image
                        </div>
                      )}

                      {locked && (
                        <div className="absolute top-3 left-3 bg-black/75 text-white text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                          </svg>
                          Login required
                        </div>
                      )}
                    </div>

                    {/* CONTENT */}
                    <div className="sm:col-span-3">
                      <h2 className="text-xl font-medium group-hover:text-blue-700 transition-colors duration-200">
                        {pub.inscription_number}. {pub.title}
                      </h2>

                      {pub.author && (
                        <p className="text-gray-600">Author: {pub.author}</p>
                      )}

                      {pub.location && (
                        <p className="text-gray-600">
                          Location: {pub.location}
                        </p>
                      )}

                      {pub.language && (
                        <p className="text-gray-600">
                          Language: {pub.language}
                        </p>
                      )}

                      <button className="mt-4 mb-2 underline text-gray-700 group-hover:text-blue-700 transition-colors duration-200 text-sm font-medium cursor-pointer">
                        {locked ? "Login to view details →" : "View details →"}
                      </button>
                    </div>
                  </div>
                </Link>
              );
            })}

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-16">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border rounded disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition">
                  Prev
                </button>

                {getPageNumbers().map((page, idx) =>
                  page === "..." ? (
                    <span
                      key={`ellipsis-${idx}`}
                      className="px-2 text-gray-500">
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`px-3 py-2 border rounded transition ${
                        currentPage === page
                          ? "bg-blue-700 text-white border-blue-700"
                          : "hover:bg-gray-100"
                      }`}>
                      {page}
                    </button>
                  ),
                )}

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border rounded disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition">
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

Inscriptions.layout = (page) => <GuestLayout>{page}</GuestLayout>;

export default Inscriptions;



// import React, { useEffect, useMemo, useState } from "react";
// import { Link, usePage } from "@inertiajs/react";
// import axios from "axios";
// import GuestLayout from "@/Layouts/GuestLayout";

// const ITEMS_PER_PAGE = 10;

// // Inscriptions numbered INSN 00011 and above require login to view details.
// const LOGIN_REQUIRED_FROM = 11;

// const requiresLogin = (inscriptionNumber) => {
//   const match = String(inscriptionNumber ?? "").match(/(\d+)/);
//   if (!match) return false;
//   return parseInt(match[1], 10) >= LOGIN_REQUIRED_FROM;
// };

// const Inscriptions = () => {
//   const [inscriptions, setInscriptions] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [loading, setLoading] = useState(true);
//   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

//   const [dateSort, setDateSort] = useState("oldest");

//   const imgurl = import.meta.env.VITE_IMAGE_PATH;

//   const { props } = usePage();
//   const isLoggedIn = Boolean(props?.auth?.user);

//   // FETCH DATA
//   useEffect(() => {
//     const fetchInscription = async () => {
//       try {
//         setLoading(true);

//         // IMPORTANT: request a high per_page so we get ALL inscriptions,
//         // not just the server's default top-10 newest. Without this,
//         // anything beyond the 10 most recently added records never
//         // reaches the frontend at all.
//         const response = await axios.get(`${API_BASE_URL}/inscriptions`, {
//           params: {
//             per_page: 1000, // effectively "all" — adjust if you expect more
//             page: 1,
//           },
//         });

//         const data = response.data;
//         let fetchedData = [];

//         if (data?.results) fetchedData = data.results;
//         else if (data?.data) fetchedData = data.data;
//         else if (Array.isArray(data)) fetchedData = data;

//         const published = fetchedData.filter(
//           (item) => item.status === "published",
//         );

//         setInscriptions(published);
//       } catch (error) {
//         console.error("fetch error", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchInscription();
//   }, []);

//   // SORT (derived directly, so the list is ready in the same render as `loading = false`)
//   const filtered = useMemo(() => {
//     const data = [...inscriptions];

//     if (dateSort === "latest") {
//       data.sort((a, b) => b.id - a.id);
//     } else {
//       data.sort((a, b) => a.id - b.id);
//     }

//     return data;
//   }, [dateSort, inscriptions]);

//   // reset to first page whenever the sort or data changes
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [dateSort, inscriptions]);

//   const getPosterImageIndex = (inscription) => {
//     if (inscription?.inscription_number === "INSN 00003") return 1;
//     return 0;
//   };

//   // PAGINATION
//   const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
//   const paginatedItems = filtered.slice(
//     (currentPage - 1) * ITEMS_PER_PAGE,
//     currentPage * ITEMS_PER_PAGE,
//   );

//   const goToPage = (page) => {
//     if (page < 1 || page > totalPages) return;
//     setCurrentPage(page);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   // Build a compact page-number list (with ellipses) so it stays readable
//   // even if there are many pages.
//   const getPageNumbers = () => {
//     const pages = [];
//     const delta = 1;
//     const range = [];

//     for (
//       let i = Math.max(2, currentPage - delta);
//       i <= Math.min(totalPages - 1, currentPage + delta);
//       i++
//     ) {
//       range.push(i);
//     }

//     if (totalPages > 1) pages.push(1);
//     if (range[0] > 2) pages.push("...");
//     pages.push(...range);
//     if (range[range.length - 1] < totalPages - 1) pages.push("...");
//     if (totalPages > 1) pages.push(totalPages);

//     return pages;
//   };

//   return (
//     <>
//       {/* HERO */}
//       <div className="relative h-[50vh] mt-12 flex items-center justify-center">
//         <img
//           src="/images/inscription/main.jpg"
//           alt="Inscriptions"
//           className="absolute inset-0 w-full h-full object-cover"
//         />
//         <div className="absolute inset-0 bg-black/40"></div>
//         <div className="absolute top-16 left-6 z-10 text-white p-3 flex items-center gap-2 text-base leading-6 tracking-wide">
//           <Link href="/" className="hover:underline">
//             Home
//           </Link>
//           <span>/</span>
//           <span className="opacity-80"> Inscriptions</span>
//         </div>
//         <h1 className="relative z-10 text-5xl text-white font-semibold">
//           Inscriptions
//         </h1>
//       </div>

//       <div className="max-w-6xl px-4 mx-auto py-24">
//         <h2 className="text-3xl mb-4">INSCRIPTIONS</h2>
//         <p className="text-lg mb-8">
//           Inscriptions constitute some of the earliest extant forms of writing
//           in human civilisation, a claim that holds equally true for Nepal and
//           its history. These artefacts serve as enduring records and provide
//           invaluable insights into language, history, religion, and social
//           practices. Across Nepal, inscriptions have been produced throughout
//           all major historical periods and appear on a wide range of sites,
//           including monuments, temples, monasteries, water spouts, shelters, and
//           other architectural structures. However, many of these materials are
//           increasingly at risk due to both natural processes and human-made
//           factors, leading to their deterioration, displacement, or loss of
//           original context. In response to these challenges, this initiative
//           undertakes the systematic documentation and study of Nepal's
//           epigraphic heritage through extensive fieldwork. The research involves
//           on-site visits and the collection of first-hand primary data. A
//           central component of the project is the development and dissemination
//           of a digital database that provides structured access to these
//           materials. This resource is designed to offer detailed visual
//           documentation and metadata for a wide corpus of ancient and historical
//           inscriptions from Nepal to the scholarly community and the general
//           public.
//         </p>
//         <p className="text-lg mb-8">
//           Our database continues to expand through the ongoing addition of new
//           materials. Visit and explore the collection documenting ancient and
//           historical epigraphic records from Nepal!
//         </p>

//         {/* FILTERS */}
//         <div className="grid sm:grid-cols-3 gap-6 mb-12">
//           <select className="border p-3 rounded">
//             <option>All Languages</option>
//             <option>Newari</option>
//             <option>Sanskrit</option>
//             <option>Nepali</option>
//           </select>

//           <select className="border p-3 rounded">
//             <option>All Scripts</option>
//             <option>Licchavi</option>
//           </select>

//           <select
//             className="border p-3 rounded"
//             value={dateSort}
//             onChange={(e) => setDateSort(e.target.value)}>
//             <option value="oldest">Oldest</option>
//             <option value="latest">Latest</option>
//           </select>
//         </div>

//         {/* LIST */}
//         {loading ? (
//           <div className="flex items-center justify-center py-20">
//             <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-700 rounded-full animate-spin"></div>
//           </div>
//         ) : filtered.length === 0 ? (
//           <div className="text-center py-20">
//             <p className="text-xl text-gray-600">No inscriptions found.</p>
//           </div>
//         ) : (
//           <>
//             {paginatedItems.map((pub) => {
//               const locked = requiresLogin(pub.inscription_number) && !isLoggedIn;

//               return (
//                 <Link key={pub.id} href={`/${pub.slug}/details`}>
//                   <div className="group grid sm:grid-cols-5 mt-12 gap-12 p-4 rounded-lg transition">
//                     {/* IMAGE */}
//                     <div className="relative overflow-hidden sm:col-span-2">
//                       {pub.images?.length > 0 ? (
//                         <img
//                           src={`${imgurl}/${pub.images[getPosterImageIndex(pub)]?.image_path}`}
//                           className="w-full h-64 object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
//                           alt={pub.title}
//                           // onError={(e) =>
//                           //   (e.target.src = "images/inscription/placeholder.jpg")
//                           // }
//                         />
//                       ) : (
//                         <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
//                           No Image
//                         </div>
//                       )}

//                       {locked && (
//                         <div className="absolute top-3 left-3 bg-black/75 text-white text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
//                           <svg
//                             className="w-3.5 h-3.5"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24">
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
//                             />
//                           </svg>
//                           Login required
//                         </div>
//                       )}
//                     </div>

//                     {/* CONTENT */}
//                     <div className="sm:col-span-3">
//                       <h2 className="text-xl font-medium group-hover:text-blue-700 transition-colors duration-200">
//                         {pub.inscription_number}. {pub.title}
//                       </h2>

//                       {pub.author && (
//                         <p className="text-gray-600">Author: {pub.author}</p>
//                       )}

//                       {pub.location && (
//                         <p className="text-gray-600">
//                           Location: {pub.location}
//                         </p>
//                       )}

//                       {pub.language && (
//                         <p className="text-gray-600">
//                           Language: {pub.language}
//                         </p>
//                       )}

//                       <button className="mt-4 mb-2 underline text-gray-700 group-hover:text-blue-700 transition-colors duration-200 text-sm font-medium cursor-pointer">
//                         {locked ? "Login to view details →" : "View details →"}
//                       </button>
//                     </div>
//                   </div>
//                 </Link>
//               );
//             })}

//             {/* PAGINATION */}
//             {totalPages > 1 && (
//               <div className="flex items-center justify-center gap-2 mt-16">
//                 <button
//                   onClick={() => goToPage(currentPage - 1)}
//                   disabled={currentPage === 1}
//                   className="px-3 py-2 border rounded disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition">
//                   Prev
//                 </button>

//                 {getPageNumbers().map((page, idx) =>
//                   page === "..." ? (
//                     <span
//                       key={`ellipsis-${idx}`}
//                       className="px-2 text-gray-500">
//                       ...
//                     </span>
//                   ) : (
//                     <button
//                       key={page}
//                       onClick={() => goToPage(page)}
//                       className={`px-3 py-2 border rounded transition ${
//                         currentPage === page
//                           ? "bg-blue-700 text-white border-blue-700"
//                           : "hover:bg-gray-100"
//                       }`}>
//                       {page}
//                     </button>
//                   ),
//                 )}

//                 <button
//                   onClick={() => goToPage(currentPage + 1)}
//                   disabled={currentPage === totalPages}
//                   className="px-3 py-2 border rounded disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition">
//                   Next
//                 </button>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </>
//   );
// };

// Inscriptions.layout = (page) => <GuestLayout>{page}</GuestLayout>;

// export default Inscriptions;


// import React, { useEffect, useState } from "react";
// import { Link, usePage } from "@inertiajs/react";
// import axios from "axios";
// import GuestLayout from "@/Layouts/GuestLayout";

// const ITEMS_PER_PAGE = 10;

// // Inscriptions numbered INSN 00011 and above require login to view details.
// const LOGIN_REQUIRED_FROM = 11;

// const requiresLogin = (inscriptionNumber) => {
//   const match = String(inscriptionNumber ?? "").match(/(\d+)/);
//   if (!match) return false;
//   return parseInt(match[1], 10) >= LOGIN_REQUIRED_FROM;
// };

// const Inscriptions = () => {
//   const [inscriptions, setInscriptions] = useState([]);
//   const [filtered, setFiltered] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

//   const [dateSort, setDateSort] = useState("oldest");

//   const imgurl = import.meta.env.VITE_IMAGE_PATH;

//   const { props } = usePage();
//   const isLoggedIn = Boolean(props?.auth?.user);

//   // FETCH DATA
//   useEffect(() => {
//     const fetchInscription = async () => {
//       try {
//         // IMPORTANT: request a high per_page so we get ALL inscriptions,
//         // not just the server's default top-10 newest. Without this,
//         // anything beyond the 10 most recently added records never
//         // reaches the frontend at all.
//         const response = await axios.get(`${API_BASE_URL}/inscriptions`, {
//           params: {
//             per_page: 1000, // effectively "all" — adjust if you expect more
//             page: 1,
//           },
//         });

//         const data = response.data;
//         let fetchedData = [];

//         if (data?.results) fetchedData = data.results;
//         else if (data?.data) fetchedData = data.data;
//         else if (Array.isArray(data)) fetchedData = data;

//         const published = fetchedData.filter(
//           (item) => item.status === "published",
//         );

//         setInscriptions(published);
//       } catch (error) {
//         console.error("fetch error", error);
//       }
//     };

//     fetchInscription();
//   }, []);

//   // SORT
//   useEffect(() => {
//     let data = [...inscriptions];

//     if (dateSort === "latest") {
//       data.sort((a, b) => b.id - a.id);
//     } else {
//       data.sort((a, b) => a.id - b.id);
//     }

//     setFiltered(data);
//     setCurrentPage(1); // reset to first page whenever the sorted list changes
//   }, [dateSort, inscriptions]);

//   const getPosterImageIndex = (inscription) => {
//     if (inscription?.inscription_number === "INSN 00003") return 1;
//     return 0;
//   };

//   // PAGINATION
//   const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
//   const paginatedItems = filtered.slice(
//     (currentPage - 1) * ITEMS_PER_PAGE,
//     currentPage * ITEMS_PER_PAGE,
//   );

//   const goToPage = (page) => {
//     if (page < 1 || page > totalPages) return;
//     setCurrentPage(page);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   // Build a compact page-number list (with ellipses) so it stays readable
//   // even if there are many pages.
//   const getPageNumbers = () => {
//     const pages = [];
//     const delta = 1;
//     const range = [];

//     for (
//       let i = Math.max(2, currentPage - delta);
//       i <= Math.min(totalPages - 1, currentPage + delta);
//       i++
//     ) {
//       range.push(i);
//     }

//     if (totalPages > 1) pages.push(1);
//     if (range[0] > 2) pages.push("...");
//     pages.push(...range);
//     if (range[range.length - 1] < totalPages - 1) pages.push("...");
//     if (totalPages > 1) pages.push(totalPages);

//     return pages;
//   };

//   return (
//     <>
//       {/* HERO */}
//       <div className="relative h-[50vh] mt-12 flex items-center justify-center">
//         <img
//           src="/images/inscription/main.jpg"
//           alt="Inscriptions"
//           className="absolute inset-0 w-full h-full object-cover"
//         />
//         <div className="absolute inset-0 bg-black/40"></div>
//         <div className="absolute top-16 left-6 z-10 text-white p-3 flex items-center gap-2 text-base leading-6 tracking-wide">
//           <Link href="/" className="hover:underline">
//             Home
//           </Link>
//           <span>/</span>
//           <span className="opacity-80"> Inscriptions</span>
//         </div>
//         <h1 className="relative z-10 text-5xl text-white font-semibold">
//           Inscriptions
//         </h1>
//       </div>

//       <div className="max-w-6xl px-4 mx-auto py-24">
//         <h2 className="text-3xl mb-4">INSCRIPTIONS</h2>
//         <p className="text-lg mb-8">
//           Inscriptions constitute some of the earliest extant forms of writing
//           in human civilisation, a claim that holds equally true for Nepal and
//           its history. These artefacts serve as enduring records and provide
//           invaluable insights into language, history, religion, and social
//           practices. Across Nepal, inscriptions have been produced throughout
//           all major historical periods and appear on a wide range of sites,
//           including monuments, temples, monasteries, water spouts, shelters, and
//           other architectural structures. However, many of these materials are
//           increasingly at risk due to both natural processes and human-made
//           factors, leading to their deterioration, displacement, or loss of
//           original context. In response to these challenges, this initiative
//           undertakes the systematic documentation and study of Nepal's
//           epigraphic heritage through extensive fieldwork. The research involves
//           on-site visits and the collection of first-hand primary data. A
//           central component of the project is the development and dissemination
//           of a digital database that provides structured access to these
//           materials. This resource is designed to offer detailed visual
//           documentation and metadata for a wide corpus of ancient and historical
//           inscriptions from Nepal to the scholarly community and the general
//           public.
//         </p>
//         <p className="text-lg mb-8">
//           Our database continues to expand through the ongoing addition of new
//           materials. Visit and explore the collection documenting ancient and
//           historical epigraphic records from Nepal!
//         </p>

//         {/* FILTERS */}
//         <div className="grid sm:grid-cols-3 gap-6 mb-12">
//           <select className="border p-3 rounded">
//             <option>All Languages</option>
//             <option>Newari</option>
//             <option>Sanskrit</option>
//             <option>Nepali</option>
//           </select>

//           <select className="border p-3 rounded">
//             <option>All Scripts</option>
//             <option>Licchavi</option>
//           </select>

//           <select
//             className="border p-3 rounded"
//             value={dateSort}
//             onChange={(e) => setDateSort(e.target.value)}>
//             <option value="oldest">Oldest</option>
//             <option value="latest">Latest</option>
//           </select>
//         </div>

//         {/* LIST */}
//         {filtered.length === 0 ? (
//           <div className="text-center py-20">
//             <p className="text-xl text-gray-600">No inscriptions found.</p>
//           </div>
//         ) : (
//           <>
//             {paginatedItems.map((pub) => {
//               const locked = requiresLogin(pub.inscription_number) && !isLoggedIn;

//               return (
//                 <Link key={pub.id} href={`/${pub.slug}/details`}>
//                   <div className="group grid sm:grid-cols-5 mt-12 gap-12 p-4 rounded-lg transition">
//                     {/* IMAGE */}
//                     <div className="relative overflow-hidden sm:col-span-2">
//                       {pub.images?.length > 0 ? (
//                         <img
//                           src={`${imgurl}/${pub.images[getPosterImageIndex(pub)]?.image_path}`}
//                           className="w-full h-64 object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
//                           alt={pub.title}
//                           // onError={(e) =>
//                           //   (e.target.src = "images/inscription/placeholder.jpg")
//                           // }
//                         />
//                       ) : (
//                         <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
//                           No Image
//                         </div>
//                       )}

//                       {locked && (
//                         <div className="absolute top-3 left-3 bg-black/75 text-white text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
//                           <svg
//                             className="w-3.5 h-3.5"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24">
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
//                             />
//                           </svg>
//                           Login required
//                         </div>
//                       )}
//                     </div>

//                     {/* CONTENT */}
//                     <div className="sm:col-span-3">
//                       <h2 className="text-xl font-medium group-hover:text-blue-700 transition-colors duration-200">
//                         {pub.inscription_number}. {pub.title}
//                       </h2>

//                       {pub.author && (
//                         <p className="text-gray-600">Author: {pub.author}</p>
//                       )}

//                       {pub.location && (
//                         <p className="text-gray-600">
//                           Location: {pub.location}
//                         </p>
//                       )}

//                       {pub.language && (
//                         <p className="text-gray-600">
//                           Language: {pub.language}
//                         </p>
//                       )}

//                       <button className="mt-4 mb-2 underline text-gray-700 group-hover:text-blue-700 transition-colors duration-200 text-sm font-medium cursor-pointer">
//                         {locked ? "Login to view details →" : "View details →"}
//                       </button>
//                     </div>
//                   </div>
//                 </Link>
//               );
//             })}

//             {/* PAGINATION */}
//             {totalPages > 1 && (
//               <div className="flex items-center justify-center gap-2 mt-16">
//                 <button
//                   onClick={() => goToPage(currentPage - 1)}
//                   disabled={currentPage === 1}
//                   className="px-3 py-2 border rounded disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition">
//                   Prev
//                 </button>

//                 {getPageNumbers().map((page, idx) =>
//                   page === "..." ? (
//                     <span
//                       key={`ellipsis-${idx}`}
//                       className="px-2 text-gray-500">
//                       ...
//                     </span>
//                   ) : (
//                     <button
//                       key={page}
//                       onClick={() => goToPage(page)}
//                       className={`px-3 py-2 border rounded transition ${
//                         currentPage === page
//                           ? "bg-blue-700 text-white border-blue-700"
//                           : "hover:bg-gray-100"
//                       }`}>
//                       {page}
//                     </button>
//                   ),
//                 )}

//                 <button
//                   onClick={() => goToPage(currentPage + 1)}
//                   disabled={currentPage === totalPages}
//                   className="px-3 py-2 border rounded disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition">
//                   Next
//                 </button>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </>
//   );
// };

// Inscriptions.layout = (page) => <GuestLayout>{page}</GuestLayout>;

// export default Inscriptions;
