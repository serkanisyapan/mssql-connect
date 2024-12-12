
import { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 

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

function NewTable() {
  const [detayRaporu, setDetayRaporu] = useState([]);
  const [raporName, setRaporName] = useState('')
  const [colDefs, setColDefs] = useState([])
  const [isLoading, setIsLoading] = useState(false)


  useEffect(() => {
    if (detayRaporu.length === 0) return
    const getColDefs = (detayRaporu) => {
        const firstEntry = detayRaporu[0];
        return Object.keys(firstEntry).map(key => ({field: key}))
    }
    const newColDef = getColDefs(detayRaporu)
    setColDefs(newColDef)
  }, [detayRaporu])

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
        <h2>{raporName}</h2>
        {detayRaporu.length > 0 && <div style={{height: 500}}><AgGridReact rowData={detayRaporu} columnDefs={colDefs}/></div>}
    </>
  )}

export default NewTable
