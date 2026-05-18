import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatService } from 'src/app/services/chat.service';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent {
  @ViewChild('scrollAnchor') private scrollAnchor!: ElementRef<HTMLElement>;

  messages: Message[] = [
    {
      role: 'assistant',
      content: "Hi! I'm an AI assistant with knowledge about Emiliano's portfolio. Ask me anything about his experience, skills, or projects!",
    },
  ];

  currentMessage = '';
  isLoading = false;

  constructor(private chatService: ChatService) {}

  send(): void {
    const msg = this.currentMessage.trim();
    if (!msg || this.isLoading) return;

    this.messages.push({ role: 'user', content: msg });
    this.currentMessage = '';
    this.isLoading = true;
    this.scrollToBottom();

    const history = this.messages
      .slice(1, -1)
      .map(m => ({ role: m.role, content: m.content }));

    this.chatService.sendMessage(msg, history).subscribe({
      next: reply => {
        this.messages.push({ role: 'assistant', content: reply });
        this.isLoading = false;
        this.scrollToBottom();
      },
      error: () => {
        this.messages.push({
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again later.',
        });
        this.isLoading = false;
        this.scrollToBottom();
      },
    });
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      this.scrollAnchor?.nativeElement.scrollIntoView({ behavior: 'smooth' });
    });
  }
}
