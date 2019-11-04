import { animate, state, style, transition, trigger } from '@angular/animations';

export const dropDownAnimation =
    trigger('dropDownAnimation', [
        transition(':enter', [
            style({transform: 'translateY(-100%)'}),
            animate('0.5s ease-in-out', style({transform: 'translateY(0%)'}))
        ]),
        transition(':leave', [
            style({transform: 'translateY(0%)'}),
            animate('0.5s ease-in-out', style({transform: 'translateY(-100%)'}))
        ])
    ]);

export const showSectionAnimation = trigger('showSection', [
    state('false', style({
        opacity: '0'
    })),
    state('true', style({
        opacity: '1'
    })),
    transition('0 => 1', animate('500ms ease-in')),
    transition('1 => 0', animate('500ms ease-out'))
]);

export const changeHeightAnimation = trigger('changeHeight', [
    state('false', style({
        height: '0'
    })),
    state('true', style({
        height: '!'
    })),
    transition('1 => 0', animate('500ms ease-out'))
]);
