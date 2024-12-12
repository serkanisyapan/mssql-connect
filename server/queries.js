const sevkFis = `
Select 

Erp_InventoryReceipt.DocumentNo As [Irsaliye No],
Erp_Invoice.DocumentNo as [Fatura No],

(case Erp_InventoryReceipt.ReceiptType when 120 then 'Toptan Satış' when 17 then 'Depo Transfer' when 129 then 'Kesime çıkış' when 134 then 'Fasona Çıkış' when 11 then 'Fasondan Gelen' when 16 then 'Sayım Fişi' when 29 then 'Kesimden İade' ELSE ''END) as [Fiş Adı],
Erp_InventoryReceipt.ReceiptNo As [Fiş No],
WarehouseName as [Sevk Deposu],
Erp_InventoryReceipt.Ud_ihracat as [IHR/Yurt İçi],

Convert(varchar,Erp_InventoryReceipt.ReceiptDate,102) As [İrsaliye Tarihi],
substring(Erp_CurrentAccount.CurrentAccountName,1,15) As Müşteri,
Erp_Inventory.InventoryCode As [Malzeme Kodu],
Erp_Inventory.InventoryName As [Malzeme Adı], 
Erp_Inventory.NER_KAFCode As [Katalog Kodu],
Erp_Inventory.NER_Assortment as [Amanos Artikel],

(select Top 1 SizeDetailCode from Erp_InventoryReceiptItem
Left Join Erp_InventoryUnitItemSizeSetDetails On Erp_InventoryUnitItemSizeSetDetails.RecId =Erp_InventoryReceiptItem.InventoryUnitItemSizeSetDetailsId)
as [Ölçü Kodu],
Erp_InventoryReceiptItem.NER_RENKDETAY as [Renk Kodu],

Cast(Erp_InventoryReceiptItem.NetQuantity As DECIMAL(18,2)) [ADET],
Erp_InventoryReceiptItem.NER_Unit2 As [2.Birim],
Cast(Erp_InventoryReceiptItem.Quantity As Decimal(18,2)) Miktar,
Meta_UnitSetItem.UnitCode As [Birim],
ReceivedQuantity AS [Sevk Miktar],
Cast(Erp_InventoryReceiptItem.Quantity-ReceivedQuantity As Decimal(18,2)) [Kalan Sevk], 

Cast(Erp_InventoryReceiptItem.UnitPrice As DECIMAL(18,2)) Fiyat,
Cast(Erp_InventoryReceiptItem.VatRate As DECIMAL(18,0)) [% KDV Oranı],
Cast(Erp_InventoryReceiptItem.ItemTotal As DECIMAL(18,2)) [Satır Tutarı],
Cast(Erp_InventoryReceiptItem.ItemTotalVatIncluded As DECIMAL(18,2)) [KDV'li Satır Tutarı],
Meta_User.UserName As [İrsaliye Kesen]

From Erp_InventoryReceiptItem

Left Join Erp_Invoice On Erp_Invoice.RecId = Erp_InventoryReceiptItem.InvoiceItemId
Inner Join Erp_InventoryReceipt On Erp_InventoryReceipt.RecId = Erp_InventoryReceiptItem.InventoryReceiptId  
Inner Join Erp_Inventory  On Erp_Inventory.RecId = Erp_InventoryReceiptItem.InventoryId
Inner Join Erp_Warehouse On Erp_Warehouse.RecId = Erp_InventoryReceiptItem.OutWarehouseId
Inner Join Erp_CurrentAccount On Erp_CurrentAccount.RecId = Erp_InventoryReceipt.CurrentAccountId
Left Join Erp_Employee 	On Erp_Employee.RecId = Erp_InventoryReceipt.EmployeeId
Left Join Erp_OrderReceiptItem On Erp_OrderReceiptItem.RecId = Erp_InventoryReceiptItem.OrderReceiptItemId
Left Join Meta_User On Meta_User.RecId = Erp_OrderReceiptItem.InsertedBy
Left Join Meta_UnitSetItem On Meta_UnitSetItem.RecId = Erp_InventoryReceiptItem.UnitId

Where Erp_InventoryReceipt.ReceiptType = 120

Order By [İrsaliye Tarihi] Desc,
[Malzeme Kodu] asc`

