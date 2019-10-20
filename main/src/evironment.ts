const NODE_ENV = process.env.NODE_ENV || 'dev';

export function isProduction(): boolean {
    return NODE_ENV === 'prod';
}
