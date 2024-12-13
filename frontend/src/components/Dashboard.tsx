import React from 'react';
import { Activity, TrendingUp, AlertTriangle } from 'lucide-react';
import { UserReputation, UserLoans } from '../types';

interface DashboardProps {
  reputation: UserReputation;
  loans: UserLoans;
}

export function Dashboard({ reputation, loans }: DashboardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-2 bg-green-100 rounded-lg">
            <Activity className="h-6 w-6 text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Reputation Score</p>
            <p className="text-2xl font-semibold text-gray-900">
              {reputation.reputationScore}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Successful Repayments</span>
            <span className="font-medium text-gray-900">
              {reputation.successfulRepayments}
            </span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-gray-500">Defaults</span>
            <span className="font-medium text-gray-900">{reputation.defaults}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg">
            <TrendingUp className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Active Loans</p>
            <p className="text-2xl font-semibold text-gray-900">
              {loans.activeLoans.length}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Total Active Borrowed</span>
            <span className="font-medium text-gray-900">
              ${loans.totalActiveBorrowed.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <AlertTriangle className="h-6 w-6 text-yellow-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Platform Status</p>
            <p className="text-2xl font-semibold text-green-600">Active</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Last Block Height</span>
            <span className="font-medium text-gray-900">12345</span>
          </div>
        </div>
      </div>
    </div>
  );
}