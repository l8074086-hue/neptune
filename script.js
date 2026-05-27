document.addEventListener("DOMContentLoaded", () => {
  const h1 = document.getElementById("greeting");
  if (h1) {
    const hour = new Date().getHours();
    if (hour < 12) h1.textContent = "good morning!";
    else if (hour < 18) h1.textContent = "good afternoon!";
    else h1.textContent = "good evening!";
  }

  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
    const saved = localStorage.getItem("theme");

    if (saved === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      themeToggle.textContent = "☀️";
    } else if (saved === "light") {
      document.documentElement.setAttribute("data-theme", "light");
      themeToggle.textContent = "🌙";
    } else if (prefersDark.matches) {
      document.documentElement.setAttribute("data-theme", "dark");
      themeToggle.textContent = "☀️";
    } else {
      themeToggle.textContent = "🌙";
    }

    themeToggle.addEventListener("click", () => {
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      if (isDark) {
        document.documentElement.setAttribute("data-theme", "light");
        localStorage.setItem("theme", "light");
        themeToggle.textContent = "🌙";
      } else {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
        themeToggle.textContent = "☀️";
      }
      if (scene) scene.syncTheme();
    });
  }

  const canvas = document.getElementById("starfield");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let objects = [];
  let mode = "stars";
  let animId;

  function getTheme() {
    const attr = document.documentElement.getAttribute("data-theme");
    if (attr === "dark") return "dark";
    if (attr === "light") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function initStars(count) {
    mode = "stars";
    objects = [];
    for (let i = 0; i < count; i++) {
      objects.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3,
        a: Math.random(),
        da: (Math.random() - 0.5) * 0.02,
      });
    }
  }

  function initClouds(count) {
    mode = "clouds";
    objects = [];
    for (let i = 0; i < count; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height * 0.7;
      const baseR = 30 + Math.random() * 70;
      const blobs = [];
      const n = 3 + Math.floor(Math.random() * 4);
      for (let j = 0; j < n; j++) {
        blobs.push({
          ox: (Math.random() - 0.5) * baseR,
          oy: (Math.random() - 0.5) * baseR * 0.5,
          r: baseR * (0.3 + Math.random() * 0.5),
        });
      }
      objects.push({ x, y, blobs, speed: 0.15 + Math.random() * 0.25 });
    }
  }

  function init() {
    const theme = getTheme();
    if (theme === "dark") initStars(120);
    else initClouds(10);
  }

  function drawStars() {
    for (const s of objects) {
      s.a += s.da;
      if (s.a > 1 || s.a < 0.1) s.da = -s.da;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${s.a})`;
      ctx.fill();
    }
  }

  function drawClouds() {
    for (const c of objects) {
      c.x += c.speed;
      if (c.x - 120 > canvas.width) c.x = -120;
      ctx.save();
      for (const b of c.blobs) {
        ctx.beginPath();
        ctx.arc(c.x + b.ox, c.y + b.oy, b.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
        ctx.fill();
      }
      ctx.restore();
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (mode === "stars") drawStars();
    else drawClouds();
    animId = requestAnimationFrame(draw);
  }

  resize();
  init();
  draw();

  window.addEventListener("resize", () => {
    resize();
    init();
  });

  const scene = { syncTheme: init };
});
