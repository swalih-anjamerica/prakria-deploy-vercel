import Link from 'next/link'
import React from 'react'

function Unsure({width="90%"}) {
    return (
        <section className={`mx-auto py-12 w-[${width||"90%"}]`}>
            <p className="text-2xl font-semibold leading-10">Book a free consultation with us today!</p>

            <a href={`https://calendly.com/info-44201/prakria_direct_free_consultation?month=${new Date().getFullYear()}-${new Date().getMonth()+1}`} target="_blank" rel="noreferrer">
                <button className="yellow-action-button-landing w-56 mt-4 uppercase" >
                    Book Now
                </button>
            </a>
        </section>
    )
}

export default Unsure;
