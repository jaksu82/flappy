.import QtQuick.LocalStorage 2.0 as Sql

var tmpi=0;
var signalNum=0;//0-欢迎，1-准备，2-游戏，3-结束
var sorceArr=[0,0,0,0,0,0,0];//当前分数
//结算时动画效果
var tmpSorce=0;//临时分数
var tmpTime=0;//临时计时

var isTap=0;
var g=new Object();//重力环境参数
g.t=15;//到达最高点所需的时间
g.h=80;//最高点距离
var gt=g.t;
var runTime=0;//游戏运行时间
var freshTime=30;//刷新时间
var tempBirdTop=300;//小鸟起跳位置
var birdNow=1;//当前小鸟颜色，1-黄，2-蓝，3-红
var mp3=""
// Offline storage
var db = Sql.LocalStorage.openDatabaseSync("FBHighScore","1.0","Local High Scores",100);
var sorceBest=0;
db.transaction(
    function(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS Scores(score NUMBER)');
        var rs = tx.executeSql('SELECT * FROM Scores ORDER BY score desc LIMIT 1');
        for (var i = 0; i < rs.rows.length; i++) {
            sorceBest=rs.rows.item(i).score;
        }
    }
);

var bObj=new Object();
var bObjs=new Array();
bObjs[0]=bObj;bObjs[1]=bObj;bObjs[2]=bObj;
bObjs[0].y=300;bObjs[1].y=300;bObjs[2].y=300;
bObjs[0].x=210;bObjs[1].x=bObjs[1].x=120;
bObjs[0].rotation=0;bObjs[1].rotation=0;bObjs[2].rotation=-20;

var gObj=new Object();
var gObjs=new Array();
gObjs[0]=gObj;gObjs[1]=gObj;gObjs[2]=gObj;
gObjs[0].x=-90;gObjs[1].x=195;gObjs[2].x=480;
var guanArr=[-200,-300,-400];//水管y位置


