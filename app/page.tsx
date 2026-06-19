import { FloatingChatWidget } from "@/app/components/FloatingChatWidget";

const navigationItems = [
  "About Us",
  "Business Transformation",
  "Digital Services",
  "Staffing Support",
  "Outsourcing",
];

const serviceGroups = [
  "SCM Services",
  "IT Support",
  "Smart Warehouse Solutions",
  "Website Design & Development",
  "Ecommerce Development",
  "SEO Services",
  "Managed Staffing Services",
  "Hire Roles",
  "Software Development",
];

export default function HomePage() {
  return (
    <main className="hero-shell">
      <div className="hero-backdrop" />
      <div className="hero-overlay" />

      <header className="topbar">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className="brand-copy">
            <span>IT Solutions</span>
            <span>Worldwide</span>
          </div>
        </div>

        <nav className="topnav" aria-label="Primary">
          {navigationItems.map((item) => (
            <a href="#" key={item}>
              {item}
            </a>
          ))}
        </nav>

        <a href="#" className="contact-button">
          Contact Us
        </a>
      </header>

      <section className="hero-content">
        <p className="eyebrow">INNOVATE | AUTOMATE | SUCCEED</p>
        <h1>
          Empowering Businesses
          <br />
          with Smart IT Solutions
        </h1>
        <a href="#" className="cta-button">
          Get Free Consultation
        </a>
      </section>

      <aside className="language-rail" aria-label="Language selector">
        <span>English</span>
        <div className="flag-mark" aria-hidden="true">
          <i className="flag-red" />
          <i className="flag-white" />
          <i className="flag-blue" />
        </div>
      </aside>

      <section className="service-card">
        <div className="step-row" aria-hidden="true">
          <span className="step active">1</span>
          <span className="step">2</span>
          <span className="step">3</span>
        </div>
        <h2>Select a Service</h2>
        <div className="select-shell">
          <select defaultValue="">
            <option value="" disabled>
              -- Select Service --
            </option>
            {serviceGroups.map((service) => (
              <option key={service}>{service}</option>
            ))}
          </select>
        </div>
      </section>

      <FloatingChatWidget />
    </main>
  );
}
