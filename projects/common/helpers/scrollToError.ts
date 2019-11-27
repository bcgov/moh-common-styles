/**
 * Get the first visible common-error-container and smoothly scroll to it.
 */
export function scrollToError(yOffset = -75) {
    const el = document.querySelector('common-error-container .text-danger');
    if (el) {
        const top = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({top, behavior: 'smooth'});
    }
}
