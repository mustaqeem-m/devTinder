import React from 'react';
import { useLocation } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();
  const { pathname } = useLocation();
  const isLandingPage = pathname === '/welcome';

  return (
    <footer
      className={`${
        isLandingPage ? 'mt-0' : 'mt-44'
      } w-full bg-gradient-to-r from-slate-900 via-neutral-900 to-slate-800 text-neutral-100`}
    >
      <div className="max-w-7xl mx-auto px-6 py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-start">
          {/* Brand + blurb */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-white/5 p-2">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  className="fill-current text-emerald-300"
                >
                  <path d="M22.672 15.226l-2.432.811.841 2.515c.33 1.019-.209 2.127-1.23 2.456-1.15.325-2.148-.321-2.463-1.226l-.84-2.518-5.013 1.677.84 2.517c.391 1.203-.434 2.542-1.831 2.542-.88 0-1.601-.564-1.86-1.314l-.842-2.516-2.431.809c-1.135.328-2.145-.317-2.463-1.229-.329-1.018.211-2.127 1.231-2.456l2.432-.809-1.621-4.823-2.432.808c-1.355.384-2.558-.59-2.558-1.839 0-.817.509-1.582 1.327-1.846l2.433-.809-.842-2.515c-.33-1.02.211-2.129 1.232-2.458 1.02-.329 2.13.209 2.461 1.229l.842 2.515 5.011-1.677-.839-2.517c-.403-1.238.484-2.553 1.843-2.553.819 0 1.585.509 1.85 1.326l.841 2.517 2.431-.81c1.02-.33 2.131.211 2.461 1.229.332 1.018-.21 2.126-1.23 2.456l-2.433.809 1.622 4.823 2.433-.809c1.242-.401 2.557.484 2.557 1.838 0 .819-.51 1.583-1.328 1.847m-8.992-6.428l-5.01 1.675 1.619 4.828 5.011-1.674-1.62-4.829z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold">DevsTinder</h3>
                <p className="text-sm text-white/70">
                  Where Developers meet since 1992
                </p>
              </div>
            </div>

            <p className="mt-2 text-sm text-white/70 max-w-md">
              DevsTinder connects developers, mentors and recruiters. Build your
              profile, showcase projects, and find collaborations or jobs that
              actually fit your skills.
            </p>

            <div className="flex gap-2 items-center mt-4">
              <input
                aria-label="Email for newsletter"
                type="email"
                placeholder="Get our monthly Dev roundup"
                className="min-w-0 flex-1 rounded-md bg-white/5 px-3 py-2 text-sm placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <button className="rounded-md px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-medium transition-all">
                Subscribe
              </button>
            </div>
          </div>

          {/* Links */}
          <div className="flex justify-between md:justify-center md:col-span-1">
            <div>
              <h6 className="text-sm font-semibold">Product</h6>
              <ul className="mt-3 space-y-2 text-sm text-white/70">
                <li>
                  <a className="hover:text-white">Features</a>
                </li>
                <li>
                  <a className="hover:text-white">Pricing</a>
                </li>
                <li>
                  <a className="hover:text-white">Integrations</a>
                </li>
                <li>
                  <a className="hover:text-white">Changelog</a>
                </li>
              </ul>
            </div>

            <div className="ml-8 md:ml-12">
              <h6 className="text-sm font-semibold">Company</h6>
              <ul className="mt-3 space-y-2 text-sm text-white/70">
                <li>
                  <a className="hover:text-white">About</a>
                </li>
                <li>
                  <a className="hover:text-white">Careers</a>
                </li>
                <li>
                  <a className="hover:text-white">Contact</a>
                </li>
                <li>
                  <a className="hover:text-white">Press</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Social + legal */}
          <div className="flex flex-col items-start md:items-end gap-4">
            <div className="flex gap-4">
              <a
                aria-label="Twitter"
                className="p-2 rounded-md bg-white/5 hover:bg-white/10 transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  className="fill-current text-emerald-300"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>

              <a
                aria-label="YouTube"
                className="p-2 rounded-md bg-white/5 hover:bg-white/10 transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  className="fill-current text-rose-400"
                >
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
              </a>

              <a
                aria-label="Facebook"
                className="p-2 rounded-md bg-white/5 hover:bg-white/10 transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  className="fill-current text-blue-400"
                >
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </a>
            </div>

            <div className="text-sm text-white/60 mt-2">
              © {year} DevsTinder. All rights reserved.
            </div>

            <div className="mt-2 text-xs text-white/50">
              Made with ❤️ by DevsTinder community
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/5 pt-6 text-xs text-white/50 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-2 md:mb-0">Terms • Privacy • Security</div>
          <div>Built for developers — learn, ship, repeat.</div>
        </div>
      </div>
    </footer>
  );
}
