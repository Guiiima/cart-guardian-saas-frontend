import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Helpscrem } from './helpscrem';

describe('Helpscrem', () => {
  let component: Helpscrem;
  let fixture: ComponentFixture<Helpscrem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Helpscrem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Helpscrem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
