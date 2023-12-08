export enum queueKeys {
  EMAIL = 'email',
}

export enum emailAction {
  WELCOME_EMAIL = 'welcomeEmail',
}

export class EmailType<T extends Record<string, any> = Record<string, any>> {
  from: string;
  to: string;
  subject: string;
  text: string;
  data: T;
  [key: string]: any;
}
