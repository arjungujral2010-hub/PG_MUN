/**
 * PG-MUN 2026 - Master Interactive Scripts
 * Organised by Dr. Pillai Global Academy (DPGA), New Panvel
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCountdown();
  initScheduleTabs();
  initFaqAccordion();
  initCommitteeModals();
  initBackToTop();
  initContactForm();
});

// Toast Notification Manager
function showToast(message, type = 'info') {
  let toast = document.getElementById('global-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'global-toast';
    toast.className = 'toast-box';
    document.body.appendChild(toast);
  }
  
  const icon = type === 'success' 
    ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>'
    : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';

  toast.innerHTML = `${icon} <span>${message}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

// 1. Sticky Navbar & Mobile Drawer
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      navToggle.setAttribute('aria-expanded', isOpen);
      navToggle.innerHTML = isOpen 
        ? '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'
        : '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
    });

    // Close on clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navMenu.classList.remove('open');
        navToggle.innerHTML = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
      }
    });

    // Close on link click
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }
}

// 2. Live Countdown Timer (Conference Target: 21 November 2026 08:30:00 IST)
function initCountdown() {
  const daysEl = document.getElementById('count-days');
  const hoursEl = document.getElementById('count-hours');
  const minutesEl = document.getElementById('count-minutes');
  const secondsEl = document.getElementById('count-seconds');

  if (!daysEl) return;

  // 21 November 2026, 08:30:00 IST
  const targetDate = new Date('2026-11-21T08:30:00+05:30').getTime();

  function update() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

// 3. Schedule Timeline Day Filter Tabs
function initScheduleTabs() {
  const tabBtns = document.querySelectorAll('.schedule-tab-btn');
  const nodes = document.querySelectorAll('.timeline-node');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-day');
      nodes.forEach(node => {
        if (filter === 'all' || node.getAttribute('data-day') === filter) {
          node.style.display = 'block';
        } else {
          node.style.display = 'none';
        }
      });
    });
  });
}

// 4. Interactive FAQ Accordion with Search
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  const searchInput = document.getElementById('faqSearch');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    const panel = item.querySelector('.faq-answer-panel');

    btn?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items
      faqItems.forEach(other => {
        other.classList.remove('active');
        const p = other.querySelector('.faq-answer-panel');
        if (p) p.style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  // Search FAQ filter
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      faqItems.forEach(item => {
        const question = item.querySelector('.faq-question-btn')?.textContent.toLowerCase() || '';
        const answer = item.querySelector('.faq-answer-panel')?.textContent.toLowerCase() || '';

        if (question.includes(query) || answer.includes(query)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }
}

// 5. Committee Quick-View Modal Data & Handler
const committeeData = {
  unsc: {
    code: 'UNSC',
    title: 'United Nations Security Council',
    tag: 'International Peace & Security',
    banner: 'assets/images/banner_unsc.jpg',
    accentColor: '#00f0ff',
    desc: 'Step into the centre of international diplomacy and security. Engage with questions of global peace, international conflicts, security challenges and diplomatic decision-making.',
    intro: 'As the principal organ charged with ensuring international peace and security under the UN Charter, the UNSC at PG-MUN 2026 brings delegates into high-stakes diplomatic negotiations where sovereign interests and collective security collide.',
    agendaStatus: 'Agenda: TBA (Official Announcement Coming Soon)',
    bgGuide: 'Study Guide: In Preparation by the Secretariat',
    eb: 'Executive Board: Chairperson & Co-Chairperson To Be Announced',
    pageUrl: 'committee-unsc.html'
  },
  unep: {
    code: 'UNEP',
    title: 'United Nations Environment Programme',
    tag: 'Global Sustainability & Ecology',
    banner: 'assets/images/banner_unep.jpg',
    accentColor: '#10b981',
    desc: 'Explore the environmental challenges shaping our planet. Debate sustainability, climate change, environmental protection and the future of international environmental cooperation.',
    intro: 'The United Nations Environment Programme serves as the authoritative global advocate for the environment. At PG-MUN 2026, UNEP delegates will address pressing ecological crises, planetary boundaries, and sustainable multi-lateral agreements.',
    agendaStatus: 'Agenda: TBA (Official Announcement Coming Soon)',
    bgGuide: 'Study Guide: In Preparation by the Secretariat',
    eb: 'Executive Board: Chairperson & Co-Chairperson To Be Announced',
    pageUrl: 'committee-unep.html'
  },
  disec: {
    code: 'DISEC',
    title: 'Disarmament & International Security Committee',
    tag: 'UN General Assembly First Committee',
    banner: 'assets/images/banner_disec.jpg',
    accentColor: '#3b82f6',
    desc: 'Engage with critical questions surrounding international security, disarmament, arms control and global peace. Explore the role of diplomacy in addressing international security challenges.',
    intro: 'DISEC deals with disarmament, global challenges, and threats to peace that affect the international community. Delegates represent member nations working to craft multilateral resolutions on arms treaties and strategic deterrence.',
    agendaStatus: 'Agenda: TBA (Official Announcement Coming Soon)',
    bgGuide: 'Study Guide: In Preparation by the Secretariat',
    eb: 'Executive Board: Chairperson & Co-Chairperson To Be Announced',
    pageUrl: 'committee-disec.html'
  },
  mythology: {
    code: 'INDIAN MYTHOLOGY',
    title: 'Indian Mythology Committee: Kurukshetra & Dharma',
    tag: 'Specialized Historical & Ethical Council',
    banner: 'assets/images/banner_mythology.jpg',
    accentColor: '#f59e0b',
    desc: 'Enter a world of legendary narratives, powerful characters and complex moral dilemmas. Explore iconic stories, perspectives, conflicts and decisions through an immersive committee experience.',
    intro: 'Step back to the epic crossroads of Kurukshetra, where the rules of warfare, allegiance, duty, and Dharma undergo rigorous moral scrutiny. Delegates step into the minds of legendary leaders and philosophers.',
    agendaStatus: 'Agenda: TBA (Official Announcement Coming Soon)',
    bgGuide: 'Study Guide: In Preparation by the Secretariat',
    eb: 'Executive Board: Chairperson & Co-Chairperson To Be Announced',
    pageUrl: 'committee-mythology.html'
  },
  fifa: {
    code: 'FIFA',
    title: 'Fédération Internationale de Football Association',
    tag: 'Global Sports Governance & Diplomacy',
    banner: 'assets/images/fifa_poster.jpg',
    accentColor: '#ec4899',
    desc: 'Step into the world of international football governance, sporting diplomacy and decision-making. Explore the challenges and global influence of the beautiful game.',
    intro: 'Football is more than a sport; it is an economic powerhouse and diplomatic medium uniting billions. In the FIFA Council at PG-MUN 2026, delegates explore integrity, hosting rights, player regulations, and geopolitical soft power.',
    agendaStatus: 'Agenda: TBA (Official Announcement Coming Soon)',
    bgGuide: 'Study Guide: In Preparation by the Secretariat',
    eb: 'Executive Board: Chairperson & Co-Chairperson To Be Announced',
    pageUrl: 'committee-fifa.html'
  }
};

function initCommitteeModals() {
  const modal = document.getElementById('committeeModal');
  const closeBtn = document.getElementById('modalCloseBtn');
  const triggerBtns = document.querySelectorAll('.committee-quick-btn');

  if (!modal) return;

  triggerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const committeeId = btn.getAttribute('data-committee');
      const data = committeeData[committeeId];
      if (!data) return;

      document.getElementById('modalCommitteeCode').textContent = data.code;
      document.getElementById('modalCommitteeTitle').textContent = data.title;
      document.getElementById('modalCommitteeTag').textContent = data.tag;
      document.getElementById('modalCommitteeBanner').src = data.banner;
      document.getElementById('modalCommitteeDesc').textContent = data.desc;
      document.getElementById('modalCommitteeIntro').textContent = data.intro;
      document.getElementById('modalCommitteeAgenda').textContent = data.agendaStatus;
      document.getElementById('modalCommitteeGuide').textContent = data.bgGuide;
      document.getElementById('modalCommitteeEb').textContent = data.eb;
      
      const fullPageBtn = document.getElementById('modalFullPageBtn');
      if (fullPageBtn) fullPageBtn.href = data.pageUrl;

      modal.classList.add('open');
    });
  });

  closeBtn?.addEventListener('click', () => {
    modal.classList.remove('open');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('open');
    }
  });
}

// 7. Copy Venue Address to Clipboard
window.copyAddress = function () {
  const address = 'Dr. Pillai Global Academy, Sector 7, Khanda Colony, New Panvel, Navi Mumbai, Maharashtra 410206';
  navigator.clipboard.writeText(address).then(() => {
    showToast('Venue address copied to clipboard!', 'success');
  }).catch(() => {
    // Fallback
    const input = document.createElement('input');
    input.value = address;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    showToast('Venue address copied to clipboard!', 'success');
  });
};

// 8. Back to Top Button
function initBackToTop() {
  const backBtn = document.getElementById('backToTop');
  if (!backBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backBtn.classList.add('visible');
    } else {
      backBtn.classList.remove('visible');
    }
  });

  backBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// 9. Contact Inquiry Form
function initContactForm() {
  const contactForm = document.getElementById('inquiryForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('formName')?.value;
    const email = document.getElementById('formEmail')?.value;
    const school = document.getElementById('formSchool')?.value;
    const message = document.getElementById('formMessage')?.value;

    if (!name || !email) {
      showToast('Please fill out all required fields.', 'info');
      return;
    }

    showToast(`Thank you, ${name}! Your inquiry has been received. Our team will contact you shortly.`, 'success');
    contactForm.reset();
  });
}
