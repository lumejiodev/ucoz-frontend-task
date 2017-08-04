function checkLocalStorage() {
    if ('result' in checkLocalStorage) {
        return checkLocalStorage.result;
    } else {
        try {
            return checkLocalStorage.result = 'localStorage' in window && window['localStorage'] !== null;
        } catch(e) {
            return checkLocalStorage.result = false;
        }
    }
}

export default class StorageHelper {
    static getOrSet( id, defaultValue ) {
        if (checkLocalStorage() === false) return;

        if (localStorage.getItem( id )) {
            return localStorage.getItem( id );
        } else {
            localStorage.setItem( id, defaultValue );
            return defaultValue;
        }
    }

    static getItem( id ) {
        if (checkLocalStorage() === false) return;

        return localStorage.getItem( id );
    }

    static setItem( id, value ) {
        if (checkLocalStorage() === false) return;

        localStorage.setItem( id, value );
    }

    static removeItem( id ) {
        if (checkLocalStorage() === false) return;

        localStorage.removeItem( id );
    }
}
