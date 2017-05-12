export function save_cache(key, value) {
    localStorage.setItem(key, value);
}

export function get_cache(key) {
    return localStorage.getItem(key);
}