import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Recipes4Logger } from "../logger/logger";
import { WebLoggerService } from "../../services/logger_service";
import { Recipe } from "../../models/recipe_model";

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
  private logger: Recipes4Logger = new Recipes4Logger(this.loggerService, 'DialogComponent');

  @Input()
  heading: string;

  @Input()
  buttonLabel: string = '';

  @Input()
  visible: boolean = false;

  @Output('close')
  closeEvent = new EventEmitter();

  constructor(private loggerService: WebLoggerService) { }

  ngOnInit() {
    this.logger.fine('ngOnInit()');
    this.logger.finest('ngOnInit() heading = ' + this.heading);
    this.logger.finest('ngOnInit() buttonLabel = ' + this.buttonLabel);
  }

  close() {
    this.visible = false;
    this.closeEvent.emit();
  }
}
