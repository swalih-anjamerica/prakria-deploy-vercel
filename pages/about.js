import Link from "next/link";
import React, { useRef, useState } from "react";
import Footer from "../components/landing/Footer";
import Header from "../components/landing/Header";
import Unsure from "../components/landing/Unsure";
import { images } from "../utils/common";
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";

function About() {
  const ref = useRef(null);
  const works = [...images.immersive, ...images.print];
  const [current, setCurrent] = useState(1);

  const scroll = (dir) => {
    switch (dir) {
      case "left":
        ref.current.scrollLeft -= 1000;
        ref.current.style.animation = "mynewmove 1s	";

        break;
      case "right":
        ref.current.scrollLeft += 1000;
        ref.current.style.animation = "mynewmove 1s	";
        break;
    }
  };

  return (
    <div className="bg-white mx-auto w-full h-full snap-y">
      <Header />
      <section className="w-[90%] mx-auto">
        <p className="landing-heading mt-12">
          The Story of an <span className="text-[#FF5959]">Un-agency</span>{" "}
          Agency
        </p>
        <p className="text-[16px] font-medium w-[52rem] mt-6">
          Our journey started 20 years ago. Wide-eyed, hungry for great work,brimming with passion, we took<br />
          our first few baby steps in the mad world of Design Agencies. And as is the case with any new<br />
          beginning, the first few steps were the hardest.
        </p>
        <div className="flex justify-between h-[20rem] mt-7">
          <div className="w-[53%]">
            <p className="text-sm w-full xl:text-[1rem] font-normal">
              The first steps were harder still because we weren&apos;t willing to<br />
              compromise on anything, for anyone. We weren&apos;t willing to<br />
              laze around all day and half-ass our work in the last moment.<br />
              We weren&apos;t willing to take our clients for a ride. We weren&apos;t<br />
              willing to party harder and work just-about-enough-to-get-<br />
              it-done at our client&apos;s expense. All in all, we weren&apos;t willing to<br />
              breed incompetence and laziness, and end up becoming a<br />
              sorry excuse of an “agency”.
            </p>
          </div>
          <div className="w-[47%]">
            <img src="/assets/landing/unagency.png" className="max-h-[400px]" />
          </div>
        </div>
      </section>
      <section className="w-[90%] flex justify-between mr-auto my-16">
        <div className="w-[56%]">
          <img src="/assets/landing/binacular.png" />
        </div>
        <div className="w-[44%] flex flex-col justify-around xl:py-[5rem] items-center">
          <p className="landing-heading w-[310px] 2xl:w-[70%]">
            Swimming <br />
            <span className="text-[#FF5959]">Against</span> the Tide <br />
            of Conventional <br />
            Agencies
          </p>
          <p className="text-base font-bold w-[310px] 2xl:w-[70%] mt-6">
            We realized that the world around us is a sea of Infinite
            Possibilities. And there were a lot of fish in the sea.
          </p>
          <p className="text-sm font-normal mt-3 w-[310px] 2xl:w-[70%]">
            We had to create our unique space in it, but while swimming against
            the tide of conventional agencies. We had to denounce all the
            negative notions that were generally associated with a “Creative
            Agency”, and start afresh. Every step of the way, we had to
            challenge the status quo in our efforts to survive, thrive, and
            succeed.
          </p>
        </div>
      </section>
      <section className="w-[90%] flex justify-between mx-auto my-16 gap-6 lg:gap-0">
        <div className="w-[44%] flex flex-col justify-around">
          <p className="landing-heading">
            Hard work.
            <br />
            <span className="text-[#FF5959]">Hard work.</span>
            <br /> Hard work.
          </p>
          <p className="text-lg font-bold w-[396px] mt-6">
            We knew we had Infinite Passion on our side. We knew we had Infinite
            Potential. We knew we had the willingness to learn. And most
            importantly, we knew we could work our bottoms off. And so we did.
          </p>
          <p className="text-sm font-normal mt-3 w-full">
            We worked as hard as we could. Every. Single. Day. Without fail,
            without stop; come rain, ruin, or rapture. And slowly, but surely,
            it started to pay off. We started making friends along the way.
            Friends that valued what we valued – Great Quality work in Great
            Speed, Professionalism, a robust Work Ethic.<br /> Not to flaunt or
            anything, but one of our longest-running friendships has been with
            the Global Business Giant, Nestle.
          </p>
        </div>
        <div className="w-[55%] self-center ml-[10px]">
          <img src="/assets/landing/Hard-Work 1.png" />
        </div>
      </section>
      <section className="w-[90%] flex justify-between mx-auto my-16">
        <div className="w-[50%] self-center">
          <img src="/assets/landing/paperRocket.png" />
        </div>
        <div className="w-[50%] -ml-[40px] flex flex-col justify-around xl:py-[5rem]">
          <p className="landing-heading">
            The <span className="text-[#FF5959]">Great <br /> Leap</span> Forward{" "}
          </p>
          <p className="text-base font-bold w-[375px] mt-6">
            Along the way, we built trust. We nurtured relationships. And we
            understood the subtleties and the grandeur of what it takes to
            succeed in this business.
          </p>
          <div className="text-sm font-normal mt-3 w-[410px]">
            <p>
              We understood how fast-paced and dynamic our world is. We understood
              just how crucial it is for businesses to get their market plans
              launched and rolling in time, and the responsibilities we share in
              this process. We <br /> understood the amount of trust and money at
              stake for every single project to see the light of the day.
            </p>
            <p className="mt-4">
              All of this made us realize, that though difficult, our first few
              baby steps towards an &apos;Un-Agency Agency&apos; approach were
              in the right direction. With this confidence and assurance, and
              with the changing business landscape over the recent years, we
              built PRAKRIA DIRECT.
            </p>
          </div>
        </div>
      </section>
      <section className="w-full flex justify-between mx-auto my-16 min-h-[900px]">
        <div className="md:w-[50%] bg-[#FFF300] py-[3rem] pl-[7.5%] pr-[20px] 2xl:p-[5rem] 2xl:m-[1.3rem]">
          <p className="text-4xl pb-3 font-black leading-10 ">
            What is
            <br />
            PRAKRIA DIRECT?
          </p>
          <p className="text-lg w-full mt-6">
            PRAKRIA DIRECT is a platform that gives Direct Access to Enterprises
            of any size or format to come and get all their creative
            requirements met through a personalized & vetted team of our
            in-house Creative Experts without the hassle of typical agencies and
            the unreliability of Freelancers.{" "}
          </p>
          <p className="text-sm font-normal mt-3 w-full">
            Our aim of forming PRAKRIA DIRECT is very simple: to become a
            profitable part of YOUR business. We are not here just to serve
            ourselves. We are not just here to make a few bucks. We&apos;re here
            to take the industry forward, we&apos;re here to help businesses
            thrive and grow, we&apos;re here to create cutting-edge and
            jaw-dropping designs that will leap off the shelf. We… are here to
            stay.
          </p>
          <p className="text-lg font-bold w-full mt-6">
            … And We Welcome You to The World of PRAKRIA DIRECT{" "}
          </p>
          <p className="text-sm font-normal mt-3 w-full">
            We welcome all who believe in great work. We welcome all who are fed
            up of the conventional agency hassle. We welcome all who care about
            their work too much to hand it over to unreliable hands. We welcome
            You, big or small, one-man-show or massive enterprise. You, who
            dream as we dream, work as we work &ndash; Direct, Unapologetic, and
            Sincere.
            <br />
            <br />
            Together, let&apos;s make something beautiful.
          </p>
        </div>
        <div className="flex flex-col items-center gap-[10rem] w-[50%] pt-44 justify-evenly">
          {/* <div className=""> */}
          <div className="relative">
            <img
              src="/assets/landing/subscribe.png"
              className="absolute top-[-13rem] left-[50%] translate-x-[-50%] w-[15rem]"
            />
            <span className="w-[16rem] text-center py-7 px-8 bg-[#000] flex flex-col justify-between gap-5 text-white h-[12rem]">
              <p className="text-lg font-bold text-center text-[20px]">
                Subscription
              </p>
              <p className="text-xs">
                Recommended for small and medium sized businesses
              </p>
              <button className="bg-[#FFF300] px-2 py-2 text-gray-900 text-xs rounded-sm self-center uppercase cursor-pointer  w-40 font-semibold">
                <Link href="/pricing#pricing">Subscribe Now </Link>
              </button>
            </span>
          </div>
          {/* </div> */}
          {/* <div className=""> */}
          <div className="relative ">
            <img
              src="/assets/landing/handshake.png"
              className=" absolute top-[-13rem] left-[50%] translate-x-[-50%] w-[15rem]"
            />
            <span className="w-[16rem] text-center py-5 px-4 bg-[#000] flex flex-col justify-between gap-5 text-white h-[12rem]">
              <p className="text-lg font-bold text-center text-[20px]">
                Partner With Us
              </p>
              <p className="text-xs">
                Best suited for companies with bulk and unique design
                requirements
              </p>
              <button className="bg-[#FFF300] px-2 py-2 text-gray-900 text-xs rounded-sm self-center uppercase w-40 font-semibold">
                <Link href="/pricing#requestQuote">Partner BENEFITS</Link>
              </button>
            </span>
          </div>
          {/* </div> */}
        </div>
      </section>
      <section className="p-10 mt-24 pl-0 w-[90%] mx-auto">
        <p className="text-4xl pb-3 font-black leading-10">Our Works</p>
      </section>
      <div className="relative h-72 w-[95%] ml-auto">
        <div
          className=" flex flex-row gap-3 overflow-auto h-full mb-7 no-scrollbar"
          ref={ref}
        >
          {works.map((img, i) => {
            return (
              <React.Fragment key={i}>
                <img key={i} src={img} className="shadow-md" />
                <div>
                  <BsChevronCompactLeft
                    className="absolute-vertical-center h-10 w-10  text-primary-black cursor-pointer"
                    onClick={() => {
                      scroll("left");
                    }}
                  />
                </div>
                <div>
                  <BsChevronCompactRight
                    className="absolute-vertical-center-right h-10 w-10 absolute text-primary-black cursor-pointer"
                    onClick={() => {
                      scroll("right");
                    }}
                  />
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
      <Unsure />
      <Footer />
    </div>
  );
}

export default About;

About.getLayout = ({ children }) => {
  return children;
};
