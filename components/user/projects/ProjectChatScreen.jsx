import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";
import utils from "../../../helpers/utils";
import toast from "react-hot-toast";
import { useAuth } from "../../../hooks/useAuth";
import ChatVoiceRecorder from "./ChatVoiceRecorder";
import { MdOutlineNotificationsActive } from "react-icons/md";
import { uploadFile } from "../../../hooks/queryHooks/useFile";
import Loader from "../../layouts/Loader";
import {
  editProjectDetails,
  listTeamPrakriaService,
} from "../../../services/project";
import {
  sendChatMessage,
  getAllChats,
  chatSceneService,
} from "../../../services/chat";
import ButtonLoader from "../../common/ButtonLoader";
import ProjectBreif from "./ProjectBreif";
import { useQuery } from "react-query";
import moment from "moment";
import { useLibraries } from "../../../hooks/useLibraries";
import { MdClose } from "react-icons/md";
import { HiOutlinePencil } from "react-icons/hi";
import { BsTrash, BsCheck2 } from "react-icons/bs";
import { BsChevronRight } from "react-icons/bs";
import { useNotifications } from "../../../hooks/useNotifications";
import NotificationModal from "../../common/NotificationModal";
import { useRouter } from "next/router";

const project_code = "_project";

function ProjectChatScreen({ tabLink, projectId, project, setUpdatedTime }) {
  const [chatText, setChatText] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatSending, setChatSending] = useState(false);
  const { unreadLength } = useNotifications();
  const [showNotification, setShowNotification] = useState(false);
  const { role = "", user, subscription } = useAuth();
  const [page, setPage] = useState(1);
  const [chatDate, setChatDate] = useState(null);


  // const [audioUrl, setAudioUrl] = useState(null);
  const [voiceFile, setVoiceFile] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const [isEstimateTimeEditing, setIsEstimateTimeEditing] = useState(false);
  const [estimateTime, setEstimateTime] = useState(
    utils.projectExpectedTimeDateFormate(new Date(project?.estimate_date))
  );
  const {
    data: teamPrakria,
    isLoading: teamPrakriaLoading,
    isFetching: teamPrakriaFetching,
  } = useQuery(
    ["list-team-prakria"],
    () => {
      return listTeamPrakriaService(project?._id);
    },
    {
      enabled: !!project?._id,
      select: (response) => response.data,
    }
  );
  const router = useRouter();
  const chatDivRef = useRef();
  const { pusher, pusherSocketId } = useLibraries();
  const [socketId, setSocketId] = useState(pusherSocketId);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setSocketId(pusherSocketId);
  }, [pusherSocketId])

  // getting chats
  useEffect(() => {
    getAllChat();
  }, [page]);


  const getAllChat = async () => {
    try {
      setChatLoading(true);
      const response = await getAllChats(projectId, project_code, page);
      setChatLoading(false);

      // chat scene
      chatSceneHandler();

      let messages = [...chatMessages, ...response.data.chats];
      // setChatMessages(prev=>[...prev, ...response.data.chats]);
      setChatMessages(messages);
      setHasMore(messages.length < response.data.total);

      // const chatDiv = document.getElementById("chat-board");
      // if (!chatDiv) return;
      // chatDiv.scrollTop = chatDiv.scrollHeight;
    } catch (e) {
      setChatLoading(false);
    }
  }

  const chatSceneHandler = async () => {
    try {
      const chatSceneResponse = await chatSceneService({
        project_id: projectId,
        chat_code: project_code,
      });
    } catch (e) {
    }
  }

  useEffect(() => {
    const modal = document.getElementById("notification-modal-body");
    modal?.addEventListener("click", e => {
      setShowNotification(false);
    })
  }, [showNotification])

  // pusher setup
  useEffect(() => {
    if (!pusher) return;

    const projectChannel = pusher.subscribe(projectId + project_code);
    projectChannel.bind("project-chat", (data) => {
      if (data?.socket_id == pusher.connection.socket_id) return;
      // setChatMessages((prev) => [...prev, data]);
      setChatMessages((prev) => [data, ...prev]);
      // chat scene
      chatSceneHandler();

      const chatDiv = document.getElementById("chat-board");
      chatDiv.scrollTop = chatDiv.scrollHeight;
    });

    return () => {
      // pusher.unsubscribe(projectId+project_code);
      projectChannel.unsubscribe();
    };
  }, [pusher]);

  useEffect(() => {
    setShowNotification(false);
  }, [router.pathname]);

  // handle chat form
  async function handleChat(e) {
    e.preventDefault();
    if (!socketId) {
      return console.error("Pusher plan expired");
    }
    // sending audio url
    if (voiceFile) {
      handleSendAudioMessage();
      return;
    }
    // sending text message
    if (!chatText) return;
    handleSendTextMessage();
  }

  // onclick send text message
  const handleSendTextMessage = async () => {
    try {
      setChatSending(true);
      const response = await sendChatMessage(
        project_code,
        projectId,
        chatText,
        socketId
      );
      setChatSending(false);
      if (response.status !== 200) return;
      setChatText("");
      // setChatMessages((prev) => [...prev, response?.data?.messageBody]);
      setChatMessages((prev) => [response?.data?.messageBody, ...prev]);
      const chatDiv = document.getElementById("chat-board");
      chatDiv.scrollTop = chatDiv.scrollHeight;
      // chatDivRef?.current?.scrollTop = chatDivRef?.current?.scrollHeight;
    } catch (e) {
      setChatSending(false);
      toast.error("some error occured.");
    }
  };

  // onclick send audio message
  const handleSendAudioMessage = async () => {
    if (isRecording || !voiceFile) return;

    try {
      // uploading audio to aws
      setChatSending(true);
      const file = new File([voiceFile], "audio_voice");
      const formData = new FormData();
      formData.append("file", file);
      const data = {
        projectId: projectId,
        accountId: user?.account_details?._id,
        formData,
        folder: "chats",
      };

      const fileAddRes = await uploadFile(data);

      if (!fileAddRes?.data[0]?.filekey) return toast.error("audio not send");

      // sending audio chat
      const response = await sendChatMessage(
        project_code,
        projectId,
        fileAddRes?.data[0]?.filekey,
        socketId,
        "audio"
      );
      setChatSending(false);

      if (response.status !== 200) return;
      setVoiceFile(null);
      setChatText("");
      setChatMessages((prev) => [response?.data?.messageBody, ...prev]);
      const chatDiv = document.getElementById("chat-board");
      chatDiv.scrollTop = chatDiv.scrollHeight;
      // chatDivRef?.current?.scrollTop = chatDivRef?.current?.scrollHeight;
    } catch (e) {
      setChatSending(false);
      toast.error("some error occured.");
    }
  };

  // edit esitmate time for project manager
  async function handleEditEstimateTime() {
    if (isNaN(Date.parse(estimateTime)))
      return toast.error("Select an estimate time.");
    try {
      const response = await editProjectDetails(projectId, estimateTime);

      setIsEstimateTimeEditing(false);
      toast.success("Estimate time edited successfully.");
      setUpdatedTime(Date.now());
    } catch (e) {
      if (e?.response?.status === 400) {
        return toast.error(e?.response?.data?.error);
      }
      toast.error("error occured.");
    }
  }

  // chat scroll loding setup
  const lastChatObserver = useRef();
  const lastChatRef = useCallback((node) => {
    if (chatLoading) return;
    if (lastChatObserver.current) lastChatObserver.current.disconnect();
    lastChatObserver.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev += 1);
      }
    })
    if (node) {
      lastChatObserver.current.observe(node)
    }
  }, [chatLoading, page, hasMore])


  // project progress bar
  const [progresPer, setProgressPer] = useState(0);
  useEffect(() => {
    if (!project?.estimate_date) {
      setProgressPer(0);
      return;
    };
    let estimateDate = new Date(project?.estimate_date);
    let startDate = new Date(project?.create_date);
    let diffStartEnd = estimateDate.getTime() - startDate.getTime();
    let currTime = new Date() - startDate;
    let perc = (currTime / diffStartEnd) * 100;
    if (currTime >= diffStartEnd) {
      perc = 100;
    }
    setProgressPer(parseInt(perc) + "%");
  }, [project])


  return (
    <>
      <div className="relative min-h-screen flex">
        <div className="flex-1 max-h-screen h-screen flex flex-col w-[60%] relative">
          <div
            className={`${role == "project_manager"
              ? "bg-primary-white border-y-2 border-primary-grey"
              : "bg-primary-white border-y-2 border-primary-grey"
              } bg-primary-white w-full flex border-y-2 border-primary-grey gap-4 items-center`}
          >
            <ul className="flex flex-1 gap-10 self-end items-center  w-full h-14 px-9">
              {role != "designer" && (
                <Link href={"/projects/" + projectId + "?tab=CONNECT"}>
                  <a
                    className={
                      tabLink === "CONNECT"
                        ? role == "project_manager"
                          ? "active-horizontal-nav-item-textstyle"
                          : "active-horizontal-nav-item-textstyle"
                        : "diabled-horizontal-nav-item-textstyle"
                    }
                  >
                    Connect
                  </a>
                </Link>
              )}
              <Link href={"/projects/" + projectId + "?tab=REVIEW"}>
                <a className="diabled-horizontal-nav-item-textstyle">Review</a>
              </Link>
              <Link href={"/projects/" + projectId + "?tab=DOWNLOAD"}>
                <a
                  className={
                    tabLink === "DOWNLOAD"
                      ? role == "project_manager"
                        ? "pm-active-nav"
                        : "active-horizontal-nav-item-textstyle"
                      : "diabled-horizontal-nav-item-textstyle"
                  }
                >
                  {role == "designer" ? "Upload" : "Download"}
                </a>
              </Link>
              {role === "project_manager" && (
                <Link href={"/projects/" + projectId + "?tab=ADD_RESOURCE"}>
                  <a className="diabled-horizontal-nav-item-textstyle text-center">
                    Add resource
                  </a>
                </Link>
              )}
            </ul>
          </div>
          {
            chatLoading &&
            <ButtonLoader />
          }
          {/* <div className="absolute top-[70px] left-[50%] z-[1] bg-[#3B85F5] text-white px-5 py-1 rounded-3xl" style={{ transform: "translateX(-50%)" }}>
            Tuesday, April 28
          </div> */}
          {chatMessages.length < 1 ? (
            <div
              id="chatBox"
              className="chatBox  w-full flex-grow flex-col h-[calc(100%-7.5rem)] xl:h-[80%] 2xl:h-[88%] max-h-full  overflow-auto md:p-2 xl:p-5"
            >
              <div className=" w-full flex-1 p-7 xl:p-4 ">
                <div className="component-heading">Start your first chat.</div>
              </div>
            </div>
          ) : (
            <div
              className=" w-full z-0 flex-grow flex-colflex-col h-[calc(100%-7.8rem)] flex flex-col-reverse  max-h-full  overflow-auto md:p-2 xl:p-5"
              ref={chatDivRef}
              id="chat-board"
              // onScroll={handleChatScroll}
            >
              {chatMessages.map((chat, index) => {
                let length = chatMessages.length;
                if (index + 1 == length) {
                  return (
                    <React.Fragment key={chat._id}>
                      {chat.user_id === user?._id ? (
                        <Send chat={chat} user={user} chatRef={lastChatRef} />
                      ) : (
                        <Recieve chat={chat} user={user} role={role} chatRef={lastChatRef} />
                      )}
                    </React.Fragment>
                  );
                }
                return (
                  <React.Fragment key={chat._id}>
                    {chat.user_id === user?._id ? (
                      <Send chat={chat} user={user} />
                    ) : (
                      <Recieve chat={chat} user={user} role={role} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          )}
          {(role === "client_admin" ||
            role === "client_member" ||
            role === "project_manager") &&
            ((role === "client_admin" || role === "client_member") &&
              subscription !== "active" ? (
              <div
                className=" w-full flex justify-between invisible "
                style={{ bottom: "0px" }}
              ></div>
            ) : (
              <form
                className="pop-shadow w-full flex justify-between bg-secondary-gray h-[4rem]"
                style={{ bottom: "0px" }}
                onSubmit={handleChat}
              >
                <div className="flex flex-grow justify-between m-3 px-4 mr-1 rounded-md border border-gray-300 bg-primary-white resize-none items-center text-gray-secondaryShade">
                  {isRecording ? (
                    <>
                      <p className="flex-[0] w-4/5  bg-primary-white"></p>
                      <p className="flex-1 w-4/5  bg-primary-white text-center">
                        {utils.voiceRecorderCountDown(recordingTime)}{" "}
                        <span>recording....</span>
                      </p>
                    </>
                  ) : voiceFile ? (
                    <>
                      <p className="flex-[0] w-4/5  bg-primary-white cursor-pointer">
                        <span>
                          <BsTrash
                            onClick={() => setVoiceFile(null)}
                            className="h-5 w-5"
                          />
                        </span>
                      </p>
                      <p className="flex-1 w-full px-4 bg-primary-white">
                        <audio
                          src={URL.createObjectURL(voiceFile)}
                          controls
                          className="h-[30px] w-full"
                        />
                      </p>
                    </>
                  ) : (
                    <input
                      className="flex-1 w-4/5 bg-primary-white"
                      rows="1"
                      placeholder="Type your message here..."
                      style={{ outline: "none" }}
                      value={chatText}
                      onChange={(e) => setChatText(e.target.value)}
                    />
                  )}
                  {/* voice message component */}
                  <ChatVoiceRecorder
                    setVoiceFile={setVoiceFile}
                    isRecording={isRecording}
                    setIsRecording={setIsRecording}
                    setRecordingTime={setRecordingTime}
                  />
                </div>
                <div className="flex justify-center items-center">
                  {isRecording ? (
                    ""
                  ) : chatSending ? (
                    <button
                      className="m-3 text-white font-bold"
                      style={{ outline: "none" }}
                      disabled
                    >
                      <ButtonLoader />
                    </button>
                  ) : (
                    <button
                      className="m-3 text-white text-lg font-bold"
                      style={{ outline: "none" }}
                      type="submit"
                    >
                      Send
                    </button>
                  )}
                </div>
              </form>
            ))}
        </div>
        <div className="relative md:w-[17rem] xl:w-96 h-screen px-5 xl:px-10 py-5 shadow-lg whitespace-nowrap overflow-y-auto overflow-x-visible flex flex-col justify-between">
          <div className="flex flex-1 flex-col">
            <div className="flex flex-row-reverse space-x-4 self-center mr-0">
              <div className="flex self-center">
                <button
                  className="mx-5 self-center relative"
                  onClick={() => setShowNotification(!showNotification)}
                  id="notification-icon"
                >
                  <MdOutlineNotificationsActive
                    className="w-8 h-8 opacity-30"
                    id="notification-icon"
                  />
                  {unreadLength > 0 && (
                    <span className="absolute bg-red bottom-[0.125rem] justify-center items-center right-0 h-[1rem] w-[1rem] rounded-full">
                      <p className="text-white font-semibold text-xs self-center">{unreadLength}</p>
                    </span>
                  )}
                </button>

                {/* notification modal */}
                {showNotification && (
                  <div className="fixed right-0 z-50 top-[3.5rem]">
                    <NotificationModal
                      setShowNotification={setShowNotification}
                    />
                  </div>
                )}
              </div>
              <div className="self-center bg-primary-black opacity-20 rounded-full w-8 h-8">
                <Link href="/account?tab=account_details">
                  <div className="text-center font-thin text-2xl text-white cursor-pointer">
                    {user?.first_name[0]?.toUpperCase()}
                  </div>
                </Link>
              </div>
            </div>
            <div className="font-medium text-xl mt-6">Status</div>
            <div className="w-full h-fit p-1 border-2 relative border-secondary-gray-light mt-3 flex justify-between">
              <div className={`bg-light-yellow absolute left-0 top-0 h-full z-[-1] border-r-4 border-[#C4C4C4]`} style={{ width: progresPer }}></div>
              {isEstimateTimeEditing ? (
                <>
                  <input
                    type="date"
                    value={estimateTime}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setEstimateTime(e.target.value)}
                  />
                  <button onClick={handleEditEstimateTime}>
                    <BsCheck2
                      className="h-5 w-5 text-green-900"
                      style={{ strokeWidth: "3px" }}
                    />
                  </button>
                </>
              ) : (
                <p className=" text-sm ml-2">
                  Estimate{" "}
                  {utils.projectExpectedTimeDateFormate(
                    new Date(project?.estimate_date)
                  )}
                </p>
              )}
              {role === "project_manager" && !isEstimateTimeEditing ? (
                <button
                  className="font-bold"
                  onClick={() => setIsEstimateTimeEditing(true)}
                >
                  <HiOutlinePencil className="h-5 w-5 text-black" />
                </button>
              ) : (
                role === "project_manager" &&
                isEstimateTimeEditing && (
                  <button
                    className="font-bold"
                    onClick={() => setIsEstimateTimeEditing(false)}
                  >
                    <MdClose className="h-5 w-5 text-red" />
                  </button>
                )
              )}
            </div>
            {project?.project_status === "to_be_confirmed" ? (
              <ul className="space-y-2 border-b mt-5">
                <li className="flex items-start">
                  <div className="w-4 h-4 bg-primary-cyan border rounded-full" />
                  <p className="ml-3 text-base font-medium">To be confirmed</p>
                </li>
              </ul>
            ) : project?.project_status === "in_progress" ||
              project?.project_status === "u_review" ||
              project?.project_status === "u_approval" ? (
              <ul className="space-y-2 border-b mt-5">
                <li className="flex items-start">
                  <div
                    className={`w-4 h-4 ${project?.project_status === "u_review"
                      ? "bg-primary-cyan"
                      : "bg-secondary-gray-light"
                      } border rounded-full`}
                  />
                  <p className="ml-3 text-base font-medium">Review - Prakria</p>
                </li>
                <li className="flex items-start">
                  <div
                    className={`w-4 h-4 ${project?.project_status === "in_progress"
                      ? "bg-primary-cyan"
                      : "bg-secondary-gray-light"
                      } border rounded-full`}
                  />
                  <p className="ml-3 text-base font-medium">Work in progress</p>
                </li>
                <li className="flex items-start">
                  <div
                    className={`w-4 h-4 ${project?.project_status === "u_approval"
                      ? "bg-primary-cyan"
                      : "bg-secondary-gray-light"
                      } border rounded-full`}
                  />
                  <p className="ml-3 text-base font-medium mb-8">
                    Review - Client
                  </p>
                </li>
              </ul>
            ) : project?.project_status === "completed" ? (
              <ul className="space-y-2 border-b mt-5">
                <li className="flex items-start">
                  <div className="w-4 h-4 bg-primary-cyan rounded-full" />
                  <p className="ml-3 text-base font-medium">Completed</p>
                </li>
              </ul>
            ) : project?.project_status === "cancelled" ? (
              <ul className="space-y-2 border-b mt-5">
                <li className="flex items-start mt-5 mb-5">
                  <div className="w-4 h-4 bg-red-600 border rounded-full" />
                  <p className="ml-3 text-base font-medium">Cancelled</p>
                </li>
              </ul>
            ) : (
              project?.project_status === "on_hold" && (
                <ul className="space-y-2 border-b mt-5 mb-5 block">
                  <li className="flex items-start mt-5 mb-5">
                    <div className="w-4 h-4 bg-blue-500 border rounded-full flex justify-center items-center" />
                    <p className="ml-3 text-base font-medium">On hold</p>
                  </li>
                </ul>
              )
            )}
            {/* project breif component */}
            <ProjectBreif project={project} setUpdatedTime={setUpdatedTime} />
          </div>
          <div className="">
            <div className="mt-5">
              <div className="text-lg uppercase">PRAKRIA DIRECT TEAM</div>
              <div className="flex mt-1">
                {/* <div className={`bg-[#79BEEE] flex items-center justify-center text-white rounded-full h-10 w-10 mr-2`}>
                                    <p className='uppercase cursor-pointer'
                                        title={`${project?.project_manager?.first_name + " " + project?.project_manager?.last_name + " | " + project?.project_manager?.role}`}>
                                        {project?.project_manager ? project.project_manager.first_name[0] + project.project_manager.last_name[0] : " "}
                                    </p>
                                </div>
                                {project?.resource &&
                                    <div className={"bg-red flex items-center justify-center text-white rounded-full h-10 w-10 mr-2"}>
                                        <p className='uppercase cursor-pointer'
                                            title={`${project?.resource?.first_name + " " + project?.resource?.last_name + " | " + project?.resource?.role}`}>
                                            {project?.resource?.first_name[0] + project?.resource?.last_name[0]}
                                        </p>
                                    </div>} */}
                {/* <div className=" border-2 h-10 w-10"></div> */}
                {teamPrakriaFetching || teamPrakriaLoading ? (
                  <div className="py-3 px-8">
                    <ButtonLoader />
                  </div>
                ) : (
                  teamPrakria?.map((team) => {
                    return (
                      <div
                        key={team._id}
                        className={`${team.role == "project_manager"
                          ? "bg-[#79BEEE]"
                          : team.role == "designer"
                            ? "bg-red"
                            : "bg-light-yellow"
                          } flex items-center justify-center text-white rounded-full h-10 w-10 mr-2`}
                      >
                        <p
                          className="uppercase cursor-pointer"
                          title={`${team.first_name +
                            " " +
                            team.last_name +
                            " | " +
                            team?.role
                            }`}
                        >
                          {team.first_name[0] + team.last_name[0]}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
            <div className="mt-5">
              <div className="text-lg uppercase">Your team</div>
              <div className="flex mt-1">
                <div
                  className={
                    "bg-[#69A197] flex items-center justify-center text-white rounded-full h-10 w-10 mr-2"
                  }
                >
                  <p
                    className="uppercase cursor-pointer"
                    title={`${project?.client_admin?.first_name +
                      " " +
                      project?.client_admin?.last_name +
                      " | " +
                      project?.client_admin?.role
                      }`}
                  >
                    {project?.client_admin
                      ? project.client_admin?.first_name[0] +
                      project.client_admin.last_name[0]
                      : " "}
                  </p>
                </div>
                {project?.client_members?.map((member) => {
                  return (
                    <div
                      className={
                        "bg-red flex items-center justify-center text-white rounded-full h-10 w-10 mr-2"
                      }
                      key={member._id}
                    >
                      <p
                        className="uppercase cursor-pointer"
                        title={`${member?.first_name +
                          " " +
                          member?.last_name +
                          " | " +
                          member?.role
                          }`}
                      >
                        {member
                          ? member?.first_name[0] + member.last_name[0]
                          : " "}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className=" w-full bg-primary-blue p-3 mt-8 rounded-md">
              <p className="text-white lg:text-lg text-xl text-justify font-medium w-full truncate">
                Need any <br />other assistance?
              </p>
              <Link href="/?chatbox=true#faq" >
                <div className="bg-white px-3 py-2 text-xs mt-3 flex justify-between rounded-md cursor-pointer">
                  <p className="">Write for us...we are here for you.</p>
                  <BsChevronRight className="h-4 w-4" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const Recieve = ({ chat, user, role, chatRef }) => {
  const userDetails = chat.user_details;
  const isLink = chat?.message
    ?.split(" ")[0]
    .match(/^(https?|chrome|http):\/\/[^\s$.?#].[^\s]*$/gm);
  return (
    <div className="flex items-end p-0 chat-msgs" ref={chatRef}>
      <div
        className={`${role === "project_manager" ? "bg-primary-cyan" : "bg-primary-blue"
          } flex items-center justify-center text-white rounded-full h-10 w-10 mr-2`}
      >
        {/* <div className="flex items-center justify-center bg-primary-blue text-white rounded-full h-10 w-10 mr-2"> */}
        <p className="uppercase cursor-pointer">
          {
            userDetails ? userDetails?.first_name[0] + userDetails?.last_name[0]
              :
              "DEL"
          }
        </p>
      </div>
      <div
        className={`${role === "project_manager"
          ? " bg-primary-cyan w-fit  max-w-[300px] xl:max-w-[400px] 2xl:max-w-[500px]  self-end mt-5 rounded-lg rounded-br-lg select-text"
          : "bg-primary-blue w-fit  max-w-[300px] xl:max-w-[400px] 2xl:max-w-[500px]  self-end mt-5 rounded-lg rounded-br-lg select-text"
          }`}
      >
        {/* </div> */}
        {chat?.message_type === "audio" ? (
          <p className="p-5 pb-0 text-white">
            <audio
              src={`/api/s3-upload/view/?key=${chat?.message}`}
              className="controls"
              id="recieve"
              controls
            />
          </p>
        ) : isLink ? (
          <p className="p-5 pb-0 text-white">
            <a
              href={`${chat?.message?.split(" ")[0]}`}
              target="_blank"
              rel="noreferrer"
              className="underline italic break-words hover:text-[#f3f1f1]"
            >
              {chat?.message?.split(" ")[0]}
            </a>{" "}
            {chat?.message?.split(" ")[1]}
          </p>
        ) : (
          <p className="p-5 pb-0 text-primary-white break-words">{chat.message}</p>
        )}
        <div className="w-full h-5 rounded-t-lg rounded-br-lg pl-10 flex justify-end">
          <div className="flex items-center gap-1">
            <p className="text-xs text-primary-white px-1 py-2">
              {moment(chat.created_time).format("LT")}
            </p>
            {/* <BsCheck2 className="w-4 h-4 text-blue-300" /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

const Send = ({ chat, user, chatRef }) => {
  const isLink = chat?.message
    ?.split(" ")[0]
    .match(/^(https?|chrome|http):\/\/[^\s$.?#].[^\s]*$/gm);
  const userDetails = chat.user_details;
  return (
    <div className="flex items-end p-0 chat-msgs" ref={chatRef}>
      <div
        className={`w-fit max-w-[300px] xl:max-w-[400px] 2xl:max-w-[500px] ml-auto mt-5 mr-2 bg-secondary-gray-light rounded-lg select-text`}
      >
        {chat?.message_type === "audio" ? (
          <p className="p-5 pb-0 mx-2 text-white ">
            <audio
              src={`/api/s3-upload/view/?key=${chat?.message}`}
              className="controls"
              id="send"
              controls
            />
          </p>
        ) : isLink ? (
          <p className="p-5 pb-0 text-primary-black">
            <a
              href={`${chat?.message?.split(" ")[0]}`}
              target="_blank"
              rel="noreferrer"
              className="underline italic break-words hover:text-[#000000d1]"
            >
              {chat?.message?.split(" ")[0]}
            </a>{" "}
            {chat?.message?.split(" ")[1]}
          </p>
        ) : (
          <p className="p-5 pb-0 text-primary-black overflow-hidden break-words">
            {chat.message}
          </p>
        )}
        <div className="w-full h-5 rounded-bl-lg flex justify-end pl-10">
          <div className="flex items-center gap-1 mr-1">
            <p className="text-xs text-primary-black">
              {moment(chat.created_time).format("LT")}
            </p>
            {/* <BsCheck2 className="w-4 h-4 text-blue-300" /> */}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center bg-secondary-gray text-white rounded-full h-10 w-10">
        <p className="uppercase cursor-pointer">
          {
            userDetails ? userDetails?.first_name[0] + userDetails?.last_name[0]
              :
              "DEL"
          }
        </p>
      </div>
    </div>
  );
};

export default ProjectChatScreen;
