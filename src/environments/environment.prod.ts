export const environment = {
    production: true,
    // eslint-disable-next-line
    apiUrl: `http://${(window as any)['env']['apiIP']}/api` || 'https://localhost:10000',
    grafanaUrl: (window as any)['env']['grafanaUrl'] as string,
};
