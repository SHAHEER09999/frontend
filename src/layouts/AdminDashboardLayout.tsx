import { Outlet } from 'react-router'
import AdminDashboard from '../pages/AdminDashboard'

const AdminDashboardLayout = () => {
  return (
    <div className="flex  bg-gray-100">
      <AdminDashboard />
      <div className="flex-1 p-6 overflow-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 h-full">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardLayout