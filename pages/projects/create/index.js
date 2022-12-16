const Logo = "/logo.png";
import React, { useRef, useState, useEffect, useMemo } from "react";
import { useProtectRouteAuth } from "../../../hooks/useRequireAuth";
import API from "../../../services/api";
import Link from "next/link";
import { useRouter } from "next/router";
import { uploadFile, useUploadFile } from "../../../hooks/queryHooks/useFile";
import { createProject } from "../../../hooks/queryHooks/useProjects";
import { Modal } from "../../../components/common/Modal";
import { LoaderRipple } from "../../../components/common/LoaderRipple";
import { RiArrowRightSFill, RiArrowLeftSFill } from "react-icons/ri";
import { BsArrowLeftCircle } from "react-icons/bs";
import { FiPaperclip } from "react-icons/fi";
import { BiTrash } from "react-icons/bi";
import { ProgressBar } from "../../../components/common/ProgressBar";
import toast from "react-hot-toast";
import ProgressBarV2 from "../../../components/common/ProgressBarV2";

function Create() {
  const ref = useRef(null);

  const router = useRouter();

  const [ dimensions, setDimensions ] = useState({ height: 500, width: "" });
  const [ loading, setLoading ] = useState(false);
  const [ error, setError ] = useState("");
  const [ fileUploadProgress, setFileUploadProgress ] = useState(0);
  const [ formBody, setFormBody ] = useState({
    title: "",
    category: "",
    project_type: "",
    size: "",
    message: "",
  });

  const [ file, setFile ] = useState([]);
  const [ current, setCurrent ] = useState(1);
  // query hooks
  // const {mutate:uploadFIle}=useUploadFile()
  // const {}

  useEffect(() => {
    setDimensions({ height: window.screen.height, width: window.screen.width });

    window.addEventListener("resize", () => {
      setDimensions({ height: window.screen.height, width: window.screen.width });
    })
    window.onkeydown = (event) => {
      if (event.keyCode == 9) {
        event.preventDefault();
      }
    };

  }, []);
  const createNew = async () => {
    try {
      setLoading(true);
      setError("");
      const formData = new FormData();

      Array.from(file).forEach((file) => {
        formData.append("file", file);
      });
      let data = {};
      const response = await createProject(formBody);

      if (response) {
        data = {
          projectId: response.data._id,
          accountId: response.data.account_id,
          formData,
          folder: "input",
        };

        const fileAddRes = await uploadFile(data, setFileUploadProgress);

        const files = fileAddRes.data;
        if (fileAddRes.status === 200) {
          const updateFile = await API.put(
            `/users/projects/all/addFiles?projectId=${data.projectId
            }&folder=${"input"}`,
            { files }
          );
          if (updateFile.status === 201) {
            router.push("/projects");
          }
        }
      }

      // const fileresponse = await API.post('/s3-upload/uploadFIle', formData, config);

      // const response = await API.post('/users/projects', formBody);
    } catch (err) {
      console.log(err.response);
      setError("Something went wrong, please try again later");
      setLoading(false);
    }
  };


  const scroll = (dir) => {
    // let scrollPixel = window.innerWidth > 1100 ? 1200 : 1000;
    let container = document.querySelector("#card-container");

    // checking browser is safari. Safari not support the smooth scorll behaviour
    var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window[ 'safari' ] || (typeof safari !== 'undefined' && window[ 'safari' ].pushNotification));
    if (isSafari) {
      container.style.scrollBehavior = "auto";
    }
    // container.style.overflow = "scroll";
    let scrollPixel = innerWidth - 400;

    switch (dir) {
      case "left":
        ref.current.scrollLeft -= scrollPixel;
        // ref.current.style.animation = "mynewmove 1s	";

        break;
      case "right":
        ref.current.scrollLeft += scrollPixel;
        // ref.current.style.animation = "mynewmove 1s	";
        break;
    }
    container.style.overflow = "hidden";

  };

  function handleFormData(e, value = null) {
    setFormBody((prev) => {
      return {
        ...prev,
        [ e?.target?.name ? e.target.name : e ]: e?.target?.value
          ? e.target.value
          : value,
      };
    });
  }

  return (
    <div className="flex relative bg-white overflow-x-hidden h-screen max-w-[100vw] min-h-[900px]" >
      {/* <ProgressBar progress={fileUploadProgress} /> */}
      <ProgressBarV2 progress={Math.round(fileUploadProgress / 320 * 100)} progressByNumber={true} message={"Uploading files.."} />
      <button onClick={() => router.back()}>
        <BsArrowLeftCircle className="absolute h-8 w-8 xl:h-10 xl:w-10 left-0 text-primary-white top-0 ml-2 mt-2 xl:ml-4 xl:mt-4 z-50 inline cursor-pointer" />
      </button>
      {/* bg */}
      <div
        className={`space-x-96  bg-primary-black w-full min-h-[200px] h-[30%]`}
        // style={{ height: dimensions.height / 2.75 }}
      ></div>
      <div
        className="inline-flex flex-col align-bottom space-y-20 items-center justify-end absolute left-0 bottom-0 w-full min-h-[400px] bg-primary-cyan h-[70%]"
        // style={{ height: dimensions.height / 1.5 }}
      >
        <div className="place-content-center mb-[8vh]">
          <p className="font-medium text-[1.8vw] font-sans text-center">
            &quot;All achievements, all earned riches, have their beginning in an idea&quot; <br />
            -Napoleon Hill
          </p>
        </div>
      </div>
      {/* cards */}
      <div
        ref={ref}
        className="absolute w-screen h-4/6 flex gap-8 px-[15vw] mt-[10vh] overflow-hidden snap-x card-scroll"
        id="card-container"
      >
        <Card1
          scroll={scroll}
          handleFormData={handleFormData}
          formBody={formBody}
          setCurrent={setCurrent}
          current={current}
        />
        <Card2
          scroll={scroll}
          handleFormData={handleFormData}
          formBody={formBody}
          setCurrent={setCurrent}
          current={current}
        />
        <Card3
          scroll={scroll}
          handleFormData={handleFormData}
          formBody={formBody}
          setCurrent={setCurrent}
          current={current}
        />
        <Card4
          scroll={scroll}
          handleFormData={handleFormData}
          formBody={formBody}
          setCurrent={setCurrent}
          current={current}
        />
        <Card5
          scroll={scroll}
          handleFormData={handleFormData}
          formBody={formBody}
          setCurrent={setCurrent}
          current={current}
        />
        <Card6
          scroll={scroll}
          createNew={createNew}
          file={file}
          setFile={setFile}
          loading={loading}
          error={error}
          setCurrent={setCurrent}
          current={current}
        />
      </div>
    </div>
  );
}

