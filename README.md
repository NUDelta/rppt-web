prototype-cc
============

Web command-center style interface for our remote prototyping application. A prototyping facilitator watches this interface to see what the user tester is doing and communicates back via text.

## Features
1. Audiovisual stream of the user tester from Google Glass.
2. Map indicating location of user tester.
3. One-way text chat communication channel with user tester.
4. Audio communication channel with user tester**.
5. Status information about the quality of connection with user tester**.

**Work-in-progress

## Usage
This application needs to be hosted on a web server, using technology such as Apache. Directions to do so will be included later. We performed tested our application by hosting a webpage on DreamHost.

The address of the media server broadcasting the stream must be entered into the input box underneath the video (for ex. rtsp://192.168.1.10:1935).

## Technologies Used

We build our command center using [Bootstrap](http://getbootstrap.com/) and the example included with the [libstreaming](https://github.com/fyhertz/libstreaming) library. This incorporates jwplayer as the media player for the video stream.

## To-do List
* implement audio communicaiton
* prettify the webpage
* rehost the command center on the virtual machine
** either start an Apache server or rebuild the program in Node
* properly implement chat history scrolling