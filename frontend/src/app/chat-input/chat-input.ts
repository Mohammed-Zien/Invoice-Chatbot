import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-chat-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-input.html',
  styleUrls: ['./chat-input.scss']
})
export class ChatInput {
  message: string = '';
  @Input() disabled = false;
  @Output() messageSent = new EventEmitter<string>();

  send() {
    const trimmed = this.message.trim();
    if (trimmed && !this.disabled) {
      this.messageSent.emit(trimmed);
      this.message = '';
    }
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }

  // Helper method to check if send button should be disabled
  get isSendDisabled(): boolean {
    return this.disabled || !this.message.trim();
  }
}