(function () {
  function copyText(value) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(value).catch(function () {
        return fallbackCopy(value);
      });
    }
    return fallbackCopy(value);
  }

  function fallbackCopy(value) {
    return new Promise(function (resolve, reject) {
      var input = document.createElement('textarea');
      input.value = value;
      input.setAttribute('readonly', '');
      input.style.position = 'fixed';
      input.style.top = '0';
      input.style.left = '-9999px';
      document.body.appendChild(input);
      input.select();
      try {
        if (!document.execCommand('copy')) throw new Error('copy failed');
        resolve();
      } catch (error) {
        reject(error);
      } finally {
        document.body.removeChild(input);
      }
    });
  }

  document.querySelectorAll('[data-copy]').forEach(function (button) {
    var resetTimer;
    var defaultLabel = button.getAttribute('aria-label');

    button.addEventListener('click', function () {
      var value = button.getAttribute('data-copy');
      if (!value) return;

      copyText(value).then(function () {
        button.classList.add('is-copied');
        button.setAttribute('aria-label', 'Copied');
        window.clearTimeout(resetTimer);
        resetTimer = window.setTimeout(function () {
          button.classList.remove('is-copied');
          if (defaultLabel) button.setAttribute('aria-label', defaultLabel);
        }, 2000);
      });
    });
  });
})();
