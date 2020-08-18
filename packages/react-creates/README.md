<p align="center">
  <p align="center">
    <h1 align="center">
      React Creates (CLI) ⚛️
    </h1>
 </p>
  <p align="center">
Simple and easy to use react CLI.
 <br />
React creates for you useful and common tools that adapt themselves to your project for faster and easier development
 </p>
<img src="https://github.com/tzachbon/react-creates/raw/master/packages/react-creates/screencast.gif">
</p>

# Table of content

- [Getting Started ⬇️](#getting-started-⬇️)
  - [Feeling Lazy](#feeling-lazy)
- [Features](#features)
  - [Component](#component)
    - [Start](#start)
    - [Options](#options)
    - [Examples](#examples)
- [Support 👨‍🔧](#support-)
- [Contributing 👩‍💻](#contributing-)

You can go to ways:

- Smart (Zero configuration)
- Advance (Configure by your needs)

# Getting Started ⬇️

Write this in the terminal inside your react project:

`npx react-creates component MyComponent`

Will generate for you:

```
📦MyComponent
 ┣ 📜MyComponent.js
 ┣ 📜MyComponent.test.js
 ┣ 📜index.js
 ┗ 📜style.css
```

## Feeling Lazy

Try the [VSCode extension](https://marketplace.visualstudio.com/items?itemName=TzachBonfil.react-creates-vsc)

# Features

React Creates will support as many cases as it can, You need a use case it doesn't support? Please [open issue](https://github.com/tzachbon/react-creates/issues/new).

You want to create flow for that use case? You are more than welcome! Learn how [here](#contributing-👩‍💻).

Current features:

## Component

React lets you define components as classes or functions.
But why you need to write it every time?
Here how to do create one in seconds:

### Start

`npx react-creates component <name>`

### Options

| Option                      | Default                                         | Description                                                      |
| --------------------------- | ----------------------------------------------- | ---------------------------------------------------------------- |
| `--scss`                    | `false`                                         | Force `scss` style                                               |
| `--css`                     | `false`                                         | Force `css` style                                                |
| `--sass`                    | `false`                                         | Force `sass` style                                               |
| `-l --language <scripting>` | Calculated (Checks for `tsconfig` to determent) | Select the language you want the component to be                 |
| `-d --directory <target>`   | `process.cwd()`                                 | Component directory                                              |
| `-t --type <component>`     | `function`                                      | What type of the component it should be. (function or class)     |
| `-pt --prop-types`          | `false`                                         | Should add Prop-types. Only works if inside `javascript` project |
| `-f --function`             | `false`                                         | Force `function` component                                       |
| `-c --class`                | `false`                                         | Force `class` component                                          |
| `-s --style <styling>`      | `css`                                           | Selected style                                                   |
| `--skip-test`               | `false`                                         | Will not create test file                                        |

### Examples

`npx react-creates component MyComponent`

`npx react-creates component MyComponent --type class`

`npx react-creates component MyComponent --style sass`

`npx react-creates component MyComponent -d /Users/project/cool-project`

`npx react-creates component MyComponent -l typescript`

# Support 👨‍🔧

Please [open an issue](https://github.com/tzachbon/react-creates/issues/new) for support.

# Contributing 👩‍💻

Please contribute using [Github Flow](https://guides.github.com/introduction/flow/). Create a branch, add commits, and [open a pull request](https://github.com/tzachbon/react-creates/compare/).
