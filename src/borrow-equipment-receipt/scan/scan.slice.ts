import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  IBorrowEquipment,
  IRequestItem,
} from 'src/common/@types/borrow-receipt/borrowReceipt.interface';
export interface ScanState {
  activeStep: number;
  borrowEquipments: IBorrowEquipment[];
  requestItems: IRequestItem[];
  triggerCallApi: number;
}

const initialState: ScanState = {
  activeStep: 0,
  borrowEquipments: [],
  requestItems: [],
  triggerCallApi: 0, // Used to trigger refetch
};

const slice = createSlice({
  name: 'scanBorrowReceipt',
  initialState,
  reducers: {
    onBackStep(state) {
      state.activeStep -= 1;
    },

    onNextStep(state) {
      state.activeStep += 1;
    },

    onGotoStep(state, action: PayloadAction<number>) {
      state.activeStep = action.payload;
    },

    setBorrowEquipments(state, action: PayloadAction<IBorrowEquipment[]>) {
      state.borrowEquipments = action.payload;
    },

    setRequestItems(state, action: PayloadAction<IRequestItem[]>) {
      state.requestItems = action.payload;
    },

    refetchData(state) {
      // This action is just a trigger, no state change needed
    },

    triggerRefetch(state) {
      state.triggerCallApi += 1; // Increment to trigger refetch
    },
  },
});

// Actions
export const {
  onBackStep,
  onNextStep,
  onGotoStep,
  setBorrowEquipments,
  setRequestItems,
  refetchData,
  triggerRefetch,
} = slice.actions;
// ----------------------------------------------------------------------

// Reducer
export default slice.reducer;
