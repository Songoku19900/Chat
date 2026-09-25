const CACHE_NAME = "chat-push-v1";

self.addEventListener("install", event => {
    self.skipWaiting();
});

self.addEventListener("activate", event => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener("push", event => {
    let data = {};
    try {
        data = event.data ? event.data.json() : {};
    } catch (error) {
        data = { title: "Chat", body: event.data ? event.data.text() : "Nouvelle notification" };
    }

    const title = data.title || "Chat";
    const options = {
        body: data.body || "Tu as une nouvelle notification.",
        icon: data.icon || "./icon-192.png",
        badge: data.badge || "./icon-192.png",
        data: { url: data.url || "./" },
        tag: data.tag || "chat-notification"
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", event => {
    event.notification.close();
    const url = event.notification.data && event.notification.data.url ? event.notification.data.url : "./";

    event.waitUntil(
        clients.matchAll({ type: "window", includeUncontrolled: true }).then(windowClients => {
            for (const client of windowClients) {
                if ("focus" in client) {
                    client.navigate(url);
                    return client.focus();
                }
            }
            if (clients.openWindow) return clients.openWindow(url);
        })
    );
});
