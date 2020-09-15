// - global -------------------------------------------------------------------
var screenCanvas, info;
var title =  true;//タイトル画面
var start = false;//合間の画面
var battle = false;//戦闘中
var finish = false;
var finishpunch = 0;
var countFinishpunch = 0;
var rival = null;//ライバルインスタンスを保管する変数
var time = 0;
var fire = false;//パンチを打っているフラグ
var foot = true;
var enemy_moveFlg = "up";

// - const --------------------------------------------------------------------
var CHARA_SHOT_COLOR = 'rgba(0, 255, 0, 0.75)';
var CHARA_SHOT_MAX_COUNT = 2;//一度に打てるパンチの数

//ショット生成を収納
var charaShot = new Array(CHARA_SHOT_MAX_COUNT);
for(i = 0; i < CHARA_SHOT_MAX_COUNT; i++){
    charaShot[i] = new CharacterPunch();
}


//パンチオブジェクトを生成
var boximg = new Image();
var boxingIcon =　'./img/groobe.png';
boximg.src = boxingIcon;

//ライバルのfinishのときの顔
var chinpiraface = new Image();
var chinpiraIcon = './img/finish.png';
chinpiraface.src = chinpiraIcon;



var fps = 1000 / 90;
var mouse = new Point();
var ctx;



//主人公インスタンス
var hero = new Boxer(10,"ゴールデン・右の助",'./img/hero/img.png','./img/hero/foot1.png',
'./img/hero/foot2.png','./img/hero/punch1.png','./img/hero/punch2.png',
'./img/hero/win.png','./img/hero/lose.png');
hero.init(150,200);

//ダミーのてきインスタンス
var rival = new Rival(10,"ドチンピラ・バリ太郎",'./img/hero/img.png','./img/hero/foot1.png',
'./img/hero/foot2.png','./img/hero/punch1.png','./img/hero/punch2.png',
'./img/hero/win.png','./img/hero/lose.png');
rival.init(150,200);
rival.set(0);
//console.log("ライバル");
//console.log(rival);


// - main ---------------------------------------------------------------------

window.onload = function(){
    
    // スクリーンの初期化
    screenCanvas = document.getElementById('screen');
    screenCanvas.width = 768;
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
    console.log("パンチ！" + fire);
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
        //setTimeout(changeScene, 500);//シーンチェンジ
        ctx.clearRect(0,0,screenCanvas.width,screenCanvas.height);
        setTimeout(() => {
            drawReadtext(hero.name,150,150);
            drawReadtext(rival.name,550,150);
            drawReadtext("VS",screenCanvas.width/2,screenCanvas.height/2,300)
            
        }, 1000);
        hero.charaDrawImage(hero.sumnail);//hero.sumnailにはurlのみ
        hero.position.x = 100;
        hero.position.y = 200;

        rival.charaDrawImage(rival.punch1);//hero.sumnailにはurlのみ
        rival.position.x = 500;
        rival.position.y = 200;
        $('.main-start').text("いよいよじゃ！練習の成果をあれするのじゃ");
        $('.main-start').css("animation","none");
        $('.main-start').css("font-size","16px");
        $('.main-jii').css("display","block");

    }else if(ck ===　13 && start == true){
        document.getElementById( 'sound-startgong' ).play();
        
        changeScene();//バトルモードに変わる
        ctx.clearRect(0,0,screenCanvas.width,screenCanvas.height);
        $('.game-screen').css("background-image","url(./img/ling.png)");
        $('.main-start').text("左クリックでジャブじゃ！当てろ！");
        
    }else if(ck ===　13 && finish == true && finishpunch == 0){
        document.getElementById( 'sound-punch' ).play();
        console.log("ED1");     
    }else if(ck === 32 && finish == true && finishpunch == 1){
        document.getElementById( 'sound-punch' ).play();
        console.log("ED2");
    }else if(ck === 79 && finish == true && finishpunch == 2){
        if (countFinishpunch <= 3){
            countFinishpunch++;
        }else{
            document.getElementById( 'sound-punch' ).play();
            console.log("ED3");
        }
        
    }
    // Escキーが押されていたらフラグを降ろす
    if(ck === 27){battle = false;}
}


