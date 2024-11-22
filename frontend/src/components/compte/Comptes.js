import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ACCOUNTS } from '../../queries';
import { SAVE_COMPTE } from '../../mutations';
import './styles.css';

const Comptes = () => {
  const { data: accountsData, loading, error, refetch } = useQuery(GET_ACCOUNTS);
  const [saveCompte] = useMutation(SAVE_COMPTE);

  const [newCompte, setNewCompte] = useState({
    solde: '',
    dateCreation: '',
    type: 'COURANT',
  });

  const [errorMessage, setErrorMessage] = useState('');

  const handleAddCompte = async () => {
    try {
      if (!newCompte.solde || !newCompte.dateCreation) {
        setErrorMessage('Please fill in all fields.');
        return;
      }

      await saveCompte({
        variables: { compte: { ...newCompte, solde: parseFloat(newCompte.solde) } },
        refetchQueries: [{ query: GET_ACCOUNTS }],
      });

      setNewCompte({ solde: '', dateCreation: '', type: 'COURANT' });
      setErrorMessage('');
    } catch (err) {
      setErrorMessage('Failed to save account: ' + err.message);
    }
  };

  if (loading) return <p>Loading accounts...</p>;
  if (error) return <p>Error loading accounts: {error.message}</p>;

  return (
    <div className="comptes-container">
      <ul className="comptes-list">
        {accountsData?.allComptes?.map((compte) => (
          <li key={compte.id} className="comptes-item">
            <span className="comptes-item-text">
              {compte.type} - {compte.solde.toFixed(2)}€
            </span>
          </li>
        ))}
      </ul>

      <div className="comptes-form-container">
        <h3 className="form-header">New  Account +</h3>
        <input
          type="number"
          placeholder="Balance"
          value={newCompte.solde}
          onChange={(e) => setNewCompte({ ...newCompte, solde: e.target.value })}
          className="form-input"
        />
        <input
          type="date"
          value={newCompte.dateCreation}
          onChange={(e) => setNewCompte({ ...newCompte, dateCreation: e.target.value })}
          className="form-input"
        />
        <select
          value={newCompte.type}
          onChange={(e) => setNewCompte({ ...newCompte, type: e.target.value })}
          className="form-select"
        >
          <option value="COURANT">COURANT</option>
          <option value="EPARGNE">EPARGNE</option>
        </select>
        <button onClick={handleAddCompte} className="form-button">
      Add Account        </button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default Comptes;
