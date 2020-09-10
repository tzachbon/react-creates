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

- [Getting Started ⬇️](#getting-started-)
  - [Feeling Lazy](#feeling-lazy)
- [Features](#features)
  - [Default values](#default-values)
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

## Default values

If you want to make sure all component will have the same features (styling, type, etc..), you can specify it in your `package.json`
For example:

```json
{
"name": "my-project",
"version": "0.1.0",
...
 "react-creates": {
    "style": "scss"
  },
...
}
```

## Component

React lets you define components as classes or functions, but why you need to write it every time?
Here how to create one in seconds:

### Start

`npx react-creates component <name>`

### Options

| Option                      | Default                                         | Type                         | Description                                                      |
| --------------------------- | ----------------------------------------------- | ---------------------------- | ---------------------------------------------------------------- |
| `--scss`                    | `false`                                         | boolean                      | Force `scss` style                                               |
| `--css`                     | `false`                                         | boolean                      | Force `css` style                                                |
| `--sass`                    | `false`                                         | boolean                      | Force `sass` style                                               |
| `-l --language <scripting>` | Calculated (Checks for `tsconfig` to determent) | `typescript` or `javascript` | Select the language you want the component to be                 |
| `-d --directory <target>`   | `process.cwd()`                                 | string                       | Component directory                                              |
| `-t --type <component>`     |                                                 | `function` or `class`        | What type of the component it should be.                         |
| `-pt --prop-types`          | `false`                                         | boolean                      | Should add Prop-types. Only works if inside `javascript` project |
| `-f --function`             | `false`                                         | boolean                      | Force `function` component                                       |
| `-c --class`                | `false`                                         | boolean                      | Force `class` component                                          |
| `-s --style <styling>`      |                                                 | `css`, `scss`, `sass`        | Selected style                                                   |
| `--skip-test`               | `false`                                         | boolean                      | Will not create test file                                        |
| `--skip-cache`              | `false`                                         | boolean                      | Won't save cache values                                          |
| `--ignore-cache`            | `false`                                         | boolean                      | Won't use cache values                                           |
| `--dry-run`                 | `false`                                         | boolean                      | Only logs the options                                            |

### Examples

`npx react-creates component MyComponent`

`npx react-creates component MyComponent --type class`

`npx react-creates component MyComponent --style sass`

`npx react-creates component MyComponent -d /Users/project/cool-project`

`npx react-creates component MyComponent -l typescript`

# Support 👨‍🔧

Please [open an issue](https://github.com/tzachbon/react-creates/issues/new) for support.

# Contributing 👩‍💻

Please contribute using [contributing guide](../../CONTRIBUTING.md). Create a branch, add commits, and [open a pull request](https://github.com/tzachbon/react-creates/compare/).
