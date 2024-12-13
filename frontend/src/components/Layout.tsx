import React from "react";
import { WalletIcon } from "lucide-react";
import { AppConfig, UserSession } from "@stacks/auth";
import { showConnect } from "@stacks/connect";

export function Layout({ children }: { children: React.ReactNode }) {
  const appConfig = new AppConfig(["store_write", "publish_data"]);
  const userSession = new UserSession({ appConfig });

  function connectWallet() {
    showConnect({
      appDetails: {
        name: "MicroLend",
        icon: "MicroLend",
      },

      onFinish: function () {
        const userData = userSession.loadUserData();
        console.log(userData);
        sessionStorage.setItem("address", JSON.stringify(userData));

        console.log(userSession);
      },

      userSession,
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-blue-600">MicroLend</h1>
            </div>
            <div className="flex items-center">
              <button
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={connectWallet}
              >
                <WalletIcon className="h-5 w-5 mr-2" />
                Connect Wallet
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
