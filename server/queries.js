const sevkIrsaliyeQuery = `
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

Cast(Erp_InventoryReceiptItem.UnitPrice As DECIMAL(18,2)) Fiyat,
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
and Erp_InventoryReceipt.ReceiptDate = '2024.12.10'

Order By [İrsaliye Tarihi] Desc,
[Malzeme Kodu] asc`

const acikSiparisQuery = `
select 
ReceiptNo as [Sipariş No],
ProjectCode as [Proje No],
Erp_OrderReceipt.Ud_SipOrtak as [Ortak Teklif No],
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

export { sevkIrsaliyeQuery, acikSiparisQuery }