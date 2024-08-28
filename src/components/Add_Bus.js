import { useState, useEffect } from "react";
import Header from "./Header";
import Select from "react-select";

// Updated Overlay component
const Overlay = ({ routeNo, routeDetails, onClose, onSaveTimeTable }) => {
  const [timeTable, setTimeTable] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    if (routeDetails) {
      setTimeTable(
        routeDetails.map(station => ({
          station,
          arrival_time: '',
          departure_time: ''
        }))
      );
    }
  }, [routeDetails]);

  const handleTimeChange = (index, field, value) => {
    const updatedTimeTable = [...timeTable];
    updatedTimeTable[index][field] = value;
    setTimeTable(updatedTimeTable);
  };

  const handleDayToggle = (day) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleToggleAllDays = () => {
    setSelectedDays(prev => 
      prev.length === daysOfWeek.length ? [] : [...daysOfWeek]
    );
  };

  const handleSave = () => {
    onSaveTimeTable(timeTable, selectedDays);
    setSelectedDays([])
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-auto">
    <div className="bg-white p-6 rounded-lg max-w-6xl w-full m-4">
      <h2 className="text-xl mb-4">Route: {routeNo}</h2>
      
      <div className="flex">
        {/* Time Table Section */}
        <div className="flex-grow overflow-x-auto mr-4">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="border px-4 py-2">Station</th>
                <th className="border px-4 py-2">Arrival Time</th>
                <th className="border px-4 py-2">Departure Time</th>
              </tr>
            </thead>
            <tbody>
              {timeTable.map((row, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{row.station}</td>
                  <td className="border px-4 py-2">
                    <input
                      type="time"
                      value={row.arrival_time}
                      onChange={(e) => handleTimeChange(index, 'arrival_time', e.target.value)}
                      className="w-full"
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="time"
                      value={row.departure_time}
                      onChange={(e) => handleTimeChange(index, 'departure_time', e.target.value)}
                      className="w-full"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
  
        {/* Running Days Section */}
        <div className="w-48">
          <h3 className="text-lg font-semibold mb-2">Running Days</h3>
          <button
            onClick={handleToggleAllDays}
            className="mb-2 px-2 py-1 bg-blue-500 text-white rounded text-sm"
          >
            {selectedDays.length === daysOfWeek.length ? 'Deselect All' : 'Select All'}
          </button>
          {daysOfWeek.map(day => (
            <div key={day} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={day}
                checked={selectedDays.includes(day)}
                onChange={() => handleDayToggle(day)}
                className="mr-2"
              />
              <label htmlFor={day}>{day}</label>
            </div>
          ))}
        </div>
      </div>
  
      {/* Save Button */}
      <div className="mt-4 flex justify-end">
        <button 
          onClick={handleSave}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Save and Continue
        </button>
      </div>
    </div>
  </div>
  
  );
};


export default function Add_Bus() {
  const [busno, setBusno] = useState("");
  const [options, setOptions] = useState([]);
  const [options_3, setOptions_3] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bustype, setBustype] = useState("");
  const [totalseats, setTotalseats] = useState(0);
  const [showConflictPopup, setShowConflictPopup] = useState(false);
  const [conflictingData, setConflictingData] = useState([]);
  const [currentOverlayIndex, setCurrentOverlayIndex] = useState(-1);
  const [currentRouteDetails, setCurrentRouteDetails] = useState(null);

  const bus_type = ["A/C", "NON A/C"];

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await fetch(
          "https://admin-server-al2u.onrender.com/get_complete_routes"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("ROUTES ", data);
        const formattedOptions = data.map((station) => ({
          value: station["routeno"],
          label: station["routeno"],
        }));

        setOptions_3(formattedOptions);
        setLoading(false);
        console.log("ROUTES FINAL ", options_3);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    const route = selectedOptions.map((option) => option.value);
    console.log("FINAL", route);

    try {
      const response = await fetch("https://admin-server-al2u.onrender.com/save_bus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          busno,
          bustype,
          totalseats,
          route,
        }),
      });

      if (response.ok) {
        console.log("Bus saved successfully");
        setCurrentOverlayIndex(0);
        await fetchRouteDetails(route[0]);
      } else {
        console.error("Failed to save bus stop");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchRouteDetails = async (routeno) => {
    try {
      const response = await fetch(
        "https://admin-server-al2u.onrender.com/get_route_via_routeno",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ routeno }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        setCurrentRouteDetails(data);
      } else {
        console.error("Failed to fetch route details");
        setCurrentRouteDetails(null);
      }
    } catch (error) {
      console.error("Error fetching route details:", error);
      setCurrentRouteDetails(null);
    }
  };

  const handleSaveTimeTable = async (timeTable, selectedDays) => {
    const route = selectedOptions.map((option) => option.value);
    const currentRoute = route[currentOverlayIndex];
    console.log(`Busno :`, busno);
    console.log(`Time table for route ${currentRoute}:`, timeTable);
    console.log(`Running days for route ${currentRoute}:`, selectedDays);
    
    try {
      const response = await fetch("https://admin-server-al2u.onrender.com/check_time_table", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          busno,
          routeno:currentRoute,
          selectedDays,
          rows:timeTable,
        }),
      });
      const data = await response.json();
      if (data.length === 0) {
        try {
          const response = await fetch("https://admin-server-al2u.onrender.com/save_bus_route", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              busno,
              routeno: currentRoute,
              timeTable,
              selectedDays,
            }),
          });
    
          if (response.ok) {
            console.log("Bus route saved successfully");
          } else {
            console.error("Failed to save bus route");
          }
        } catch (error) {
          console.error("Error:", error);
        }

      }
      else{
        console.log("THERE ARE CONFLICTS",data);
        setConflictingData(data);
        try {
          const response = await fetch("https://admin-server-al2u.onrender.com/delete_bus_data", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              busno,
            }),
          });
    
          if (response.ok) {
            console.log("Bus Data Deleted");
          } else {
            console.error("Failed to delete bus data");
          }
        } catch (error) {
          console.error("Error:", error);
        }
        setShowConflictPopup(true);
      }

    }
    catch (error) {
      
      console.error("Error:", error);
    }


   
  };
  const closeConflictPopup = () => setShowConflictPopup(false);

  const handleOverlayClose = async () => {
    const route = selectedOptions.map((option) => option.value);
    
    if (currentOverlayIndex < route.length - 1) {
      const nextIndex = currentOverlayIndex + 1;
      setCurrentOverlayIndex(nextIndex);
      await fetchRouteDetails(route[nextIndex]);
    } else {
      setCurrentOverlayIndex(-1);
      setCurrentRouteDetails(null);
      setBusno("");
      setBustype("");
      setTotalseats(0);
      setSelectedOptions([]);
    }
  };

  const handleChange_3 = (selectedOptions) => {
    setSelectedOptions(selectedOptions || []);
  };

  if (loading) {
    return (
      <div className="flex min-h-full flex-1 flex-col justify-center items-center px-6 py-2 lg:px-8">
        <div className="text-center">
          <p className="text-lg font-medium leading-6 text-gray-900">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-2 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            ADD BUS
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleInitialSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="bus_no"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                BUS NO
              </label>
              <div className="mt-2">
                <input
                  id="bus_no"
                  name="bus_no"
                  type="text"
                  required
                  value={busno}
                  onChange={(e) => setBusno(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="bustype"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                BUS TYPE
              </label>
              <select
                name="bustype"
                value={bustype}
                required
                onChange={(e) => setBustype(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="">Select an option</option>
                {bus_type.map((option, i) => (
                  <option key={i} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="totalseats"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                TOTAL SEATS
              </label>
              <input
                id="totalseats"
                name="totalseats"
                type="number"
                required
                value={totalseats}
                onChange={(e) => setTotalseats(parseInt(e.target.value))}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>

            <div>
              <label
                htmlFor="route"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                ROUTES
              </label>
              <Select
                isMulti
                name="route"
                options={options_3}
                value={selectedOptions}
                onChange={handleChange_3}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Select Route"
              />
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>

      {currentOverlayIndex >= 0 && (
        <Overlay 
          routeNo={selectedOptions[currentOverlayIndex].value}
          routeDetails={currentRouteDetails}
          onClose={handleOverlayClose}
          onSaveTimeTable={handleSaveTimeTable}
        />
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

    </>
  );
}