import { ChangeDetectorRef, Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatMessage, ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent {
  @ViewChild('scrollAnchor') private scrollAnchor!: ElementRef<HTMLElement>;

  messages: ChatMessage[] = [];

  currentMessage = '';
  isLoading = false;

  constructor(
    private chatService: ChatService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {
    this.messages = this.chatService.getMessages();
  }

  send(): void {
    const msg = this.currentMessage.trim();
    if (!msg || this.isLoading) return;

    this.persistMessages([...this.messages, { role: 'user', content: msg }]);
    this.currentMessage = '';
    this.isLoading = true;
    this.cdr.detectChanges();
    this.scrollToBottom();

    const history = this.messages
      .slice(1, -1)
      .map(m => ({ role: m.role, content: m.content }));

    this.chatService.sendMessage(msg, history).subscribe({
      next: reply => {
        this.zone.run(() => {
          this.persistMessages([...this.messages, { role: 'assistant', content: reply }]);
          this.isLoading = false;
          this.cdr.detectChanges();
          this.scrollToBottom();
        });
      },
      error: () => {
        this.zone.run(() => {
          this.persistMessages([
            ...this.messages,
            { role: 'assistant', content: 'Sorry, I encountered an error. Please try again later.' },
          ]);
          this.isLoading = false;
          this.cdr.detectChanges();
          this.scrollToBottom();
        });
      },
    });
  }

  private persistMessages(messages: ChatMessage[]): void {
    this.messages = messages;
    this.chatService.setMessages(messages);
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      this.scrollAnchor?.nativeElement.scrollIntoView({ behavior: 'smooth' });
    });
  }
}
