import React, { useState, useEffect } from 'react';
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { UserIcon, BusIcon, ChartBarIcon, ClockIcon } from '@heroicons/react/solid';
import Header from './Header';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js/auto';
export default function Homepage() {
  const [busCount, setBusCount] = useState(null);
  const [routeCount, setRouteCount] = useState(null);
  const [busData, setBusData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [userNo, setUserNo] = useState([]);
  const [Bookings, setBookings] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the data from the API
    fetch('https://admin-server-al2u.onrender.com/get_bus_analyses')
      .then(response => response.json())
      .then(data => {
        setBusCount(data.length);
        setBusData(data);
        setLoading(false);
      })
      .catch(error => console.error('Error fetching data:', error));

    // fetch('http://localhost:5000/users')
    // .then(response => response.json())
    // .then(data => {
    //   setUserData(data);
    //   console.log("LEN",data.length)
    //   setUserNo(data.length)
    //   setLoading(false);
    // })
    // .catch(error => console.error('Error fetching data:', error));

    fetch('https://admin-server-al2u.onrender.com/get_routes')
    .then(response => response.json())
    .then(data => {
      setRouteCount(data.length)
      setLoading(false);
    })
    .catch(error => console.error('Error fetching data:', error));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-2xl font-semibold text-gray-900">Loading...</div>
      </div>
    );
  }
  
  Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

  // Function to get the user count per date
  const getUserCountPerDate = () => {
    const userCountPerDate = {};
    userData.forEach((user) => {
      const createdDate = new Date(user.createdAt._seconds * 1000).toISOString().split('T')[0];
      if (userCountPerDate[createdDate]) {
        userCountPerDate[createdDate]++;
      } else {
        userCountPerDate[createdDate] = 1;
      }
    });
    return userCountPerDate;
  };

  // Prepare the data for the bar graph
  const userCountPerDate = getUserCountPerDate();
  const labels = Object.keys(userCountPerDate);
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Users Per Date',
        data: Object.values(userCountPerDate),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        precision: 0,
      },
    },
    plugins: {
      title: {
        display: true,
        text: 'Users Per Date',
      },
    },
  };
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 p-4">
        <header className="bg-white shadow py-2 mb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-gray-900">Bus Management Dashboard</h1>
          </div>
        </header>

        <main className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {/* Total Buses */}
        <div className="bg-white shadow rounded-lg p-4">
          <div className="text-md font-semibold text-gray-900">Total Buses</div>
          <div className="text-xl font-bold text-indigo-600 mt-2">{busCount}</div>
        </div>

        {/* Total Users */}
        <div className="bg-white shadow rounded-lg p-4">
          <div className="text-md font-semibold text-gray-900">Total Users</div>
          <div className="text-xl font-bold text-indigo-600 mt-2">{userNo}</div>
        </div>
       
        <div className="bg-white shadow rounded-lg p-4">
          <div className="text-md font-semibold text-gray-900">Total Active Routes</div>
          <div className="text-xl font-bold text-indigo-600 mt-2">{routeCount}</div>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <div className="text-md font-semibold text-gray-900">Total Bookings</div>
          <div className="text-xl font-bold text-indigo-600 mt-2">{Bookings}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="bg-white shadow rounded-lg p-4">
          <div className="text-lg font-semibold text-gray-900 mb-2">Bus Details</div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead>
                <tr>
                  <th className="px-2 py-1 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bus No</th>
                  <th className="px-2 py-1 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Seats</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {busData.map((bus, index) => (
                  <tr key={index}>
                    <td className="px-2 py-1 whitespace-nowrap">{bus.busno}</td>
                    <td className="px-2 py-1 whitespace-nowrap">{bus.totalseats}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <div className="text-lg font-semibold text-gray-900 mb-2">Users Per Date</div>
          <Bar data={data} options={options} />
        </div>
      </div>
    </main>
      </div>
    </>
  );
}
