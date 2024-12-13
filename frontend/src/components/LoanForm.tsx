import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';

export function LoanForm() {
  const [formData, setFormData] = useState({
    amount: '',
    collateralAmount: '',
    collateralAsset: '',
    duration: '',
    interestRate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle loan creation
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Create Loan Request</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Loan Amount
            </label>
            <input
              type="number"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Collateral Amount
            </label>
            <input
              type="number"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.collateralAmount}
              onChange={(e) =>
                setFormData({ ...formData, collateralAmount: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Collateral Asset
            </label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.collateralAsset}
              onChange={(e) =>
                setFormData({ ...formData, collateralAsset: e.target.value })
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
              Duration (days)
            </label>
            <input
              type="number"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.duration}
              onChange={(e) =>
                setFormData({ ...formData, duration: e.target.value })
              }
              min="1"
              max="365"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Interest Rate (%)
            </label>
            <input
              type="number"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.interestRate}
              onChange={(e) =>
                setFormData({ ...formData, interestRate: e.target.value })
              }
              min="0"
              max="50"
              required
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create Loan Request
          </button>
        </div>
      </form>
    </div>
  );
}