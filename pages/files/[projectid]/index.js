import { FaFolder } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/router";
import { BiHome } from 'react-icons/bi';
import { useAuthLayout } from "../../../hooks/useAuthLayout";
import { useEffect } from "react";
import projectService from "../../../services/projects";
import { useQuery } from "react-query";

export default function SingleBrand() {
  const router = useRouter();
  let { projectid, tab } = router.query;
  let { setHeaderMessage } = useAuthLayout();

  const { data: project } = useQuery(["project_details"], () => projectService.fetchProjectDetailsById(projectid), {
    enabled: !!projectid,
    keepPreviousData: true,
    select: data => data.data
  });

  if (!tab || (tab !== "latest" && tab !== "all")) {
    tab = "all";
  }
  useEffect(() => {
    setHeaderMessage("Find your brand files here,");
    return () => {
      setHeaderMessage(null);
    };
  }, []);

  return (
    <>
      <div
        className="flex-1 min-h-screen "
        onDrag={(e) => e.nativeEvent.preventDefault()}
        onDragOver={(e) => e.preventDefault()}
      >
        <div className="bg-primary-white border-y-2 border-primary-grey gap-4 w-full h-14 px-6 xl:px-9 flex justify-between">
          <ul className="flex flex-1  self-center w-full px-0">
            <li className="mr-12 ">
              <Link href={`/files/${projectid}?tab=all`}>
                <a className={
                  tab == "all" ?
                    "active-horizontal-nav-item-textstyle"
                    :
                    "diabled-horizontal-nav-item-textstyle"
                } >
                  All
                </a>
              </Link>
            </li>
            {/* <li className="mr-12 ">
              <Link href={`/files/${projectid}?tab=latest`}>
                <a className={
                  tab == "latest" ?
                    "active-horizontal-nav-item-textstyle"
                    :
                    "diabled-horizontal-nav-item-textstyle"
                } >
                  Latest
                </a>
              </Link>
            </li> */}
          </ul>
        </div>
        {/* Body */}
        <div className=" w-full flex-1 p-6 xl:p-11">
          <div className="text-primary-blue flex uppercase">
            <Link href="/files" passHref>
              FILES
            </Link>
            {" > "}
            {!project?.title ? "loading.." : project.title}
          </div>
          <div className="grid grid-flow-row grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-5 z-20 drop-shadow-md">
            {/* Folder */}
            <Link href={`/files/${projectid}/input`} passHref>
              <div className=" select-none rounded-m">
                <div className="dropzone p-4 shadow rounded flex-col m-4 col-span-1 hover:cursor-pointer   bg-secondry-gray mx-auto z-0">
                  <div className="text-[#646464] flex items-center justify-center">
                    <FaFolder className="w-24 h-24" />
                  </div>
                  <div className="text-center mt-4  text-secondry-text font-semibold z-0">
                    UPLOAD <br /> ASSETS
                  </div>
                </div>
              </div>
            </Link>

            {/* Folder */}

            {/* Folder */}
            <Link href={`/files/${projectid}/downloads`} passHref>
              <div className=" select-none rounded-m">
                <div className="dropzone p-4 shadow rounded flex-col m-4 col-span-1 hover:cursor-pointer   bg-secondry-gray mx-auto z-0">
                  <div className="text-[#646464] flex items-center justify-center">
                    <FaFolder className="w-24 h-24" />
                  </div>
                  <div className="text-center mt-4  text-secondry-text font-semibold z-0">
                    DOWNLOAD <br /> ASSETS
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
