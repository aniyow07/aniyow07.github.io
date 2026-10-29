// Card videos play only while on screen; hero lines rotate. Both stay still under reduced motion.
const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!still) {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const v = e.target as HTMLVideoElement;
      if (e.isIntersecting) v.play().catch(() => {});
      else v.pause();
    }
  }, { threshold: 0.25 });
  document.querySelectorAll<HTMLVideoElement>('.card video').forEach((v) => io.observe(v));

  const lines = document.querySelectorAll('.rot h2');
  let i = 0;
  if (lines.length > 1) {
    setInterval(() => {
      lines[i].classList.remove('on');
      i = (i + 1) % lines.length;
      lines[i].classList.add('on');
    }, 3000);
  }
}
