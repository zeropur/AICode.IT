import 'next-intl';
import type { Messages } from './i18n';

declare module 'next-intl' {
  export type IntlMessages = Messages;
}

export {}; 