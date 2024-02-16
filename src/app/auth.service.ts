import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private apiService: ApiService) { }

  login(): boolean {
    localStorage.setItem('isLoggedIn', 'true');
    return true;
  }

  createUserBot(data: any): Observable<any> {
    const endpoint = '/api/bot/create';
    const token = environment.token;
    return this.apiService.post(endpoint, token, data);
  }

  deleteUserBot(data: any): Observable<any> {
    const endpoint = '/api/bot/delete';
    const token = environment.token;
    return this.apiService.post(endpoint, token, data);
  }

  updateUserBot(data: any): Observable<any> {
    const endpoint = '/api/bot/update';
    const token = environment.token;
    return this.apiService.post(endpoint, token, data);
  }
  
  getBotsheet(data: any): Observable<any> { 
    const endpoint = '/api/get_bot_sheet';
    const token = environment.token;
    return this.apiService.post(endpoint, token, data);
  }

  updateBotsheet(data: any): Observable<any> { 
    const endpoint = '/api/update_bot_sheet';
    const token = environment.token;
    return this.apiService.post(endpoint, token, data);
  }

  getTelegram(data: any): Observable<any> {
    const endpoint = '/api/telegram/get_bot_information';
    const token = environment.token;
    return this.apiService.post(endpoint, token, data);
  }

  createTelegram(data: any): Observable<any> {
    const endpoint = '/api/telegram/register';
    const token = environment.token;
    return this.apiService.post(endpoint, token, data);
  }

  updateTelegram(data: any): Observable<any> {
    const endpoint = '/api/telegram/update';
    const token = environment.token;
    return this.apiService.post(endpoint, token, data);
  }

  telegramToggle(data: any): Observable<any> {
    const endpoint = '/api/telegram/toggle';
    const token = environment.token;
    return this.apiService.post(endpoint, token, data);
  }

  createConversation(data: any): Observable<any> {
    const endpoint = '/api/create_conversation';
    const token = environment.token;
    return this.apiService.post(endpoint, token, data);
  }

  createBotQuery(data: any): Observable<any> {
    const endpoint = '/api/bot/query';
    const token = environment.token;
    return this.apiService.post(endpoint, token, data);
  }

  getUserBots(): Observable<any> {
    const endpoint = '/api/dashboard/get_user_bots';
    const token = environment.token;
    return this.apiService.get(endpoint, token);
  }

  createUserBots(data: any): Observable<any> {
    const endpoint = '/api/bot/create';
    const token = environment.token;
    return this.apiService.post(endpoint, token, data);
  }

  getBotText(data: any): Observable<any> {
    const endpoint = '/api/bot/get_bot_text';
    const token = environment.token;
    return this.apiService.post(endpoint, token, data);
  }

  updateBotText(data: any): Observable<any> {
    const endpoint = '/api/bot/update_bot_text';
    const token = environment.token;
    return this.apiService.post(endpoint, token, data);
  }

  deleteBotText(data: any): Observable<any> {
    const endpoint = '/api/bot/delete_bot_text';
    const token = environment.token;
    return this.apiService.post(endpoint, token, data);
  }

  getBotWebsite(data: any): Observable<any> {
    const endpoint = '/api/bot/get_bot_website';
    const token = environment.token;
    return this.apiService.post(endpoint, token, data);
  }

  updateBotWebsite(data: any): Observable<any> {
    const endpoint = '/api/bot/update_bot_website';
    const token = environment.token;
    return this.apiService.post(endpoint, token, data);
  }

  deleteBotWebsite(data: any): Observable<any> {
    const endpoint = '/api/bot/delete_bot_website';
    const token = environment.token;
    return this.apiService.post(endpoint, token, data);
  }

  getBotPdf(data: any): Observable<any> {
    const endpoint = '/api/bot/get_bot_pdf';
    const token = environment.token;
    return this.apiService.post(endpoint, token, data);
  }

  updateBotPdf(data: FormData): Observable<any> {
    const endpoint = '/api/bot/update_bot_pdf';
    const token = environment.token;
    return this.apiService.post(endpoint, token, data);
  }

  deleteBotPdf(data: any): Observable<any> {
    const endpoint = '/api/bot/delete_bot_pdf';
    const token = environment.token;
    return this.apiService.post(endpoint, token, data);
  }

  getUserInfo(): Observable<any> {
    const endpoint = '/api/user_information';
    const token = environment.token;
    return this.apiService.get(endpoint, token);
  }

  createCheckoutSession(): Observable<any> {
    const endpoint = '/api/create-checkout-session';
    const token = environment.token;
    return this.apiService.post(endpoint, token, '');
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
  }

  getWhatsApp(data: any): Observable<any> {
    const endpoint = '/api/whatsapp/get_bot_information';
    const token = environment.token;
    return this.apiService.post(endpoint, token, data);
  }

  createWhatsApp(data: any): Observable<any> {
    const endpoint = '/api/whatsapp/register';
    const token = environment.token;
    return this.apiService.post(endpoint, token, data);
  }

  updateWhatsApp(data: any): Observable<any> {
    const endpoint = '/api/whatsapp/update';
    const token = environment.token;
    return this.apiService.post(endpoint, token, data);
  }

  whatsAppToggle(data: any): Observable<any> {
    const endpoint = '/api/whatsapp/toggle';
    const token = environment.token;
    return this.apiService.post(endpoint, token, data);
  }

  getActiveConversation(): Observable<any> {
    const endpoint = '/api/customer_support/get_active_conversation';
    const token = environment.token;
    return this.apiService.get(endpoint, token);
  }

  createCustomerSupportMessage(data: any): Observable<any> {
    const endpoint = '/api/customer_support/send_message';
    const token = environment.token;
    return this.apiService.post(endpoint, token, data);
  }

  getCustomerSupportConversation(data: any): Observable<any> {
    const endpoint = '/api/customer_support/get_conversation_messages';
    const token = environment.token;
    return this.apiService.post(endpoint, token, data);
  }

  getConversation(data:any): Observable<any> {
    const endpoint = '/api/get_conversations';
    const token = environment.token;
    return this.apiService.post(endpoint, token, data);
  }

  getConversationMessages(data:any): Observable<any> {
    const endpoint = '/api/get_conversation_messages';
    const token = environment.token;
    return this.apiService.post(endpoint, token, data);
  }

  favoriteConversation(data:any): Observable<any> {
    const endpoint = '/api/favorite_conversation';
    const token = environment.token;
    return this.apiService.post(endpoint, token, data);
  }
}