import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  AfterViewChecked,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuggestionBar } from '../suggestion-bar/suggestion-bar';
import { ChatInput } from '../chat-input/chat-input';
import { Chat } from '../services/chat';
import { ChatMessage } from '../models/chat-message.model';
import { AsyncPipe } from '@angular/common';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-chat-window',
  standalone: true,
  imports: [CommonModule, SuggestionBar, ChatInput, AsyncPipe],
  templateUrl: './chat-window.html',
  styleUrls: ['./chat-window.scss'],
})
export class ChatWindow implements AfterViewChecked {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef<HTMLDivElement>;

  messages$!: Observable<ChatMessage[]>;
  suggestions$!: Observable<string[]>;
  isLoading$!: Observable<boolean>;
  private messagesSub!: Subscription;

  constructor(private chat: Chat) {
    this.messages$ = this.chat.messages$;
    this.suggestions$ = this.chat.suggestions$;
    this.isLoading$ = this.chat.isLoading$;
  }

  ngAfterViewChecked(): void {
      this.scrollToBottom();
    }

  ngOnDestroy(): void {
    if (this.messagesSub) {
      this.messagesSub.unsubscribe();
    }
  }

  handleUserMessage(msg: string): void {
    this.chat.sendMessage(msg);
  }

  private scrollToBottom(): void {
    const el = this.scrollContainer?.nativeElement;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }
}