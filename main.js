// - global -------------------------------------------------------------------
var screenCanvas, info;
var title =  true;//タイトル画面
var start = false;//合間の画面
var battle = false;//戦闘中
var finish = false;
var win;//勝利フラグ

//changeScene()の処理の説明
//titleがtrueでzを押すとバトル前のスタート画面へ
//startがtrueでzを押すとバトル画面へ
//finishがtrueの段階でランダムな数字ごとに3パターンの勝利シーンへ.
//finishはfalseで、winがtrueの状態の場合ED画面へ
var finishpunch = 0;//ランダムでfinishのパンチを３パターンから決める。finishモードでのこの数字により異なるモードに。
var countFinishpunch = 0;//必殺技3の時にカウントする数字

var rival = null;//ライバルインスタンスを保管する変数
var time = 0;//ゲーム開始からの時間
var fire = false;//パンチを打っているフラグ
var foot = true;
var enemy_moveFlg = "up";

var heroheight = 200;//見出しの高さ

// ---------------------------------------------------------------------
var CHARA_SHOT_COLOR = 'white';
var CHARA_SHOT_MAX_COUNT = 2;//一度に打てるパンチの数
var ENEMY_COLOR = 'rgba(255, 0, 0, 0.75)';
var ENEMY_SHOT_COLOR = 'rgba(255, 0, 255, 0.75)';
var ENEMY_SHOT_MAX_COUNT = 4;

//最初にショット生成を収納
var charaShot = new Array(CHARA_SHOT_MAX_COUNT);
for(i = 0; i < CHARA_SHOT_MAX_COUNT; i++){
    charaShot[i] = new CharacterPunch();
}

//最初に敵のショット生成を収納
// エネミーショット初期化
var enemyShot = new Array(ENEMY_SHOT_MAX_COUNT);
for(i = 0; i < ENEMY_SHOT_MAX_COUNT; i++){
    enemyShot[i] = new EnemyShot();
}

//パンチオブジェクトを生成
var boximg = new Image();
var boxingIcon =　'./img/groobe.png';
boximg.src = boxingIcon;

//ライバルのfinishのときの顔
var chinpiraface = new Image();
var chinpiraIcon = './img/finish.png';
chinpiraface.src = chinpiraIcon;

var fps = 1000 / 60;
var mouse = new Point();//マウスの位置
var ctx;


//主人公インスタンス
var hero = new Boxer(10,"ゴールデン・右の助",'./img/hero/img.png','./img/hero/foot1.png',
'./img/hero/foot2.png','./img/hero/punch1.png','./img/hero/punch2.png',
'./img/hero/win.png','./img/hero/lose.png');
hero.init(150,200);

var losehero = new Image();
var loseheroIcon = hero.lose;
losehero.src = loseheroIcon;

//ダミーのてきインスタンス
var rival = new Rival(10,"ドチンピラ太郎",'./img/chinpira/img.png','./img/chinpira/foot.png',
'./img/hero/foot2.png','./img/hero/punch1.png','./img/hero/punch2.png',
'./img/chinpira/win.png','./img/chinpira/lose.png');
rival.init(150,200);
rival.set(0);

var winrival = new Image();
var winrivalIcon = rival.win;
winrival.src = winrivalIcon;




// - main処理。 ---------------------------------------------------------------------

window.onload = function(){ 
    // スクリーンの初期化
    screenCanvas = document.getElementById('screen');
    screenCanvas.width = 778;
    screenCanvas.height = 576;
    //2dコンテキスト
    ctx = screenCanvas.getContext('2d');
    ctx.globalAlpha = 1;
    // イベントの登録
    screenCanvas.addEventListener('mousemove', mouseMove, true);
    screenCanvas.addEventListener('mousedown', mouseDown, true);
    window.addEventListener('keydown', keyDown, true);
    console.log(screenCanvas);

    // エレメント関連
    info = document.getElementById('info');
    //この中でメインの動きをループさせる。
    setInterval("battle_moment()", fps);
};






// - event メソッド--------------------------------------------------------------------

//マウスカーソル座標の更新
function mouseMove(event){
    mouse.x = event.clientX - screenCanvas.offsetLeft;
    mouse.y = event.clientY - screenCanvas.offsetTop;
}
function mouseDown(){
    // バトル中のみフラグを立てる
    if(battle == true){
    fire = true;
    //console.log("パンチ！" + fire);
    }
}

