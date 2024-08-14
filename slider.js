// script.js
document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelector('.slides');
  const slideCount = document.querySelectorAll('.slide').length / 2;
  let currentSlide = 0;

  setInterval(() => {
    currentSlide++;
    slides.style.transition = 'transform 0.5s ease-in-out';
    slides.style.transform = `translateX(-${currentSlide * 100}%)`;

    if (currentSlide === slideCount) {
      setTimeout(() => {
        slides.style.transition = 'none';
        slides.style.transform = 'translateX(0)';
        currentSlide = 0;
      }, 500); // Trajanje animacije u milisekundama
    }
  }, 5000); // Interval izmjene slajdova u milisekundama
});
