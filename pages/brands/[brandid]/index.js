import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { dehydrate, QueryClient } from "react-query";
import Loader from "../../../components/layouts/Loader";
import { Folder } from "../../../components/user/Brands/Folder";
import {
  getSingleBrand,
  useAddFolder,
} from "../../../hooks/queryHooks/useBrands";
import Dropzone from "react-dropzone";
import { ModalAbsolute } from "../../../components/common/ModalAbsolute";
import Link from "next/link";
import { FaFolder } from "react-icons/fa";
import { useAuth } from "../../../hooks/useAuth";
import { BsPlusLg } from "react-icons/bs";
import { useAuthLayout } from "../../../hooks/useAuthLayout";

export default function SingleBrand() {
  const [addFolderShow, setAddFolderShow] = useState(false);
  const [folderName, setFolderName] = useState("");
  const { setHeaderMessage } = useAuthLayout();

  const router = useRouter();
  const { role, subscription } = useAuth();

  let { brandid, tab } = router.query;

  const { data, isLoading, isFetching, isFetched } = getSingleBrand(brandid);
  const {
    mutate: addNewFolder,
    isError: isAddFolderErr,
    error: addFolderErr,
    isIdle: addFolderIdled,
    isSuccess: addFolderSucess,
  } = useAddFolder();

  async function addFolderHandler(folder) {
    if (!folderName) {
      setAddFolderShow(false);
      return setFolderName("");
    }

    let data = { brandId: brandid, folderName: folderName };

    addNewFolder(data);

    if (isAddFolderErr) {
      if (addFolderIdled && addFolderSucess) {
        setFolderName("");
        setAddFolderShow(false);
        toast.dismiss();
        return toast.success("Folder Created");
      }

      if (addFolderErr.response.status == 406) {
        setAddFolderShow(false);
        setFolderName("");
        toast.dismiss();
        return toast.error(addFolderErr.response.data.error);
      }
    }

    if (addFolderIdled) {
      setFolderName("");
      setAddFolderShow(false);
      toast.dismiss();
      return toast.success("Folder Created");
    }
  }

  useEffect(() => {
    setHeaderMessage("Find your brand files here,");
    return () => {
      setHeaderMessage(null);
    };
  }, []);

  if (!tab || (tab !== "latest" && tab !== "all")) {
    tab = "all";
  }

  if (isLoading) return <Loader />;

  return (
    <>
      <div
        className="flex-1 min-h-screen "
      // onDrag={(e) => e.nativeEvent.preventDefault()}
      // onDragOver={(e) => e.preventDefault()}
      >
        <div className="bg-primary-white w-full border-y-2 border-primary-grey  h-14 flex px-2 justify-end ">
          <ul className="flex flex-1 self-center w-full pl-4 pr-7 xl:px-7">
            <li className="mr-12 flex-1">
              <Link href={`/brands/${brandid}?tab=all`}>
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
              <Link href={`/brands/${brandid}?tab=latest`}>
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

            <div className="">
              <button
                style={{ fontWeight: "500", opacity: "0.9" }}
                className="yellow-action-button  flex items-center gap-1 "
                onClick={() => {
                  if (
                    (role == "client_admin" || role == "client_member") &&
                    subscription !== "active"
                  ) {
                    return toast(
                      "You dont have any active plan. Please add a plan and continue"
                    );
                  }
                  setAddFolderShow(true);
                }}
              >
                <>+  &nbsp;&nbsp;&nbsp;Add Folder &nbsp;&nbsp;</>
              </button>
            </div>
          </ul>

        </div>
        <div className="px-6 xl:px-12 flex py-4 relative w-[36%]">
          {/* <div className="flex flex-1 items-center border border-primary-gray px-1 py-1">
          <SearchIcon className="ml-1 h-5 w-5 text-primary-blue" />
          <input
            type="text"
            className="search-bar "
            placeholder="Search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div> */}
        </div>

        <div className="text-primary-blue flex px-6 xl:px-9 uppercase">
          <Link href="/brands" passHref>
            <p className="text-primary-blue">BRANDS</p>
          </Link>
          &nbsp;{">"}&nbsp;
          <p className="cursor-pointer">{data.name}</p>
        </div>

        <div className="flex w-full px-6 xl:px-9 pt-5 text-[#414040] text-2xl">
          {data.name}
        </div>

        <div className=" w-full flex-1 px-6 xl:px-9 py-6">
          <div className="grid grid-flow-row grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-8 z-50">
            {data?.folder.map((folder, index) => (
              <Folder brandid={brandid} key={index} folder={folder} />
            ))}
            <ModalAbsolute
              showModal={addFolderShow}
              className="w-[25%] z-30 bg-gray-100"
              setShowModal={setAddFolderShow}
            >
              <div className=" text-[#646464] flex items-center">
                <FaFolder className="ml-5 w-40 h-40 px-5 text-gray-300" />
              </div>
              <div className="mb-10 text-center flex placeholder:text-black justify-around mt-2 text-secondry-text font-semibold">
                <input
                  autoFocus={true}
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  type={"text"}
                  placeholder="New Folder"
                  className="outline-none px-3 rounded-md bg-white"
                />
                <button
                  className="ml-2 uppercase bg-[#FFF300] rounded-md px-5 py-1 hover:text-[#648CF4]	"
                  onClick={addFolderHandler}
                >
                  Save
                </button>
              </div>
            </ModalAbsolute>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  try {
    const { brandid } = context.query;

    // const queryClient = new QueryClient();

    // await queryClient.prefetchQuery([ 'brand', brandid ], () =>
    // 	// axios.get(`/localhost/api/users/brands/${brandid}`)
    // 	// null
    // );

    return {
      props: {
        // dehydratedState: dehydrate(queryClient),
      },
    };
  } catch (error) {
    console.log(error);
  }
}
