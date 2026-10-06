import {
  ArrowRight,
  ArrowUpRight,
  Code2,
  Gamepad2,
  Globe2,
  MapPin,
  MessageCircle,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/reveal";

const focusAreas = [
  {
    number: "01",
    icon: Gamepad2,
    title: "Game development",
    tools: "UNREAL ENGINE · C++",
    description:
      "Exploring gameplay systems, interaction, and real-time worlds built to be experienced.",
  },
  {
    number: "02",
    icon: Code2,
    title: "Software & systems",
    tools: "C / C++ · PYTHON",
    description:
      "Interested in the foundations: how software behaves, connects, and performs.",
  },
  {
    number: "03",
    icon: Globe2,
    title: "Web & interactive",
    tools: "TYPESCRIPT · WEB",
    description:
      "Making clear, responsive interfaces for ideas that deserve a place on the web.",
  },
];

const socialLinks = [
  {
    name: "Facebook",
    detail: "Connect",
    href: "https://www.facebook.com/ankit.belbase.58",
    icon: FacebookMark,
  },
  {
    name: "Instagram",
    detail: "Follow along",
    href: "https://www.instagram.com/justankit01/",
    icon: InstagramMark,
  },
  {
    name: "WhatsApp",
    detail: "+977 9749849770",
    href: "https://wa.me/9779749849770",
    icon: MessageCircle,
  },
];

function FacebookMark() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.5 21v-8.2h2.8l.4-3.2h-3.2V7.5c0-.9.3-1.5 1.6-1.5h1.7V3.1c-.3 0-1.4-.1-2.7-.1-2.7 0-4.5 1.6-4.5 4.6v2H6.7v3.2h2.9V21h3.9Z" />
    </svg>
  );
}

function InstagramMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.6" cy="6.7" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function EngineeringGraphic() {
  return (
    <div className="engineering-graphic" aria-hidden="true">
      <div className="graphic-heading">
        <span>FIELD NOTES / 001</span>
        <span className="graphic-live">
          <span className="live-dot" />
          SYSTEMS IN MOTION
        </span>
      </div>

      <div className="graphic-canvas">
        <div className="graphic-coordinate coordinate-top">01 / NEPAL</div>
        <div className="graphic-coordinate coordinate-bottom">NODE / 01</div>
        <svg
          className="circuit-art"
          viewBox="0 0 560 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M280 200H168V118H86M280 200H392V118H474M280 200H392V282H474M280 200H168V282H86"
            stroke="currentColor"
            strokeWidth="1"
          />
          <path
            d="M280 200V80M280 200V320M168 118V72M392 118V72M168 282V328M392 282V328"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="3 6"
          />
          <circle cx="280" cy="200" r="72" stroke="currentColor" />
          <circle cx="280" cy="200" r="54" stroke="currentColor" />
          <circle cx="280" cy="200" r="6" fill="currentColor" />
          <circle cx="86" cy="118" r="4" fill="currentColor" />
          <circle cx="474" cy="118" r="4" fill="currentColor" />
          <circle cx="86" cy="282" r="4" fill="currentColor" />
          <circle cx="474" cy="282" r="4" fill="currentColor" />
          <path
            d="M280 128V94M352 200H390M280 272V306M208 200H170"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M272 200H288M280 192V208"
            stroke="currentColor"
            strokeWidth="1"
          />
        </svg>
        <div className="graphic-center-label">
          <span>IDEA</span>
          <span>→</span>
          <span>INTERACTION</span>
        </div>
      </div>

      <div className="graphic-footer">
        <span>SOFTWARE / PLAY / POSSIBILITY</span>
        <span>NEPAL / SOUTH ASIA</span>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="header-inner">
          <a className="wordmark" href="#home" aria-label="Ankit Belbase, home">
            <span className="wordmark-symbol">A<span>/</span>B</span>
            <span className="wordmark-name">ANKIT BELBASE</span>
          </a>

          <nav className="main-nav" aria-label="Main navigation">
            <a href="#focus">Focus</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      <main id="main">
        <section className="hero page-width" id="home" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="eyebrow-mark" />
              ENGINEERING <span className="eyebrow-divider">/</span> NEPAL
            </p>
            <h1 id="hero-title">
              Building at the
              <br />
              intersection of
              <br />
              <span>systems &amp; play.</span>
            </h1>
            <p className="hero-description">
              I&apos;m Ankit — an Electronics, Communication and Information
              Engineering student and developer exploring software, game
              development, and interactive technology.
            </p>
            <div className="hero-actions">
              <a
                className={cn(buttonVariants({ size: "lg" }), "cta-button")}
                href="#focus"
              >
                Explore my focus <ArrowRight aria-hidden="true" />
              </a>
              <a className="text-link" href="#about">
                A little about me <ArrowUpRight aria-hidden="true" />
              </a>
            </div>
            <div className="hero-location">
              <MapPin aria-hidden="true" />
              <span>Based in Nepal</span>
            </div>
          </div>

          <Reveal className="hero-visual" delay={0.12}>
            <EngineeringGraphic />
          </Reveal>
          <div className="hero-index mono" aria-hidden="true">
            01 — 04
          </div>
        </section>

        <section
          className="focus-section section-shell"
          id="focus"
          aria-labelledby="focus-title"
        >
          <div className="page-width">
            <Reveal className="section-heading">
              <p className="section-kicker mono">01 / CURRENT CURIOSITIES</p>
              <div>
                <h2 id="focus-title">A few directions I&apos;m drawn to.</h2>
                <p className="section-intro">
                  Different tools, one shared instinct: make technology feel
                  thoughtful and alive.
                </p>
              </div>
            </Reveal>

            <div className="focus-grid">
              {focusAreas.map(({ number, icon: Icon, title, tools, description }, index) => (
                <Reveal
                  className="focus-card"
                  delay={index * 0.08}
                  hoverLift
                  key={number}
                >
                  <div className="focus-card-top">
                    <span className="focus-number mono">{number}</span>
                    <Icon aria-hidden="true" />
                  </div>
                  <div className="focus-card-content">
                    <p className="focus-tools mono">{tools}</p>
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                  <span className="card-rule" />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section
          className="about-section section-shell"
          id="about"
          aria-labelledby="about-title"
        >
          <div className="page-width about-grid">
            <Reveal className="about-aside">
              <p className="section-kicker mono">02 / A LITTLE CONTEXT</p>
              <span className="about-coordinate mono">NEPAL / SOUTH ASIA</span>
            </Reveal>
            <Reveal className="about-copy" delay={0.08}>
              <h2 id="about-title">
                Curious about what happens when{" "}
                <span>engineering meets imagination.</span>
              </h2>
              <p>
                I&apos;m studying Electronics, Communication and Information
                Engineering in Nepal and building a foundation across
                programming, systems, and creative tools. Lately, I&apos;m
                especially drawn to the overlap between C/C++, Python, web
                development, and Unreal Engine.
              </p>
              <div className="toolkit" aria-label="Areas of interest">
                <span className="mono">IN THE MIX</span>
                <ul>
                  <li>C / C++</li>
                  <li>Python</li>
                  <li>Unreal Engine</li>
                  <li>Web</li>
                </ul>
              </div>
            </Reveal>
          </div>
        </section>

        <section
          className="contact-section section-shell"
          id="contact"
          aria-labelledby="contact-title"
        >
          <div className="page-width contact-inner">
            <Reveal>
              <p className="section-kicker mono">03 / SAY HELLO</p>
              <h2 id="contact-title">
                Good ideas are
                <br />
                <span>better built together.</span>
              </h2>
              <p className="contact-description">
                Have something interesting in mind? I&apos;d love to hear about
                it.
              </p>
              <a
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "cta-button contact-button",
                )}
                href="mailto:ankitbelbase.06@gmail.com"
              >
                ankitbelbase.06@gmail.com
                <ArrowUpRight aria-hidden="true" />
              </a>
              <div className="social-contact">
                <p className="social-heading mono">FIND ME ELSEWHERE</p>
                <ul className="social-links" aria-label="Social contacts">
                  {socialLinks.map(({ name, detail, href, icon: Icon }) => (
                    <li key={name}>
                      <a
                        className="social-link"
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${name}: ${detail} (opens in a new tab)`}
                      >
                        <Icon aria-hidden="true" />
                        <span className="social-link-copy">
                          <span className="social-name">{name}</span>
                          <span className="social-detail">{detail}</span>
                        </span>
                        <ArrowUpRight
                          className="social-arrow"
                          aria-hidden="true"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <div className="contact-mark" aria-hidden="true">
              A<span>/</span>B
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="page-width footer-inner">
          <span className="footer-copy">© {new Date().getFullYear()} Ankit Belbase</span>
          <span className="footer-note mono">MADE WITH CURIOSITY / NEPAL</span>
          <a className="back-to-top" href="#home">
            Back to top <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
      </footer>
    </>
  );
}
