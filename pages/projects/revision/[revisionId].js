import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import rivisionService from "../../../services/rivision";
import Loader from "../../../components/layouts/Loader";
import { useAuth } from "../../../hooks/useAuth";
import { useProtectRouteAuth } from "../../../hooks/useRequireAuth";
import RevisionActionButtons from "../../../components/user/revision/RevisionActionButtons";
import getFileExtension from "../../../lib/FileHelper";
import { useLibraries } from "../../../hooks/useLibraries";
import { ZoomInIcon, ZoomOutIcon } from "../../../helpers/svgHelper";
import axios from "axios";
import ButtonLoader from "../../../components/common/ButtonLoader";
import toast from "react-hot-toast";
import ProgressBarV2 from "../../../components/common/ProgressBarV2";
import RevisionMarks from "../../../components/user/revision/RevisionMarks";
import RevisionAddResourceScreen from "../../../components/project_manager/projects/RevisionAddResourceScreen";
import projects from "../../../models/projects";
import SkillModel from "../../../models/skills";
import { useMemo } from "react";

let imgOrigWidth = null;
let videoClearInterval = null;

function RivisionTemplate({ skills }) {
  const router = useRouter();
  const { revisionId, show_marks } = router.query;
  const imgDivRef = useRef(null);
  const { user, role } = useAuth();
  const [updatedDate, setUpdatedDate] = useState(null);
  const [showMarks, setShowMarks] = useState(show_marks);
  const [commentAdded, setCommentAdded] = useState(false);
  const [viewJSX, setviewJSX] = useState();
  const [markers, setMarkers] = useState([]);
  const [showInputModal, setShowInputModal] = useState(false);
  const [positions, setPositions] = useState(null);
  const imgContRef = useRef(null);
  const revisionImgRef = useRef(null);
  const [zoom, setZoom] = useState(0);
  const [zoomMethod, setZoomMethod] = useState("none");
  const [fileExt, setFileExt] = useState("");
  const [vidCurrTime, setVidCurrTime] = useState(0);
  const [fileUrl, setFileUrl] = useState(null);
  const [fileLoading, setFileLoading] = useState(false);
  const [fileLoadingProgress, setFileLoadingProgress] = useState(0);
  const [newMarkAdded, setNewMarkAdded] = useState(false);
  const [inputItem, setInputItem] = useState("");
  const [newMarkAddedLoading, setNewMarkAddedLoading] = useState(false);
  const [localMarks, setLocalMarks] = useState([]);
  const [showAddResourceScreen, setShowAddResourceScreen] = useState(false);

  const { data: rivisionResponse, isLoading } = useQuery(["rivision-details", updatedDate, revisionId], () => rivisionService.getRivisionByRivisionId(revisionId),
    {
      enabled: !!revisionId,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  const saveCommentLocally = () => {
    if (!positions?.x || !positions?.y || !inputItem) return;
    setLocalMarks(prev => {
      return [
        ...prev,
        {
          comment_text: inputItem,
          comment_user_id: user._id,
          position_x: positions.x,
          position_y: positions.y,
          time: new Date().toISOString(),
          video_mark_time: positions.time || 0,
          _id: new Date().getTime()
        }
      ]
    })
    setPositions({});
    setInputItem("");
    setShowInputModal(false);
  }

  const handleCommentOnImage = (event) => {
    if (!showMarks && zoomMethod !== "none") return;
    // if (showInputModal) return;
    if (event.target.id !== "revision-image") return;
    const status = rivisionResponse.data?.rivision_status;
    // file extension limit
    const ext = getFileExtension(rivisionResponse?.data?.rivision_file);
    if (ext != "jpg" && ext != "jpeg" && ext != "png" && ext != "gif" && ext != "svg" && ext != "webp") return;
    // role check
    if (role !== "client_admin" && role !== "client_member" && role !== "project_manager") return;
    // status check
    if (status === "completed") return;
    if (role === "project_manager" && status == "u_approval") return;

    setShowMarks(true);
    saveCommentLocally();

    const x = event.clientX;
    const y = event.clientY;
    const rec = event.target.getBoundingClientRect();
    const clientHeight = event.target.clientHeight;
    const clientWidth = event.target.clientWidth;
    const postX = x - rec.x;
    const postY = y - rec.y;
    const percX = (postX / clientWidth) * 100;
    const percY = (postY / clientHeight) * 100;
    setPositions({ x: percX, y: percY });
    setShowInputModal(true);
    setNewMarkAdded(true);
  }
  const handleCommentOnVideo = (event) => {
    if (!showMarks && zoomMethod !== "none") return;
    // if (showInputModal) return;
    if (event.target.id !== "revision-video") return;
    if (event.target.currentTime == 0) return;
    event.preventDefault();

    const status = rivisionResponse.data?.rivision_status;
    const ext = getFileExtension(rivisionResponse?.data?.rivision_file);
    if (ext != "mp4" && ext != "mkv" && ext != "3gp" && ext != "mov") return;
    // role check
    if (role !== "client_admin" && role !== "client_member" && role !== "project_manager") return;
    // status check
    if (status === "completed") return;
    if (role === "project_manager") {
      if (status == "u_approval" || status == "client_rejected") {
        return;
      }
    }

    saveCommentLocally();

    setShowMarks(true);
    event.target.pause();
    // time
    const currentTime = event.target?.currentTime;
    // positions
    const x = event.clientX;
    const y = event.clientY;
    const rec = event.target.getBoundingClientRect();
    const clientHeight = event.target.clientHeight;
    const clientWidth = event.target.clientWidth;
    const postX = x - rec.x;
    const postY = y - rec.y;
    const percX = (postX / clientWidth) * 100;
    const percY = (postY / clientHeight) * 100;
    setPositions({ x: percX, y: percY, time: currentTime });
    setShowInputModal(true);
    setNewMarkAdded(true);
  }
  const handleRemoveComment = async (comment_id) => {
    try {
      await rivisionService.deleteCommentService(comment_id, revisionId);
      setUpdatedDate(Date.now());
    } catch (e) {
      console.log(e.response || e.message);
    }
  }
  const handleZoomSlideChange = (e = {}) => {
    if (showMarks) return;
    let zoomValue = e?.target?.value || zoom;

    // setZoom(zoomValue);
    if (!imgContRef.current || !revisionImgRef.current) {
      return;
    }
    if (zoomValue == "0") {
      imgContRef.current.style.width = "fit-content";
      imgContRef.current.style.maxHeight = "100%";
      return;
    }
    if (!imgOrigWidth) {

      imgOrigWidth = revisionImgRef.current.clientWidth;
    }
    imgContRef.current.style.width = `${parseInt(imgOrigWidth) + parseInt(zoomValue)}px`;
    imgContRef.current.style.maxHeight = "none";
  }
  const handleZoom = () => {
    if (zoomMethod === "zoomIn") {
      if (zoom < 500) {
        setZoom(prev => prev += 100);
      }
    }
    else if (zoomMethod === "zoomOut") {
      if (zoom > 0) {
        setZoom(prev => prev -= 100);
      }
    }
  }
  const handleFileUrl = async (url) => {
    try {
      setFileLoading(true);
      const response = await axios.get(url, {
        responseType: "blob",
        onDownloadProgress: (event) => {
          setFileLoadingProgress(Math.round((event.loaded / rivisionResponse.data?.file_size) * 100));
        }
      });
      setFileUrl(URL.createObjectURL(response.data));
      setFileLoading(false);
    } catch (e) {
      setFileLoading(false);
      console.log(e.response);
    }
  }

  const handleCurrentTimePositioning = (event) => {
    let currentTime = event.target.currentTime;
    setVidCurrTime(parseInt(currentTime));
  }

  const handleSaveChanges = async () => {
    if (!inputItem) return setShowModal(false);
    try {
      if (!positions.x || !positions.y) return;
      setNewMarkAddedLoading(true);
      let params = { rivision_id: revisionId };
      if (localMarks.length < 1) {
        params.comments = {
          comment_user_id: user._id,
          comment_text: inputItem,
          position_x: positions.x,
          position_y: positions.y,
          video_mark_time: positions.time
        }
      } else {
        params.comments = localMarks.map(mark => {
          return {
            comment_user_id: user._id,
            comment_text: mark.comment_text,
            position_x: mark.position_x,
            position_y: mark.position_y,
            video_mark_time: mark.video_mark_time
          }
        })
        if (inputItem) {
          params.comments.push({
            comment_user_id: user._id,
            comment_text: inputItem,
            position_x: positions.x,
            position_y: positions.y,
            video_mark_time: positions.time
          })
        }
      }
      await rivisionService.addCommentInRivision(params);
      setNewMarkAddedLoading(false);
      setUpdatedDate(Date.now());
      setInputItem("");
      setPositions({});
      setShowInputModal(false);
      setNewMarkAdded(false);
      setLocalMarks([]);
    } catch (e) {
      setNewMarkAddedLoading(false);
      console.log(e.response || e);
    }
  }

  const { pusher } = useLibraries();
  useEffect(() => {
    if (!rivisionResponse?.data?.project_id) {
      return;
    }
    if (!pusher) {
      return;
    }
    const projectChannel = pusher.subscribe(
      rivisionResponse?.data?.project_id?.toString()
    );
    projectChannel.bind("project-update", (data) => {
      setUpdatedDate(Date.now());
    });
  }, [rivisionResponse, pusher]);
  useEffect(() => {
    if (!rivisionResponse) return;
    function viewHandler() {
      const ext = getFileExtension(rivisionResponse?.data?.rivision_file);
      setFileExt(ext);
      if (
        ext == "jpg" ||
        ext == "jpeg" ||
        ext == "png" ||
        ext == "gif" ||
        ext == "svg" ||
        ext == "webp"
      ) {
        return;
      }

      if (ext == "mp4" || ext == "mkv" || ext == "3gp" || ext == "mov") {
        return;
      }

      setviewJSX(<h1>No preview Available! <a href={`/api/s3-upload/view/?key=${rivisionResponse?.data?.rivision_file}`} className="bg-red text-white p-2 rounded-lg">Click here to download</a></h1>);
    }
    viewHandler();
  }, [rivisionResponse, revisionId, showMarks]);
  useEffect(() => {
    handleZoomSlideChange();
  }, [zoom]);
  useEffect(() => {
    if (!rivisionResponse?.data) return;
    if (fileUrl) return;
    handleFileUrl(`/api/s3-upload/view/?key=${rivisionResponse?.data?.rivision_file}`);
  }, [rivisionResponse?.data, fileUrl])
  // cleanup useffect 
  useEffect(() => {
    return () => {
      setFileUrl(null);
      setFileLoading(true);
    }
  }, [])

  if (isLoading && !updatedDate) {
    return <Loader />;
  }
  return (
    <>
      {/* {
        fileLoading && <ProgressBarV2 progress={fileLoadingProgress} />
      } */}
      <RevisionAddResourceScreen showModal={showAddResourceScreen} setShowModal={setShowAddResourceScreen} skills={skills} projectId={rivisionResponse?.data?.project_id} />
      <div className="p-16 h-screen w-screen relative">
        <div className="flex gap-4 top-[1rem] min-w-full px-16 absolute left-0 right-">
          <div className={"flex-1"}>
            <div className="text-2xl z-30 text-primary-text font-medium w-full">
              {
                (role == "client_admin" || role == "client_member") ? rivisionResponse?.data.title?.split(" ")[0] +
                  " " +
                  parseInt(rivisionResponse?.data.title?.split(" ")[1]) : rivisionResponse?.data.title
              }
            </div>
          </div>

          <div className="col-span-4 xl:col-span-2">
            <Link
              href={`/projects/${rivisionResponse?.data?.project_id}?tab=REVIEW`}
              passHref>
              <button className="w-[200px] ml-auto font-medium flex flex-col text-white rounded-md bg-[#C4C4C4]  justify-center items-center transition-colors duration-150 p-2  cursor-pointer z-50">
                Back to files
              </button>
            </Link>
          </div>
          {/* <div className="col-span-2"> */}
          {/* save button */}

          {(localMarks.length > 0 || newMarkAdded) && (
            <div className="col-span-2">
              <button
                className="w-[200px] ml-auto self-center font-medium flex flex-col text-primary-black rounded-md bg-light-yellow  justify-center items-center transition-colors duration-150 hover:bg-secondry-yellow p-2  cursor-pointer z-10 border-0"
                onClick={handleSaveChanges}
                disabled={newMarkAddedLoading}
              >
                {
                  newMarkAddedLoading ?
                    <ButtonLoader />
                    :
                    "Save Changes"
                }
              </button>
            </div>
          )}
          {/* </div> */}
        </div>

        {/* action buttons */}
        <div className="h-16 flex items-center absolute left-0 bottom-0 w-full">

          <div className=" ml-[65px] flex items-center select-none cursor-pointer gap-5">
            <div>
              {
                showMarks ?
                  <ZoomInIcon title="disable mark to zoom" onClick={() => {
                    toast("Please hide comments and click zoom button")
                  }} />
                  :
                  (zoomMethod == "zoomIn") ?
                    <ZoomOutIcon onClick={() => {
                      setZoomMethod("zoomOut");
                    }} />
                    :
                    (zoomMethod == "zoomOut" || zoomMethod == "none") &&
                    <ZoomInIcon onClick={() => {
                      setZoomMethod("zoomIn");
                    }} />
              }
            </div>

            {showMarks ? (

              <svg viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#8A8A8A]"
                onClick={() => {
                  setShowMarks(false);
                }}>
                <path d="M16.2891 14.3264L15.4545 13.4918L11.6527 9.69L9.27273 7.31L3.67818 1.71545L1.96273 0L0 1.96273L3.10636 5.06909L3.09091 31.3264L9.27273 25.1445H23.1818L32.0373 34L34 32.0373L27.1073 25.1445L16.2891 14.3264ZM12.3636 18.9627H9.27273V15.8718H12.3636V18.9627ZM9.27273 14.3264V11.2355L12.3636 14.3264H9.27273ZM30.9091 0.417273H6.30545L15.4545 9.56636V6.59909H27.8182V9.69H15.5782L17.1236 11.2355H27.8182V14.3264H20.2145L31.0173 25.1291C32.6709 25.0673 34 23.7227 34 22.0536V3.50818C34 1.80818 32.6091 0.417273 30.9091 0.417273Z" fill="#8A8A8A" />
              </svg>
            ) : (
              <svg viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#8A8A8A]"
                onClick={() => {
                  setZoomMethod("none");
                  setShowMarks(true);
                }}>
                <path d="M28.3333 2.83398H5.66668C4.10834 2.83398 2.84751 4.10898 2.84751 5.66732L2.83334 31.1673L8.50001 25.5007H28.3333C29.8917 25.5007 31.1667 24.2257 31.1667 22.6673V5.66732C31.1667 4.10898 29.8917 2.83398 28.3333 2.83398ZM25.5 19.834H8.50001V17.0007H25.5V19.834ZM25.5 15.584H8.50001V12.7507H25.5V15.584ZM25.5 11.334H8.50001V8.50065H25.5V11.334Z" fill="#8A8A8A" />
              </svg>
            )}
          </div>
          <div>
            <span className="text-[#8A8A8A]">
              {
                showMarks ?
                  <>&nbsp;&nbsp;Comments off</>
                  :
                  <>&nbsp;&nbsp;Double click to share feedback.</>
              }
            </span>
          </div>
          <div className="mr-16 flex items-center flex-1 justify-end">
            {/* every actions button includes in this component */}
            <RevisionActionButtons
              revision={rivisionResponse?.data}
              setUpdatedDate={setUpdatedDate}
              commentAdded={commentAdded}
              setShowAddResourceScreen={setShowAddResourceScreen}
              showAddResourceScreen={showAddResourceScreen}
              project={rivisionResponse?.data?.project}
            />
          </div>
        </div>
        {/* image and marker */}
        <div className="h-full  w-full" id="main-container">
          <div
            className=" w-full flex-1 flex-col flex max-h-full relative bg-[#F8F8FF] h-full select-none overflow-auto"
            ref={imgDivRef}
            id="img-div-ref"
          // onDoubleClick={markOnImageHandler}
          >

            {/* new marker check */}
            <div className={`${zoomMethod == "zoomIn" ? "cursor-zoom-in" : zoomMethod == "zoomOut" && "cursor-zoom-out"} w-fit h-fit max-h-full inline-block m-auto relative`} onDoubleClick={handleCommentOnImage} ref={imgContRef} onClick={handleZoom} title={
              zoomMethod == "zoomIn" ?
                "Click to zoom"
                :
                zoomMethod === "zoomOut" ?
                  "Click to zoomout"
                  :
                  commentAdded ?
                    "Double click to comment"
                    :
                    ""
            }>
              {/* revision file */}
              {(
                fileLoading
              ) ?
                <ProgressBarV2 progress={fileLoadingProgress} />
                :
                viewJSX ? (
                  viewJSX
                ) :
                  (
                    fileExt == "jpg" || fileExt == "jpeg" || fileExt == "png" || fileExt == "gif" || fileExt == "svg" || fileExt == "webp"
                  ) ?
                    < img src={
                      fileUrl
                    }
                      ref={revisionImgRef}
                      id="revision-image"
                      alt="" className="w-full max-h-full" />
                    :
                    (
                      fileExt == "mp4" || fileExt == "mkv" || fileExt == "3gp" || fileExt == "mov"
                    ) &&
                    < video controls id="revision-video" autoPlay={true} className="w-full h-full" onClick={handleZoom} controlsList="nodownload nofullscreen" onDoubleClick={handleCommentOnVideo} onTimeUpdate={handleCurrentTimePositioning} ref={revisionImgRef}>
                      <source src={fileUrl} type="video/mp4"></source>
                    </video>
              }

              {/* markers */}
              <RevisionMarks
                fileExt={fileExt}
                showMarks={showMarks}
                vidCurrTime={vidCurrTime}
                localComments={localMarks}
                savedComments={rivisionResponse?.data?.comments}
                handleRemoveComment={handleRemoveComment}
                setLocalComments={setLocalMarks}
              />

              {/* comment input field */}
              {
                showInputModal &&
                <MarkTextDom showModal={showInputModal} setShowModal={setShowInputModal}
                  setMarkers={setMarkers}
                  markers={markers}
                  position={positions}
                  setPosition={setPositions}
                  setUpdatedDate={setUpdatedDate}
                  positions={positions}
                  inputItem={inputItem}
                  setInputItem={setInputItem}
                  setNewMarkAdded={setNewMarkAdded}
                />
              }
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RivisionTemplate;

const MarkTextDom = ({ setShowModal, position, setPosition, inputItem, setInputItem, setUpdatedDate, positions, setNewMarkAdded }) => {
  const inputRef = useRef(null);
  const { role } = useAuth();
  const bgColor = useMemo(() => {
    if (role === "client_admin" || role === "client_member") return "bg-white";
    if (role === "project_manager") return "bg-[#FFE147]";
  }, [role])
  const positionClass = useMemo(() => {
    if (positions.y <= 7) {
      return role == "project_manager" ? "marker-class-top-yellow" : "marker-class-top";
    } else {
      return role == "project_manager" ? "marker-class-yellow" : "marker-class";
    }
  }, [positions])

  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.focus();
  }, [])

  return (
    <div style={{ left: `${positions.x}%`, top: `${positions.y}%` }}
      className={`${positionClass} absolute ${bgColor} border-[1px] border-black px-2 text-sm py-2 lg:pl-2 lg:pr-5 lg:py-3 `}>
      <div className="relative max-w-[200px] min-w-[150px]">
        <input type="text" onChange={e => {
          setInputItem(e.target.value);
        }} value={inputItem} className={`${bgColor} px-1 py-1 w-full outline-none`} placeholder='text your comment' ref={inputRef} />
      </div>
      <span onClick={() => {
        setShowModal(false);
        setNewMarkAdded(false);
      }} className="absolute bottom-[-10px] right-[-10px] bg-red px-2 py-1 rounded-[50%] text-white font-bold cursor-pointer">
        X
      </span>
    </div>
  );
};

RivisionTemplate.getLayout = function NullLayout({ children }) {
  const protectRoute = useProtectRouteAuth();
  return children;
};


export async function getServerSideProps(context) {

  try {
    const { projectId } = context.query
    const projectRes = await projects.findOne({ _id: projectId })
    const skills = await SkillModel.find({});


    return {
      props: {
        PUSHER_APP_KEY: process.env.PUSHER_APP_KEY,
        PUSHER_CLUSTER: process.env.PUSHER_CLUSTER,
        skills: JSON.stringify(skills),
        project: JSON.stringify(projectRes)
      }
    }
  } catch (e) {
    return {
      props: {
        PUSHER_APP_KEY: process.env.PUSHER_APP_KEY,
        PUSHER_CLUSTER: process.env.PUSHER_CLUSTER,
        skills: [],
        project: []
      }
    }
  }
}