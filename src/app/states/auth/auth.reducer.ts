import { state } from '@angular/animations';
import { createReducer, on, select } from '@ngrx/store';
//import { decrement, increment, reset, setConversation } from './auth.action';
import { setConversation, setConversationId, setGoogleSheetData, setPdfData, setSelectedUserBot, setSelectedUserBotDetails, setTelegramData, setTextData, setUserBots, setUserDetails, setWebsiteData, setClearWhatsApp, createWhatsApp, updateWhatsApp, whatsAppToggle, setConversationMessages, setClearConversationMessages } from './auth.action';

export interface AuthState {
    value: {
      isAuth: boolean;
      username: string;
    };
    userBots: UserBot[]; 
    selectedUserBot: string;
    selectedUserBotDetails: UserBotDetails;
    conversations: Conversation[]; 
    conversationMessages: ConversationMessage[] | null;
    whatsAppData: any | null; 
    telegramData: any; 
    googleSheetData: any;
    userDetails: any;
    pdfData: any;
    textData: any;
    websiteData: any;
    conversationId: string;
  }

  export interface UserBotDetails {
    name: string;
    character: string;
    }

  export interface UserBot {
    _id: string;
    name: string;
    character: string;
  }

  export interface ConversationMessage {
    role: string;
    text: string;
    timestamp: Date;
  }

  export interface Conversation {
    _id: string;
    messages: ConversationMessage[];
  }
  
  export interface WhatsAppData {
  }
  
  

  export const initialAuthState: AuthState = {
      value: {
          isAuth: false,
          username: "",
      },
      userBots: [],
      selectedUserBot: "",
      selectedUserBotDetails: {
        name: "",
        character: "",
      },
      conversations: [],
      conversationMessages: [],
      whatsAppData: null,
      telegramData: null,
      userDetails: null, 
      pdfData: null,
      textData: null,
      websiteData: null,
      conversationId: "",
      googleSheetData: null,
  };

export const authReducer = createReducer(
initialAuthState,
on(setUserBots, (state, { userBots }) => {
  return { ...state, userBots };
}),
on(setSelectedUserBot, (state, { selectedUserBot }) => {
  //console.log('Selectd User Bot id:', selectedUserBot);
  return { ...state, selectedUserBot };
}),
on(setUserDetails, (state, { userDetails }) => {
  //console.log('user Details:', userDetails);
  return { ...state, userDetails };
}),

on(setSelectedUserBotDetails, (state, { selectedUserBotDetails }) => {
  //console.log('selected User Bot Details:', selectedUserBotDetails);
  return { ...state, selectedUserBotDetails };
}),

on(setPdfData, (state, { pdfData }) => {
  //console.log('user bot Pdf Details:', pdfData);
  return { ...state, pdfData };
}),
on(setTextData, (state, { textData }) => {
  // console.log('user Details:', textData);
  return { ...state, textData };
}),
on(setWebsiteData, (state, { websiteData }) => {
  //console.log('Website Details:', websiteData);
  return { ...state, websiteData };
}),
on(setConversationId, (state, { conversationId }) => {
  //console.log('Selectd User Bot id:', selectedUserBot);
  return { ...state, conversationId };
}),
on(setTelegramData, (state, { telegramData }) => {
  //console.log('Selectd User Bot id:', selectedUserBot);
  return { ...state, telegramData };
}),
on(setGoogleSheetData, (state, { googleSheetData }) => {
  //console.log('Selectd User Bot id:', selectedUserBot);
  return { ...state, googleSheetData };
}),

on(setClearWhatsApp, (state) => ({
  ...state,
  whatsAppData: null,
})),
on(createWhatsApp, (state, { body }) => ({
  ...state,
  whatsAppData: body,
})),
on(updateWhatsApp, (state, { body }) => ({
  ...state,
  whatsAppData: body,
})),
on(whatsAppToggle, (state, { body }) => ({
  ...state,
  whatsAppData: {
    ...state.whatsAppData,
    bot_enabled: body.status,
  },

})),
on(setConversation, (state, { conversation }) => ({
  ...state,
  conversations: conversation,
})),
on(setConversationMessages, (state, { conversationMessages }) => ({
  ...state,
  conversationMessages: conversationMessages,
})),
on(setClearConversationMessages, (state) => ({
  ...state,
  conversationMessages: null,
})),
);