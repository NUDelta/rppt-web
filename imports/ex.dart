/*
 * Tern Tangible Programming Language
 * Copyright (c) 2016 Michael S. Horn
 *
 *           Michael S. Horn (michael-horn@northwestern.edu)
 *           Northwestern University
 *           2120 Campus Drive
 *           Evanston, IL 60613
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License (version 2) as
 * published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 675 Mass Ave, Cambridge, MA 02139, USA.
 */
library rppt;

import 'dart:html';
import 'dart:math';
import 'dart:async';
import 'dart:js';

part 'compiler.dart';
part 'connector.dart';
part 'coordinates.dart';
part 'factory.dart';
part 'program.dart';
part 'scanner.dart';
part 'statement.dart';
part 'topcode.dart';
part 'utils.dart';


// IMPORTANT! This has to match js/video.js
const VIDEO_WIDTH = 1280; //1920; // 1280; // 800
const VIDEO_HEIGHT = 720; // 1080; // 720; // 600

RPPT rppt;



main() {
  context['dartTopcode'] = (){
    rppt = new RPPT();
  };
}


class RPPT {

  /* <canvas> tag drawing context */
  CanvasRenderingContext2D ctx;

  /* this is going to find all of our physical components */
  Scanner scanner;

  /* we need this to do the computer vision work */
  VideoElement video = null;

  Timer timer;

  var codeDict = new Map();

  var session = context['session'];
  // var templateRendered = context['ccTemplateRendered'];

  bool active = false;

  // topcode state flags
  bool kbPresent = false;
  bool camPresent = false;
  bool photoPresent = false;
  bool mapPresent = false;
  bool callTransparency = true;


  RPPT() {
    print("in main");
    CanvasElement canvas = querySelector("#video-canvas");
    ctx = canvas.getContext("2d");
    scanner = new Scanner();
    video = querySelector("#video-stream");

    video.autoplay = true;
    video.onPlay.listen((e) {
      timer = new Timer.periodic(const Duration(milliseconds : 100), refreshCanvas);
    });
  }


  void init() {
    CanvasElement canvas = querySelector("#video-canvas");
    ctx = canvas.getContext("2d");
    scanner = new Scanner();
    video = querySelector("#video-stream");

    video.autoplay = true;
    video.onPlay.listen((e) {
      timer = new Timer.periodic(const Duration(milliseconds : 100), refreshCanvas);
    });
  }


/**
 * Stop the video stream.
 *  Note: it's possible to stop the video from dart, but we probably won't need this...
 */
  void stopVideo() {
    video.pause();
    if (timer != null) timer.cancel();
  }


/*
 * Called 30 frames a second while the camera is on
 */
  void refreshCanvas(Timer timer) {
    // javascript will change this class name as a signal to dart to stop scanning
    if (video.className == "stopped") {
      timer.cancel();
      print("stopping scan");
      return;
    }

    // draw a frame from the video stream onto the canvas (flipped horizontally)
    ctx.save();
    {
      ctx.translate(video.videoWidth, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0);
    }
    ctx.restore();


    // grab a bitphoto from the canvas
    ImageData id = ctx.getImageData(0, 0, video.videoWidth, video.videoHeight);
    List<TopCode> codes = scanner.scan(id, ctx);


    for (TopCode top in codes) {
      ctx.fillStyle = "rgba(0, 255, 255, 0.5)";
      ctx.fillRect(top.x - top.radius, top.y - top.radius, top.diameter, top.diameter);
      // print([top.code, top.radius, top.x, top.y]);
      codeDict[top.code] = [6, top.radius, top.x, top.y];
    }

    parseCodes(codeDict);
  }

  static int xOffset = 892;
  static int yOffset = 20;
  static int xRange = 455;
  static int yRange = 650;
  static double iosWidth = 375.0; // actual width
  static double iosHeight = iosWidth * 1.4375; // height of stream element
  static double iosMenuBar = 20.0;

  static double xScale = iosWidth / xRange;
  static double yScale = iosHeight / yRange;
  static double extra = 7.5;

  Coordinates fetchCoordinates(List<double> topLeft, List<double> topRight,
      List<double> bottomLeft) {
    Coordinates coordinates = new Coordinates(
      xOffset - topLeft[2],
      topLeft[3] - yOffset,
      xOffset - topRight[2],
      bottomLeft[3] - yOffset
    );
    coordinates.radius = topLeft[1];
    return coordinates;
  }

  Coordinates transformIos(Coordinates coordinates) {
    double radius = coordinates.radius;
    return new Coordinates(
      (coordinates.x1 - 2 * radius - extra) * xScale,
      (coordinates.y1 - 2 * radius - extra) * yScale + iosMenuBar,
      (coordinates.x2 + extra) * xScale,
      (coordinates.y2 + extra) * yScale + iosMenuBar
    );
  }

  Coordinates transformWeb(Coordinates coordinates) {
    double radius = coordinates.radius;
    return new Coordinates(
        xOffset - coordinates.x1,
        coordinates.y1 + 2 * radius,
        xOffset - coordinates.x2 + 2 * radius,
        coordinates.y2
    );
  }