const acikSiparis = `
select 
ReceiptNo as [Sipariş No],
ProjectCode as [Proje No],
Erp_OrderReceipt.Ud_SipOrtak as [Ortak Sipariş No],
Convert(varchar,Erp_OrderReceiptItem.ReceiptDate, 102) as [Kayıt Tarihi],
Convert(varchar,Erp_OrderReceiptItem.DeliveryDate, 102) as [Müşteri İsteme Tarihi],
substring(Erp_CurrentAccount.CurrentAccountName,1,10) As Müşteri,
Erp_OrderReceipt.Ud_Ihracatyurtici as [Ihracat/Yurt İçi],

(case Erp_OrderReceiptItem.ReceiptSubType when 1 then 'Ürün' when 2 then 'Profil' when 3 then 'Komposit' when 4 
then 'Cam' when 5 then 'Donanım' when 6 then 'Aksesuar' when 7 then 'Genel' when 8 then 'Ortak' ELSE ''END) as [Sipariş Tipi],

InventoryCode as [Malzeme Kodu],
InventoryName as [Malzeme Adı],
Erp_OrderReceiptItem.NER_Assortment as [Katalog Kodu],

Erp_OrderReceiptItem.NER_RENKDETAY as [Renk],

Cast(Erp_OrderReceiptItem.NetQuantity as DECIMAL(18,2)) [ADET],
Erp_OrderReceiptItem.NER_Unit2 as [2.Birim],

Cast(Erp_OrderReceiptItem.Quantity as DECIMAL(18,2)) Miktar,
UnitCode as [Birim],

Cast(Erp_OrderReceiptItem.ReceivedQuantity as DECIMAL(18,2)) [Sevk Miktar],
Erp_OrderReceiptItem.NER_Unit2 as [Br],

Cast(Erp_OrderReceiptItem.UnitPrice as DECIMAL(18,3)) [₺ Fiyat],
Cast(Erp_OrderReceiptItem.ItemTotal as DECIMAL(18,2)) [₺ Tutar],
Cast(Erp_OrderReceiptItem.ForexUnitPrice as DECIMAL(18,3)) [Döviz Fiyat],
ForexCode as [Döviz Cinsi],
Cast(Erp_OrderReceiptItem.NetItemTotalForex as DECIMAL(18,2)) [Döviz Tutarı],
ForexCode as [Döviz]

from Erp_OrderReceiptItem

Inner Join Erp_OrderReceipt On Erp_OrderReceipt.RecId = Erp_OrderReceiptItem.OrderReceiptId
Inner Join Erp_Inventory On Erp_Inventory.RecId = Erp_OrderReceiptItem.InventoryId
Inner Join Meta_Forex On Meta_Forex.RecId = Erp_OrderReceiptItem.ForexId
Inner Join Erp_CurrentAccount On Erp_CurrentAccount.RecId = Erp_OrderReceipt.CurrentAccountId
Left Join Meta_UnitSetItem On Meta_UnitSetItem.RecId = Erp_OrderReceiptItem.UnitId
Left Join Erp_Project On Erp_Project.RecId = Erp_OrderReceiptItem.ProjectId
Left Join Erp_InitialCost On Erp_InitialCost.RecId = Erp_OrderReceiptItem.InitialCostId

where Erp_OrderReceipt.ReceiptType='2' and Erp_OrderReceiptItem.IsClosed='0'

order by [Sipariş No] desc,
[Malzeme Kodu] asc`

