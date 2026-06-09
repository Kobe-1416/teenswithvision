const navToggle = document.querySelector('[data-nav-toggle]');
const navMenu = document.querySelector('[data-nav-menu]');
const header = document.querySelector('[data-header]');
const year = document.querySelector('[data-year]');
const contactForm = document.querySelector('[data-contact-form]');
const formStatus = document.querySelector('[data-form-status]');

const ORG_EMAIL = 'info@teenagerswithvision.org.za';
const WHATSAPP_NUMBER = '27000000000'; // Replace with the official WhatsApp number, e.g. 27821234567.

if (year) {
  year.textContent = new Date().getFullYear();
}

function closeMobileMenu() {
  navToggle?.setAttribute('aria-expanded', 'false');
  navMenu?.classList.remove('is-open');
  document.body.classList.remove('nav-open');
}

navToggle?.addEventListener('click', () => {
  const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!isOpen));
  navMenu?.classList.toggle('is-open', !isOpen);
  document.body.classList.toggle('nav-open', !isOpen);
});

navMenu?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', closeMobileMenu);
});

window.addEventListener('scroll', () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 12);
}, { passive: true });

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

document.querySelectorAll('[data-ripple]').forEach((button) => {
  button.addEventListener('click', (event) => {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    ripple.className = 'ripple';
    ripple.style.left = `${event.clientX - rect.left}px`;
    ripple.style.top = `${event.clientY - rect.top}px`;
    button.appendChild(ripple);
    window.setTimeout(() => ripple.remove(), 600);
  });
});

function buildMessage(formData) {
  return [
    `Name: ${formData.get('name')}`,
    `Contact: ${formData.get('contact')}`,
    `Reason: ${formData.get('reason')}`,
    '',
    `${formData.get('message')}`
  ].join('\n');
}

contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const submitter = event.submitter;
  const method = submitter?.dataset.submitMethod || 'email';
  const formData = new FormData(contactForm);
  const message = buildMessage(formData);
  const subject = `Teens With Vision: ${formData.get('reason')}`;

  if (method === 'whatsapp') {
    if (WHATSAPP_NUMBER === '27000000000') {
      formStatus.textContent = 'WhatsApp number placeholder is still active. Replace it in script.js before publishing.';
      return;
    }
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    formStatus.textContent = 'Opening WhatsApp...';
    return;
  }

  window.location.href = `mailto:${ORG_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
  formStatus.textContent = 'Opening your email app...';
});
