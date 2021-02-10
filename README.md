# rumors-site

[![Build Status](https://travis-ci.org/cofacts/rumors-site.svg?branch=master)](https://travis-ci.org/cofacts/rumors-site) [![Coverage Status](https://coveralls.io/repos/github/cofacts/rumors-site/badge.svg?branch=master)](https://coveralls.io/github/cofacts/rumors-site?branch=master)

Rumors list / creation UI, with server-side rendering.

## Configuration

For development, copy `.env.sample` to `.env` and make necessary changes.

For production via [rumors-deploy](http://github.com/cofacts/rumors-deploy), do setups in `docker-compose.yml`.

## Development

This project uses NodeJS 12+.

``` bash
$ npm install
$ npm run dev # Then visit http://localhost:3000

# Before you pull request, please lint your code first
$ npm run lint
# fix eslint
$ npm run lint:fix
# run test
$ npm t
```
### styled-jsx syntax highlighting

See: https://github.com/zeit/styled-jsx#syntax-highlighting

## Try built image on local

Build docker image.

``` bash
# build
$ IMAGE_NAME=rumors-site-test hooks/build
```

This will build both `$IMAGE_NAME-en` and `$IMAGE_NAME-tw` image.

Run the docker image on local machine, then visit `http://localhost:3000`.

``` bash
# English version:
$ docker run --rm --env-file .env -p 3000:3000 rumors-site-test-en

# zh_TW version:
$ docker run --rm --env-file .env -p 3000:3000 rumors-site-test-tw
```

On [docker hub](https://hub.docker.com/r/cofacts/rumors-site), `hooks/build` is automatically executed on `dev` and `master` branch.

### Storybook
We use storybook to demonstrate components.
```bash
# run storybook localserver on port 6006
$ npm run storybook
```
we also use storyshot to do snapshot test with stories, make sure to run:
```
$ npm test -- -u
```
before pushing to update stories snapshots.
Storybook will be available under /storybook/index.html after build.

## Analytics

This project supports Google Tag Manager. You can prepare the following setup in `.env` file:
- `PUBLIC_GTM_ID`: Google Tag Manager Container ID (`GTM-XXXXXXX`)
- `PUBLIC_GA_TRACKING_ID`: Google analytics trakcing ID (`UA-XXXXXXXX-X`). `rumors-site` will *not*
  load Google analytics itself; instead, it will push `GA_TRACKING_ID` to `dataLayer`, and it is your
  responsibility to pick it up as a Data Layer Variable and setup Google Analytics in Google Tag Manager.

The application will fire the following custom events:

- `routeChangeStart` - when next-router starts route change
- `routeChangeComplete` - when next-router finish route change
- `dataLoaded` - when article / reply is loaded in article & reply page

Also, it will push the following custom variable to `dataLayer`;

- `GA_TRACKING_ID` - see `PUBLIC_GA_TRACKING_ID`
- `CURRENT_USER` - Current user object, set by `useCurrentUser`.

Lastly, in Google Tag Manager we use `data-ga` property to track clicks.
If user clicks a decendant of an React element with `data-ga` property,
a click event will be sent to Google analytics with the written `data-ga`.
(It doesn't even need to be rendered, we [setup the Google Tag Manager](https://github.com/cofacts/rumors-site/pull/254) to read private React instance)

Also, if a component has its `displayName` set,
a click event with that `displayName` is also sent to Google Analytics when any of its decendant is clicked.

## Design and Mockups

* [真的假的 hackfoldr](http://beta.hackfoldr.org/rumors)
* [網站 UI flow](https://i.imgur.com/lxas2Ic.jpg)


## Translation

We use [ttag](https://ttag.js.org/) to support build-time i18n for the SSR website. During deploy,
we build one Docker image for each locale.

Please refer to ttag documentation for [annotating strings to translate](https://ttag.js.org/docs/quickstart.html).

To extract annotated strings to translation files, use:

```
$ npm run i18n:extract
```

### Translation files

The translation files are located under `i18n/`, in [Gettext PO format](https://www.gnu.org/software/gettext/manual/html_node/PO-Files.html).

- `en_US.po`: Since the language used in code is already English, this empty translation file exists to simplify settings.
- `zh_TW.po`: Traditional Chinese translation.

### Supporting other languages

You can replace this with [any language](https://www.gnu.org/software/gettext/manual/html_node/Locale-Names.html) you want to support, by leveraging Gettext [`msginit` command](https://www.gnu.org/software/gettext/manual/html_node/msginit-Invocation.html).

You will need to change the following to reflect the locale change:

- `i18n:extract` script in `package.json`
- `i18n:validate` script in `package.json`
- `hooks/build` script & `hooks/push` script, with correct LOCALE setup and image tags

### Building in different languages

By default, the chatbot will be built under `en_US` locale.

During development, changing `LOCALE` in `.env` allows you to spin up dev server under a specific locale.
Please set `LOCALE` to one of `en_US`, `zh_TW` or any other language code that exists under `i18n/` directory.

When building using Docker, `LOCALE` can be provided via build args. See `hooks/build` for the command to use.

## Legal

`LICENSE` defines the license agreement for the source code in this repository.

`LEGAL.md` is the user agreement for Cofacts website users.

