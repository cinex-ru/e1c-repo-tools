# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.1.1](https://github.com/cinex-ru/e1c-repo-tools/compare/v0.1.0...v0.1.1) (2020-12-16)


### Features

* **build:** add build command ([c00fba3](https://github.com/cinex-ru/e1c-repo-tools/commit/c00fba37b67966fbc2e1886e8388ff06ed38dacf))
* **dump:** add dump changed files command ([5dfefdf](https://github.com/cinex-ru/e1c-repo-tools/commit/5dfefdfc6cf03eed801af9617dfbf899c1c7d5dd))
* **precommit-hook:** add on/off status for log-update, and turn off for precommit-hook ([6f10c67](https://github.com/cinex-ru/e1c-repo-tools/commit/6f10c67e42e9ed3d8e3bd69cdecc3b12ad0b400b))
* **precommit-hook:** clean src dir and if there was changes create backup ([53850b5](https://github.com/cinex-ru/e1c-repo-tools/commit/53850b5af48eebe02d4afbc9a87cd17c6d718946))


### Bug Fixes

* **precommit-hook:** fix parallel dumping error and multiple file dumps only last ([161a3e4](https://github.com/cinex-ru/e1c-repo-tools/commit/161a3e4cc2bdddafe95628d9a06afc92b30d5fb5))


### Build System

* remove dist files from git index ([24dee0a](https://github.com/cinex-ru/e1c-repo-tools/commit/24dee0a8d00ff842f03a7d49e29a2fd259995f5d))


### Code Refactoring

* **logger:** refactor logging system ([d6abb44](https://github.com/cinex-ru/e1c-repo-tools/commit/d6abb444e416c2248d3398befc5443ac27300227))


### Others

* add yarn-error.log to .gitignore ([3c68b12](https://github.com/cinex-ru/e1c-repo-tools/commit/3c68b1228b9d99d2f0b15eef1646746fe4dd5ef4))
* **build:** add build command to package.json ([b64dfc2](https://github.com/cinex-ru/e1c-repo-tools/commit/b64dfc207f0107b017a91a38c31d3c895ae737cb))
* add repository and keywords ([60a5dd8](https://github.com/cinex-ru/e1c-repo-tools/commit/60a5dd8a536681617a5014004af0ad5c398f99aa))
* add some scripts and vscode launch ([5281f80](https://github.com/cinex-ru/e1c-repo-tools/commit/5281f80e8d96211164519929cc886348c9ef4215))


### Docs

* add readme ([890a8cf](https://github.com/cinex-ru/e1c-repo-tools/commit/890a8cfd7dfaf2bb1b46970fd94634234af5609c))

## 0.1.0 (2020-12-15)


### Features

* add precommit-hook ([7d73658](https://github.com/cinex-ru/e1c-repo-tools/commit/7d73658ef88d40c14ee6dd80e4592c2ea8c3e5b3))
* **e1cdispatcher:** add init of E1cDispatcher ([cb98077](https://github.com/cinex-ru/e1c-repo-tools/commit/cb98077f3051627f11fd5925b39eabfffee59f4d))
* **git-utils:** add function to get staged files ([7a6f8b1](https://github.com/cinex-ru/e1c-repo-tools/commit/7a6f8b166375b6eae4ffb1278460c205e57c03bd))
* **precommit-hook:** add function to get filtered staged files ([b319b91](https://github.com/cinex-ru/e1c-repo-tools/commit/b319b917782c1c0b2a991431e62dba243d5a642b))
* **utils:** add exec shell command function ([8f74d89](https://github.com/cinex-ru/e1c-repo-tools/commit/8f74d89d225d01e8c5ed2c587ba14f8006f83bcc))


### Bug Fixes

* **precommit-hook:** fix problem with the path without relative './' ([5a8d81f](https://github.com/cinex-ru/e1c-repo-tools/commit/5a8d81fcf5a89651fef3b656a15d84422cae3e49))


### Build System

* add typescript settings ([f8759a9](https://github.com/cinex-ru/e1c-repo-tools/commit/f8759a94f2a3fbfb5eb39aaeba4f4a7d4944473d))
* change build folder ([5a3e959](https://github.com/cinex-ru/e1c-repo-tools/commit/5a3e959fc5e86521118b114a52a81cec8cf50e75))


### Styling

* style settings ([6547b4f](https://github.com/cinex-ru/e1c-repo-tools/commit/6547b4f528c7be15b8118e9338afab8ce686e841))


### Tests

* **e1cdispatcher:** add init tests ([d54835a](https://github.com/cinex-ru/e1c-repo-tools/commit/d54835add8612f32245046a1adc3814ed4d44f73))
* **e1cdispatcher:** add more readable describe texts ([82d5748](https://github.com/cinex-ru/e1c-repo-tools/commit/82d5748ded1963755e5f28989b7becb2a42f8057))
* **git-utils:** fix describe ([9752aaf](https://github.com/cinex-ru/e1c-repo-tools/commit/9752aaf271dfe8ef744995ae1179b7fa0507146b))
* add jest and settings ([40e9b42](https://github.com/cinex-ru/e1c-repo-tools/commit/40e9b4233abec44a556eda8cbd69612c9b5b7f31))
* correct settings to use jest ([aa24cfa](https://github.com/cinex-ru/e1c-repo-tools/commit/aa24cfa739cbaa91b81e58675fd161d3b135476a))
* exclude paths from jest watch ([f9cf16f](https://github.com/cinex-ru/e1c-repo-tools/commit/f9cf16fec34d2917d6064826274a4870086722f8))
* **tests:** add jest and settings ([c4b5307](https://github.com/cinex-ru/e1c-repo-tools/commit/c4b5307ea4d32f1b0856e443fdd42d34e820da48))


### Code Refactoring

* **git-utils:** remove simple-git ([3ff7c82](https://github.com/cinex-ru/e1c-repo-tools/commit/3ff7c82b18b6b3e92a6fb6436311c18d57c064e3))


### Others

* add lint before commit ([4c74c70](https://github.com/cinex-ru/e1c-repo-tools/commit/4c74c70c5ca9bc0468ba70144e946402b7b30b56))
* add todo ([186a948](https://github.com/cinex-ru/e1c-repo-tools/commit/186a9481b38585db65216f7070395136f05c8604))
* change version ([f1c9877](https://github.com/cinex-ru/e1c-repo-tools/commit/f1c9877fc65da7d2fd6aad784e1913521bfe1ab9))
* remove unnessesary pretest build ([021eed6](https://github.com/cinex-ru/e1c-repo-tools/commit/021eed6ca954bddeca87b2704b5013cdcd5f1034))
* some config changes ([ad52790](https://github.com/cinex-ru/e1c-repo-tools/commit/ad52790108f7198e37c1b17762445ea39ce75798))
