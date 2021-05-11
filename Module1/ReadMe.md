## Module 1

### Imporant links

1. ES 6+ support : https://nodejs.org/api/esm.html
2. Common Js require vs ES6 import : https://nodejs.org/docs/latest-v14.x/api/esm.html#esm_differences_between_es_modules_and_commonjs

### History

| Node    | Ryan Dahl       | 2009 |
| ------- | --------------- | ---- |
| NPM     | Isaac Schlueter | 2010 |
| MongoDB | --              | 2009 |

Libraries that made node JS a viable option to pick for backend development.

1. Express
2. Mongoose
3. AngularJS
4. Node for Windows --> Initialy node was not supported on windows.

> Note : The Node.js project has moved yet again. Their new home is The Open JS foundation: https://openjsf.org/

### V8

1. Machine code -> Code run on the machine.
2. High level language -> Which needs to be compiled in to an executable code.
3. Compiler -> Converts source code into an executable code.
4. Transpiler -> Converts source code into another source code.
5. Interpreters -> Take source code and directly execute it by taking realtime steps. Like JIT compiling etc. We can consider them as realtime compilers + executer. But they don't leave behind a compiled code as compilers do.

V8 is a JS interpreter which converts JS into machine code and executes it.
The browsers just sends the JS files to the JS engines V8 to execute them. Similarly Node just sends the JS files to V8 to execute them.

Other JS Engines

1. SpiderMonkey : Mozilla
2. JavascriptCore : Safari
3. Chakra : IE

### Node JS

Node JS is a server side JS runtime environment. Node is a c++ application that embeds V8. So basically Node takes care of the higher level task like providing the code to V8 then capturing its response etc.

Node presents 2 applications :

1. A script processor Eg `node index.js`
2. A REPL(Read Eval Print Loop) : `node` This gives a mechanism to provide node js program in the command line which is Read and then evaluated by V8 and then the result is printed by Node. This process in then run in loop.

When you start node by executing `node index.js` the node first starts an event loop. This loop checks for the piece of code that needs to be provided to V8 for execution immediately and the one which needs to be scheduled for execution at a later stage.

> Note that when there is no task left in the queue for exection the node exits. So in order to prevent it from exiting you always need to have some task in the queue.

### Node Anatomy

1. require :

   - Node implictly identifies the required file to be a .js file if no extension is provided.
   - It first looks for the file with the specifired filename. If it doesn't find one then it looks for a folder with the same name and looks for an index file inside that folder.

2. Native modules :
   - These are modules which come implicitly bundled with node js.
   - Eg fs or path

### Node Conventions

1. package.json : Contains metadata of the project.
2. package-lock.json : Contains locked version of packages to be installed since package.json may not have the exact version.
3. .npmrc : npm gets its config settings from the command line, environment variables, and npmrc files.
4. Testing scripts are commonly held in a /test directory and are triggered by a test runner such as Mocha.
5. abc.yml : CI and CD deployment and testing file.
6. Linting files like .jshintrc
7. The linting, bundling, testing can be controlled by task runner like grunt or gulp
8. Source control .gitignore and .git
9. Code comments like @Param, @TODO, @Author, @Date
10. Environment : How to fetch ennvironment specific configuration for a node application
    1. Using a NODE_ENV enviroment variable which is passed as `NODE_ENV=<envname> node index.js` This will provide the NODE_ENV as the environment variable inside index.js ie `process.env.NODE_ENV`.There is generally a config.js file with a swith inside it which return the config based on the env provided to it.
    2. Passing all the config as environment variable like : `DbPass=<DB password> ApiKey=<api key> port=<port> node index.js`. This might look a little messy and un-manageble but it has the advantage that you don't need to keep the environment specific config in to code base. Rather each environment can have its own config.
    3. .env : The configuration are read from this file and this file resides in the code base but is ignored from source control using .gitignore. The deployment pipeline would insert a .env file into the repo before it deploys anywhere.
11. Javascript style guide. Most popular being Airbnb JS style guide.
12. Error Handling :
    1. Errback or Error first callback pattern : Function should call 2 parameters
       - An error(if any)
       - Data being returned(if any)
    ```javascript
    exampleFunction(function(err, data) {});
    ```
    2. Avod Throwing Exceptions : An uncaught exception takes down the entire thread, and kills the app. Rather we pass the err in the error first callback.
    3. Avoid creating globals since a global declared in 1 package can conflict with the one created in another package.

### Node vs Browser
