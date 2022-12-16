import React from 'react'

function GloablBrands({ mainMarginClass }) {
    return (
        <section className={`w-[90%] mx-auto mb-12 ${mainMarginClass || "mt-[5rem] lg:mt-[10rem]"}`}>
            <span className="text-[20px] md:text-[3vw] 2xl:text-[48px] font-black leading-10 block  mb-12">
                Global Brands that Trust Us
            </span>
            <div className="flex justify-between">
                <img src="/assets/logos/Akzonobel-Logo.png" className="logo-hover-color" />
                <img src="/assets/logos/Burger-King.png" className="logo-hover-color" />
                <img src="/assets/logos/Colgate-Palmolive-Logo.png" className="logo-hover-color" />
                <img src="/assets/logos/Dr Oetkar.png" className="logo-hover-color" />
                <img src="/assets/logos/Hersheys-Logo.png" className="logo-hover-color" />
            </div>
            <div className="flex justify-between">
                <img src="/assets/logos/Dominos-Logo.png" className="logo-hover-color" />
                <img src="/assets/logos/Kohler-Logo.png" className="logo-hover-color" />
                <img src="/assets/logos/Medtronic-Logo.png" className="logo-hover-color" />
                <img src="/assets/logos/Merck-Logo.png" className="logo-hover-color" />
                <img src="/assets/logos/Nestle-Logo.png" className="logo-hover-color" />
            </div>
            <div className="flex justify-between">
                <img src="/assets/logos/Perfetti-Logo.png" className="logo-hover-color" />
                <img src="/assets/logos/Piaggio-Logo-46.png" className="logo-hover-color" />
                <img src="/assets/logos/purnia logo-52.png" className="logo-hover-color" />
                <img src="/assets/logos/reckitt logo-50.png" className="logo-hover-color" />
                <img src="/assets/logos/Uniliver-logo.png" className="logo-hover-color" />
            </div>
        </section>
    )
}

export default GloablBrands