// dynamic-form.component.ts
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

interface FormElement {
    type: string;
    label: string;
    placeholder?: string;
    required?: boolean;
    minLength?: number;
    min?: number;
    max?: number;
    options?: string[];
    defaultValue?: any;
    rows?: number;
    accept?: string[];
    style?: string;
}

@Component({
    selector: 'app-dynamic-form',
    templateUrl: './dynamic-form.component.html'
})
export class DynamicFormComponent implements OnInit {
    formElements: FormElement[] = [
        {type: 'text', label: 'Full Name', placeholder: 'Enter your full name', required: true},
        {type: 'email', label: 'Email Address', placeholder: 'Enter your email', required: true},
        {type: 'password', label: 'Password', placeholder: 'Enter your password', required: true, minLength: 8},
        {type: 'date', label: 'Date of Birth', required: true},
        {type: 'select', label: 'Gender', options: ['Male', 'Female', 'Other'], required: true},
        {type: 'checkbox', label: 'Subscribe to Newsletter', defaultValue: false},
        {type: 'radio', label: 'Preferred Contact Method', options: ['Email', 'Phone', 'Text'], required: true},
        {type: 'textarea', label: 'Comments', placeholder: 'Enter your feedback', rows: 4},
        {type: 'number', label: 'Age', min: 1, max: 100, required: true},
        {type: 'file', label: 'Upload Resume', accept: ['.pdf', '.docx']},
        {type: 'submit', label: 'Submit', style: 'primary'}
    ];

    form: FormGroup;

    constructor(private fb: FormBuilder) {
    }

    ngOnInit() {
        const group: { [key: string]: any } = {};
        this.formElements.forEach(elem => {
            const name = elem.label.replace(/\s+/g, '').toLowerCase();
            const validators = [];
            if (elem.required) validators.push(Validators.required);
            if (elem.minLength) validators.push(Validators.minLength(elem.minLength));
            if (elem.min != null) validators.push(Validators.min(elem.min));
            if (elem.max != null) validators.push(Validators.max(elem.max));

            group[name] = this.fb.control(elem.defaultValue ?? '', validators);
        });
        this.form = this.fb.group(group);
    }

    onSubmit() {
        console.log(this.form.value);
    }
}