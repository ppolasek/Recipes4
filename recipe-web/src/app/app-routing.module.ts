import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";

import { DefaultViewComponent } from "./components/default-view/default-view.component";
import { SearchComponent } from "./components/search/search.component";
import { RecipeViewComponent } from "./components/recipe-view/recipe-view.component";
import { RecipeDetailComponent } from "./components/recipe-detail/recipe-detail.component";

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: DefaultViewComponent},
  {path: 'search', component: SearchComponent},
  {path: 'detail/:id', component: RecipeDetailComponent},
  {path: 'hover/:id', component: RecipeViewComponent},
];

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes) ],
})
export class AppRoutingModule {
}
