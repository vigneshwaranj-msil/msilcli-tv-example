# MSF Chart implementation

# Implemented Strategies
  - Bundling using webpack
  - Linting using ESLint for Javascript, Typescript
  - Testing implementation using JEST
  - Configuration for Typescript added
  - Github hooks using Husky - To avoid errors before pushing to repository
  - Cross-browser support and Backward compatability to run of all old versions of Browser and IE 11 using Babel
  - Prettifying code using Prettier's Plugin
  - VS-Code's default settings specified to follow common code structure

# <mark style="backgroundColor:red;color:black;font-weight:bold;">Things to NOTE</mark>
  - Any changes made inside **src/thirdparty** should be **__Saved without formatting__**
  - Always add a comment 
    - ```js
      //sample comment
      (or)
      /*sample comment*/
      ```
  - Any UI related CSS changes Kindly have them inside respective *.css files or App.css and inside src/thirdparty folder's css file
  - If CI/CD is implemented on repository, Kindly update the *.gitignore* file respectively
  - Pass the environment variables inside **webpack.config.js** which can be access by __process.env__ variable inside JS/TS file

# Enjoy it 🥳
