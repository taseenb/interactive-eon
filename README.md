# interactive-el-paso
The Guardian - El Paso


## Pushing your commits to `master` and `gh-pages`

The `gh-pages` branch contains the files that are served at: http://taseenb.github.io/interactive-el-paso/

That branch should always mirror the `master`. You can push to both branches manually or you can configure your hidden `.git/config` file to automatically push to both branches.

You can do this simply by adding these 2 lines to the `[remote "origin"]` section:

```
  push = refs/heads/master:refs/heads/master
  push = refs/heads/master:refs/heads/gh-pages
```