//キーボード操作
function keyDown(event){
    // キーコードを取得
    var ck = event.keyCode;
    //タイトル画面でenter
    if(ck ===　13 && title == true){
        $('.main-start').css("transform", "scale(1.1)");
        changeScene();//スタートモードに変わる
    }else if(ck ===　13 && start == true){
        $('.main-start').text("負けんなよ！");
        $('.canvas').css("background-image","url(./img/ling.png)");//リングにかえる
        //バトルモードに変わる
        ctx.clearRect(0,0,screenCanvas.width,screenCanvas.height);
        drawReadtext("Ready...",screenCanvas.width/2,screenCanvas.height/2,300);
        setTimeout("ctx.clearRect(0,0,screenCanvas.width,screenCanvas.height)"
        ,1500);
        setTimeout("drawReadtext('Go！！！',screenCanvas.width/2,screenCanvas.height/2,300)"
        ,2500);
        setTimeout("changeScene()", 3000);
        //止め、パターン１
    }else if(ck ===　13 && finish == true && finishpunch == 0){
        document.getElementById( 'sound-punch' ).play();
        document.getElementById( 'sound-endgong' ).play();
        changeScene();
        console.log("ED1"); 
        ctx.clearRect(0,0,screenCanvas.width,screenCanvas.height);
        $('.main-start').text("決まったーっギャラクティカなんたらじゃ！！");
        $('.canvas').css("background-color","null");
        $('.canvas').css("background-image","url(./img/hero/finish1.png)");
        $('.canvas').css("background-size","95% auto");
        console.log(win);
        console.log(finish);

        //止め、パターン２
    }else if(ck === 32 && finish == true && finishpunch == 1){
        document.getElementById( 'sound-punch' ).play();
        document.getElementById( 'sound-endgong' ).play();
        changeScene();
        console.log("ED2");
        ctx.clearRect(0,0,screenCanvas.width,screenCanvas.height);
        $('.main-start').text("なんというエネルギーじゃ！");
        $('.canvas').css("background-color","null");
        $('.canvas').css("background-image","url(./img/hero/finish2.png)");
        $('.canvas').css("background-size","95% auto");
        console.log(win);
        console.log(finish);
        //止め、パターン３
    }else if(ck === 79 && finish == true && finishpunch == 2){
        if (countFinishpunch <= 3){
            countFinishpunch++;
        }else{
            document.getElementById( 'sound-punch' ).play();
            document.getElementById( 'sound-endgong' ).play();
            changeScene();
            console.log("ED3");
            ctx.clearRect(0,0,screenCanvas.width,screenCanvas.height);
            $('.main-start').text("やったな！やつめ一週間はメシ食えんぞ");
            $('.canvas').css("background-color","null");
            $('.canvas').css("background-image","url(./img/hero/finish3.png)");
            $('.canvas').css("background-size","95% auto");
            console.log(win);
            console.log(finish);
        }        
    }else if(ck ===　13 && win == true){
        console.log("179");
        changeScene();

    }
    // Escキーが押されていたらフラグを降ろす
    if(ck === 27){battle = false;}
}


//シーンを変更する
function changeScene() {
    //タイトル画面ならenterで最初のstartモードに変更
    if(title == true && finish == false){
        console.log("titleモードです。スタートモードに変えます");
        title = false;
        start = true;

        $('.canvas').css("background-image","none");
        $('.canvas').css("background-color","black");
        $('.main-start').text("");
        ctx.clearRect(0,0,screenCanvas.width,screenCanvas.height);
        setTimeout(() => {
            drawReadtext(hero.name,200,150);
            drawReadtext(rival.name,550,150);
            drawReadtext("VS",screenCanvas.width/2,screenCanvas.height/2,300);
        }, 1000);
        hero.charaDrawImage(hero.sumnail);//hero.sumnailにはurlのみ
        hero.position.x = 165;
        hero.position.y = 200;

        rival.charaDrawImage(rival.sumnail);//hero.sumnailにはurlのみ
        rival.position.x = 500;
        rival.position.y = 200;
        $('.main-start').text("いよいよじゃ！練習の成果をあれするのじゃ(enter押して)");

        $('.main-start').css("animation","none");
        $('.main-start').css("font-size","12px");
        $('.main-jii').css("display","block");

    }else if(start == true) {
        //console.log("startモードです。バトルモードに変えます。");      
        start = false;
        battle = true;
        hero.init(50,75);
        rival.init(50,75);
        $('.main-start').text("マウス左クリックでジャブじゃ！");
        rival.position.x = 600;
        rival.position.y = 50; 
        document.getElementById( 'sound-startgong' ).play();
    }else if(finish == true){
        finish == false;
        win = true;
        
    }else if(win == true){//勝利した後
        ctx.clearRect(0,0,screenCanvas.width,screenCanvas.height);
        console.log("クリア");
        $('.canvas').css("background-image","none");
        $('.canvas').css("background-color","black");
        $('.main-start').text("よくやった！ワシらの戦いはまだ始まったばかりじゃ！！");
        
        setTimeout(() => {
            drawReadtext(hero.name,150,150);
            drawReadtext(rival.name,550,150);
            drawReadtext("You Win!!",screenCanvas.width/2,screenCanvas.height/2,300);
        }, 1000);
        hero.charaDrawImage(hero.win);//hero.sumnailにはurlのみ
        hero.position.x = 165;
        hero.position.y = 200;

        rival.charaDrawImage(rival.Lose);//hero.sumnailにはurlのみ
        rival.position.x = 500;
        rival.position.y = 200;
    }
  }


