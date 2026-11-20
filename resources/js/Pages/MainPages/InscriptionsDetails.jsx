import React, { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Link, router, usePage } from "@inertiajs/react";
import axios from "axios";
import parse from "html-react-parser";
import { BiArrowBack, BiChevronLeft, BiLoader } from "react-icons/bi";
import GuestLayout from '@/Layouts/GuestLayout'

const tabs = [
  "Description",
  "Background",
  "Text",
  "Translation",
  "References",
  "Glossary",
];

// Inscriptions numbered INSN 00011 and above require login to view details.
const LOGIN_REQUIRED_FROM = 11;

const requiresLogin = (inscriptionNumber) => {
  const match = String(inscriptionNumber ?? "").match(/(\d+)/);
  if (!match) return false;
  return parseInt(match[1], 10) >= LOGIN_REQUIRED_FROM;
};

// Formatter function to convert 1., 2., 3. to (1), (2), (3)
// Updated to work with your CSS styles
const formatNumberedContent = (htmlString) => {
  if (!htmlString || typeof htmlString !== "string") return "";

  let formatted = htmlString;

  // Pattern 1: Wrap plain number patterns in <ol> and <li> tags for CSS styling
  // This handles: 1. text 2. text 3. text
  formatted = formatted.replace(/((?:\d+\.\s+[^\n<]+(?:\n|$))+)/g, (match) => {
    const lines = match
      .trim()
      .split("\n")
      .filter((line) => line.trim());
    const listItems = lines
      .map((line) => {
        const numberMatch = line.match(/^(\d+)\.\s+(.*)$/);
        if (numberMatch) {
          const [, number, text] = numberMatch;
          return `<li>${text}</li>`;
        }
        return `<li>${line}</li>`;
      })
      .join("");
    return `<ol class="rich-text-content">${listItems}</ol>`;
  });

  // Pattern 2: Convert <p>1. text</p> to <ol><li>text</li></ol>
  formatted = formatted.replace(
    /<p>\s*(\d+)\.\s*(.*?)<\/p>/gi,
    (match, number, text) => {
      // Check if this is part of a sequence
      const nextPattern = new RegExp(
        `<p>\\s*${parseInt(number) + 1}\\.\\s*(.*?)<\/p>`,
        "i",
      );
      if (nextPattern.test(formatted)) {
        // This is part of a numbered list - will be handled by the previous pattern
        return match;
      }
      return `<ol class="rich-text-content"><li>${text}</li></ol>`;
    },
  );

  // Pattern 3: For already existing <ol> tags, ensure they have the right class
  formatted = formatted.replace(
    /<ol(?:\s[^>]*)?>/gi,
    '<ol class="rich-text-content">',
  );

  // Pattern 4: For individual numbered items in paragraphs that aren't lists
  // Keep them as is but wrap numbers
  formatted = formatted.replace(
    /<p>(\d+)\.\s+([^<]+)<\/p>/gi,
    '<p><span class="numbered-inline">($1)</span> $2</p>',
  );

  return formatted;
};

// Alternative function that preserves existing <ol> structure
const processOLTags = (content) => {
  if (!content) return "";

  // First, ensure all ol tags have the rich-text-content class
  let processed = content.replace(
    /<ol(?:\s[^>]*)?>/gi,
    '<ol class="rich-text-content">',
  );

  // Also add class to any ul that should be ol (if there are misformatted lists)
  processed = processed.replace(
    /<ul(?:\s[^>]*)?>(\s*<li>\s*\d+\.)/gi,
    '<ol class="rich-text-content">',
  );

  // Remove numbers from li tags since CSS counters will handle them
  processed = processed.replace(
    /<li>\s*(\d+)\.\s*(.*?)<\/li>/gi,
    "<li>$2</li>",
  );

  return processed;
};

