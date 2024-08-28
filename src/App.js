import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Header from "./components/Header";
import Add_Bus_Station from "./components/Add_Bus_Station";
import Add_Bus from "./components/Add_Bus";
import Add_Route from "./components/Add_Route";
import Edit_Bus_TimeTable from "./components/Edit_Bus_TimeTable";
import Add_Bus_Route_Timetable from "./components/Add_Bus_Route_Timetable";
import Bus_Info from "./components/Bus_Info";
import Buses_Info from "./components/Buses_Info";
import Login from "./components/Login";
import Homepage from "./components/Homepage";
import Route_Info from "./components/Route_Info";
import { components } from "react-select";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/add_bus_station" element={<Add_Bus_Station />} />
        <Route path="/add_bus" element={<Add_Bus />} />
        <Route path="/add_route" element={<Add_Route />} />
        <Route
          path="/add_bus_route_timetable"
          element={<Add_Bus_Route_Timetable />}
        />
        <Route path="/buses_info" element={<Buses_Info />} />
        <Route path="/routes_info" element={<Route_Info />} />
      </Routes>
    </Router>
  );
}
