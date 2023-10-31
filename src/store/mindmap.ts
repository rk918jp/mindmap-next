import {
  createEntityAdapter,
  createSlice,
  EntityId,
  EntityState,
  PayloadAction,
  Update,
} from "@reduxjs/toolkit";
import { Page, ToolType } from "@/consts/mindmap";
import { AppState } from "@/store/index";

interface MindmapState {
  initialized: boolean;
  pages: EntityState<Page>;
  selectedPageId?: EntityId;
  activeTool: ToolType;
}

const pagesAdapter = createEntityAdapter<Page>({
  sortComparer: (a, b) => a.sortOrder - b.sortOrder,
});

const initialState: MindmapState = {
  initialized: false,
  pages: pagesAdapter.getInitialState(),
  activeTool: ToolType.cursor,
};

export const mindmapSlice = createSlice({
  name: "mindmap",
  initialState,
  reducers: {
    init: (state, action: PayloadAction<{ pages: Page[] }>) => {
      state.initialized = true;
      pagesAdapter.addMany(state.pages, action.payload.pages);
      const ids = pagesAdapter.getSelectors().selectIds(state.pages);
      if (ids.length > 0) {
        state.selectedPageId = ids[0];
      }
    },
    selectPage: (state, action: PayloadAction<EntityId>) => {
      state.selectedPageId = action.payload;
    },
    addPage: (state, action: PayloadAction<Partial<Page> | undefined>) => {
      const maxPageOrder = Math.max(
        ...pagesAdapter
          .getSelectors()
          .selectAll(state.pages)
          .map((page) => page.sortOrder),
      );

      pagesAdapter.addOne(state.pages, {
        id: crypto.randomUUID(),
        name: "New Page",
        sortOrder: maxPageOrder + 1,
        nodes: [],
        edges: [],
        ...action.payload,
      });
      state;
    },
    updatePage: (state, action: PayloadAction<Update<Page>>) => {
      pagesAdapter.updateOne(state.pages, action);
    },
    changeActiveTool: (state, action: PayloadAction<ToolType>) => {
      state.activeTool = action.payload;
    },
  },
});

export const pagesSelector = pagesAdapter.getSelectors(
  (state: AppState) => state.mindmap.pages,
);

export const { init, selectPage, addPage, updatePage, changeActiveTool } =
  mindmapSlice.actions;
