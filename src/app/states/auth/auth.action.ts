import { createAction, props } from '@ngrx/store';
import { UserBot, UserBotDetails, Conversation } from './auth.reducer';

export const setUserBots = createAction('[ BotSelectionComponent] SetUserBots', props<{ userBots: UserBot[] }>());
export const setSelectedUserBotDetails = createAction('[ BotSelectionComponent] setSelectedUserBotDetails', props<{ selectedUserBotDetails: UserBotDetails }>());
export const setSelectedUserBot = createAction('[ BotSelectionComponent] setSelectedUserBot', props<{ selectedUserBot: string }>());
export const setUserDetails = createAction('[ UserProfileComponent] SetUserDetails', props<{ userDetails: any }>());
export const setPdfData = createAction('[ PdfComponent] SetPdfData', props<{ pdfData: any }>());
export const setTextData = createAction('[ TextComponent] SetTextData', props<{ textData: any }>());
export const setWebsiteData = createAction('[ WebsiteComponent] SetWebsiteData', props<{ websiteData: any }>());
export const setConversationId = createAction('[ PreviewComponent] setConversationId', props<{ conversationId: string }>());
export const setTelegramData = createAction('[ TelegramComponent] SetTelegramData', props<{ telegramData: any }>());
export const setGoogleSheetData = createAction('[ GooglesheetComponent] SetGoogleSheetData', props<{ googleSheetData: any }>());

export const setClearWhatsApp = createAction('[WhatsappComponent] SetClearWhatsApp');
export const createWhatsApp = createAction('[WhatsappComponent] createWhatsaApp', props<{ body: any }>());
export const updateWhatsApp = createAction('[WhatsappComponent] updateWhatsapp', props<{ body: any }>());
export const whatsAppToggle = createAction('[WhatsappComponent] whatsAppToggle', props<{ body: any }>());

export const setConversation = createAction('[ChatlogComponent] setConversation', props<{ conversation: Conversation[] }>());
export const setConversationMessages = createAction('[ChatlogComponent] getConversationMessages', props<{conversationMessages: any[] }>());
export const setClearConversationMessages = createAction('[ChatlogComponent] setClearConversationMessages');