const satinAlmaDetay = `
select 
ReceiptNo as [Sipariş No],

Convert(varchar,Erp_OrderReceiptItem.ReceiptDate, 102) as [Kayıt Tarihi],
Convert(varchar,Erp_OrderReceiptItem.DeliveryDate, 102) as [Tedarikçi Teslim Tarihi],
substring(Erp_CurrentAccount.CurrentAccountName,1,10) As Tedarikçi,

InventoryCode as [Malzeme Kodu],
InventoryName as [Malzeme Adı],
Erp_OrderReceiptItem.NER_Assortment as [Katalog Kodu],

Erp_OrderReceiptItem.NER_RENKDETAY as [Renk],

Cast(Erp_OrderReceiptItem.NetQuantity as DECIMAL(18,2)) [ADET],
Erp_OrderReceiptItem.NER_Unit2 as [2.Birim],

Cast(Erp_OrderReceiptItem.Quantity as DECIMAL(18,2)) Miktar,
UnitCode as [Birim],
Cast(ReceivedQuantity as DECIMAL(18,2)) [Gelen Sevk],
UnitCode as [Birim],
Cast(Erp_OrderReceiptItem.Quantity-ReceivedQuantity as DECIMAL(18,2)) [Kalan],
UnitCode as [Birim],

Cast(Erp_OrderReceiptItem.UnitPrice as DECIMAL(18,3)) [₺ Fiyat],
Cast(Erp_OrderReceiptItem.ItemTotal as DECIMAL(18,2)) [₺ Tutar],
Cast(Erp_OrderReceiptItem.ForexUnitPrice as DECIMAL(18,3)) [Döviz Fiyat],
ForexCode as [Döviz Cinsi],
Cast(Erp_OrderReceiptItem.NetItemTotalForex as DECIMAL(18,2)) [Döviz Tutarı],
ForexCode as [Döviz]

from Erp_OrderReceiptItem

Inner Join Erp_OrderReceipt On Erp_OrderReceipt.RecId = Erp_OrderReceiptItem.OrderReceiptId
Inner Join Erp_Inventory On Erp_Inventory.RecId = Erp_OrderReceiptItem.InventoryId
Inner Join Meta_Forex On Meta_Forex.RecId = Erp_OrderReceiptItem.ForexId
Inner Join Erp_CurrentAccount On Erp_CurrentAccount.RecId = Erp_OrderReceipt.CurrentAccountId
Left Join Meta_UnitSetItem On Meta_UnitSetItem.RecId = Erp_OrderReceiptItem.UnitId
Left Join Erp_Project On Erp_Project.RecId = Erp_OrderReceiptItem.ProjectId
Left Join Erp_InitialCost On Erp_InitialCost.RecId = Erp_OrderReceiptItem.InitialCostId

where Erp_OrderReceipt.ReceiptType='1' and Erp_OrderReceiptItem.IsClosed='0'

order by [Sipariş No] desc,
[Malzeme Kodu] asc
`

