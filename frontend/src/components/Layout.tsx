import React, { useEffect, useState } from "react";
import { WalletIcon, LogOutIcon } from "lucide-react";
import {
  authenticate,
  getUserData,
  signUserOut,
  userSession,
} from "../lib/auth";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  interface UserData {
    profile: {
      stxAddress: {
        mainnet: string;
      };
    };
  }

  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((userData) => {
        setIsAuthenticated(true);
        setUserData(userData);
      });
    } else if (userSession.isUserSignedIn()) {
      setIsAuthenticated(true);
      setUserData(getUserData());
    }
  }, []);

  const handleAuth = () => {
    if (isAuthenticated) {
      signUserOut();
    } else {
      authenticate();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-blue-600">MicroLend</h1>
            </div>
            <div className="flex items-center gap-4">
              {isAuthenticated && (
                <span className="text-sm text-gray-600">
                  {userData?.profile?.stxAddress?.mainnet}
                </span>
              )}
              <button
                onClick={handleAuth}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isAuthenticated ? (
                  <>
                    <LogOutIcon className="h-5 w-5 mr-2" />
                    Disconnect
                  </>
                ) : (
                  <>
                    <WalletIcon className="h-5 w-5 mr-2" />
                    Connect Wallet
                  </>
                )}
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
