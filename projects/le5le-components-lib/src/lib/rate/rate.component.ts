import {
  Component,
  Input,
  forwardRef,
  Output,
  EventEmitter,
  ViewEncapsulation
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  Validator
} from '@angular/forms';

@Component({
  selector: 'ui-rate',
  template: `
    <span class="ui-rate" [class.pointer]="!readonly" (mouseleave)="onLeave()">
      <ng-template ngFor let-item let-i="index" [ngForOf]="stars">
        <i class="iconfont" [class.icon-star-o]="item===0" [class.icon-star-half-o]="item===1"
          [class.icon-star]="item===2" (click)="onClick(i+1)" (mouseenter)="onEnter(i+1)"></i>
      </ng-template>
      <span class="text">{{value | number:'.0-2'}}</span>
    </span>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RateComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => RateComponent),
      multi: true
    }
  ],
  styleUrls: ['./rate.css'],
  encapsulation: ViewEncapsulation.None
})
export class RateComponent implements ControlValueAccessor, Validator {
  @Input() readonly = false;
  @Input() required = false;
  @Output() change = new EventEmitter<any>();

  @Input() options: any = { total: 5 };

  // ngModeld的实际值
  private _value = 0;

  stars = [0, 0, 0, 0, 0];

  private valueChange = (value: any) => {};
  private touch = () => {};

  constructor() {}

  get value(): any {
    return this._value * (this.options.total / 5);
  }

  set value(v: any) {
    // 向5对齐
    this._value = v * (5 / this.options.total);
    this.setStar(this._value);
  }

  // 实现Validator接口，验证有效性
  validate(c: AbstractControl): { [key: string]: any } {
    if (!this.required) {
      return;
    }

    if (!this._value) {
      return { required: true };
    }
  }

  // model -> view
  writeValue(value: any) {
    this.value = value;
  }

  // view -> model，当控件change后，调用的函数通知改变model
  registerOnChange(fn: any) {
    this.valueChange = fn;
  }

  // 通知touched调用的函数
  registerOnTouched(fn: any) {
    this.touch = fn;
  }

  onClick(i) {
    if (this.readonly) {
      return;
    }

    this._value = i;
    this.valueChange(this.value);
    this.change.emit(this.value);
    this.setStar(this._value);
  }

  onEnter(i) {
    if (this.readonly) {
      return;
    }

    this.setStar(i);
  }

  onLeave() {
    if (this.readonly) {
      return;
    }

    this.setStar(this._value);
  }

  setStar(v) {
    this.stars = [0, 0, 0, 0, 0];

    const floorV = Math.floor(v) - 1;
    for (let i = 0; i < floorV; ++i) {
      this.stars[i] = 2;
    }

    if (v === floorV + 1) {
      this.stars[floorV] = 2;
    } else if (v > floorV + 1) {
      this.stars[floorV] = 1;
    }
  }
}
