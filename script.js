const navToggle = document.querySelector('[data-nav-toggle]');
const navMenu = document.querySelector('[data-nav-menu]');
const header = document.querySelector('[data-header]');
const year = document.querySelector('[data-year]');
const contactForm = document.querySelector('[data-contact-form]');
const formStatus = document.querySelector('[data-form-status]');

const ORG_EMAIL = 'info@teenagerswithvision.org.za';
const WHATSAPP_NUMBER = '27000000000'; // Replace with official number

// Footer year
if (year) {
  year.textContent = new Date().getFullYear();
}

// Mobile menu
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

navMenu?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

// Header shadow
window.addEventListener(
  'scroll',
  () => {
    header?.classList.toggle('is-scrolled', window.scrollY > 12);
  },
  { passive: true }
);

// Reveal animation
const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15
  }
);

document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});

// Ripple effect
document.querySelectorAll('[data-ripple]').forEach(button => {
  button.addEventListener('click', e => {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();

    ripple.className = 'ripple';
    ripple.style.left = `${e.clientX - rect.left}px`;
    ripple.style.top = `${e.clientY - rect.top}px`;

    button.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  });
});

// Contact form
function buildMessage(formData) {
  return [
    `Name: ${formData.get('name')}`,
    `Contact: ${formData.get('contact')}`,
    `Reason: ${formData.get('reason')}`,
    '',
    formData.get('message')
  ].join('\n');
}

contactForm?.addEventListener('submit', event => {
  event.preventDefault();

  const submitter = event.submitter;
  const method = submitter?.dataset.submitMethod || 'email';

  const formData = new FormData(contactForm);

  const subject = `Teens With Vision: ${formData.get('reason')}`;
  const message = buildMessage(formData);

  if (method === 'whatsapp') {
    if (WHATSAPP_NUMBER === '27000000000') {
      formStatus.textContent =
        'Please replace the placeholder WhatsApp number in script.js.';
      return;
    }

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      '_blank'
    );

    formStatus.textContent = 'Opening WhatsApp...';
    return;
  }

  window.location.href =
    `mailto:${ORG_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;

  formStatus.textContent = 'Opening your email app...';
});

// Expandable "Read More" blocks in the About Us section.
// Each button sits right after its paragraph and controls the
// .read-more-content panel right after it via aria-controls/id.
document.querySelectorAll('[data-read-more-toggle]').forEach(button => {
  const targetId = button.getAttribute('aria-controls');
  const panel = targetId ? document.getElementById(targetId) : null;
  const label = button.querySelector('.label');

  if (!panel) return;

  button.addEventListener('click', () => {
    const isOpen = panel.classList.toggle('is-open');

    button.setAttribute('aria-expanded', String(isOpen));

    if (label) {
      label.textContent = isOpen ? 'Show Less' : 'Read More';
    }
  });
});

// Gallery image preview
const galleryImages = document.querySelectorAll('.gallery-page-grid img');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.querySelector('.lightbox-image');
const closeLightbox = document.querySelector('.close-lightbox');

galleryImages.forEach(image => {
    image.addEventListener('click', () => {
        lightbox.classList.add('active');
        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt;
    });
});

closeLightbox?.addEventListener('click', () => {
    lightbox.classList.remove('active');
});

lightbox?.addEventListener('click', e => {
    if (e.target === lightbox) {
        lightbox.classList.remove('active');
    }
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        lightbox?.classList.remove('active');
    }
});

// Animated counters
const counters = document.querySelectorAll('[data-counter]');

const counterObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const counter = entry.target;
      const target = Number(counter.dataset.counter);

      let current = 0;
      const increment = Math.ceil(target / 100);

      const updateCounter = () => {
        current += increment;

        if (current >= target) {
          counter.textContent = target + '+';
        } else {
          counter.textContent = current;
          requestAnimationFrame(updateCounter);
        }
      };

      updateCounter();

      counterObserver.unobserve(counter);
    });
  },
  {
    threshold: 0.4
  }
);

counters.forEach(counter => {
  counterObserver.observe(counter);
});
