"use client";

import { useEffect } from "react";

export default function PortfolioClient() {
  useEffect(() => {
    const glow = document.getElementById("glow");
    const xpbar = document.getElementById("xpbar");
    const quote = document.getElementById("quote");
    const toast = document.getElementById("toast");
    const burger = document.querySelector<HTMLElement>(".burger");
    const mMenu = document.querySelector<HTMLElement>(".m-menu");
    const avatar = document.getElementById("avatar");

    const onMouseMove = (e: MouseEvent) => {
      if (!glow) return;
      glow.style.left = `${e.clientX}px`;
      glow.style.top = `${e.clientY}px`;
    };

    const onScroll = () => {
      if (xpbar) {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        const pct = h > 0 ? (window.scrollY / h) * 100 : 0;
        xpbar.style.width = `${pct}%`;
      }

      document.querySelectorAll<HTMLElement>("section[id]").forEach((section) => {
        const top = section.offsetTop - 120;
        const bottom = top + section.offsetHeight;
        if (window.scrollY >= top && window.scrollY < bottom) {
          const id = section.id;
          document.querySelectorAll(".nav .links a, .m-menu a").forEach((a) => {
            a.classList.toggle("active", a.getAttribute("href") === `#${id}`);
          });
        }
      });
    };

    if (window.matchMedia("(hover: hover)").matches) {
      window.addEventListener("mousemove", onMouseMove);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

    document.querySelectorAll<HTMLElement>(".chapter").forEach((chapter) => {
      const head = chapter.querySelector<HTMLElement>(".ch-head");
      if (!head) return;
      head.addEventListener("click", () => {
        const open = chapter.classList.contains("open");
        document.querySelectorAll(".chapter.open").forEach((c) => {
          if (c !== chapter) c.classList.remove("open");
        });
        chapter.classList.toggle("open", !open);
      });
    });

    const quotes = quote?.dataset.quotes?.split("|").filter(Boolean) ?? [];
    let quoteIndex = 0;
    let quoteTimer: ReturnType<typeof setInterval> | undefined;

    if (quote && quotes.length > 1) {
      quoteTimer = setInterval(() => {
        quote.classList.add("fade");
        setTimeout(() => {
          quoteIndex = (quoteIndex + 1) % quotes.length;
          quote.textContent = quotes[quoteIndex];
          quote.classList.remove("fade");
        }, 400);
      }, 5000);
    }

    const toggleMenu = () => {
      burger?.classList.toggle("open");
      mMenu?.classList.toggle("openm");
    };

    burger?.addEventListener("click", toggleMenu);
    mMenu?.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        burger?.classList.remove("open");
        mMenu?.classList.remove("openm");
      });
    });

    const showToast = (msg: string) => {
      if (!toast) return;
      const text = toast.querySelector(".toast-msg");
      if (text) text.textContent = msg;
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 2800);
    };

    const spawnConfetti = (x: number, y: number) => {
      const colors = ["#6d3df5", "#d4309f", "#10b981", "#f59e0b", "#4338f0"];
      for (let i = 0; i < 24; i++) {
        const piece = document.createElement("div");
        piece.className = "confetti";
        piece.style.left = `${x}px`;
        piece.style.top = `${y}px`;
        piece.style.background = colors[i % colors.length];
        piece.style.transform = `rotate(${Math.random() * 360}deg)`;
        document.body.appendChild(piece);
        setTimeout(() => piece.remove(), 1500);
      }
    };

    avatar?.addEventListener("click", (e) => {
      spawnConfetti(e.clientX, e.clientY);
    });

    document.querySelectorAll<HTMLElement>("[data-copy]").forEach((el) => {
      el.addEventListener("click", async () => {
        const value = el.dataset.copy ?? "";
        try {
          await navigator.clipboard.writeText(value);
          showToast("Copied to clipboard!");
          spawnConfetti(
            el.getBoundingClientRect().left + el.offsetWidth / 2,
            el.getBoundingClientRect().top,
          );
        } catch {
          showToast("Could not copy — try manually");
        }
      });
    });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
      if (quoteTimer) clearInterval(quoteTimer);
      revealObserver.disconnect();
      burger?.removeEventListener("click", toggleMenu);
    };
  }, []);

  return null;
}
