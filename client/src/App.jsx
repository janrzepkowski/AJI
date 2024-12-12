import "./App.css";
import { Outlet } from "react-router";

function App() {
  return (
    <>
      <nav>navbar</nav>
      <main className="min-h-screen">
        <Outlet />
      </main>
      <footer>footer</footer>
    </>
  );
}

export default App;
