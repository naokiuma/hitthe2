class Boxer{
    constructor (HP,name,sumnail,foot1,foot2,punch1,punch2,win,lose){
        
      this.position = new Point();
      this.sizeX = 0;
      this.sizeY = 0;
      this.size = 15;
      this.HP = HP;
      this.name = name;
      this.sumnail = sumnail;
      this.foot1 =foot1;
      this.foot2 = foot2;
      this.punch1 = punch1;
      this.punch2 = punch2;
      this.win = win;
      this.lose = lose;
      const img = new Image()
      this.img = img      
      img.onload = () => this.charaDrawImage()
    }
  //インスタンスのサイズを決める
   init(sizeX,sizeY){
     //console.log("init.サイズ");
      this.sizeX = sizeX;
      this.sizeY = sizeY;
  };


    //画像を書く
    charaDrawImage(targetimg) {
      this.img.src = targetimg;
        ctx.drawImage(this.img,this.position.x,this.position.y,this.sizeX,this.sizeY);
    }

}

class Rival extends Boxer{
  constructor(HP,name,sumnail,foot1,foot2,punch1,punch2,win,lose) {
    super(HP,name,sumnail,foot1,foot2,punch1,punch2,win,lose)
    this.position = new Point();
    this.sizeX = 0;
    this.sizeY = 0;
    this.type = 0;
    this.param = 0;
    this.size = 15;
    this.alive = true;
  }

  set(type){
    // タイプをセット
    this.type = type;
    // パラメータをリセット
    this.param = 0;
    // 生存フラグを立てる
    this.alive = true;
  }

  move(direction){
      // パラメータをインクリメント
    this.param++;
      // タイプに応じて分岐
    
    switch(direction){
        case "left":
            // X 方向へまっすぐ進む
            this.position.x -= 5;
            if(this.position.x <= 25){
              enemy_moveFlg = "right";
            }
            break;
        case "right":
            // マイナス X 方向へまっすぐ進む
            this.position.x += 5;
            if(this.position.x >= 700){
              enemy_moveFlg = "left";
            }
            break;
        case "up":
          //  -Y 方向へまっすぐ進む
          this.position.y -= 5;
          if(this.position.y <= 100){
            enemy_moveFlg = "down";
          }
          break;
        case "down":
          //  y 方向へまっすぐ進む
          this.position.y += 5;
          if(this.position.y >= 500){
            enemy_moveFlg = "up";
          }
          break;
          
      }
      
  }

}
 

//--------------ショットの処理ーーーーーーーーーーーーーーーーーーーーーーーー

function CharacterPunch(){
  this.position = new Point();
  this.size = 0;
  this.speed = 0;
  this.alive = false;
}

//作成処理
CharacterPunch.prototype.set = function(px,py,size,speed){//引数の一つ目はヒーローのポジション
  this.position.x = px;
  this.position.y = py;
  this.size = size;
  this.speed = speed;
  this.shotTime = 0;

  //生存フラグを立てる
  this.alive = true;

};

CharacterPunch.prototype.move = function(){
  //座標を真上に移動させる
  this.position.y -= this.speed;
  this.shotTime++;
  //console.log("move");

    // 一定以上の座標に到達していたら生存フラグを降ろす
    //if(this.position.y < this.position.y - 100){
      if(this.shotTime >= 15){
      this.alive = false;
  }
};


//--------------敵のショットの処理ーーーーーーーーーーーーーーーーーーーーーーーー

function EnemyShot(){
  this.position = new Point();
  this.positionvector = new Point();
}

