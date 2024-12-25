import { router } from "@/routes";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Toaster position="top-right" closeButton duration={2000} />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
