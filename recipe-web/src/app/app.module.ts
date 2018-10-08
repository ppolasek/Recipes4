import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from "./app-routing.module";
import { DefaultViewComponent } from './components/default-view/default-view.component';
import { AddedRecentlyComponent } from './components/added-recently/added-recently.component';
import { MAT_DIALOG_DEFAULT_OPTIONS} from "@angular/material";
import { Recipes4AppConfig } from "./models/model";
import { LoggerService, WebLoggerService } from "@app/core";
import { HttpClientModule } from "@angular/common/http";
import { RecipeListComponent } from './components/recipe-list/recipe-list.component';
import { MostViewedComponent } from './components/most-viewed/most-viewed.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { RecipeFormComponent } from './components/recipe-form/recipe-form.component';
import { FormsModule } from "@angular/forms";
import { SelectorDirective } from "./components/selector-directive";
import { RecipeViewComponent } from './components/recipe-view/recipe-view.component';
import { SearchComponent } from './components/search/search.component';
import { RecipeTagComponent } from './components/recipe-tag/recipe-tag.component';
import { RecipeAppEvent } from "./recipe-app-event";
import { RecipeDetailComponent } from './components/recipe-detail/recipe-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    DefaultViewComponent,
    AddedRecentlyComponent,
    RecipeListComponent,
    MostViewedComponent,
    DialogComponent,
    RecipeFormComponent,
    RecipeViewComponent,
    SearchComponent,
    RecipeTagComponent,
    RecipeDetailComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}},
    {provide: Recipes4AppConfig,
              useFactory: () => new Recipes4AppConfig(
                'http://localhost:8191',
                '/Recipes4',
                '/services'),
      deps:[],
    },
    {provide: LoggerService, useClass: WebLoggerService},
    {provide: SelectorDirective, useClass: SelectorDirective},
    {provide: RecipeAppEvent, useClass: RecipeAppEvent},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
