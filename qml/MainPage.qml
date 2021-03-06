import QtQuick 2.0
import Sailfish.Silica 1.0
import QtMultimedia 5.0
import "engine.js" as Sd

Page {
    id: mainPage
    //width: 480;
    //height:854;
    property int tim:0;
    Rectangle {
        anchors.fill: parent;
        Image {id: bg_1;//背景
            anchors.fill: parent;
            z:10;
            source: "img/bg_day.png"
        }
        Image {id: bg_2;
            x: 0;
            y: parent.height - height;
            z:20;
            width: mainPage.width+100;
            fillMode: Image.TileHorizontally
            source: "img/bg_bottom.png"
        }
        Rectangle{//欢迎界面
            visible: true;
            id:welcomeDiv
            z:12
            color: "#00ffffff";
            anchors.fill: parent;
            Image {id: logo;
                x: (mainPage.width-logo.width)/2;
                y: 100;
                source: "img/logo.png"
            }
            Image {id: bird0;
                x: (mainPage.width-bird0.width)/2;
                y: 300;
                source: "img/bird11.png"
            }
            Image {id: start
                x: mainPage.width/4-width/2;
                y: 420;
                source: "img/start.png"
                MouseArea{
                    anchors.fill: parent;
                    onClicked: {
                        Sd.enterGame();
                    }
                }
            }
            Image {id: rank;
                x: mainPage.width/4*3-width/2;
                y: 420;
                source: "img/rank.png"
                MouseArea{
                    anchors.fill: parent;
                    onClicked: {
                        Sd.rank();
                    }
                }
            }
        }
        Rectangle{//预备阶段界面
            visible: false;
            id:readyDiv;
            z:13
            color: "#00ffffff";
            anchors.fill: parent;
            Image {id: getready;
                x: (mainPage.width-getready.width)/2;
                y: 100;
                source: "img/getready.png"
            }
            Image {id: bird1;
                z:13;
                x: 120;
                y: 300;
                source: "img/bird11.png"
            }
            Image {id: study;
                x: (mainPage.width-study.width)/2;
                y: 250;
                source: "img/study.png"
            }
            MouseArea{
                anchors.fill: parent;
                onPressed: {
                    Sd.startGame();
                    mTimer.running = true
                }
            }
        }
        Rectangle{//游戏界面
            visible: false;
            id:gameDiv;
            z:13;
            color: "#00ffffff";
            anchors.fill: parent;
            Image {id: bird;//游戏中的小鸟
                z:13;rotation:-20;
                x: 120;y:120;
                source: "img/bird11.png"
            }
            Item {id: sorceNow;//当前分数
                z:13;width: 130;
                x: (mainPage.width-sorceNow.width)/2;
                y: 60;
                Image {id: sorceNow1;x:44;source: "img/30.png";}
                Image {id: sorceNow2;x:44;source: "img/30.png";}
                Image {id: sorceNow3;x:44;source: "img/30.png";}
            }
            Item {id: guan1;//管道1
                visible: false;
                x:0;y:-150;
                Image {source: "img/guan_1.png"}
                Image {y: 720;source: "img/guan_2.png";}
            }
            Item {id: guan2;//管道2
                visible: false;
                x:mainPage.width/2;y:-300;
                Image {source: "img/guan_1.png"}
                Image {y: 720;source: "img/guan_2.png";}
            }
            Item {id: guan3;//管道3
                visible: false;
                x:mainPage.width;y:-450;
                Image {source: "img/guan_1.png"}
                Image {y: 720;source: "img/guan_2.png";}
            }

            MouseArea {
                anchors.fill: parent;
                enabled: mTimer.running && !overbg.visible
                onPressed: Sd.tap()
            }

            Image {id: pause
                visible: !overDiv.visible
                source: mTimer.running ? "img/pause.png" : "img/play.png"
                x: 30
                y: 30

                MouseArea {
                    anchors.fill: parent
                    onPressed: mTimer.running = !mTimer.running
                }
            }

        }
        Rectangle{//游戏结束界面
            visible: false;
            id:overDiv;
            z:13
            color: "#00ffffff";
            anchors.fill: parent;
            Image {id: gameover;
                x: (mainPage.width-gameover.width)/2;
                y: 100;
                source: "img/gameover.png"
            }
            Image {id: overbg;
                //visible: false;测试
                x: (mainPage.width-overbg.width)/2;
                y: 200;
                source: "img/me_bg.png"
            }
            Image {id: media;
                anchors.left: overbg.left
                anchors.leftMargin: 48
                y: 275;
                source: "img/me_3.png"
            }
            Item {id: sorce;
                z:13;width: 79;
                x: 310; y: 260;
                Image {id: sorce1;x: 0;source: "img/20.png";}
                Image {id: sorce2;x:27;source: "img/20.png";}
                Image {id: sorce3;x:54;source: "img/20.png";}
            }
            Item {id: sorcebest;
                z:13;width: 79;
                x: 310; y: 330;
                Image {id: sorcebest1;x: 0;source: "img/20.png";}
                Image {id: sorcebest2;x:27;source: "img/20.png";}
                Image {id: sorcebest3;x:54;source: "img/20.png";}
            }
            Image {id: sorcenew;
                visible: false;
                anchors.right: overbg.right
                anchors.rightMargin: 108
                y: 300;
                source: "img/new.png"
            }
            Image {id: start2;
                anchors.left: overbg.left
                anchors.leftMargin: -4
                y: 420;
                source: "img/start.png"
                MouseArea{
                    anchors.fill: parent;
                    onClicked: {
                        Sd.restartGame();
                    }
                }
            }
            Image {id: rank2;
                anchors.right: overbg.right
                y: 420;
                source: "img/rank.png"
                MouseArea{
                    anchors.fill: parent;
                    onClicked: {
                        Sd.rank();
                    }
                }
            }
        }

        Image {
            id: mute
            x: mainPage.width - 30 - width
            y: 30
            z: 20
            source: playMusic1.muted ? "img/mute.png" : "img/audio.png"
            visible: welcomeDiv.visible || overDiv.visible

            MouseArea {
                anchors.fill: parent
                onPressed: playMusic1.muted = !playMusic1.muted
            }
        }
    }
    //播放
    SoundEffect {id: playMusic1;source: "sound/fb_start.wav"; muted: false}
    SoundEffect {id: playMusic2;source: "sound/fb_tap.wav"; muted: playMusic1.muted}
    SoundEffect {id: playMusic3;source: "sound/fb_sorce.wav"; muted: playMusic1.muted}
    SoundEffect {id: playMusic4;source: "sound/fb_die.wav"; muted: playMusic1.muted}
    //“关于”弹窗
    MainDialog{
        id:myDia
        anchors.centerIn: parent
        //color:"white"
        z: 22;
    }

    //定时器
    Timer {
        id:mTimer
        interval: 20
        running: true
        repeat: true
        onTriggered: Sd.cycle()
    }

    Connections {
        target: app
        onApplicationActiveChanged: {
            if (!app.applicationActive) {
                mTimer.running = false
            }
        }
    }
}
