import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Birth } from './birth';

describe('Birth', () => {
  let component: Birth;
  let fixture: ComponentFixture<Birth>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Birth],
    }).compileComponents();

    fixture = TestBed.createComponent(Birth);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
