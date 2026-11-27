/* -------------------------------------------------------------
 * Pallavi Bagam Portfolio Client Logic (script.js)
 * Theme toggle, scroll tracker, reveals, project filter, stats
 * ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {

  // --- Theme Toggle Control ---
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;

  // Retrieve saved theme or default to dark-theme
  const currentTheme = localStorage.getItem('portfolio-theme') || 'dark-theme';
  body.className = currentTheme;

  themeToggle.addEventListener('click', () => {
    if (body.classList.contains('dark-theme')) {
      body.classList.replace('dark-theme', 'light-theme');
      localStorage.setItem('portfolio-theme', 'light-theme');
    } else {
      body.classList.replace('light-theme', 'dark-theme');
      localStorage.setItem('portfolio-theme', 'dark-theme');
    }
  });

  // --- Mobile Hamburger Menu ---
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  const toggleMobileMenu = () => {
    mobileToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  };

  mobileToggle.addEventListener('click', toggleMobileMenu);

  // Close menu when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        toggleMobileMenu();
      }
    });
  });

  // --- Scroll-triggered Interactions (Header & Back-to-Top) ---
  const header = document.querySelector('.main-header');
  const backToTop = document.getElementById('backToTop');
  const scrollProgress = document.getElementById('scrollProgress');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolledPercent = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

    // Header scroll background opacity
    if (scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll progress bar width
    scrollProgress.style.width = `${scrolledPercent}%`;

    // Back-to-top button visibility
    if (scrollY > 400) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
  });

  // Smooth scroll back to top
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // --- Typed Text Subtitles Effect ---
  const typedTextSpan = document.getElementById('typedText');
  const textArray = [
    "Cloud Infrastructure.",
    "Linux Debugging Workflows.",
    "Cloud-Native Integrations.",
    "Infrastructure as Code.",
    "MuleSoft Certified APIs.",
    "CI/CD Deployment Pipelines.",
    "Serverless Architectures.",
    "ML-powered Analytics."
  ];
  let textArrayIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeEffect() {
    const currentString = textArray[textArrayIndex];
    
    if (isDeleting) {
      // Deleting characters
      typedTextSpan.textContent = currentString.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50; // faster deletion
    } else {
      // Adding characters
      typedTextSpan.textContent = currentString.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    // Finished typing full word
    if (!isDeleting && charIndex === currentString.length) {
      isDeleting = true;
      typingSpeed = 2000; // Pause at full word
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textArrayIndex = (textArrayIndex + 1) % textArray.length;
      typingSpeed = 400; // Pause before typing next word
    }

    setTimeout(typeEffect, typingSpeed);
  }

  // Initial typing effect delay
  setTimeout(typeEffect, 1000);

  // --- Intersection Observer for Scroll Reveals ---
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Trigger only once
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px"
  });

  reveals.forEach(reveal => revealObserver.observe(reveal));

  // --- Stats Counter Animation ---
  const statsSection = document.querySelector('.stats-section');
  const statNums = document.querySelectorAll('.stat-num');
  let statsAnimated = false;

  const animateStats = () => {
    statNums.forEach(num => {
      const targetVal = parseFloat(num.getAttribute('data-val'));
      const isFloat = num.getAttribute('data-float') === 'true';
      const duration = 1500; // duration in ms
      const startTime = performance.now();

      const updateCounter = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        // Easing out quadratic
        const easeProgress = progress * (2 - progress);
        const currentVal = easeProgress * targetVal;

        if (isFloat) {
          num.textContent = currentVal.toFixed(1);
        } else {
          num.textContent = Math.floor(currentVal);
        }

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          num.textContent = isFloat ? targetVal.toFixed(1) : targetVal;
        }
      };

      requestAnimationFrame(updateCounter);
    });
  };

  const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsAnimated) {
        animateStats();
        statsAnimated = true;
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  // --- Projects Categorization Filter ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active states on filter buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        if (filterVal === 'all' || category === filterVal) {
          card.classList.remove('hidden');
          // small delay to allow visibility state change before scaling up
          setTimeout(() => {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.opacity = '1';
            card.style.position = 'relative';
            card.style.pointerEvents = 'auto';
          }, 50);
        } else {
          card.style.transform = 'translateY(15px) scale(0.9)';
          card.style.opacity = '0';
          card.style.pointerEvents = 'none';
          
          // Wait for transition to complete before setting absolute/hidden
          setTimeout(() => {
            card.classList.add('hidden');
          }, 350);
        }
      });
    });
  });

  // --- Clipboard Copy Trigger ---
  const copyBtns = document.querySelectorAll('.copy-btn');
  const toast = document.getElementById('toast');

  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const textToCopy = document.getElementById(targetId).textContent;
      
      navigator.clipboard.writeText(textToCopy).then(() => {
        // Show success toast banner
        toast.textContent = `Copied: ${textToCopy}`;
        toast.classList.add('show');
        
        // Hide toast
        setTimeout(() => {
          toast.classList.remove('show');
        }, 2500);
      }).catch(err => {
        console.error('Failed to copy to clipboard: ', err);
      });
    });
  });


});
