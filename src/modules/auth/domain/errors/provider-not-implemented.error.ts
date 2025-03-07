export class ProviderNotImplemented extends Error {
  constructor() {
    super();
    this.name = 'ProviderNotImplemented';
    this.message = 'The requested provider is not implemented';
  }
}
