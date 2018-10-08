import { Component, OnInit } from '@angular/core';

import { WebCookbookService, Recipes4Logger, WebLoggerService, WebRecipeService } from "@app/core";

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

  constructor(private loggerService: WebLoggerService) {}

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
