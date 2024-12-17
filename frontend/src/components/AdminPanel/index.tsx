import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';

export function AdminPanel() {
  const [assetData, setAssetData] = useState({
    asset: '',
    price: '',
  });

  const handlePriceUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle price update
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Emergency Controls
        </h2>
        <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-red-900">Emergency Stop</p>
              <p className="text-sm text-red-700">
                Disable all platform operations
              </p>
            </div>
          </div>
          <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
            Stop Platform
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Price Feed Updates
        </h2>
        <form onSubmit={handlePriceUpdate}>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Asset
              </label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={assetData.asset}
                onChange={(e) =>
                  setAssetData({ ...assetData, asset: e.target.value })
                }
                required
              >
                <option value="">Select asset</option>
                <option value="STX">STX</option>
                <option value="BTC">BTC</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price (USD)
              </label>
              <input
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={assetData.price}
                onChange={(e) =>
                  setAssetData({ ...assetData, price: e.target.value })
                }
                required
              />
            </div>
            <button
              type="submit"
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Update Price
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}