function initData(){
    guan1.x=0;//水管重定位
    guan1.visible=guan2.visible=guan3.visible=false;

    signalNum=1;//状态更换
    runTime=0;//时间重置
    sorcenew.visible=false;//新纪录图标重置隐藏
    sorceNow1.visible=false;
    sorceNow2.visible=false;
    sorceNow3.visible=true;
    sorceArr[0]=0;//分数重置

    tempBirdTop=300;//小鸟起跳位置重置
    birdNow=Math.floor(Math.random()*100)%3+1;//重置小鸟颜色
    if(Math.floor(Math.random()*100)%2){//重置背景颜色
        bg_1.source="img/bg_day.png";
    }else{
        bg_1.source="img/bg_night.png";
    }
    bird.rotation=bObjs[2].rotation=-20
    bird1.y=bObjs[1].y=300;//位置重置
    bird.y=bObjs[2].y=300;
}
function sicle(){
    tmpi=(tmpi+1)%10000;//防止溢出导致程序混乱

    if(signalNum<=2){ //背景模拟前进视觉
        bg_2.x=(bg_2.x-5)%80;
    }

    if(tmpi%8==0 && signalNum<3){//削减翅膀扇动频率
        if(signalNum==0){//欢迎界面下
            bird0.source="img/bird"+birdNow+""+(tmpi%3+1)+".png"
            if((tmpi/8)%12<6){//演示状态下，小鸟位置变化
                bird0.y=bObjs[0].y+(tmpi/8)%12*3-6;
            }else{
                bird0.y=bObjs[0].y+(12-(tmpi/8)%12)*3-6;
            }
        }
        if(signalNum==1){//准备状态下
            bird1.source="img/bird"+birdNow+""+(tmpi%3+1)+".png"
            if((tmpi/8)%12<6){//演示状态下，小鸟位置变化
                bird1.y=bObjs[1].y+(tmpi/8)%12*3-6;
            }else{
                bird1.y=bObjs[1].y+(12-(tmpi/8)%12)*3-6;
            }
        }
        if(signalNum==2){//游戏状态下
            bird.source="img/bird"+birdNow+""+(tmpi%3+1)+".png";
        }
    }
    if(signalNum==2){//游戏状态下
        runTime+=freshTime;

        if(bObjs[2].rotation<90){//斜角改变
            bird.rotation=bObjs[2].rotation=bObjs[2].rotation+gt*gt*0.005;
        }else{
            bird.rotation=bObjs[2].rotation=90;
        }

        //模拟重力下垂
        bObjs[2].y=tempBirdTop+(gt-g.t)*(gt-g.t)*(g.h/g.t/g.t)-g.h;
        gt++;
        if(gt==g.t){
            playS("start");
        }
        //刷新界面位置
        bird.y=bObjs[2].y;

        //显示当前分数,并调整居中
        if(sorceArr[0]==10){
            sorceNow2.visible=true;
            sorceNow2.x=21;
            sorceNow3.x=65;
        }else if(sorceArr[0]==100){
            sorceNow1.visible=true;
            sorceNow1.x=0;
            sorceNow2.x=44;
            sorceNow3.x=88;
        }else if(sorceArr[0]<10){
            sorceNow3.x=44;
        }
        sorceArr[1]=Math.floor(sorceArr[0]/100);
        sorceArr[2]=Math.floor(sorceArr[0]%100/10);
        sorceArr[3]=Math.floor(sorceArr[0]%10);
        sorceNow1.source="img/3"+sorceArr[1]+".png";
        sorceNow2.source="img/3"+sorceArr[2]+".png";
        sorceNow3.source="img/3"+sorceArr[3]+".png";
    }

    if(runTime>=100*freshTime){//开局适应时间结束后出现障碍
        guan3.visible=true;
        if(runTime>=100*freshTime+75*freshTime){guan1.visible=true;}
        if(runTime>=100*freshTime+132*freshTime){guan2.visible=true;}
        var tmpX=guan1.x+850+90;

        guan1.x=gObjs[0].x=tmpX%855-90;
        guan2.x=gObjs[1].x=(tmpX+285)%855-90;
        guan3.x=gObjs[2].x=(tmpX+570)%855-90;
        runGame();
    }
    checkDie();
    if(signalNum==3){//结算状态下
        tmpTime++;
        if(tmpTime%5==0 && tmpSorce<sorceArr[0]){
            tmpSorce++;
            showSorce(tmpSorce);
        }
    }
}

function enterGame(){
    welcomeDiv.visible=false;
    readyDiv.visible=true;
    signalNum=1;
    initData();//数据初始化
}
function startGame(){
    readyDiv.visible=false;
    overDiv.visible=false;
    gameDiv.visible=true;
    sorceNow.visible=true;
    signalNum=2;//状态更换
    runTime=0;//时间重置
    sorceArr[0]=0;//分数重置
    gt=0;
}
function restartGame(){//重新开始
    overDiv.visible=false;
    gameDiv.visible=false;
    readyDiv.visible=true;
    initData();//数据初始化
}
function runGame(){
    if((runTime-100*freshTime-85*freshTime)>=0&&(runTime-100*freshTime-85*freshTime)%(57*freshTime)==0){
        sorceArr[0]++;//得分增加
        playS("sorce");
        guanArr[sorceArr[0]%3]=Math.random()*300-450//-450~-150/取下一个水管的开口位置
    }
    guan1.y=guanArr[0];
    guan2.y=guanArr[1];
    guan3.y=guanArr[2];
}
function dieGame(){//死亡时执行的函数
    sorceNow.visible=false;
    playS("die");

    if(sorceArr[0]>sorceBest){
        saveHighScore();
        sorcenew.visible=true;
        sorceBest=sorceArr[0];
    }
    tmpSorce=0;
    showSorce(tmpSorce);//显示得分

    showBestSorce();//显示最好分数
    overDiv.visible=true;//显示死亡图层
    signalNum=3;
    runTime=0;
}
function checkDie(){//检测死亡
    //birdSize:59*42
    if(runTime>0 && bird.y>bg_2.y-40){
        bird.y=bObjs[2].y=bg_2.y-40+5;
        dieGame();
    }
    if(runTime>0 && bird.y<0){
        bird.y=bObjs[2].y=-5;
        dieGame();
    }
    if(runTime>=100*freshTime+75*freshTime && bird.x+59-9>=guan1.x && bird.x+9<=guan1.x+90){
        if(bird.y+42-2>=guan1.y+720 || bird.y+2<=guan1.y+540){
            dieGame();
        }
    }
    if(runTime>=100*freshTime+132*freshTime && bird.x+59-9>=guan2.x && bird.x+9<=guan2.x+90){
        if(bird.y+42-2>=guan2.y+720 || bird.y+2<=guan2.y+540){
            dieGame();
        }
    }
    if(runTime>=100*freshTime && bird.x+59-9>=guan3.x && bird.x+9<=guan3.x+90){
        if(bird.y+42-2>=guan3.y+720 || bird.y+2<=guan3.y+540){
            dieGame();
        }
    }
}

