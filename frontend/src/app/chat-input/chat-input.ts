import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-input.html',
  styleUrls: ['./chat-input.scss']
})
export class ChatInput {
  message: string = '';
  @Output() messageSent = new EventEmitter<string>();

  send() {
    const trimmed = this.message.trim();
    if (trimmed) {
      this.messageSent.emit(trimmed);
      this.message = '';
    }
  }
}
