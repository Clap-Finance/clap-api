export const GET_STARTED_FLOW = {
  version: '3.0',
  data: {
    screens: [
      {
        id: 'profile_screen',
        title: 'Your profile',
        terminal: false,
        data: {
          firstName: { type: 'string', required: true },
          lastName: { type: 'string', required: true },
          country: { type: 'string', required: true },
        },
        layout: {
          type: 'SingleColumnLayout',
          children: [
            { type: 'TextInput', name: 'firstName', label: 'First name' },
            { type: 'TextInput', name: 'lastName', label: 'Last name' },
            {
              type: 'Dropdown',
              name: 'country',
              label: 'Country',
              data_source: {
                type: 'static',
                options: [
                  { label: 'Nigeria 🇳🇬', value: 'Nigeria' },
                  { label: 'Benin 🇧🇯', value: 'Benin' },
                ],
              },
            },
          ],
        },
        footer: {
          type: 'Footer',
          children: [
            { type: 'FooterButton', label: 'Continue', onClick: { action: 'next' } },
          ],
        },
      },
      {
        id: 'credentials_screen',
        title: 'Create your account',
        terminal: false,
        data: {
          email: { type: 'string', required: false },
          password: { type: 'string', required: true },
        },
        layout: {
          type: 'SingleColumnLayout',
          children: [
            { type: 'TextInput', name: 'email', label: 'Email (optional)', keyboard: 'email' },
            { type: 'TextInput', name: 'password', label: 'Create a password (min 8 chars)', sensitive: true },
          ],
        },
        footer: {
          type: 'Footer',
          children: [
            { type: 'FooterButton', label: 'Submit', onClick: { action: 'submit' } },
          ],
        },
      },
    ],
    terminal_screens: [
      {
        id: 'success_screen',
        title: 'Welcome to Clap',
        terminal: true,
        layout: {
          type: 'SingleColumnLayout',
          children: [
            { type: 'Text', text: "You're all set. Start sending money from WhatsApp!" },
          ],
        },
        footer: {
          type: 'Footer',
          children: [
            { type: 'FooterButton', label: 'Done', onClick: { action: 'close' } },
          ],
        },
      },
      {
        id: 'error_screen',
        title: 'Something went wrong',
        terminal: true,
        layout: {
          type: 'SingleColumnLayout',
          children: [{ type: 'Text', text: 'Please try again later.' }],
        },
        footer: {
          type: 'Footer',
          children: [
            { type: 'FooterButton', label: 'Close', onClick: { action: 'close' } },
          ],
        },
      },
    ],
    routes: {
      profile_screen: { next: 'credentials_screen' },
      credentials_screen: {
        submit_action: { type: 'end', success: 'success_screen', error: 'error_screen' },
      },
    },
  },
} as const;

export const FLOWS: Record<string, unknown> = {
  get_started: GET_STARTED_FLOW,
};
