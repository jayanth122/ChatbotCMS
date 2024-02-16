import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotSelectionComponent } from './bot-selection.component';

describe('BotSelectionComponent', () => {
  let component: BotSelectionComponent;
  let fixture: ComponentFixture<BotSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotSelectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BotSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
