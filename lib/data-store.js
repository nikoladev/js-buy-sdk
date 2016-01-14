import ProductSerializer from 'buy-button-sdk/serializers/product-serializer';
import ProductAdapter from 'buy-button-sdk/adapters/product-adapter';

function DataStore(config) {
  this.config = config;
}

Object.defineProperties(DataStore.prototype, {
  config: {
    enumerable: true,
    writable: true,
    configurable: true,
    value: null
  },

  serializers: {
    enumerable: true,
    writable: true,
    configurable: true,
    value: {
      products: ProductSerializer
    }
  },

  adapters: {
    enumerable: true,
    writable: true,
    configurable: true,
    value: {
      products: ProductAdapter
    }
  },

  fetchAll: {
    configurable: true,
    enumerable: false,
    value: function (type) {
      const adapter = new this.adapters[type](this.config);

      return adapter.fetchCollection().then(payload => {
        return this.serialize(type, payload, { collection: true });
      });
    }
  },

  fetchOne: {
    configurable: true,
    enumerable: false,
    value: function (type, id) {
      const adapter = new this.adapters[type](this.config);

      return adapter.fetchSingle(id).then(payload => {
        return this.serialize(type, payload, { single: true });
      });
    }
  },

  fetchQuery: {
    configurable: true,
    enumerable: false,
    value: function (type, query) {
      const adapter = new this.adapters[type](this.config);

      return adapter.fetchCollection(query).then(payload => {
        return this.serialize(type, payload, { collection: true });
      });
    }
  },

  serialize: {
    configurable: true,
    enumerable: false,
    value: function (type, payload, opts = {}) {
      const serializer = new this.serializers[type](this.config);
      let serializedPayload;

      if (opts.collection) {
        serializedPayload = serializer.serializeCollection(payload, this);
      } else {
        serializedPayload = serializer.serializeSingle(payload, this);
      }

      return serializedPayload;
    }
  }
});

export default DataStore;