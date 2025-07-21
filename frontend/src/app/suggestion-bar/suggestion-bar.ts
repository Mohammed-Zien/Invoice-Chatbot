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
  @Input() disabled = false;
  @Output() suggestionClicked = new EventEmitter<string>();

  useSuggestion(text: string) {
    if (!this.disabled) {
      this.suggestionClicked.emit(text);
      console.log('Suggestion clicked:', text);
    }
  }

  // Helper method to check if suggestions should be shown
  get hasSuggestions(): boolean {
    return this.suggestions && this.suggestions.length > 0;
  }

  // TrackBy function for better performance
  trackBySuggestion(index: number, suggestion: string): string {
    return suggestion;
  }
}