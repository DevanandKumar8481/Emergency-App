import { Routes, Route } from "react-router-dom";
import Landing from "./Pages/Landing";
import Signup from "./Pages/SignUp";
import LoginPage from "./Pages/LoginPage";
import Donate from "./Pages/DonatePage";
import Volunteers from "./Pages/Volunteers";
import Dashboard from "./Pages/Dashboard";
import AdminPage from "./Pages/AdminPage";
import MapPage from "./Pages/MapPage";
import RequestPage from "./Pages/RequestPage";
import AlertsPage from "./Pages/AlertsPage";
import AnalyticsPage from "./Pages/AnalyticsPage";
import Navbar from "./Components/Navbar";
import Food from "./Pages/Food";
import Medicine from "./Pages/Medicine";
import Shelter from "./Pages/Shelter";
import Transport from "./Pages/Transport";
import TrackPage from "./Pages/TrackPage";
import ProfilePage from "./Pages/ProfilePage";
import BecomeDonor from "./Pages/BecomeDonor";
import { UserProvider } from "./Components/usercontext";


function App() {
  return (
    <UserProvider>
      <Navbar />

      <Routes>
        <Route path="/" element={<Landing />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/donate" element={<Donate />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/volunteers" element={<Volunteers />} />

        <Route path="/request" element={<RequestPage />} />
        <Route path="/alerts" element={<AlertsPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/adminpage" element={<AdminPage />} />
        <Route path="/volunteer" element={<Volunteers />} />

        <Route path="/medicine" element={<Medicine />} />
        <Route path="/food" element={<Food />} />
        <Route path="/shelter" element={<Shelter />} />
        <Route path="/transport" element={<Transport />} />
        <Route path="/trackpage" element={<TrackPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/becomeDonor" element={<BecomeDonor />} />
      </Routes>
    </UserProvider>
  );
}

export default App;