// Inertia gives us the raw (percent-encoded) URL, so decode safely.
const safeDecode = (value) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const InscriptionsDetails = () => {
  const [inscription, setInscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locked, setLocked] = useState(false);

  // Inertia replacement for useParams(): the route is /{slug}/details.
  // If your Laravel controller passes a `slug` prop, that is used first;
  // otherwise it is read from the first URL segment.
  const { url, props } = usePage();
  const slug =
    props?.slug ?? safeDecode(url.split("?")[0].split("#")[0].split("/").filter(Boolean)[0] ?? "");

  // Shared by Laravel auth (Breeze / Inertia middleware): props.auth.user
  const isLoggedIn = Boolean(props?.auth?.user);

  const imgurl = import.meta.env.VITE_IMAGE_PATH;

  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("Description");
  const [textScript, setTextScript] = useState("Roman");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchInscription = async () => {
      setLoading(true);
      setLocked(false);

      try {
        const response = await axios.get(
          `${API_BASE_URL}/${slug}/details`,
        );
        const data = response.data.data;

        // Check if inscription exists and has published status
        if (data && data.status !== "published") {
          // Redirect to 404 or home page if not published
          router.visit("/inscriptions");
          return;
        }

        // INSN 00011 and above: login required
        if (data && requiresLogin(data.inscription_number) && !isLoggedIn) {
          setInscription(null); // do not keep the protected data in state
          setLocked(true);
          setLoading(false);
          return;
        }

        setInscription(data);
        setLoading(false);
      } catch (error) {
        console.error("fetching error", error);
        // Redirect on error
        router.visit("/inscriptions");
        setLoading(false);
      }
    };
    fetchInscription();
  }, [slug, isLoggedIn]);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20 h-screen flex flex-col items-center justify-center">
        <BiLoader className="w-12 h-12 text-black animate-spin mb-4" />
        <p className="text-lg text-gray-600">Loading inscription details...</p>
      </div>
    );
  }

  // LOGIN REQUIRED SCREEN
  if (locked) {
    return (
      <div className="text-center py-20 h-screen flex items-center justify-center px-4">
        <div className="max-w-md">
          <svg
            className="w-14 h-14 mx-auto mb-4 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <h1 className="text-2xl font-bold mb-4">Login Required</h1>
          <p className="text-gray-600 mb-6">
            Please log in to view the details of this inscription.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/login"
              className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition">
              Login
            </Link>
            <Link
              href="/inscriptions"
              className="border border-black px-6 py-2 rounded hover:bg-gray-100 transition">
              Back to Inscriptions
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!inscription) {
    return (
      <div className="text-center py-20 h-screen items-center flex justify-center">
        <div>
          <h1 className="text-2xl font-bold mb-4">Inscription Not Found</h1>
          <p className="text-gray-600 mb-6">
            The requested inscription is not available or has not been published
            yet.
          </p>
          <button
            onClick={() => router.visit("/inscriptions")}
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition">
            Back to Inscriptions
          </button>
        </div>
      </div>
    );
  }

  // Get formatted content for the active tab
  const getFormattedContent = () => {
    let content = "";

    switch (activeTab) {
      case "Description":
        content = inscription?.description || "";
        break;
      case "Background":
        content = inscription?.background || "";
        break;
      case "Text":
        // Check which script version to show
        if (textScript === "Roman") {
          content = inscription?.text || "";
        } else {
          content = inscription?.dev_text || inscription?.text || "";
        }
        break;
      case "Translation":
        content = inscription?.translation || "";
        break;
      case "References":
        content = inscription?.references || "";
        break;
      case "Glossary":
        content = inscription?.glossary || "";
        break;
      default:
        content = "";
    }

    // Process the content with both functions
    let formatted = processOLTags(content);
    formatted = formatNumberedContent(formatted);

    return formatted;
  };

  // Determine which image to use for video poster
  const getPosterImageIndex = () => {
    if (inscription?.inscription_number === "INSN 00003") {
      return 1; // Use index 1 for INSN 00003
    }
    return 0; // Default to index 0
  };

  const isInscription00003 = inscription?.inscription_number === "INSN 00003";

  return (
    <>
      <div className="relative h-[60vh] mt-12 w-full ">
        {/* Background Image */}
        <img
          src={`${imgurl}/${inscription?.banner_image}`}
          alt="Licchavi Inscription"
          className="w-full h-full object-cover"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="absolute top-16 left-6 z-10 text-white p-3 flex items-center gap-2 text-base leading-6 tracking-wide">
          <Link href="/" className="hover:underline">
            Home
          </Link>

          <span>/</span>

          <Link href="/inscriptions" className="hover:underline">
            Inscriptions
          </Link>

          <span>/</span>

          <span className="opacity-80">{inscription?.title}</span>
        </div>

        {/* Heading */}
        <p className="absolute inset-0 flex items-center justify-center text-3xl sm:text-5xl text-white text-center px-4">
          {inscription?.title}
        </p>
      </div>

      <button
        className="absolute top-6 left-6 z-10 bg-white/90 hover:bg-white text-black p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-black"
        aria-label="Go back"
        onClick={() => router.visit("/inscriptions")}>
        <BiArrowBack className="w-5 h-5" />
      </button>

      {/* Slider */}
      <div className="max-w-7xl px-4 mx-auto py-16">
        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={16}
          loop={true}
          slidesPerView={2}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 4 },
          }}>
          {inscription?.images.map((img, index) => (
            <SwiperSlide key={index}>
              <img
                src={`${imgurl}/${img.image_path}`}
                onClick={() => setActiveIndex(index)}
                className={`w-full h-48 object-cover cursor-pointer transition border-4 ${
                  activeIndex === index ? "border-black" : "border-transparent"
                }`}
                alt={`${inscription?.title}`}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Main Image and Video */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid sm:grid-cols-2 gap-8 ">
          {/* Image */}
          <div className="w-full">
            <div className="relative w-full aspect-video overflow-hidden">
              <img
                src={`${imgurl}/${inscription?.images[activeIndex]?.image_path}`}
                alt={`${inscription?.title}`}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute top-6 right-4 bg-black/70 text-white text-sm px-4 py-2 rounded-full">
                {activeIndex + 1} / {inscription?.images.length}
              </div>
            </div>
          </div>

          {/* Video */}
          <div className="w-full">
            <div className="relative w-full aspect-video overflow-hidden shadow-md">
              {inscription?.video && (
                <video
                  src={inscription?.video}
                  controls
                  poster={`${imgurl}/${inscription?.video_banner}`}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-5xl mx-auto mt-12 px-4 sm:px-6">
          <div className="border-b border-black">
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {tabs.map((tab) => (
                <div key={tab} className="relative">
                  {tab === "Text" ? (
                    <div className="relative" ref={dropdownRef}>
                      <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className={`flex items-center cursor-pointer gap-1 text-sm sm:text-md font-bold transition-all duration-200 whitespace-nowrap ${
                          activeTab === "Text"
                            ? "bg-black text-white px-3 sm:px-4 py-2 rounded-t-lg rounded-b-none"
                            : "text-gray-600 hover:text-black px-3 sm:px-4 py-2 hover:bg-gray-50 rounded-t-lg"
                        }`}
                        onMouseEnter={() => {
                          setActiveTab("Text");
                          setDropdownOpen(true);
                        }}>
                        Text
                        <svg
                          className={`w-3 h-3 transition-transform duration-200 ${
                            dropdownOpen ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      {dropdownOpen && (
                        <div className="absolute left-0 top-full mt-0 w-48 bg-white border border-gray-200 rounded-b-md rounded-t-none shadow-lg z-50">
                          <button
                            onClick={() => {
                              setTextScript("Roman");
                              setDropdownOpen(false);
                              setActiveTab("Text");
                            }}
                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition flex items-center justify-between ${
                              textScript === "Roman"
                                ? "font-bold text-black bg-gray-50"
                                : "text-gray-700"
                            }`}>
                            Romanized
                            {textScript === "Roman" && (
                              <svg
                                className="w-4 h-4 text-green-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </button>
                          <button
                            onClick={() => {
                              setTextScript("Devanagari");
                              setDropdownOpen(false);
                              setActiveTab("Text");
                            }}
                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition flex items-center justify-between ${
                              textScript === "Devanagari"
                                ? "font-bold text-black bg-gray-50"
                                : "text-gray-700"
                            }`}>
                            Devanāgarī
                            {textScript === "Devanagari" && (
                              <svg
                                className="w-4 h-4 text-green-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setActiveTab(tab);
                        setDropdownOpen(false);
                      }}
                      className={`text-sm sm:text-md font-bold transition-all duration-200 whitespace-nowrap px-3 sm:px-4 py-2 rounded-t-lg ${
                        activeTab === tab
                          ? "bg-black text-white"
                          : "text-gray-600 hover:text-black hover:bg-gray-50"
                      }`}>
                      {tab}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tab Content with formatted numbered lists */}
          <div className="py-8 sm:py-10 text-gray-800 font-medium leading-relaxed text-sm sm:text-lg">
            <style>{`
              .rich-text-content ol {
                counter-reset: item;
                list-style: none;
                padding-left: 2rem !important;
                margin: 1rem 0;
              }
                

              .rich-text-content ol > li {
                counter-increment: item;
                position: relative;
                margin-bottom: 0.5em;
              }

              .rich-text-content ol > li::before {
                content: "(" counter(item) ")";
                position: absolute;
                left: -2.2rem;
                font-weight: 600;
                color: #374151;
              }
              
              .rich-text-content {
                font-size: inherit;
                line-height: 1.2;
              }
              
              .rich-text-content li {
                font-size: inherit;
                line-height: 1.1;
                margin-bottom: 0.75rem;
              }
              
              .numbered-inline {
                font-weight: 600;
                color: #374151;
                margin-right: 0.5rem;
              }
              
              .rich-text-content + p,
              p + .rich-text-content {
                margin-top: 1.5rem;
              }
              
              .tab-content p {
                line-height: 1.6;
              }
              
              .tab-content > *:first-child {
                margin-top: 0;
              }
              
              .tab-content > *:last-child {
                margin-bottom: 0;
              }
            `}</style>

            <div className="tab-content rich-text-content">
              {activeTab === "Description" && (
                <div>
                  {parse(getFormattedContent())}
                  {inscription?.google_maps_link && (
                    <p className="mt-1">
                      <a
                        href={inscription.google_maps_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-700 ">
                        View Location in Map
                      </a>
                    </p>
                  )}
                </div>
              )}

              {activeTab === "Background" && (
                <div>{parse(getFormattedContent())}</div>
              )}

              {activeTab === "Text" && (
                <div>{parse(getFormattedContent())}</div>
              )}

              {activeTab === "Translation" && (
                <div>{parse(getFormattedContent())}</div>
              )}

              {activeTab === "References" && (
                <div>{parse(getFormattedContent())}</div>
              )}

              {activeTab === "Glossary" && (
                <div>{parse(getFormattedContent())}</div>
              )}
            </div>
          </div>
          {/* Back Button */}
          <Link
            href="/inscriptions"
            className="flex items-center gap-2 text-black cursor-pointer z-10 text-sm hover:text-red-700 transition underline"
            aria-label="Go back">
            <BiChevronLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back to Inscriptions</span>
          </Link>
        </div>
      </div>
    </>
  );
};

 InscriptionsDetails.layout = (page) => <GuestLayout>{page}</GuestLayout>;

export default InscriptionsDetails;


// import React, { useEffect, useState, useRef } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/navigation";
// import { Link, router, usePage } from "@inertiajs/react";
// import axios from "axios";
// import parse from "html-react-parser";
// import { BiArrowBack, BiChevronLeft, BiLoader } from "react-icons/bi";
// import GuestLayout from '@/Layouts/GuestLayout'

// const tabs = [
//   "Description",
//   "Background",
//   "Text",
//   "Translation",
//   "References",
//   "Glossary",
// ];

// // Inscriptions numbered INSN 00011 and above require login to view details.
// const LOGIN_REQUIRED_FROM = 11;

// const requiresLogin = (inscriptionNumber) => {
//   const match = String(inscriptionNumber ?? "").match(/(\d+)/);
//   if (!match) return false;
//   return parseInt(match[1], 10) >= LOGIN_REQUIRED_FROM;
// };

// // Formatter function to convert 1., 2., 3. to (1), (2), (3)
// // Updated to work with your CSS styles
// const formatNumberedContent = (htmlString) => {
//   if (!htmlString || typeof htmlString !== "string") return "";

//   let formatted = htmlString;

//   // Pattern 1: Wrap plain number patterns in <ol> and <li> tags for CSS styling
//   // This handles: 1. text 2. text 3. text
//   formatted = formatted.replace(/((?:\d+\.\s+[^\n<]+(?:\n|$))+)/g, (match) => {
//     const lines = match
//       .trim()
//       .split("\n")
//       .filter((line) => line.trim());
//     const listItems = lines
//       .map((line) => {
//         const numberMatch = line.match(/^(\d+)\.\s+(.*)$/);
//         if (numberMatch) {
//           const [, number, text] = numberMatch;
//           return `<li>${text}</li>`;
//         }
//         return `<li>${line}</li>`;
//       })
//       .join("");
//     return `<ol class="rich-text-content">${listItems}</ol>`;
//   });

//   // Pattern 2: Convert <p>1. text</p> to <ol><li>text</li></ol>
//   formatted = formatted.replace(
//     /<p>\s*(\d+)\.\s*(.*?)<\/p>/gi,
//     (match, number, text) => {
//       // Check if this is part of a sequence
//       const nextPattern = new RegExp(
//         `<p>\\s*${parseInt(number) + 1}\\.\\s*(.*?)<\/p>`,
//         "i",
//       );
//       if (nextPattern.test(formatted)) {
//         // This is part of a numbered list - will be handled by the previous pattern
//         return match;
//       }
//       return `<ol class="rich-text-content"><li>${text}</li></ol>`;
//     },
//   );

//   // Pattern 3: For already existing <ol> tags, ensure they have the right class
//   formatted = formatted.replace(
//     /<ol(?:\s[^>]*)?>/gi,
//     '<ol class="rich-text-content">',
//   );

//   // Pattern 4: For individual numbered items in paragraphs that aren't lists
//   // Keep them as is but wrap numbers
//   formatted = formatted.replace(
//     /<p>(\d+)\.\s+([^<]+)<\/p>/gi,
//     '<p><span class="numbered-inline">($1)</span> $2</p>',
//   );

//   return formatted;
// };

// // Alternative function that preserves existing <ol> structure
// const processOLTags = (content) => {
//   if (!content) return "";

//   // First, ensure all ol tags have the rich-text-content class
//   let processed = content.replace(
//     /<ol(?:\s[^>]*)?>/gi,
//     '<ol class="rich-text-content">',
//   );

//   // Also add class to any ul that should be ol (if there are misformatted lists)
//   processed = processed.replace(
//     /<ul(?:\s[^>]*)?>(\s*<li>\s*\d+\.)/gi,
//     '<ol class="rich-text-content">',
//   );

//   // Remove numbers from li tags since CSS counters will handle them
//   processed = processed.replace(
//     /<li>\s*(\d+)\.\s*(.*?)<\/li>/gi,
//     "<li>$2</li>",
//   );

//   return processed;
// };

// // Inertia gives us the raw (percent-encoded) URL, so decode safely.
// const safeDecode = (value) => {
//   try {
//     return decodeURIComponent(value);
//   } catch {
//     return value;
//   }
// };

// const InscriptionsDetails = () => {
//   const [inscription, setInscription] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Inertia replacement for useParams(): the route is /{slug}/details.
//   // If your Laravel controller passes a `slug` prop, that is used first;
//   // otherwise it is read from the first URL segment.
//   const { url, props } = usePage();
//   const slug =
//     props?.slug ?? safeDecode(url.split("?")[0].split("#")[0].split("/").filter(Boolean)[0] ?? "");

//   // Shared by Laravel auth (Breeze / Inertia middleware): props.auth.user
//   const isLoggedIn = Boolean(props?.auth?.user);

//   const imgurl = import.meta.env.VITE_IMAGE_PATH;

//   const [activeIndex, setActiveIndex] = useState(0);
//   const [activeTab, setActiveTab] = useState("Description");
//   const [textScript, setTextScript] = useState("Roman");
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const dropdownRef = useRef(null);
//   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

//   useEffect(() => {
//     const fetchInscription = async () => {
//       setLoading(true);

//       try {
//         const response = await axios.get(
//           `${API_BASE_URL}/${slug}/details`,
//         );
//         const data = response.data.data;

//         // Check if inscription exists and has published status
//         if (data && data.status !== "published") {
//           // Redirect to 404 or home page if not published
//           router.visit("/inscriptions");
//           return;
//         }

//         // INSN 00011 and above: login required
//         if (data && requiresLogin(data.inscription_number) && !isLoggedIn) {
//           // not logged in -> send to the login page (spinner stays until redirect)
//           router.visit("/login");
//           return;
//         }

//         setInscription(data);
//         setLoading(false);
//       } catch (error) {
//         console.error("fetching error", error);
//         // Redirect on error
//         router.visit("/inscriptions");
//         setLoading(false);
//       }
//     };
//     fetchInscription();
//   }, [slug, isLoggedIn]);

//   // Handle click outside dropdown
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   if (loading) {
//     return (
//       <div className="text-center py-20 h-screen flex flex-col items-center justify-center">
//         <BiLoader className="w-12 h-12 text-black animate-spin mb-4" />
//         <p className="text-lg text-gray-600">Loading inscription details...</p>
//       </div>
//     );
//   }

//   if (!inscription) {
//     return (
//       <div className="text-center py-20 h-screen items-center flex justify-center">
//         <div>
//           <h1 className="text-2xl font-bold mb-4">Inscription Not Found</h1>
//           <p className="text-gray-600 mb-6">
//             The requested inscription is not available or has not been published
//             yet.
//           </p>
//           <button
//             onClick={() => router.visit("/inscriptions")}
//             className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition">
//             Back to Inscriptions
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Get formatted content for the active tab
//   const getFormattedContent = () => {
//     let content = "";

//     switch (activeTab) {
//       case "Description":
//         content = inscription?.description || "";
//         break;
//       case "Background":
//         content = inscription?.background || "";
//         break;
//       case "Text":
//         // Check which script version to show
//         if (textScript === "Roman") {
//           content = inscription?.text || "";
//         } else {
//           content = inscription?.dev_text || inscription?.text || "";
//         }
//         break;
//       case "Translation":
//         content = inscription?.translation || "";
//         break;
//       case "References":
//         content = inscription?.references || "";
//         break;
//       case "Glossary":
//         content = inscription?.glossary || "";
//         break;
//       default:
//         content = "";
//     }

//     // Process the content with both functions
//     let formatted = processOLTags(content);
//     formatted = formatNumberedContent(formatted);

//     return formatted;
//   };

//   // Determine which image to use for video poster
//   const getPosterImageIndex = () => {
//     if (inscription?.inscription_number === "INSN 00003") {
//       return 1; // Use index 1 for INSN 00003
//     }
//     return 0; // Default to index 0
//   };

//   const isInscription00003 = inscription?.inscription_number === "INSN 00003";

//   return (
//     <>
//       <div className="relative h-[60vh] mt-12 w-full ">
//         {/* Background Image */}
//         <img
//           src={`${imgurl}/${inscription?.banner_image}`}
//           alt="Licchavi Inscription"
//           className="w-full h-full object-cover"
//         />

//         {/* Dark overlay */}
//         <div className="absolute inset-0 bg-black/40"></div>

//         <div className="absolute top-16 left-6 z-10 text-white p-3 flex items-center gap-2 text-base leading-6 tracking-wide">
//           <Link href="/" className="hover:underline">
//             Home
//           </Link>

//           <span>/</span>

//           <Link href="/inscriptions" className="hover:underline">
//             Inscriptions
//           </Link>

//           <span>/</span>

//           <span className="opacity-80">{inscription?.title}</span>
//         </div>

//         {/* Heading */}
//         <p className="absolute inset-0 flex items-center justify-center text-3xl sm:text-5xl text-white text-center px-4">
//           {inscription?.title}
//         </p>
//       </div>

//       <button
//         className="absolute top-6 left-6 z-10 bg-white/90 hover:bg-white text-black p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-black"
//         aria-label="Go back"
//         onClick={() => router.visit("/inscriptions")}>
//         <BiArrowBack className="w-5 h-5" />
//       </button>

//       {/* Slider */}
//       <div className="max-w-7xl px-4 mx-auto py-16">
//         <Swiper
//           modules={[Navigation]}
//           navigation
//           spaceBetween={16}
//           loop={true}
//           slidesPerView={2}
//           breakpoints={{
//             640: { slidesPerView: 2 },
//             768: { slidesPerView: 4 },
//             1024: { slidesPerView: 4 },
//           }}>
//           {inscription?.images.map((img, index) => (
//             <SwiperSlide key={index}>
//               <img
//                 src={`${imgurl}/${img.image_path}`}
//                 onClick={() => setActiveIndex(index)}
//                 className={`w-full h-48 object-cover cursor-pointer transition border-4 ${
//                   activeIndex === index ? "border-black" : "border-transparent"
//                 }`}
//                 alt={`${inscription?.title}`}
//               />
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </div>

//       {/* Main Image and Video */}
//       <div className="max-w-7xl mx-auto px-4 pb-12">
//         <div className="grid sm:grid-cols-2 gap-8 ">
//           {/* Image */}
//           <div className="w-full">
//             <div className="relative w-full aspect-video overflow-hidden">
//               <img
//                 src={`${imgurl}/${inscription?.images[activeIndex]?.image_path}`}
//                 alt={`${inscription?.title}`}
//                 className="w-full h-full object-cover object-center"
//               />
//               <div className="absolute top-6 right-4 bg-black/70 text-white text-sm px-4 py-2 rounded-full">
//                 {activeIndex + 1} / {inscription?.images.length}
//               </div>
//             </div>
//           </div>

//           {/* Video */}
//           <div className="w-full">
//             <div className="relative w-full aspect-video overflow-hidden shadow-md">
//               {inscription?.video && (
//                 <video
//                   src={inscription?.video}
//                   controls
//                   poster={`${imgurl}/${inscription?.video_banner}`}
//                   className="w-full h-full object-cover"
//                 />
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="max-w-5xl mx-auto mt-12 px-4 sm:px-6">
//           <div className="border-b border-black">
//             <div className="flex flex-wrap gap-1 sm:gap-2">
//               {tabs.map((tab) => (
//                 <div key={tab} className="relative">
//                   {tab === "Text" ? (
//                     <div className="relative" ref={dropdownRef}>
//                       <button
//                         onClick={() => setDropdownOpen(!dropdownOpen)}
//                         className={`flex items-center cursor-pointer gap-1 text-sm sm:text-md font-bold transition-all duration-200 whitespace-nowrap ${
//                           activeTab === "Text"
//                             ? "bg-black text-white px-3 sm:px-4 py-2 rounded-t-lg rounded-b-none"
//                             : "text-gray-600 hover:text-black px-3 sm:px-4 py-2 hover:bg-gray-50 rounded-t-lg"
//                         }`}
//                         onMouseEnter={() => {
//                           setActiveTab("Text");
//                           setDropdownOpen(true);
//                         }}>
//                         Text
//                         <svg
//                           className={`w-3 h-3 transition-transform duration-200 ${
//                             dropdownOpen ? "rotate-180" : ""
//                           }`}
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24">
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M19 9l-7 7-7-7"
//                           />
//                         </svg>
//                       </button>

//                       {dropdownOpen && (
//                         <div className="absolute left-0 top-full mt-0 w-48 bg-white border border-gray-200 rounded-b-md rounded-t-none shadow-lg z-50">
//                           <button
//                             onClick={() => {
//                               setTextScript("Roman");
//                               setDropdownOpen(false);
//                               setActiveTab("Text");
//                             }}
//                             className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition flex items-center justify-between ${
//                               textScript === "Roman"
//                                 ? "font-bold text-black bg-gray-50"
//                                 : "text-gray-700"
//                             }`}>
//                             Romanized
//                             {textScript === "Roman" && (
//                               <svg
//                                 className="w-4 h-4 text-green-600"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 viewBox="0 0 24 24">
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth={2}
//                                   d="M5 13l4 4L19 7"
//                                 />
//                               </svg>
//                             )}
//                           </button>
//                           <button
//                             onClick={() => {
//                               setTextScript("Devanagari");
//                               setDropdownOpen(false);
//                               setActiveTab("Text");
//                             }}
//                             className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition flex items-center justify-between ${
//                               textScript === "Devanagari"
//                                 ? "font-bold text-black bg-gray-50"
//                                 : "text-gray-700"
//                             }`}>
//                             Devanāgarī
//                             {textScript === "Devanagari" && (
//                               <svg
//                                 className="w-4 h-4 text-green-600"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 viewBox="0 0 24 24">
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth={2}
//                                   d="M5 13l4 4L19 7"
//                                 />
//                               </svg>
//                             )}
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   ) : (
//                     <button
//                       onClick={() => {
//                         setActiveTab(tab);
//                         setDropdownOpen(false);
//                       }}
//                       className={`text-sm sm:text-md font-bold transition-all duration-200 whitespace-nowrap px-3 sm:px-4 py-2 rounded-t-lg ${
//                         activeTab === tab
//                           ? "bg-black text-white"
//                           : "text-gray-600 hover:text-black hover:bg-gray-50"
//                       }`}>
//                       {tab}
//                     </button>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Tab Content with formatted numbered lists */}
//           <div className="py-8 sm:py-10 text-gray-800 font-medium leading-relaxed text-sm sm:text-lg">
//             <style>{`
//               .rich-text-content ol {
//                 counter-reset: item;
//                 list-style: none;
//                 padding-left: 2rem !important;
//                 margin: 1rem 0;
//               }
                

//               .rich-text-content ol > li {
//                 counter-increment: item;
//                 position: relative;
//                 margin-bottom: 0.5em;
//               }

//               .rich-text-content ol > li::before {
//                 content: "(" counter(item) ")";
//                 position: absolute;
//                 left: -2.2rem;
//                 font-weight: 600;
//                 color: #374151;
//               }
              
//               .rich-text-content {
//                 font-size: inherit;
//                 line-height: 1.2;
//               }
              
//               .rich-text-content li {
//                 font-size: inherit;
//                 line-height: 1.1;
//                 margin-bottom: 0.75rem;
//               }
              
//               .numbered-inline {
//                 font-weight: 600;
//                 color: #374151;
//                 margin-right: 0.5rem;
//               }
              
//               .rich-text-content + p,
//               p + .rich-text-content {
//                 margin-top: 1.5rem;
//               }
              
//               .tab-content p {
//                 line-height: 1.6;
//               }
              
//               .tab-content > *:first-child {
//                 margin-top: 0;
//               }
              
//               .tab-content > *:last-child {
//                 margin-bottom: 0;
//               }
//             `}</style>

//             <div className="tab-content rich-text-content">
//               {activeTab === "Description" && (
//                 <div>
//                   {parse(getFormattedContent())}
//                   {inscription?.google_maps_link && (
//                     <p className="mt-1">
//                       <a
//                         href={inscription.google_maps_link}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-blue-400 hover:text-blue-700 ">
//                         View Location in Map
//                       </a>
//                     </p>
//                   )}
//                 </div>
//               )}

//               {activeTab === "Background" && (
//                 <div>{parse(getFormattedContent())}</div>
//               )}

//               {activeTab === "Text" && (
//                 <div>{parse(getFormattedContent())}</div>
//               )}

//               {activeTab === "Translation" && (
//                 <div>{parse(getFormattedContent())}</div>
//               )}

//               {activeTab === "References" && (
//                 <div>{parse(getFormattedContent())}</div>
//               )}

//               {activeTab === "Glossary" && (
//                 <div>{parse(getFormattedContent())}</div>
//               )}
//             </div>
//           </div>
//           {/* Back Button */}
//           <Link
//             href="/inscriptions"
//             className="flex items-center gap-2 text-black cursor-pointer z-10 text-sm hover:text-red-700 transition underline"
//             aria-label="Go back">
//             <BiChevronLeft className="w-5 h-5" />
//             <span className="text-sm font-medium">Back to Inscriptions</span>
//           </Link>
//         </div>
//       </div>
//     </>
//   );
// };

//  InscriptionsDetails.layout = (page) => <GuestLayout>{page}</GuestLayout>;

// export default InscriptionsDetails;


// import React, { useEffect, useState, useRef } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/navigation";
// import { Link, router, usePage } from "@inertiajs/react";
// import axios from "axios";
// import parse from "html-react-parser";
// import { BiArrowBack, BiChevronLeft, BiLoader } from "react-icons/bi";
// import GuestLayout from '@/Layouts/GuestLayout'

// const tabs = [
//   "Description",
//   "Background",
//   "Text",
//   "Translation",
//   "References",
//   "Glossary",
// ];

// // Formatter function to convert 1., 2., 3. to (1), (2), (3)
// // Updated to work with your CSS styles
// const formatNumberedContent = (htmlString) => {
//   if (!htmlString || typeof htmlString !== "string") return "";

//   let formatted = htmlString;

//   // Pattern 1: Wrap plain number patterns in <ol> and <li> tags for CSS styling
//   // This handles: 1. text 2. text 3. text
//   formatted = formatted.replace(/((?:\d+\.\s+[^\n<]+(?:\n|$))+)/g, (match) => {
//     const lines = match
//       .trim()
//       .split("\n")
//       .filter((line) => line.trim());
//     const listItems = lines
//       .map((line) => {
//         const numberMatch = line.match(/^(\d+)\.\s+(.*)$/);
//         if (numberMatch) {
//           const [, number, text] = numberMatch;
//           return `<li>${text}</li>`;
//         }
//         return `<li>${line}</li>`;
//       })
//       .join("");
//     return `<ol class="rich-text-content">${listItems}</ol>`;
//   });

//   // Pattern 2: Convert <p>1. text</p> to <ol><li>text</li></ol>
//   formatted = formatted.replace(
//     /<p>\s*(\d+)\.\s*(.*?)<\/p>/gi,
//     (match, number, text) => {
//       // Check if this is part of a sequence
//       const nextPattern = new RegExp(
//         `<p>\\s*${parseInt(number) + 1}\\.\\s*(.*?)<\/p>`,
//         "i",
//       );
//       if (nextPattern.test(formatted)) {
//         // This is part of a numbered list - will be handled by the previous pattern
//         return match;
//       }
//       return `<ol class="rich-text-content"><li>${text}</li></ol>`;
//     },
//   );

//   // Pattern 3: For already existing <ol> tags, ensure they have the right class
//   formatted = formatted.replace(
//     /<ol(?:\s[^>]*)?>/gi,
//     '<ol class="rich-text-content">',
//   );

//   // Pattern 4: For individual numbered items in paragraphs that aren't lists
//   // Keep them as is but wrap numbers
//   formatted = formatted.replace(
//     /<p>(\d+)\.\s+([^<]+)<\/p>/gi,
//     '<p><span class="numbered-inline">($1)</span> $2</p>',
//   );

//   return formatted;
// };

// // Alternative function that preserves existing <ol> structure
// const processOLTags = (content) => {
//   if (!content) return "";

//   // First, ensure all ol tags have the rich-text-content class
//   let processed = content.replace(
//     /<ol(?:\s[^>]*)?>/gi,
//     '<ol class="rich-text-content">',
//   );

//   // Also add class to any ul that should be ol (if there are misformatted lists)
//   processed = processed.replace(
//     /<ul(?:\s[^>]*)?>(\s*<li>\s*\d+\.)/gi,
//     '<ol class="rich-text-content">',
//   );

//   // Remove numbers from li tags since CSS counters will handle them
//   processed = processed.replace(
//     /<li>\s*(\d+)\.\s*(.*?)<\/li>/gi,
//     "<li>$2</li>",
//   );

//   return processed;
// };

// // Inertia gives us the raw (percent-encoded) URL, so decode safely.
// const safeDecode = (value) => {
//   try {
//     return decodeURIComponent(value);
//   } catch {
//     return value;
//   }
// };

// const InscriptionsDetails = () => {
//   const [inscription, setInscription] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Inertia replacement for useParams(): the route is /{slug}/details.
//   // If your Laravel controller passes a `slug` prop, that is used first;
//   // otherwise it is read from the first URL segment.
//   const { url, props } = usePage();
//   const slug =
//     props?.slug ?? safeDecode(url.split("?")[0].split("#")[0].split("/").filter(Boolean)[0] ?? "");

//   const imgurl = import.meta.env.VITE_IMAGE_PATH;

//   const [activeIndex, setActiveIndex] = useState(0);
//   const [activeTab, setActiveTab] = useState("Description");
//   const [textScript, setTextScript] = useState("Roman");
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const dropdownRef = useRef(null);
//   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

//   useEffect(() => {
//     const fetchInscription = async () => {
//       try {
//         const response = await axios.get(
//           `${API_BASE_URL}/${slug}/details`,
//         );
//         const data = response.data.data;

//         // Check if inscription exists and has published status
//         if (data && data.status !== "published") {
//           // Redirect to 404 or home page if not published
//           router.visit("/inscriptions");
//           return;
//         }

//         setInscription(data);
//         setLoading(false);
//       } catch (error) {
//         console.error("fetching error", error);
//         // Redirect on error
//         router.visit("/inscriptions");
//         setLoading(false);
//       }
//     };
//     fetchInscription();
//   }, [slug]);

//   // Handle click outside dropdown
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   if (loading) {
//     return (
//       <div className="text-center py-20 h-screen flex flex-col items-center justify-center">
//         <BiLoader className="w-12 h-12 text-black animate-spin mb-4" />
//         <p className="text-lg text-gray-600">Loading inscription details...</p>
//       </div>
//     );
//   }

//   if (!inscription) {
//     return (
//       <div className="text-center py-20 h-screen items-center flex justify-center">
//         <div>
//           <h1 className="text-2xl font-bold mb-4">Inscription Not Found</h1>
//           <p className="text-gray-600 mb-6">
//             The requested inscription is not available or has not been published
//             yet.
//           </p>
//           <button
//             onClick={() => router.visit("/inscriptions")}
//             className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition">
//             Back to Inscriptions
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Get formatted content for the active tab
//   const getFormattedContent = () => {
//     let content = "";

//     switch (activeTab) {
//       case "Description":
//         content = inscription?.description || "";
//         break;
//       case "Background":
//         content = inscription?.background || "";
//         break;
//       case "Text":
//         // Check which script version to show
//         if (textScript === "Roman") {
//           content = inscription?.text || "";
//         } else {
//           content = inscription?.dev_text || inscription?.text || "";
//         }
//         break;
//       case "Translation":
//         content = inscription?.translation || "";
//         break;
//       case "References":
//         content = inscription?.references || "";
//         break;
//       case "Glossary":
//         content = inscription?.glossary || "";
//         break;
//       default:
//         content = "";
//     }

//     // Process the content with both functions
//     let formatted = processOLTags(content);
//     formatted = formatNumberedContent(formatted);

//     return formatted;
//   };

//   // Determine which image to use for video poster
//   const getPosterImageIndex = () => {
//     if (inscription?.inscription_number === "INSN 00003") {
//       return 1; // Use index 1 for INSN 00003
//     }
//     return 0; // Default to index 0
//   };

//   const isInscription00003 = inscription?.inscription_number === "INSN 00003";

//   console.log("Inscription Data:", inscription);

//   return (
//     <>
//       <div className="relative h-[60vh] mt-12 w-full ">
//         {/* Background Image */}
//         <img
//           src={`${imgurl}/${inscription?.banner_image}`}
//           alt="Licchavi Inscription"
//           className="w-full h-full object-cover"
//         />

//         {/* Dark overlay */}
//         <div className="absolute inset-0 bg-black/40"></div>

//         <div className="absolute top-16 left-6 z-10 text-white p-3 flex items-center gap-2 text-base leading-6 tracking-wide">
//           <Link href="/" className="hover:underline">
//             Home
//           </Link>

//           <span>/</span>

//           <Link href="/inscriptions" className="hover:underline">
//             Inscriptions
//           </Link>

//           <span>/</span>

//           <span className="opacity-80">{inscription?.title}</span>
//         </div>

//         {/* Heading */}
//         <p className="absolute inset-0 flex items-center justify-center text-3xl sm:text-5xl text-white text-center px-4">
//           {inscription?.title}
//         </p>
//       </div>

//       <button
//         className="absolute top-6 left-6 z-10 bg-white/90 hover:bg-white text-black p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-black"
//         aria-label="Go back"
//         onClick={() => router.visit("/inscriptions")}>
//         <BiArrowBack className="w-5 h-5" />
//       </button>

//       {/* Slider */}
//       <div className="max-w-7xl px-4 mx-auto py-16">
//         <Swiper
//           modules={[Navigation]}
//           navigation
//           spaceBetween={16}
//           loop={true}
//           slidesPerView={2}
//           breakpoints={{
//             640: { slidesPerView: 2 },
//             768: { slidesPerView: 4 },
//             1024: { slidesPerView: 4 },
//           }}>
//           {inscription?.images.map((img, index) => (
//             <SwiperSlide key={index}>
//               <img
//                 src={`${imgurl}/${img.image_path}`}
//                 onClick={() => setActiveIndex(index)}
//                 className={`w-full h-48 object-cover cursor-pointer transition border-4 ${
//                   activeIndex === index ? "border-black" : "border-transparent"
//                 }`}
//                 alt={`${inscription?.title}`}
//               />
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </div>

//       {/* Main Image and Video */}
//       <div className="max-w-7xl mx-auto px-4 pb-12">
//         <div className="grid sm:grid-cols-2 gap-8 ">
//           {/* Image */}
//           <div className="w-full">
//             <div className="relative w-full aspect-video overflow-hidden">
//               <img
//                 src={`${imgurl}/${inscription?.images[activeIndex]?.image_path}`}
//                 alt={`${inscription?.title}`}
//                 className="w-full h-full object-cover object-center"
//               />
//               <div className="absolute top-6 right-4 bg-black/70 text-white text-sm px-4 py-2 rounded-full">
//                 {activeIndex + 1} / {inscription?.images.length}
//               </div>
//             </div>
//           </div>

//           {/* Video */}
//           <div className="w-full">
//             <div className="relative w-full aspect-video overflow-hidden shadow-md">
//               {inscription?.video && (
//                 <video
//                   src={inscription?.video}
//                   controls
//                   poster={`${imgurl}/${inscription?.video_banner}`}
//                   className="w-full h-full object-cover"
//                 />
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="max-w-5xl mx-auto mt-12 px-4 sm:px-6">
//           <div className="border-b border-black">
//             <div className="flex flex-wrap gap-1 sm:gap-2">
//               {tabs.map((tab) => (
//                 <div key={tab} className="relative">
//                   {tab === "Text" ? (
//                     <div className="relative" ref={dropdownRef}>
//                       <button
//                         onClick={() => setDropdownOpen(!dropdownOpen)}
//                         className={`flex items-center cursor-pointer gap-1 text-sm sm:text-md font-bold transition-all duration-200 whitespace-nowrap ${
//                           activeTab === "Text"
//                             ? "bg-black text-white px-3 sm:px-4 py-2 rounded-t-lg rounded-b-none"
//                             : "text-gray-600 hover:text-black px-3 sm:px-4 py-2 hover:bg-gray-50 rounded-t-lg"
//                         }`}
//                         onMouseEnter={() => {
//                           setActiveTab("Text");
//                           setDropdownOpen(true);
//                         }}>
//                         Text
//                         <svg
//                           className={`w-3 h-3 transition-transform duration-200 ${
//                             dropdownOpen ? "rotate-180" : ""
//                           }`}
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24">
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M19 9l-7 7-7-7"
//                           />
//                         </svg>
//                       </button>

//                       {dropdownOpen && (
//                         <div className="absolute left-0 top-full mt-0 w-48 bg-white border border-gray-200 rounded-b-md rounded-t-none shadow-lg z-50">
//                           <button
//                             onClick={() => {
//                               setTextScript("Roman");
//                               setDropdownOpen(false);
//                               setActiveTab("Text");
//                             }}
//                             className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition flex items-center justify-between ${
//                               textScript === "Roman"
//                                 ? "font-bold text-black bg-gray-50"
//                                 : "text-gray-700"
//                             }`}>
//                             Romanized
//                             {textScript === "Roman" && (
//                               <svg
//                                 className="w-4 h-4 text-green-600"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 viewBox="0 0 24 24">
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth={2}
//                                   d="M5 13l4 4L19 7"
//                                 />
//                               </svg>
//                             )}
//                           </button>
//                           <button
//                             onClick={() => {
//                               setTextScript("Devanagari");
//                               setDropdownOpen(false);
//                               setActiveTab("Text");
//                             }}
//                             className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition flex items-center justify-between ${
//                               textScript === "Devanagari"
//                                 ? "font-bold text-black bg-gray-50"
//                                 : "text-gray-700"
//                             }`}>
//                             Devanāgarī
//                             {textScript === "Devanagari" && (
//                               <svg
//                                 className="w-4 h-4 text-green-600"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 viewBox="0 0 24 24">
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth={2}
//                                   d="M5 13l4 4L19 7"
//                                 />
//                               </svg>
//                             )}
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   ) : (
//                     <button
//                       onClick={() => {
//                         setActiveTab(tab);
//                         setDropdownOpen(false);
//                       }}
//                       className={`text-sm sm:text-md font-bold transition-all duration-200 whitespace-nowrap px-3 sm:px-4 py-2 rounded-t-lg ${
//                         activeTab === tab
//                           ? "bg-black text-white"
//                           : "text-gray-600 hover:text-black hover:bg-gray-50"
//                       }`}>
//                       {tab}
//                     </button>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Tab Content with formatted numbered lists */}
//           <div className="py-8 sm:py-10 text-gray-800 font-medium leading-relaxed text-sm sm:text-lg">
//             <style>{`
//               .rich-text-content ol {
//                 counter-reset: item;
//                 list-style: none;
//                 padding-left: 2rem !important;
//                 margin: 1rem 0;
//               }
                

//               .rich-text-content ol > li {
//                 counter-increment: item;
//                 position: relative;
//                 margin-bottom: 0.5em;
//               }

//               .rich-text-content ol > li::before {
//                 content: "(" counter(item) ")";
//                 position: absolute;
//                 left: -2.2rem;
//                 font-weight: 600;
//                 color: #374151;
//               }
              
//               .rich-text-content {
//                 font-size: inherit;
//                 line-height: 1.2;
//               }
              
//               .rich-text-content li {
//                 font-size: inherit;
//                 line-height: 1.1;
//                 margin-bottom: 0.75rem;
//               }
              
//               .numbered-inline {
//                 font-weight: 600;
//                 color: #374151;
//                 margin-right: 0.5rem;
//               }
              
//               .rich-text-content + p,
//               p + .rich-text-content {
//                 margin-top: 1.5rem;
//               }
              
//               .tab-content p {
//                 line-height: 1.6;
//               }
              
//               .tab-content > *:first-child {
//                 margin-top: 0;
//               }
              
//               .tab-content > *:last-child {
//                 margin-bottom: 0;
//               }
//             `}</style>

//             <div className="tab-content rich-text-content">
//               {activeTab === "Description" && (
//                 <div>
//                   {parse(getFormattedContent())}
//                   {inscription?.google_maps_link && (
//                     <p className="mt-1">
//                       <a
//                         href={inscription.google_maps_link}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-blue-400 hover:text-blue-700 ">
//                         View Location in Map
//                       </a>
//                     </p>
//                   )}
//                 </div>
//               )}

//               {activeTab === "Background" && (
//                 <div>{parse(getFormattedContent())}</div>
//               )}

//               {activeTab === "Text" && (
//                 <div>{parse(getFormattedContent())}</div>
//               )}

//               {activeTab === "Translation" && (
//                 <div>{parse(getFormattedContent())}</div>
//               )}

//               {activeTab === "References" && (
//                 <div>{parse(getFormattedContent())}</div>
//               )}

//               {activeTab === "Glossary" && (
//                 <div>{parse(getFormattedContent())}</div>
//               )}
//             </div>
//           </div>
//           {/* Back Button */}
//           <Link
//             href="/inscriptions"
//             className="flex items-center gap-2 text-black cursor-pointer z-10 text-sm hover:text-red-700 transition underline"
//             aria-label="Go back">
//             <BiChevronLeft className="w-5 h-5" />
//             <span className="text-sm font-medium">Back to Inscriptions</span>
//           </Link>
//         </div>
//       </div>
//     </>
//   );
// };

//  InscriptionsDetails.layout = (page) => <GuestLayout>{page}</GuestLayout>;

// export default InscriptionsDetails;
