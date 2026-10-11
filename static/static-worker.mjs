import { DurableObject } from "cloudflare:workers";

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
