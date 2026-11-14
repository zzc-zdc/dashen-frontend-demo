(() => {
  'use strict';

  const hero = document.querySelector('.hero');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const precisePointer = window.matchMedia('(pointer: fine)');

  function connectIntro() {
    const intro = document.querySelector('#site-intro');
    const count = intro?.querySelector('#intro-count');
    const skip = intro?.querySelector('#intro-skip');
    if (!count || !skip || reducedMotion.matches) return;

    try {
      const key = 'dashen:intro-seen';
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, 'yes');
    } catch {
      // The animation can still run when session storage is unavailable.
    }

    const duration = 1500;
    const step = duration / 3;
    const root = document.documentElement;
    const timedSteps = [];
    const background = Array.from(document.body.children).filter(element => {
      return !element.inert && !element.contains(intro) && element.matches('header, main, footer, a');
    });
    let ending = false;

    function displayStep(index) {
      count.textContent = String(3 - index).padStart(2, '0');
      intro.style.setProperty('--intro-progress', String(index / 3));
    }

    function closeIntro() {
      if (ending) return;
      ending = true;
      timedSteps.forEach(clearTimeout);
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('visibilitychange', onVisibility);
      reducedMotion.removeEventListener('change', onPreference);
      intro.style.setProperty('--intro-progress', '1');
      intro.classList.add('is-exiting');

      function hide() {
        const focusWasInIntro = intro.contains(document.activeElement);
        background.forEach(element => { element.inert = false; });
        intro.hidden = true;
        root.classList.remove('has-intro');

        if (focusWasInIntro) {
          const main = document.querySelector('main');
          if (main && !main.hasAttribute('tabindex')) main.tabIndex = -1;
          main?.focus({ preventScroll: true });
        }

        document.dispatchEvent(new Event('dashen:intro-end'));
      }

      if (reducedMotion.matches || document.hidden) hide();
      else window.setTimeout(hide, 280);
    }

    function onKey(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeIntro();
      }

      if (event.key === 'Tab' && !intro.contains(document.activeElement)) {
        event.preventDefault();
        skip.focus();
      }
    }

    function onPreference(event) {
      if (event.matches) closeIntro();
    }

    function onVisibility() {
      if (document.hidden) closeIntro();
    }

    intro.style.setProperty('--intro-duration', `${duration}ms`);
    displayStep(0);
    intro.hidden = false;
    root.classList.add('has-intro');
    background.forEach(element => { element.inert = true; });
    skip.addEventListener('click', closeIntro, { once: true });
    document.addEventListener('keydown', onKey);
    document.addEventListener('visibilitychange', onVisibility);
    reducedMotion.addEventListener('change', onPreference);

    timedSteps.push(window.setTimeout(() => displayStep(1), step));
    timedSteps.push(window.setTimeout(() => displayStep(2), step * 2));
    timedSteps.push(window.setTimeout(closeIntro, duration));
  }

  function connectAutoplay(section, toggle, announcer, labels, delay, advance) {
    if (!toggle) return () => {};

    let timer;
    let pausedByUser = null;
    let visible = !('IntersectionObserver' in window);
    let hovered = precisePointer.matches && section.matches(':hover');

    function isPaused() {
      return pausedByUser ?? reducedMotion.matches;
    }

    function canAdvance() {
      return visible && !document.hidden && !document.documentElement.classList.contains('has-intro')
        && !isPaused() && !hovered && !section.contains(document.activeElement);
    }

    function reset() {
      clearTimeout(timer);
      const paused = isPaused();
      const ready = canAdvance();
      toggle.setAttribute('aria-pressed', String(paused));
      toggle.setAttribute('aria-label', paused ? labels.play : labels.pause);
      toggle.classList.toggle('is-paused', paused);
      announcer?.setAttribute('aria-live', ready ? 'off' : 'polite');

      if (ready) {
        timer = window.setTimeout(() => {
          if (canAdvance()) advance();
          reset();
        }, delay);
      }
    }

    toggle.addEventListener('click', () => {
      pausedByUser = !isPaused();
      reset();
    });

    section.addEventListener('pointerenter', event => {
      if (event.pointerType !== 'mouse') return;
      hovered = true;
      reset();
    });
    section.addEventListener('pointerleave', () => {
      hovered = false;
      reset();
    });
    section.addEventListener('focusin', reset);
    section.addEventListener('focusout', () => queueMicrotask(reset));
    document.addEventListener('visibilitychange', reset);
    document.addEventListener('dashen:intro-end', reset);
    reducedMotion.addEventListener('change', reset);

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting && entry.intersectionRatio > 0;
        reset();
      }).observe(section);
    }

    reset();
    return reset;
  }

  function connectCarousel() {
    if (!hero) return;

    const slides = Array.from(hero.querySelectorAll('.hero-slide'));
    const dots = Array.from(hero.querySelectorAll('[data-slide-to]'));
    const counter = hero.querySelector('#hero-current');

    if (slides.length < 2) return;

    let current = Math.max(0, slides.findIndex(slide => slide.classList.contains('is-active')));

    function selectSlide(index) {
      current = (index + slides.length) % slides.length;
      const slideKey = slides[current].dataset.slide ?? String(current);

      slides.forEach((slide, slideIndex) => {
        const active = slideIndex === current;
        slide.classList.toggle('is-active', active);
        slide.setAttribute('aria-hidden', String(!active));
        slide.inert = !active;
      });

      dots.forEach(dot => {
        const active = dot.dataset.slideTo === slideKey;
        dot.classList.toggle('is-active', active);
        dot.setAttribute('aria-current', String(active));
        if (dot.hasAttribute('aria-pressed')) dot.setAttribute('aria-pressed', String(active));
      });

      if (counter) counter.textContent = String(current + 1).padStart(2, '0');
    }

    hero.addEventListener('click', event => {
      const control = event.target.closest('[data-slide-to], [data-slide-prev], [data-slide-next]');
      if (!control) return;

      if (control.hasAttribute('data-slide-to')) {
        const index = slides.findIndex((slide, slideIndex) => {
          return (slide.dataset.slide ?? String(slideIndex)) === control.dataset.slideTo;
        });
        if (index >= 0) {
          selectSlide(index);
          resetAutoplay();
        }
        return;
      }

      selectSlide(current + (control.hasAttribute('data-slide-prev') ? -1 : 1));
      resetAutoplay();
    });

    hero.addEventListener('keydown', event => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      if (!event.target.closest('[data-hero-controls], [data-slide-to], [data-slide-prev], [data-slide-next]')) return;

      event.preventDefault();
      selectSlide(current + (event.key === 'ArrowLeft' ? -1 : 1));
      if (event.target.closest('[data-slide-to]')) {
        dots.find(dot => dot.getAttribute('aria-current') === 'true')?.focus();
      }
      resetAutoplay();
    });

    let touchOrigin = null;

    hero.addEventListener('touchstart', event => {
      touchOrigin = null;
      if (event.touches.length !== 1 || event.target.closest('a, button, input')) return;

      const touch = event.touches[0];
      touchOrigin = { x: touch.clientX, y: touch.clientY };
    }, { passive: true });

    hero.addEventListener('touchend', event => {
      if (!touchOrigin || event.touches.length) return;

      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - touchOrigin.x;
      const deltaY = touch.clientY - touchOrigin.y;
      touchOrigin = null;

      if (Math.abs(deltaX) > 56 && Math.abs(deltaX) > Math.abs(deltaY) * 1.7) {
        selectSlide(current + (deltaX < 0 ? 1 : -1));
        resetAutoplay();
      }
    }, { passive: true });

    hero.addEventListener('touchcancel', () => { touchOrigin = null; }, { passive: true });

    selectSlide(current);
    const resetAutoplay = connectAutoplay(
      hero,
      hero.querySelector('[data-slide-toggle]'),
      hero.querySelector('[data-slide-announcer]') ?? counter,
      { play: '播放主视觉轮播', pause: '暂停主视觉轮播' },
      4700,
      () => selectSlide(current + 1)
    );
  }

  function connectMarquee() {
    const ribbon = document.querySelector('.subtitle-ribbon');
    const toggle = ribbon?.querySelector('[data-marquee-toggle]');
    if (!toggle) return;

    const viewport = ribbon.querySelector('.marquee-viewport');
    let pausedByUser = null;
    let keyboardBrowsing = false;

    function update() {
      const paused = pausedByUser ?? reducedMotion.matches;
      ribbon.classList.toggle('is-marquee-paused', paused);
      ribbon.classList.toggle('is-marquee-playing', pausedByUser === false);
      ribbon.classList.toggle('is-marquee-background', document.hidden);
      toggle.classList.toggle('is-paused', paused);
      toggle.setAttribute('aria-pressed', String(paused));
      toggle.setAttribute('aria-label', paused ? '播放滚动字幕' : '暂停滚动字幕');
    }

    toggle.addEventListener('click', () => {
      pausedByUser = !(pausedByUser ?? reducedMotion.matches);
      update();
    });
    viewport?.addEventListener('focusin', event => {
      if (event.target.matches('.marquee-item:focus-visible')) keyboardBrowsing = true;
    });
    viewport?.addEventListener('focusout', () => queueMicrotask(() => {
      if (!keyboardBrowsing || viewport.contains(document.activeElement)) return;
      viewport.scrollLeft = 0;
      keyboardBrowsing = false;
    }));
    document.addEventListener('visibilitychange', update);
    reducedMotion.addEventListener('change', update);
    update();
  }

  function connectDust() {
    const canvas = document.querySelector('#hero-particle-canvas');
    const context = canvas?.getContext('2d');
    if (!hero || !context) return;

    const palette = ['225, 209, 171', '242, 238, 226', '206, 214, 222'];
    const pointer = { x: 0, y: 0, inside: false };
    const maxPixels = 3_200_000;
    let width = 0;
    let height = 0;
    let resolution = 1;
    let particles = [];
    let frame = 0;
    let previousTime = 0;
    let elapsed = 0;
    let shown = false;
    let shiftX = 0;
    let shiftY = 0;

    const ambientGlow = palette.map(color => {
      const sprite = document.createElement('canvas');
      sprite.width = sprite.height = 48;
      const paint = sprite.getContext('2d');
      const glow = paint.createRadialGradient(24, 24, 0, 24, 24, 24);
      glow.addColorStop(0, `rgba(${color}, .85)`);
      glow.addColorStop(.18, `rgba(${color}, .53)`);
      glow.addColorStop(.45, `rgba(${color}, .14)`);
      glow.addColorStop(1, `rgba(${color}, 0)`);
      paint.fillStyle = glow;
      paint.fillRect(0, 0, 48, 48);
      return sprite;
    });

    function seedParticles(count) {
      return Array.from({ length: count }, (_, index) => {
        const drift = Math.random();
        const glow = index % 7 === 0;

        return {
          x: (index % 4 === 0 ? Math.random() : .34 + Math.random() * .66) * width,
          y: Math.random() * height,
          vx: 3 + drift * 13,
          vy: -2 - Math.random() * 8,
          radius: glow ? 3 + drift * 4 : .45 + drift * 1.2,
          alpha: glow ? .14 + Math.random() * .23 : .11 + Math.random() * .31,
          phase: Math.random() * Math.PI * 2,
          color: index % palette.length,
          glow
        };
      });
    }

    function stop() {
      cancelAnimationFrame(frame);
      frame = 0;
      previousTime = 0;
    }

    function moveArt(seconds) {
      if (reducedMotion.matches || !precisePointer.matches) {
        shiftX = 0;
        shiftY = 0;
        hero.style.removeProperty('--hero-parallax-x');
        hero.style.removeProperty('--hero-parallax-y');
        return;
      }

      const targetX = pointer.inside ? (pointer.x / width - .5) * -15 : 0;
      const targetY = pointer.inside ? (pointer.y / height - .5) * -10 : 0;
      const ease = 1 - Math.exp(-seconds * 3.5);
      const nextX = shiftX + (targetX - shiftX) * ease;
      const nextY = shiftY + (targetY - shiftY) * ease;

      if (Math.abs(nextX - shiftX) + Math.abs(nextY - shiftY) < .015) return;
      shiftX = nextX;
      shiftY = nextY;
      hero.style.setProperty('--hero-parallax-x', `${shiftX.toFixed(2)}px`);
      hero.style.setProperty('--hero-parallax-y', `${shiftY.toFixed(2)}px`);
    }

    function render(seconds) {
      if (!width || !height) return;

      context.clearRect(0, 0, width, height);
      elapsed += seconds;

      for (const particle of particles) {
        let driftX = particle.vx + Math.sin(elapsed * .21 + particle.phase) * 4;
        let driftY = particle.vy + Math.cos(elapsed * .34 + particle.phase) * 3;

        if (pointer.inside && seconds > 0) {
          const dx = particle.x - pointer.x;
          const dy = particle.y - pointer.y;
          const distance = Math.hypot(dx, dy);
          const influence = Math.max(0, 1 - distance / 130) * .18;
          driftX += dx * influence;
          driftY += dy * influence;
        }

        particle.x += driftX * seconds;
        particle.y += driftY * seconds;

        if (particle.x > width + 8) particle.x = -8;
        if (particle.x < -8) particle.x = width + 8;
        if (particle.y > height + 8) particle.y = -8;
        if (particle.y < -8) particle.y = height + 8;

        const light = .54 + .46 * Math.sin(particle.phase + elapsed * .55);
        context.globalAlpha = particle.alpha * (.51 + light * .49);

        if (particle.glow) {
          const size = particle.radius * 2;
          context.drawImage(ambientGlow[particle.color], particle.x - particle.radius, particle.y - particle.radius, size, size);
        } else {
          context.fillStyle = `rgb(${palette[particle.color]})`;
          context.beginPath();
          context.arc(particle.x, particle.y, particle.radius, 0, 2 * Math.PI);
          context.fill();
        }
      }

      context.globalAlpha = 1;
      moveArt(seconds);
    }

    function animate(time) {
      if (!shown || document.hidden || reducedMotion.matches) {
        syncPlayback();
        return;
      }

      const seconds = previousTime ? Math.min((time - previousTime) / 1000, .04) : 0;
      previousTime = time;
      render(seconds);
      frame = requestAnimationFrame(animate);
    }

    function syncPlayback() {
      if (!shown || document.hidden || reducedMotion.matches || !width || !height) {
        stop();
        if (shown && reducedMotion.matches) render(0);
        return;
      }

      if (!frame) frame = requestAnimationFrame(animate);
    }

    function resizeCanvas() {
      const nextWidth = canvas.clientWidth;
      const nextHeight = canvas.clientHeight;
      if (!nextWidth || !nextHeight) return;

      const nextResolution = Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(maxPixels / (nextWidth * nextHeight)));
      if (width === nextWidth && height === nextHeight && resolution === nextResolution) return;

      width = nextWidth;
      height = nextHeight;
      resolution = nextResolution;
      canvas.width = Math.round(width * resolution);
      canvas.height = Math.round(height * resolution);
      context.setTransform(resolution, 0, 0, resolution, 0, 0);

      const count = Math.round(Math.min(68, Math.max(27, width * height / 16_000)));
      particles = seedParticles(count);
      if (shown) render(0);
      syncPlayback();
    }

    hero.addEventListener('pointermove', event => {
      if (reducedMotion.matches || !precisePointer.matches || event.pointerType === 'touch') return;

      const bounds = canvas.getBoundingClientRect();
      pointer.x = Math.min(width, Math.max(0, event.clientX - bounds.left));
      pointer.y = Math.min(height, Math.max(0, event.clientY - bounds.top));
      pointer.inside = true;
    }, { passive: true });

    hero.addEventListener('pointerleave', () => { pointer.inside = false; });

    if ('IntersectionObserver' in window) {
      const visibility = new IntersectionObserver(([entry]) => {
        shown = entry.isIntersecting;
        if (!shown) pointer.inside = false;
        syncPlayback();
      });
      visibility.observe(hero);
    } else {
      shown = true;
    }

    if ('ResizeObserver' in window) {
      new ResizeObserver(resizeCanvas).observe(canvas);
    }
    window.addEventListener('resize', resizeCanvas, { passive: true });
    document.addEventListener('visibilitychange', syncPlayback);
    reducedMotion.addEventListener('change', () => {
      pointer.inside = false;
      syncPlayback();
    });
    precisePointer.addEventListener('change', () => { pointer.inside = false; });

    resizeCanvas();
  }

  function connectReveals() {
    const elements = Array.from(document.querySelectorAll('[data-reveal]'));
    if (!elements.length || !('IntersectionObserver' in window) || reducedMotion.matches) return;

    function reveal(element) {
      element.classList.add('is-revealed');
      visibility.unobserve(element);
    }

    const visibility = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) reveal(entry.target);
      });
    });

    elements.forEach(element => {
      if (element.getBoundingClientRect().top <= window.innerHeight) return;

      element.classList.add('is-reveal-ready');
      element.addEventListener('focusin', () => reveal(element), { once: true });
      visibility.observe(element);
    });

    reducedMotion.addEventListener('change', event => {
      if (!event.matches) return;

      elements.forEach(element => {
        element.classList.remove('is-reveal-ready');
        element.classList.add('is-revealed');
      });
      visibility.disconnect();
    });
  }

  function connectMobileMenu() {
    const header = document.querySelector('#site-header');
    const toggle = document.querySelector('#mobile-menu-toggle');
    const menu = document.querySelector('#mobile-menu');
    if (!header || !toggle || !menu) return;

    function setOpen(open) {
      toggle.setAttribute('aria-expanded', String(open));
      menu.hidden = !open;
      header.classList.toggle('is-menu-open', open);
    }

    toggle.addEventListener('click', () => {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    menu.addEventListener('click', event => {
      if (event.target.closest('a, button')) setOpen(false);
    });

    document.addEventListener('pointerdown', event => {
      if (!menu.hidden && !header.contains(event.target)) setOpen(false);
    });

    header.addEventListener('keydown', event => {
      if (event.key !== 'Escape' || menu.hidden) return;

      setOpen(false);
      toggle.focus();
    });

    window.addEventListener('resize', () => {
      if (!menu.hidden && !toggle.getClientRects().length) setOpen(false);
    }, { passive: true });
  }

  function connectActiveNavigation() {
    const links = Array.from(document.querySelectorAll('.desktop-nav a[href^="#"]'));
    const destinations = links.map(link => document.getElementById(link.hash.slice(1))).filter(Boolean);
    if (destinations.length !== links.length || !links.length) return;

    let active;
    let scheduled = false;
    function update() {
      scheduled = false;
      const line = Math.min(220, window.innerHeight * .32);
      const current = destinations.findLastIndex(section => section.getBoundingClientRect().top <= line);
      if (current === active) return;
      active = current;
      links.forEach((link, index) => {
        if (index === active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }

    function scheduleUpdate() {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(update);
    }

    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate, { passive: true });
    update();
  }

  connectIntro();
  connectCarousel();
  connectMarquee();
  connectDust();
  connectReveals();
  connectMobileMenu();
  connectActiveNavigation();
})();
