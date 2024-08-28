import { useState, useEffect } from "react";
import Header from "./Header";
import Select from "react-select";

export default function Add_Route() {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [routeno, setRouteno] = useState("");
  const [startpoint, setStartpoint] = useState("");
  const [endpoint, setEndpoint] = useState("");
  const [options, setOptions] = useState([]);
  const [options_3, setOptions_3] = useState([]);
  const [route, setRoute] = useState([]);
  const [showNextStationText, setShowNextStationText] = useState(false);
 

  useEffect(() => {
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
  }, []);

  const handleInitialSubmit = (e) => {
    e.preventDefault();
    setPopupVisible(true);
  };

  const handleChange_3 = (option, actionMeta) => {
    if (option) {
      setRoute((prevOptions) => [...prevOptions, option]);
      setShowNextStationText(true);
    }
  };

 
  const handlePopupSubmit = async (e) => {
    e.preventDefault();
    console.log('Selected Options:', route);
    // Handle form submission logic here
    try {
              const response = await fetch("https://admin-server-al2u.onrender.com/save_route", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  routeno,
                  startpoint,
                  endpoint,
                  route,
            
                }),
              });
        
              if (response.ok) {
                console.log("Route saved successfully");
              } else {
                console.error("Failed to save bus stop");
              }
            } catch (error) {
              console.error("Error:", error);
            }
            setRouteno("");
            setStartpoint("");
            setEndpoint("");
            setRoute([]);
            setPopupVisible(false);
  };
  




  return (
    <>
      <Header />
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-2 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            ADD ROUTE
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleInitialSubmit} className="space-y-6">
            <div>
              <label htmlFor="bus_no" className="block text-sm font-medium leading-6 text-gray-900">
                ROUTE NO
              </label>
              <div className="mt-2">
                <input
                  id="route_no"
                  name="route_no"
                  type="text"
                  required
                  value={routeno}
                  onChange={(e) => setRouteno(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="startpoint" className="block text-sm font-medium leading-6 text-gray-900">
                START POINT
              </label>
              <div className="mt-2">
                <select
                  name="startpoint"
                  value={startpoint}
                  required
                  onChange={(e) => setStartpoint(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >
                  <option value="">Select an option</option>
                  {options.map((option, i) => (
                    <option key={i} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="endpoint" className="block text-sm font-medium leading-6 text-gray-900">
                END POINT
              </label>
              <div className="mt-2">
                <select
                  name="endpoint"
                  value={endpoint}
                  required
                  onChange={(e) => setEndpoint(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >
                  <option value="">Select an option</option>
                  {options.map((option, i) => (
                    <option key={i} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Next
              </button>
            </div>
          </form>
        </div>
      </div>

      {isPopupVisible && (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            SELECTED ROUTE
          </h3>
          <form onSubmit={handlePopupSubmit} className="space-y-4">
            {/* Render selected options with corresponding input fields */}
            {route.map((option, index) => (
              <div key={index}>
                <label htmlFor={`input-${index}`} className="block text-sm font-medium leading-6 text-gray-900">
                  {index + 1}. {option.label}
                </label>
              
              </div>
            ))}

            {/* Show "Select next station" text after a station is selected */}
            

            {/* Render select dropdown for new option */}
            <div>
              <label htmlFor="route" className="block text-sm font-medium leading-6 text-gray-900">
                SELECT NEXT STATION
              </label>
              <Select
                name="route"
                options={options_3}
                onChange={handleChange_3}
                className="basic-select"
                classNamePrefix="select"
                placeholder="Select Route"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                SAVE ROUTE
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
    
    </>
  );
}
