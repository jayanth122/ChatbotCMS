import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateBotDetailsComponent } from './update-bot-details.component';

describe('UpdateBotDetailsComponent', () => {
  let component: UpdateBotDetailsComponent;
  let fixture: ComponentFixture<UpdateBotDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateBotDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateBotDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
