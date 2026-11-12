    // Apply theme before first paint to avoid a flash.
    (function () {
      try {
        var t = JSON.parse(localStorage.getItem('qahub:theme') || '"system"');
        var dark = t === 'dark' || (t === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
        document.documentElement.dataset.theme = dark ? 'dark' : 'light';
      } catch (e) { document.documentElement.dataset.theme = 'light'; }
    })();
