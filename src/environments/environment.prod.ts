export const environment = {
    production: true,
    apiUrl: (() => {
        const protocol = (window as any)['env']['httpsEnabled'] === 'true' ? 'https' : 'http';
        return `${protocol}://${(window as any)['env']['apiIP']}/api`;
    })(),
    grafanaUrl: (() => {
        const protocol = (window as any)['env']['httpsEnabled'] === 'true' ? 'https' : 'http';
        return `${protocol}://${(window as any)['env']['grafanaAddress']}`;
    })(),
};
