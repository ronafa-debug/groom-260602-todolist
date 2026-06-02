import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Layout } from "./components/Layout";
import { Calendar } from "./pages/Calendar";
import { Habit } from "./pages/Habit";
import { Timetable } from "./pages/Timetable";
import { Completed } from "./pages/Completed";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Today } from "./pages/Today";
import { Upcoming } from "./pages/Upcoming";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="today" element={<Today />} />
            <Route path="upcoming" element={<Upcoming />} />
            <Route path="completed" element={<Completed />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="timetable" element={<Timetable />} />
            <Route path="habit" element={<Habit />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
