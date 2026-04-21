import Navbar from '../components/ui/Navbar'
import { Outlet } from 'react-router'

const RootLayout = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  )
}

export default RootLayout