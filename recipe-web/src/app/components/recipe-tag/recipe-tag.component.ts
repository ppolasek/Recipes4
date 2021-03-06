import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Recipes4Logger, WebLoggerService} from "@app/core";
import {RecipeTag, RecipeTagEventType} from "@app/models";
import {RecipeTagEvent} from "./recipe-tag-event";

@Component({
  selector: 'app-recipe-tag',
  templateUrl: './recipe-tag.component.html',
  styleUrls: ['./recipe-tag.component.css']
})
export class RecipeTagComponent implements OnInit {
  private logger: Recipes4Logger = new Recipes4Logger(this.loggerService, 'RecipeTagComponent');

  constructor(
    private loggerService: WebLoggerService,
  ) { }

  ngOnInit() {
  }

  @Input()
  tag: RecipeTag;

  @Output('tagEvent')
  tagEvent = new EventEmitter();

  /// The user clicked to remove the tag from the recipe
  onDeleteClick() {
    this.logger.fine('onDeleteClick() deleting this tag: ' + this.tag);
    let tagEvent = new RecipeTagEvent();
    tagEvent.type = RecipeTagEventType.DELETE;
    tagEvent.tag = this.tag;
    this.tagEvent.emit(tagEvent);
  }
}
