import { ThemeEnums } from './commonEnums';

const $body = document.querySelector('body');
const $themeChangeBtn = $body.querySelector('#theme-select');

const prefix = 'theme-';

export class Theme {
    constructor(name, defaultTheme) {
        this.name = name;
        this.defaultTheme = defaultTheme;

        this._deviceTheme = this.getDeviceTheme();
        this._localStorageTheme = this.getThemeFromLocalStorage();

        this.initial();
    }

    initial() {
        let self = this;

        $themeChangeBtn.value = this.defaultTheme;

        if (!this.getThemeFromLocalStorage())
            localStorage.setItem(this.name, this.defaultTheme);

        let options = $themeChangeBtn.querySelectorAll('option');
        options.forEach(n => {
            if (n.value === this._localStorageTheme) {
                n.selected = 'selected';
            }
        });

        this.addClass(this._localStorageTheme);

        $themeChangeBtn.addEventListener('change', function(evt) {
            self.applyTheme($themeChangeBtn.value);
        });
    }

    applyTheme(theme) {
        localStorage.setItem(this.name, theme);
        this._localStorageTheme = this.getThemeFromLocalStorage();
        this.addClass(theme);
    }

    getDeviceTheme() {
        let isDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;

        return isDarkTheme ? ThemeEnums.DARK : ThemeEnums.LIGHT;
    }

    getThemeFromLocalStorage() {
        return localStorage.getItem(this.name);
    }

    removeClasses() {
        let classList = [];
        $body.classList.forEach(c => classList.push(c))

        let classes = classList.filter(c => c.includes(prefix));
        classes.forEach(c => {
            $body.classList.remove(c);
        });
    }

    addClass(theme) {
        let selectedTheme = `${prefix}${theme}`;

        if (theme === ThemeEnums.AUTO)
            selectedTheme = `${prefix}${this._deviceTheme}`;

        this.removeClasses();
        $body.classList.add(selectedTheme);
    }
}