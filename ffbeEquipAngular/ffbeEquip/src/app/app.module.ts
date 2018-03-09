import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import "rxjs/add/operator/debounceTime";
import { AppComponent } from './app.component';
import { SearchItemsPageComponent } from './search-items-page/search-items-page.component';
import { ItemLineComponent } from './item-line/item-line.component';
import { ItemListComponent } from './item-list/item-list.component';
import { DataService } from './data.service';
import { FilteringService } from "./filtering.service";
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    SearchItemsPageComponent,
    ItemLineComponent,
    ItemListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    DataService,
    FilteringService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
