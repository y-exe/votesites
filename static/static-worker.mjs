import { DurableObject } from "cloudflare:workers";

// Keep the existing Durable Object class registered while this Worker serves
// the static site. This preserves its existing storage without exposing a
// live-results API or WebSocket from the static deployment.
export class LiveResultsRoom extends DurableObject {
  async fetch() {
    return new Response("Not found", { status: 404 });
  }
}

export default {
  fetch(request, env) {
    return env.ASSETS.fetch(request);
  },
};
