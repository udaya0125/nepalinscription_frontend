// import React, { useEffect, useState, useCallback } from "react";
// import { Link, router } from "@inertiajs/react";
// import axios from "axios";

// const About = () => {
//   // Inertia scrolls to top on every visit by default, so no manual scrollTo needed
//   const handleNavigate = (path) => {
//     router.visit(path);
//   };

//   const [inscriptions, setInscriptions] = useState([]);
//   const [latestInscriptions, setLatestInscriptions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeIndex, setActiveIndex] = useState(0);
//   const imgurl = import.meta.env.VITE_IMAGE_PATH;
//   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

//   useEffect(() => {
//     const fetchInscription = async () => {
//       try {
//         const response = await axios.get(`${API_BASE_URL}/inscriptions`);
//         const data = response.data;

//         let inscriptionData = [];

//         if (data && data.results) {
//           inscriptionData = data.results;
//         } else if (data && data.data) {
//           inscriptionData = data.data;
//         } else if (Array.isArray(data)) {
//           inscriptionData = data;
//         } else {
//           console.error("Unexpected data structure:", data);
//           inscriptionData = [];
//         }

//         const publishedInscriptions = inscriptionData.filter(
//           (item) => item.status === "published",
//         );

//         if (publishedInscriptions.length === 0) {
//           setInscriptions([]);
//           setLatestInscriptions([]);
//           setLoading(false);
//           return;
//         }

//         const sortedInscriptions = publishedInscriptions.sort((a, b) => {
//           const dateA = new Date(
//             a.created_at ||
//               a.date_added ||
//               a.createdAt ||
//               a.timestamp ||
//               a.date_published ||
//               a.published_at,
//           );
//           const dateB = new Date(
//             b.created_at ||
//               b.date_added ||
//               b.createdAt ||
//               b.timestamp ||
//               b.date_published ||
//               b.published_at,
//           );
//           return dateB - dateA;
//         });

//         setInscriptions(sortedInscriptions);
//         setLatestInscriptions(sortedInscriptions.slice(0, 2));
//       } catch (error) {
//         console.error("fetching error", error);
//         setInscriptions([]);
//         setLatestInscriptions([]);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchInscription();
//   }, []);

//   const next = useCallback(() => {
//     setActiveIndex((prev) => (prev + 1) % latestInscriptions.length);
//   }, [latestInscriptions.length]);

//   useEffect(() => {
//     if (latestInscriptions.length < 2) return;
//     const timer = setInterval(next, 5000);
//     return () => clearInterval(timer);
//   }, [next, latestInscriptions.length]);

//   const prev = () => {
//     setActiveIndex(
//       (prev) =>
//         (prev - 1 + latestInscriptions.length) % latestInscriptions.length,
//     );
//   };

//   if (loading) {
//     return (
//       <div className="max-w-6xl mx-auto px-4 pt-12 pb-24 text-center">
//         <p>Loading inscriptions...</p>
//       </div>
//     );
//   }

//   const activeInscription = latestInscriptions[activeIndex];

//   return (
//     <>
//       {/* Inline keyframes — no tailwind.config changes needed */}
//       <style>{`
//         @keyframes fadeIn {
//           from { opacity: 0; transform: translateY(8px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }
//         .slide-fade {
//           animation: fadeIn 0.6s ease-in-out;
//         }
//       `}</style>

