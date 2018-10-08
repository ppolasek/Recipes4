import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebCookbookService } from './cookbook/cookbook.service';
import { WebService } from './common/common.service';
import { LoggerService, WebLoggerService } from './logger/logger.service';
import { Recipes4Logger } from './logger/logger';
import { WebRecipeService } from './recipe/recipe.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    WebService,
    LoggerService,
    WebLoggerService,
    Recipes4Logger,
    WebCookbookService,
    WebRecipeService,
  ],
})
export class CoreModule { }
