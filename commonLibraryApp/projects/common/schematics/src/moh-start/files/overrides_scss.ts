export const overridesScss = `//---------------------------------------------------------------------------------------
// Overrides Bootstrap classes are change here, consider changing a variable before
// overriding classes.
//---------------------------------------------------------------------------------------
// Reference: http://www2.gov.bc.ca/gov/content/governments/services-for-government/policies-procedures/web-content-development-guides/developers-guide/css-elements
@import "~bootstrap/scss/functions";
@import "~bootstrap/scss/variables";
@import "~bootstrap/scss/mixins";

// Only paragraph links should be underlined
p a {
   text-decoration: underline;
 }

 .bg-light {
    // Need to use !important because BS4
    background-color: darken($gray-100, 1) !important;
 }


.footer {
  width: 100%;
  border-color: $color-secondary;
  border-top: 2px solid $color-secondary;

  & > .navbar {
    min-height: 3.65rem;
    padding: 0 !important;
    flex-flow: column;
  }
}


// Only sibling list items in footer get left border
footer li+li  {
  @include media-breakpoint-up(lg) {
    border-left: 1px solid #4b5e73;
  }
}

// Have to ensure footer nav links are white

footer .nav-link {
  color: white !important;
  padding-left: 1rem !important;
}

footer .navbar {
  margin-bottom: 0;
}

a {
  text-decoration: underline;
}

footer a {
  text-decoration: none;
}
footer a:hover {
  text-decoration: underline !important;
}
footer li {
  border-left: 1px solid #4b5e73;
  padding: 2px 17px;
  margin-top: 10px;
}
footer .navbar-nav > li > a {
  padding-top: 0;
  padding-bottom: 0;
}

// Orange bar above footer
footer nav {
  border-top: 2px solid map-get($theme-colors, secondary);
}

// Only sibling list items in footer get left border
footer li+li  {
  @include media-breakpoint-up(lg) {
    border-left: 1px solid #4b5e73;
  }
}

// Have to ensure footer nav links are white

footer .nav-link {
    color: white !important;
}

// Sticky footer
html {
  position: relative;
  min-height: 100%;
}

html, body {
  position: relative;
  height: 100%;
}


.footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  /* Set the fixed height of the footer here */
  height: 60px;
  //line-height: 40px; /* Vertically center the text there */

}

h1, h2, h3,
.h1, .h2, .h3 {
  color: $color-primary;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}


.card-body {
  background: $color-white;
}

.card-header {
  font-size: $h3-font-size;
  min-height: 4rem;
  display: flex;
  align-items: start;
}

.card {
  border: 1px solid rgba(0, 0, 0, 0.125);
}

// This is for ngx-bootstrap's tooltip module.  This stops a flickering of the tooltip due to the mouse being over the tooltip.
// https://github.com/valor-software/ngx-bootstrap/issues/3075
.tooltip {
  pointer-events: none;
}


.has-float-label {

  > input, > select {
    border: 1px solid $gray-400;
    border-radius: 0.25rem;
  }

  > input.disabled, > input:disabled {
    border-color: $gray-500;
  }

  > input:focus, > select:focus {
    box-shadow: none !important; //Override Bootstrap styling for .form-control
    border-color: $color-primary;
  }

  > span, label {
    white-space: nowrap;

    // Add padding, due to new border
    left: 0.5em;
  }

  select.form-control:not([size]):not([multiple]) {
    height: calc(2.5rem + 2px);
  }
}

.has-float-label + .has-float-label {
  margin-top: 0.5em;
}


.has-float-label input:placeholder-shown:not(:focus) + *, .has-float-label select:placeholder-shown:not(:focus) + *, .has-float-label textarea:placeholder-shown:not(:focus) + * {
  // Shrink font from 150% to 125% and verticall center
  font-size: 125%;
  // opacity: .5; // Removed to meet accessibility standards
  top: .5em;
  opacity: 1; // Accessibility standards
  color: #494949cc; // Font is eqivalent to opacity 0.8, meeting AA standard
}
`