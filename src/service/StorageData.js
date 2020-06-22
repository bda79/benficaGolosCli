
const Storage = {
    add: function(key, value) {
        const v = value instanceof Object ? JSON.stringify(value) : value;
        sessionStorage.setItem(key, v);
    },
    get: function(key) {
        const item = sessionStorage.getItem(key);
        if (item === null) return null;
        
        try {
            return JSON.parse(item);

          } catch (error) {
                //console.log(error);
                return item;
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