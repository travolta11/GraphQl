import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import './styles.css';

const GET_TRANSACTIONS = gql`
  query GetTransactions {
    allTransactions {
      id
      date
      montant
      type
      compte {
        id
        solde
      }
    }
  }
`;

const SAVE_TRANSACTION = gql`
  mutation SaveTransaction($transaction: TransactionInput!) {
    saveTransaction(transaction: $transaction) {
      id
      date
      type
      montant
      compte {
        id
        solde
      }
    }
  }
`;

function Transactions() {
  const { loading, error, data } = useQuery(GET_TRANSACTIONS);
  const [saveTransaction] = useMutation(SAVE_TRANSACTION, {
    refetchQueries: [{ query: GET_TRANSACTIONS }],
  });

  const [newTransaction, setNewTransaction] = useState({
    date: '',
    type: 'DEPOT',
    montant: '',
    compteId: '',
  });

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    try {
      await saveTransaction({
        variables: {
          transaction: {
            date: newTransaction.date || new Date().toISOString(),
            type: newTransaction.type,
            montant: parseFloat(newTransaction.montant),
            compteId: newTransaction.compteId,
          },
        },
      });

      setNewTransaction({ date: '', type: 'DEPOT', montant: '', compteId: '' });
    } catch (err) {
      console.error('Failed to save transaction:', err);
    }
  };

  if (loading) return <div className="loading">Loading transactions...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;

  return (
    <div className="transactions-container">

      <div className="card">
        <h3 className="card-title">New Transaction +</h3>
        <form onSubmit={handleAddTransaction} className="form">
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={newTransaction.date}
              onChange={(e) =>
                setNewTransaction({ ...newTransaction, date: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Type</label>
            <select
              value={newTransaction.type}
              onChange={(e) =>
                setNewTransaction({ ...newTransaction, type: e.target.value })
              }
            >
              <option value="DEPOT">DEPOT</option>
              <option value="RETRAIT">RETRAIT</option>
            </select>
          </div>

          <div className="form-group">
            <label>Balance</label>
            <input
              type="number"
              placeholder="Enter amount"
              value={newTransaction.montant}
              onChange={(e) =>
                setNewTransaction({ ...newTransaction, montant: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Account ID</label>
            <input
              type="text"
              placeholder="Enter account ID"
              value={newTransaction.compteId}
              onChange={(e) =>
                setNewTransaction({ ...newTransaction, compteId: e.target.value })
              }
              required
            />
          </div>

          <button type="submit" className="btn-primary">
            Add Transaction
          </button>
        </form>
      </div>

      <div className="card">
        <h3 className="card-title"> Transactions</h3>
        {data.allTransactions.length > 0 ? (
          <ul className="transaction-list">
            {data.allTransactions.map((transaction) => (
              <li key={transaction.id} className="transaction-item">
                <div className="transaction-details">
                  <p>{transaction.type} - {transaction.montant}€</p>
                  <p className="transaction-date">Date: {transaction.date}</p>
                </div>
                <div className="transaction-account">
                  <p>Account ID: {transaction.compte.id}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-transactions">No transactions found.</p>
        )}
      </div>
    </div>
  );
}

export default Transactions;
