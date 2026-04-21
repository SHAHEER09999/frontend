import SignUp from '../pages/SignUp'
import { Outlet } from 'react-router'

const SignUpLayout = () => {
  return (
    <div>
      <SignUp />
      <Outlet />
    </div>
  )
}

export default SignUpLayout