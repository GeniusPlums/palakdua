"use client";

import { useEffect } from "react";

const QUOTES = [
  "\u201CWhere there\u2019s a will, there\u2019s a workflow.\u201D",
  "\u201CJack of all trades, master of some.\u201D",
  "\u201CDon\u2019t reinvent the wheel — automate the driver.\u201D",
  "\u201CIf you do it twice, automate it.\u201D",
  "\u201CAI won\u2019t replace you. Someone using AI will.\u201D",
  "\u201CCompound interest works on skills too.\u201D",
  "\u201CRevenue is vanity, profit is sanity, cash flow is reality.\u201D",
  "\u201CPrompt like a poet, ship like an engineer.\u201D",
  "\u201CThe best ROI is on the things you no longer do by hand.\u201D",
];

const ACHIEVEMENTS: Record<string, [string, string]> = {
  experience: ["📖", "Achievement unlocked: Read the chapters"],
  education: ["🎓", "Achievement unlocked: Did the homework"],
  campus: ["💃", "Achievement unlocked: Met the dancer"],
  skills: ["⚡", "Achievement unlocked: Skill check passed"],
  beliefs: ["🧭", "Achievement unlocked: Found the compass"],
};

const BELIEFS = [
  "Integrity compounds faster than capital.",
  "\u0915\u0930\u094D\u092E matters.",
  "Execution over perfection.",
  "You don\u2019t get what you want \u2014 you get who you are.",
  "Whenever you think it\u2019s too late, differentiate it. Time = 0.",
  "Antiquity over the temporary.",
  "Learning has no finish line \u2014 stay a student forever.",
  "Be the same person in every room.",
];

const WB_SLOTS = [
  { x: 6, y: 10, r: -1.6 },
  { x: 54, y: 14, r: 1.4 },
  { x: 9, y: 56, r: 1 },
  { x: 55, y: 60, r: -1.4 },
];

const CONFETTI_COLORS = ["#6d3df5", "#d4309f", "#10b981", "#f59e0b", "#3b82f6"];

