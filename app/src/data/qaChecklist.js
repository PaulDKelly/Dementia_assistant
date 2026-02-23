export function createQaChecklist() {
  return [
    {
      id: "qa-auth",
      title: "Auth flow works",
      detail: "Sign in or demo login lands on Home screen.",
      done: false,
    },
    {
      id: "qa-tabs",
      title: "Tabs switch correctly",
      detail: "Home, Today, Medication, Family, Talk, and Admin/QA tabs respond.",
      done: false,
    },
    {
      id: "qa-medications",
      title: "Medication logging works",
      detail: "Toggle at least one medication to Taken and verify timestamp updates.",
      done: false,
    },
    {
      id: "qa-family",
      title: "Family feed post works",
      detail: "Post a new update and ensure it appears at the top.",
      done: false,
    },
    {
      id: "qa-persistence",
      title: "Persistence works after restart",
      detail: "Close app and reopen; recent state should remain.",
      done: false,
    },
    {
      id: "qa-talk",
      title: "Talk actions respond",
      detail: "Send a quick phrase and verify Last outgoing message updates.",
      done: false,
    },
  ];
}
