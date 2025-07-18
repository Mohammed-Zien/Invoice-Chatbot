import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestionBar } from './suggestion-bar';

describe('SuggestionBar', () => {
  let component: SuggestionBar;
  let fixture: ComponentFixture<SuggestionBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuggestionBar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuggestionBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
