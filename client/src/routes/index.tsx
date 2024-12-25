import SignIn from "@/pages/sign-in";
import SignUp from "@/pages/sign-up";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
	{
		path: '/sign-in',
		element: <SignIn />,
	},
	{
		path: '/sign-up',
		element: <SignUp />,
	},
]);