import { useState, useEffect } from "react";
import Header from "./Header";
import Select from "react-select";

export default function Add_Bus_Route_Timetable() {
  const [busno, setBusno] = useState("");
  const [routeno, setRouteno] = useState("");
  const [routes, setRoutes] = useState([]);
  const [buses, setBuses] = useState([]);
  const [routeDetails, setRouteDetails] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [rows, setRows] = useState([
    { station: "", arrival_time: "", departure_time: "" },
  ]);
  const [options, setOptions] = useState([]);
  const [allDaysSelected, setAllDaysSelected] = useState(false);

  const [options_3, setOptions_3] = useState([]);
  const [isDayModalOpen, setIsDayModalOpen] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);
  const [showOverlay, setShowOverlay] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConflictPopup, setShowConflictPopup] = useState(false);
  const [conflictingData, setConflictingData] = useState([]);
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const response = await fetch("https://admin-server-al2u.onrender.com/get_buses"); // Replace with your bus API endpoint
        const data = await response.json();
        setBuses(data);
      } catch (error) {
        console.error("Error fetching buses:", error);
      }
    };

    const fetchRoutes = async () => {
      try {
        const response = await fetch("https://admin-server-al2u.onrender.com/get_route_numbers"); // Replace with your route API endpoint
        const data = await response.json();
        setRoutes(data);
      } catch (error) {
        console.error("Error fetching routes:", error);
      }
    };
    const fetchBusStations = async () => {
      try {
        const response = await fetch("https://admin-server-al2u.onrender.com/get_bus_stations");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setOptions(data);
        const formattedOptions = data.map((station) => ({
          value: station,
          label: station,
        }));
        setOptions_3(formattedOptions);
      } catch (error) {
        console.log(error);
      }
    };

    fetchBusStations();
    fetchBuses();
    fetchRoutes();
  }, []);
  const handleToggleAllDays = () => {
    if (allDaysSelected) {
      setSelectedDays([]);
      setAllDaysSelected(false);
    } else {
      setSelectedDays([...daysOfWeek]);
      setAllDaysSelected(true);
    }
  };

  const handleDayChange_1 = (e) => {
    const { value, checked } = e.target;
    setSelectedDays((prev) =>
      checked ? [...prev, value] : prev.filter((day) => day !== value)
    );
    setAllDaysSelected(checked && selectedDays.length === daysOfWeek.length - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://admin-server-al2u.onrender.com/check_busno_routeno",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ busno, routeno }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to check bus and route");
      }

      const data = await response.json();
      if (data.exists) {
        try {
          const response = await fetch(
            "https://admin-server-al2u.onrender.com/get_route_via_routeno",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ routeno }), // Sending the selected route number
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch route details");
          }

          const data = await response.json();
          setRouteDetails(data);
        } catch (error) {
          console.error("Error fetching route details:", error);
        }

        try {
          const response = await fetch(
            "https://admin-server-al2u.onrender.com/get_timetable_days",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ busno, routeno }),
            }
          );

          const data = await response.json();
          setRows(data["timetable"]);
          setSelectedDays(data["days"]);
          setIsModalOpen(true);
          setLoading(false);
        } catch (error) {
          console.error("Error checking bus and route:", error);
        }
      } else {
        setShowOverlay(true); // Show overlay if bus and route do not match
        setLoading(false);
      }
    } catch (error) {
      console.error("Error checking bus and route:", error);
      setLoading(false);
    }
  };
  const closeOverlay = () => {
    setShowOverlay(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const addRow = () => {
    setRows([...rows, { station: "", arrival_time: "", departure_time: "" }]);
  };

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const updatedRows = rows.map((row, i) =>
      i === index ? { ...row, [name]: value } : row
    );
    setRows(updatedRows);
  };
  const handleTimetableSubmit = async (e) => {
    e.preventDefault();

    setIsModalOpen(false);
    setIsDayModalOpen(true); // Open the days modal after submitting timetable
  };

  const handleDayChange = (e) => {
    const { value, checked } = e.target;
    setSelectedDays((prev) =>
      checked ? [...prev, value] : prev.filter((day) => day !== value)
    );
  };

  const finalSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://admin-server-al2u.onrender.com/check_time_table", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          busno,
          routeno,
          selectedDays,
          rows,
        }),
      });
      const data = await response.json();

      if (data.length === 0) {
        try {
          const response = await fetch(
            "https://admin-server-al2u.onrender.com/update_bus_route",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                busno,
                routeno,
                selectedDays,
                rows,
              }),
            }
          );

          if (response.ok) {
            console.log("Route saved successfully");
          } else {
            console.error("Failed to save bus stop");
          }
        } catch (error) {
          console.error("Error:", error);
        }
      } else {
        console.log("THERE ARE CONFLICTS");
        setConflictingData(data);
        setShowConflictPopup(true);
      }
    } catch (error) {
      console.error("Error:", error);
    }

    setIsDayModalOpen(false);
  };
  const closeConflictPopup = () => setShowConflictPopup(false);

  return (
    <>
      <Header />
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-2 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            EDIT BUS ROUTE TIME TABLE
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="bus_no"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                BUS NO
              </label>
              <select
                name="busno"
                value={busno}
                required
                onChange={(e) => setBusno(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="">Select an option</option>
                {buses.map((option, i) => (
                  <option key={i} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="routeno"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                ROUTE NO
              </label>
              <select
                name="routeno"
                value={routeno}
                required
                onChange={(e) => setRouteno(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="">Select an option</option>
                {routes.map((option, i) => (
                  <option key={i} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Continue
              </button>
            </div>
          </form>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full">
            <div className="mb-4 flex items-center justify-center">
              {routeDetails.map((stop, index) => (
                <div key={index} className="flex items-center">
                  <span className="text-lg">{stop}</span>
                  {index !== routeDetails.length - 1 && (
                    <span className="mx-2 text-gray-500 text-lg">&rarr;</span> // Arrow symbol
                  )}
                </div>
              ))}
            </div>
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              Edit The Time Table
            </h3>
            <form onSubmit={handleTimetableSubmit}>
              <table className="min-w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border px-4 py-2">Station</th>
                    <th className="border px-4 py-2">Arrival Time</th>
                    <th className="border px-4 py-2">Departure Time</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr key={index}>
                      <td className="border px-4 py-2">
                        <select
                          name="station"
                          value={row.station}
                          onChange={(e) => handleInputChange(index, e)}
                          className="w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        >
                          <option value="">Select a station</option>
                          {options.map((station, i) => (
                            <option key={i} value={station}>
                              {station}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="border px-4 py-2">
                        <input
                          type="time"
                          name="arrival_time"
                          value={row.arrival_time}
                          onChange={(e) => handleInputChange(index, e)}
                          className="w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </td>
                      <td className="border px-4 py-2">
                        <input
                          type="time"
                          name="departure_time"
                          value={row.departure_time}
                          onChange={(e) => handleInputChange(index, e)}
                          className="w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={addRow}
                  className="rounded-md bg-gray-200 px-3 py-1.5 text-sm font-semibold leading-6 text-gray-700 shadow-sm hover:bg-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Add Row
                </button>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

{showConflictPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full max-h-[80vh] flex flex-col">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              There are conflicts in the bus timetable.
            </h3>
            <div className="mt-4 overflow-y-auto flex-grow">
              {conflictingData.map((dayData, index) => (
                <div key={index} className="mb-4">
                  <h4 className="text-md font-semibold text-gray-800">
                    {dayData.day}
                  </h4>
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700">
                      Conflicting Stations:
                    </p>
                    <ul className="list-disc pl-5">
                      {dayData.conflictingStations.map((station, i) => (
                        <li key={i} className="text-sm text-gray-600">
                          {station}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700">
                      Conflicting Times:
                    </p>
                    <div className="overflow-x-auto">
                      <table className="min-w-full border-collapse mt-2">
                        <thead>
                          <tr>
                            <th className="border px-4 py-2">Station</th>
                            <th className="border px-4 py-2">Arrival Time</th>
                            <th className="border px-4 py-2">Departure Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dayData.conflictingTimes.map((time, i) => (
                            <tr key={i}>
                              <td className="border px-4 py-2">{time.station}</td>
                              <td className="border px-4 py-2">
                                {time.arrival_time}
                              </td>
                              <td className="border px-4 py-2">
                                {time.departure_time}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeConflictPopup}
                className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="text-white text-lg">Loading...</div>
        </div>
      )}
      {showOverlay && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              THIS BUS IS NOT ADDED TO THIS ROUTE
            </h3>
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeOverlay}
                className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
   {isDayModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              Update Operating Days
            </h3>
            <form onSubmit={finalSubmit}>
              <div className="mb-4 flex justify-center">
                <button
                  type="button"
                  onClick={handleToggleAllDays}
                  className="rounded-md bg-blue-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-600"
                >
                  {allDaysSelected ? "Deselect All" : "Select All"}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {daysOfWeek.map((day) => (
                  <label key={day} className="flex items-center">
                    <input
                      type="checkbox"
                      value={day}
                      checked={selectedDays.includes(day)}
                      onChange={handleDayChange}
                      className="mr-2"
                    />
                    {day}
                  </label>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </>
  );
}