const teklifDetay = `
select 
ReceiptNo as [Fiş No],
Ud_OrtakTeklif as [Ortak Teklif No],

substring(Erp_CurrentAccount.CurrentAccountName,1,10) As Müşteri,
(case Erp_QuotationReceipt.ReceiptUpType when 1 then 'Yurt İçi' when 50 then 'İhracat' when 2 then 'Yurt İçi' when 3
then 'Yurt İçi' when 4 then 'Yurt İçi' when 5 then 'Yurt İçi' when 6 then 'Yurt İçi'when 7 then 'Yurt İçi'when 8 then 'Yurt İçi' ELSE ''END) as [Üst Teklif Tipi],

(case Erp_QuotationReceipt.ReceiptSubType when 1 then 'Ürün' when 2 then 'Profil' when 3 then 'Komposit' when 4 
then 'Cam' when 5 then 'Donanım' when 6 then 'Aksesuar' when 7 then 'Genel' when 8 then 'Ortak' ELSE ''END) as [Alt Teklif Tipi],
InventoryCode as [Ürün Kodu],
InventoryName as [Ürün Adı],

SUM (Erp_QuotationReceiptItem.NetQuantity) AS [Toplam Tutar],
SUM (Erp_QuotationReceiptItem.UnitPrice) AS [Toplam Tutar],
SUM (Erp_QuotationReceiptItem.ItemTotal) AS [Toplam Tutar],
ProjectName as [Proje Adı],
InitialCostCode as [Ön Maliyet Maliyet]

from Erp_QuotationReceiptItem

Inner Join Erp_QuotationReceipt On Erp_QuotationReceipt.RecId = Erp_QuotationReceiptItem.QuotationReceiptId
Inner Join Erp_Inventory On Erp_Inventory.RecId = Erp_QuotationReceiptItem.InventoryId
Inner Join Erp_CurrentAccount On Erp_CurrentAccount.RecId = Erp_QuotationReceipt.CurrentAccountId
Inner Join Erp_Project On Erp_Project.RecId = Erp_QuotationReceipt.ProjectId
Inner Join Erp_InitialCost On Erp_InitialCost.RecId = Erp_QuotationReceiptItem.InitialCostId
group by Erp_QuotationReceiptItem.ItemTotal,ReceiptNo,Ud_OrtakTeklif,Erp_CurrentAccount.CurrentAccountName,Erp_QuotationReceipt.ReceiptUpType,
Erp_QuotationReceipt.ReceiptSubType,InventoryCode,InventoryName,Erp_QuotationReceiptItem.NetQuantity,Erp_QuotationReceiptItem.UnitPrice,ProjectName,
InitialCostCode

order by [Fiş No] desc
`
const malAlimFisDetay = `
Select Erp_InventoryReceipt.DocumentNo As [Belge No],

Erp_InventoryReceipt.ReceiptType As [Fiş Tipi],
(case Erp_InventoryReceipt.ReceiptType when 1 then 'Mal Alım' when 17 then 'Depo Transfer' when 122 then 'İADE' when 134 then 'Fasona Çıkış' when 11 then 'Fasondan Gelen' when 16 then 'Sayım Fişi' when 29 then 'Kesimden İade' ELSE ''END) as [Fiş Adı],
Erp_InventoryReceipt.ReceiptNo As [Fiş No],

Convert(varchar,Erp_InventoryReceipt.ReceiptDate,102) As [İrsaliye Tarihi],
substring(Erp_CurrentAccount.CurrentAccountName,1,10) As Tedarikçi,

Erp_Inventory.InventoryCode As [Malzeme Kodu],
Erp_Inventory.NER_KAFCode As [Katakog Kodu],
Erp_Inventory.InventoryName As [Malzeme Adı], 
Erp_InventoryReceiptItem.NER_RENKDETAY as [Renk Kodu],

Cast(Erp_InventoryReceiptItem.NetQuantity As DECIMAL(18,2)) [Adet],
Erp_InventoryReceiptItem.NER_Unit2 As [2.Birim],
Cast(Erp_InventoryReceiptItem.Quantity As Decimal(18,2)) Miktar,
Meta_UnitSetItem.UnitCode As [Birim],

Erp_InventoryReceiptItem.Explanation As [Üretim Emri],
ProjectCode as [Proje Kodu],

Cast(Erp_InventoryReceiptItem.UnitPrice As DECIMAL(18,2)) Fiyat,
Cast(Erp_InventoryReceiptItem.ItemTotal As DECIMAL(18,2)) [Satır Tutarı],
Cast(Erp_InventoryReceiptItem.ItemTotalVatIncluded As DECIMAL(18,2)) [KDV'li Satır Tutarı]

From Erp_InventoryReceipt
Inner Join Erp_InventoryReceiptItem On Erp_InventoryReceipt.RecId =
Erp_InventoryReceiptItem.InventoryReceiptId

Inner Join Erp_Inventory
On Erp_Inventory.RecId = Erp_InventoryReceiptItem.InventoryId

Left Join Erp_Project
On Erp_Project.RecId = Erp_InventoryReceiptItem.ProjectId

Inner Join Erp_CurrentAccount On Erp_CurrentAccount.RecId =
Erp_InventoryReceipt.CurrentAccountId

Left Join Erp_Employee
On Erp_Employee.RecId = Erp_InventoryReceiptItem.EmployeeId	

Left Join Erp_OrderReceiptItem
On Erp_OrderReceiptItem.RecId = Erp_InventoryReceiptItem.OrderReceiptItemId

Left Join Meta_User
On Meta_User.RecId = Erp_OrderReceiptItem.InsertedBy

Left Join Meta_UnitSetItem
On Meta_UnitSetItem.RecId = Erp_InventoryReceiptItem.UnitId

Where Erp_InventoryReceipt.ReceiptType = '1' or Erp_InventoryReceipt.ReceiptType = '122'

Order By [İrsaliye Tarihi] Desc
`

