import Footer from "../components/landing/Footer";
import Faq from "../components/landing/Faq";
import Unsure from "../components/landing/Unsure";
import Header from "../components/landing/Header";
import GloablBrands from "../components/landing/GloablBrands";
import PrakriaWorks from "../components/landing/PrakriaWorks";


function Portfolio() {

    return (

        <div className="bg-white mx-auto w-full h-full">
            <Header />
            <PrakriaWorks />
            <GloablBrands />
            {/* <section className="w-[80%] mt-28 h-[26rem] mx-auto ">
                    <span className="text-5xl font-black italic leading-10 mt-16 mb-10">Testimonials</span>
                    <div className="flex overflow-x-auto">
                        <div className="flex flex-col p-10 shadow-xl w-96 my-10 mx-5">
                            <span className="text-base">Mr. Dheeraj Anand</span>
                            <span className="text-xl font-semibold mb-12">Nestle India</span>
                            <p className="text-sm">When we say Infinite Creative Possibilities, we mean it. From Print Design, Packaging, Branding, to Emailers, Newsletters, & Digital. From Stop-motion Animation, Food CGI, to AR Filters & Games. We bring together experts in each discipline so you get a complete team for all your creative requirements.
                            </p>
                        </div>
                        <div className="flex flex-col p-10 shadow-xl w-96 my-10 mx-5">
                            <span className="text-base">Mr. George Cyril</span>
                            <span className="text-xl font-semibold mb-12">ICICI Bank</span>
                            <p className="text-sm">When we say Infinite Creative Possibilities, we mean it. From Print Design, Packaging, Branding, to Emailers, Newsletters, & Digital. From Stop-motion Animation, Food CGI, to AR Filters & Games. We bring together experts in each discipline so you get a complete team for all your creative requirements.
                            </p>
                        </div>
                        <div className="flex flex-col p-10 shadow-xl w-96 my-10 mx-5">
                            <span className="text-base">Mr. Jimmy</span>
                            <span className="text-xl font-semibold mb-12">TATA Motors</span>
                            <p className="text-sm">When we say Infinite Creative Possibilities, we mean it. From Print Design, Packaging, Branding, to Emailers, Newsletters, & Digital. From Stop-motion Animation, Food CGI, to AR Filters & Games. We bring together experts in each discipline so you get a complete team for all your creative requirements.
                            </p>
                        </div>
                        <div className="flex flex-col p-10 shadow-xl w-96 my-10 mx-5">
                            <span className="text-base">Mr. Sanoj</span>
                            <span className="text-xl font-semibold mb-12">Tesla Inc.</span>
                            <p className="text-sm">When we say Infinite Creative Possibilities, we mean it. From Print Design, Packaging, Branding, to Emailers, Newsletters, & Digital. From Stop-motion Animation, Food CGI, to AR Filters & Games. We bring together experts in each discipline so you get a complete team for all your creative requirements.
                            </p>
                        </div>
                    </div>
                </section> */}
            <Faq marginClass={"mt-0"}/>
            <Unsure />
            <Footer />
        </div>

    )
}


export default Portfolio;

Portfolio.getLayout = ({ children }) => {
    return (
        <>
            {
                children
            }
        </>
    )
}
