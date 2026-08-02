(() => {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(pointer: fine)').matches;
  const cursorGlow = document.querySelector('.cursor-glow');
  const revealElements = document.querySelectorAll('.reveal');
  const modal = document.querySelector('.project-modal');
  const modalPanel = modal.querySelector('.modal-panel');
  const modalTitle = modal.querySelector('#modal-title');
  const modalSummary = modal.querySelector('.modal-summary');
  const modalCount = modal.querySelector('.modal-count span');
  const modalVisual = modal.querySelector('.modal-visual');
  const modalFacts = modal.querySelectorAll('.modal-facts dd');
  const closeButton = modal.querySelector('.modal-close');
  let previouslyFocused = null;

  const projects = {
    'smart-table': {
      count: '01', title: 'Smart Table', summary: 'Workflow, made tangible.',
      focus: 'Live operations', role: 'Product strategy · UX · Prototyping', outcome: 'Calmer decisions under pressure',
      background: '#a9a0ff'
    },
    compliance: {
      count: '02', title: 'Compliance360', summary: 'Signals into decisions.',
      focus: 'Case intelligence', role: 'Research · Systems UX · Product design', outcome: 'Faster investigation with clearer risk context',
      background: '#17181a'
    },
    'chip-vault': {
      count: '03', title: 'Chip Vault', summary: 'Physical inventory, visible.',
      focus: 'Asset control', role: 'Workflow design · UI systems · Validation', outcome: 'One shared source of operational truth',
      background: '#240041'
    },
    'ai-lab': {
      count: '04', title: 'AI Lab', summary: 'Questions before features.',
      focus: 'Emerging systems', role: 'Concepting · Prototyping · Interaction design', outcome: 'Useful AI patterns grounded in real work',
      background: '#ddff86'
    }
  };

  if ('IntersectionObserver' in window && !reducedMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add('is-visible'));
  }

  if (finePointer && !reducedMotion) {
    let pointerX = innerWidth / 2;
    let pointerY = innerHeight / 2;
    let glowX = pointerX;
    let glowY = pointerY;

    addEventListener('pointermove', (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
    });

    const moveGlow = () => {
      glowX += (pointerX - glowX) * 0.12;
      glowY += (pointerY - glowY) * 0.12;
      cursorGlow.style.transform = `translate(${glowX}px, ${glowY}px) translate(-50%, -50%)`;
      requestAnimationFrame(moveGlow);
    };
    requestAnimationFrame(moveGlow);

    document.querySelectorAll('.tilt-card').forEach((card) => {
      let frame;
      card.addEventListener('pointermove', (event) => {
        const bounds = card.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          card.style.transform = `perspective(1100px) rotateX(${-y * 4.5}deg) rotateY(${x * 5.5}deg) translateY(-4px)`;
        });
      });
      card.addEventListener('pointerleave', () => {
        card.style.transition = 'transform .75s cubic-bezier(.16,1,.3,1)';
        card.style.transform = '';
        setTimeout(() => { card.style.transition = ''; }, 760);
      });
    });

    document.querySelectorAll('.magnetic').forEach((element) => {
      element.addEventListener('pointermove', (event) => {
        const bounds = element.getBoundingClientRect();
        element.style.transform = `translate(${(event.clientX - bounds.left - bounds.width / 2) * 0.14}px, ${(event.clientY - bounds.top - bounds.height / 2) * 0.14}px)`;
      });
      element.addEventListener('pointerleave', () => {
        element.style.transition = 'transform .6s cubic-bezier(.16,1,.3,1)';
        element.style.transform = '';
        setTimeout(() => { element.style.transition = ''; }, 620);
      });
    });
  }

  function openModal(projectId, trigger) {
    const project = projects[projectId];
    if (!project) return;
    previouslyFocused = trigger;
    modalCount.textContent = project.count;
    modalTitle.textContent = project.title;
    modalSummary.textContent = project.summary;
    modalVisual.style.background = project.background;
    modalVisual.dataset.project = projectId;
    modalFacts[0].textContent = project.focus;
    modalFacts[1].textContent = project.role;
    modalFacts[2].textContent = project.outcome;
    modal.hidden = false;
    document.body.classList.add('modal-open');
    closeButton.focus();
  }

  function closeModal() {
    if (modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove('modal-open');
    previouslyFocused?.focus();
  }

  document.querySelectorAll('.project').forEach((project) => {
    const trigger = project.querySelector('.project-link');
    trigger.addEventListener('click', () => openModal(project.dataset.project, trigger));
  });
  modal.querySelectorAll('[data-close-modal]').forEach((control) => control.addEventListener('click', closeModal));
  modalPanel.addEventListener('click', (event) => event.stopPropagation());
  addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeModal();
    if (event.key === 'Tab' && !modal.hidden) {
      event.preventDefault();
      closeButton.focus();
    }
  });
})();
