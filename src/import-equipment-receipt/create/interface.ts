export type ImportReceiptFormValues = {
  name: string;
  supplier: {
    id: number | null;
  };
  supplierAddress?: string;
  supplierPhone?: string;
  supplierEmail?: string;
  items: {
    code: string;
    price: number;
    quantity: number;
  }[];
  dateOfReceived: string;
  dateOfOrder: string;
  note: string;
};

export type IFormImportReceiptProps = {
  isEdit?: boolean;
  currentReceipt?: ImportReceiptFormValues;
};
