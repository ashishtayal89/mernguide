# Isomorphic React

## About Application

This application is a basic API client which gathers data from an outside API (in this case, Stackoverflow) and generates an isomorphic, single-page application (SPA).

### Getting Started

1. Clone the repository
2. install dependencies
   `npm install && npm run postinstall`
3. Run the dev server
   `npm run start-dev`
4. Navigate to the application's url
   `http://localhost:3000/`

### Usage

#### Enabling / Disabling Server Rendering

Server rendering is great, but sometimes we want to disable it when there's an error in our render and we'd rather troubleshoot it in the client.
This setting is passed in as a CLI argument via the `--useServerRender=true` argument.
You can modify this in `package.json` to `--useServerRender=false` which will disable any server-side rendering functionality.

#### Enabling / Disabling Live Data

This application is designed to grab the latest data from `Stackoverflow.com`. However, their API has a strict request limit which means that no questions will be returned after X requests (usually 300).
Therefore, the application comes loaded with mock-questions in the data directory.
To ease the learning process by eliminating potential sources of error, live data is disabled by default.
However, you are strongly encouraged to use live data once you understand the associated pitfalls.

- Note: You can increase your allotted requests to a much larger number by registering an application here,
  `https://stackapps.com/apps/oauth/register` and then appending the key to the URLs in `data/api-real-url.js`

### Production Build

This application fully supports a production build setting, which disables live reloading in favor of precompiled and uglified JS, which boosts performance.
To run production, run the command `npm run start-prod`, which automatically triggers the `build` script.
This mode is recommended for production. However, this boilerplate has never been used in actual production so utilize caution if deploying as a real application.

### Troubleshooting

#### `unexpected token import`

This error appears when babel is not configured correctly. This can actually be caused by outdated global dependencies, and is hard to fix. For best results, try the following -

- Install `babel-register` as a local saved dependency
- Update global versions of `babel`, `webpack` and all dependencies to latest / course versions

#### Any Error That is Taking a Long Time to Troubleshoot

Things can always go wrong in the world of programming. If this happens, clone the master branch of this repo to a new directory and run the installation instructions. If desired, you can work backwards, pruning extra files until you get the application in the state you want.

#### Problems with the Repo

I want this repo to work perfectly for as many users as possible. Got a problem? <a href=https://github.com/danielstern/isomorphic-react/issues/new>Open an issue!</a> Let's figure out a solution together.

## Concepts

### Isomorphic Application

- Iso : Same, Morph : Form
- Application where server and client are written in same language
- The first request is rendered by server and subsequent by client.

### Why Isomorphic Application Using Server Side Rendering

#### The Problem

1. Now a days most web application are SPA(Single page application). The SPA gives a very good user experience since it dynamicaly renders pages by handling routes in the client side and doesn't need to make server request to render new pages. This makes the application feel more smooth and much more performant. But there is also a downside to this, it makes the initial application load a little slow since it makes the application to download a lot more resources to render the application at the first instance. These resources are the javascript files which are reponsible for computing the html and the data set which help javascript in generating the html. Till these resources are downloaded the user is shown a blank screen. This problem was more with mobile devices due to slow CPU.

2. The second issue with SPA is SEO. Since the html in a SPA had nothing except for a parent container inside which the application is rendered using javascipt. The SEO is poor since the page doesn't provide much information about itself.

#### The Solution

Server side rendering help us resolve this issue. In server side rendering the basic page is rendered at the server side itself using some intial application state. Hence the user is not presented with a blank screen initialy and gets a feel as if the application is loaded even though the resources are getting downloaded.

**Advantages** :

1. Functional :
   - Better perfromance
   - Better SEO since the search engine indexing imporves with improved html response. Support for legacy browsers.
2. Technical : Same code for FE and BE so easy maintenance.

### Challenges with Isomorphic Application

1. Complex architecture.
2. Challenging troubleshoot.
3. Sensative data prone to exposure.
   <img width="1296" alt="Screenshot 2020-04-14 at 5 25 22 PM" src="https://user-images.githubusercontent.com/46783722/79222330-f3cfa800-7e74-11ea-86c3-dcbbbeaa74dc.png">
