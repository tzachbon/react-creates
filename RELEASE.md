## validate npm@8.6.0 or above is used
```
npm -v
```

## validate current directory is the root of the repository
```
pwd
```

## validate current branch is `master`
```
git checkout master
```

## validate no local changes to already committed files
```
git reset --hard
```

## validate local copy has all changes from upstream
```
git pull
```

## remove any non-committed files (node_modules, dist, etc)
```
git clean -fdx
```

## install and test
```
npm it
```

## bump the "version" of each package and any request for bumped packages
```
npm version <version> -ws --save
```

## ensure package-lock.json is finalized with bumped requests (previous step only partially updates it)
```
npm i
```

## add and commit changed files
```
git commit -am <version>
```

## create a git tag for the new commit
## the -m creates an annotated tag for --follow-tags in next step
```
git tag <version> -m <version>
```

## push both commit and tag upstream (up to this point nothing got pushed)
```
git push --follow-tags
```