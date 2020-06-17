
const Storage = {
    add: function(key, value) {
        const v = value instanceof Object ? JSON.stringify(value) : value;
        sessionStorage.setItem(key, v);
    },
    get: function(key) {
        try {
            const item = sessionStorage.getItem(key);
            if (item && item instanceof Object)
                return JSON.parse(item);
            else if (item)
                return item;
            return null;

          } catch (error) {
                console.log(error);
                return null;
          }
    },
    delete: function(key) {
        sessionStorage.removeItem(key);
    },
    clear: function() {
        sessionStorage.clear();
    }
}

export default Storage;