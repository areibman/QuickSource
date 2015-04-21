# ~QuickSource~
#### Current Demo: [Click here](http://45.55.134.189/#!/)
#### Current Release: [v1.0](https://github.com/CS370-soft-eng-practicum/QuickSource/releases/tag/1.0)

## Overview
#### Idea : 
Crowdsource people not money. 

#### Growth Strategy :
Campus faculty post research opportunities and field student interest.

#### Market :
Initially, inter-campus communities,
eventually, communities of all types. 

#### Core User Stories :
* **As a professor**, 
	- I can post my research opportunities to attract potential talent. 
* **As a student**, 
	- I can search the postings to find interesting opportunities that match my skill level. 
	- I can post student opportunities to recruit other students to my club/organization/project. 

## Technicals
#### Framework :
Language: JavaScript, HTML, CSS

Framework: MEAN Stack (MongoDB, Express.js, Angular.js, Node.js)

#### Process Tools :
Slack for general communication and reporting:
[Click here](https://datcoco.slack.com/messages)
  
Pivotal Tracker:
[Click here](https://www.pivotaltracker.com/n/projects/1276086)

#### Unit Testing:
QuickSource uses:

- **Karma** to unit test our frontend AngularJS controllers and templates 
- **Mocha** to unit test our backend ExpressJS controllers and model-database handling

#### Continuous Integration:
QuickSoure deployes a separated DigitalOcean droplet with Jenkins installed to implement continuous intergration. Whenever commit(s) is pushed to this repo, a webhook is then sent and triggers automated unit testing of both Karma and Mocha on our Jenkins droplet

- Our Jenkins droplet: [Click here](http://45.55.134.189:8080/)
- Sample console output: [View here](https://www.dropbox.com/s/5a4wq5lve83pi5k/Jenkin%20Continuous%20Intergration%20Console%20Output.txt?dl=0)

#### Automatic Deployment:

In addition to our Jenkins continuous integration platform, QuickSource will also be automatically deployed whenever a merge between the development and master branch happens. See the links shown above.

## Iterations

#### Documents:
1. Initial Project Proposal & Research: [Slides](https://d1b10bmlvqabco.cloudfront.net/attach/i4uq9at93sz401/hzag30i2dmv63a/i6mlmfzsnslx/First_Pitch.pdf)
2. Test Drive MVP : [Slides](https://d1b10bmlvqabco.cloudfront.net/attach/i4uq9at93sz401/hzag30i2dmv63a/i7gkax1hu6vi/Second_Pitch.pdf)
3. Unit Tesing & Continuous Intergration: [Slides](https://d1b10bmlvqabco.cloudfront.net/attach/i4uq9at93sz401/hzag30i2dmv63a/i80enyxitmci/Third_Pitch.pdf), [Feedback Report](https://d1b10bmlvqabco.cloudfront.net/attach/i4uq9at93sz401/hzag30i2dmv63a/i80eo8x2d0ot/FeedbackReport.pdf)
4. Automatic Deployment & Continous Development: [Slides](https://github.com/CS370-soft-eng-practicum/QuickSource/blob/master/business/FinalPitch.pdf)

## Feedback Form:
Here is our survey for current iteration: [Click here](https://docs.google.com/forms/d/1WqWU-sW1mSOX9iyyjRbsFz8hunRXNYDnBxgAigczrGU/viewform) 
