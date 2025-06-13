import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IRoom } from 'src/common/@types/department/department.interface';
import { IEquipmentInTransfer } from 'src/common/@types/transfer-receipt/transfer-receipt.interface';

type TransferItem = {
  serialNumber: string;
  notes: string;
};

type TransferEditNewState = {
  roomFrom: IRoom | null;
  roomTo: IRoom | null;
  items: TransferItem[];
  roomOptionsFrom: IRoom[];
  roomOptionsTo: IRoom[];
};

const initialState: TransferEditNewState = {
  roomFrom: null,
  roomTo: null,
  items: [],
  roomOptionsFrom: [],
  roomOptionsTo: [],
};

const transferEditNewSlice = createSlice({
  name: 'transferEditNew',
  initialState,
  reducers: {
    setRoomFrom(state, action: PayloadAction<IRoom | null>) {
      state.roomFrom = action.payload;
    },
    setRoomTo(state, action: PayloadAction<IRoom | null>) {
      state.roomTo = action.payload;
    },
    setItems(state, action: PayloadAction<TransferItem[]>) {
      state.items = action.payload;
    },
    setRoomOptionsFrom(state, action: PayloadAction<IRoom[]>) {
      state.roomOptionsFrom = action.payload;
    },
    setRoomOptionsTo(state, action: PayloadAction<IRoom[]>) {
      state.roomOptionsTo = action.payload;
    },

    resetTransferEditNew(state) {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setRoomFrom,
  setRoomTo,
  setItems,
  setRoomOptionsFrom,
  setRoomOptionsTo,
  resetTransferEditNew,
} = transferEditNewSlice.actions;

export default transferEditNewSlice.reducer;