//テキストの案内を書く処理
function drawReadtext(target,X,Y,Size) {//テキストを任意の箇所に書く
    ctx.fillStyle = "#fff";    
    ctx.font = "30px 'ＭＳ ゴシック'";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    //塗りつぶしのテキストを、座標(x, y)の位置に最大幅200で描画する
    ctx.fillText(target, X, Y, Size);
}

//maxの数字以下の整数をランダムで返す
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}


//最後の戦い
function finishBattle(){
    $('.game-screen').css("background-image","null");
    if(finish == true){
    //console.log("finishだ");
    var temp = getRandomInt(3);
    //console.log(temp);
    $('.main-start').css("font-size","24px");
    ctx.clearRect(0,0,screenCanvas.width,screenCanvas.height);
    ctx.drawImage(chinpiraface,100,100,400,400);  

    switch(temp){
        case 0:
            $('.main-start').text("弱っておる！3秒以内にEnterで右を打ち込め！！");
            $('.main-start').css("font-size","14px");
            finishpunch = 0;
            setTimeout("gameOver()", 3000);
            break;
        case 1:
            $('.main-start').text("今じゃ！3秒以内にスペースキーで右を打ち込め！！");
            $('.main-start').css("font-size","14px");
            finishpunch = 1;
            setTimeout("gameOver()", 3000);
            break;
        case 2:
            $('.main-start').text("ここじゃ!！3秒以内にオー（o）を連打じゃ！");
            $('.main-start').css("font-size","14px");
            finishpunch = 2
            setTimeout("gameOver()", 3000);            
            break;
      }
    }
}


function gameOver(){
    if(win !== true){
    battle = false;
    ctx.clearRect(0,0,screenCanvas.width,screenCanvas.height);
    $('.canvas').css("background-image","url(null)");
    $('.canvas').css("background-color","black");
    drawReadtext("You Lose...!",screenCanvas.width/2,screenCanvas.height/2,400);
    ctx.drawImage(
        losehero,
        200,
        200,
        100,
        150
    );
    ctx.drawImage(
        winrival,
        500,
        200,
        100,
        150
    );
    $('.main-start').css("font-size","12px");
    $('.main-start').text("おお勇者よ！死んでしまうとは何事じゃ！リロードして再チャレンジしよう！");
    document.getElementById( 'sound-endgong' ).play();
    }
}



