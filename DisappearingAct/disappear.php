<!DOCTYPE html>

<!--
 _______   __       _______.     ___      .______   .______    _______     ___      .______       __  .__   __.   _______         ___       ______ .___________.
|       \ |  |     /       |    /   \     |   _  \  |   _  \  |   ____|   /   \     |   _  \     |  | |  \ |  |  /  _____|       /   \     /      ||           |
|  .--.  ||  |    |   (----`   /  ^  \    |  |_)  | |  |_)  | |  |__     /  ^  \    |  |_)  |    |  | |   \|  | |  |  __        /  ^  \   |  ,----'`---|  |----`
|  |  |  ||  |     \   \      /  /_\  \   |   ___/  |   ___/  |   __|   /  /_\  \   |      /     |  | |  . `  | |  | |_ |      /  /_\  \  |  |         |  |     
|  '--'  ||  | .----)   |    /  _____  \  |  |      |  |      |  |____ /  _____  \  |  |\  \----.|  | |  |\   | |  |__| |     /  _____  \ |  `----.    |  |     
|_______/ |__| |_______/    /__/     \__\ | _|      | _|      |_______/__/     \__\ | _| `._____||__| |__| \__|  \______|    /__/     \__\ \______|    |__|     

Take a look at this code. Some of my implementation might be surprising, some might suck.
I've tried to keep it simple

Copyright (c) 2016 Ryan Pappa

Permission is hereby granted, free of charge, to any person obtaining a copy of this software 
and associated documentation files (the "Software"), to deal in the Software without restriction, 
including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, 
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial 
portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION 
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.                                                                                                                                                               
-->

<html>
    <head>
        <!-- In order: materialize css, stylesheet, jquery, materialize js, jquery colorize (for color animations), our javascript-->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.7/css/materialize.min.css">
        <link rel="stylesheet" type="text/css" href="disappear.css">
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.7/js/materialize.min.js"></script>
        <script src="https://code.jquery.com/color/jquery.color-2.1.2.min.js"></script>
        <script src="disappear.js"></script>
    </head>
    <body>
        <!-- The circle that the user clicks on -->
        <div id="circle" class="large circle">
            <!--the text inside the circle-->
            <div class="circleTextContainer"><span id = "circleText">A</span></div>
        </div>
        <!--timer in corner-->
        <div id="timer"><span id="time">3</span></div>
        <!--score in middle-->
        <div id="scoreContainer"><span id="score">0</span></div>
        <!--header at top, hidden by default-->
        <div id="headerPull">
            <nav class = "header">
                <div class="nav-wrapper light-blue">
                  <ul class="left hide-on-med-and-down">
                    <li><a href="/">Home</a></li>
                    <li class = "active"><a href="/DisappearingAct/disappear.php">Disappearing Act</a></li>
                    <li><a href="/resume/">Resume</a></li>
                  </ul>
                </div>
              </nav>
        </div>
        <!--highscore container-->
        <div id="endgame">
            <div id = "close" class = "line">
                <div id="line1"></div>
                <div id="line2"></div>
            </div>
            <div id ="x"></div>
            <span id ="yourscore">Your Score:</span><br />
            <span>High Scores:</span>
            <ol id="high">
                
            </ol>
            <a class="waves-effect waves-light btn restart">restart</a>
        </div>
        <!--slideout at bottom of screen-->
        <div id="slideout">
            <div id="tab"></div>
            <div id="contents">
                <div class="row">
                  <div class="col s6 offset-s3">
                      <div class="modes">
                          <ul class="pagination">
                            <li class="active"><a class='mode' id="relax">Relax Mode</a></li>
                            <li class="waves-effect"><a class='mode' id="timed">Timed Mode</a></li>
                            <li class="waves-effect"><a href="#" class='mode' id="whack">Whack Mode</a></li>
                          </ul>
                      </div>
                      <div class="audio">
                          <input type="checkbox" class="filled-in" id="audioBox" checked="checked" />
                          <label for="audioBox">Audio</label>
                      </div>
                  </div>
                </div>
                
                <div id="copyright"><span>Designed by Ryan Pappa</span></div>
            </div>
        </div>
    </body>
</html>