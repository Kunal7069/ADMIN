import React, { useEffect, useState } from 'react';
import Header from "./Header";

function Bus_Info() {
  const [searchTerm, setSearchTerm] = useState('');
  const [buses, setBuses] = useState([]);
  const [filteredBuses, setFilteredBuses] = useState([]);
  const [busdata, setBusdata] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch buses from the API
  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const response = await fetch('https://admin-server-al2u.onrender.com/get_buses');
        if (response.ok) {
          const data = await response.json();
          console.log("BUSES",data)
          setBuses(data);
        }
      } catch (error) {
        console.log("Error fetching buses:", error);
      }
    };

    fetchBuses();
  }, []);

  // Filter buses based on searchTerm
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredBuses(buses);
    } else {
      setFilteredBuses(
        buses.filter(([busNo]) => busNo.includes(searchTerm))
      );
    }

  }, [searchTerm, buses]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleClick = async (busNo) => {
    try {
      console.log("BUS NO 2",busNo)
      const response = await fetch("https://admin-server-al2u.onrender.com/get_bus_details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ busno: busNo }),
      });
      const data = await response.json();
      console.log("BUS data ",data)
      setBusdata(data);
      setModalOpen(true);
    } catch (error) {
      console.log("Error fetching bus details:", error);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <Header />
      <div className="mt-8 mb-8 flex justify-center">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search by Bus No"
          className="border rounded p-2 w-64"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {filteredBuses.length ? (
          filteredBuses.map(([busNo, startingStation, endingStation], index) => (
            <div key={index} className="bg-white rounded overflow-hidden shadow-lg border-2 border-gray-500 p-4">
              <div className="mb-4">
                <div className="font-bold text-lg mb-1">Bus Details</div>
                <p className="text-gray-700 text-sm mb-2">
                  <strong>Bus No:</strong> {busNo}
                </p>
                <p className="text-gray-700 text-sm mb-2">
                  <strong>Starting Station:</strong> {startingStation}
                </p>
                <p className="text-gray-700 text-sm mb-2">
                  <strong>Ending Station:</strong> {endingStation}
                </p>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() =>{handleClick(busNo);
                    console.log("BUS NO",busNo)
                  } }
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Bus Details</h2>
            {busdata ? (
              <>
                <table className="min-w-full divide-y divide-gray-200 mb-4">
                  <tbody className="bg-gray-50 divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-2 font-medium text-gray-700">Bus No:</td>
                      <td className="px-4 py-2">{busdata.busno}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium text-gray-700">Starting Point:</td>
                      <td className="px-4 py-2">{busdata.startpoint}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium text-gray-700">Ending Point:</td>
                      <td className="px-4 py-2">{busdata.endpoint}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium text-gray-700">Bus Type:</td>
                      <td className="px-4 py-2">{busdata.bustype}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium text-gray-700">Total Seats:</td>
                      <td className="px-4 py-2">{busdata.totalseats}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-medium text-gray-700">Price per Stop:</td>
                      <td className="px-4 py-2">{busdata.priceperstop}</td>
                    </tr>
                  </tbody>
                </table>
                <h3 className="text-lg font-semibold mb-2">Route</h3>
                <ul className="list-disc pl-5 mb-4">
                  {busdata.route.map((station, index) => (
                    <li key={index} className="text-gray-700">{station}</li>
                  ))}
                </ul>
                <h3 className="text-lg font-semibold mb-2">Schedule</h3>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold text-gray-600">Station</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-600">Arrival Time</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-600">Departure Time</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-50 divide-y divide-gray-200">
                    {busdata.rows.map((row, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2">{row.station}</td>
                        <td className="px-4 py-2">{row.arrival_time}</td>
                        <td className="px-4 py-2">{row.departure_time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            ) : (
              <p>Loading details...</p>
            )}
            <button
              onClick={closeModal}
              className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Bus_Info;
