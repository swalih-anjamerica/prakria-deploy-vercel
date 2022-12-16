import React, { useState } from "react";
import Footer from "../components/landing/Footer";
import Header from "../components/landing/Header";
import validator from "validator";
import API from "../services/api";
import ButtonLoader from "../components/common/ButtonLoader";
import toast from "react-hot-toast";

export default function JoinOurTeam() {
  let [formData, setFormData] = useState({})
  let [formErr, setFormErr] = useState({})
  let [submitting, setSubmitting] = useState(false);

  function handleInput(event) {
    setFormErr({});
    let name = event.target.name;
    let value = event.target.value;
    setFormData(prev => ({ ...prev, [name]: value }));

  }
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setFormErr({});
      if (!formData.name) {
        return setFormErr({ nameErr: "required" });
      }
      if (!formData.experienceLevel) {
        return setFormErr({ experienceLevelErr: "required" });
      }
      if (!formData.position) {
        return setFormErr({ positionErr: "required" });
      }
      if (!formData.phone) {
        return setFormErr({ mobileErr: "required" });
      }
      if (!formData.email) {
        return setFormErr({ emailErr: "required" });
      }
      if (!validator.isMobilePhone(formData.phone)) {
        return setFormErr({ mobileErr: "invalid mobile number" });
      }
      if (!validator.isEmail(formData.email)) {
        return setFormErr({ emailErr: "Invalid email" });
      }


      setSubmitting(true);
      await API.post("/su-admin/join-our-team", formData)
      setSubmitting(false);
      toast.success("Form submited successfully");
      e.target.reset()
      setFormData({});
    } catch (e) {
      setSubmitting(false);
      console.log(e.response);
      toast.error("Something went wrong! please try again later");
    }
  }
  console.log(formData);
  return (
    <div className="bg-white mx-auto w-full h-[100vh] max-h-[1300px] min-h-[900px] snap-y flex flex-col">
      <Header />
      <section className="h-full mt-[50px] mb-[50px]">
        <form className="relative flex  object-contain h-full" onSubmit={handleSubmit}>
          <div className="bg-red w-full" style={{background:'url("/assets/landing/career_bg.jpg")', backgroundSize:"100% 100%"}}>
            {/* <img
              src="/assets/landing/career_bg.jpg"
              className="h-full w-full"
            /> */}
            <div className=" ml-[10%] w-[50%] xl:w-[40%] flex flex-col bottom-0 h-full z-0 bg-white backdrop-sepia-0 bg-white/80  p-[2%] xl:p-[2%]">
              <div className="text-[#000000] font-semibold text-xl xl:text-2xl 2xl:text-4xl flex self-center ">Apply Here</div>
              <div className="flex-1 flex flex-col gap-2 mt-5 lg:gap-3 xl:gap-2 xl:mt-10">
                <div className="">
                  <p className="text-xs lg:text-md xl:text-sm 2xl:text-xl  font-semibold">Name*</p>
                  <input
                    type="text"
                    className="w-[70%] border-[2px] z-20 border-black  xl:p-0.5 2xl:p-3"
                    onChange={handleInput}
                    name="name"
                  />
                  <span className="text-red text-sm block">{formErr.nameErr}</span>
                </div>
                <div className="w-full">
                  <p className="text-xs lg:text-md xl:text-sm 2xl:text-xl font-semibold">Experience Level*</p>
                  <input
                    type="text"
                    className="w-full border-[2px] border-black xl:p-0.5 2xl:p-3"
                    onChange={handleInput}
                    name="experienceLevel"
                  />
                  <span className="text-red text-sm">{formErr.experienceLevelErr}</span>
                </div>
                <div className="">
                  <p className="text-xs lg:text-md xl:text-sm 2xl:text-xl font-semibold">What position are you applying for?*</p>
                  <input
                    type="text"
                    className="w-full border-[2px] border-black xl:p-0.5 2xl:p-3"
                    onChange={handleInput}
                    name="position"
                  />
                  <span className="text-red text-sm">{formErr.positionErr}</span>
                </div>
                <div className="">
                  <p className="text-xs lg:text-md xl:text-sm 2xl:text-xl font-semibold">How can you add value with your abilities at PRAKRIA?</p>
                  <input
                    type="text"
                    className="w-full border-[2px] border-black xl:p-0.5 2xl:p-3"
                    onChange={handleInput}
                    name="valueWithPrakria"
                  />
                  <span className="text-red text-sm">{formErr.valueWithPrakriaErr}</span>
                </div>
                <div className="">
                  <p className="text-xs lg:text-md xl:text-sm 2xl:text-xl font-semibold">Phone*</p>
                  <input
                    type="text"
                    className="w-full border-[2px] border-black xl:p-0.5 2xl:p-3"
                    onChange={handleInput}
                    name="phone"
                  />
                  <span className="text-red text-sm">{formErr.mobileErr}</span>
                </div>
                <div className="">
                  <p className="text-xs lg:text-md xl:text-sm 2xl:text-xl font-semibold">Email*</p>
                  <input
                    type="text"
                    className="w-full border-[2px] border-black xl:p-0.5 2xl:p-3"
                    onChange={handleInput}
                    name="email"
                  />
                  <span className="text-red text-sm">{formErr.emailErr}</span>
                </div>
                <div className="flex flex-col flex-1">
                  <p className="text-xs lg:text-md xl:text-sm 2xl:text-xl font-semibold">Write a message</p>
                  <textarea
                    type="text"
                    className="w-full border-[2px] border-black xl:p-0.5 2xl:p-3 flex-1 resize-none min-h-[150px]"
                    onChange={handleInput}
                    name="message"

                  />
                </div>
                <div className="w-full">
                  <button className="yellow-action-button w-40" disabled={submitting}>
                    {
                      submitting ? <ButtonLoader /> : "Submit"
                    }
                  </button>
                </div>
              </div>
            </div>
          </div>

        </form>
      </section>
      <section>
        <Footer />
      </section>
    </div>
  );
}

JoinOurTeam.getLayout = ({ children }) => {
  return <>{children}</>;
};
