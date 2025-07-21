import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
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
export class ChatWindow implements AfterViewInit, OnDestroy {
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

  ngAfterViewInit(): void {
    this.messagesSub = this.messages$.subscribe(() => {
      // Give the DOM time to render the message
      setTimeout(() => this.scrollToBottom(), 0);
    });
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
      console.log("Scrolling to bottom...", el.scrollHeight);
      el.scrollTop = el.scrollHeight;
    } else {
      console.warn("Scroll container not found");
    }
  }
}