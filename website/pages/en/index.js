/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

class HomeSplash extends React.Component {
  render() {
    const {siteConfig, language = ''} = this.props;
    const {baseUrl, docsUrl} = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

    const SplashContainer = props => (
      <div className="homeContainer">
        <div className="homeSplashFade">
          <div className="wrapper homeWrapper">{props.children}</div>
        </div>
      </div>
    );

    const Logo = props => (
      <div className="projectLogo">
        <img src={props.img_src} alt="Project Logo" />
      </div>
    );

    const ProjectTitle = () => (
      <h2 className="projectTitle">
        {siteConfig.title}
        <small>{siteConfig.tagline}</small>
      </h2>
    );

    const PromoSection = props => (
      <div className="section promoSection">
        <div className="promoRow">
          <div className="pluginRowBlock">{props.children}</div>
        </div>
      </div>
    );

    const Button = props => (
      <div className="pluginWrapper buttonWrapper">
        <a className="button" href={props.href} target={props.target}>
          {props.children}
        </a>
      </div>
    );

    return (
      <SplashContainer>
        {/* <Logo img_src={`${baseUrl}img/docusaurus.svg`} /> */}
        <div className="inner">
          <ProjectTitle siteConfig={siteConfig} />
          <PromoSection>
            <Button href="./docs/setup">Get Started</Button>
            <Button href="https://github.com/flohil/wdio-workflo-example">Usage Examples</Button>
            <Button href="https://github.com/flohil/wdio-workflo">Github</Button>
          </PromoSection>
        </div>
      </SplashContainer>
    );
  }
}