//シーンを変更する
function changeScene() {
    if(title == true){//タイトルモードならenterでstartモードに変更
        console.log("titleモードです。スタートモードに変えます");
        $('.canvas').css("background-image","none");
        $('.main-start').text("");
        title = false;
        start = true;

    }else if(start == true) {
        console.log("startモードです。バトルモードに変えます。");
        start = false;
        battle = true;
        hero.init(50,75);
        rival.init(50,75);
        $('.main-start').text("マウス左クリックでジャブじゃ！");
        rival.position.x = 600;
        rival.position.y = 50; 
    }
  }

  //バトルスタートの案内を書く処理
  function drawReadtext(target,X,Y,Size) {//テキストを任意の箇所に書く
    ctx.fillStyle = "#000000";
    ctx.background = 'yellow'
    
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
    console.log("finishだ");
    var temp = getRandomInt(3);
    console.log("数字じゃ");
    console.log(temp);
    $('.main-start').css("font-size","24px");
    ctx.clearRect(0,0,screenCanvas.width,screenCanvas.height);
    ctx.drawImage(chinpiraface,100,100,500,500);
    

    switch(temp){
        case 0:
            $('.main-start').text("今じゃ！Enterで右を打ち込め！！");
            finishpunch = 0;
            break;
        case 1:
            $('.main-start').text("今じゃ！スペースキーで右を打ち込め！！");
            finishpunch = 1;

            break;
        case 2:
            $('.main-start').text("今じゃ！オー（o）を連打じゃ！");
            finishpunch = 2
            break;
      }

    }
}







//バトル中の大きな流れ--------------------ーーーーーーーーーー
function battle_moment(){
    
    if(battle　== true){  
        console.log("バトル中");
        //現状のショットの収納。
        if(fire){
            $('.main-start').text("いいパンチじゃ！");
            for(i = 0; i < CHARA_SHOT_MAX_COUNT; i++){
                // 自機ショットが既に発射されているかチェック
                if(!charaShot[i].alive){
                    // 自機ショットを新規にセット
                    console.log(hero.position);
                    charaShot[i].set(hero.position.x + 50,hero.position.y-25,5, 3);
                    // ループを抜ける
                    break;
                }
            }
            // フラグを降ろしておく
            fire = false;
        }
       ctx.clearRect(0,0,screenCanvas.width,screenCanvas.height);
       hero.charaDrawImage(hero.foot1);

       if(rival.param % 150 === 0){
           console.log("敵の攻撃");
           $('.main-start').text("敵の攻撃じゃ！");
       }

       if(rival.param % 100 === 0){
            let tempDirection = getRandomInt(5);
            console.log(tempDirection);
            switch (tempDirection){
                case 0:
                    enemy_moveFlg = "left";
                    break;
                case 1:
                    enemy_moveFlg = "right";
                    break;
                case 2:
                    enemy_moveFlg = "up";
                    break;
                case 3:
                    enemy_moveFlg = "down";
                    break;
            }

       }
        
        //パスの設定を開始
        ctx.beginPath();
        hero.position.x = mouse.x-50;//マウスの中心位置に配置
        hero.position.y = mouse.y-50;

        rival.charaDrawImage(rival.win);
        drawReadtext(rival.HP,rival.position.x,rival.position.y - 20);

        drawReadtext(hero.HP,hero.position.x,hero.position.y -20);
        if(enemy_moveFlg == "left"){
            rival.move("left");
        }else if (enemy_moveFlg == "right"){
            rival.move("right");
        }else if (enemy_moveFlg == "up"){
            rival.move("up");
        }else if (enemy_moveFlg == "down"){
            rival.move("down");
        }
        //console.log(rival.param);

        //左クリックしたら------------
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
        // 自機ショットの色を設定する
        ctx.fillStyle = CHARA_SHOT_COLOR;
        // 自機ショットを描く
        ctx.fill();

        // 衝突判定 -----------------------------------------------------------
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
        time++; 
        if(rival.HP < 1){
        ctx.clearRect(0,0,screenCanvas.width,screenCanvas.height);

        finish = true;
        battle = false;
        finishBattle();
        }
    }
};