4. More points of failure.

### When to use Isomorphic Application

#### Static website or blog

A static site with just data is perfect use case for server side rendering since the data is not changing often hence we can render the first page server side
and rest of the pages client side. This way we end up with a super fast loading website.

#### ECommerce website

When thinking about an online shop, the most important pages probably are the many many product pages. To improve their performance we can render the above the fold content on the server side with some product and rest of the products can be rendered on the client side. This would give a feeling to the user that the website has loaded very fast.

#### Interactive web app

A super interactive web app, where almost every page is built using up-to-date information from the database, which is also very specific to your user is not a great fit.

Eg : Build a trading web app, web app that users can use to generate invoices, do their taxes or handle their many todos, all the static generation and pre-rending will not help enhance the user experience, because the user will visit your app to spend a lot of time with it. The upfront loading time is well worth the wait for most users.

### Environment Priorites

<img width="1341" alt="Screenshot 2020-04-14 at 5 39 37 PM" src="https://user-images.githubusercontent.com/46783722/79223427-f16e4d80-7e76-11ea-9809-546671481a72.png">

### Isomorphic app flow

<img width="1057" alt="Screenshot 2020-04-14 at 5 05 28 PM" src="https://user-images.githubusercontent.com/46783722/79221098-d6014380-7e72-11ea-961d-0d79157e6820.png">

### Data Injection VS Server Side Rendering

| Data injection                                                                   | Server side rendering                                                                         |
| -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Server must be capable of handling data fetching                                 | Server must be capable of fetching data and rendering application                             |
| Can result in fast load time if the data is simple and the app is complex        | Can result in fast last load time if the data is complex and the app is simple                |
| Doesn't work on devices with no Javascript support                               | Works great on devices with no javascript support                                             |
| Complex renders can cause performance issues on initial load(Especialy mobile)   | This might still be slow, but the end-user sees final app right away and so percieves it fast |
| Can skip first ajax request to fetch data since it is alredy there on first load | Still needs to fetch data after initial load                                                  |

### React DOM Server

> Initial State + Top level component = Static HTML

<img width="1196" alt="Screenshot 2021-06-26 at 7 46 46 PM" src="https://user-images.githubusercontent.com/46783722/123515960-619d7380-d6b7-11eb-8249-4b6d22439492.png">

1. Genearates static HTML markup based on parent component and initial state.
2. Leverages virtual dom to generate HTML.
3. No browser dependency. Eg it doesn't depend on the window.

| renderToString()                                                                      | renderToStaticMarkup()                                                                          |
| ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Generates HTML with special React tags which React can read                           | Generates just static HTML(Slightly smaller)                                                    |
| Client application can automatically Bootstrap without re-rendering(Called Hydration) | Client application does not recognize HTML as something that can be hydrated and re-renders it. |
| For rich client applications                                                          | For pages without client-based interactivity                                                    |

### React Router

1. It renders the component based on path which is gets from the history(createBrowserHistory) object of HTML5.
2. We can use this hitory module to inject a custom path to make react router render application based on client request on the server.
3. Works on client and the server.

<img width="1092" alt="Screenshot 2021-06-26 at 8 44 20 PM" src="https://user-images.githubusercontent.com/46783722/123517562-51899200-d6bf-11eb-8107-7ddc6afe2f84.png">

### Hot Module Replacement

1. It updates application without refreshing the browser by just replacing the changes modules.
2. Each module can "Opt-in" for replacement on change.
3. This is eash to do for modules who don't have any local state.

| Live Reload                                                                                                                                                              | HRM                                                                                                                                                                      |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| <img width="1018" alt="Screenshot 2021-06-26 at 9 26 21 PM" src="https://user-images.githubusercontent.com/46783722/123518793-33269500-d6c5-11eb-8924-6cfb5bc1d52a.png"> | <img width="1025" alt="Screenshot 2021-06-26 at 9 26 33 PM" src="https://user-images.githubusercontent.com/46783722/123518797-39b50c80-d6c5-11eb-9367-2e6936ad235d.png"> |
