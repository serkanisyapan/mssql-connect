import { useState } from 'react';
import './App.css'

function App() {
  const [detayRaporu, setDetayRaporu] = useState([]);

  const fetchDetayRaporu = async (raporTipi) => {
    const url = `http://localhost:8000/${raporTipi}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();
      setDetayRaporu(json.recordset);
    } catch(error) {
      console.log(error.message);
    }}
      
  return (
    <>
      <div className='table-container'>
        <table className='styled-table'>
          <thead>
            <tr>
              {detayRaporu.length > 0 && Object.keys(detayRaporu[0]).map((key, index) => (
                <th key={index}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {detayRaporu.map((detay, id) => (
              <tr key={id}>
                {Object.values(detay).map((deger, id) => (
                  <td key={id}>{deger}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{display: "flex", gap: "5px"}}>
        <button onClick={() => fetchDetayRaporu("sevkirsaliyesi")}>Sevk Irsaliyesi Detay Raporu</button>
        <button onClick={() => fetchDetayRaporu("aciksiparis")}>Acik Siparis Detay Raporu</button>
      </div>
    </>
  )}

export default App
