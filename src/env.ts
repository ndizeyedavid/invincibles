declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SMS_URL: string;
      COMPANY_SENDER_ID: string;
      USER_ID: string;
      MESSAGE: string;
      DB_PORT: number;
      HOST: string;
      USER_NAME: string;
      DB_PASSWORD: string;
      DATABASE_NAME: string;
      MAIL_HOST: string;
      MAIL_USER: string;
      MAIL_PASSWORD: string;
    }
  }
}
export { };
