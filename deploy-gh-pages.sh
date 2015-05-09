#!/bin/sh -x
git checkout gh-pages
git merge -X theirs master -m "Merge branch 'master' into gh-pages"
browserify example/index.js > example/bundle.js
git commit example/bundle.js -m "Regenerate bundle.js using deploy.sh"
git checkout master
