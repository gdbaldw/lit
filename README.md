# Incremental compile and continuous deployment from terminal AND from github push

This toy application implementing the Sudoku Game demonstrates Continuous Deployment to Netlify, with all Continuous Integration performed exclusively in a disconnected workstation or in Github or both in combination. This buildless environment implements Yarn Workspaces, Lerna, Pika, TSC, and Github Workflow, with intermediate files cached for incremental builds. Lambda function support is included.

## Installation

After forking this repository, create two Secrets from the Settings Tab of your new Github repository. The value of your first secret, NETLIFY_AUTH_TOKEN, must be created from your Netlify account => User Settings => Applications => Personal access tokens. The value of your second secret, NETLIFY_SITE_ID, is created for you by Netlify when you created a new site, and is found at Site => Settings => General, Site details => Site information => API ID.

Now, clone your repository to your workstation and "yarn install && git init" from your command line. At this point, each push incrementally compiles in Github and deploys to your Netlify site, with the initial push performing for you in Github yarn install, initial typescript compile, and caching of their products.

## Continuous Integration

While the above provides for CI/CD to Netlify, you may also CI on the workstation and deploy to Netlify completely independent of Github. You will need to add a json file to your local clone on your workstation: filename :: .netlify/state.json; file :: {"siteId": "&lt;API ID&gt;"} (note that the directory has a initial dot in its name, and &lt;API ID&gt; is the same value for your site discussed above). Use "yarn iterate" for continous integration with display to your local browser, and when ready to deply use "yarn deploy" from the command line. When you finally push to Github, you will also have an incremental compile from the last Github push and subsequent deployment to Netlify.
