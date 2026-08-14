const WELCOME_BODY = `Hi {{1}} 👋

*Welcome to Clap!*

You can send money, receive payments, check your balance, and manage your account—all from WhatsApp. 🇳🇬 ⇆ 🇳🇬, 🇳🇬 ⇆ 🇧🇯`;

export function welcomeTemplate(name: string): string {
  return WELCOME_BODY.replace('{{1}}', name);
}

export function flowAction(flow: { flowId?: string; flowName?: string }, flowToken: string): FlowAction {
  return {
    name: 'flow',
    parameters: {
      flow_message_version: '3',
      flow_token: flowToken,
      ...(flow.flowId ? { flow_id: flow.flowId } : { flow_name: flow.flowName }),
      flow_cta: 'Get Started',
      flow_action: 'navigate',
      flow_action_payload: { screen: 'PERSONAL_DETAILS' },
    },
  };
}

export interface FlowActionParameters {
  flow_message_version: '3';
  flow_token: string;
  flow_id?: string;
  flow_name?: string;
  flow_cta: 'Get Started';
  flow_action: 'navigate';
  flow_action_payload: { screen: 'PERSONAL_DETAILS' };
}

export interface FlowAction {
  name: 'flow';
  parameters: FlowActionParameters;
}