//       {/* Hero - Desktop */}
//       {/* <div
//         className="my-12 hidden md:flex h-[100vh] justify-center items-center"
//         // style={{
//         //   backgroundImage: "url('images/Scroll2.png')",
//         //   backgroundPosition: "center",
//         //   backgroundSize: "cover",
//         // }}
//         >
//         <div className="max-w-3xl mx-auto px-4 text-center space-y-6 py-12">
//           <h2 className="text-4xl font-semibold sm:text-5xl">
//             Inscriptions of Nepal
//           </h2>
//           <h2 className="text-lg font-medium leading-[38px]">
//             DOCUMENTATION | STUDY | PRESERVATION
//           </h2>
//           <p className="text-lg font-medium leading-[38px]">
//             Inscriptions stand among the earliest known forms of writing in
//             human civilisation. These serve as enduring records and invaluable
//             gateways to understanding language, history, culture, and more. In
//             Nepal, countless inscriptions have been produced in various epochs,
//             appearing on monuments, temples, monasteries, water spouts,
//             shelters, and other historical sites. However, natural and
//             human-made disasters have endangered many of these objects or have
//             displaced them from their original locations. This project aims to
//             document and study these significant artefacts, contributing to the
//             preservation and promotion of the country's rich written heritage.
//           </p>
//         </div>
//       </div> */}

//       <div className="hidden md:flex justify-center items-center">
//         <div className="max-w-3xl mx-auto px-4 text-center space-y-6 py-12">
//           <h2 className="text-4xl font-semibold sm:text-5xl">
//             Inscriptions of Nepal
//           </h2>
//           <h2 className="text-lg font-medium leading-[38px]">
//             DOCUMENTATION | STUDY | PRESERVATION
//           </h2>
//           <p className="text-lg font-medium leading-[38px]">
//             Inscriptions stand among the earliest known forms of writing in
//             human civilisation. These serve as enduring records and invaluable
//             gateways to understanding language, history, culture, and more. In
//             Nepal, countless inscriptions have been produced in various epochs,
//             appearing on monuments, temples, monasteries, water spouts,
//             shelters, and other historical sites. However, natural and
//             human-made disasters have endangered many of these objects or have
//             displaced them from their original locations. This project aims to
//             document and study these significant artefacts, contributing to the
//             preservation and promotion of the country's rich written heritage.
//           </p>
//         </div>
//       </div>

//       {/* Hero - Mobile */}
//       <div
//         className="my-12 md:hidden h-auto  flex justify-center items-center"
//         style={{
//           // backgroundImage: "url('images/bg3.png')",
//           backgroundPosition: "top",
//           backgroundSize: "cover",
//         }}>
//         <div className="max-w-3xl mx-auto px-4 text-center space-y-6 py-10">
//           <h2 className="text-4xl font-semibold sm:text-5xl">
//             Inscriptions of Nepal
//           </h2>
//           <h2 className="text-lg font-medium leading-[38px]">
//             DOCUMENTATION | STUDY | PRESERVATION
//           </h2>
//           <p className="text-lg font-medium leading-[38px]">
//             Inscriptions stand among the earliest known forms of writing in
//             human civilisation. These serve as enduring records and invaluable
//             gateways to understanding language, history, culture, and more. In
//             Nepal, countless inscriptions have been produced in various epochs,
//             appearing on monuments, temples, monasteries, water spouts,
//             shelters, and other historical sites. However, natural and
//             human-made disasters have endangered many of these objects or have
//             displaced them from their original locations. This project aims to
//             document and study these significant artefacts, contributing to the
//             preservation and promotion of the country's rich written heritage.
//           </p>
//         </div>
//       </div>

//       {/* Inscription Carousel Section */}
//       <div className="max-w-6xl mx-auto px-4 pt-12 pb-24">
//         <button
//           onClick={() => handleNavigate("/inscriptions")}
//           className="cursor-pointer hover:opacity-80 transition-opacity">
//           <h2 className="text-4xl sm:text-5xl font-medium mt-6 text-red-600">
//             Newly added INSCRIPTIONS
//           </h2>
//         </button>

