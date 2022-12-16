import { useRouter } from "next/router";
import { useEffect } from "react";
import AdminDashboard from "../components/admin/AdminDashboard";
import ClientDashboard from "../components/client/dashboard/ClientDashboard";
import CreativeDirDashboard from "../components/creative_director/CreativeDirDashboard";
import DesignerDashboard from "../components/designer/dashboard/DesignerDashboard";
import ProjectManagerDashboard from "../components/project_manager/dashboard/ProjectManagerDashboard";
import SuperAdminDashboard from "../components/su_admin/SuperAdminDashboard";
import { useAuth } from "../hooks/useAuth";

function Dashboard({ PUSHER_APP_KEY, PUSHER_CLUSTER }) {
  let { role } = useAuth();
  let router = useRouter();

  // "admin", "project_manager", "designer", "super_admin", "customer", "creative_director"

  useEffect(() => {
    if (!role) {
      router.push("/login");
    }
  }, []);

  switch (role) {
    case "super_admin":
      return <SuperAdminDashboard />;

    case "admin":
      return <AdminDashboard />;

    case "project_manager":
      return <ProjectManagerDashboard />;

    case "designer":
      return <DesignerDashboard PUSHER_APP_KEY={PUSHER_APP_KEY} PUSHER_CLUSTER={PUSHER_CLUSTER} />;

    case "creative_director":
      return <CreativeDirDashboard />

    case "client_admin":
    case "client_member":
      return <ClientDashboard />;
  }

  return <h1>Loading..</h1>;
}

export default Dashboard;

export async function getServerSideProps() {
  try {

    return {
      props: {
        PUSHER_APP_KEY: process.env.PUSHER_APP_KEY,
        PUSHER_CLUSTER: process.env.PUSHER_CLUSTER,
      }
    }
  } catch (e) {
    return {
      props: {
        PUSHER_APP_KEY: process.env.PUSHER_APP_KEY,
        PUSHER_CLUSTER: process.env.PUSHER_CLUSTER,
      }
    }
  }
}