const acikSiparisOzet = `
select

ReceiptNo as [Sipariş No],
Convert(varchar,ReceiptDate, 102) as [Sipariş Tarihi],
Ud_SipOrtak as [Ortak Sipariş No],
ProjectCode as [Proje No],
EmployeeName as [Siparişi Alan],

(case Erp_OrderReceipt.ReceiptUpType when 1 then 'Yurt İçi' when 50 then 'Ihracat' when 2 then 'Yurt İçi' when 3
then 'Yurt İçi' when 4 then 'Yurt İçi' when 5 then 'Yurt İçi' when 6 then 'Yurt İçi'when 7 then 'Yurt İçi'when 8 then 'Yurt İçi' ELSE ''END) as [Üst Sipariş Tipi],

(case Erp_OrderReceipt.ReceiptSubType when 1 then 'Ürün' when 2 then 'Profil' when 3 then 'Komposit' when 4 
then 'Cam' when 5 then 'Donanım' when 6 then 'Aksesuar' when 7 then 'Genel' when 8 then 'Ortak' ELSE ''END) as [Alt Sipariş Tipi],

substring(Erp_CurrentAccount.CurrentAccountName,1,15) As Müşteri,

Cast(GrandTotal As DECIMAL(18,2)) [Sipariş Toplamı]

from Erp_OrderReceipt

Inner Join Erp_CurrentAccount On Erp_CurrentAccount.RecId =
Erp_OrderReceipt.CurrentAccountId
Inner Join Erp_Project On Erp_Project.RecId = Erp_OrderReceipt.ProjectId
Inner Join Erp_Employee On Erp_Employee.RecId = Erp_OrderReceipt.EmployeeId

where Erp_OrderReceipt.ReceiptType='2' and Erp_OrderReceipt.IsClosed='0'

order by [Sipariş No] desc
`
const butunSiparisOzet = `
select

ReceiptNo as [Sipariş No],
Convert(varchar,ReceiptDate, 102) as [Sipariş Tarihi],
Ud_SipOrtak as [Ortak Sipariş No],
ProjectCode as [Proje No],
EmployeeName as [Siparişi Alan],

(case Erp_OrderReceipt.ReceiptUpType when 1 then 'Yurt İçi' when 50 then 'İhracat' when 2 then 'Yurt İçi' when 3
then 'Yurt İçi' when 4 then 'Yurt İçi' when 5 then 'Yurt İçi' when 6 then 'Yurt İçi'when 7 then 'Yurt İçi'when 8 then 'Yurt İçi' ELSE ''END) as [Üst Sipariş Tipi],

(case Erp_OrderReceipt.ReceiptSubType when 1 then 'Ürün' when 2 then 'Profil' when 3 then 'Komposit' when 4 
then 'Cam' when 5 then 'Donanım' when 6 then 'Aksesuar' when 7 then 'Genel' when 8 then 'Ortak' ELSE ''END) as [Alt Sipariş Tipi],

substring(Erp_CurrentAccount.CurrentAccountName,1,15) As Müşteri,

Cast(GrandTotal As DECIMAL(18,2)) [Sipariş Toplamı]

from Erp_OrderReceipt

Inner Join Erp_CurrentAccount On Erp_CurrentAccount.RecId =
Erp_OrderReceipt.CurrentAccountId
Inner Join Erp_Project On Erp_Project.RecId = Erp_OrderReceipt.ProjectId
Inner Join Erp_Employee On Erp_Employee.RecId = Erp_OrderReceipt.EmployeeId

order by [Sipariş No] desc
`
const teklifler = `
select
(case Erp_QuotationReceipt.QuotationStatus when 1 then 'Teklif' when 2 then 'Revize' when 3 then 'Karşı Teklif Bekleniyor' when 4 then 'Karşı Teklif Verildi' when 5 then 'Karşı Teklif Verilmedi' ELSE ''END) as [Teklif Durum],
ReceiptNo as [Teklif No],
Convert(varchar,ReceiptDate, 102) as [Teklif Tarihi],
ProjectCode as [Proje No],
Ud_OrtakTeklif as [Ortak Teklif No],

(case Erp_QuotationReceipt.ReceiptUpType when 1 then 'Yurt İçi' when 50 then 'Ihracat' when 2 then 'Yurt İçi' when 3
then 'Yurt İçi' when 4 then 'Yurt İçi' when 5 then 'Yurt İçi' when 6 then 'Yurt İçi'when 7 then 'Yurt İçi'when 8 then 'Yurt İçi' ELSE ''END) as [Üst Teklif Tipi],

(case Erp_QuotationReceipt.ReceiptSubType when 1 then 'Ürün' when 2 then 'Profil' when 3 then 'Komposit' when 4 
then 'Cam' when 5 then 'Donanım' when 6 then 'Aksesuar' when 7 then 'Genel' when 8 then 'Ortak' ELSE ''END) as [Alt Teklif Tipi],

substring(Erp_CurrentAccount.CurrentAccountName,1,15) As Müşteri,
EmployeeName as [Teklif Veren],
Cast(GrandTotal As DECIMAL(18,2)) [Teklif Toplamı],
UD_FiyatOnay as [Fiyat Onay]

from Erp_QuotationReceipt

Inner Join Erp_CurrentAccount On Erp_CurrentAccount.RecId =
Erp_QuotationReceipt.CurrentAccountId
Inner Join Erp_Project On Erp_Project.RecId = Erp_QuotationReceipt.ProjectId
Inner Join Erp_Employee On Erp_Employee.RecId = Erp_QuotationReceipt.EmployeeId

order by [Teklif No] desc
`

