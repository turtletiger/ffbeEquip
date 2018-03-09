import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { FilteringService } from "../filtering.service";
import { FormGroup, FormBuilder } from '@angular/forms'

@Component({
  selector: 'app-search-items-page',
  templateUrl: './search-items-page.component.html',
  styleUrls: ['./search-items-page.component.css']
})
export class SearchItemsPageComponent implements OnInit {
  itemList = [];

  searchText: string = "";
  searchForm : FormGroup;

  constructor(private dataService: DataService, private filteringService: FilteringService, private fb : FormBuilder) {
    this.searchForm = fb.group({
      searchText: ''
    });
  }

  ngOnInit() {
    this.dataService.itemList.subscribe(itemList => {
      this.onChange();
    });
    this.searchForm.valueChanges.debounceTime(500).subscribe(form => this.onChange());
  }

  onChange() {
    this.itemList = this.filteringService.filter(this.dataService.itemList.getValue(), false, "", 0, this.searchForm.get('searchText').value);
  }

}
