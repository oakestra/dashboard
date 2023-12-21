import { Component } from '@angular/core';

@Component({
    selector: 'app-faq',
    templateUrl: './faq.component.html',
    styleUrls: ['./faq.component.scss'],
})
export class FaqComponent {
    items = [
        {
            question: 'Question 1',
            answer: 'Answer 1',
        },
        {
            question: 'Question 2',
            answer: 'Answer 2',
        },
        {
            question: 'Question 3',
            answer: 'Answer 3',
        },
        {
            question: 'Question 4',
            answer: 'Answer 4',
        },
    ];
}
