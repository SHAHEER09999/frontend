import Profile from '../pages/Profile'
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