export default function PortfolioClient() {
  useEffect(() => {
    const fineHover = matchMedia("(hover:hover) and (pointer:fine)").matches;
    const noMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups: Array<() => void> = [];
    const timeouts = new Set<ReturnType<typeof setTimeout>>();
    const intervals = new Set<ReturnType<typeof setInterval>>();

    const scheduleTimeout = (fn: () => void, ms: number) => {
      const id = setTimeout(() => {
        timeouts.delete(id);
        fn();
      }, ms);
      timeouts.add(id);
      return id;
    };

    const scheduleInterval = (fn: () => void, ms: number) => {
      const id = setInterval(fn, ms);
      intervals.add(id);
      return id;
    };

    const xpbar = document.getElementById("xpbar");
    const onScroll = () => {
      if (!xpbar) return;
      const root = document.documentElement;
      const max = root.scrollHeight - root.clientHeight;
      xpbar.style.width = `${Math.min(100, max > 0 ? (root.scrollTop / max) * 100 : 0)}%`;
    };
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    cleanups.push(() => removeEventListener("scroll", onScroll));

    const glow = document.getElementById("glow");
    const hero = document.querySelector<HTMLElement>(".hero");
    const onMouseMove = (e: MouseEvent) => {
      if (glow) {
        glow.style.left = `${e.clientX}px`;
        glow.style.top = `${e.clientY}px`;
      }
      if (fineHover && !noMotion && hero) {
        const cx = e.clientX / innerWidth - 0.5;
        const cy = e.clientY / innerHeight - 0.5;
        hero.style.setProperty("--px", `${cx * -18}px`);
        hero.style.setProperty("--py", `${cy * -10}px`);
      }
    };
    addEventListener("mousemove", onMouseMove, { passive: true });
    cleanups.push(() => removeEventListener("mousemove", onMouseMove));

    if (fineHover && !noMotion) {
      document.querySelectorAll<HTMLElement>("[data-tilt], .chapter").forEach((el) => {
        const onTiltMove = (e: MouseEvent) => {
          const r = el.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          el.style.transform = `perspective(900px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg) translateY(-2px)`;
        };
        const onTiltLeave = () => {
          el.style.transform = "";
        };
        el.addEventListener("mousemove", onTiltMove);
        el.addEventListener("mouseleave", onTiltLeave);
        cleanups.push(() => {
          el.removeEventListener("mousemove", onTiltMove);
          el.removeEventListener("mouseleave", onTiltLeave);
        });
      });

      document.querySelectorAll<HTMLElement>(".magnet").forEach((btn) => {
        const onMagnetMove = (e: MouseEvent) => {
          const r = btn.getBoundingClientRect();
          btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px, ${(e.clientY - r.top - r.height / 2) * 0.3}px)`;
        };
        const onMagnetLeave = () => {
          btn.style.transform = "";
        };
        btn.addEventListener("mousemove", onMagnetMove);
        btn.addEventListener("mouseleave", onMagnetLeave);
        cleanups.push(() => {
          btn.removeEventListener("mousemove", onMagnetMove);
          btn.removeEventListener("mouseleave", onMagnetLeave);
        });
      });
    }

    const burger = document.getElementById("burger");
    const mmenu = document.getElementById("mmenu");
    const toggleMenu = () => mmenu?.classList.toggle("openm");
    burger?.addEventListener("click", toggleMenu);
    mmenu?.querySelectorAll("a").forEach((a) => {
      const closeMenu = () => mmenu.classList.remove("openm");
      a.addEventListener("click", closeMenu);
      cleanups.push(() => a.removeEventListener("click", closeMenu));
    });
    cleanups.push(() => burger?.removeEventListener("click", toggleMenu));

    const navLinks = [
      ...document.querySelectorAll<HTMLAnchorElement>("#navlinks a"),
      ...document.querySelectorAll<HTMLAnchorElement>("#mmenu a"),
    ];
    const sectionIds = [
      ...new Set(
        navLinks
          .map((a) => a.getAttribute("href")?.slice(1))
          .filter((id): id is string => Boolean(id)),
      ),
    ];
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          navLinks.forEach((a) => {
            a.classList.toggle("active", a.getAttribute("href") === `#${id}`);
          });
        });
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) spy.observe(el);
    });
    cleanups.push(() => spy.disconnect());

    document.querySelectorAll<HTMLElement>(".ch-head").forEach((head) => {
      const onChapterClick = () => {
        head.closest(".chapter")?.classList.toggle("open");
      };
      head.addEventListener("click", onChapterClick);
      cleanups.push(() => head.removeEventListener("click", onChapterClick));
    });

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));
    cleanups.push(() => revealObserver.disconnect());

    const toast = document.getElementById("toast");
    const toastText = document.getElementById("toast-text");
    const toastEmoji = document.getElementById("toast-emoji");
    let toastTimer: ReturnType<typeof setTimeout> | undefined;

    const showToast = (emoji: string, msg: string) => {
      if (!toast || !toastText || !toastEmoji) return;
      toastEmoji.textContent = emoji;
      toastText.textContent = msg;
      toast.classList.add("show");
      if (toastTimer) clearTimeout(toastTimer);
      toastTimer = scheduleTimeout(() => toast.classList.remove("show"), 2800);
    };

    const seenAchievements = new Set<string>();
    const achievementObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;
          if (!entry.isIntersecting || !ACHIEVEMENTS[id] || seenAchievements.has(id)) {
            return;
          }
          seenAchievements.add(id);
          showToast(...ACHIEVEMENTS[id]);
        });
      },
      { threshold: 0.3 },
    );
    Object.keys(ACHIEVEMENTS).forEach((id) => {
      const el = document.getElementById(id);
      if (el) achievementObserver.observe(el);
    });
    cleanups.push(() => achievementObserver.disconnect());

    const quote = document.getElementById("quote");
    let quoteIndex = 0;
    if (quote) {
      const quoteInterval = scheduleInterval(() => {
        quote.classList.add("fade");
        scheduleTimeout(() => {
          quoteIndex = (quoteIndex + 1) % QUOTES.length;
          quote.textContent = QUOTES[quoteIndex];
          quote.classList.remove("fade");
        }, 460);
      }, 4200);
      cleanups.push(() => clearInterval(quoteInterval));
    }

    const wb = document.getElementById("wb");
    let beliefIndex = 0;
    const slotBusy = [false, false, false, false];

    const maxVisibleBeliefs = () => (innerWidth < 640 ? 1 : 3);

    const writeNextBelief = () => {
      if (!wb) return;
      const free = WB_SLOTS.map((_, i) => i).filter((i) => !slotBusy[i]);
      if (!free.length || slotBusy.filter(Boolean).length >= maxVisibleBeliefs()) {
        return;
      }
      const slotIndex = free[Math.floor(Math.random() * free.length)];
      const slot = WB_SLOTS[slotIndex];
      slotBusy[slotIndex] = true;

      const el = document.createElement("div");
      el.className = `wb-q${beliefIndex % 2 ? " ink2" : ""}`;
      el.style.left = `${slot.x}%`;
      el.style.top = `${slot.y}%`;
      el.style.setProperty("--r", `${slot.r}deg`);
      el.innerHTML = `\u201C${BELIEFS[beliefIndex % BELIEFS.length]}\u201D${
        beliefIndex % 3 === 0 ? '<span class="uline"></span>' : ""
      }`;
      beliefIndex += 1;
      wb.appendChild(el);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => el.classList.add("on"));
      });

      scheduleTimeout(() => {
        el.classList.add("erase");
        scheduleTimeout(() => {
          el.remove();
          slotBusy[slotIndex] = false;
        }, 900);
      }, 7600);
    };

    writeNextBelief();
    scheduleTimeout(writeNextBelief, 1300);
    scheduleTimeout(writeNextBelief, 2600);
    const whiteboardInterval = scheduleInterval(writeNextBelief, 2800);
    cleanups.push(() => clearInterval(whiteboardInterval));

    const avatar = document.getElementById("avatar");
    const onAvatarClick = (e: MouseEvent) => {
      e.preventDefault();
      for (let i = 0; i < 36; i++) {
        const piece = document.createElement("div");
        piece.className = "confetti";
        piece.style.left = `${e.clientX + (Math.random() * 160 - 80)}px`;
        piece.style.top = `${e.clientY}px`;
        piece.style.background = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
        piece.style.transform = `rotate(${Math.random() * 360}deg)`;
        piece.style.animationDelay = `${Math.random() * 0.3}s`;
        document.body.appendChild(piece);
        scheduleTimeout(() => piece.remove(), 1800);
      }
      showToast("\uD83C\uDF89", "Easter egg: You found Palak\u2019s party mode");
    };
    avatar?.addEventListener("click", onAvatarClick);
    cleanups.push(() => avatar?.removeEventListener("click", onAvatarClick));

    return () => {
      cleanups.forEach((fn) => fn());
      intervals.forEach((id) => clearInterval(id));
      timeouts.forEach((id) => clearTimeout(id));
      if (toastTimer) clearTimeout(toastTimer);
    };
  }, []);

  return null;
}
