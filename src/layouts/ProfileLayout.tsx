import Profile from '../pages/UserDashboard'
import { Outlet } from 'react-router'

const ProfileLayout = () => {
  return (
    <div>
        <Profile />
        <Outlet />
    </div>
  )
}

export default ProfileLayout