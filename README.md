# Jekyll 3 and Gulp Boilerplate

So, this is a totally opinionated skeleton to get a Jekyll 3 site up and running.

## Components

This thing uses:

- Jekyll 3
- Gulp
- Browsersync
- Sass
- Normalize
- Github Pages for quick deploys

## Setting up

1. Install bundler (`gem install bundler`)
2. Install gems with `bundle install`
3. Get all the needed node modules with `npm install`
4. Fire the whole thing up: `gulp` (Google Chrome opens, everythings waiting for you to change `.md`, `.html`, `.scss`, etc etc and will auto reload everything)

## Deploying to Github pages

I included this fancy node module `gulp-gh-pages` which takes the contents of a
directly and shoves them into a special branch called `gh-pages` (by default, you can change that if you like) which is then available as a websiste hosted by Github.

*Have fun firing out Jekyll goodness to the world*
