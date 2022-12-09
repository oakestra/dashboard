import { createSelector } from '@ngrx/store';
import * as fromUser from '../reducers/user.reducer';
import * as fromApp from '../reducers/app.reducer';

const applicationSelector = (state: fromApp.AppState) => state.user;

export const selectApplications = createSelector(applicationSelector, (state: fromUser.State) => state.user);
