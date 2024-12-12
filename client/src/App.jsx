import { useState } from 'react';
import './App.css'

const butonlar = [
  {
    butonAdi: "Sevk Irsaliyesi Detay Raporu",
    sorgu: "sevkIrsaliye"
  },
  {
    butonAdi: "Açık Sipariş Detay Raporu",
    sorgu: "acikSiparis"
  },
  {
    butonAdi: "Satın Alma Detay Raporu",
    sorgu: "satinAlmaDetay"
  },
  {
    butonAdi: "Teklif Detay Raporu",
    sorgu: "teklifDetay"
  },
  {
    butonAdi: "Mal Alım Detay Raporu",
    sorgu: "malAlimDetay"
  }
]

function App() {
  const [detayRaporu, setDetayRaporu] = useState([]);

  const fetchDetayRaporu = async (raporTipi) => {
    const url = `http://localhost:8000/detayraporlari?rapor=${raporTipi}`;
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
      <div style={{display: "flex", gap: "5px"}}>
        {butonlar.map((buton, id) => (
          <button key={id} onClick={() => fetchDetayRaporu(`${buton.sorgu}`)}>{buton.butonAdi}</button>
        ))}
      </div>
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
    </>
  )}

export default App
