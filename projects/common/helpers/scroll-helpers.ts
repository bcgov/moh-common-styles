
export function scrollTo( top: number = 0 ) {
  const supportsNativeSmoothScroll = 'scrollBehavior' in document.documentElement.style;

  if ( supportsNativeSmoothScroll ) {
    window.scrollTo({top: top, behavior: 'smooth'});
  } else {
    /**
     * IE does not support ScrollToOptions (behavior, top, left), but does support
     * scrollTo() with parameters for x and y coorindiates.
     */
    window.scrollTo(0, top);
  }

}

/**
 * Get the first visible common-error-container and smoothly scroll to it.
 */
export function scrollToError(yOffset = -75) {
    const el = document.querySelector('common-error-container .text-danger');
    if (el) {
        const top = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        scrollTo( top );
    }
}
