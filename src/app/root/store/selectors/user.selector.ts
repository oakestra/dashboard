import { createSelector } from '@ngrx/store';
import * as fromUser from '../reducers/user.reducer';
import * as fromApp from '../reducers/app.reducer';

const userSelector = (state: fromApp.AppState) => state.user;

export const selectCurrentUser = createSelector(userSelector, (state: fromUser.State) => state.user);