const Card1 = ({ scroll, handleFormData, formBody, setCurrent, current }) => {
  const [ validate, setValidate ] = useState(false);

  return (
    <div
      className={`project-card relative bg-white min-w-full shadow border flex flex-col p-5  xl:p-12 snap-center`}
    >
      <div className="flex justify-between">
        <img className="h-12 xl:h-16" src={Logo} />
        <p className="font-semibold text-2xl">1/6</p>
      </div>
      <div className="flex flex-col w-full h-full justify-center relative">
        <div className="relative border-b-4 flex flex-row border-black p-5">
          <input
            type="text"
            name="title"
            value={formBody?.title}
            className="text-xl md:text-3xl w-full font-semibold placeholder-[#C4C4C4] text-[#8A8A8A] focus:outline-none"
            placeholder="Type your project title"
            maxLength={45}
            onChange={(e) => {
              e.target.value.length >= 3
                ? setValidate(true)
                : setValidate(false);
              handleFormData(e);
            }}
            onKeyPress={(e) => {
              if (!validate) return;
              if (e.key === 'Enter') {
                scroll("right");
                setCurrent(2);
                document.activeElement.blur();
              }
            }}
          />
          {
            !formBody?.title > 0 && (
              <p className="absolute left-[360px] top-[15%] text-red self-start text-xl">*</p>
            )
          }
        </div>

        <div className="absolute bottom-0">
          <span className="text-red font-bold">*</span>
          <span className="text-[#C4C4C4]"> mandatory</span>
        </div>
      </div>
      {current == 1 ? (
        <div className="absolute bottom-5 right-10 flex gap-5 flex-row-reverse pt-10 float-right">
          <button
            onClick={() => {
              scroll("right");
              setCurrent(2);
            }}
            disabled={!validate}
          >
            <RiArrowRightSFill
              className={`h-10 w-10 ${!validate && "text-primary-gray"}`}
            />
          </button>
        </div>
      ) : (
        <div className="h-20"></div>
      )}
    </div>
  );
};
const Card2 = ({ scroll, handleFormData, formBody, setCurrent, current }) => {
  const [ selected, setSelected ] = useState(null);

  const handleSelect = (name) => {
    setSelected(name);
    handleFormData("project_type", name);
  };

  return (
    <div
      className={`relative bg-white min-w-full  shadow border flex flex-col p-10  snap-center`}>
      <div className="flex justify-between">
        <img className="h-12 xl:h-16" src={Logo} />
        <p className="font-semibold text-2xl">2/6</p>
      </div>
      {/* Content Start */}
      <div className="flex flex-col justify-center align-center w-full h-full">
        <div className="text-xl xl:text-3xl font-semibold my-2 xl:my-4 text-center">
          <p>Which category does your project belong? <span className="text-red">*</span></p>
        </div>
        <div className="flex flex-wrap gap-5 justify-center align-center items-center max-w-[750px] mx-auto">
          <span
            className={`${selected == "Print" ? "crt-prj-opt-slt-btn"
              : "crt-prj-opt-btn"
              }`}
            onClick={() => {
              handleSelect("Print");
            }}
          >
            <p className="uppercase text-sm xl:text-l">Print</p>
          </span>
          <span
            className={` ${selected == "Digital" ? "crt-prj-opt-slt-btn" : "crt-prj-opt-btn"
              }`}
            onClick={() => handleSelect("Digital")}
          >
            <p className="uppercase text-sm xl:text-l">Digital</p>
          </span>
          <span
            className={`${selected == "3D/CG" ? "crt-prj-opt-slt-btn" : "crt-prj-opt-btn"
              }`}
            onClick={() => handleSelect("3D/CG")}
          >
            <p className="uppercase text-sm xl:text-l">3D/CG</p>
          </span>
          <span
            className={`${selected == "Packaging" ? "crt-prj-opt-slt-btn" : "crt-prj-opt-btn"
              }`}
            onClick={() => handleSelect("Packaging")}
          >
            <p className="uppercase text-sm xl:text-l">Packaging</p>
          </span>
          <span
            className={`${selected == "Immersive" ? "crt-prj-opt-slt-btn" : "crt-prj-opt-btn"
              }`}
            onClick={() => handleSelect("Immersive")}
          >
            <p className="uppercase text-sm xl:text-l">Immersive</p>
          </span>
          <span
            className={`${selected == "Films" ? "crt-prj-opt-slt-btn" : "crt-prj-opt-btn"
              }`}
            onClick={() => handleSelect("Films")}
          >
            <p className="uppercase text-sm xl:text-l">Films</p>
          </span>
          <span
            className={`${selected == "Other" ? "crt-prj-opt-slt-btn" : "crt-prj-opt-btn"
              }`}
            onClick={() => handleSelect("Other")}
          >
            <p className="uppercase text-sm xl:text-l">Other</p>
          </span>
        </div>
      </div>
      {/* Content End */}
      {current == 2 ? (
        <div className="absolute bottom-5 right-10 flex gap-5 flex-row-reverse pt-10 float-right ">
          <button
            disabled={selected === null}
            onClick={() => {
              scroll("right");
              setCurrent(3);
            }}
          >
            <RiArrowRightSFill
              className={`h-10 w-10 ${selected === null && "text-primary-gray"
                }`}
            />
          </button>
          <button
            onClick={() => {
              scroll("left");
              setCurrent(1);
            }}
          >
            <RiArrowLeftSFill className="h-10 w-10" />
          </button>
        </div>
      ) : (
        <div className="h-20"></div>
      )}
    </div>
  );
};
const Card3 = ({ scroll, handleFormData, formBody, setCurrent, current }) => {
  const [ validate, setValidate ] = useState(false);
  const [ customDataEnterd, setCustomDataEnterd ] = useState(false);
  const designTypeFiles = {
    "Print": [
      "Poster",
      "Billboard",
      "Standee",
      "Brochure",
      "Merchandise"
    ],
    "Digital": [
      "Social Media Post",
      "E - commerce Banners",
      "E - commerce Listings",
      "Social Media Ad",
      "Web Banner"
    ],
    "3D/CG": [
      "3D Compositing",
      "3D Animation",
      "3D Rigging",
      "Modelling & texturing",
      "3D Architecture(Interior & Exterior)"
    ],
    "Packaging": [
      "Product Label/ Sticker",
      "Product Packet",
      "Packaging Box",
      "Corporate Gifting",
    ],
    "Immersive": [
      "AR Filter",
      "AR Packaging",
      "Web AR",
      "AR App",
      "VR"
    ],
    "Films": [
      "2D Animation",
      "Motion Graphics",
      "Stop Motion",
      "Film Editing",
      "Character Animation"
    ],
    "Other": []
  }
  return (
    <div
      className={`relative bg-white min-w-full shadow border flex flex-col p-5 xl:p-12 snap-center`}
    >
      <div className="flex justify-between">
        <img className="h-12 xl:h-16" src={Logo} />
        <p className="font-semibold text-2xl">3/6</p>
      </div>
      <div className="flex flex-col  justify-center align-center w-full h-full px-[5rem]">
        <div className="text-xl xl:text-3xl font-semibold my-2 xl:my-2 text-center">
          <p> What is your project type?<span className="text-red">*</span></p>
        </div>
        {!customDataEnterd && (
          <div className="pl-5 flex flex-wrap gap-5 justify-center align-center items-center xl:mb-3 rounded-[6px]">
            <select
              onChange={(e) => {
                setValidate(true);
                handleFormData(e);
              }}
              defaultValue=""
              name="category"
              className="slt-cstm-icn  w-[500px] select-none bg-[#FFD12A] hover:bg-secondry-yellow py-2 text-sm xl:text-xl px-10 items-center uppercase invalid:bg-white "
              style={{ borderRadius: "6px" }}
            >
              <option
                value=""
                className={`bg-white ${formBody.category == "" ? "text-primary-blue" : "text-black"
                  }`}
                disabled
                hidden
              >
                Select a Type
              </option>
              {
                designTypeFiles[ formBody.project_type ]?.map((value, index) => {
                  return (
                    <option
                      key={index}
                      className={`bg-white  ${formBody.category == value
                        ? "text-primary-blue"
                        : "text-black"
                        }`}
                    >
                      {value}
                    </option>
                  )
                })
              }
            </select>
          </div>
        )}
        <div className="border-b-4 w-full flex justify-center border-black p-5">
          <input
            type="text"
            onChange={(e) => {
              if (!e.target.value) {
                setCustomDataEnterd(false);
              } else {
                setCustomDataEnterd(true);
              }
              e.target.value.length > 1 && setValidate(true);
              handleFormData(e);
            }}
            onKeyPress={(e) => {
              if (!validate) return;
              if (e.key === 'Enter') {
                scroll("right");
                setCurrent(4);
                document.activeElement.blur();
              }
            }}
            name="category"
            className="text-xl w-full text-center xl:text-3xl font-semibold text-[#8A8A8A] placeholder-[#C4C4C4] focus:outline-none"
            placeholder="Enter your project type"
          />
        </div>
      </div>
      {current == 3 ? (
        <div className="absolute bottom-5 right-10 flex gap-5 flex-row-reverse pt-3 float-right ">
          <button
            disabled={!validate}
            onClick={() => {
              scroll("right");
              setCurrent(4);
            }}
          >
            <RiArrowRightSFill
              className={`h-10 w-10 ${!validate && "text-primary-gray"}`}
            />
          </button>
          <span
            onClick={() => {
              scroll("left");
              setCurrent(2);
            }}
          >
            <RiArrowLeftSFill className="h-10 w-10" />
          </span>
        </div>
      ) : (
        <div className="h-20"></div>
      )}
    </div>
  );
};
const Card4 = ({ scroll, handleFormData, formBody, setCurrent, current }) => {
  const [ selected, setSelected ] = useState([ "A4" ]);
  const [ validate, setValidate ] = useState(false);
  const [ customeSize, setCustomSize ] = useState("");

  function handleSizeSelect(name) {
    // adding customer size value to array
    if (name?.target) {
      setSelected((prev) => {
        const filterData = prev.filter((data) => data !== customeSize);

        if (!name.target.value) {
          return filterData;
        }
        return [ ...filterData, name.target.value ];
      });
      return;
    }

    // adding div values to array
    if (selected.includes(name)) {
      setSelected((prev) => {
        const newSelectedData = prev.filter((data) => data !== name);
        return newSelectedData;
      });
    } else {
      setSelected((prev) => {
        return [ ...prev, name ];
      });
    }
  }

  async function handleScrollRight() {
    const filterData = selected.filter((item) => item !== customeSize);
    setSelected(filterData);
    handleSizeSelect(customeSize);
    handleFormData("size", selected);
    scroll("right");
    setCurrent(5);
  }

  useEffect(() => {
    setValidate(selected.length == 0 ? false : true);
  }, [ selected ]);

  return (
    <div
      className={`relative bg-white min-w-full shadow border flex flex-col p-5 xl:p-12 snap-center`}
    >
      <div className="flex justify-between">
        <img className="h-12 xl:h-16" src={Logo} />
        <p className="font-semibold text-2xl">4/6</p>
      </div>
      {/* Content Start */}

      <div className="flex flex-col justify-center align-center h-full px-[5rem] w-fit m-auto gap-[10px]">
        <div className="text-xl xl:text-3xl font-semibold my-3 md:my-1 xl:my-3 text-center">
          <p>Size of your creative?<span className="text-red">*</span></p>
        </div>
        <div className="flex w-full flex-wrap md:gap-1 xl:gap-2 justify-center align-center items-center">
          <span
            className={`w-24 xl:w-36 2xl:w-40 flex justify-center text-sm px-7 py-2 border border-black rounded-md cursor-pointer ${selected.some((i) => i == "A4")
              ? "border-primary-yellow bg-[#FFD12A] "
              : "bg-white"
              }`}
            onClick={() => handleSizeSelect("A4")}
          >
            <p className="uppercase text-sm xl:text-l font-semibold">A4</p>
          </span>
          <span
            className={`w-24 xl:w-36 2xl:w-40 flex justify-center text-sm px-7 py-2 border border-black rounded-md cursor-pointer ${selected.some((i) => i == "A0")
              ? "border-primary-yellow bg-[#FFD12A] "
              : "bg-white"
              }`}
            onClick={() => handleSizeSelect("A0")}
          >
            <p className="uppercase text-sm xl:text-l font-semibold">A3</p>
          </span>

          <span
            className={`w-24 xl:w-36 2xl:w-40 flex justify-center text-sm px-5 py-2 border border-black rounded-md cursor-pointer ${selected.some((i) => i == "Ipad screen")
              ? "border-primary-yellow bg-[#FFD12A] "
              : "bg-white"
              }`}
            onClick={() => handleSizeSelect("Ipad screen")}
          >
            <p className="uppercase text-sm xl:text-l font-semibold">16 : 9</p>
          </span>
          <span
            className={`w-24 xl:w-36 2xl:w-40 flex justify-center text-sm px-7 py-2 border border-black rounded-md cursor-pointer ${selected.some((i) => i == "Desktop")
              ? "border-primary-yellow bg-[#FFD12A] "
              : "bg-white"
              }`}
            onClick={() => handleSizeSelect("Desktop")}
          >
            <p className="uppercase text-sm xl:text-l font-semibold">1 : 1</p>
          </span>
        </div>
        <div className="w-full border-b-4 flex justify-center mt-8 border-black ">
          <input
            type="text"
            value={customeSize}
            onChange={(e) => {
              setCustomSize(e.target.value);
              handleSizeSelect(e);
              setValidate(e.target.value.length == 0 ? false : true);
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleScrollRight()
                document.activeElement.blur();
              }
            }}
            className="text-xl w-full xl:text-3xl pb-3 text-center font-semibold text-[#8A8A8A] placeholder-[#C4C4C4] focus:outline-none placeholder:text-[1.7vw]"
            placeholder="Type your custom size here."
          />
        </div>
      </div>
      {/* Content End */}
      {current == 4 ? (
        <div className="absolute bottom-5 right-10 flex gap-5 flex-row-reverse pt-3 xl:pt-10 float-right ">
          <button disabled={!validate} onClick={handleScrollRight}>
            <RiArrowRightSFill
              className={`h-10 w-10 ${!validate && "text-primary-gray"}`}
            />
          </button>
          <button
            onClick={() => {
              scroll("left");
              setCurrent(3);
            }}
          >
            <RiArrowLeftSFill className="h-10 w-10" />
          </button>
        </div>
      ) : (
        <div className="h-20"></div>
      )}
    </div>
  );
};
const Card5 = ({ scroll, handleFormData, formBody, setCurrent, current }) => {
  const [ validate, setValidate ] = useState(false);

  return (
    <div
      className={`relative bg-white min-w-full shadow border flex flex-col p-5 xl:p-12 snap-center`}
    >
      <div className="flex justify-between">
        <img className="h-12 xl:h-16" src={Logo} />
        <p className="font-semibold text-2xl">5/6</p>
      </div>
      {/* Content Start */}

      <div className="flex flex-col xl:max-w-[900px] w-[90%] mx-auto  justify-center align-center h-full">
        <div className="text-xl xl:text-3xl font-semibold md:my-5 xl:my-2 text-left">
          <p>
          Are there any more details you wish to provide for your project ? <span className="text-red">*</span>
          </p>
        </div>

        <div className="border-b-4 flex justify-center border-black py-0 pb-1 xl:mt-4 w-full">
          <textarea
            type="text"
            rows="2"
            name="message"
            onChange={(e) => {
              setValidate(e.target.value.length == 0 ? false : true);
              handleFormData(e);
            }}

            onKeyPress={(e) => {
              // if (!validate) return;
              // if (e.key === 'Enter') {
              //   scroll("right");
              //   setCurrent(6);
              //   document.activeElement.blur();
              // }
            }}
            className="text-xl xl:text-2xl w-full font-semibold text-[#8A8A8A] placeholder-[#C4C4C4] focus:outline-none resize-none"
            placeholder="Please share details about brand, competitors, target audience etc."
          />
        </div>
      </div>
      {/* Content End */}
      {current == 5 ? (
        <div className="absolute bottom-5 right-10 flex gap-5 flex-row-reverse pt-10 float-right ">
          <button
            disabled={!validate}
            onClick={() => {
              scroll("right");
              setCurrent(6);
            }}
          >
            <RiArrowRightSFill
              className={`h-10 w-10 ${!validate && "text-primary-gray"}`}
            />
          </button>
          <button
            onClick={() => {
              scroll("left");
              setCurrent(4);
            }}
          >
            <RiArrowLeftSFill className="h-10 w-10" />
          </button>
        </div>
      ) : (
        <div className="h-20"></div>
      )}
    </div>
  );
};
const Card6 = ({
  scroll,
  createNew,
  file,
  setFile,
  loading,
  error,
  setCurrent,
  current,
}) => {
  const formRef = useRef(null);

  async function handleFileChange(event) {
    if (!event.target.files?.length) {
      return;
    }
    setFile(prev => [ ...prev, ...Array.from(event.target.files) ]);
  }
  async function handleRemove(index) {
    let files = file.filter((item, ind) => index != ind);
    setFile(files)
  }
  const files = Object.values(file);
  return (
    <div
      className={`relative bg-white min-w-full border flex flex-col justify-start p-10 xl:p-12 snap-center`}
    >
      {/* <div className="absolute self-center"></div> */}
      <div className="flex justify-between">
        <img className="h-12 xl:h-16" src={Logo} />
        <p className="font-semibold text-2xl">6/6</p>
      </div>
      {/* Content Start */}
      <LoaderRipple show={loading} />
      <div className="flex flex-col justify-center gap-[10px] h-full align-center w-full">
        <div className="text-xl xl:text-3xl font-semibold my-2 xl:my-3 text-center">
          <p>Any Documents or Images you have for us?</p>
        </div>

        <div className="flex justify-center px-28">
          <form ref={formRef} className="w-full">
            <label className="flex items-center justify-between px-4 py-2 bg-white text-blue rounded-sm shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:text-primary-gray self-center gap-2">
              <span className="mt-2  text-center leading-normal text-primary-black font-semibold">
                CLICK TO UPLOAD FROM YOUR DEVICE
              </span>
              <FiPaperclip className="h-8 w-8 font-extralight text-primary-black" />
              <input
                multiple={true}
                type="file"
                name="file"
                style={{ display: "none" }}
                onChange={(e) => handleFileChange(e)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    scroll("right");
                    setCurrent(6);
                    document.activeElement.blur();
                  }
                }}
              />
            </label>
          </form>
        </div>
        <div className="flex flex-wrap gap-2 justify-center mt-2 xl:mt-5">
          {files.map((key, index) => {
            return (
              <span
                key={index}
                className="rounded-xl text-xs bg-primary-cyan max-w-max p-1 flex items-center gap-2"
              >
                <span>
                  &#9679;&nbsp;
                </span>
                <span>
                  {key.name}
                </span>
                <span className="cursor-pointer" onClick={() => {
                  handleRemove(index);
                }}>
                  <BiTrash className="text-[red] h-[15px] w-[15px]" />
                </span>
              </span>
            );
          })}
        </div>
        <div className="flex flex-col items-center justify-center mt-3 xl:mt-6 hover:-translate-y-1 transition-transform delay-75">
          <button
            onClick={createNew}
            className={`max-w-xs px-7 py-2 border rounded-md cursor-pointer
								border-[#FFD12A] bg-[#FFD12A]
							}`}
          >
            <p className="uppercase text-center font-semibold">
              Start my Project
            </p>
          </button>
          {error != "" && <p className="text-red-600 mt-3">{error}</p>}
        </div>
      </div>
      {/* Content End */}
      {current == 6 ? (
        <div className="absolute bottom-5 right-10 flex flex-row-reverse pt-10 float-right cursor-pointer ">
          <span
            onClick={() => {
              scroll("left");
              setCurrent(5);
            }}
          >
            <RiArrowLeftSFill className="h-10 w-10" />
          </span>
        </div>
      ) : (
        <div className="h-20"></div>
      )}
    </div>
  );
};

export default Create;

Create.getLayout = function NullLayout({ children }) {
  const protectRoute = useProtectRouteAuth();

  return children;
};