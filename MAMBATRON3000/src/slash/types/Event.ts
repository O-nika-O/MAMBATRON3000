import { ClientSlash } from "./Client";

export abstract class Event {
  client: ClientSlash;
  abstract run: (args?: unknown) => void;

  constructor(client: ClientSlash) {
    this.client = client;
  }
}
