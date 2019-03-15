/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://docusaurus.io/docs/site-config for all the possible
// site configuration options.

const siteConfig = {
  title: 'Wdio-Workflo', // Title for your website.
  tagline: 'A Framework for writing Functional System Tests in TypeScript',
  url: 'https://flohil.github.io', // Your website URL
  baseUrl: '/wdio-workflo/', // Base URL for your project */ // local: '/'
  // For github.io type URLs, you would set the url and baseUrl like:
  //   url: 'https://facebook.github.io',
  //   baseUrl: '/test-site/',

  // Used for publishing and more
  projectName: 'wdio-workflo',
  organizationName: 'flohil',
  // For top-level user or org sites, the organization is still the same.
  // e.g., for the https://JoelMarcey.github.io site, it would be set like...
  //   organizationName: 'JoelMarcey'

  // make sure docusaurus does not "delete" css from subpages
  separateCss: ['apiDoc', 'demo'],

  // For no header links in the top nav bar -> headerLinks: [],
  headerLinks: [
    {doc: 'setup', label: 'Guides'},
    {page: 'demo', label: 'Demo Page'},
    {href: 'https://github.com/flohil/wdio-workflo-example', label: 'Examples'},
    {page: 'apiDoc', label: 'API'},
    {href: 'https://github.com/flohil/wdio-workflo', label: 'Github'},
    {search: true}
    // {page: 'help', label: 'Help'},
    // {blog: false, label: 'Blog'},
  ],

  algolia: {
    placeholder: 'Search'
  },

  /* path to images for header/footer */
  headerIcon: 'img/logo.svg',
  footerIcon: 'img/logo.svg',
  favicon: 'img/favicon.png',

  /* Colors for website */
  colors: {
    primaryColor: '#006bd7',
    secondaryColor: '#005bb7',
  },

  /* Custom fonts for website */
  /*
  fonts: {
    myFont: [
      "Times New Roman",
      "Serif"
    ],
    myOtherFont: [
      "-apple-system",
      "system-ui"
    ]
  },
  */

  // This copyright info is used in /core/Footer.js and blog RSS/Atom feeds.
  copyright: `Copyright © ${new Date().getFullYear()} Florian Hilbinger`,

  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks.
    theme: 'rainbow',
  },

  // Add custom scripts here that would be placed in <script> tags.
  scripts: ['https://buttons.github.io/buttons.js'],

  // On page navigation for the current documentation page.
  onPageNav: 'separate',
  // No .html extensions for paths.
  cleanUrl: true,

  // Open Graph and Twitter card images.
  // ogImage: 'img/docusaurus.png',
  // twitterImage: 'img/docusaurus.png',

  // Show documentation's last contributor's name.
  // enableUpdateBy: true,

  // Show documentation's last update time.
  // enableUpdateTime: true,

  // You may provide arbitrary config keys to be used as needed by your
  // template. For example, if you need your repo's URL...
  repoUrl: 'https://github.com/flohil/wdio-workflo'
};

module.exports = siteConfig;
