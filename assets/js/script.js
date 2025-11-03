'use strict';

(function () {

  // element toggle function
  const elementToggleFunc = function (elem) { if (elem) elem.classList.toggle("active"); }

  // sidebar variables
  const sidebar = document.querySelector("[data-sidebar]");
  const sidebarBtn = document.querySelector("[data-sidebar-btn]");

  if (sidebarBtn && sidebar) {
    sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });
  }

  // custom select variables
  const select = document.querySelector("[data-select]");
  const selectItems = document.querySelectorAll("[data-select-item]");
  const selectValue = document.querySelector("[data-select-value]");
  const filterBtn = document.querySelectorAll("[data-filter-btn]");

  if (select) {
    select.addEventListener("click", function () { elementToggleFunc(this); });
  }

  // add event in all select items
  if (selectItems && selectItems.length && selectValue) {
    selectItems.forEach(item => {
      item.addEventListener("click", function () {
        const selectedValue = this.innerText.trim().toLowerCase();
        selectValue.innerText = this.innerText.trim();
        elementToggleFunc(select);
        filterFunc(selectedValue);
      });
    });
  }

  // filter variables
  const filterItems = document.querySelectorAll("[data-filter-item]");

  const filterFunc = function (selectedValue) {
    if (!filterItems) return;
    filterItems.forEach(item => {
      const cat = (item.dataset.category || "").trim().toLowerCase();
      if (selectedValue === "all" || selectedValue === cat) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });
  }

  // add event in all filter button items for large screen
  if (filterBtn && filterBtn.length) {
    let lastClickedBtn = filterBtn[0];
    filterBtn.forEach(btn => {
      btn.addEventListener("click", function () {
        const selectedValue = this.innerText.trim().toLowerCase();
        if (selectValue) selectValue.innerText = this.innerText.trim();
        filterFunc(selectedValue);

        if (lastClickedBtn) lastClickedBtn.classList.remove("active");
        this.classList.add("active");
        lastClickedBtn = this;
      });
    });
  }

  // contact form variables
  const form = document.querySelector("[data-form]");
  const formInputs = document.querySelectorAll("[data-form-input]");
  const formBtn = document.querySelector("[data-form-btn]");

  if (form && formInputs && formInputs.length && formBtn) {
    formInputs.forEach(input => {
      input.addEventListener("input", function () {
        if (form.checkValidity()) {
          formBtn.removeAttribute("disabled");
        } else {
          formBtn.setAttribute("disabled", "");
        }
      });
    });
  }

  // page navigation variables
  const navigationLinks = document.querySelectorAll("[data-nav-link]");
  const pages = document.querySelectorAll("[data-page]");

  if (navigationLinks && navigationLinks.length && pages && pages.length) {
    navigationLinks.forEach(link => {
      link.addEventListener("click", function () {

        // Gunakan innerText yang lebih konsisten
        const target = this.innerText.trim().toLowerCase();

        pages.forEach(p => {
          if ((p.dataset.page || "").trim().toLowerCase() === target) {
            p.classList.add("active");
          } else {
            p.classList.remove("active");
          }
        });

        navigationLinks.forEach(l => l.classList.remove("active"));
        this.classList.add("active");

        window.scrollTo(0, 0);
      });
    });
  }

  // LOADING & OFFLINE SCRIPT
  const loadingScreen = document.getElementById('loading-screen');
  const mainContentWrapper = document.getElementById('main-content-wrapper') || document.querySelector('.main-content');
  const offlinePage = document.getElementById('offline-page');

  // Show loading screen
  window.addEventListener('load', () => {
    
    // 1. Logika Loading Screen (Tetap di sini)
    if (loadingScreen || mainContentWrapper) {
      setTimeout(() => {
        if (loadingScreen) loadingScreen.style.opacity = '0';
        setTimeout(() => {
          if (loadingScreen) loadingScreen.style.display = 'none';
        }, 500);
      }, 1200);
    }

    // ==========================================================
    // 2. PINDAHKAN SEMUA LOGIKA CAROUSEL KE DALAM 'load' EVENT
    // ==========================================================

    /**
     * Kontrol untuk ACHIEVEMENT Carousel
     */
    const achievementTrack = document.getElementById('achievementCarouselTrack');
    if (achievementTrack) {
      let achievementIndex = 0;
      const container = achievementTrack.closest('.carousel-container');
      const prevBtn = container.querySelector('.carousel-prev');
      const nextBtn = container.querySelector('.carousel-next');

      if (prevBtn) prevBtn.removeAttribute('onclick');
      if (nextBtn) nextBtn.removeAttribute('onclick');

      const moveAchievement = (direction) => {
        const items = achievementTrack.querySelectorAll('.achievement-item');
        if (!items || items.length === 0) return;

        const gap = 16; // 1rem
        const itemWidth = items[0].getBoundingClientRect().width + gap;

        const width = window.innerWidth;
        let itemsInView = 1; 
        if (width >= 1024) itemsInView = 3; 
        else if (width >= 580) itemsInView = 2; 

        const maxIndex = items.length - itemsInView;
        
        achievementIndex = Math.max(0, Math.min(achievementIndex + direction, maxIndex));
        achievementTrack.style.transform = `translateX(${-achievementIndex * itemWidth}px)`;
      };

      if (prevBtn) prevBtn.addEventListener("click", () => moveAchievement(-1));
      if (nextBtn) nextBtn.addEventListener("click", () => moveAchievement(1));
    }

    /**
     * Kontrol untuk CLIENTS/Organizations Carousel
     */
    const clientTrack = document.getElementById('carouselTrack');
    if (clientTrack) {
      let clientIndex = 0;
      const container = clientTrack.closest('.carousel-container');
      const prevBtn = container.querySelector('.carousel-prev');
      const nextBtn = container.querySelector('.carousel-next');

      if (prevBtn) prevBtn.removeAttribute('onclick');
      if (nextBtn) nextBtn.removeAttribute('onclick');

      const moveClient = (direction) => {
        const items = clientTrack.querySelectorAll('.clients-item');
        if (!items || items.length === 0) return;

        const gap = 16; // 1rem
        const itemWidth = items[0].getBoundingClientRect().width + gap;

        const width = window.innerWidth;
        let itemsInView = 1;
        if (width >= 1024) itemsInView = 4;
        else if (width >= 450) itemsInView = 3;
        else {
          itemsInView = 1;
        }
        
        const maxIndex = items.length - itemsInView;
        
        clientIndex = Math.max(0, Math.min(clientIndex + direction, maxIndex));
        clientTrack.style.transform = `translateX(${-clientIndex * itemWidth}px)`;
      };

      if (prevBtn) prevBtn.addEventListener("click", () => moveClient(-1));
      if (nextBtn) nextBtn.addEventListener("click", () => moveClient(1));
    }

  }); // <-- AKHIR DARI window.addEventListener('load')

  
  // Offline detection
  function checkOnlineStatus() {
    if (!navigator.onLine) {
      if (mainContentWrapper) mainContentWrapper.style.display = 'none';
      if (offlinePage) offlinePage.style.display = 'block';
    } else {
      if (offlinePage) offlinePage.style.display = 'none';
      // PERBAIKAN: Hapus style 'flex' agar layout mobile tidak rusak
      if (mainContentWrapper) mainContentWrapper.style.display = ''; 
    }
  }

  // Cek saat load dan event change
  window.addEventListener('load', checkOnlineStatus);
  window.addEventListener('online', checkOnlineStatus);
  window.addEventListener('offline', checkOnlineStatus);

  
  // --- LOGIKA CAROUSEL (SEKARANG KOSONG, KARENA DIPINDAH KE ATAS) ---


})();