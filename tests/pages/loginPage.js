import { check } from 'k6';

export class LoginPage {
    constructor(page) {
        this.page = page;
    }

    async navigateTo() {
        await this.page.goto('https://test.k6.io/my_messages.php');
    }

    async checkLoginHeader() {
        await this.page.screenshot({ path: '../../report/screenshots/login.png' });
        
        return check(this.page, {
            'check login page header': (p) => p.locator('body > h2').textContent() === 'Unauthorized'
        });
    }

    async login(username, password) {
        this.page.locator('input[name="login"]').type(username);
        this.page.locator('input[name="password"]').type(password);
        await this.page.locator('input[type=submit]').click();
        await this.page.waitForNavigation();
    }

    async checkHomePageHeader() {
        await this.page.screenshot({ path: '../../report/screenshots/home.png' });

        return check(this.page, {
            'check home page header': (p) => {
                const headerText = p.locator('body > h2').textContent();
                return headerText === 'Welcome, admin!';
            }
        });
    }
}