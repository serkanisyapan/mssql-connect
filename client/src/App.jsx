import { useState } from 'react';
import './App.css'

const butonlar = [
  {
    butonAdi: "Sevk Fiş Detayları Raporu",
    sorgu: "sevkFis"
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
    butonAdi: "Mal Alım Fiş Detayları Raporu",
    sorgu: "malAlimFisDetay"
  },
  {
    butonAdi: "Açık Siparişler Özet Raporu",
    sorgu: "acikSiparisOzet"
  },
  {
    butonAdi: "Bütün Siparişler Özet Raporu",
    sorgu: "butunSiparisOzet"
  },
  {
    butonAdi: "Teklifler",
    sorgu: "teklifler"
  },
  {
    butonAdi: "Stok Kartları Raporu",
    sorgu: "stokKartlari"
  },
  {
    butonAdi: "Ön Maliyet Çalışmaları",
    sorgu: "onMaliyet"
  },
  {
    butonAdi: "Kayra İş Emri Raporu",
    sorgu: "kayraIsEmri"
  },
  {
    butonAdi: "Kayra Kesilen e-irsaliyeler",
    sorgu: "kayraEIrsaliye"
  },
]

function App() {
  const [detayRaporu, setDetayRaporu] = useState([]);
  const [raporName, setRaporName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const fetchDetayRaporu = async (raporTipi) => {
    setIsLoading(true)
    const url = `http://localhost:8000/detayraporlari?rapor=${raporTipi}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();
      setDetayRaporu(json.recordset);
      setIsLoading(false)
    } catch(error) {
      console.log(error.message);
      setIsLoading(false)
    }}
      
  return (
    <>
      <div style={{display: "flex", gap: "5px", flexFlow: "row wrap", justifyContent: "center"}}>
        {butonlar.map((buton, id) => (
          <button style={{width: "170px"}} disabled={isLoading || raporName === buton.butonAdi} key={id} onClick={() => {
            fetchDetayRaporu(`${buton.sorgu}`)
            setRaporName(buton.butonAdi)
          }}>{buton.butonAdi}</button>
        ))}
      </div>
      <div className='table-container'>
        <h2>{raporName}</h2>
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