const stokKartlari = `
select 

InventoryCode as [Malzeme Kodu],
InventoryName as [Malzeme Adı],
NER_KAFCode as [Katalog Kodu],
Price as Fiyat,
ForexCode as Döviz,
Erp_InventoryPriceList.Explanation as [Açıklama],
StartDate as [Başlangıç]

from Erp_InventoryPriceList

Inner Join Erp_Inventory On Erp_Inventory.RecId = Erp_InventoryPriceList.InventoryId
Inner Join Meta_Forex On Meta_Forex.RecId = Erp_InventoryPriceList.ForexId

order by [Malzeme Kodu] asc ,[StartDate] desc
`

const onMaliyet = `
select 
InitialCostCode as [Ön Maliyet Kodu],
substring(Erp_CurrentAccount.CurrentAccountName,1,10) As Müşteri,
Convert(varchar,Erp_InitialCost.CostDate,102) AS [Ön Maliyet Tarihi],
RecipeCode as [Reçete Kodu],
InventoryCode as [Malzeme Kodu],
InventoryName as [Malzeme Adı],
NER_KAFCode as [Katalog Kodu],
Meta_Forex.ForexCode as [Döviz],

Cast(Erp_InitialCost.ForexRate as DECIMAL (18,3))[Döviz Kur],
Cast(Erp_InitialCost.CalculatedPrice AS DECIMAL(18,1)) [Hesaplanan Fiyat TL],
Cast(Erp_InitialCost.GivenPrice AS DECIMAL(18,1)) [Verilen Fiyat],
Cast(((Erp_InitialCost.GivenPrice*Erp_InitialCost.ForexRate)-Erp_InitialCost.CalculatedPrice) as DECIMAL(18,2)) [Kar TL],
Cast(((Erp_InitialCost.GivenPrice*Erp_InitialCost.ForexRate)-Erp_InitialCost.CommissionAmount) as DECIMAL(18,2))[Fiyat TL],
Cast(ISNULL(((Erp_InitialCost.GivenPrice*Erp_InitialCost.ForexRate)-Erp_InitialCost.CalculatedPrice)/NULLIF((Erp_InitialCost.GivenPrice*Erp_InitialCost.ForexRate)-Erp_InitialCost.CommissionAmount,0),0) AS DECIMAL (18,2))[% Kar Oranı]

from Erp_InitialCost

Inner Join Erp_Inventory On Erp_Inventory.RecId = Erp_InitialCost.InventoryId
Inner Join Erp_Recipe On Erp_Recipe.RecId = Erp_InitialCost.RecipeId
Inner Join Erp_CurrentAccount On Erp_CurrentAccount.RecId = Erp_InitialCost.CurrentAccountId
right Join Meta_Forex On Erp_InitialCost.ForexId=Meta_Forex.RecId

where InitialCostCode is not null

order by [Ön Maliyet Tarihi] desc
`

