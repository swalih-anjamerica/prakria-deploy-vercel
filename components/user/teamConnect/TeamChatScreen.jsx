import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "../../../hooks/useAuth";
import ChatVoiceRecorder from "../projects/ChatVoiceRecorder";
import utils from "../../../helpers/utils";
import toast from "react-hot-toast";
import { uploadFile } from "../../../hooks/queryHooks/useFile";
import { chatSceneService, getAllChats, sendChatMessage } from "../../../services/chat";
import ButtonLoader from "../../common/ButtonLoader";
import Pusher from "pusher-js";
import moment from "moment";
import { useLibraries } from "../../../hooks/useLibraries";
import { BsTrash, BsCheck2 } from 'react-icons/bs';
import { useRouter } from "next/router";


const chat_code = "_team";
function TeamChatScreen({ projectId, chatMessages, setChatMessages }) {
  const [chatText, setChatText] = useState("");
  // const [chatMessages, setChatMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatSending, setChatSending] = useState(false);
  const { user } = useAuth();
  // const [audioUrl, setAudioUrl] = useState(null);
  const [voiceFile, setVoiceFile] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(async () => {
    try {
      setChatLoading(true);
      const response = await getAllChats(projectId, chat_code, page);
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
  }, [page, projectId]);

  const chatSceneHandler = async () => {
    try {
      await chatSceneService({
        project_id: projectId,
        chat_code: chat_code,
      });
    } catch (e) {
    }
  }
  // pusher setup
  const { pusher, pusherSocketId } = useLibraries();
  const [socketId, setSocketId] = useState(pusherSocketId);
  useEffect(() => {
    if (!pusher) return;
    const projectChannel = pusher.subscribe(projectId + chat_code);
    projectChannel.bind("project-chat", (data) => {
      if (data?.socket_id == pusher.connection.socket_id) return;
      setChatMessages((prev) => [data, ...prev]);
      const chatDiv = document.getElementById("chat-board");
      chatDiv.scrollTop = chatDiv.scrollHeight;
    });

    return () => {
      pusher.unsubscribe(projectId + chat_code);
    }
  }, [pusher]);

  // handle chat form
  async function handleChat(e) {
    e.preventDefault();

    if (!socketId) return;

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
        chat_code,
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
      setChatSending(true);
      // uploading audio to aws
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
        chat_code,
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

  return (
    <div className="md:h-[64vh] 2xl:h-[66vh]">
      <div
        className="w-full h-full px-6 xl:px-9 overflow-y-auto flex flex-col-reverse pb-[2rem]"
        id="chat-board"
      >
        {
          chatLoading &&
          <ButtonLoader />
        }
        {chatMessages.length < 1 ? (
          <h1 className="component-heading mt-4 " style={{ height: "100%" }}>Start your first chat</h1>
        ) : (
          chatMessages.map((chat, index) => {
            let length = chatMessages.length;
            if (index + 1 == length) {
              return (
                <React.Fragment key={chat._id}>
                  {chat.user_id === user?._id ? (
                    <Send chat={chat} user={user} chatRef={lastChatRef} />
                  ) : (
                    <Recieve chat={chat} user={user} chatRef={lastChatRef} />
                  )}
                </React.Fragment>
              );
            }
            return (
              <React.Fragment key={chat._id}>
                {chat.user_id === user?._id ? (
                  <Send chat={chat} user={user} />
                ) : (
                  <Recieve chat={chat} user={user} />
                )}
              </React.Fragment>
            );
          })
        )}
      </div>
      <form
        className="w-full pop-shadow border border-secondary-gray  h-[3.5rem] flex justify-between bg-secondary-gray absolute bottom-0"
        onSubmit={handleChat}
      >
        {/* <button
          className="m-2 flex justify-center items-center w-10 bg-primary-white rounded-lg"
          style={{ outline: "none" }}
        >
          <PaperClipIcon className="h-7 w-7" />
        </button> */}
        <div className="flex flex-grow items-center justify-between m-2 py-2 px-4 mr-1 rounded-md border border-gray-300 bg-primary-white resize-none">
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
              <p className="flex-[0] w-4/5  bg-primary-white">
                <span className="text-gray-secondaryShade">
                  <BsTrash
                    onClick={() => setVoiceFile(null)}
                    className="h-5 w-5 cursor-pointer"
                  />
                </span>
              </p>
              <p className="flex-1 w-4/5 px-5 bg-primary-white">
                <audio
                  src={URL.createObjectURL(voiceFile)}
                  controls
                  className="h-[30px] w-full"
                />
              </p>
            </>
          ) : (
            <input
              className="flex-1 w-4/5  bg-primary-white"
              rows="1"
              placeholder="Message..."
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
        <div className="flex justify-center items-center" id="chat-board">
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
              className="m-3 text-white font-bold"
              style={{ outline: "none" }}
              type="submit"
            >
              Send
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

const Recieve = ({ chat, user, role, chatRef }) => {
  const userDetails = chat.user_details;
  const isLink = chat?.message
    ?.split(" ")[0]
    .match(/^(https?|chrome|http):\/\/[^\s$.?#].[^\s]*$/gm);
  return (
    <div className="flex items-end p-0" ref={chatRef}>
      <div
        className={`bg-primary-cyan flex items-center justify-center text-white rounded-full h-10 w-10 mr-2`}
      >
        {/* <div className="flex items-center justify-center bg-primary-blue text-white rounded-full h-10 w-10 mr-2"> */}
        <p className="uppercase cursor-pointer">
          {userDetails?.first_name[0] + userDetails?.last_name[0]}
        </p>
      </div>
      <div
        className={`bg-primary-cyan w-fit  max-w-xl  self-end mt-5 rounded-t-lg rounded-br-lg select-text`}
      >
        {/* </div> */}
        {chat?.message_type === "audio" ? (
          <p className="p-2 text-white">
            <audio
              src={`/api/s3-upload/view/?key=${chat?.message}`}
              className="controls"
              id="recieve"
              controls
            />
          </p>
        ) : isLink ? (
          <p className="p-2 text-white">
            <a
              href={`${chat?.message?.split(" ")[0]}`}
              target="_blank"
              rel="noreferrer"
              className="text-primary-white italic break-words"
            >
              {chat?.message?.split(" ")[0]}
            </a>{" "}
            {chat?.message?.split(" ")[1]}
          </p>
        ) : (
          <p className="p-2 text-primary-white break-words">{chat.message}</p>
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
    <div className="flex  items-end p-0" ref={chatRef}>
      <div
        className={`w-fit max-w-xl ml-auto mt-5 mr-2 bg-secondary-gray-light rounded-t-lg rounded-bl-lg select-text`}
      >
        {chat?.message_type === "audio" ? (
          <p className="p-2 mx-2 text-white">
            <audio
              src={`/api/s3-upload/view/?key=${chat?.message}`}
              className="controls"
              id="send"
              controls
            />
          </p>
        ) : isLink ? (
          <p className="p-2 text-white">
            <a
              href={`${chat?.message?.split(" ")[0]}`}
              target="_blank"
              rel="noreferrer"
              className="text-primary-blue italic break-words"
            >
              {chat?.message?.split(" ")[0]}
            </a>{" "}
            {chat?.message?.split(" ")[1]}
          </p>
        ) : (
          <p className="p-2 text-primary-black overflow-hidden break-words">
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
          {userDetails?.first_name[0] + userDetails?.last_name[0]}
        </p>
      </div>
    </div>
  );
};

export default TeamChatScreen;