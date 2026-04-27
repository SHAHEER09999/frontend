import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router";
import Home from "./pages/Home";
import RootLayout from "./layouts/RootLayout";
import LoginLayout from "./layouts/LoginLayout";
import SignUpLayout from "./layouts/SignUpLayout";
import CheckEmail from "./pages/CheckEmail";
import EmailConfirmed from "./pages/EmailConfirmed";
import ProtectedRoute from "./components/ProtectedRoutes";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import DeleteError from "./pages/AccountDeleteError";
import AccountDeleted from "./pages/AccountDeleted";
import UserDashboardLayout from "./layouts/USerDashboardLayout";
import Profile from "./components/ui/Profile";
import Campaigns from "./components/Campaigns";
import Chats from "./components/Chats";
import Meetings from "./components/ui/Meetings";
import Accounts from "./components/Accounts";

function App() {

  const routers = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />} >
        <Route index element={<Home />} />
        <Route path="login" element={<LoginLayout />} />
        <Route path="signup" element={<SignUpLayout />} />
        <Route path="check-email" element={<CheckEmail />} />
        <Route path="email-confirmed" element={<EmailConfirmed />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="User-Dashboard" element={
          <ProtectedRoute>
            <UserDashboardLayout />
          </ProtectedRoute>
        } >
          <Route index element={<Profile />} />
          <Route path="profile" element={<Profile />} />
          <Route path="campaigns" element={<Campaigns />} />
          <Route path="chats" element={<Chats />} />
          <Route path="meetings" element={<Meetings />} />
          <Route path="accounts" element={<Accounts />} />
        </Route>
        <Route path="/account-deleted" element={<AccountDeleted />} />
        <Route path="/delete-error" element={<DeleteError />} />
      </Route>
    )
  )
  

  return (
    <>
      <RouterProvider router={routers} />
    </>
  );
}

export default App;
