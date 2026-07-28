const API_BASE = 'https://api.auraava.com'
const origFetch = window.fetch.bind(window)
window.fetch = function(i, o) {
    if (typeof i === 'string' && i.startsWith('/api/')) i = API_BASE + i
    else if (i instanceof Request && i.url.startsWith('/api/')) i = new Request(API_BASE + i.url, i)
    return origFetch(i, o)
}
