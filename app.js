const projects = [
  {
    name: "Desire Hub",
    desc: "One script hub — auto-loads the right script for your game.",
    supportedGames: ["Universal", "Troll", "Da Hood", "MM2"],
    copyText:
      'loadstring(game:HttpGet("https://raw.githubusercontent.com/desirecut/desire/refs/heads/main/desirehub"))()',
  },
];

const grid = document.getElementById("projects-grid");
const toast = document.getElementById("toast");
const header = document.querySelector(".site-header");
const navLinks = document.querySelectorAll("[data-nav]");

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 1800);
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.left = "-9999px";
  document.body.appendChild(area);
  area.select();
  document.execCommand("copy");
  document.body.removeChild(area);
}

function renderProjects() {
  if (!grid) return;

  projects.forEach((project) => {
    const card = document.createElement("div");
    card.className = "project-card";
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.innerHTML = `
      <div class="project-icon"><img src="logo.png?v=2" alt="" /></div>
      <div class="project-body">
        <div class="project-top">
          <h3 class="project-name"></h3>
          <span class="project-badge">Live</span>
        </div>
        <p class="project-desc"></p>
        <div class="project-games">
          <span class="project-games-label">Supported games</span>
          <div class="project-games-list"></div>
        </div>
        <p class="project-hint">Click to copy loadstring</p>
      </div>
      <div class="project-action" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="M16 1H4a2 2 0 0 0-2 2v14h2V3h12V1Zm3 4H8a2 2 0 0 0-2 2v16h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm0 18H8V7h11v16Z"/></svg>
      </div>
    `;

    card.querySelector(".project-name").textContent = project.name;
    card.querySelector(".project-desc").textContent = project.desc;

    const gamesList = card.querySelector(".project-games-list");
    if (project.supportedGames?.length && gamesList) {
      project.supportedGames.forEach((game) => {
        const tag = document.createElement("span");
        tag.className = "project-game";
        tag.textContent = game;
        gamesList.appendChild(tag);
      });
    } else {
      card.querySelector(".project-games")?.remove();
    }

    const onCopy = async () => {
      try {
        await copyText(project.copyText);
        card.classList.add("copied");
        showToast(`${project.name} copied to clipboard`);
        window.setTimeout(() => card.classList.remove("copied"), 1400);
      } catch {
        showToast("Copy failed — try again");
      }
    };

    card.addEventListener("click", onCopy);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onCopy();
      }
    });

    grid.appendChild(card);
  });
}

function setupReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  items.forEach((item) => observer.observe(item));
}

function setupHeader() {
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 12);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

function setupNav() {
  const sections = [...document.querySelectorAll("section[id]")];

  const setActive = () => {
    const y = window.scrollY + 120;
    let current = sections[0]?.id ?? "home";

    sections.forEach((section) => {
      if (section.offsetTop <= y) current = section.id;
    });

    navLinks.forEach((link) => {
      link.classList.toggle("active", link.dataset.nav === current);
    });
  };

  setActive();
  window.addEventListener("scroll", setActive, { passive: true });
}

function animateStats() {
  const values = document.querySelectorAll(".stat-value[data-count]");
  if (!values.length) return;

  const run = (el) => {
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix ?? "";
    const duration = 900;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);
      el.textContent = `${current}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          run(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  values.forEach((value) => observer.observe(value));
}

renderProjects();
setupReveal();
setupHeader();
setupNav();
animateStats();
