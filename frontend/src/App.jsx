import { Routes, Route, Navigate } from "react-router-dom"
import Login from "./Login"
import Verify from "./Verify"
import Welcome from "./Welcome"

export default function App() {
  const token = localStorage.getItem("token")

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/verify" element={<Verify />} />
      <Route
        path="/welcome"
        element={token ? <Welcome /> : <Navigate to="/" />}
      />
    </Routes>
  )
}
