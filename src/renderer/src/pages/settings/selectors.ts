import { RootState } from '@renderer/store';

export const selectIsInactivityToggled = (state: RootState) => state.settings.inactivityToggle;

export const selectInactivityTimer = (state: RootState) => state.settings.inactivityTimer;
