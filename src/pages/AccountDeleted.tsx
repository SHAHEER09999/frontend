import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AccountDeleted() {
  const { logoutUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logoutUser(); // clears token + state

    setTimeout(() => {
      navigate("/signup");
    }, 2000);
  }, []);

  return (
    <div className="h-screen flex items-center justify-center">
      <h1>Your account has been deleted ❌</h1>
    </div>
  );
}