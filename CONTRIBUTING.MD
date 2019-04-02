# Contributing

# Git Commit Format


For changelog generation, all git commits must follow this format:

    <type>(<scope>): <subject>
    <BLANK LINE>
    <body>
    <BLANK LINE>
    <footer>


List of valid types:

* **feat**: A new feature
* **fix**: A bug fix
* **docs**: Documentation only changes
* **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing
  semi-colons, etc)
* **refactor**: A code change that neither fixes a bug nor adds a feature
* **perf**: A code change that improves performance
* **test**: Adding missing or correcting existing tests
* **chore**: Changes to the build process or auxiliary tools and libraries such as documentation
  generation
* **build**: Changes to the build process

Scopes may arbitrarily be created.

[Refer to Angular's contributing guide for more details.](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md)


## Git commit hooks

Commits can be automatically validated that they conform to the format, you just need to enable the pre-commit hook.

    npm run setup:git-hooks

The commit hook itself can be found at `build_utils/commit-msg`.
