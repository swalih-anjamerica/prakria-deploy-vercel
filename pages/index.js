import { useEffect } from "react";
import LandingScreen from "../components/landing/LandingScreen";

export default function Home() {

  // const router = useRouter();

  useEffect(() => {
    // viewport.setAttribute('content', 'width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no');

  }, [])

  return (
    <>
      {/* <Header/> */}
      <LandingScreen />
      {/* <Footer/> */}
    </>
  )
}


Home.getLayout = ({ children }) => {

  return (
    <>
      {
        children
      }
    </>
  )
}