const kayraIsEmri = `
select
WorkOrderNo as[İş Emri No],
WorkOrderDate as [Kayıt Tarihi],
PlanDate as [Planlanan Sevk],
(case Status when 1 then 'Planlandı' when 2 then 'Başladı' when 3 then 'Durduruldu' when 4
then 'İptal' when 5 then 'Tamamlandı' when 6 then 'Onay Bekliyor' when 7 then 'Sevk Edilebilir' ELSE ''END) as [İş Emri Durumu],
substring(Erp_CurrentAccount.CurrentAccountName,1,10) As Müşteri,
ProjectCode as [Proje Kodu],
ProjectName as [Proje Adı],
RouteName as [Rota],
InventoryCode as [Mamul Kodu],
InventoryName as [Mamul Adı],
Quantity as [Miktar],
UnitCode as [Birim]

from Erp_WorkOrder

Inner Join Erp_CurrentAccount On Erp_CurrentAccount.RecId = Erp_WorkOrder.CurrentAccountId
Inner Join Erp_Project On Erp_Project.RecId = Erp_WorkOrder.ProjectId
Inner Join Erp_Route On Erp_Route.RecId = Erp_WorkOrder.RouteId
Inner Join Erp_Inventory On Erp_Inventory.RecId = Erp_WorkOrder.InventoryId
Left Join Meta_UnitSetItem On Meta_UnitSetItem.RecId = Erp_WorkOrder.InventoryUnitId

Order By [İş Emri No] Desc
`
const kayraEIrsaliye = `
Select Erp_InventoryReceipt.DocumentNo As [Belge No],
Convert(varchar,Erp_InventoryReceipt.ReceiptDate,102) As [İrsaliye Tarihi],
Erp_InventoryReceipt.ReceiptType As [Fiş Tipi],
(case Erp_InventoryReceipt.ReceiptType when 120 then 'Toptan Satış' when 17 then 'Depo Transfer' when 129 then 'Kesime çıkış' when 134 then 'Fasona Çıkış' when 11 then 'Fasondan Gelen' when 16 then 'Sayım Fişi' when 29 then 'Kesimden İade' ELSE ''END) as [Fiş Adı],
Erp_InventoryReceipt.ReceiptNo As [Fiş No],
 
substring(Erp_CurrentAccount.CurrentAccountName,1,15) As Müşteri,
EmployeeName as [İrsaliye Kesen],
Erp_InventoryReceipt.EDespatchStatus,
Erp_InventoryReceipt.Ud_ihracat as [İhracat],
Erp_InventoryReceipt.WithholdingType as [Tevkifat],
(case Erp_InventoryReceipt.WithholdingType when 0 then 'Tevkifatsız' when 121 then 't' ELSE ''END) as [Tevkifat Durumu],
 
(case Erp_InventoryReceipt.EDespatchStatus when 1 then 'Oluşturuldu' when 3 then 'Gönderildi' when 0 then 'Sadece Kayıtlı' when null then 'Durumu Yok' when 11 then 'Fasondan Gelen' when 16 then 'Sayım Fişi' when 29 then 'Kesimden İade' ELSE ''END) as [Durumu]

From Erp_InventoryReceipt

Inner Join Erp_CurrentAccount On Erp_CurrentAccount.RecId =
Erp_InventoryReceipt.CurrentAccountId

Inner Join Erp_Employee On Erp_Employee.RecId = Erp_InventoryReceipt.EmployeeId
	
Where Erp_InventoryReceipt.DocumentNo like'KIR2024000001%' and (Erp_InventoryReceipt.ReceiptType='120' or Erp_InventoryReceipt.ReceiptType='17')

Order By [Belge No] Desc
`

export const raporlar = {
    sevkFis,
    acikSiparis,
    satinAlmaDetay,
    teklifDetay,  
    malAlimFisDetay,
    acikSiparisOzet,
    butunSiparisOzet,
    teklifler,
    stokKartlari,
    onMaliyet,
    kayraIsEmri,
    kayraEIrsaliye
}