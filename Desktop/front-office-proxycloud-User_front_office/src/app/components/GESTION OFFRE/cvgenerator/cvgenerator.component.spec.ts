import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CvgeneratorComponent } from './cvgenerator.component';

describe('CvgeneratorComponent', () => {
  let component: CvgeneratorComponent;
  let fixture: ComponentFixture<CvgeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CvgeneratorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CvgeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
