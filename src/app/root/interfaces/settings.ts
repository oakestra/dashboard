export interface ISettings {
    username?: string;
    password?: string;
    address?: string;
    port?: string;
    ssl?: boolean;
    type: ConfigurationType;
}

export enum ConfigurationType {
    NONE = 'None',
    CUSTOME = 'Custome',
    OAKESTRA = 'Oakestra',
}
