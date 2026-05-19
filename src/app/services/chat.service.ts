import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatResponse {
  reply: string;
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  private messages: ChatMessage[] = [
    {
      role: 'assistant',
      content: "Hi! I'm an AI assistant with knowledge about Emiliano's portfolio. Ask me anything about his experience, skills, or projects!",
    },
  ];

  constructor(private http: HttpClient) {}

  getMessages(): ChatMessage[] {
    return [...this.messages];
  }

  setMessages(messages: ChatMessage[]): void {
    this.messages = [...messages];
  }

  sendMessage(message: string, history: ChatMessage[]): Observable<string> {
    return this.http
      .post<ChatResponse>('/api/chat', { message, history })
      .pipe(map(res => res.reply));
  }
}
