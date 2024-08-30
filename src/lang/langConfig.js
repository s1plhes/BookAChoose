// src/lang/langConfig.js
import { createI18n } from 'vue-i18n';
import Cookies from 'js-cookie';

const savedLang = Cookies.get('lang') || 'en'; // Fallback a 'es' si no hay cookie

export const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric" };
    return new Date(dateString).toLocaleString(undefined, options)
}

export const i18n = createI18n({
    locale: savedLang,
    fallbackLocale: 'es',
    messages: {
        en: {
            message: {
                hello: 'hello world'
            },
            menu: {
                home: 'Home',
                books: 'Books',
                profile: 'Profile',
                logout: 'Sign out'
            },
            books: {
                title: 'Books',
                subtitle: 'List of books submitted by our community members.',
                createBtn: 'Create-a-Book',
                signUpLabel: 'and start to write your story.',
                readBtn: 'Read',
                add: 'Add Book',
                name: 'Book Title',
                author: 'Author',
                description: 'Description',
            },
        },
        es: {
            message: {
                hello: 'hola'
            },
            // Define other translations here for 'es'
        }
    },
});