  void parseCodes(Map cd) {
    var toRemove = [];

    // time to live frame calculation
    for (int key in cd.keys){
      if (cd[key][0] > 0){
        cd[key][0] = cd[key][0] - 1;
      }
      else{
        toRemove.add(key);
      }
    }

    for(int e in toRemove){
      cd.remove(e);
    }


    //check for code triggers
    // keyboard – topcode 31
    if (cd.containsKey(31) && !kbPresent){
      print('showKeyboard');
      context['Meteor'].callMethod('call', ['showKeyboard', session]);
      kbPresent = true;
    }
    else if (kbPresent && !cd.containsKey(31)){
      print('hideKeyboard');
      context['Meteor'].callMethod('call', ['hideKeyboard', session]);
      kbPresent = false;
    }

    // camera – 361
    if (cd.containsKey(361)) {
      if (cd.containsKey(331)) {
        print('call transparency');
        //Grabbed: 498.5 145 365.5 509.5 -42.44505494505494 14.609375 432.28021978021974 554.4050480769231 false
        context.callMethod('screenshot', [498.5, 145, 365,
        509, 42, 15, 432, 554, "true"]);
        } else if (!camPresent) {
          print('showCamera');
          context['Meteor'].callMethod('call', ['showCamera', session]);
          camPresent = true;
        }
    }
    else if (camPresent && !cd.containsKey(361)){
      print('hideCamera');
      context['Meteor'].callMethod('call', ['hideCamera', session]);
      camPresent = false;
    }

    // photo
    // 93 – top L; 155 – top  R; 203 – bottom L; 271 – bottom R
    if (cd.containsKey(93) && cd.containsKey(155) && cd.containsKey(203) &&
        cd.containsKey(271)) {
      print('show photo');
      Coordinates originalCoordinates = fetchCoordinates(cd[93], cd[155],
          cd[203]);
      Coordinates ios = transformIos(originalCoordinates);
      double height_ios = (ios.y2 - ios.y1).abs();
      double width_ios = (ios.x2 - ios.x1).abs();

      Coordinates web = transformWeb(originalCoordinates);
      double height_web = (web.y2 - web.y1).abs();
      double width_web = (web.x2 - web.x1).abs();

      context['Meteor'].callMethod('call',
          ['photo', session, ios.x1, ios.y1, height_ios, width_ios]);
      photoPresent = true;

       // call screenshot for multi-fidelity overlay
      if (cd.containsKey(421) && callTransparency) {
        print('call transparency');
        // use web.x2 (top right) NOT web.x1
        // web.x1's value will always be > web.x2
        context.callMethod('screenshot',
            [web.x2, web.y1, width_web, height_web,
            ios.x1, ios.y1, width_ios, height_ios, "false"]);
        callTransparency = false;
      }
    } else if (photoPresent && (!cd.containsKey(93) || !cd.containsKey(155) || !cd.containsKey(203) || !cd.containsKey(271)) ){
      print('hide photo');
      context['Meteor'].callMethod('call', ['photo', session, -999, -999, -999, -999]);
      photoPresent = false;
    }

    // map
    // 157 – top L; 205 – top  R; 279 – bottom L; 327 – bottom R
    if (cd.containsKey(157) && cd.containsKey(205) && cd.containsKey(279) &&
        cd.containsKey(327)) {
      print('show map');
      Coordinates originalCoordinates = fetchCoordinates(cd[157], cd[205],
          cd[279]);

      Coordinates ios = transformIos(originalCoordinates);
      double height_ios = (ios.y2 - ios.y1).abs();
      double width_ios = (ios.x2 - ios.x1).abs();

      Coordinates web = transformWeb(originalCoordinates);
      double height_web = (web.y2 - web.y1).abs();
      double width_web = (web.x2 - web.x1).abs();

      print([ios.x1, ios.y1, height_ios, width_ios]);

      context['Meteor'].callMethod('call', ['map', session, ios.x1, ios.y1,
        height_ios, width_ios]);
      mapPresent = true;

       // call screenshot for multi-fidelity overlay
      if (cd.containsKey(331)) {
        context.callMethod('screenshot', [web.x2, web.y1, width_web,
        height_web, ios.x1, ios.y1, width_ios, height_ios, "false"]);
      }
    } else if (mapPresent && (!cd.containsKey(157) || !cd.containsKey(205) || !cd.containsKey(279) || !cd.containsKey(327)) ){
      print('hide map');
      context['Meteor'].callMethod('call', ['map', session, -999, -999, -999, -999]);
      mapPresent = false;
    }
    // if the MF code isn't on the screen we shouldn't be showing and overlay
    if (!cd.containsKey(331)) {
      print('remove ss');
    }
    // </editor-fold>

    print(cd);
  }
}


// max x: 875 (left)
// min x: 420 (right)
// max y: 655 (bottom)
// min y: ~25 (top)
