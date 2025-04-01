import 'next-intl';

declare module 'next-intl' {
  interface IntlMessages {
    Index: {
      title: string;
      description: string;
      hero_title: string;
      hero_stats: string;
      view_all: string;
      footer_copyright: string;
      footer_description: string;
      search_placeholder: string;
    };
    AIToolGrid: {
      featured: string;
      just_launched: string;
    };
    SignIn: {
      meta_title: string;
      meta_description: string;
      welcome: string;
      no_account: string;
      sign_up: string;
      sign_in: string;
    };
    SignUp: {
      meta_title: string;
      meta_description: string;
      welcome: string;
      have_account: string;
      sign_in: string;
    };
    Navigation: {
      discover: string;
      category: string;
      pricing: string;
      products: string;
      favourite: string;
      submit: string;
      login: string;
      dashboard: string;
    };
    Dashboard: {
      hello_message: string;
      alternative_message: string;
    };
  }
} 