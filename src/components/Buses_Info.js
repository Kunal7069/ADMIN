import React, { useEffect, useState } from 'react';
import Header from "./Header";
import { Search, Bus, Users, Map, ArrowUpDown } from 'lucide-react';

function Buses_Info() {
  const [buses, setBuses] = useState([]);
  const [busnoSearch, setBusnoSearch] = useState('');
  const [routeSearch, setRouteSearch] = useState('');
  const [sortBy, setSortBy] = useState('busno');
  const [sortOrder, setSortOrder] = useState('asc');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    fetch('https://admin-server-al2u.onrender.com/get_bus_details')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setBuses(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching buses:', error);
        setError(error.message);
        setIsLoading(false);
      });
  }, []);

  const filteredBuses = buses.filter(bus =>
    bus.busno.toLowerCase().includes(busnoSearch.toLowerCase()) &&
    bus.route.some(route => route.toLowerCase().includes(routeSearch.toLowerCase()))
  );

  const sortedBuses = [...filteredBuses].sort((a, b) => {
    if (a[sortBy] < b[sortBy]) return sortOrder === 'asc' ? -1 : 1;
    if (a[sortBy] > b[sortBy]) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (field) => {
    if (field === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Bus Information</h2>

        {/* Search Bars */}
        <div className="mb-6 flex flex-col md:flex-row justify-center items-center gap-4">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Bus No..."
              value={busnoSearch}
              onChange={(e) => setBusnoSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
          <div className="relative w-full md:w-1/3">
            <Map className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Route..."
              value={routeSearch}
              onChange={(e) => setRouteSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
        </div>

        {/* Sort Controls */}
        <div className="mb-4 flex justify-end">
          <button
            onClick={() => handleSort('busno')}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Sort by Bus No
            <ArrowUpDown className="ml-2" size={16} />
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading buses...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            <p>Error: {error}</p>
            <p>Please try again later or contact support.</p>
          </div>
        ) : (
          /* Bus Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedBuses.length > 0 ? (
              sortedBuses.map((bus) => (
                <div key={bus._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-800">{bus.busno}</h3>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {bus.bustype}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600 mb-2">
                      <Users className="mr-2" size={18} />
                      <span>{bus.totalseats} seats</span>
                    </div>
                    <div className="flex items-start text-gray-600">
                      <Map className="mr-2 mt-1 flex-shrink-0" size={18} />
                      <p className="text-sm">{bus.route.join(' , ')}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                No matching buses found
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default Buses_Info;