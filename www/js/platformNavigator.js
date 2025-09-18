document.addEventListener("deviceready", () => {
  console.log("[PlatformNavigator] Ready on:", device.platform);
});

const PlatformNavigator = {
  replaceUrl: function (url) {
    if (device.platform === "iOS") {
      // iOS supports history.replaceState
      try {
        history.replaceState({}, document.title, url || location.href);
        console.log(
          "[PlatformNavigator] iOS replaceUrl:",
          url || location.href
        );
      } catch (e) {
        console.warn(
          "[PlatformNavigator] iOS replaceState failed, fallback:",
          e
        );
        location.replace(url || location.href);
      }
    } else if (device.platform === "Android") {
      // Android prefers Cordova's navigator.app
      if (navigator.app && navigator.app.clearHistory) {
        console.log("[PlatformNavigator] Android clearHistory");
        navigator.app.clearHistory();
      }

      location.replace(url || location.href);
    } else {
      // Other platforms (browser, etc.)
      console.log("[PlatformNavigator] Fallback for", device.platform);
      location.replace(url || location.href);
    }
  },

  // 🔹 Push new page (back history preserved)
  pushUrl: function (url) {
    url = url || location.href;
    if (device.platform === "iOS") {
      try {
        history.pushState({}, document.title, url);
        location.href = url; // ensure navigation
        console.log("[PlatformNavigator] iOS pushUrl:", url);
      } catch (e) {
        console.warn("[PlatformNavigator] iOS pushState failed, fallback:", e);
        location.assign(url);
      }
    } else if (device.platform === "Android") {
      console.log("[PlatformNavigator] Android pushUrl:", url);
      location.assign(url); // navigate + keep history
    } else {
      location.assign(url);
    }
  },

  disableBackButton: function (callback = {}) {
    if (device.platform === "Android") {
      document.addEventListener(
        "backbutton",
        (e) => {
          e.preventDefault();
          console.log("[PlatformNavigator] Back button disabled");
          if (callback) callback();
        },
        false
      );
    }
  },
};

window.PlatformNavigator = PlatformNavigator;
