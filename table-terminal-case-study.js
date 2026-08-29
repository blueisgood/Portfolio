(() => {
  const sections = [...document.querySelectorAll('[data-section]')];
  const navLinks = [...document.querySelectorAll('[data-nav]')];
  const progress = document.querySelector('#scroll-progress');
  const gapToggle = document.querySelector('#gap-toggle');
  const gapToggleLabel = document.querySelector('#gap-toggle-label');

  function updateProgress() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const percentage = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    progress.style.width = `${Math.min(100, Math.max(0, percentage))}%`;
  }

  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

    if (!visible) return;
    navLinks.forEach((link) => link.classList.toggle('is-active', link.dataset.nav === visible.target.id));
  }, { rootMargin: '-28% 0px -55% 0px', threshold: [0, .2, .5] });

  sections.forEach((section) => observer.observe(section));
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  gapToggle.addEventListener('click', () => {
    const showGaps = gapToggle.getAttribute('aria-pressed') !== 'true';
    gapToggle.setAttribute('aria-pressed', String(showGaps));
    document.body.classList.toggle('gaps-hidden', !showGaps);
    gapToggleLabel.textContent = showGaps ? 'Hide missing evidence' : 'Show missing evidence';
  });
})();
