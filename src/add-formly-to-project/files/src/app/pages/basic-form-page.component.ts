import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'app-basic-form-page',
  templateUrl: './basic-form-page.component.html',
  styleUrls: ['./basic-form-page.component.scss'],
})
export class BasicFormPageComponent {
  form = new FormGroup({});
  model: any = { email: 'email@gmail.com' };
  fields: FormlyFieldConfig[] = [
    {
      key: 'email',
      type: 'input',
      props: {
        label: 'Email address',
        placeholder: 'Enter email',
        required: true,
      },
    },
  ];

  onSubmit(model: any) {
    console.log(model);
  }
}