//         {latestInscriptions.length > 0 ? (
//           <div className="mt-12 border-2 border-[#99541b] p-4 rounded-md">
//             {/* key forces remount on slide change → re-triggers the CSS animation */}
//             <div key={activeIndex} className="slide-fade">
//               <div className="grid sm:grid-cols-2 my-4 gap-6">
//                 {/* Image */}
//                 <Link
//                   href={`/${activeInscription.slug}/details`}
//                   className="block w-full cursor-pointer hover:opacity-90 transition-opacity">
//                   <div className="w-full">
//                     {activeInscription?.images?.length > 0 ? (
//                       <img
//                         src={`${imgurl}/${activeInscription.images[0].image_path}`}
//                         alt={
//                           activeInscription.title ||
//                           activeInscription.name ||
//                           "Latest Inscription"
//                         }
//                         className="w-full h-full object-contain"
//                       />
//                     ) : (
//                       <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded">
//                         <p>No Image Available</p>
//                       </div>
//                     )}
//                   </div>
//                 </Link>

//                 {/* Video */}
//                 <div className="w-full">
//                   {activeInscription.video ? (
//                     <video
//                       src={activeInscription.video}
//                       controls
//                       poster={`${imgurl}/${activeInscription.video_banner}`}
//                       className="w-full h-full object-fill shadow-md"
//                     />
//                   ) : (
//                     <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded">
//                       <p>No Video Available</p>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <Link
//                 href={`/${activeInscription.slug}/details`}
//                 className="block hover:opacity-80 transition-opacity">
//                 <p className="text-2xl font-medium">
//                   {activeInscription.title}
//                 </p>
//               </Link>
//             </div>

//             {/* Navigation — only shown when there are 2 slides */}
//             {/* {latestInscriptions.length > 1 && (
//               <div className="flex items-center justify-between mt-6">
//                 <button
//                   onClick={prev}
//                   className="px-4 py-2 border border-[#99541b] text-[#99541b] rounded hover:bg-[#99541b] hover:text-white transition-colors text-sm font-medium">
//                   ← Previous
//                 </button>

//                 <div className="flex gap-2">
//                   {latestInscriptions.map((_, i) => (
//                     <button
//                       key={i}
//                       onClick={() => setActiveIndex(i)}
//                       className={`w-3 h-3 rounded-full transition-colors ${
//                         i === activeIndex ? "bg-[#99541b]" : "bg-gray-300"
//                       }`}
//                     />
//                   ))}
//                 </div>

//                 <button
//                   onClick={next}
//                   className="px-4 py-2 border border-[#99541b] text-[#99541b] rounded hover:bg-[#99541b] hover:text-white transition-colors text-sm font-medium">
//                   Next →
//                 </button>
//               </div>
//             )} */}
//           </div>
//         ) : (
//           <div className="mt-12 border-2 border-[#99541b] p-4 rounded-md text-center">
//             <p className="text-xl">No published inscriptions found</p>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default About;



import React, { useEffect, useState, useCallback } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import axios from "axios";

const LOGIN_REQUIRED_FROM = 11;

const requiresLogin = (inscriptionNumber) => {
  const match = String(inscriptionNumber ?? "").match(/(\d+)/);
  if (!match) return false;

  return parseInt(match[1], 10) >= LOGIN_REQUIRED_FROM;
};

