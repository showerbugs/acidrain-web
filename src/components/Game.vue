<template>
    <div>
        <div>{{status}}</div>
        <div id="score_bord"></div>
        <div id="message"></div>
        <canvas id="hell"></canvas>
    </div>
</template>

<script>
    import {init} from '../speechSdk'
    console.log(init)
    const wordSet = ['hou', 'index', 'score', 'minho', 'home'];

    function startSpeech(recognizer) {
        recognizer.Recognize((event) => {
            /*
             Alternative syntax for typescript devs.
             if (event instanceof SDK.RecognitionTriggeredEvent)
             */
            switch (event.Name) {
                case "RecognitionTriggeredEvent" :
                    UpdateStatus("Initializing");
                    break;
                case "ListeningStartedEvent" :
                    UpdateStatus("Listening");
                    break;
                case "RecognitionStartedEvent" :
                    UpdateStatus("Listening_Recognizing");
                    break;
                case "SpeechStartDetectedEvent" :
                    UpdateStatus("Listening_DetectedSpeech_Recognizing");
                    console.log(JSON.stringify(event.Result)); // check console for other information in result
                    break;
                case "SpeechHypothesisEvent" :
                    UpdateRecognizedHypothesis(event.Result.Text);
                    console.log(JSON.stringify(event.Result)); // check console for other information in result
                    break;
                case "SpeechEndDetectedEvent" :
                    OnSpeechEndDetected();
                    UpdateStatus("Processing_Adding_Final_Touches");
                    console.log(JSON.stringify(event.Result)); // check console for other information in result
                    break;
                case "SpeechSimplePhraseEvent" :
                    UpdateRecognizedPhrase(JSON.stringify(event.Result, null, 3));
                    break;
                case "SpeechDetailedPhraseEvent" :
                    UpdateRecognizedPhrase(JSON.stringify(event.Result, null, 3));
                    break;
                case "RecognitionEndedEvent" :
                    OnComplete();
                    UpdateStatus("Idle");
                    console.log(JSON.stringify(event)); // Debug information
                    break;
            }
        })
                .On(() => {
                    // The request succeeded. Nothing to do here.
                },
                (error) => {
                    console.error(error);
                });
    }



    //MooTools $random
    function _random(Min, Max) {
        return Math.floor(Math.random() * (Max - Min + 1) + Min);
    }

    var TypingBlood = function () {
        var game = {

            canvas: null,
            context: null,
            playing: false,
            loop_timer: null,

            bones: [],
            powders: [],

            karma: 0,

            bloodPondLineHeight: 10,
            bloodPondHeight: 0,
            bloodPondAlpha: 1,
            bloodParticles: [],

            scoreBord: null,
            level: 1,
            miss: 0,
            pass: 0,
            totalScore: 0,
            combo: 0,


            addEvent: function (obj, type, fn) {
                if (obj.addEventListener)
                    obj.addEventListener(type, fn, false);
            },

            load: function (id) {

                game.canvas = document.getElementById(id);
                console.log(game.canvas)
                game.scoreBord = document.getElementById("score_bord");
                game.message = document.getElementById("message");

                if (game.canvas.getContext) {
                    game.context = game.canvas.getContext('2d');
                    game.setCanvas();

                    game.setPondSize();
                    game.title();

                }

                this.addEvent(window, 'resize', function () {
                    game.setCanvas();
                    if (!game.playing) game.title();
                });

                this.addEvent(window, 'blur', function (e) {
                    game.pause();
                });

                this.addEvent(document, 'keydown', function (e) {


                    if (e.keyCode == 32) {
                        game.pause();
                    }

                    if (e.keyCode == 13) {

                        if (!game.loop_timer && game.totalScore === 0) {//start
                            game.play();

                        } else if (!game.playing && game.loop_timer) {//gameover
                            game.level = 1;
                            game.miss = 0;
                            game.pass = 0;
                            game.karma = 0;
                            game.totalScore = 0;
                            game.combo = 0;
                            game.bloodPondAlpha = 1;
                            game.score();
                            game.setPondSize();

                            clearInterval(game.loop_timer);
                            game.play();

                        } else if (!game.playing) {//pause
                            game.play();
                        }

                    }

                    var index = game.searchString(e.keyCode);

                    if (index !== false) {
                        game.bones[index].clear = true;
                        game.pass++;
                        game.combo++;
                        game.karma++;
                        game.totalScore += 100;
                    } else {
                        game.miss++;
                        game.combo = 0;
                        game.karma -= 2;
                        game.totalScore -= 100;
                        game.bloodPondHeight += game.bloodPondLineHeight;//池拡張
                    }

                });

            },

            setPondSize: function () {
                game.bloodPondLineHeight = Math.floor(game.height / 100);
                game.bloodPondHeight = Math.floor((game.height / 100) - game.bloodPondLineHeight) * 100;
            },

            pause: function () {

                if (game.playing) {
                    game.message.className = "pause";
                    game.message.innerHTML = '<p style="color:#fff;position:absolute;top:50%;left:0;width:100%;margin-top:-40px;text-align:center;font-size:20px;">Typing Blood<br/>- Pause -<br />push enter key</p>';
                }

                clearInterval(game.loop_timer);
                game.playing = false;
                game.loop_timer = null;
            },

            play: function () {
                game.playing = true;
                game.message.className = "";
                game.message.innerHTML = 'Press [space] to pause, [enter] to resume...';
                game.loop_timer = setInterval(function () {
                    game.loop();
                }, 1000 / 60);

            },

            title: function () {

                game.context.save();
                game.context.font = "42px 'Arial'";
                var str = "Acid rain";
                let tm = game.context.measureText(str);

                game.context.save();
                game.context.fillStyle = "red";
                game.context.shadowColor = "#ff0000";
                game.context.shadowBlur = 10;
                game.context.fillText(str, game.width / 2 - tm.width / 2, game.height / 2 - 80);
                game.context.restore();

                game.context.font = "30px 'Arial'";

                game.context.fillStyle = "#fff";

                str = "[enter] Game start";
                tm = game.context.measureText(str);
                game.context.fillText(str, game.width / 2 - tm.width / 2, game.height / 2 + 20);

                game.context.font = "11px 'Arial'";

                str = "마이크를 켜주세요。";
                tm = game.context.measureText(str);
                game.context.fillText(str, game.width / 2 - tm.width / 2, game.height / 2 + 60);

                str = "画面が全て血色に染まったらゲームオーバーです。";
                tm = game.context.measureText(str);
                game.context.fillText(str, game.width / 2 - tm.width / 2, game.height / 2 + 75);

                game.context.restore();
            },

            setCanvas: function () {
                game.width = window.innerWidth;
                game.height = window.innerHeight;
                game.canvas.height = game.height;
                game.canvas.width = game.width;
                game.canvas.style.backgroundColor = "#000";
                game.canvas.style.position = 'absolute';
                game.canvas.style.top = "0px";
                game.canvas.style.left = "0px";
                game.bloodPondLineHeight = Math.round(game.height / 100);
            },

            createText: function () {
                var word = wordSet[_random(0, wordSet.length - 1)];
                var x = Math.floor(_random(35, game.width - 35));
                var y = (game.level > 1) ? Math.floor(0 - 20 * (Math.random() * 7)) : 0;
                var t = {
                    code: word,
                    text: word,
                    x: x,
                    y: y,
                    powder: null,
                    clear: false
                };

                game.bones.push(t);
            },

            searchString: function (code) {
                for (var key in game.bones) {
                    if (game.bones[key].code == code) return key;
                }

                return false;
            },

            createBloodPond: function (a) {
                var h = game.height - game.bloodPondHeight;
                a = (a <= 0) ? 0 : a;
                game.context.save();
                var g = game.context.createLinearGradient(0, h, 0, game.width);
                g.addColorStop(0, 'rgba(' + game.bloodPondHeight + ', 0, 0, ' + a + ')');
                g.addColorStop(1, 'rgba(' + game.bloodPondLineHeight + ', 0, 0, ' + a + ')');
                game.context.fillStyle = g;

                game.context.beginPath();
                game.context.rect(0, h, game.width, game.height);
                game.context.fill();

                game.context.shadowColor = "#ff0000";
                game.context.shadowBlur = 5;
                game.context.strokeStyle = 'rgb(' + (game.bloodPondHeight + 60) + ',0,0)';
                game.context.beginPath();
                game.context.lineTo(0, h);
                game.context.lineTo(game.width, h);
                game.context.stroke();
                game.context.restore();

            },

            createBloods: function (x, y) {
                var end = 10 + ( Math.random() * 15 );

                while (end >= 0) {
                    var p = {
                        x: x,
                        y: y,
                        vx: Math.random() * 0.5,
                        vy: Math.random() * 1 - 6.7,
                        r: -4 + Math.random() * 8,
                        alpha: 1
                    };

                    game.bloodParticles.push(p);
                    end--;
                }
            },

            createPowder: function (x, y) {
                var q = 20 + ( Math.random() * 15 );
                var a = [];

                while (q >= 0) {
                    var p = {
                        x: Math.floor(x + ( Math.sin(q) * 0.03 )),
                        y: Math.floor(y + Math.cos(q) * 10),
                        vx: -4 + Math.random() * 8,
                        vy: -4 + Math.random() * 8,
                        alpha: 1
                    };

                    game.powders.push(p);
                    q--;
                }

            },

            loop: function () {

                game.context.save();
                game.createText();
                if ((game.bones.length < 1 * game.level) && game.playing) {
                    game.createText();
                }

                game.context.clearRect(0, 0, game.width, game.height);
                var borderLine = game.height - game.bloodPondHeight;

                for (var i = 0; i < game.bones.length; i++) {
                    var e = game.bones[i];

                    if (e.y < borderLine) {
                        e.y = e.y + 2;
                    } else {
                        e.y = e.y + 0.3;
                    }

                    game.context.font = "30px 'Arial'";
                    game.context.fillStyle = "#fff";
                    game.context.fillText(e.text, e.x, e.y);

                    if (e.clear) {

                        game.bones.splice(i, 1);
                        game.createPowder(e.x, e.y);

                        if (game.bloodPondHeight !== 0) game.bloodPondHeight -= game.bloodPondLineHeight;

                    } else if (e.y >= (borderLine + 20)) {

                        game.bloodPondHeight += game.bloodPondLineHeight;

                        game.bones.splice(i, 1);
                        game.miss++;
                        game.karma -= 3;
                        game.totalScore -= 100;
                        game.createBloods(e.x, borderLine);
                    }
                }

                if (game.bloodPondHeight >= game.height) {
                    game.playing = false;
                }


                for (var b = 0; b < game.powders.length; b++) {
                    let powder = game.powders[b];

                    powder.x += powder.vx;
                    powder.y += powder.vy;

                    powder.alpha -= 0.02;

                    game.context.save();
                    game.context.fillStyle = 'rgba(255,255,255,' + Math.max(powder.alpha, 0) + ')';
                    game.context.fillRect(powder.x, powder.y, 2, 2);
                    game.context.restore();

                    if (powder.alpha <= 0) {
                        game.powders.splice(b, 1);
                    }
                }

                for (var k = 0; k < game.bloodParticles.length; k++) {
                    let p = game.bloodParticles[k];

                    p.vy += 0.5;

                    p.x += p.vx + p.r;
                    p.y += p.vy;

                    p.alpha -= 0.01;

                    game.context.save();
                    game.context.fillStyle = 'rgba(255,0,0,' + Math.max(p.alpha, 0) + ')';
                    game.context.fillRect(p.x, p.y, 3, 3);
                    game.context.restore();

                    if (p.alpha <= 0) {
                        game.bloodParticles.splice(k, 1);
                    }
                }

                if (!game.playing) {
                    game.bloodPondAlpha -= 0.01;
                    game.endroll();
                }

                game.createBloodPond(game.bloodPondAlpha);

                game.context.restore();

                game.score();

                if (game.bloodPondAlpha <= 0) {
                    clearInterval(game.loop_timer);
                }
            },

            endroll: function () {
                game.context.save();
                game.context.font = "42px 'Arial'";
                game.context.fillStyle = "#fff";

                let str = "Game Over";
                let tm = game.context.measureText(str);

                game.context.fillText(str, game.width / 2 - tm.width / 2, 200);
                game.context.font = "24px 'Arial'";

                str = "[enter] Restart game";
                tm = game.context.measureText(str);
                game.context.fillText(str, window.innerWidth / 2 - tm.width / 2, 250);
                game.context.restore();

            },

            score: function () {

                var c = Math.floor((game.pass + game.combo - game.miss + game.karma) / 13.5);

                if (c > 0) game.level = c;

                var html = "Miss:" + game.miss + "  Passed:" + game.pass + " Combo:" + game.combo + "  Level:" + game.level + "  Score:" + game.totalScore;
                game.scoreBord.innerHTML = html;
            }

        };

        return game;

    };


    export default {
        data() {
        return {
            status: ''
        }
    },
        mounted()
    {
        var typing = new TypingBlood();
        typing.load('hell');
        init(function (SDK, recognize) {
            console.log(recognize)
            startSpeech(recognize)
        });
    }

    }



</script>
<style scoped>
    body {
        background: #000;
        margin: 0;
        padding: 0
    }

    #score_bord {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 1;
        padding: 5px;
        color: #666;
        font-size: 14px;
        font-family: Verdana, Geneva, sans-serif;
    }

    #message {
        font-family: Verdana, Geneva, sans-serif;
        position: absolute;
        right: 0;
        bottom: 0;
        z-index: 20;
        color: #C00;
        font-size: 11px;
    }

    .pause {
        background-color: #000;
        left: 0;
        top: 0;
        height: 100%;
        width: 100%;
    }

    canvas {
        z-index: 0;
    }

</style>