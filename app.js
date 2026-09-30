/**
 * Nova Jewels - Lógica interactiva B2B
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Control del Modal B2B
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const openModalBtns = document.querySelectorAll('.open-modal-btn');
  const b2bForm = document.getElementById('b2bForm');
  const toastMsg = document.getElementById('toastMsg');

  const openModal = () => {
    modalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  // 2. Control del Menú Móvil / Drawer Glassmorphism
  const mobileMenuToggleBtn = document.getElementById('mobileMenuToggleBtn');
  const mobileMenuDrawer = document.getElementById('mobileMenuDrawer');
  const mobileMenuBackdrop = document.getElementById('mobileMenuBackdrop');
  const mobileMenuCloseBtn = document.getElementById('mobileMenuCloseBtn');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const openMobileMenu = () => {
    if (!mobileMenuDrawer || !mobileMenuBackdrop) return;
    mobileMenuDrawer.classList.add('active');
    mobileMenuBackdrop.classList.add('active');
    mobileMenuDrawer.setAttribute('aria-hidden', 'false');
    if (mobileMenuToggleBtn) mobileMenuToggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeMobileMenu = () => {
    if (!mobileMenuDrawer || !mobileMenuBackdrop) return;
    mobileMenuDrawer.classList.remove('active');
    mobileMenuBackdrop.classList.remove('active');
    mobileMenuDrawer.setAttribute('aria-hidden', 'true');
    if (mobileMenuToggleBtn) mobileMenuToggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  if (mobileMenuToggleBtn) {
    mobileMenuToggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      mobileMenuDrawer && mobileMenuDrawer.classList.contains('active') ? closeMobileMenu() : openMobileMenu();
    });
  }

  if (mobileMenuCloseBtn) {
    mobileMenuCloseBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeMobileMenu();
    });
  }

  if (mobileMenuBackdrop) {
    mobileMenuBackdrop.addEventListener('click', closeMobileMenu);
  }

  // Cerrar el drawer al pulsar en cualquier enlace de navegación
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeMobileMenu();
      openModal();
    });
  });

  modalCloseBtn.addEventListener('click', closeModal);

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      closeModal();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (modalBackdrop.classList.contains('active')) {
        closeModal();
      }
      if (mobileMenuDrawer && mobileMenuDrawer.classList.contains('active')) {
        closeMobileMenu();
      }
    }
  });

  // 3. Envío de formulario B2B con Toast de feedback
  b2bForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Simulación de envío exitoso
    closeModal();
    b2bForm.reset();

    // Mostrar Toast
    toastMsg.classList.add('show');
    setTimeout(() => {
      toastMsg.classList.remove('show');
    }, 4500);
  });

  // 4. Teclado accesible para tarjetas de servicio
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal();
      }
    });
  });

  // 5. Carousel de Colecciones
  const track = document.getElementById('collectionsTrack');
  const prevBtn = document.getElementById('collPrev');
  const nextBtn = document.getElementById('collNext');
  const dots = document.querySelectorAll('.coll-dot');
  const cards = track ? track.querySelectorAll('.collection-card') : [];
  const totalCards = cards.length;
  const visibleCards = 3;
  const maxIndex = Math.max(0, totalCards - visibleCards); // dinámico según número de tarjetas
  let currentIndex = 0;

  const getCardWidth = () => {
    if (!cards[0]) return 0;
    const style = getComputedStyle(track);
    const gap = parseFloat(style.gap) || 20;
    return cards[0].offsetWidth + gap;
  };

  const goTo = (index) => {
    currentIndex = Math.max(0, Math.min(index, maxIndex));
    const offset = currentIndex * getCardWidth();
    track.style.transform = `translateX(-${offset}px)`;

    // Actualiza dots — dot activo = índice del card central visible
    const activeDotIndex = Math.min(currentIndex + 1, totalCards - 1);
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === activeDotIndex);
    });
  };

  if (prevBtn && nextBtn && track) {
    prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
    nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const idx = parseInt(dot.dataset.index, 10);
        goTo(Math.max(0, idx - 1));
      });
    });

    // Soporte táctil (swipe)
    let touchStartX = 0;
    track.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    track.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? goTo(currentIndex + 1) : goTo(currentIndex - 1);
      }
    }, { passive: true });

    // Teclado
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') goTo(currentIndex + 1);
      if (e.key === 'ArrowLeft') goTo(currentIndex - 1);
    });

    // Estado inicial
    goTo(0);
  }
});
