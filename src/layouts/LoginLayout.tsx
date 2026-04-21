import Login from '../pages/Login'
import { Outlet } from 'react-router'

const LoginLayout = () => {
  return (
    <div>
        <Login />
        <Outlet />
    </div>
  )
}

export default LoginLayout