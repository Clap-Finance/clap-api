const WELCOME_BODY = `Hi {{1}} 👋

Welcome to Clap.

You can send money, receive payments, check your balance, and manage your account—all from WhatsApp. 🇳🇬 ⇆ 🇳🇬, 🇳🇬 ⇆ 🇧🇯`;

export function welcomeTemplate(name: string): string {
  return WELCOME_BODY.replace('{{1}}', name);
}

export const WELCOME_BUTTON = {
  type: 'reply',
  reply: { id: 'get_started', title: 'Get Started' },
} as const;
