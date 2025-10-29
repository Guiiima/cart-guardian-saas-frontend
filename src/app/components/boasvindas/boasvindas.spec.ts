import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Boasvindas } from './boasvindas';

describe('Boasvindas', () => {
  let component: Boasvindas;
  let fixture: ComponentFixture<Boasvindas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Boasvindas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Boasvindas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
