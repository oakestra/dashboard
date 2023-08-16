import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
    {
        title: 'Application Dashboard',
        icon: 'home-outline',
        link: '/control',
        home: true,
    },
    {
        title: 'Service Dashboard',
        icon: 'activity',
        link: '/control/help',
    },
    {
        title: 'Infrastructure Dashboard',
        icon: 'monitor',
        link: '/control/infrastructure',
    },
    {
        title: 'MANAGEMENT',
        group: true,
    },
    {
        title: 'Users',
        icon: 'person',
        link: '/control/users',
    },
    {
        title: 'Organisations',
        icon: 'people',
        link: '/control/organization',
    },
    {
        title: 'Mail Service',
        icon: 'email',
        link: '/control/settings',
    },
    {
        title: 'GENERAL',
        group: true,
    },
    {
        title: 'FAQ',
        icon: 'question-mark-circle',
        link: '/control/faq',
    },
    {
        title: 'Contact',
        icon: 'message-circle',
        link: '/control/help',
    },
];