function tap(){
    playS("tap");
    bObjs[2].rotation=-20;//回复小鸟角度
    gt=0;//重置时间
    tempBirdTop=bObjs[2].y;//重置起点

}

function rank(){
    myDia.show(
                "FlappyBird for SailfishOS\n\n"+
                "Author：蝉曦\n"+
                "Feedback：百度蝉曦吧\n"+
                "Porting: Tomasz Sterna"
               )
}
function saveHighScore(){
    var dataStr = "INSERT INTO Scores VALUES(?)";
    var data = sorceArr[0];
    db.transaction(
        function(tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS Scores(score NUMBER)');
            tx.executeSql(dataStr, data);
        }
    );
}

function showSorce(msorce){//显示最终分数
    var tmpSorceArr=new Array();
    tmpSorceArr[0]=sorceArr[1]=Math.floor(msorce/100);
    tmpSorceArr[1]=Math.floor(msorce%100/10);
    tmpSorceArr[2]=Math.floor(msorce%10);

    sorce1.visible=false;
    sorce2.visible=false;
    sorce3.visible=true;
    if(msorce>=10){sorce2.visible=true;}
    if(msorce>=100){sorce1.visible=true;}
    sorce1.source="img/2"+tmpSorceArr[0]+".png"
    sorce2.source="img/2"+tmpSorceArr[1]+".png"
    sorce3.source="img/2"+tmpSorceArr[2]+".png"
}

function showBestSorce(){//显示最好分数
    sorceArr[4]=Math.floor(sorceBest/100);
    sorceArr[5]=Math.floor(sorceBest%100/10);
    sorceArr[6]=Math.floor(sorceBest%10);
    sorcebest1.visible=false;
    sorcebest2.visible=false;
    sorcebest3.visible=true;
    if(sorceBest>=10){sorcebest2.visible=true;}
    if(sorceBest>=100){sorcebest1.visible=true;}
    sorcebest1.source="img/2"+sorceArr[4]+".png"
    sorcebest2.source="img/2"+sorceArr[5]+".png"
    sorcebest3.source="img/2"+sorceArr[6]+".png"
    if(sorceArr[0]>=0){//奖牌
        media.source="";
        if(sorceArr[0]>=10){media.source="img/me_1.png";}
        if(sorceArr[0]>=20){media.source="img/me_2.png";}
        if(sorceArr[0]>=30){media.source="img/me_3.png";}
        if(sorceArr[0]>=40){media.source="img/me_4.png";}
    }
}
function playS(mp){
    if(mp=="start"){playMusic1.play();}
    else if(mp=="tap"){playMusic2.play();}
    else if(mp=="sorce"){playMusic3.play();}
    else if(mp=="die"){playMusic4.play();}
}
