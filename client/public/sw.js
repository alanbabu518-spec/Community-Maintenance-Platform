self.addEventListener("push", (event) => {
  const data = event.data?.json();

  if (!data) {
    return;
  }

  event.waitUntil(
    self.clients.matchAll({
      type: "window",
      includeUncontrolled: true,
    }).then((clients) => {
      const appIsOpen = clients.some(
        (client) => client.visibilityState === "visible",
      );

      if (appIsOpen) {
        return;
      }

      return self.registration.showNotification(data.title, {
        body: data.message,
        icon: "/icon-192.png",
      });
    }),
  );
});