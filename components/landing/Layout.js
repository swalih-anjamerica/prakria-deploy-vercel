// import { Pricing } from "aws-sdk";
// import React, { Children, useState } from "react";
// import Portfolio from "../../pages/portfolio";
// import Services from "../../pages/services";
// import Work from "../../pages/work";
// import About from "../../pages/about";
// import Header from "./Header";
// import LandingScreen from "./LandingScreen";

// export default function Layout({ Children }) {
//   const [active, setActive] = useState("");
//   let routeLinks = [
//     { link: "/work", title: "How We work", component: <Work /> },
//     { link: "/portfolio", title: "Our Porfolio", component: <Portfolio /> },
//     { link: "/pricing", title: "Pricing", component: <Pricing /> },
//     { link: "/services", title: "Services", component: <Services /> },
//     { link: "/about", title: "About", component: <About /> },
//   ];


//   return (
//     <>
//       <Header routeLinks={routeLinks} setActive={setActive} active={active} />
//       {active ? (
//         routeLinks.find((e) => e.title === active).component
//       ) : (
//         <LandingScreen />
//       )}
//     </>
//   );
// }
