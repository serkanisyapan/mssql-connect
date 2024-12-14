import { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 
import './App.css'

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

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

function DetayTablo() {
  const [detayRaporu, setDetayRaporu] = useState([]);
  const [raporName, setRaporName] = useState('')
  const [cachedRapor, setCachedRapor] = useState({})
  const [loading, setLoading] = useState(false)
  const [colDefs, setColDefs] = useState([])

  useEffect(() => {
    if (detayRaporu.length === 0) return
    const getColDefs = (detayRaporu) => {
        const firstEntry = detayRaporu[0];
        return Object.keys(firstEntry).map(key => ({field: key, filter: true}))
    }
    const newColDef = getColDefs(detayRaporu)
    setColDefs(newColDef)
  }, [detayRaporu])

  const fetchDetayRaporu = async (raporTipi) => {
    setLoading(true)
    const url = `http://localhost:8000/detayraporlari?rapor=${raporTipi}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();
      const getRaporName = butonlar.find(buton => buton.sorgu === raporTipi)
      setDetayRaporu(json.recordset);
      cacheRapor(json.recordset, raporTipi)
      setRaporName(getRaporName.butonAdi)
      setLoading(false)
    } catch(error) {
      console.log(error.message);
    }}

  const cacheRapor = (fetchedRapor, raporTipi) => {
    setCachedRapor((prevCache) => ({...prevCache, [raporTipi]: fetchedRapor}))
  }

  return (
    <>
        <div>
          <select
            disabled={loading}
            defaultValue={""}
            onChange={(event) => {
              if (cachedRapor[event.target.value]) {
                setDetayRaporu(cachedRapor[event.target.value])
                return;
              }
              fetchDetayRaporu(event.target.value)
            }}
          >
            <option value="" disabled>
              Rapor seçin 
            </option>
            {butonlar.map((buton, index) => (
              <option key={index} value={buton.sorgu}>
                {buton.butonAdi}
              </option>
            ))}
          </select>
        </div>
        <h2>{raporName}</h2>
        {detayRaporu.length > 0 && 
        <div style={{height: 600}}>
          <AgGridReact 
            pagination={true}
            paginationPageSize={50}
            paginationPageSizeSelector={[50, 100, 200]}
            rowData={detayRaporu} 
            columnDefs={colDefs}
          />
        </div>}
    </>
  )}

export default DetayTablo
