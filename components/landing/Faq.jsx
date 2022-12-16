import React, { useState } from "react";
import Link from "next/link";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const Faq = ({ marginClass }) => {
  const [openTab, setOpenTab] = useState(null);
  const handleFaqTab = (num) => {
    if (num == openTab) {
      return setOpenTab(null);
    }
    setOpenTab(num);
  }
  return (
    <section className={`w-full ${marginClass || "mt-28 mx-auto"}  py-16 bg-[#FFF300]  select-none`}>
      <div className="w-[90%] mx-auto flex flex-col">
        <span className="text-5xl text-[#050F3D] font-bold italic leading-10 mb-4">
          FAQs
        </span>
        <span className="text-xl text-[#050F3D] font-semibold mb-12">
          Contact Support
        </span>
        <div className="flex justify-between transition-all font-[600]">
          <div className="flex flex-col gap-5 w-full md:w-[50%]">
            <span
              onClick={() => handleFaqTab(1)}
              className="border-2 border-gray-700 px-4 py-2 flex flex-col cursor-pointer relative"
            >
              Can you do custom pricing? {openTab == 1 ? <FaChevronUp className="absolute right-3" /> : <FaChevronDown className="absolute right-3" />}
              <span className={`${openTab != 1 && "hidden"} text-xs mt-5 faq-animat`}>
                Yes, let&apos;s discuss. We do offer discounts on long-term
                commitments and we also work on a project-to-project basis.
                Everything depends on the nature of the work. Connect with our
                team to get a custom price quote.
              </span>
            </span>
            <span
              onClick={() => handleFaqTab(2)}
              className="border-2 border-gray-700 px-4 py-2 flex flex-col cursor-pointer relative"
            >
              Is there any long-term commitment? {openTab == 2 ? <FaChevronUp className="absolute right-3" /> : <FaChevronDown className="absolute right-3" />}
              <span className={`${openTab != 2 && "hidden"} text-xs mt-5 faq-animat`}>
                No! The minimum subscription is month-to-month.
              </span>
            </span>
            <span
              onClick={() => handleFaqTab(3)}
              className="border-2 border-gray-700 px-4 py-2 flex flex-col cursor-pointer relative"
            >
              How long do revisions take? {openTab == 3 ? <FaChevronUp className="absolute right-3" /> : <FaChevronDown className="absolute right-3" />}
              <span className={`${openTab != 3 && "hidden"} text-xs mt-5 faq-animat`}>
                24 hours. That&apos;s it.
              </span>
            </span>
            <span
              onClick={() => handleFaqTab(5)}
              className="border-2 border-gray-700 px-4 py-2 flex flex-col cursor-pointer relative"
            >
              Where will my files be stored? {openTab == 5 ? <FaChevronUp className="absolute right-3" /> : <FaChevronDown className="absolute right-3" />}
              <span className={`${openTab != 5 && "hidden"} text-xs mt-5 faq-animat`}>
                All your files will be securely stored on our platform and can
                be accessed from your dashboard.
              </span>
            </span>
            <span
              onClick={() => handleFaqTab(8)}
              className="border-2 border-gray-700 px-4 py-2 flex flex-col cursor-pointer relative"
            >
              How many projects can you complete in a month? {openTab == 8 ? <FaChevronUp className="absolute right-3" /> : <FaChevronDown className="absolute right-3" />}
              <span className={`${openTab != 8 && "hidden"} text-xs mt-5 faq-animat`}>
                It depends on the nature of the project. We can go all guns
                blazing on projects that warrant speed and we can slow-cook a
                design gourmet if that is the requirement. Again, it all depends
                on the nature of the project.
              </span>
            </span>
            <span
              onClick={() => handleFaqTab(10)}
              className="border-2 border-gray-700 px-4 py-2 flex flex-col cursor-pointer relative"
            >
              Are there any hidden fees? {openTab == 10 ? <FaChevronUp className="absolute right-3" /> : <FaChevronDown className="absolute right-3" />}
              <span className={`${openTab != 10 && "hidden"} text-xs mt-5 faq-animat`}>
                No hidden fees. The package price is exactly what you pay
                monthly. All taxes and fees are included in that price.
              </span>
            </span>
            <span
              onClick={() => handleFaqTab(4)}
              className="border-2 border-gray-700 px-4 py-2 flex flex-col cursor-pointer relative"
            >
              What if I don&apos;t like any design? {openTab == 4 ? <FaChevronUp className="absolute right-3" /> : <FaChevronDown className="absolute right-3" />}
              <span className={`${openTab != 4 && "hidden"} text-xs mt-5 faq-animat`}>
                You can communicate directly with your designer to let them know
                exactly what your vision is. As a designer keeps working on your
                brand, they&apos;ll soon get a knack for it and the frequency
                of feedbacks will reduce by 70%. On the off-chance that you
                still don&apos;t like any design, we will re-assign your project
                to another designer whose style may better fit your
                requirements.
              </span>
            </span>
            <span onClick={() => setOpenTab(null)} className="cursor-pointer">
              <Link href={`/?chatbox=true#faq`} target="_blank" rel="noreferrer" scroll={false}>
                Any specific query for us?
              </Link>
              <span
                className={`${openTab != 8 && "hidden"} text-xs mt-0`}
              ></span>
            </span>
          </div>
          <div className="md:flex justify-end hidden">
            <img src="/assets/landing/question.png" className="h-[30rem]" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faq;
