import { Component, OnInit } from '@angular/core';
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { WebLoggerService } from "./services/logger_service";
import { Recipes4Logger } from "./components/logger/logger";
import { tap } from "rxjs/operators";
import { CookbookService, WebCookbookService } from "./services/cookbook_service";
import { WebRecipeService } from "./services/recipe_service";
import {DialogComponent} from "./components/dialog/dialog.component";

@Component({
  selector: 'recipes4',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ WebLoggerService, WebCookbookService, WebRecipeService ],
})
export class AppComponent implements OnInit {
  private logger: Recipes4Logger = new Recipes4Logger(this.loggerService, 'AppComponent');

  title = 'Recipes4';

  showAddRecipeDialog: boolean = false;

  constructor(private loggerService: WebLoggerService, private cookbookService: WebCookbookService) {}

  ngOnInit() {
    this.logger.fine('ngOnInit()');
    // this.cookbookService.getAllCookbooks().subscribe(
    //   response => {
    //     console.log('ngOnInit() cookbookService.getAllCookbooks() returned:');
    //     console.log(response);
    //   });
  }

  onAddClick(): void {
    console.log('onAddClick()');
    this.showAddRecipeDialog = true;
  }
}
