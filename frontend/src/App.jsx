import { useEffect, useState } from "react";
import Splash from "./pages/Splash";
import Intro from "./pages/Intro";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Student from "./pages/Student";
import Verifier from "./pages/Verifier";
import Blockchain from "./pages/Blockchain";
import History from "./pages/History";
import Layout from "./components/Layout";

export default function App() {
  const [stage, setStage] = useState("splash");
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");

  useEffect(() => {
    const timer = setTimeout(() => setStage("intro"), 2200);
    return () => clearTimeout(timer);
  }, []);

  function handleLogin(userData) {
    setUser(userData);
    setPage("dashboard");
    setStage("app");
  }

  function logout() {
    setUser(null);
    setPage("dashboard");
    setStage("login");
  }

  if (stage === "splash") return <Splash />;
  if (stage === "intro") return <Intro onProceed={() => setStage("login")} />;
  if (stage === "login" || !user) return <Login onLogin={handleLogin} />;

  return (
    <Layout user={user} page={page} setPage={setPage} onLogout={logout}>
      {page === "dashboard" && user.role === "admin" && <Admin />}
      {page === "dashboard" && user.role === "student" && <Student user={user} />}
      {page === "dashboard" && user.role === "verifier" && <Verifier />}
      {page === "blockchain" && <Blockchain />}
      {page === "history" && <History />}
    </Layout>
  );
}
