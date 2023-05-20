import { Component, ElementRef, Inject } from '@angular/core';
import { ComponentContainer } from 'golden-layout';
import { BaseComponentDirective } from '{workspace}-lib';

@Component({
  selector: 'app-golden-layout-example-component',
  templateUrl: './golden-layout-example.component.html',
  styleUrls: ['./golden-layout-example.component.scss']
})
export class GoldenLayoutExampleComponent extends BaseComponentDirective {
  private value: boolean;
  public initialValue: boolean;

  constructor(@Inject(BaseComponentDirective.GoldenLayoutContainerInjectionToken) private container: ComponentContainer, elRef: ElementRef) {
    super(elRef.nativeElement);

    this.container.stateRequestEvent = () => this.handleContainerStateRequestEvent();

    const state = this.container.initialState;
    this.value = state as boolean;
    this.initialValue = this.value;
  }
  

  updateValue(value: boolean) {
    this.value = value;
  }

  handleContainerStateRequestEvent(): boolean {
    return this.value;
  }
}

export namespace GoldenLayoutExampleComponent {
  export const componentTypeName = 'GoldenLayoutExample';
}
