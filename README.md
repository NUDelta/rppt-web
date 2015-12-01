RPPT: Web Command Center
===========================
Authored by [Kevin Chen](http://kevinchen.ninja).

## What is RPPT?
Remote Paper Prototype Testing, or RPPT, is a [DTR](http://dtr.meteor.com) project from [Delta Lab](https://delta.northwestern.edu) that takes a new approach to lo-fidelity prototype evaluation. Traditional advances in prototyping or design methods lean toward quickly developing more complex and fleshed out demos, which often means creating many predefined interactions for designers to customize and insert. RPPT instead focuses on making low fidelity paper prototyping, which has no such restrictions, more accessible, powerful, and able to be conducted remotely. For further information, take a look at [our CHI publication.](http://dl.acm.org/citation.cfm?id=2702423)

## Component Applications
These are needed for each web video stream.
 * [Google Glass](https://github.com/NUDelta/remote-paper-prototyper-gdk)
 * [iOS](https://github.com/NUDelta/remote-paper-prototyper-ios)

## Web Application Setup
You'll need an [OpenTok](https://tokbox.com/developer/) account to run this application. Sign up (you'll get a 30 day free trial), create a project, and enter your API and secret keys into the `server/lib/environment.js` file.

Depending on your setup, you'll probably want to deploy your application to free Meteor hosting and point your iOS and Google Glass apps to this server (see their respective READMEs for what to do). You can do that by `meteor deploy [name]`, then visiting `http://[name].meteor.com`.

## Web Application Usage
The RPPT web app consists of a single webpage containing both the Google Glass stream (left), the expected paper stream (center), and a Google Maps map contain the user's location. You should connect a webcam to your computer connected to this RPPT server and point it at your paper prototype. Tap or swipe gestures from the iOS application, once connected, should be replicated as blue dots over top of this paper prototype stream.

## Developer To-do List
* [ ] Merge projects into one repository
* [ ] Fix CSS styling of dashboard
* [x] Fix positioning of dot trails
* [ ] Make consistent integer or string API key
* [ ] refactor collections
* [ ] auto cleanup stream data
* [x] set location to be updated by iOS application
* [x] setup sync codes
