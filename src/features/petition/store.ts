// store/campaignSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { remoteItem, remoteList } from 'utils/storeUtils';
import { ZetkinPetition } from 'utils/types/zetkin';

interface PetitionState {
  petitionList: {
    isLoading: boolean;
    items: ReturnType<typeof remoteItem>[];
  };
  elementsByPetitionId: Record<number, ReturnType<typeof remoteList>>;
  petitionIdsByCampaignId: Record<number, ReturnType<typeof remoteList>>;
}

const initialState: PetitionState = {
  petitionList: { isLoading: false, items: [] },
  elementsByPetitionId: {},
  petitionIdsByCampaignId: {},
};

export const petitionSlice = createSlice({
  name: 'petitions',
  initialState,
  reducers: {
    petitionCreate: (state) => {
      state.petitionList.isLoading = true;
    },
    petitionCreated: (state, action: PayloadAction<ZetkinPetition>) => {
      const petition = action.payload;
      state.petitionList.isLoading = false;
      state.petitionList.items.push(
        remoteItem(petition.id, { data: petition })
      );
      state.elementsByPetitionId[petition.id] = remoteList();

      if (petition.project) {
        if (!state.petitionIdsByCampaignId[petition.project.id]) {
          state.petitionIdsByCampaignId[petition.project.id] = remoteList();
        }
        state.petitionIdsByCampaignId[petition.project.id].items.push(
          remoteItem(petition.id)
        );
      }
    },
  },
});

export const { petitionCreate, petitionCreated } = petitionSlice.actions;
export default petitionSlice.reducer;
