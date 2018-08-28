import { Component } from '@angular/core';

@Component({
  selector: 'app-component-slider',
  templateUrl: 'slider.component.html',
  providers: [],
  styleUrls: ['./slider.component.scss']
})
export class ComponentSliderComponent {
  min = 1;
  max = 14;
  min2 = 3;
  max2 = 18;
  constructor() {}
}
