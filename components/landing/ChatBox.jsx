import { useRouter } from "next/router";
import React, { useState } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import validator from "validator";
import { sendQueryService } from "../../services/landing";
import ButtonLoader from "../common/ButtonLoader";

export default function ChatBox() {
  const router = useRouter();
  const { chatbox = false } = router.query;

  const [chatBoxOpen, setChatBoxOpen] = useState(false);
  const [messageBox, setMessageBox] = useState(false);
  const [sendingQuery, setSendingQuery] = useState(false);
  const [queryForm, setQueryForm] = useState({
    email: "",
    message: ""
  })
  const [queryFormErr, setQueryFormErr] = useState({
    emailErr: "",
    messagErr: ""
  })

  useEffect(() => {
    const { chatbox = false } = router.query;

    try {
      setChatBoxOpen(JSON.parse(chatbox));
    } catch (e) {
      setChatBoxOpen(false);
    }
  }, [JSON.stringify(router.query)])


  async function handleSendQuery() {
    setQueryFormErr({});
    if (!queryForm.email) {
      return setQueryFormErr(prev => ({ ...prev, emailErr: "required" }))
    }
    if (!queryForm.message) {
      return setQueryFormErr(prev => ({ ...prev, messagErr: "required" }));
    }
    if (!validator.isEmail(queryForm.email)) {
      return setQueryFormErr(prev => ({ ...prev, emailErr: "invalid email" }));
    }
    try {
      setSendingQuery(true);
      await sendQueryService(queryForm);
      setQueryForm({ email: "", message: "" });
      setSendingQuery(false);
      toast.success("Your message has been sent");
    } catch (e) {
      toast.success("please try again later");
      setSendingQuery(false);
    }
  }

  return (
    <>
      {
        chatBoxOpen && <div className="w-full h-full fixed left-0 top-0 z-[1]" onClick={() => setChatBoxOpen(false)}></div>
      }
      <div className="fixed bottom-[10vh] right-[3rem] w-[4rem] h-[4rem] items-center justify-center flex bg-[#FF0000] rounded-full drop-shadow-lg cursor-pointer z-[1]">
        {chatBoxOpen && (
          <div className="absolute slideDown z-30 flex-col w-[17rem] right-0 bottom-[75px] h-[19rem] rounded-t-xl drop-shadow-2xl flex justify-center items-center">
            <div className="relative bg-[#FF0000] w-full h-full flex flex-col gap-4 rounded-xl py-5 px-3 text-left">
              <img
                src="/assets/landing/logo_gray.png"
                className="w-[3rem] h-[1.5rem] ml-[1rem]"
              />

              {!messageBox && (
                <div className="z-10">
                  <div>
                    <p className="font-bold text-white text-md  px-4">
                      Hello, there!
                    </p>
                    <p className="font-extralight text-base text-white px-4">
                      Do you have a query?
                    </p>
                  </div>
                  <div className="bg-white w-fit p-4 mt-8 rounded-md h-fit z-10 drop-shadow-lg">
                    <span className="text-primary-black font-extralight text-sm">
                      We&apos;re just a message away. Let&apos;s talk direct!
                    </span>
                    <button
                      className="w-fit mt-6  font-semibold flex flex-col text-white rounded-md bg-[#FF0000]  justify-center items-center transition-colors duration-150 hover:bg-[#e05252] p-2  cursor-pointer"
                      onClick={() => setMessageBox(!messageBox)}
                    >
                      Send a Message
                    </button>
                  </div>
                </div>
              )}

              {messageBox && (
                <div className="z-10">
                  <Message setMessageBox={messageBox} queryForm={queryForm} setQueryForm={setQueryForm} handleSendQuery={handleSendQuery} loading={sendingQuery} queryFormErr={queryFormErr} />
                  <div
                    className="absolute top-[1.3rem] left-3 h-[1rem] w-fit cursor-pointer"
                    onClick={() => {
                      setMessageBox(false);
                    }}
                  >
                    <svg
                      width="12"
                      height="20"
                      viewBox="0 0 14 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 2L3 11.5143L12 20"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>
              )}
              <div className="absolute bottom-0 flex-col right-0 rounded-b-md bg-white w-full h-[15%]" />
            </div>
          </div>
        )}

        <span
          // className="fixed bottom-[10vh] right-[3rem] w-[4rem] h-[4rem] items-center justify-center flex bg-[#FF0000] rounded-full drop-shadow-lg cursor-pointer"
          onClick={() => {
            setChatBoxOpen(prev => !prev);
            setMessageBox(false);
          }}
        >
          <div>
            {chatBoxOpen === true ? (
              <svg
                width="31"
                height="19"
                viewBox="0 0 31 19"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 3L16.2143 15L28 3"
                  stroke="white"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg
                width="32"
                height="65"
                viewBox="0 0 51 65"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M7.64178 15.5074C3.77579 15.5074 0.641785 18.6414 0.641785 22.5074V57.4791H34.6034C38.4694 57.4791 41.6034 54.3451 41.6034 50.4791V22.5074C41.6034 18.6415 38.4694 15.5074 34.6034 15.5074H7.64178ZM0.641738 57.4791V64.2687L8.83407 57.4791H0.641738Z"
                  fill="white"
                />
                <path
                  d="M16.8956 38.0393V5.16416C16.8956 2.71597 18.8803 0.731323 21.3285 0.731323H45.3816C47.8298 0.731323 49.8145 2.71597 49.8145 5.16416V33.6065C49.8145 36.0547 47.8298 38.0393 45.3816 38.0393H16.8956ZM16.8956 38.0393V44.0745L23.4794 38.0393L16.8956 38.0393Z"
                  stroke="white"
                />
                <path
                  d="M8 43C12.5 46.8333 24 52.2 34 43"
                  stroke="#FF0000"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </div>
        </span>
      </div>
    </>
  );
}

const Message = (props) => {
  const { queryForm, setQueryForm, queryFormErr, handleSendQuery, loading } = props;
  return (
    <div className="bg-white w-full h-[14rem] z-10 rounded-md drop-shadow-xl px-2 py-2">
      <input
        type="text"
        className={`border-b-[.1rem] w-full text-xs ${queryFormErr.emailErr ? "border-red" : "border-none"}  outline-none p-2`}
        placeholder="email@example.com"
        value={queryForm.email}
        onChange={e => {
          setQueryForm(prev => ({ ...prev, email: e.target.value }))
        }}
      />
      <hr />
      <textarea
        type="text"
        className="w-full text-xs outline-none resize-none h-[9rem] p-2"
        placeholder="Write your message..."
        value={queryForm.message}
        onChange={e => {
          setQueryForm(prev => ({ ...prev, message: e.target.value }))
        }}
      />
      <div className="h-fit w-full flex justify-end cursor-pointer" onClick={!loading ? handleSendQuery : () => { }}>
        {
          loading ?
            <ButtonLoader />
            :
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 20V13.875L10.55 12L3 10.075V4L22 12L3 20Z"
                fill="#A4A4A4"
              />
            </svg>
        }
      </div>
    </div>
  );
};
