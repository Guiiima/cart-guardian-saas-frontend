import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Authscreen } from './authscreen';

describe('Authscreen', () => {
  let component: Authscreen;
  let fixture: ComponentFixture<Authscreen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Authscreen]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Authscreen);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
