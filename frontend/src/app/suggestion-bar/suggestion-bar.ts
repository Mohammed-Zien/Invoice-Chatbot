import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-suggestion-bar',
  templateUrl: './suggestion-bar.html',
  styleUrls: ['./suggestion-bar.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class SuggestionBar {
  @Input() suggestions: string[] = [];
  @Output() suggestionClicked = new EventEmitter<string>();

  useSuggestion(text: string) {
    this.suggestionClicked.emit(text);
    console.log('Suggestion clicked:', text);
  }
}
