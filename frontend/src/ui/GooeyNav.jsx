/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const GooeyNav = ({
  items = [],
  rightContent = null,
  animationTime = 600,
  particleCount = 15,
  particleDistances = [90, 10],
  particleR = 100,
  timeVariance = 300,
  colors = [1, 2, 3, 1, 2, 3, 1, 4],
  initialActiveIndex = 0,
}) => {
  const containerRef = useRef(null);
  const navRef = useRef(null);
  const filterRef = useRef(null);
  const textRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);
  const [mobileOpen, setMobileOpen] = useState(false);

  const noise = (n = 1) => n / 2 - Math.random() * n;
  const getXY = (d, i, tot) => {
    const angle = ((360 + noise(8)) / tot) * i * (Math.PI / 180);
    return [d * Math.cos(angle), d * Math.sin(angle)];
  };
  const createParticle = (i, t, d, r) => {
    let rotate = noise(r / 10);
    return {
      start: getXY(d[0], particleCount - i, particleCount),
      end: getXY(d[1] + noise(7), particleCount - i, particleCount),
      time: t,
      scale: 1 + noise(0.2),
      color: colors[Math.floor(Math.random() * colors.length)],
      rotate: rotate > 0 ? (rotate + r / 20) * 10 : (rotate - r / 20) * 10,
    };
  };
  const makeParticles = (el) => {
    const d = particleDistances, r = particleR;
    const bubbleTime = animationTime * 2 + timeVariance;
    el.style.setProperty("--time", `${bubbleTime}ms`);
    for (let i = 0; i < particleCount; i++) {
      const t = animationTime * 2 + noise(timeVariance * 2);
      const p = createParticle(i, t, d, r);
      el.classList.remove("active");
      setTimeout(() => {
        const part = document.createElement("span");
        const point = document.createElement("span");
        part.classList.add("particle");
        part.style.setProperty("--start-x", `${p.start[0]}px`);
        part.style.setProperty("--start-y", `${p.start[1]}px`);
        part.style.setProperty("--end-x", `${p.end[0]}px`);
        part.style.setProperty("--end-y", `${p.end[1]}px`);
        part.style.setProperty("--time", `${p.time}ms`);
        part.style.setProperty("--scale", `${p.scale}`);
        part.style.setProperty("--color", `var(--color-${p.color}, white)`);
        part.style.setProperty("--rotate", `${p.rotate}deg`);
        point.classList.add("point");
        part.appendChild(point);
        el.appendChild(part);
        requestAnimationFrame(() => el.classList.add("active"));
        setTimeout(() => {
          try { el.removeChild(part) } catch { }
        }, t);
      }, 30);
    }
  };
  const updateEffectPosition = (el) => {
    if (!containerRef.current || !filterRef.current || !textRef.current) return;
    const cr = containerRef.current.getBoundingClientRect();
    const pr = el.getBoundingClientRect();
    const styles = {
      left: `${pr.x - cr.x}px`,
      top: `${pr.y - cr.y}px`,
      width: `${pr.width}px`,
      height: `${pr.height}px`,
    };
    Object.assign(filterRef.current.style, styles);
    Object.assign(textRef.current.style, styles);
    textRef.current.innerText = el.innerText;
  };
  const handleClick = (e, idx) => {
    const li = e.currentTarget;
    if (activeIndex === idx) return;
    setActiveIndex(idx);
    updateEffectPosition(li);
    if (filterRef.current) {
      Array.from(filterRef.current.querySelectorAll(".particle"))
        .forEach(n => n.remove());
    }
    textRef.current.classList.remove("active");
    void textRef.current.offsetWidth;
    textRef.current.classList.add("active");
    makeParticles(filterRef.current);
  };
  useEffect(() => {
    const li = navRef.current?.querySelectorAll("li")[activeIndex];
    if (li) {
      updateEffectPosition(li);
      textRef.current.classList.add("active");
    }
    const ro = new ResizeObserver(() => {
      const cli = navRef.current?.querySelectorAll("li")[activeIndex];
      if (cli) updateEffectPosition(cli);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [activeIndex]);

  return (
    <>
      <style>{`
        .glass-navbar {
          backdrop-filter: blur(12px) saturate(180%);
          background-color: rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.125);
        }
        .effect {
          position: absolute;
          opacity: 1;
          pointer-events: none;
          display: grid;
          place-items: center;
        }
        .effect.text { color: white; transition: color 0.3s ease; }
        .effect.text.active { color: black; }
        .effect.filter {
          filter: blur(7px) contrast(100) blur(0);
          mix-blend-mode: lighten;
        }
        .effect.filter::before {
          content:"";position:absolute;inset:-75px;z-index:-2;background:transparent;
        }
        .effect.filter::after {
          content:"";position:absolute;inset:0;background:white;
          transform:scale(0);opacity:0;z-index:-1;border-radius:9999px;
        }
        .effect.active::after { animation: pill 0.3s ease both; }
        @keyframes pill { to { transform:scale(1); opacity:1;} }
        .particle, .point {
          display:block;opacity:0;width:20px;height:20px;border-radius:9999px;
          transform-origin:center;
        }
        .particle {
          --time:5s;position:absolute;top:calc(50%-8px);left:calc(50%-8px);
          animation: particle calc(var(--time)) ease 1 -350ms;
        }
        .point {
          background: var(--color);opacity:1;
          animation: point calc(var(--time)) ease 1 -350ms;
        }
        @keyframes particle {
          0% { transform:rotate(0) translate(var(--start-x), var(--start-y)); opacity:1; }
          70% { transform:rotate(calc(var(--rotate)*0.5)) translate(calc(var(--end-x)*1.2), calc(var(--end-y)*1.2)); opacity:1; }
          100% { transform:rotate(calc(var(--rotate)*1.2)) translate(calc(var(--end-x)*0.5), calc(var(--end-y)*0.5)); opacity:1; }
        }
        @keyframes point {
          0% { transform:scale(0); opacity:0; }
          65% { transform:scale(var(--scale)); opacity:1; }
          100% { transform:scale(0); opacity:0; }
        }
      `}</style>

      <div ref={containerRef} className="relative z-50">
        <nav className="glass-navbar flex items-center justify-between px-4 py-2 md:py-3 shadow-lg">
          {/* Left brand */}
          <div className="text-[#3b1b0f] text-lg font-bold">StayFinder</div>

          {/* Main links */}
          <ul ref={navRef} className="hidden md:flex gap-6">
            {items.map((item, i) => (
              <li key={i} className={`py-1 px-3 rounded-full text-[#3b1b0f] cursor-pointer transition ${activeIndex === i ? 'bg-white text-black' : ''}`}
                onClick={(e) => handleClick(e, i)}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>

          {/* Mobile hamburger */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-black text-2xl  py-3 focus:outline-none cursor-pointer">
            {mobileOpen ? '✕' : '☰'}
          </button>

          {/* Right items (always visible on desktop) */}
          <div className="hidden md:flex gap-4 text-white">
            {rightContent}
          </div>
        </nav>

        {/* Gooey Effects */}
        <div className="hidden md:block">
          <span ref={filterRef} className="effect filter absolute z-10" />
          <span ref={textRef} className="effect text absolute z-20" />
        </div>


        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white/20 backdrop-blur-md p-4 space-y-2 border-rounded"
            >
              {items.map((it, idx) => (
                <button key={idx} onClick={() => { it.onClick?.(); setActiveIndex(idx); setMobileOpen(false); }}
                  className="block w-full text-left text-[#3b1b0f] bg-black/30 px-3 py-2 rounded-md">
                  {it.label}
                </button>
              ))}
              {rightContent}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default GooeyNav;
