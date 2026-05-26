(function () {
  "use strict";

  // ——— Typed name in hero ———
  const typedEl = document.getElementById("typedName");
  const nameText = typedEl?.dataset.name || typedEl?.textContent?.trim() || "Софа";
  const cursorEl = document.querySelector(".hero-cursor");
  let charIndex = 0;

  if (typedEl) typedEl.textContent = "";

  function typeName() {
    if (!typedEl) return;
    if (charIndex < nameText.length) {
      typedEl.textContent += nameText[charIndex];
      charIndex++;
      setTimeout(typeName, 120);
    } else if (cursorEl) {
      setTimeout(() => {
        cursorEl.style.display = "none";
      }, 2000);
    }
  }

  setTimeout(typeName, 400);

  // ——— Custom paw cursor (desktop) ———
  const paw = document.querySelector(".cursor-paw");
  if (paw && window.matchMedia("(min-width: 769px)").matches) {
    document.addEventListener("mousemove", (e) => {
      paw.style.left = e.clientX + "px";
      paw.style.top = e.clientY + "px";
    });
    document.querySelectorAll("a, button, input, textarea").forEach((el) => {
      el.addEventListener("mouseenter", () => {
        paw.style.transform = "translate(-50%, -50%) scale(1.4)";
      });
      el.addEventListener("mouseleave", () => {
        paw.style.transform = "translate(-50%, -50%) scale(1)";
      });
    });
  }

  // ——— Navigation ———
  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  const sections = document.querySelectorAll("section[id], header[id]");

  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 40);
  });

  navToggle?.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", open);
  });

  navLinks?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      navToggle?.setAttribute("aria-expanded", "false");
    });
  });

  // Active nav link on scroll
  const navAnchors = document.querySelectorAll(".nav-links a");
  function setActiveNav() {
    let current = "";
    sections.forEach((section) => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) current = section.getAttribute("id");
    });
    navAnchors.forEach((a) => {
      a.classList.toggle("active", a.getAttribute("href") === "#" + current);
    });
  }
  window.addEventListener("scroll", setActiveNav);
  setActiveNav();

  // ——— Counter animation ———
  const statNums = document.querySelectorAll(".hero-stat-num");
  let statsAnimated = false;

  function animateCounters() {
    if (statsAnimated) return;
    const hero = document.getElementById("hero");
    const rect = hero.getBoundingClientRect();
    if (rect.bottom < 100) return;

    statsAnimated = true;
    statNums.forEach((el) => {
      const target = parseInt(el.dataset.count, 10);
      const duration = 1800;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      }
      requestAnimationFrame(tick);
    });
  }
  window.addEventListener("scroll", animateCounters);
  animateCounters();

  // ——— Skill bars on scroll ———
  const skillCards = document.querySelectorAll(".skill-card");
  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const card = entry.target;
        const pct = card.dataset.skill || "80";
        const fill = card.querySelector(".skill-fill");
        if (fill) fill.style.width = pct + "%";
        skillObserver.unobserve(card);
      });
    },
    { threshold: 0.3 }
  );
  skillCards.forEach((card) => skillObserver.observe(card));

  // ——— Reveal on scroll ———
  const revealSelectors =
    ".section-header, .about-grid > *, .scratch-wrap, .skill-card, .project-card, .cat-card, .cats-quote, .feed-game, .contact-box > *";
  document.querySelectorAll(revealSelectors).forEach((el) => {
    el.classList.add("reveal");
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (!entry.isIntersecting) return;
        setTimeout(() => entry.target.classList.add("visible"), i * 80);
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  // ——— Theme toggle ———
  const themeToggle = document.getElementById("themeToggle");
  const savedTheme = localStorage.getItem("sonya-theme");

  if (savedTheme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
    themeToggle.textContent = "☀️";
  }

  themeToggle?.addEventListener("click", () => {
    const isLight = document.documentElement.getAttribute("data-theme") === "light";
    if (isLight) {
      document.documentElement.removeAttribute("data-theme");
      themeToggle.textContent = "🌙";
      localStorage.setItem("sonya-theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      themeToggle.textContent = "☀️";
      localStorage.setItem("sonya-theme", "light");
    }
  });

  // ——— Contact form (demo) ———
  const form = document.getElementById("contactForm");
  const formNote = document.getElementById("formNote");

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    formNote.hidden = false;
    form.reset();
    form.querySelector("button").textContent = "Sent! 🐱";
    setTimeout(() => {
      form.querySelector("button").textContent = "Send message 🐾";
      formNote.hidden = true;
    }, 4000);
  });

  // ——— Footer year & playful paw counter ———
  document.getElementById("year").textContent = new Date().getFullYear();

  const pawCountEl = document.getElementById("pawCount");
  if (pawCountEl) {
    let pawCount = parseInt(localStorage.getItem("sonya-paws") || "0", 10);
    pawCountEl.textContent = pawCount;

    document.addEventListener("click", (e) => {
      if (e.target.closest(".feed-game, .scratch-card, .feed-game-panel")) return;
      pawCount++;
      pawCountEl.textContent = pawCount;
      localStorage.setItem("sonya-paws", String(pawCount));
    });
  }

  // ——— Feed the cat mini-game ———
  initFeedGame();

  function initFeedGame() {
    const TREAT_GOAL = 10;
    const STORAGE_KEY = "sonya-cat-treats";

    const catEl = document.getElementById("feedCat");
    const bubbleEl = document.getElementById("feedBubble");
    const meterEl = document.getElementById("feedMeter");
    const meterFill = document.getElementById("feedMeterFill");
    const countEl = document.getElementById("treatCount");
    const moodLabel = document.getElementById("feedMoodLabel");
    const feedBtn = document.getElementById("feedBtn");
    const petBtn = document.getElementById("petBtn");
    const resetBtn = document.getElementById("feedResetBtn");
    const stageEl = document.getElementById("feedStage");
    const heartsEl = document.getElementById("feedHearts");
    const goalEl = document.getElementById("treatGoal");

    if (!catEl || !feedBtn) return;

    goalEl.textContent = TREAT_GOAL;

    let treats = parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10);
    treats = Math.min(Math.max(treats, 0), TREAT_GOAL);

    const moods = [
      { min: 0, emoji: "😿", label: "голоден", lines: ["Мрр… я голоден!", "Мяу? Есть вкусняшка?", "Пустая миска…"] },
      { min: 2, emoji: "😺", label: "любопытен", lines: ["О, вкусняшка!", "Ням-ням…", "Ещё?"] },
      { min: 5, emoji: "😸", label: "доволен", lines: ["Муррр! Спасибо!", "Вот это жизнь!", "Хвостик доволен"] },
      { min: 8, emoji: "😻", label: "сыт", lines: ["Так вкусно…", "Животик полный!", "Я почти счастлив…"] },
      { min: TREAT_GOAL, emoji: "😴", label: "спит", lines: ["Ззз…", "Мур… *дремлет*", "Больше не влезает…"] },
    ];

    function getMood(count) {
      let current = moods[0];
      for (const m of moods) {
        if (count >= m.min) current = m;
      }
      return current;
    }

    function randomLine(mood) {
      return mood.lines[Math.floor(Math.random() * mood.lines.length)];
    }

    function updateUI(animate) {
      const mood = getMood(treats);
      catEl.textContent = mood.emoji;
      catEl.className = "feed-cat feed-cat--" + mood.label.replace(/\s/g, "-");
      if (animate) catEl.classList.add("feed-cat--bounce");
      setTimeout(() => catEl.classList.remove("feed-cat--bounce"), 450);

      countEl.textContent = treats;
      moodLabel.textContent = "· " + mood.label;
      const pct = (treats / TREAT_GOAL) * 100;
      meterFill.style.width = pct + "%";
      meterEl.setAttribute("aria-valuenow", String(treats));
      meterEl.setAttribute("aria-valuemax", String(TREAT_GOAL));

      if (bubbleEl) bubbleEl.textContent = randomLine(mood);

      if (treats >= TREAT_GOAL) {
        feedBtn.disabled = true;
        feedBtn.textContent = "Кот сыт";
        stageEl.classList.add("feed-stage--complete");
      } else {
        feedBtn.disabled = false;
        feedBtn.textContent = "Дать вкусняшку";
        stageEl.classList.remove("feed-stage--complete");
      }
    }

    function spawnTreatFly() {
      const fly = document.createElement("span");
      fly.className = "feed-treat-fly";
      fly.textContent = "🐟";
      const stageRect = stageEl.getBoundingClientRect();
      const btnRect = feedBtn.getBoundingClientRect();
      const catRect = catEl.getBoundingClientRect();
      fly.style.left = btnRect.left - stageRect.left + btnRect.width / 2 + "px";
      fly.style.top = btnRect.top - stageRect.top + "px";
      stageEl.appendChild(fly);

      const dx = catRect.left - btnRect.left + catRect.width / 2 - btnRect.width / 2;
      const dy = catRect.top - btnRect.top - 20;
      fly.style.setProperty("--tx", dx + "px");
      fly.style.setProperty("--ty", dy + "px");

      fly.addEventListener("animationend", () => fly.remove());
    }

    function spawnHeart() {
      const heart = document.createElement("span");
      heart.className = "feed-heart";
      heart.textContent = "💗";
      heart.style.left = 40 + Math.random() * 40 + "%";
      heartsEl.appendChild(heart);
      heart.addEventListener("animationend", () => heart.remove());
    }

    feedBtn.addEventListener("click", () => {
      if (treats >= TREAT_GOAL) return;
      treats++;
      localStorage.setItem(STORAGE_KEY, String(treats));
      spawnTreatFly();
      const mood = getMood(treats);
      if (bubbleEl) bubbleEl.textContent = randomLine(mood);
      updateUI(true);

      if (treats === TREAT_GOAL) {
        catEl.classList.add("feed-cat--celebrate");
        setTimeout(() => catEl.classList.remove("feed-cat--celebrate"), 1200);
        for (let i = 0; i < 6; i++) {
          setTimeout(spawnHeart, i * 120);
        }
      }
    });

    petBtn.addEventListener("click", () => {
      const mood = getMood(treats);
      if (bubbleEl)
        bubbleEl.textContent =
        treats >= TREAT_GOAL
          ? "Ззз… *мурлычет во сне*"
          : ["Мур-мур!", "*тычется носом*", "Гладь-гладь! 💗"][Math.floor(Math.random() * 3)];
      catEl.classList.add("feed-cat--purring");
      for (let i = 0; i < 4; i++) setTimeout(spawnHeart, i * 80);
      setTimeout(() => catEl.classList.remove("feed-cat--purring"), 700);
    });

    resetBtn.addEventListener("click", () => {
      treats = 0;
      localStorage.setItem(STORAGE_KEY, "0");
      if (bubbleEl) bubbleEl.textContent = "Мрр… снова проголоден!";
      updateUI(false);
    });

    updateUI(false);
  }

  // ——— Scratch card (unusual interactive element) ———
  initScratchCard();

  function initScratchCard() {
    const wrap = document.getElementById("scratchCard");
    const canvas = document.getElementById("scratchCanvas");
    const resetBtn = document.getElementById("scratchReset");
    const skipBtn = document.getElementById("scratchSkip");
    const progressEl = document.getElementById("scratchProgress");
    const hintEl = document.getElementById("scratchHint");
    if (!wrap || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let isDrawing = false;
    let revealed = false;
    let width = 0;
    let height = 0;

    // Always start with a fresh, visible scratch layer on page load.
    // (Prevents cases where the layer appears "missing" after hot reloads or DOM changes.)
    function hardResetToHidden() {
      revealed = false;
      wrap.classList.remove("is-revealed");
      canvas.classList.remove("scratch-canvas--done");
      canvas.style.pointerEvents = "";
      hintEl?.removeAttribute("hidden");
      if (resetBtn) resetBtn.hidden = true;
      if (skipBtn) skipBtn.hidden = false;
      if (progressEl) progressEl.textContent = "0%";
    }

    function drawOverlay() {
      const w = width;
      const h = height;
      ctx.globalCompositeOperation = "source-over";
      const gradient = ctx.createLinearGradient(0, 0, w, h);
      gradient.addColorStop(0, "#8a7a9e");
      gradient.addColorStop(0.45, "#c9c4d4");
      gradient.addColorStop(1, "#b8956e");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = "rgba(26, 24, 32, 0.12)";
      ctx.font = "26px sans-serif";
      for (let row = 0; row < h; row += 44) {
        for (let col = 0; col < w; col += 48) {
          const offset = (row / 44) % 2 === 0 ? 0 : 24;
          ctx.fillText("🐾", col + offset, row + 32);
        }
      }

      ctx.fillStyle = "rgba(26, 18, 8, 0.92)";
      ctx.font = "600 1.05rem Outfit, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Потри лапкой, чтобы открыть секрет", w / 2, h / 2 - 12);
      ctx.font = "400 0.85rem Outfit, system-ui, sans-serif";
      ctx.fillStyle = "rgba(26, 18, 8, 0.65)";
      ctx.fillText("(мышь или палец на телефоне)", w / 2, h / 2 + 18);
    }

    function sizeCanvas() {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!revealed) drawOverlay();
    }

    function getPos(e) {
      const rect = canvas.getBoundingClientRect();
      const point = e.touches ? e.touches[0] : e;
      return {
        x: point.clientX - rect.left,
        y: point.clientY - rect.top,
      };
    }

    function erase(x, y) {
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      const brush = window.innerWidth < 768 ? 36 : 32;
      ctx.arc(x, y, brush, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";
    }

    function scratchedPercent() {
      const step = 24;
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let cleared = 0;
      let samples = 0;
      for (let y = 0; y < canvas.height; y += step) {
        for (let x = 0; x < canvas.width; x += step) {
          const i = (y * canvas.width + x) * 4 + 3;
          samples++;
          if (data[i] < 32) cleared++;
        }
      }
      return Math.round((cleared / samples) * 100);
    }

    let checkTimer;
    function scheduleCheck() {
      clearTimeout(checkTimer);
      checkTimer = setTimeout(() => {
        if (revealed) return;
        const pct = scratchedPercent();
        progressEl.textContent = pct + "%";
        if (pct >= 72) finishReveal();
      }, 100);
    }

    function finishReveal() {
      if (revealed) return;
      revealed = true;
      wrap.classList.add("is-revealed");
      canvas.classList.add("scratch-canvas--done");
      hintEl?.setAttribute("hidden", "");
      resetBtn.hidden = false;
      skipBtn.hidden = true;
      progressEl.textContent = "Открыто! 🐱";
    }

    function resetScratch() {
      revealed = false;
      wrap.classList.remove("is-revealed");
      canvas.classList.remove("scratch-canvas--done");
      canvas.style.pointerEvents = "";
      hintEl?.removeAttribute("hidden");
      resetBtn.hidden = true;
      skipBtn.hidden = false;
      progressEl.textContent = "0%";
      sizeCanvas();
    }

    function startDraw(e) {
      if (revealed) return;
      isDrawing = true;
      const { x, y } = getPos(e);
      erase(x, y);
      scheduleCheck();
    }

    function moveDraw(e) {
      if (!isDrawing || revealed) return;
      e.preventDefault();
      const { x, y } = getPos(e);
      erase(x, y);
      scheduleCheck();
    }

    function endDraw() {
      isDrawing = false;
    }

    canvas.addEventListener("mousedown", startDraw);
    canvas.addEventListener("mousemove", moveDraw);
    window.addEventListener("mouseup", endDraw);

    canvas.addEventListener(
      "touchstart",
      (e) => {
        startDraw(e);
      },
      { passive: false }
    );
    canvas.addEventListener(
      "touchmove",
      (e) => {
        moveDraw(e);
      },
      { passive: false }
    );
    canvas.addEventListener("touchend", endDraw);

    resetBtn?.addEventListener("click", resetScratch);
    skipBtn?.addEventListener("click", finishReveal);

    const resizeObserver = new ResizeObserver(() => {
      if (!revealed) sizeCanvas();
    });
    resizeObserver.observe(wrap);

    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !revealed && canvas.width === 0) {
          sizeCanvas();
        }
      },
      { threshold: 0.2 }
    );
    visibilityObserver.observe(wrap);

    hardResetToHidden();
    sizeCanvas();
  }

  // ——— Smooth scroll for anchor links ———
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const id = this.getAttribute("href");
      if (id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
})();
