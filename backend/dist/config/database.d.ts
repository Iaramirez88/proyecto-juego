interface DatabaseConfig {
    url: string;
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
}
interface JWTConfig {
    secret: string;
    expiresIn: string;
}
interface ServerConfig {
    port: number;
    nodeEnv: string;
    allowedOrigins: string[];
}
interface AppConfig {
    database: DatabaseConfig;
    jwt: JWTConfig;
    server: ServerConfig;
}
export declare const config: AppConfig;
export default config;
//# sourceMappingURL=database.d.ts.map