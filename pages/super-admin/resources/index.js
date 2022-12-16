import { useRouter } from "next/router";
import Loader from "../../../components/layouts/Loader";
import ResourceList from "../../../components/su_admin/ResourceList"
import { useAuth } from "../../../hooks/useAuth"

function Resources() {
  // const { role, isAuthenticated } = useAuth();
  // const router = useRouter();

  // if (isAuthenticated === null) {
  //   return <Loader />
  // }
  // if (isAuthenticated !== null && role !== "super_admin") {
  //   router.push("/404");
  // }
  return (
    <div>
      <ResourceList />
    </div>
  )
}

export default Resources