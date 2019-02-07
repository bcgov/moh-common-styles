export const appComponentHtml = `<div id="app">
<div id="wrap">

  <header>
  <div class="container-fluid header-container d-flex justify-content-between align-items-center flex-wrap">
    <div class='d-flex flex-wrap'>
      <a href="http://www2.gov.bc.ca/" tabindex="0">
        <img class="header-logo"
            tabindex="-1" alt="B.C. Government Logo" title="B.C. Government Logo"
            src="assets/gov3_bc_logo.png">
      </a>
      <span class="title px-2 mt-1" role="banner">Fair PharmaCare</span>
    </div>
  </div>
  </header>

  


  <!-- TODO - Replace the header above with this header component once setup
  <fpcare-header></fpcare-header> -->

  <main class="container-fluid" id="content">

    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione blanditiis, quaerat unde provident deserunt, voluptatem porro, enim mollitia quasi eum vel similique amet non possimus velit explicabo. Facere, adipisci atque.</p>
    <p>Totam a, suscipit sed magni illum fuga sit doloribus distinctio eos, doloremque amet. Fugit exercitationem autem explicabo cumque similique suscipit ex consequuntur dolorem, veniam laborum iusto nemo provident doloribus? Natus!</p>
    <p>Quasi incidunt enim est ducimus autem voluptatibus atque dolores quo perferendis vero cum, eius blanditiis deserunt ratione adipisci explicabo sequi? Porro perspiciatis voluptate enim commodi unde quasi numquam sed cupiditate?</p>

    <router-outlet></router-outlet>
  </main>
  <div id="pad"></div>
</div>

 <footer>
  <nav class="navbar navbar-expand-md bg-primary">
    <div class="container-fluid">
      <ul class="nav navbar-nav">
        <li><a class='nav-link' href="http://www2.gov.bc.ca/gov/content/home/disclaimer" target="_blank">Disclaimer</a></li>
        <li><a class='nav-link' href="http://www2.gov.bc.ca/gov/content/home/privacy" target="_blank">Privacy</a></li>
        <li><a class='nav-link' href="http://www2.gov.bc.ca/gov/content/home/accessibility" target="_blank">Accessibility</a></li>
        <li><a class='nav-link' href="http://www2.gov.bc.ca/gov/content/home/copyright" target="_blank">Copyright</a></li>
        <li><a class='nav-link' href="http://www2.gov.bc.ca/gov/content/home/contact-us" target="_blank">Contact Us</a></li>
      </ul>
    </div>
  </nav>
</footer>
</div>
`

// Note - this CSS actually should belong in the 'prime-header' component, but that does not exist in the shared library yet, so here is a quick workaround
export const appComponentCSS = `

// NOTE - THIS CSS SHOULD BE IN THE 'prime-header' COMPONENT
// HOWEVER, THAT FILE HAS NOT YET BEEN CREATED IN THE COMMON STYLES LIB, SO HERE IS THE TEMPORARY HOME

@import 'variables.scss';

// Header, adds the gold bottom border and shadow
header nav {
  background-color: map-get($theme-colors, primary);;
  border-bottom: 2px solid map-get($theme-colors, secondary);

  -webkit-box-shadow: 0 3px 3px 1px rgba(51, 51, 51, 0.5);
  -moz-box-shadow: 0 3px 3px 1px rgba(51, 51, 51, 0.5);
  box-shadow: 0 3px 3px 1px rgba(51, 51, 51, 0.5);
  margin-bottom: 20px;
}

header {
  //Bootstrap 3 to 4: Change access of brand colours
  background-color: $color-primary;
  border-bottom: 2px solid #fcba19;
  padding-top: 10px;
  padding-bottom: 20px;

  //Bootstrap 3 to 4: Using breakpoint mixin.
  @include media-breakpoint-down(sm) {
    padding-top: 2px;
    padding-bottom: 8px;
  }

  .title {
    font-size: 30px;
    font-weight: bold;
    color: #fff;
    white-space: nowrap;
    align-self: center;

    @include media-breakpoint-down(xs){
      font-size: 24px;
    }
  }
}

header .nav-link {
  color: white !important;
}

.separator:after {
  content: " ";
  background-color: #ffffff33;
  height: 100%;
  min-height: 100%;
  display: block;
  width: 3px;
  margin: 0 1em;
}


// A little Flexbox hack for vertical spacing when the items wrap to a new row.
// For mobile.
.header-container {
  margin-top: -1em;
  & > .d-flex { margin-top: 1em; }
}

.skip-to-content {
  color: white;

  // styling... TODO refine
  // border: 5px solid white;
  // border-radius: 10px;
  // margin: auto;
  // padding: 5px;

  border-radius: 2px;
  border: 2px solid white;
  cursor: pointer;
  display: inline-block;
  text-decoration: underline;
  width: 109px;
  text-align: center;
  background: hsla(0, 0%, 100%, 0.1);

  // Only visible if focused
  opacity: 0;
  height: 0;
  &:focus { opacity: 1; height: auto; }
}`