class Index extends React.Component {
  render() {
    const {config: siteConfig, language = ''} = this.props;
    const {baseUrl} = siteConfig;

    const Block = props => (
      <Container
        padding={props.padding || ['bottom', 'top']}
        id={props.id}
        background={props.background}>
        <GridBlock
          align="center"
          contents={props.children}
          layout={props.layout}
        />
      </Container>
    );

    const FeatureCallout = () => (
      <div
        className="productShowcaseSection paddingBottom"
        style={{textAlign: 'center'}}>
        <h2>Features</h2>
        <div className="centeredList">
          <ul>
            <li>Formulate your <b>requirements</b> in spec files using <b>Gherkin Language</b> (Given-When-Then)</li>
            <li><b>Testcases validate</b> the acceptance criteria defined within your <b>specs</b></li>
            <li>All test logic is encapsulated in <b>steps written in natural language</b> to increase reusability and readability</li>
            <li>Provides a <b>sophisticated page object architecture</b> to improve the maintainability and reusability of your tests</li>
            <li><b>Custom matcher functions</b> help you analyse errors by providing <b>meaningful error messages</b> and stack traces</li>
            <li>Includes an <b>XPath builder</b> to construct complex XPath selectors</li>
            <li>All necessary tools, services and packages are <b>preconfigured</b> and <b>work out of the box</b></li>
            <li>A <b>console-based spec report</b> for development and a <b>graphic allure report</b> for continuous integration</li>
            <li>Automatically takes <b>screenshots</b> for <b>errors and validation failures</b> to facilitate analysibility</li>
          </ul>
        </div>
      </div>
    );

    const AdvantagesAndDrawbacks = () => (
      <div>
        <Block id="try" padding={['top']}>
          {[
            {
              content:
  "Compared to [webdriverio-v4](http://v4.webdriver.io), wdio-workflo improves existing functionality and adds new features but also imposes some additional restrictions.<br />" +
  "The following list helps you decide whether you should use wdio-workflo or stick with the original webdriverio.",
              title: "Why you should or shouldn't use Wdio-Workflo",
            },
          ]}
        </Block>
        <h3 className="centeredText">Restrictions</h3>
          <div className="centeredList restrictionsList">
            <ul>
              <li>Wdio-workflo is currently based on <a href="http://v4.webdriver.io/">version 4</a> of webdriverio. You <b>cannot use features added in <a href="https://webdriver.io/">version 5</a></b>.</li>
              <li>Wdio-workflo works <b>exclusively</b> with the <b>Jasmine test framework</b> and supports <b>only spec and allure reports</b>.</li>
              <li>Wdio-workflo does <b>not support</b> running tests in <b>different browsers</b> at the <b>same time</b>.</li>
              <li>Wdio-workflo only works with XPath selectors. <b>CSS selectors</b> are <b>not supported</b>.</li>
              <li>If you only need a <b>few small tests</b>, wdio-workflo might introduce too much <b>unnecessary overhead</b> code.</li>
            </ul>
          </div>
        <h3 className="centeredText">Improvements / New Features</h3>
          <div className="centeredList improvementsList">
            <ul>
              <li>All <b>services/reporters/test frameworks</b> used by wdio-workflo are preconfigured and <b>work out of the box</b>.</li>
              <li><b>Test results</b> not only show the status of your tests, but also tell you which <b>requirements/acceptance criteria</b> were not fulfilled.</li>
              <li>Wdio-workflo is shipped with <b>base classes</b> for a sophisticated <b>page object architecture</b> which can be used out of the box.</li>
              <li>Wdio-workflo's <b>step functions</b> help you write complex testcases in natural language and allow you to reuse test logic.</li>
              <li>Wdio-workflo <b>improves error handling</b> and includes <b>custom expectation matchers</b> to provide meaningful error messages.</li>
              <li><b>Allure reports</b> include error <b>screenshots and stacktraces</b> as well as detailed descriptions of all <b>steps</b> and their <b>parameters</b>.</li>
            </ul>
          </div>
      </div>
    );

    const Description = () => (
      <Block background="light">
        {[
          {
            content:
              "Wdio-workflo helps you write functional system tests for web applications.<br />" +
              "It increases the reusability, maintainability and analysability of your tests.<br />" +
              "The framework is based on, extends and customizes the fabulous <a href='http://v4.webdriver.io'>webdriverio-v4</a>.<br/>",
            image: `https://webdriver.io/img/webdriverio.png`,
            imageAlign: 'right',
            title: 'Description',
          },
        ]}
      </Block>
    );

    const LearnHow = () => (
      <Block background="light">
        {[
          {
            content:
"If you are new to wdio-workflo, you probably want to head straight for the [Getting Started](/docs/setup) page.<br />" +
"Subsequently, you can visit the [Guides](/docs/doc1) page to learn you how to use the main components of wdio-workflo.<br />" +
"<br />" +
"At [wdio-workflo-example](https://github.com/flohil/wdio-workflo-example), there are code examples demonstrating the usage of wdio-workflo.<br />" +
"Furthermore, the [API Docs](/apiDoc) provide detailed information about each of the framework's building blocks.<br />" +
"<br />" +
"Wdio-workflo is the result of my master's thesis <i>\"Properties of Automation Solutions for Functional System Tests of React Web Applications\"</i>,<br />" +
"which you can [download](https://github.com/flohil/wdio-workflo/raw/master/Hilbinger_Masterarbeit.pdf) (in German) if you are interested in the theoretical foundations of wdio-workflo.",
            title: 'Learn how',
          },
        ]}
      </Block>
    );

    const Features = () => (
      <Block layout="fourColumn">
        {[
          {
            content: "Harness the advantages of static typing! " +
            "Your tests will be more robust than plain JavaScript and you will get better IDE support " +
            "(List Members, Parameter Info, Quick Info, Complete Word...).",
            image: `https://raw.githubusercontent.com/remojansen/logo.ts/master/ts.png`,
            imageAlign: 'top',
            title: 'Written in TypeScript',
          },
          {
            content: "Selenium is one of the most well known tools for browser automation. " +
            "It is completely for free, has a huge community and contrary to alternatives like Cypress, you can test all major browser in multiple windows and tabs.",
            image: `https://www.seleniumhq.org/images/big-logo.png`,
            imageAlign: 'top',
            title: 'Uses Selenium Webdriver',
          },
        ]}
      </Block>
    );

    return (
      <div>
        <HomeSplash siteConfig={siteConfig} language={language} />
        <div className="mainContainer">
          <Description />
          <Features />
          <FeatureCallout />
          <LearnHow />
          <AdvantagesAndDrawbacks />
        </div>
      </div>
    );
  }
}

module.exports = Index;
