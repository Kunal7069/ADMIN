import React, { useEffect, useState } from 'react';
import Header from "./Header";
import { Search, MapPin, ArrowRight, Loader } from 'lucide-react';

function Route_Info() {
  const [routes, setRoutes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    fetch('https://admin-server-al2u.onrender.com/get_routes')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setRoutes(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching routes:', error);
        setError(error.message);
        setIsLoading(false);
      });
  }, []);

  const filteredRoutes = routes.filter(route =>
    route.routeno.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Route Information</h2>

        {/* Search Bar */}
        <div className="mb-6 flex justify-center">
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by Route No..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <Loader className="animate-spin h-12 w-12 text-blue-500 mx-auto" />
            <p className="mt-4 text-gray-600">Loading routes...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            <p>Error: {error}</p>
            <p>Please try again later or contact support.</p>
          </div>
        ) : (
          /* Route Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRoutes.length > 0 ? (
              filteredRoutes.map((route) => (
                <div key={route._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-800">Route {route.routeno}</h3>
                    </div>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="mr-2" size={18} />
                      <span className="font-medium">Start:</span> { route.startpoint}
                    </div>
                    <div className="flex items-center text-gray-600 mb-4">
                      <MapPin className="mr-2" size={18} />
                      <span className="font-medium">End: </span> { route.endpoint}
                    </div>
                    <div className="text-gray-600">
                      <span className="font-medium">Stops:</span>
                      <p className="text-sm mt-1">
                        {route.route.map((stop, index) => (
                          <span key={index} className="flex items-center">
                            <MapPin className="mr-1" size={14} />
                            {stop.label}
                          </span>
                        ))}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                No matching routes found
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default Route_Info;

