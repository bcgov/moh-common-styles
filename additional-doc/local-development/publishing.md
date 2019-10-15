# Publishing

## Requirements

In order to publish a new build, you must:

1. Have write-access on GitHub
2. Have write-access on npm for [moh-common-lib](https://www.npmjs.com/package/moh-common-lib)
3. Can build the library locally.
4. There are no uncommitted local changes (the will fail)

## Steps

When you want to publish a build, there are only 3 commands.    They will automatically increment build numbers, compile the build, generate documentation, and commit everything.  All you have to do afterwards is push the commits and publish the build.

**Make sure that everything is committed before you start or this will fail.**

    # builds, generates docs, and commits.  Can take a few minutes.
    > npm version minor

    # "follow-tags" pushes up the tagged release and must be used.
    > git push origin master --follow-tags

    > npm publish dist/common/moh-common-lib-VERSION-NUMBER.tar.gz

## Versioning Logic

There are technically 3 commands which you can use with "npm version", each incrementing different numbers.  In ascending order of impact, they are:

    npm version patch
    npm version minor
    npm version major

In general, if you aren't sure which to use, use "minor."  If the build is purely a fix - with no new functionality at all and you're confident this won't accidentally break anything - you can relase it as "patch."  If it includes new functionality, or if there's a potential for breaking, use "minor."

"Patch" is for fixes.  This includes releases that are pure bugfixes, and by keeping "patch" reserved for fixes it allows us to backport fixes. For example, if we discover someone on 1.1.0 needs an urgent security patch we could release 1.1.1.

"Minor" is for any new work that does not break backward compatibility.  New components, new features, tests, etc, should all be minor. Minor should be the default choice and you should only deviate from it if you have good reason.

"Major" is for breaking changes and must be coordinated across teams.  However, if there are breaking changes in your code you MUST version it as major.
