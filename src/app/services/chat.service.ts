import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

interface ChatMessage {
  role: string;
  content: string;
}

interface ChatResponse {
  reply: string;
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  constructor(private http: HttpClient) {}

  sendMessage(message: string, history: ChatMessage[]): Observable<string> {
    return this.http
      .post<ChatResponse>('/api/chat', { message, history })
      .pipe(map(res => res.reply));
  }
}
