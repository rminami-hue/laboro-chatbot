export type Language = 'vi' | 'ja' | 'en' | 'ne';

export interface LanguageData {
    title: string;
    subtitle: string;
    welcome: {
        title: string;
        message: string;
        services: string[];
        instruction: string;
    };
    placeholder: string;
    categories: {
        [key: string]: {
            title: string;
            items: string[];
        };
    };
}

export interface Message {
    text: string;
    sender: 'user' | 'bot';
    actions?: Action[];
}

export interface Action {
    type: 'link' | 'menu' | 'contact' | 'form' | 'home';
    text: string;
    action: string;
}

export interface Answer {
    text: string;
    actions?: Action[];
}
