import { configureStore } from "@reduxjs/toolkit";
import { mindmapSlice } from "@/store/mindmap";

export const appStore = configureStore({
  reducer: {
    mindmap: mindmapSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // NOTE: mindmapのnodeに関数を含めるため無効化
      serializableCheck: false,
    }),
});

export type AppState = ReturnType<typeof appStore.getState>;
export type AppDispatch = typeof appStore.dispatch;
