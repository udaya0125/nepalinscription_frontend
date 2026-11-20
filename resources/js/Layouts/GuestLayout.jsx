import ApplicationLogo from "@/Components/ApplicationLogo";
import Footer from "@/HomeComponents/Footer";
import Navbar from "@/HomeComponents/Navbar";
import { Link } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { FiArrowUp } from "react-icons/fi";

export default function GuestLayout({ children }) {
    const [showBackToTop, setShowBackToTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.pageYOffset > 300) {
                setShowBackToTop(true);
            } else {
                setShowBackToTop(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        const disableRightClick = (e) => {
            if (e.target.tagName === "IMG") {
                e.preventDefault();
            }
        };

        document.addEventListener("contextmenu", disableRightClick);

        return () => {
            document.removeEventListener("contextmenu", disableRightClick);
        };
    }, []);
    return (
        <div className="min-h-screen">
            {/* <div>
                <Link href="/">
                    <ApplicationLogo className="h-20 w-20 fill-current text-gray-500" />
                </Link>
            </div> */}

            <div className="min-h-screen">
                <Navbar />
                {children}
                <Footer />

                {showBackToTop && (
                    <button
                        onClick={scrollToTop}
                        className="fixed bottom-8 right-8 cursor-pointer bg-[#7b634c] text-white p-3 rounded-full shadow-lg hover:bg-[#9f8c76] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#7b634c] focus:ring-opacity-50 z-50"
                        aria-label="Back to top"
                    >
                        <FiArrowUp size={24} />
                    </button>
                )}
            </div>
        </div>
    );
}
