import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { DefaultViewComponent } from "./components/default-view/default-view.component";
import { RecipeViewComponent } from "./components/recipe-view/recipe-view.component";
import { SearchComponent } from "./components/search/search.component";
// import { HeroesComponent } from "./heroes/heroes.component";
// import { DashboardComponent } from "./dashboard/dashboard.component";
// import { HeroDetailComponent } from "./hero-detail/hero-detail.component";

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: DefaultViewComponent},
  {path: 'search', component: SearchComponent},
  {path: 'detail/:id', component: RecipeViewComponent},
  // {path: 'hover', component: RecipeViewComponent},
  {path: 'hover/:id', component: RecipeViewComponent},
];

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes) ],
})
export class AppRoutingModule {
}
