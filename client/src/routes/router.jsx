import { createBrowserRouter } from "react-router";
import App from "../App";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <div>Home</div>,
      },
      {
        path: "/orders",
        element: <div>Orders</div>,
      },
      {
        path: "/products",
        element: <div>Products</div>,
      },
    ],
  },
]);

export default Router;
