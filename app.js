const express = require('express');
const vsts = require('azure-devops-node-api');
const bodyParser = require('body-parser');
const app = express();
const collectionURL = process.env.COLLECTIONURL;
const token = process.env.TOKEN;

console.log(collectionURL);
const authHandler = vsts.getPersonalAccessTokenHandler(token);
const connection = new vsts.WebApi(collectionURL, authHandler);
var vstsGit;
connection.getGitApi().then(success => {vstsGit = success; console.log(success);}, error => {console.log(error);});

app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/', (req, res) => {
  const repoId = req.body.resource.repository.id;
  const pullRequestId = req.body.resource.pullRequestId;
  const title = req.body.resource.title;

  const prStatus = {
    "state": "succeeded",
    "description": "Ready for review",
    "targetUrl": "https://visualstudio.microsoft.com",
    "context": {
      "name": "wip-checker",
      "genre": "continuous-integration"
    }
  };
  vstsGit.createPullRequestStatus(prStatus, repoId, pullRequestId).then(result => {
    console.log(result);
  });
  res.send('Received the POST');
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});

