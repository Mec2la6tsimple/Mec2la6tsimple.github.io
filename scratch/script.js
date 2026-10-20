document.addEventListener('DOMContentLoaded', () => {
    const accordions = document.querySelectorAll('.accordion-header');

    accordions.forEach(acc => {
        acc.addEventListener('click', () => {
            const isExpanded = acc.getAttribute('aria-expanded') === 'true';
            
            // Auto close other accordions (Optional, but gives a cleaner feel)
            accordions.forEach(otherAcc => {
                if (otherAcc !== acc) {
                    otherAcc.setAttribute('aria-expanded', 'false');
                    const content = otherAcc.nextElementSibling;
                    content.style.maxHeight = null;
                }
            });

            acc.setAttribute('aria-expanded', !isExpanded);
            const content = acc.nextElementSibling;

            if (!isExpanded) {
                // Determine max height by enabling scrollHeight to be measured properly
                content.style.maxHeight = content.scrollHeight + 150 + "px"; // added buffer to ensure content isn't clipped and allows padding
            } else {
                content.style.maxHeight = null;
            }
        });
    });

    // Handle resize to adjust max-height if an accordion is open
    window.addEventListener('resize', () => {
        accordions.forEach(acc => {
            if (acc.getAttribute('aria-expanded') === 'true') {
                const content = acc.nextElementSibling;
                // Temporarily remove max-height to recalculate
                content.style.maxHeight = 'none';
                const newHeight = content.scrollHeight;
                content.style.maxHeight = newHeight + 150 + 'px';
            }
        });
    });
});
