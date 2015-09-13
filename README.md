***WebApp built with RactiveJS, Falcor, Office UI Fabric and a few other tools***

<a href="http://rff.brakmic.de" target="_blank"><img src="http://fs1.directupload.net/images/150913/uxgu5ctx.png"></a>

At <a href="http://www.advarics.net" target="_blank">advarics GmbH</a> we are currently evaluating the newly open-sourced frameworks <a href="" target="_blank">Falcor</a> (Netflix) and
<a href="https://github.com/OfficeDev/Office-UI-Fabric" target="_blank">Office UI Fabric</a> (Microsoft).

This WebApp should serve as an example on how to combine these JavaScript libraries into a fully functional JavaScript WebApp.

Our starting point was the <a href="https://github.com/OfficeDev/Office-UI-Fabric/tree/master/dist/samples/VideoPortal" target="_blank">"Video Portal" application</a> from Office UI Fabric's GitHub pages.

We've recreated
large parts of this app by reusing its original components & (re)combining them with additional front- & backend
technologies like RactiveJS, AmpersandJS, Falcor, PouchDB & HapiJS.

************

**Falcor**

This JS-library is used to fetch virtual JSON-objects. In this demo <a href="http://netflix.github.io/falcor/index.html" target="_blank">Falcor</a> only serves
some dummy data from the HapiJS backend to one of the instantiated RactiveJS components.

The data from Falcor Model is displayed in the browser console. In future versions we'll provide more detailed demos. There's
already a Falcor Router module under *scripts/routing/movie-router.js*

**Office UI Fabric**

Fabric is a responsive, mobile-first, front-end framework, designed to make it quick and simple for you to create web experiences using the Office Design Language.

**RactiveJS**

The complete frontend is controlled by <a href="http://www.ractivejs.org" target="_blank">RactiveJS</a>. Additionally, <a href="https://github.com/OfficeDev/Office-UI-Fabric/tree/master/src/components" target="_blank">Office UI Fabric components</a> used in this demo
have been repackaged into <a href="http://docs.ractivejs.org/latest/components" target="_blank">RactiveJS components</a>.
They're located under *scripts/portal/components*

**AmpersandJS**

This demo utilizes many of <a href="http://ampersandjs.com/" target="_blank">AmpersandJS'</a> libraries, like *ampersand-app* for application control, *ampersand-model*
for modelling POJO's and *ampersand-router* for fast view switching.

**PouchDB**

In future versions of this app <a href="http://pouchdb.com/" target="_blank">PouchDB</a> will serve as the "backend" of *Falcor Routers* and *Models*.
Currently, we use PouchDB to send some random-generated data to the front page (movie lists). Movie-List data can be regenerated by using the
<a href="http://beta.json-generator.com/Nkj7ODCa" target="_blank">JSON Generator</a>.

**HapiJS**

We extensively use <a href="http://hapijs.com/" target="_blank">HapiJS</a> in many of our projects. HapiJS is easily configurable and extensible.
*HapiJS enables developers to focus on writing reusable application logic instead of spending time building infrastructure.*

**Installation**

Type in
```code
npm install
```

to install packages.

To start the app type
```code
npm start
```

**Building**

```code
gulp

```

or

```code
gulp watch
```

**Live Demo**

<a href="http://rff.brakmic.de/" target="_blank">Link</a>

*License*

<a href="https://github.com/brakmic/RactiveFalcorFabric/blob/master/LICENSE">SEE LICENSE</a>
