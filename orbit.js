(() => {
  const viewport = document.querySelector('.orbit-viewport');
  const ring = document.querySelector('#orbit-ring');
  const cards = [...document.querySelectorAll('.orbit-card')];
  const readout = document.querySelector('.project-readout');
  const indexOutput = document.querySelector('#active-index');
  const categoryOutput = document.querySelector('#active-category');
  const titleOutput = document.querySelector('#active-title');
  const copyOutput = document.querySelector('#active-copy');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const caseLock = document.querySelector('#case-lock');
  const caseLockForm = document.querySelector('#case-lock-form');
  const caseLockClose = document.querySelector('#case-lock-close');
  const casePassword = document.querySelector('#case-password');
  const caseLockError = document.querySelector('#case-lock-error');
  const caseStudy = document.querySelector('#case-study');
  const caseSlide = document.querySelector('#case-slide');
  const caseProject = document.querySelector('#case-project');
  const casePosition = document.querySelector('#case-position');
  const caseEyebrow = document.querySelector('#case-eyebrow');
  const caseTitle = document.querySelector('#case-title');
  const caseBody = document.querySelector('#case-body');
  const caseVisual = document.querySelector('#case-visual');
  const caseMetric = document.querySelector('#case-metric');
  const caseLabel = document.querySelector('#case-label');
  const caseProgress = document.querySelector('#case-progress');
  const caseClose = document.querySelector('#case-close');
  const casePrevious = document.querySelector('#case-prev');
  const caseNext = document.querySelector('#case-next');
  const step = 360 / cards.length;
  const caseStudies = {
    smart: {
      title: 'Table Terminal App',
      slides: [
        ['Overview', 'A focused terminal for live table-game operations.', 'The Table Terminal brings table state, operational workflows, and exceptions into one role-aware workspace.', '01', 'TABLE OPERATIONS'],
        ['Challenge', 'High-frequency table workflows carried too much hidden state.', 'Operators needed to recognize status, complete tasks, and respond to exceptions without navigating fragmented tools.', '02', 'HIDDEN STATE'],
        ['System', 'One terminal connects table context to the next action.', 'The product organizes live state, task progression, permissions, and exception handling around the operator workflow.', '03', 'ROLE-AWARE FLOW'],
        ['Outcome', 'Faster task completion with clearer operational control.', 'The terminal direction reduces ambiguity and makes each table workflow easier to learn, execute, and audit.', '04', 'CLEAR EXECUTION']
      ]
    },
    compliance: {
      title: 'Compliance App',
      slides: [
        ['Overview', 'From fragmented risk signals to a connected case narrative.', 'The Compliance App gives analysts one place to understand entities, evidence, alerts, and decisions.', '01', 'RISK & AML'],
        ['Challenge', 'Analysts rebuilt context before they could assess risk.', 'Important relationships were scattered across systems, slowing investigation and making rationale difficult to trace.', '02', 'CONTEXT GAP'],
        ['System', 'The full case lifecycle shares one status model.', 'Role-based workflows move cases across analysts, approvers, and compliance leadership without losing evidence or decision context.', '03', 'CONNECTED CASE'],
        ['Outcome', 'Less time collecting context. More time applying judgment.', 'A clearer case structure supports faster review, visible ownership, and more defensible decisions.', '04', 'DEFENSIBLE DECISIONS']
      ]
    },
    ai: {
      title: 'Cage App',
      slides: [
        ['Overview', 'Operational workflows for cage and vault teams.', 'The Cage App connects chip inventory, circulation, transfer, reconciliation, and shift-based controls.', '01', 'CAGE OPERATIONS'],
        ['Challenge', 'Physical asset movement created dense, high-frequency workflows.', 'Teams needed to maintain accuracy and accountability while moving quickly across cage, vault, and bank operations.', '02', 'HIGH-FREQUENCY WORK'],
        ['System', 'Inventory state and movement history stay connected.', 'The experience aligns work objects, task status, role permissions, and exception handling across the operational lifecycle.', '03', 'ASSET CONTROL'],
        ['Outcome', 'Fewer clicks and better throughput for repeated operations.', 'Redesigning the Chip Bank circulation workflow reduced operational clicks by 10% while improving clarity for cage and vault teams.', '04', '10% FEWER CLICKS']
      ]
    },
    universe: {
      title: 'CMS Product Strategy',
      slides: [
        ['Overview', 'One product strategy across the entire Casino Management System.', 'The strategy connects table operations, cage workflows, financial controls, compliance, and shared platform foundations.', '01', 'ENTIRE CMS'],
        ['Challenge', 'Individual applications could not be designed as isolated products.', 'Roles, work objects, permissions, and financial state move across Table Terminal, Chip Vault, Chip Bank, Main Bank, and compliance workflows.', '02', 'CONNECTED DOMAIN'],
        ['System', 'A shared operating model guides every product decision.', 'The strategy defines domain boundaries, cross-product workflows, common objects, and a roadmap for consistent interaction patterns.', '03', 'PRODUCT DIRECTION'],
        ['Outcome', 'A coherent CMS instead of a collection of tools.', 'Teams gain a clearer basis for prioritization, architecture, and end-to-end workflow design across the portfolio.', '04', 'ONE CMS']
      ]
    },
    agent: {
      title: 'AI Design Pipeline',
      slides: [
        ['Overview', 'From requirements to testable interfaces through an AI-assisted pipeline.', 'The AI Design Pipeline generates, reviews, and refines product prototypes while preserving the rules behind them.', '01', 'AI DESIGN PIPELINE'],
        ['Challenge', 'Product rules disappear between requirements, design, and review.', 'Repeated interpretation creates inconsistency and makes feedback harder to connect to business logic and original intent.', '02', 'HANDOFF LOSS'],
        ['System', 'A shared rulebook drives planning, generation, and critique.', 'Each pass preserves requirements, component rules, navigation logic, and measurable review criteria in the repository.', '03', 'RULE-DRIVEN FLOW'],
        ['Outcome', 'Faster iteration without losing design rationale.', 'The pipeline creates a visible chain from source requirements to prototype decisions, review scores, and frontend-ready output.', '04', 'TRACEABLE OUTPUT']
      ]
    },
    journal: {
      title: 'Design System',
      slides: [
        ['Overview', 'A governed foundation shared by design and engineering.', 'The enterprise Design System connects tokens, modular components, Storybook documentation, and production code.', '01', 'DESIGN SYSTEM'],
        ['Challenge', 'Ad-hoc implementation created drift across a complex product suite.', 'Teams needed reusable patterns that could support dense enterprise workflows without losing consistency or speed.', '02', 'SYSTEM DRIFT'],
        ['System', 'Approved components move through one governed pipeline.', 'A whitelist middle layer, scalable panel architecture, and living Storybook documentation keep design and engineering aligned.', '03', 'COMPONENT GOVERNANCE'],
        ['Outcome', 'One source of truth from design intent to live code.', 'The system creates a durable foundation for product teams while supporting AI-assisted design and implementation workflows.', '04', 'SHARED FOUNDATION']
      ]
    }
  };
  let activeCase = null;
  let activeSlide = 0;
  let caseTrigger = null;
  let pendingCase = null;
  let casesUnlocked = false;
  const state = {
    current: -8,
    target: -8,
    tiltX: -9,
    tiltZ: -7,
    targetTiltX: -9,
    targetTiltZ: -7,
    active: -1,
    dragging: false,
    moved: false,
    pointerCard: null,
    pointerX: 0,
    lastTime: performance.now(),
    idleSince: performance.now()
  };

  cards.forEach((card, index) => {
    card.style.setProperty('--angle', `${index * step}deg`);
    card.dataset.index = String(index);
  });

  const normalizeAngle = (angle) => ((angle + 180) % 360 + 360) % 360 - 180;

  function setActive(index) {
    if (index === state.active) return;
    state.active = index;
    cards.forEach((card, cardIndex) => card.classList.toggle('is-active', cardIndex === index));
    const card = cards[index];
    readout.classList.add('is-changing');
    setTimeout(() => {
      indexOutput.textContent = String(index + 1).padStart(2, '0');
      categoryOutput.textContent = `${card.dataset.category} · ${card.dataset.year}`;
      titleOutput.textContent = card.dataset.title;
      copyOutput.textContent = card.dataset.copy;
      readout.classList.remove('is-changing');
    }, 180);
  }

  function updateActiveCard() {
    let closestIndex = 0;
    let closestDistance = Infinity;
    cards.forEach((card, index) => {
      const distance = Math.abs(normalizeAngle(index * step + state.current));
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
      const visibility = Math.max(.25, 1 - distance / 235);
      card.style.filter = `brightness(${visibility}) saturate(${.65 + visibility * .45})`;
    });
    setActive(closestIndex);
  }

  function updateCaseSlide(index, immediate = false) {
    if (!activeCase) return;
    const study = caseStudies[activeCase];
    activeSlide = (index + study.slides.length) % study.slides.length;
    const [eyebrow, title, body, metric, label] = study.slides[activeSlide];
    if (!immediate) caseSlide.classList.add('is-changing');
    setTimeout(() => {
      caseProject.textContent = study.title;
      casePosition.textContent = `${String(activeSlide + 1).padStart(2, '0')} / ${String(study.slides.length).padStart(2, '0')}`;
      caseEyebrow.textContent = eyebrow;
      caseTitle.textContent = title;
      caseBody.textContent = body;
      caseMetric.textContent = metric;
      caseLabel.textContent = label;
      caseVisual.dataset.case = activeCase;
      caseVisual.dataset.slide = String(activeSlide);
      caseProgress.style.transform = `translateX(${activeSlide * 100}%)`;
      caseSlide.classList.remove('is-changing');
    }, immediate ? 0 : 240);
  }

  function openCaseStudy(caseId, trigger) {
    if (!caseStudies[caseId]) return;
    activeCase = caseId;
    caseTrigger = trigger;
    caseStudy.hidden = false;
    document.body.classList.add('case-open');
    updateCaseSlide(0, true);
    caseClose.focus();
  }

  function caseStudiesAreUnlocked() {
    if (casesUnlocked) return true;
    try {
      return sessionStorage.getItem('case-studies-unlocked') === 'true';
    } catch {
      return false;
    }
  }

  function rememberCaseStudyUnlock() {
    casesUnlocked = true;
    try {
      sessionStorage.setItem('case-studies-unlocked', 'true');
    } catch {}
  }

  function requestCaseStudy(caseId, trigger) {
    if (caseStudiesAreUnlocked()) {
      openCaseStudy(caseId, trigger);
      return;
    }
    pendingCase = { caseId, trigger };
    caseLock.hidden = false;
    caseLockError.textContent = '';
    casePassword.value = '';
    document.body.classList.add('lock-open');
    casePassword.focus();
  }

  function closeCaseLock() {
    if (caseLock.hidden) return;
    caseLock.hidden = true;
    document.body.classList.remove('lock-open');
    pendingCase?.trigger.focus();
    pendingCase = null;
  }

  function closeCaseStudy() {
    if (caseStudy.hidden) return;
    caseStudy.hidden = true;
    document.body.classList.remove('case-open');
    caseTrigger?.focus();
    activeCase = null;
  }

  function render(time) {
    const delta = Math.min(40, time - state.lastTime);
    state.lastTime = time;
    if (!reducedMotion && !state.dragging && time - state.idleSince > 700) {
      state.target -= delta * .009;
    }
    state.current += (state.target - state.current) * (reducedMotion ? .2 : .075);
    state.tiltX += (state.targetTiltX - state.tiltX) * .055;
    state.tiltZ += (state.targetTiltZ - state.tiltZ) * .055;
    ring.style.transform = `rotateX(${state.tiltX}deg) rotateZ(${state.tiltZ}deg) rotateY(${state.current}deg)`;
    updateActiveCard();
    requestAnimationFrame(render);
  }

  viewport.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    state.dragging = true;
    state.moved = false;
    state.pointerCard = event.target instanceof Element ? event.target.closest('.orbit-card') : null;
    state.pointerX = event.clientX;
    state.idleSince = performance.now();
    viewport.setPointerCapture(event.pointerId);
  });

  viewport.addEventListener('pointermove', (event) => {
    const bounds = viewport.getBoundingClientRect();
    state.targetTiltX = -9 + ((event.clientY - bounds.top) / bounds.height - .5) * 7;
    state.targetTiltZ = -7 + ((event.clientX - bounds.left) / bounds.width - .5) * 4;
    if (!state.dragging) return;
    const movement = event.clientX - state.pointerX;
    if (Math.abs(movement) > 2) state.moved = true;
    state.target += movement * .24;
    state.pointerX = event.clientX;
  });

  function endDrag(event, shouldSelect) {
    const selectedCard = shouldSelect && !state.moved ? state.pointerCard : null;
    state.dragging = false;
    state.moved = false;
    state.pointerCard = null;
    state.idleSince = performance.now();
    if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
    if (selectedCard) requestCaseStudy(selectedCard.dataset.case, selectedCard);
  }

  viewport.addEventListener('pointerup', (event) => endDrag(event, true));
  viewport.addEventListener('pointercancel', (event) => endDrag(event, false));
  viewport.addEventListener('pointerleave', () => {
    if (!state.dragging) {
      state.targetTiltX = -9;
      state.targetTiltZ = -7;
    }
  });

  viewport.addEventListener('wheel', (event) => {
    event.preventDefault();
    state.target -= (Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY) * .065;
    state.idleSince = performance.now();
  }, { passive: false });

  cards.forEach((card, index) => {
    card.addEventListener('click', (event) => {
      if (event.detail === 0) requestCaseStudy(card.dataset.case, card);
    });
    card.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        event.preventDefault();
        cards[(index + 1) % cards.length].focus();
        state.target -= step;
      }
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault();
        cards[(index - 1 + cards.length) % cards.length].focus();
        state.target += step;
      }
    });
  });

  caseLockForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (casePassword.value !== '2026') {
      caseLockError.textContent = 'Incorrect password. Please try again.';
      casePassword.select();
      return;
    }
    const unlockedCase = pendingCase;
    rememberCaseStudyUnlock();
    caseLock.hidden = true;
    document.body.classList.remove('lock-open');
    pendingCase = null;
    if (unlockedCase) openCaseStudy(unlockedCase.caseId, unlockedCase.trigger);
  });
  caseLockClose.addEventListener('click', closeCaseLock);
  caseClose.addEventListener('click', closeCaseStudy);
  casePrevious.addEventListener('click', () => updateCaseSlide(activeSlide - 1));
  caseNext.addEventListener('click', () => updateCaseSlide(activeSlide + 1));
  addEventListener('keydown', (event) => {
    if (!caseLock.hidden) {
      if (event.key === 'Escape') closeCaseLock();
      return;
    }
    if (caseStudy.hidden) return;
    if (event.key === 'Escape') closeCaseStudy();
    if (event.key === 'ArrowLeft') updateCaseSlide(activeSlide - 1);
    if (event.key === 'ArrowRight') updateCaseSlide(activeSlide + 1);
    if (event.key === 'Tab') {
      const controls = [caseClose, casePrevious, caseNext];
      const currentIndex = controls.indexOf(document.activeElement);
      if (currentIndex === -1) return;
      event.preventDefault();
      const direction = event.shiftKey ? -1 : 1;
      controls[(currentIndex + direction + controls.length) % controls.length].focus();
    }
  });

  addEventListener('load', () => {
    requestAnimationFrame(() => document.querySelector('.orbit-page').classList.add('is-ready'));
  });
  setActive(0);
  requestAnimationFrame(render);
})();
