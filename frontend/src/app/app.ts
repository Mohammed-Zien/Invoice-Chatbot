import { Component, signal } from '@angular/core';
import { ChatWindow } from './chat-window/chat-window';
import { HttpClientModule } from '@angular/common/http'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ChatWindow, HttpClientModule],
  template: `<app-chat-window />`,
})
export class App {
  protected readonly title = signal('frontend');
}
