import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchItemsPageComponent } from './search-items-page.component';

describe('SearchItemsPageComponent', () => {
  let component: SearchItemsPageComponent;
  let fixture: ComponentFixture<SearchItemsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchItemsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchItemsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
