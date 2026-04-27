import { Outlet } from 'react-router'
import UserDashboard from '../pages/UserDashboard'

const UserDashboardLayout = () => {
  return (
    <div className="flex  bg-gray-100">
      <UserDashboard />
      <div className="flex-1 p-6 overflow-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 h-full">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default UserDashboardLayout