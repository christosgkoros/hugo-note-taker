(function () {
  const form = document.querySelector('[data-composer]');
  if (!form) return;

  const note = form.querySelector('#note');
  const title = form.querySelector('#title');
  const tags = form.querySelector('#tags');
  const submit = form.querySelector('[data-submit]');
  const label = form.querySelector('[data-label]');
  const count = form.querySelector('[data-count]');
  const mastodon = form.querySelector('[data-mastodon]');
  const chips = form.querySelector('[data-chips]');

  // The server suggests a title/tags when either is empty, and publishes otherwise
  function willPublish() {
    return title.value.trim() !== '' && tags.value.trim() !== '';
  }

  function updateLabel() {
    label.textContent = willPublish() ? 'Publish' : 'Suggest title & tags';
  }

  function updateCount() {
    const n = note.value.length;
    count.textContent = n === 1 ? '1 character' : n + ' characters';
    if (mastodon) mastodon.hidden = n <= 450;
  }

  function autosize() {
    note.style.height = 'auto';
    note.style.height = note.scrollHeight + 2 + 'px';
  }

  function updateChips() {
    chips.replaceChildren(...tags.value.split(/\s+/).filter(Boolean).map(function (tag) {
      const chip = document.createElement('span');
      chip.className = 'chip';
      chip.textContent = tag;
      return chip;
    }));
  }

  note.addEventListener('input', function () { updateCount(); autosize(); });
  title.addEventListener('input', updateLabel);
  tags.addEventListener('input', function () { updateLabel(); updateChips(); });

  form.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) form.requestSubmit();
  });

  form.addEventListener('submit', function (e) {
    if (submit.disabled) return e.preventDefault();
    const publishing = willPublish();
    submit.disabled = true;
    submit.classList.add('is-busy');
    label.textContent = publishing ? 'Publishing…' : 'Thinking…';
  });

  // Re-enable the button when the page comes back from the bfcache
  window.addEventListener('pageshow', function () {
    submit.disabled = false;
    submit.classList.remove('is-busy');
    updateLabel();
  });

  updateCount();
  updateChips();
  autosize();
})();
