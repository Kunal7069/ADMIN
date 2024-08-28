import React, { useState } from "react";
import Header from "./Header";
export default function Edit_Bus_TimeTable() {
  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const [busno, setBusno] = useState("");
  const [tableData, setTableData] = useState(null);
  // Use initial data

  // Function to handle input change
  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newTableData = [...tableData];
    newTableData[index][name] = value;
    setTableData(newTableData);
  };

  // Function to get updated data
  const getUpdatedData = async (e) => {
    e.preventDefault();
    console.log("Updated Table Data:", tableData);

    try {
      const response = await fetch(
        "https://admin-server-al2u.onrender.com/update_bus_timetable",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            busno: busno,
            rows: tableData,
          }),
        }
      );
      const data = await response.json();
      console.log("DATA", data);
    } catch (error) {
      console.log(error);
    }
    setOverlayVisible(false);
    setBusno("");
  };
  const handleChange = (e) => {
    setBusno(e.target.value);
  };
  const handleClick = async (e) => {
    e.preventDefault();
    console.log(busno);
    try {
      const response = await fetch("https://admin-server-al2u.onrender.com/get_bus_timetable", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          busno: busno,
        }),
      });
      const data = await response.json();
      console.log("DATA", data);
      setTableData(data);
      setOverlayVisible(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Header />
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-1 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            EDIT BUS TIME TABLE
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm space-y-6">
          <div>
            <label
              htmlFor="email"
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
                onChange={handleChange}
                autoComplete="email"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <button
              onClick={handleClick}
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              FETCH THE TIME TABLE
            </button>
          </div>
        </div>
      </div>

      {isOverlayVisible && (
        <>
          <div className="fixed inset-0 flex items-start justify-center bg-gray-700 bg-opacity-50 z-50">
            <div className="mt-12 w-full max-w-4xl bg-white border-4 border-blue-500 p-4 overflow-x-auto">
              <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                <div className="overflow-hidden">
                  <table className="min-w-full text-center text-sm font-light text-black">
                    <thead className="border-b border-neutral-200 font-medium">
                      <tr>
                        <th scope="col" className="px-6 py-4">
                          STATION
                        </th>
                        <th scope="col" className="px-6 py-4">
                          ARRIVAL TIME
                        </th>
                        <th scope="col" className="px-6 py-4">
                          DEPARTURE TIME
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map((row, index) => (
                        <tr key={index} className="border-b border-neutral-200">
                          <td className="whitespace-nowrap px-6 py-4">
                            <input
                              type="text"
                              name="station"
                              value={row.station}
                              onChange={(event) =>
                                handleInputChange(index, event)
                              }
                              className="text-black px-2 py-1 rounded"
                            />
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <input
                              type="time"
                              name="arrival_time"
                              value={row.arrival_time}
                              onChange={(event) =>
                                handleInputChange(index, event)
                              }
                              className="text-black px-2 py-1 rounded"
                            />
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <input
                              type="time"
                              name="departure_time"
                              value={row.departure_time}
                              onChange={(event) =>
                                handleInputChange(index, event)
                              }
                              className="text-black px-2 py-1 rounded"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="mt-6 flex justify-center">
                <button
                  onClick={getUpdatedData}
                  className="px-4 py-2 bg-green-500 text-white font-semibold rounded-md shadow hover:bg-green-600"
                >
                  UPDATE TIME TABLE
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
