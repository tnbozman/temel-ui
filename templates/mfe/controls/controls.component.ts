import { Component, ElementRef, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';
import { GoldenLayout } from "golden-layout";
import { GoldenLayoutComponentService } from '../golden-layout-component.service';
import { GoldenLayoutHostComponent } from '../golden-layout-host/golden-layout-host.component';
import { predefinedLayoutNames, predefinedLayouts } from '../predefined-layouts';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent {
  private _goldenLayoutHostComponent!: GoldenLayoutHostComponent
  private _goldenLayout!: GoldenLayout;

  private _selectedRegisteredComponentTypeName!: string;
  public registeredComponentTypeNames!: readonly string[];
  public initialRegisteredComponentTypeName!: string;

  private _selectedLayoutName!: string;

  @ViewChild('placeHolder', { read: ViewContainerRef })
  viewContainer!: ViewContainerRef;

  public layoutNames!: readonly string[];
  public initialLayoutName!: string;

  get element() {
    return this._elRef.nativeElement;
  }

  constructor(private _elRef: ElementRef<HTMLElement>,
              private _goldenLayoutComponentService: GoldenLayoutComponentService
  ) {
  }

  initialise(value: GoldenLayoutHostComponent) {
    this._goldenLayoutHostComponent = value;
    this._goldenLayout = this._goldenLayoutHostComponent.goldenLayout;

    this._goldenLayoutHostComponent.setVirtualActive(true);

    this._goldenLayoutHostComponent.load().then(()=>{
      this.registeredComponentTypeNames = this._goldenLayoutComponentService.getRegisteredComponentTypeNames();
      this._selectedRegisteredComponentTypeName = this.registeredComponentTypeNames[0]
      this.initialRegisteredComponentTypeName = this._selectedRegisteredComponentTypeName;
      this.layoutNames = predefinedLayoutNames;
      this._selectedLayoutName = this.layoutNames[0]
      this.initialLayoutName = this._selectedLayoutName;
      this.handleLoadLayoutButtonClick();
    });

  }

  handleRegisteredComponentTypeSelectChange(value: string) {
    this._selectedRegisteredComponentTypeName = value;
  }

  handleAddComponentButtonClick() {
    const componentType = this._selectedRegisteredComponentTypeName;
    this._goldenLayout.addComponent(componentType);
  }

  handleLayoutSelectChange(value: string) {
    this._selectedLayoutName = value;
  }

  handleLoadLayoutButtonClick() {
    const selectedLayout = predefinedLayouts.find((layout) => layout.name === this._selectedLayoutName);
    if (selectedLayout === undefined) {
      throw new Error('handleLoadLayoutButtonClick Error');
    } else {
      this._goldenLayout.loadLayout(selectedLayout.config);
    }
  }

}
