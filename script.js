document.addEventListener('DOMContentLoaded', () => {
    const expandableDivs = document.querySelectorAll('.expandable');

    expandableDivs.forEach(div => {
        const title = div.querySelector('.title');
        title.addEventListener('click', () => {
            div.classList.toggle('open');
        });
    });
});
