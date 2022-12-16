import { useState, useEffect } from "react";
import TeamChatScreen from "../../components/user/teamConnect/TeamChatScreen";
import { useQuery } from "react-query";
import { getAllProjectsService } from "../../services/project";
import { useAuthLayout } from "../../hooks/useAuthLayout";
import Pagination from "../../components/common/Pagination";
import { GoSearch } from "react-icons/go";
import { useRouter } from "next/router";

function TeamConnect({ PUSHER_APP_KEY, PUSHER_CLUSTER }) {
  const [projectId, setProjectId] = useState(null);
  const [projectName, setProjectName] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [chatMessages, setChatMessages] = useState([]);
  const {
    data: projects,
    isLoading: projectLoading,
    isFetching: projectFetching,
  } = useQuery(["list-all-projects", searchText, page], () => {
    return getAllProjectsService(searchText, page, 7);
  });
  const { setHeaderMessage } = useAuthLayout();
  const router = useRouter();

  useEffect(() => {
    setHeaderMessage("Lets talk,");
    return () => {
      setHeaderMessage(null);
    };
  }, []);
  useEffect(() => {
    let roomId = router.query?.room;
    if (!roomId) return;
    setProjectId(roomId);
  }, [router.query])

  return (
    <div className="flex h-[80vh] overflow-y-hidden ">
      <div className="flex-1 h-full relative ">
        <div className="bg-primary-white h-[10%] w-full border-y-2 border-primary-grey px-6 xl:px-9 flex items-center">
          <p className="text-[#414040] text-xl flex items-center truncate w-[30vw]">
            {projectName}
          </p>
        </div>
        {!projectId ? (
          <div className="flex-1">
            <div className="w-full flex-grow flex-col p-6 xl:p-9">
              <div className="w-full flex-1">
                <div className="component-heading">
                  Select a project to start messaging
                </div>
              </div>
            </div>
          </div>
        ) : (
          <TeamChatScreen
            projectId={projectId}
            PUSHER_APP_KEY={PUSHER_APP_KEY}
            PUSHER_CLUSTER={PUSHER_CLUSTER}
            chatMessages={chatMessages}
            setChatMessages={setChatMessages}
          />
        )}
      </div>
      <div className="w-[37%] h-[80vh]  p-3 py-5 overflow-y-scroll shadow-lg whitespace-nowrap overflow-x-hidden  bg-[#3B85F5]">
        <div className="mt-6 px-1 py-2 font-medium text-xl border-b-2 border-white  flex justify-evenly items-center">
          <GoSearch className="h-5 w-5 mx-3 text-white" />
          <input
            className="w-full text-primary-white placeholder:text-primary-white bg-[#3B85F5] focus:outline-none truncate"
            placeholder="Search by Name,Brand"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
          />
        </div>
        <div className="p-1 mt-5 gap-2 flex flex-col">
          {projects?.status == 204 ? (
            <div></div>
          ) : (
            projects?.data?.projects?.map((project) => {
              return (
                <div
                  key={project._id}
                  className={`w-full h-20 ${project._id == projectId
                    ? "bg-primary-white"
                    : "bg-[#7EB2FF]"
                    } rounded-md flex flex-col justify-center gap-1 pl-5 cursor-pointer`}
                  onClick={(e) => {
                    setChatMessages([]);
                    setProjectId(project._id);
                    setProjectName(project.title);
                  }}
                >
                  <p className="text-2xl tracking-normal break-words truncate w-[95%]">
                    {project.title}
                  </p>
                  <div>
                    <p className="text-xs tracking-wide w-full">
                      Project Manager:{" "}
                      {/* {project.brand[0]?.name ? (
                        project.brand[0]?.name
                      ) : (
                        <del className="bg-cyan-600 rounded-xs p-1 text-[.6rem] xl:text-xs text-white w-20 break-words">
                          No brands linked
                        </del>
                      )} */}
                      {
                        project.pm?.first_name ? project.pm?.first_name + " " + project.pm?.last_name : "Not found"
                      }
                    </p>
                  </div>
                </div>
              );
            })
          )}
          {projects?.data?.total && projects?.data?.total > 0 && (
            <div className="flex w-full my-4 justify-center items-center">
              <Pagination
                currentPage={page}
                setCurrentPage={setPage}
                countPerPage={10}
                total={projects?.data?.total}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TeamConnect;

export async function getServerSideProps(context) {
  return {
    props: {
      PUSHER_APP_KEY: process.env.PUSHER_APP_KEY,
      PUSHER_CLUSTER: process.env.PUSHER_CLUSTER,
    },
  };
}
