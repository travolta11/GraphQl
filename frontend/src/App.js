import React, { useState } from 'react';
import { ApolloProvider } from '@apollo/client';
import client from './apolloClient';
import Comptes from '../src/components/compte/Comptes';
import Transactions from '../src/components/transaction/Transactions';
import './App.css';

function App() {
  const [activePage, setActivePage] = useState('comptes');

  return (
    <ApolloProvider client={client}>
      <div className="min-h-screen flex bg-gray-900 text-gray-200">
        <aside className="w-64 bg-gray-800 shadow-lg">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-100 mb-6">Account App</h1>
            <div className="space-y-4">
              <button
                onClick={() => setActivePage('comptes')}
                className={`w-full px-4 py-2 rounded text-left ${
                  activePage === 'comptes'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-700 text-gray-300 hover:bg-blue-500'
                }`}
              >
                Accounts
              </button>
              <button
                onClick={() => setActivePage('transactions')}
                className={`w-full px-4 py-2 rounded text-left ${
                  activePage === 'transactions'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-700 text-gray-300 hover:bg-blue-500'
                }`}
              >
                Transactions
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 p-8">
  <div className="main-container">
    <h2>{activePage === 'comptes' ? 'Accounts' : 'Transactions'}</h2>
    {activePage === 'comptes' && <Comptes />}
    {activePage === 'transactions' && <Transactions />}
  </div>
</main>

      </div>
    </ApolloProvider>
  );
}

export default App;
