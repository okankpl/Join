const STORAGE_TOKEN = 'ORGNICKC5U7IPBO28E6CDB9FAQBPU1C0KDV34P2G';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';


/**
 * Sets an item in the storage using a key-value pair.
 * @param {string} key - The key under which to store the value.
 * @param {string} value - The value to store.
 * @returns {Promise<any>} A Promise that resolves to the response from the storage server.
 */
async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) })
        .then(res => res.json());
}


/**
 * Retrieves an item from the storage using the provided key.
 * @param {string} key - The key of the item to retrieve.
 * @returns {Promise<any>} A Promise that resolves to the value of the retrieved item.
 * @throws {string} Throws an error if the item with the provided key cannot be found.
 */
async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url).then(res => res.json()).then(res => {
        // Verbesserter code
        if (res.data) { 
            return res.data.value;
        } throw `Could not find data with key "${key}".`;
    });
}