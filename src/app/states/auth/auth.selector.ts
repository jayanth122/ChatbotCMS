import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';

// Select the entire auth state
export const selectAuthState = createFeatureSelector<AuthState>('auth');

// Select specific parts of the auth state
export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state: AuthState) => state.value.isAuth
);

export const selectUsername = createSelector(
  selectAuthState,
  (state: AuthState) => state.value.username
);

export const selectUserBots = createSelector(
  selectAuthState,
  (state: AuthState) => state.userBots
);

export const selectSelectedUserBot = createSelector(
  selectAuthState,
  (state: AuthState) => state.selectedUserBot
);

export const selectSelectedUserBotDetails = createSelector(
  selectAuthState,
  (state: AuthState) => state.selectedUserBotDetails
);

export const selectConversationId = createSelector(
  selectAuthState,
  (state: AuthState) => state.conversationId
);

export const selectUserDetails = createSelector(
  selectAuthState,
  (state: AuthState) => state.userDetails
);

export const selectTelegramData = createSelector(
  selectAuthState,
  (state: AuthState) => state.telegramData
);

export const selectGoogleSheetData = createSelector(
  selectAuthState,
  (state: AuthState) => state.googleSheetData
);

export const selectPdfData = createSelector(
  selectAuthState,
  (state: AuthState) => state.pdfData
);

export const selectTextData = createSelector(
  selectAuthState,
  (state: AuthState) => state.textData
);

export const selectWebsiteData = createSelector(
  selectAuthState,
  (state: AuthState) => state.websiteData
);


export const selectWhatsAppData = createSelector(
  selectAuthState,
  (state) => state.whatsAppData
);

export const selectConversation = createSelector(
  selectAuthState,
  (state: AuthState) => state.conversations
);

export const selectConversationMessages = createSelector(
  selectAuthState,
  (state: AuthState) => state.conversationMessages
);