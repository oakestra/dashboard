export const environment = {
    production: true,
    // eslint-disable-next-line
    apiUrl: `http://${(window as any)['env']['apiUrl']}/api` || 'https://localhost:10000',
};
