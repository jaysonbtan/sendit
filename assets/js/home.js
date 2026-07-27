(function () {
  document.querySelectorAll('[data-copy]').forEach(function (button) {
    button.addEventListener('click', function () {
      var value = button.getAttribute('data-copy');
      if (!value || !navigator.clipboard) return;
      navigator.clipboard.writeText(value).then(function () {
        button.setAttribute('aria-label', 'Copied');
        setTimeout(function () {
          button.setAttribute('aria-label', 'Copy email address');
        }, 2000);
      });
    });
  });
})();
