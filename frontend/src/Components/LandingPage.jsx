// LandingPage.jsx
// Dependencies: framer-motion, react-icons
// npm install framer-motion react-icons
import React, { useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';

function useParticleCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = (canvas.width = innerWidth);
    let h = (canvas.height = innerHeight);
    let raf;
    const particles = [];
    const count = Math.floor((w * h) / 70000); // responsive density

    function reset() {
      w = canvas.width = innerWidth;
      h = canvas.height = innerHeight;
      particles.length = 0;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 1 + Math.random() * 2.2,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          hue: 200 + Math.random() * 40,
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        ctx.beginPath();
        ctx.fillStyle = `hsla(${p.hue}, 90%, 60%, 0.06)`;
        ctx.arc(p.x, p.y, p.r * 2.6, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    }

    reset();
    draw();
    window.addEventListener('resize', reset);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', reset);
    };
  }, []);
  return ref;
}

/* Interactive logo - 3D tilt + parallax (mouse-follow)
   Drop-in replacement for your existing motion div + img logo.
*/
function InteractiveLogo({
  src = '/download.png',
  size = 176 /* px, matches w-44 */,
}) {
  const wrapRef = useRef(null);

  // raw motion values (range -1..1 where center = 0)
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  // smooth them with springs
  const springConfig = { stiffness: 200, damping: 28 };
  const sx = useSpring(px, springConfig);
  const sy = useSpring(py, springConfig);

  // transform into rotations/translates
  const SENSITIVITY = 16; // lower = more extreme tilt
  const ROTATE_X = useTransform(sy, (v) => `${-v * 1 * (SENSITIVITY / 18)}deg`); // pitch
  const ROTATE_Y = useTransform(sx, (v) => `${v * 1 * (SENSITIVITY / 18)}deg`); // yaw
  const SCALE = useTransform(sx, (v) => 1 + Math.abs(v) * 0.03); // tiny scale with movement
  const SHADOW_Y = useTransform(sy, (v) => `${(v * 10).toFixed(1)}px`); // for subtle shadow move

  // Respect reduced motion preference
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    return (
      <div className="w-44 h-44 mb-6 rounded-full overflow-hidden border-4 border-blue-400/40 shadow-[0_0_40px_rgba(14,165,233,0.12)]">
        <img
          src={src}
          alt="devTinder logo"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  function handleMove(e) {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    // normalized -1 .. 1
    const nx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const ny = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    // clamp
    const cx = Math.max(-1, Math.min(1, nx));
    const cy = Math.max(-1, Math.min(1, ny));
    px.set(cx);
    py.set(cy);
  }

  function handleLeave() {
    px.set(0);
    py.set(0);
  }

  return (
    <motion.div
      ref={wrapRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="w-44 h-44 mb-6 rounded-full overflow-hidden border-4 shadow-[0_0_40px_rgba(14,165,233,0.12)]"
      style={{
        perspective: 1000,
        WebkitPerspective: 1000,
      }}
    >
      <motion.div
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          transformStyle: 'preserve-3d',
          rotateX: ROTATE_X,
          rotateY: ROTATE_Y,
          scale: SCALE,
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 28 }}
      >
        <img
          src={src}
          alt="devTinder logo"
          className="w-full h-full object-cover block"
          style={{
            transform: 'translateZ(26px)',
            filter: 'drop-shadow(0 10px 25px rgba(2,6,23,0.45))',
          }}
        />

        {/* subtle floating shadow layer for extra depth */}
        <motion.div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            pointerEvents: 'none',
            transform: 'translateZ(6px)',
            borderRadius: '9999px',
            mixBlendMode: 'screen',
            opacity: 0.06,
            boxShadow: `0 ${SHADOW_Y} 30px rgba(2,6,23,0.35)`,
          }}
        />
      </motion.div>
    </motion.div>
  );
}

const FeatureCard = ({ title, children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 18, scale: 0.98 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ delay: 0.4 + delay, duration: 0.6, ease: 'easeOut' }}
    className="w-64 p-4 rounded-2xl bg-gradient-to-br from-white/3 to-white/5 border border-white/6 backdrop-blur-md shadow-lg"
  >
    <h4 className="text-blue-200 font-semibold mb-2">{title}</h4>
    <p className="text-sm text-slate-300/90">{children}</p>
  </motion.div>
);