//バトル中のメインの流れ--------------------ーーーーーーーーーー
function battle_moment(){    
    if(battle　== true){ 


    //まずは現状のショットの収納ーーーーーーーーー
        if(fire){//パンチが打たれていたらコメント
            var temp = getRandomInt(9);
            if(temp == 0){
                $('.main-start').text("いいパンチじゃ！");
            }else if(temp == 1){
                $('.main-start').text("顔のあたり（残りHPのとこ）を殴るのじゃ！");
            }else if(temp == 2){
                $('.main-start').text("思い出せ　あの辛い特訓を！");
            }else if(temp == 3){
                $('.main-start').text("焦るな！時間はまだある！");
            }else if(temp == 4){
                $('.main-start').text("いいね。いい感じジャン。");
            }else if(temp == 5){
                $('.main-start').text("ガンバ！ガンバ！");
            }else if(temp == 6){
                $('.main-start').text("この試合時間制限はないんかな？");
            }else if(temp == 7){
                $('.main-start').text("レフェリーはどこじゃ？");
            }else if(temp == 8){
                $('.main-start').text("なんであいつグラブ投げてんの？");
            }

            for(i = 0; i < CHARA_SHOT_MAX_COUNT; i++){
                // 自機ショットが既にセットされているかチェック
                if(!charaShot[i].alive){
                    // もしなければ自機ショットを新規にセット
                    charaShot[i].set(hero.position.x + 50,hero.position.y-25,5, 3);
                    hero.charaDrawImage(hero.punch1);
                    // ループを抜ける
                    break;
                }
            }
            // フラグを降ろしておく
            fire = false;
        }else{
            ctx.clearRect(0,0,screenCanvas.width,screenCanvas.height);
            hero.charaDrawImage(hero.foot1);
        }   
    //30paramに一度敵の攻撃の設定をセット
    ctx.beginPath();
       if(rival.param % 30 === 0){
        // console.log("敵の攻撃");
        for(j = 0; j < ENEMY_SHOT_MAX_COUNT; j++){
            if(!enemyShot[j].alive){
                p = rival.position.distance(hero.position);
                p.normalize();
                enemyShot[j].set(rival.position, p, 5, 2);
                // 1個出現させたのでループを抜ける
                break;
                }
            }
        }            
  　ctx.closePath();      

//エネミーショット------------------------
ctx.beginPath();
    for(i = 0; i <ENEMY_SHOT_MAX_COUNT; i++){
        // エネミーショットが既に発射されているかチェック
        if(enemyShot[i].alive){
            // エネミーショットを動かす
            enemyShot[i].move();
            // エネミーショットを描くパスを設定
            ctx.drawImage(
                boximg,
                enemyShot[i].position.x,
                enemyShot[i].position.y,
                50,
                50
            );
            // パスをいったん閉じる
            ctx.closePath();
        }
    }
// エネミーショットの色を設定する
ctx.fillStyle = ENEMY_SHOT_COLOR;
// エネミーショットを描く
ctx.fill();

for(es = 0; es < ENEMY_SHOT_MAX_COUNT; es++){
    //エネミーショットの生存フラグをチェック
    if(enemyShot[es].alive){
        //自分とエネミーショットとの距離を計測
        p = hero.position.distance(enemyShot[es].position);
        if(p.length() < hero.size){
            //当たったらダメージを喰らう
            hero.HP--;
            //衝突があったので、パラメータを変更してループを抜ける
            enemyShot[es].alive = false;
            document.getElementById( 'sound-mini-punch' ).play();
            if(hero.HP < 1) {
                gameOver();
                document.getElementById( 'sound-endgong' ).play();
            }
            break;
        }
    }
}

//エネミーショットここまで------------------------


//エネミーの動き------------------------

//ライバルが定期的に動く方向をランダムで変える
if(rival.param % 100 === 0){
    let tempDirection = getRandomInt(5);
    //console.log(tempDirection);
    switch (tempDirection){
        case 0:
            enemy_moveFlg = "left";
            rival.move("left");
            break;
        case 1:
            enemy_moveFlg = "right";
            rival.move("right");
            break;
        case 2:
            enemy_moveFlg = "up";
            rival.move("up");
            break;
        case 3:
            enemy_moveFlg = "down";
            rival.move("down");
            break;
    }
}


//そのままライバルの移動/*
if(enemy_moveFlg == "left"){
    rival.move("left");
    }else if (enemy_moveFlg == "right"){
        rival.move("right");
    }else if (enemy_moveFlg == "up"){
        rival.move("up");
    }else if (enemy_moveFlg == "down"){
        rival.move("down");
}


//パスの設定を開始
ctx.beginPath();
hero.position.x = mouse.x-40;//マウスの中心位置に配置
hero.position.y = mouse.y+145; //heroの高さ分調整
rival.charaDrawImage(rival.foot1);
drawReadtext(rival.HP,rival.position.x + 25,rival.position.y - 20);
drawReadtext(hero.HP,hero.position.x + 25,hero.position.y -20);


//自身のショット
//左クリックしたら玉を打つ-------------------------
for(i = 0; i < CHARA_SHOT_MAX_COUNT; i++){
    // 自機ショットが既に発射されているかチェック
    if(charaShot[i].alive){
        // 自機ショットを動かす
        charaShot[i].move();
        ctx.drawImage(boximg,charaShot[i].position.x - 30,charaShot[i].position.y,50,50);

        // パスをいったん閉じる
        ctx.closePath();
    }
}
// 自分のショットの衝突判定 -----------------------------------------------------------
// すべての自機ショットを調査する
    for(i = 0; i < CHARA_SHOT_MAX_COUNT; i++){
        if(charaShot[i].alive){
            if(rival.HP > 0){
                p = rival.position.distance(charaShot[i].position);
                if(p.length() < rival.size + 15){
                    charaShot[i].alive = false;
                    document.getElementById( 'sound-mini-punch' ).play();
                    rival.HP--;
                    break;//衝突があったのでループを抜ける
                }
            }
            }
        }


    //まとめ
    time++; 
    if(rival.HP < 1){
    ctx.clearRect(0,0,screenCanvas.width,screenCanvas.height);

    finish = true;
    battle = false;
    finishBattle();//finishバトルに移動。
    }
}
};




