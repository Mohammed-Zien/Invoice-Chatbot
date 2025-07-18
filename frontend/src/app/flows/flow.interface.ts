export interface Flow<T> {
  handleUserInput(input: string): void;
  getCurrentPrompt(): string;
  getSuggestions(): string[];
  isComplete(): boolean;
  getResult(): T;
  getErrorMessage(): string | null;
}
