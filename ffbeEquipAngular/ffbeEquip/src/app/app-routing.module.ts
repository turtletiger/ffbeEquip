import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchItemsPageComponent }      from './search-items-page/search-items-page.component';


const routes: Routes = [
  { path: '', redirectTo: '/search', pathMatch: 'full' },
  { path: 'search', component: SearchItemsPageComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ]
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