const About = () => {
  // Inertia scrolls to top on every visit by default, so no manual scrollTo needed
  const handleNavigate = (path) => {
    router.visit(path);
  };

  const [inscriptions, setInscriptions] = useState([]);
  const [latestInscriptions, setLatestInscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const imgurl = import.meta.env.VITE_IMAGE_PATH;
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { props } = usePage();
  const isLoggedIn = Boolean(props?.auth?.user);

  useEffect(() => {
    const fetchInscription = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/inscriptions`);
        const data = response.data;

        let inscriptionData = [];

        if (data && data.results) {
          inscriptionData = data.results;
        } else if (data && data.data) {
          inscriptionData = data.data;
        } else if (Array.isArray(data)) {
          inscriptionData = data;
        } else {
          console.error("Unexpected data structure:", data);
          inscriptionData = [];
        }

        const publishedInscriptions = inscriptionData.filter(
          (item) => item.status === "published",
        );

        if (publishedInscriptions.length === 0) {
          setInscriptions([]);
          setLatestInscriptions([]);
          setLoading(false);
          return;
        }

        const sortedInscriptions = publishedInscriptions.sort((a, b) => {
          const dateA = new Date(
            a.created_at ||
              a.date_added ||
              a.createdAt ||
              a.timestamp ||
              a.date_published ||
              a.published_at,
          );
          const dateB = new Date(
            b.created_at ||
              b.date_added ||
              b.createdAt ||
              b.timestamp ||
              b.date_published ||
              b.published_at,
          );
          return dateB - dateA;
        });

        setInscriptions(sortedInscriptions);
        setLatestInscriptions(sortedInscriptions.slice(0, 2));
      } catch (error) {
        console.error("fetching error", error);
        setInscriptions([]);
        setLatestInscriptions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchInscription();
  }, []);

  const next = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % latestInscriptions.length);
  }, [latestInscriptions.length]);

  useEffect(() => {
    if (latestInscriptions.length < 2) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, latestInscriptions.length]);

  const prev = () => {
    setActiveIndex(
      (prev) =>
        (prev - 1 + latestInscriptions.length) % latestInscriptions.length,
    );
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 pt-12 pb-24 text-center">
        <p>Loading inscriptions...</p>
      </div>
    );
  }

  const activeInscription = latestInscriptions[activeIndex];
  const locked =
    requiresLogin(activeInscription?.inscription_number) && !isLoggedIn;

  return (
    <>
      {/* Inline keyframes — no tailwind.config changes needed */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .slide-fade {
          animation: fadeIn 0.6s ease-in-out;
        }
      `}</style>

      {/* Hero - Desktop */}
      {/* <div
        className="my-12 hidden md:flex h-[100vh] justify-center items-center"
        // style={{
        //   backgroundImage: "url('images/Scroll2.png')",
        //   backgroundPosition: "center",
        //   backgroundSize: "cover",
        // }}
        >
        <div className="max-w-3xl mx-auto px-4 text-center space-y-6 py-12">
          <h2 className="text-4xl font-semibold sm:text-5xl">
            Inscriptions of Nepal
          </h2>
          <h2 className="text-lg font-medium leading-[38px]">
            DOCUMENTATION | STUDY | PRESERVATION
          </h2>
          <p className="text-lg font-medium leading-[38px]">
            Inscriptions stand among the earliest known forms of writing in
            human civilisation. These serve as enduring records and invaluable
            gateways to understanding language, history, culture, and more. In
            Nepal, countless inscriptions have been produced in various epochs,
            appearing on monuments, temples, monasteries, water spouts,
            shelters, and other historical sites. However, natural and
            human-made disasters have endangered many of these objects or have
            displaced them from their original locations. This project aims to
            document and study these significant artefacts, contributing to the
            preservation and promotion of the country's rich written heritage.
          </p>
        </div>
      </div> */}

      <div className="hidden md:flex justify-center items-center">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-6 py-12">
          <h2 className="text-4xl font-semibold sm:text-5xl">
            Inscriptions of Nepal
          </h2>
          <h2 className="text-lg font-medium leading-[38px]">
            DOCUMENTATION | STUDY | PRESERVATION
          </h2>
          <p className="text-lg font-medium leading-[38px]">
            Inscriptions stand among the earliest known forms of writing in
            human civilisation. These serve as enduring records and invaluable
            gateways to understanding language, history, culture, and more. In
            Nepal, countless inscriptions have been produced in various epochs,
            appearing on monuments, temples, monasteries, water spouts,
            shelters, and other historical sites. However, natural and
            human-made disasters have endangered many of these objects or have
            displaced them from their original locations. This project aims to
            document and study these significant artefacts, contributing to the
            preservation and promotion of the country's rich written heritage.
          </p>
        </div>
      </div>

      {/* Hero - Mobile */}
      <div
        className="my-12 md:hidden h-auto  flex justify-center items-center"
        style={{
          // backgroundImage: "url('images/bg3.png')",
          backgroundPosition: "top",
          backgroundSize: "cover",
        }}>
        <div className="max-w-3xl mx-auto px-4 text-center space-y-6 py-10">
          <h2 className="text-4xl font-semibold sm:text-5xl">
            Inscriptions of Nepal
          </h2>
          <h2 className="text-lg font-medium leading-[38px]">
            DOCUMENTATION | STUDY | PRESERVATION
          </h2>
          <p className="text-lg font-medium leading-[38px]">
            Inscriptions stand among the earliest known forms of writing in
            human civilisation. These serve as enduring records and invaluable
            gateways to understanding language, history, culture, and more. In
            Nepal, countless inscriptions have been produced in various epochs,
            appearing on monuments, temples, monasteries, water spouts,
            shelters, and other historical sites. However, natural and
            human-made disasters have endangered many of these objects or have
            displaced them from their original locations. This project aims to
            document and study these significant artefacts, contributing to the
            preservation and promotion of the country's rich written heritage.
          </p>
        </div>
      </div>

      {/* Inscription Carousel Section */}
      <div className="max-w-6xl mx-auto px-4 pt-12 pb-24">
        <button
          onClick={() => handleNavigate("/inscriptions")}
          className="cursor-pointer hover:opacity-80 transition-opacity">
          <h2 className="text-4xl sm:text-5xl font-medium mt-6 text-red-600">
            Newly added INSCRIPTIONS
          </h2>
        </button>

        {latestInscriptions.length > 0 ? (
          <div className="mt-12 border-2 border-[#99541b] p-4 rounded-md">
            {/* key forces remount on slide change → re-triggers the CSS animation */}
            <div key={activeIndex} className="slide-fade">
              <div className="grid sm:grid-cols-2 my-4 gap-6">
                {/* Image */}
                <Link
                  href={`/${activeInscription.slug}/details`}
                  className="block w-full cursor-pointer hover:opacity-90 transition-opacity">
                  <div className="relative w-full">
                    {activeInscription?.images?.length > 0 ? (
                      <img
                        src={`${imgurl}/${activeInscription.images[0].image_path}`}
                        alt={
                          activeInscription.title ||
                          activeInscription.name ||
                          "Latest Inscription"
                        }
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded">
                        <p>No Image Available</p>
                      </div>
                    )}

                    {locked && (
                      <div className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-black/75 px-3 py-1 text-xs font-medium text-white">
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
                </Link>

                {/* Video */}
                <div className="w-full">
                  {activeInscription.video ? (
                    <video
                      src={activeInscription.video}
                      controls
                      poster={`${imgurl}/${activeInscription.video_banner}`}
                      className="w-full h-full object-fill shadow-md"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded">
                      <p>No Video Available</p>
                    </div>
                  )}
                </div>
              </div>

              <Link
                href={`/${activeInscription.slug}/details`}
                className="block hover:opacity-80 transition-opacity">
                <p className="text-2xl font-medium">
                  {activeInscription.title}
                </p>
              </Link>
            </div>

            {/* Navigation — only shown when there are 2 slides */}
            {/* {latestInscriptions.length > 1 && (
              <div className="flex items-center justify-between mt-6">
                <button
                  onClick={prev}
                  className="px-4 py-2 border border-[#99541b] text-[#99541b] rounded hover:bg-[#99541b] hover:text-white transition-colors text-sm font-medium">
                  ← Previous
                </button>

                <div className="flex gap-2">
                  {latestInscriptions.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveIndex(i)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        i === activeIndex ? "bg-[#99541b]" : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={next}
                  className="px-4 py-2 border border-[#99541b] text-[#99541b] rounded hover:bg-[#99541b] hover:text-white transition-colors text-sm font-medium">
                  Next →
                </button>
              </div>
            )} */}
          </div>
        ) : (
          <div className="mt-12 border-2 border-[#99541b] p-4 rounded-md text-center">
            <p className="text-xl">No published inscriptions found</p>
          </div>
        )}
      </div>
    </>
  );
};

export default About;



// import React, { useEffect, useState, useCallback } from "react";
// import { Link, router, usePage } from "@inertiajs/react";
// import axios from "axios";

// const LOGIN_REQUIRED_FROM = 11;

// const requiresLogin = (inscriptionNumber) => {
//   const match = String(inscriptionNumber ?? "").match(/(\d+)/);
//   if (!match) return false;

//   return parseInt(match[1], 10) >= LOGIN_REQUIRED_FROM;
// };

// const About = () => {
//   // Inertia scrolls to top on every visit by default, so no manual scrollTo needed
//   const handleNavigate = (path) => {
//     router.visit(path);
//   };

//   const [inscriptions, setInscriptions] = useState([]);
//   const [latestInscriptions, setLatestInscriptions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeIndex, setActiveIndex] = useState(0);
//   const imgurl = import.meta.env.VITE_IMAGE_PATH;
//   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
//   const { props } = usePage();
//   const isLoggedIn = Boolean(props?.auth?.user);

//   useEffect(() => {
//     const fetchInscription = async () => {
//       try {
//         const response = await axios.get(`${API_BASE_URL}/inscriptions`);
//         const data = response.data;

//         let inscriptionData = [];

//         if (data && data.results) {
//           inscriptionData = data.results;
//         } else if (data && data.data) {
//           inscriptionData = data.data;
//         } else if (Array.isArray(data)) {
//           inscriptionData = data;
//         } else {
//           console.error("Unexpected data structure:", data);
//           inscriptionData = [];
//         }

//         const publishedInscriptions = inscriptionData.filter(
//           (item) => item.status === "published",
//         );

//         if (publishedInscriptions.length === 0) {
//           setInscriptions([]);
//           setLatestInscriptions([]);
//           setLoading(false);
//           return;
//         }

//         const sortedInscriptions = publishedInscriptions.sort((a, b) => {
//           const dateA = new Date(
//             a.created_at ||
//               a.date_added ||
//               a.createdAt ||
//               a.timestamp ||
//               a.date_published ||
//               a.published_at,
//           );
//           const dateB = new Date(
//             b.created_at ||
//               b.date_added ||
//               b.createdAt ||
//               b.timestamp ||
//               b.date_published ||
//               b.published_at,
//           );
//           return dateB - dateA;
//         });

//         setInscriptions(sortedInscriptions);
//         setLatestInscriptions(sortedInscriptions.slice(0, 2));
//       } catch (error) {
//         console.error("fetching error", error);
//         setInscriptions([]);
//         setLatestInscriptions([]);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchInscription();
//   }, []);

//   const next = useCallback(() => {
//     setActiveIndex((prev) => (prev + 1) % latestInscriptions.length);
//   }, [latestInscriptions.length]);

//   useEffect(() => {
//     if (latestInscriptions.length < 2) return;
//     const timer = setInterval(next, 5000);
//     return () => clearInterval(timer);
//   }, [next, latestInscriptions.length]);

//   const prev = () => {
//     setActiveIndex(
//       (prev) =>
//         (prev - 1 + latestInscriptions.length) % latestInscriptions.length,
//     );
//   };

//   if (loading) {
//     return (
//       <div className="max-w-6xl mx-auto px-4 pt-12 pb-24 text-center">
//         <p>Loading inscriptions...</p>
//       </div>
//     );
//   }

//   const activeInscription = latestInscriptions[activeIndex];
//   const locked =
//     requiresLogin(activeInscription?.inscription_number) && !isLoggedIn;

//   return (
//     <>
//       {/* Inline keyframes — no tailwind.config changes needed */}
//       <style>{`
//         @keyframes fadeIn {
//           from { opacity: 0; transform: translateY(8px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }
//         .slide-fade {
//           animation: fadeIn 0.6s ease-in-out;
//         }
//       `}</style>

//       {/* Hero - Desktop */}
//       {/* <div
//         className="my-12 hidden md:flex h-[100vh] justify-center items-center"
//         // style={{
//         //   backgroundImage: "url('images/Scroll2.png')",
//         //   backgroundPosition: "center",
//         //   backgroundSize: "cover",
//         // }}
//         >
//         <div className="max-w-3xl mx-auto px-4 text-center space-y-6 py-12">
//           <h2 className="text-4xl font-semibold sm:text-5xl">
//             Inscriptions of Nepal
//           </h2>
//           <h2 className="text-lg font-medium leading-[38px]">
//             DOCUMENTATION | STUDY | PRESERVATION
//           </h2>
//           <p className="text-lg font-medium leading-[38px]">
//             Inscriptions stand among the earliest known forms of writing in
//             human civilisation. These serve as enduring records and invaluable
//             gateways to understanding language, history, culture, and more. In
//             Nepal, countless inscriptions have been produced in various epochs,
//             appearing on monuments, temples, monasteries, water spouts,
//             shelters, and other historical sites. However, natural and
//             human-made disasters have endangered many of these objects or have
//             displaced them from their original locations. This project aims to
//             document and study these significant artefacts, contributing to the
//             preservation and promotion of the country's rich written heritage.
//           </p>
//         </div>
//       </div> */}

//       <div className="hidden md:flex justify-center items-center">
//         <div className="max-w-3xl mx-auto px-4 text-center space-y-6 py-12">
//           <h2 className="text-4xl font-semibold sm:text-5xl">
//             Inscriptions of Nepal
//           </h2>
//           <h2 className="text-lg font-medium leading-[38px]">
//             DOCUMENTATION | STUDY | PRESERVATION
//           </h2>
//           <p className="text-lg font-medium leading-[38px]">
//             Inscriptions stand among the earliest known forms of writing in
//             human civilisation. These serve as enduring records and invaluable
//             gateways to understanding language, history, culture, and more. In
//             Nepal, countless inscriptions have been produced in various epochs,
//             appearing on monuments, temples, monasteries, water spouts,
//             shelters, and other historical sites. However, natural and
//             human-made disasters have endangered many of these objects or have
//             displaced them from their original locations. This project aims to
//             document and study these significant artefacts, contributing to the
//             preservation and promotion of the country's rich written heritage.
//           </p>
//         </div>
//       </div>

//       {/* Hero - Mobile */}
//       <div
//         className="my-12 md:hidden h-auto  flex justify-center items-center"
//         style={{
//           // backgroundImage: "url('images/bg3.png')",
//           backgroundPosition: "top",
//           backgroundSize: "cover",
//         }}>
//         <div className="max-w-3xl mx-auto px-4 text-center space-y-6 py-10">
//           <h2 className="text-4xl font-semibold sm:text-5xl">
//             Inscriptions of Nepal
//           </h2>
//           <h2 className="text-lg font-medium leading-[38px]">
//             DOCUMENTATION | STUDY | PRESERVATION
//           </h2>
//           <p className="text-lg font-medium leading-[38px]">
//             Inscriptions stand among the earliest known forms of writing in
//             human civilisation. These serve as enduring records and invaluable
//             gateways to understanding language, history, culture, and more. In
//             Nepal, countless inscriptions have been produced in various epochs,
//             appearing on monuments, temples, monasteries, water spouts,
//             shelters, and other historical sites. However, natural and
//             human-made disasters have endangered many of these objects or have
//             displaced them from their original locations. This project aims to
//             document and study these significant artefacts, contributing to the
//             preservation and promotion of the country's rich written heritage.
//           </p>
//         </div>
//       </div>

//       {/* Inscription Carousel Section */}
//       <div className="max-w-6xl mx-auto px-4 pt-12 pb-24">
//         <button
//           onClick={() => handleNavigate("/inscriptions")}
//           className="cursor-pointer hover:opacity-80 transition-opacity">
//           <h2 className="text-4xl sm:text-5xl font-medium mt-6 text-red-600">
//             Newly added INSCRIPTIONS
//           </h2>
//         </button>

//         {latestInscriptions.length > 0 ? (
//           <div className="mt-12 border-2 border-[#99541b] p-4 rounded-md">
//             {/* key forces remount on slide change → re-triggers the CSS animation */}
//             <div key={activeIndex} className="slide-fade">
//               <div className="grid sm:grid-cols-2 my-4 gap-6">
//                 {/* Image */}
//                 <Link
//                   href={`/${activeInscription.slug}/details`}
//                   className="block w-full cursor-pointer hover:opacity-90 transition-opacity">
//                   <div className="relative w-full">
//                     {activeInscription?.images?.length > 0 ? (
//                       <img
//                         src={`${imgurl}/${activeInscription.images[0].image_path}`}
//                         alt={
//                           activeInscription.title ||
//                           activeInscription.name ||
//                           "Latest Inscription"
//                         }
//                         className="w-full h-full object-contain"
//                       />
//                     ) : (
//                       <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded">
//                         <p>No Image Available</p>
//                       </div>
//                     )}

//                     {locked && (
//                       <div className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-black/75 px-3 py-1 text-xs font-medium text-white">
//                         <svg
//                           className="h-3.5 w-3.5"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24">
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-8 0v4h8z"
//                           />
//                         </svg>
//                         Login required
//                       </div>
//                     )}
//                   </div>
//                 </Link>

//                 {/* Video */}
//                 <div className="w-full">
//                   {activeInscription.video && !locked ? (
//                     <video
//                       src={activeInscription.video}
//                       controls
//                       poster={`${imgurl}/${activeInscription.video_banner}`}
//                       className="w-full h-full object-fill shadow-md"
//                     />
//                   ) : locked ? (
//                     <div className="flex h-64 w-full flex-col items-center justify-center gap-3 rounded bg-gray-200 p-4 text-center">
//                       <svg
//                         className="h-8 w-8 text-gray-700"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24">
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={1.5}
//                           d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-8 0v4h8z"
//                         />
//                       </svg>
//                       <p>Log in to watch this video.</p>
//                       <Link
//                         href="/login"
//                         className="rounded bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800">
//                         Login
//                       </Link>
//                     </div>
//                   ) : (
//                     <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded">
//                       <p>No Video Available</p>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <Link
//                 href={`/${activeInscription.slug}/details`}
//                 className="block hover:opacity-80 transition-opacity">
//                 <p className="text-2xl font-medium">
//                   {activeInscription.title}
//                 </p>
//               </Link>
//             </div>

//             {/* Navigation — only shown when there are 2 slides */}
//             {/* {latestInscriptions.length > 1 && (
//               <div className="flex items-center justify-between mt-6">
//                 <button
//                   onClick={prev}
//                   className="px-4 py-2 border border-[#99541b] text-[#99541b] rounded hover:bg-[#99541b] hover:text-white transition-colors text-sm font-medium">
//                   ← Previous
//                 </button>

//                 <div className="flex gap-2">
//                   {latestInscriptions.map((_, i) => (
//                     <button
//                       key={i}
//                       onClick={() => setActiveIndex(i)}
//                       className={`w-3 h-3 rounded-full transition-colors ${
//                         i === activeIndex ? "bg-[#99541b]" : "bg-gray-300"
//                       }`}
//                     />
//                   ))}
//                 </div>

//                 <button
//                   onClick={next}
//                   className="px-4 py-2 border border-[#99541b] text-[#99541b] rounded hover:bg-[#99541b] hover:text-white transition-colors text-sm font-medium">
//                   Next →
//                 </button>
//               </div>
//             )} */}
//           </div>
//         ) : (
//           <div className="mt-12 border-2 border-[#99541b] p-4 rounded-md text-center">
//             <p className="text-xl">No published inscriptions found</p>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default About;