const LandingPage = () => {
  const canvasRef = useParticleCanvas();
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white">
      {/* particle canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 -z-10" aria-hidden />

      {/* moving aurora blobs */}
      <motion.div
        aria-hidden
        className="absolute rounded-full blur-3xl mix-blend-screen"
        style={{
          width: 700,
          height: 700,
          background: 'linear-gradient(135deg,#0ea5e9, #60a5fa 50%, #7c3aed)',
          left: -160,
          top: -120,
          opacity: 0.12,
        }}
        animate={{
          x: [0, -80, 40, 0],
          y: [0, -40, 60, 0],
          rotate: [0, 25, -25, 0],
        }}
        transition={{ repeat: Infinity, duration: 18, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="absolute rounded-full blur-3xl mix-blend-screen"
        style={{
          width: 520,
          height: 520,
          background: 'linear-gradient(135deg,#0369a1, #0284c7)',
          right: -120,
          bottom: -120,
          opacity: 0.1,
        }}
        animate={{ x: [0, 90, -40, 0], y: [0, 40, -60, 0] }}
        transition={{ repeat: Infinity, duration: 20, ease: 'easeInOut' }}
      />

      <main className="relative z-10 w-full max-w-6xl px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left column: hero */}
          <section className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* REPLACED: interactive logo */}
            <InteractiveLogo src="../../download.png" />

            <motion.h1
              initial={{ opacity: 0, y: -28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-blue-200 to-blue-100"
            >
              Find Your Perfect Code Collab.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-4 max-w-xl text-slate-300"
            >
              devTinder helps you connect with developers. Create a profile,
              swipe through potential matches, and start collaborating with your
              network.
            </motion.p>

            <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.45 }}
              >
                <Link to="/login" aria-label="Sign up">
                  <button
                    className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:scale-[1.03] transform transition shadow-lg font-semibold"
                    onClick={() =>
                      navigate('/login', {
                        // state: { showSignUp: false },
                      })
                    }
                  >
                    Create account
                  </button>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.05, duration: 0.45 }}
              >
                <Link to="/login" aria-label="Log in">
                  <button className="px-5 py-2 rounded-full border border-white/10 text-sm hover:bg-white/3 transition">
                    Sign in
                  </button>
                </Link>
              </motion.div>
            </div>

            {/* badges / social proof */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.25, duration: 0.6 }}
              className="mt-6 flex items-center gap-3 text-slate-300 text-sm"
            >
              <span className="inline-flex items-center gap-2 bg-white/3 px-3 py-1 rounded-full">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M12 2v20"
                    stroke="rgba(255,255,255,0.9)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <strong className="text-white">3k+</strong> devs joined
              </span>

              <span className="inline-flex items-center gap-2 bg-white/3 px-3 py-1 rounded-full">
                <strong className="text-white">Daily Matches</strong>
              </span>
            </motion.div>

            {/* small testimonial */}
            <motion.blockquote
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.6 }}
              className="mt-6 max-w-md text-sm text-slate-300 italic border-l-2 border-blue-400 pl-4"
            >
              "devTinder helped me find a build partner in 48 hours. The
              platform is intuitive and easy to use."
              <cite className="block mt-2 text-xs not-italic text-slate-400">
                — A. Kumar, Fullstack
              </cite>
            </motion.blockquote>

            {/* social icons */}
            <div className="mt-6 flex gap-4 items-center">
              <a
                href="#"
                aria-label="Github"
                className="hover:text-blue-300 transition"
              >
                <FaGithub />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="hover:text-blue-300 transition"
              >
                <FaTwitter />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="hover:text-blue-300 transition"
              >
                <FaLinkedin />
              </a>
            </div>
          </section>

          {/* Right column: feature cluster */}
          <aside className="flex-1 flex flex-col items-center lg:items-end gap-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <FeatureCard title="Developer Profiles" delay={0}>
                Create and customize your developer profile to showcase your
                skills and projects.
              </FeatureCard>
              <FeatureCard title="Swipe & Match" delay={0.12}>
                Use the intuitive swipe mechanism to match with other developers
                and find your next collaborator.
              </FeatureCard>
            </div>

            <div className="mt-4 flex gap-4">
              <FeatureCard title="Real-time Chat" delay={0.24}>
                Instantly connect and chat with your matches in real-time to
                discuss ideas and plan projects.
              </FeatureCard>
              <FeatureCard title="Grow Your Network" delay={0.36}>
                Build a network of talented developers and expand your
                professional connections.
              </FeatureCard>
            </div>

            {/* floating card with CTA */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.6 }}
              className="mt-6 p-4 rounded-3xl bg-gradient-to-br from-blue-500/10 to-white/3 border border-white/6 shadow-2xl max-w-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-200">
                    Ready to ship your first collab?
                  </p>
                  <p className="mt-1 font-semibold text-white">
                    Start a project — invite 3 devs
                  </p>
                </div>
                <Link to="/create">
                  <button className="px-3 py-2 rounded-full bg-white/6 hover:bg-white/12 transition text-sm">
                    Start
                  </button>
                </Link>
              </div>
            </motion.div>
          </aside>
        </div>

        {/* subtle bottom wave separator */}
        <div className="mt-12">
          <svg
            className="w-full"
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path
              fill="rgba(255,255,255,0.02)"
              d="M0,48L80,58.7C160,69,320,91,480,96C640,101,800,91,960,85.3C1120,80,1280,80,1360,80L1440,80L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            ></path>
          </svg>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
