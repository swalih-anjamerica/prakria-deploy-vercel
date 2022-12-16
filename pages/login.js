import Loader from "../components/layouts/Loader";
import LoginPage from "../components/user/LoginPage";
import { useAuthPageHook } from "../hooks/useRequireAuth";


function Login() {

  return (
    <div className="login-page">
      <LoginPage />
    </div>
  )
}

export default Login;

Login.getLayout = function LoginLayout({ children }) {


  let { isAuthenticated, loading } = useAuthPageHook();
  
  if (!isAuthenticated === null || loading) {
    return <Loader />
  }
  
  return (
    <>
      {
        children
      }
    </>
  )
}
