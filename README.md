# RPPT Web Control Center
Authored by [Kevin Chen](http://kevinchen.ninja), 2015.

Master repository located at [remote-paper-prototype-testing](https://github.com/NUDelta/remote-paper-prototype-testing). See that README for more extensive physical setup information.

## Requirements/Setup
We recommend getting an [OpenTok](https://tokbox.com/developer/) account to run this application. Sign up (you'll get a 30 day free trial), create a project, and enter your API and secret keys into the `server/lib/environment.js` file. You should currently be able to use the one we have left there or at `rppt.meteor.com`, but we may not support that into the future.

## Usage
This application separates information out into three distinct columns.

The left column contains primarily administrative controls. You can set the main task that the user tester is supposed to do (updated with a sound effect on the iOS application), sync the iOS application with the sync code and the Google Glass application with the QR code.

The middle column displays contextual information about the user tester -- the first person perspective comes from the camera on Google Glass, and the location from the iOS application.

The right column shows the paper prototype (streamed to the iOS application), and overlays all gestures and actions from the user tester.

## Customization
Do feel free to customize this web application as needed for your own purposes. You'll need [Meteor](http://meteor.com) to do so.

## Issues
Feel free to report bugs or anything unclear :)

## Contact
[kevinchen2016@u.northwestern.edu](mailto:kevinchen2016@u.northwestern.edu)
