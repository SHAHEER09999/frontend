import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router";
import Home from "./pages/Home";
import RootLayout from "./layouts/RootLayout";
import LoginLayout from "./layouts/LoginLayout";
import SignUpLayout from "./layouts/SignUpLayout";
import ProfileLayout from "./layouts/ProfileLayout";
import CheckEmail from "./pages/CheckEmail";
import EmailConfirmed from "./pages/EmailConfirmed";
import ProtectedRoute from "./components/ProtectedRoutes";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import DeleteError from "./pages/AccountDeleteError";
import AccountDeleted from "./pages/AccountDeleted";

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
        <Route path="profile" element={
          <ProtectedRoute>
            <ProfileLayout />
          </ProtectedRoute>
        } />
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
