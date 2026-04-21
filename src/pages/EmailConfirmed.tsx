import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function EmailConfirmed() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    if (params.get("verified") === "true") {
      setTimeout(() => navigate("/"), 1000);
    }
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-green-600 text-xl font-bold">
        Email Verified ✅ Redirecting...
      </h1>
    </div>
  );
}