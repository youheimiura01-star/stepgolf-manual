document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.tab');
    const manualContents = document.querySelectorAll('.manual-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-tab');

            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            manualContents.forEach(content => {
                content.classList.remove('active');
                content.style.display = 'none';
            });

            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.add('active');
                targetContent.style.display = 'block';
                generateTOC(targetContent);

                setTimeout(() => {
                    const mainContent = document.querySelector('.main-content');
                    if (mainContent) {
                        mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 100);
            }
        });
    });

    manualContents.forEach(content => {
        if (content.classList.contains('active')) {
            content.style.display = 'block';
        } else {
            content.style.display = 'none';
        }
    });

    const firstManual = document.querySelector('.manual-content.active');
    if (firstManual) {
        generateTOC(firstManual);
    }

    function generateTOC(manualContent) {
        const tocContainer = document.getElementById('toc');
        tocContainer.innerHTML = '';

        const headings = manualContent.querySelectorAll('h3');

        headings.forEach((heading, index) => {
            if (!heading.id) {
                heading.id = 'section-' + index;
            }

            const link = document.createElement('a');
            link.href = '#' + heading.id;
            link.textContent = heading.textContent;

            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetElement = document.getElementById(heading.id);
                if (targetElement) {
                    const offset = 120;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });

            tocContainer.appendChild(link);
        });
    }

    let tocLinks = [];
    let headings = [];

    function updateTOCLinks() {
        tocLinks = document.querySelectorAll('.toc a');
        const activeManual = document.querySelector('.manual-content.active');
        if (activeManual) {
            headings = activeManual.querySelectorAll('h3');
        }
    }

    function highlightTOC() {
        if (tocLinks.length === 0 || headings.length === 0) {
            updateTOCLinks();
        }

        let currentSection = '';
        const scrollPosition = window.pageYOffset + 150;

        headings.forEach(heading => {
            const sectionTop = heading.offsetTop;
            if (scrollPosition >= sectionTop) {
                currentSection = heading.id;
            }
        });

        tocLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentSection) {
                link.classList.add('active');
            }
        });
    }

    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = window.requestAnimationFrame(function() {
            highlightTOC();
        });
    });

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            setTimeout(() => {
                updateTOCLinks();
                highlightTOC();
            }, 100);
        });
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offset = 120;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    window.addEventListener('beforeprint', function() {
        manualContents.forEach(content => {
            content.style.display = 'block';
            content.classList.add('printing');
        });
    });

    window.addEventListener('afterprint', function() {
        manualContents.forEach(content => {
            content.classList.remove('printing');
            if (!content.classList.contains('active')) {
                content.style.display = 'none';
            } else {
                content.style.display = 'block';
            }
        });
    });
});
