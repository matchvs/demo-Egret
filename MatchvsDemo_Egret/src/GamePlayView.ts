class GamePlayView extends egret.DisplayObjectContainer{
	private _egretBird0:egret.Bitmap;
	private _egretBird1:egret.Bitmap;
	private _egretBird2:egret.Bitmap;
	private _star:egret.Bitmap;
	private _starObject:egret.DisplayObject;
	private _score:number;
	private _scoreLabel:eui.Label;
	private _delayLabel:eui.Label;
	private _minDelayValue:number;
	private _maxDelayValue:number;
	private _receiveCountValue:number;
	private _receiveMsgCountLabel:eui.Label;
	private _countDownLabel:eui.Label;
	private _netWorkNoticeLabel:eui.Label;

	private _fontSize = 22;
	constructor() {
		super();
		this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
	}
	private onAddToStage(event:egret.Event){
		GameData.width = this.stage.stageWidth;
		GameData.height = this.stage.stageHeight;
		this.startLoad();
	}
	private startLoad():void {
		GameData.starPositionX = 0;
		GameData.response.sendEventNotify = this.sendEventNotify.bind(this);
		GameData.response.networkStateNotify = this.networkStateNotify.bind(this);

        if (GameData.syncFrame === true && GameData.isRoomOwner === true) {
            GameData.response.setFrameSyncResponse = this.setFrameSyncResponse.bind(this);
            var result = GameData.engine.setFrameSync(GameData.frameRate);
            if (result !== 0){
				console.log('设置帧同步率失败,错误码:' + result);
			}
        }

		GameData.userScoreAll = [];
		GameData.isGameOver = false;
		this._score = 0;
		this._receiveCountValue = 0;

		var image = new  eui.Image();
		image.source = "resource/assets/Game/gamebackground.jpg";
		image.height = GameData.height;
		image.width = GameData.width;
		this.addChild(image);

		if(GameData.roomPropertyValue === GameData.roomPropertyType.mapB){
			var colorMatrix = [
			0.3,0.6,0,0,0,
			0.3,0.6,0,0,0,
			0.3,0.6,0,0,0,
			0,0,0,1,0
			];
			var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
			image.filters = [colorFlilter];
		}
        let userIdLabel = new eui.Label();
        userIdLabel.textColor = 0xffffff;
        userIdLabel.fontFamily = "Tahoma";  //设置字体
		userIdLabel.text = "用户id:" + GameData.userInfo.id;
		userIdLabel.size = this._fontSize;
        userIdLabel.x = 20;
        userIdLabel.y = 20;
        this.addChild(userIdLabel);

        let roomIdLabel = new eui.Label();
        roomIdLabel.textColor = 0xffffff;
        roomIdLabel.fontFamily = "Tahoma";  //设置字体
		roomIdLabel.text = "房间号:" + GameData.roomID;
		roomIdLabel.size = this._fontSize;
        roomIdLabel.x = 20;
        roomIdLabel.y = 60;
        this.addChild(roomIdLabel);

        let scoreLabel = new eui.Label();
        scoreLabel.textColor = 0xffffff;
        scoreLabel.fontFamily = "Tahoma";  //设置字体
		scoreLabel.size = this._fontSize;
        scoreLabel.x = 20;
        scoreLabel.y = 100;
		this._scoreLabel = scoreLabel;
        this.addChild(this._scoreLabel);

        let delayLabel = new eui.Label();
        delayLabel.textColor = 0xffffff;
        delayLabel.fontFamily = "Tahoma";  //设置字体
		delayLabel.size = this._fontSize;
        delayLabel.x = 20;
        delayLabel.y = GameData.height - 200;
		this._delayLabel = delayLabel;
        this.addChild(this._delayLabel);		

        let receiveMsgCountLabel = new eui.Label();
        receiveMsgCountLabel.textColor = 0xffffff;
        receiveMsgCountLabel.fontFamily = "Tahoma";  //设置字体
		receiveMsgCountLabel.size = this._fontSize;
        receiveMsgCountLabel.x = 20;
        receiveMsgCountLabel.y = GameData.height - 80;
		this._receiveMsgCountLabel = receiveMsgCountLabel;
        this.addChild(this._receiveMsgCountLabel);		

        let countDownLabel = new eui.Label();
        countDownLabel.textColor = 0xffffff;
        countDownLabel.fontFamily = "Tahoma";  //设置字体
		countDownLabel.size = this._fontSize;
        countDownLabel.x = GameData.width/2;
        countDownLabel.y = 20;
		countDownLabel.text = GameData.playerTime.toString();
		this._countDownLabel = countDownLabel;
        this.addChild(this._countDownLabel);

		let netWorkNoticeLabel = new eui.Label();
        netWorkNoticeLabel.textColor = 0xff0000;
        netWorkNoticeLabel.fontFamily = "Tahoma";  //设置字体
		netWorkNoticeLabel.size = this._fontSize;
        netWorkNoticeLabel.x = GameData.width/2;
        netWorkNoticeLabel.y = 50;
		netWorkNoticeLabel.text = "";
		this._netWorkNoticeLabel = netWorkNoticeLabel;
        this.addChild(this._netWorkNoticeLabel);	

		if(GameData.syncFrame === true){
			let fs = new eui.Label();
			fs.textColor = 0xffffff;
			fs.fontFamily = "Tahoma";  //设置字体
			fs.size = this._fontSize;
			fs.text = "FrameRate:"+GameData.frameRate.toString();
			fs.x = GameData.width-200;
			fs.y = 20;
			this.addChild(fs);
		}

		this.initUserScore();

		if (GameData.isRoomOwner == true) {
			this.createStarFirst();
		}

		var loader:egret.ImageLoader = new egret.ImageLoader();
		loader.addEventListener(egret.Event.COMPLETE, this.onLoadComplete, this);
		var url:string = "resource/assets/Game/cartoon-egret_01.png";
		loader.load(url);

		var loader2:egret.ImageLoader = new egret.ImageLoader();
		loader2.addEventListener(egret.Event.COMPLETE, this.onLoadComplete2, this);
		var url:string = "resource/assets/Game/cartoon-egret_02.png";
		loader2.load(url);

		var loader3:egret.ImageLoader = new egret.ImageLoader();
		loader3.addEventListener(egret.Event.COMPLETE, this.onLoadComplete3, this);
		var url:string = "resource/assets/Game/cartoon-egret_03.png";
		loader3.load(url);
	
	}

	private initUserScore() {
		var i:number = 0;
		for(i = 0; i < GameData.playerUserIds.length; i++) {
			var userScore = {
				userID: GameData.playerUserIds[i],
				score: 0,
			};
			GameData.userScoreAll.push(userScore);
		}
		this.setScoreLabel();
	}

	private setUserScore(userID:number, score:number) {
		var isFind:boolean = false;
		var i:number = 0;
		for(i = 0; i < GameData.userScoreAll.length; i++) {
			if (GameData.userScoreAll[i].userID == userID) {
				isFind = true;
				GameData.userScoreAll[i].score = score;
				break;
			}
		}
		if (isFind == false) {
			var userScore = {
				userID: userID,
				score: score,
			};
			GameData.userScoreAll.push(userScore);
		}
		this.bubbleSort();
		this.setScoreLabel();
	}

	private setScoreLabel() {
		GameData.number1 = GameData.userScoreAll[0].userID + ': ' + GameData.userScoreAll[0].score;
		GameData.number2 = GameData.userScoreAll[1].userID + ': ' + GameData.userScoreAll[1].score;
		GameData.number3 = GameData.userScoreAll[2].userID + ': ' + GameData.userScoreAll[2].score;
		this._scoreLabel.text = GameData.number1 + "\n" + GameData.number2 + "\n" + GameData.number3;
	}

    private bubbleSort() {
        var len = GameData.userScoreAll.length;
        for (var i = 0; i < len; i++) {
            for (var j = 0; j < len - 1 - i; j++) {
                if (GameData.userScoreAll[j].score > GameData.userScoreAll[j+1].score) {        //相邻元素两两对比
                    var temp = GameData.userScoreAll[j+1];        //元素交换
                    GameData.userScoreAll[j+1] = GameData.userScoreAll[j];
                    GameData.userScoreAll[j] = temp;
                }
            }
        }
    }

	private setFrameSyncResponse(rsp:MsSetChannelFrameSyncRsp) {
		console.log("setFrameSyncResponse:mStatus="+rsp.mStatus);
		if(rsp.mStatus == 200) {
			console.log("设置帧同步率成功");
		} else {
			console.log("设置帧同步率失败");
		}
	}

	private onLoadComplete(event:egret.Event):void {
		var loader:egret.ImageLoader = <egret.ImageLoader>event.target;
		var bitmapData:egret.BitmapData = loader.data;
		var texture = new egret.Texture();
		texture.bitmapData = bitmapData;
		this._egretBird0 = new egret.Bitmap(texture);
        this._egretBird0.anchorOffsetX = this._egretBird0.width/2;
        this._egretBird0.anchorOffsetY = this._egretBird0.height/2;
        this._egretBird0.x = this.stage.stageWidth/2;
        this._egretBird0.y = GameData.defaultHeight;
		this._egretBird0.name = GameData.playerUserIds[0].toString();
        this.addChild(this._egretBird0);		

        let buttonLeft = new eui.Button();
        buttonLeft.label = "按住滑动往左跑";
        buttonLeft.x = 300;
        buttonLeft.y = this.stage.stageHeight - 100;
		buttonLeft.width = 350;
        this.addChild(buttonLeft);
		buttonLeft.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onButtonClickLeft, this);	

        let buttonRight = new eui.Button();
        buttonRight.label = "按住滑动往右跑";
        buttonRight.x = this.stage.stageWidth- 450;
        buttonRight.y = this.stage.stageHeight - 100;
		buttonRight.width = 350;
        this.addChild(buttonRight);
		buttonRight.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onButtonClickRight, this);

		GameData.response.leaveRoomNotify = this.leaveRoomNotify.bind(this);
        let buttonLeave = new eui.Button();
        buttonLeave.label = "离开游戏";
        buttonLeave.x = this.stage.stageWidth - 120;
        buttonLeave.y = this.stage.stageHeight - 50;
        this.addChild(buttonLeave);
		buttonLeave.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonLeaveRoom, this);

		//计时
		var idCountDown = setInterval(() => {
			this._countDownLabel.text = (Number(this._countDownLabel.text) - 1).toString();
			if(this._countDownLabel.text == "0") {
				GameData.isGameOver = true;
				GameSceneView._gameScene.showResult();
			}
			if (GameData.isGameOver === true) {
				clearInterval(idCountDown);
			}
		}, 1000);

		GameData.intervalList.push(idCountDown);

		//发送位置信息
        if (GameData.syncFrame === false) {
			GameData.response.sendEventNotify = this.sendEventNotify.bind(this);
            var id = setInterval(() => {
                GameData.engine.sendEventEx(0, JSON.stringify({
                    action: GameData.playerPositionEvent,
					x: this._egretBird0.x,
					y: GameData.defaultHeight,
                    ts: new Date().getTime(),
					uid: GameData.userInfo.id
                }), 0, GameData.playerUserIds);
                if (GameData.isGameOver === true) {
                    clearInterval(id);
                }
            }, 200);
			GameData.intervalList.push(id);
        } else {
			GameData.response.sendEventNotify = this.sendEventNotify.bind(this);
			GameData.response.frameUpdate = this.frameUpdate.bind(this);
            var id = setInterval(() => {
                GameData.engine.sendFrameEvent(JSON.stringify({
                    action: GameData.playerPositionEvent,
					x: this._egretBird0.x,
					y: GameData.defaultHeight,
                    ts: new Date().getTime(),
					uid: GameData.userInfo.id
                }));
                if (GameData.isGameOver === true) {
                    clearInterval(id);
                }
            }, 200);
			GameData.intervalList.push(id);
		}
	}
	private leaveRoomNotify(roomId:string, roomuserinfo:MsRoomUserInfo) {
		GameData.isGameOver = true;
		GameSceneView._gameScene.showResult();
	}
	private onLoadComplete2(event:egret.Event):void {
		var loader:egret.ImageLoader = <egret.ImageLoader>event.target;
		var bitmapData:egret.BitmapData = loader.data;
		var texture = new egret.Texture();
		texture.bitmapData = bitmapData;
		this._egretBird1 = new egret.Bitmap(texture);
        this._egretBird1.anchorOffsetX = this._egretBird1.width/2;
        this._egretBird1.anchorOffsetY = this._egretBird1.height/2;
        this._egretBird1.x = this.stage.stageWidth/2;
        this._egretBird1.y = GameData.defaultHeight;
		this._egretBird1.name = GameData.playerUserIds[1].toString();
        this.addChild(this._egretBird1);
	}
	private onLoadComplete3(event:egret.Event):void {
		var loader:egret.ImageLoader = <egret.ImageLoader>event.target;
		var bitmapData:egret.BitmapData = loader.data;
		var texture = new egret.Texture();
		texture.bitmapData = bitmapData;
		this._egretBird2 = new egret.Bitmap(texture);
        this._egretBird2.anchorOffsetX = this._egretBird2.width/2;
        this._egretBird2.anchorOffsetY = this._egretBird2.height/2;
        this._egretBird2.x = this.stage.stageWidth/2;
        this._egretBird2.y = GameData.defaultHeight;
		this._egretBird2.name = GameData.playerUserIds[2].toString();
        this.addChild(this._egretBird2);
	}
	private processStar() {
		var length:number = Math.abs(this._egretBird0.x - this._star.x);
		console.log("length:" + length);
		if (length <= (this._star.width + this._egretBird0.width)/2) {
			this._score++;
			this.setUserScore(GameData.userInfo.id, this._score);

			var newX:number = 0;
			newX = Math.random() * this.stage.width;
			this.changeStarPosition(newX, GameData.defaultHeight);
			var eventTemp = {
				action: GameData.changeStarEvent,
				x: this._star.x,
				y: GameData.defaultHeight,
				score: this._score,
			}
			var result = GameData.engine.sendEvent(JSON.stringify(eventTemp));
			if (!result || result.result !== 0)
				return console.log('足球位置变更事件发送失败:' + JSON.stringify(result));			
		}
	}
    private onButtonClickLeft(e: egret.TouchEvent) {
		//console.log("onButtonClickLeft");
		if(this._egretBird0.x <= 0){
			this._egretBird0.x = 0;
		}else{
			this._egretBird0.x -= 20;
		}
		
		this.processStar();
	}
    private onButtonClickRight(e: egret.TouchEvent) {
		//console.log("onButtonClickRight");
		if(this._egretBird0.x >= GameData.width){
			this._egretBird0.x = GameData.width;
		}else{
			this._egretBird0.x += 20;
		}
		
		this.processStar();
	}
	private onButtonLeaveRoom(e: egret.TouchEvent) {
		//console.log("onButtonLeaveRoom");
		GameData.engine.leaveRoom('');
		GameSceneView._gameScene.lobby();
		GameData.isGameOver = true;
		GameData.isRoomOwner = false;
		GameData.syncFrame = false;
	}
	private createStar() {
		var loader:egret.ImageLoader = new egret.ImageLoader();
		loader.addEventListener(egret.Event.COMPLETE, this.onLoadStar, this);
		var url:string = "resource/assets/Game/star1.png";
		loader.load(url);
	}
	private createStarFirst() {
		var loader:egret.ImageLoader = new egret.ImageLoader();
		loader.addEventListener(egret.Event.COMPLETE, this.onLoadStarFirst, this);
		var url:string = "resource/assets/Game/star1.png";
		loader.load(url);
	}	
	private onLoadStarFirst(event:egret.Event):void {
		GameData.starPositionX = Math.random() * this.stage.width;
		GameData.starPositionY = GameData.defaultHeight;		
		var loader:egret.ImageLoader = <egret.ImageLoader>event.target;
		var bitmapData:egret.BitmapData = loader.data;
		var texture = new egret.Texture();
		texture.bitmapData = bitmapData;
		this._star = new egret.Bitmap(texture);
        this._star.anchorOffsetX = this._star.width/2;
        this._star.anchorOffsetY = this._star.height/2;
		this._star.x = GameData.starPositionX;
        this._star.y = GameData.starPositionY;
        this._starObject = this.addChild(this._star);
		if (GameData.isRoomOwner === true) {
			var eventTemp = {
				action: GameData.newStarEvent,
				x: this._star.x,
				y: GameData.defaultHeight
			}
			var result = GameData.engine.sendEvent(JSON.stringify(eventTemp));
			if (!result || result.result !== 0) {
				return console.log('创建足球事件发送失败');
			}
			console.log('创建足球事件发送成功');
		}
	}	
	private onLoadStar(event:egret.Event):void {	
		var loader:egret.ImageLoader = <egret.ImageLoader>event.target;
		var bitmapData:egret.BitmapData = loader.data;
		var texture = new egret.Texture();
		texture.bitmapData = bitmapData;
		this._star = new egret.Bitmap(texture);
        this._star.anchorOffsetX = this._star.width/2;
        this._star.anchorOffsetY = this._star.height/2;
		this._star.x = GameData.starPositionX;
        this._star.y = GameData.starPositionY;
        this._starObject = this.addChild(this._star);
		// if (GameData.isRoomOwner === true) {
		// 	var eventTemp = {
		// 		action: GameData.newStarEvent,
		// 		x: this._star.x,
		// 		y: GameData.defaultHeight
		// 	}
		// 	var result = GameData.engine.sendEvent(JSON.stringify(eventTemp));
		// 	if (!result || result.result !== 0)
		// 		return console.log('创建足球事件发送失败');
		// }
	}
	private deleteStar() {
		if(this.contains(this._star)){
			this.removeChild(this._star);
		}
	}
	private changeStarPosition(x:number, y:number) {
		this._star.x = x;
		this._star.y = y;
	}

	private sendEventNotify(sdnotify:MsSendEventNotify) {
		//console.log("sendEventNotify:" + JSON.stringify(sdnotify));
        if (sdnotify && sdnotify.cpProto) {
            if (sdnotify.cpProto.indexOf(GameData.newStarEvent) >= 0) {
				if(sdnotify.srcUserId != GameData.userInfo.id) {
					//console.log("new star event");
					var info = JSON.parse(sdnotify.cpProto);
					GameData.starPositionX = info.x;
					GameData.starPositionY = info.y;
					this.deleteStar();
					this.createStar();
				}
            } else if (sdnotify.cpProto.indexOf(GameData.playerPositionEvent) >= 0) {
                // 收到其他玩家的位置速度加速度信息，根据消息中的值更新状态
                this._receiveCountValue++;
				this._receiveMsgCountLabel.text = "receive msg count: " + this._receiveCountValue;
                var cpProto = JSON.parse(sdnotify.cpProto);
                
                if (sdnotify.srcUserId == GameData.userInfo.id) {
                    var delayValue = new Date().getTime() - cpProto.ts;
                    if (this._minDelayValue === undefined || delayValue < this._minDelayValue) {
                        this._minDelayValue = delayValue;
                    }
                    if (this._maxDelayValue === undefined || delayValue > this._maxDelayValue) {
                        this._maxDelayValue = delayValue;
                    }
					this._delayLabel.text = "delay: " + delayValue + "\n" + "minDelay: " + this._minDelayValue + "\n" + "maxDelay: " + this._maxDelayValue; 
                } else {
					//console.log("cpProto=" + JSON.stringify(cpProto) + " name1=" + this._egretBird1.name + "name2=" + this._egretBird2.name);
					if (this._egretBird1.name == cpProto.uid) {
						this._egretBird1.x = cpProto.x;
						this._egretBird1.y = cpProto.y;
					} else if (this._egretBird2.name == cpProto.uid) {
						this._egretBird2.x = cpProto.x;
						this._egretBird2.y = cpProto.y;
					}
                }
            } else if (sdnotify.cpProto.indexOf(GameData.reconnectStartEvent) >= 0) {
				var info = JSON.parse(sdnotify.cpProto);
				if(info.userID === GameData.userInfo.id && GameData.starPositionX === 0) {
					GameData.starPositionX = info.x;
					GameData.starPositionY = info.y;
					GameData.userScoreAll = info.PlayerScoreInfos;
					let self = this;
					GameData.userScoreAll.forEach(function(value){
						if(value.userID === info.userID){
							self._score = value.score;
						}
					});
					this._countDownLabel.text = info.timeCount;
					this.deleteStar();
					this.createStar();
					this.setScoreLabel();
				}
			} else if (sdnotify.cpProto.indexOf(GameData.changeStarEvent) >= 0) {
				if(sdnotify.srcUserId != GameData.userInfo.id) {
					var info = JSON.parse(sdnotify.cpProto);
					this.changeStarPosition(info.x, info.y);
					this.setUserScore(sdnotify.srcUserId, info.score);
				}
			}else if(sdnotify.cpProto.indexOf(GameData.reconnectReadyEvent) >= 0){
				console.log("重新连接收到消息");
				var eventTemp = {
					action: GameData.reconnectStartEvent,
					userID: sdnotify.srcUserId,
					PlayerScoreInfos:GameData.userScoreAll,
					timeCount:Number(this._countDownLabel.text),
					x: this._star.x,
					y: GameData.defaultHeight
				}
				var result = GameData.engine.sendEvent(JSON.stringify(eventTemp));
				if (!result || result.result !== 0) {
					return console.log('重连创建足球事件发送失败');
				}
				console.log('重连创建足球事件发送成功');
			}
        }
	}

	private frameUpdate(data:MsFrameData) {
		for (var i = 0 ; i < data.frameItems.length; i++) {
			var info:MsFrameItem = data.frameItems[i];
			if (info.cpProto.indexOf(GameData.playerPositionEvent) >= 0) {
					// 收到其他玩家的位置速度加速度信息，根据消息中的值更新状态
					this._receiveCountValue++;
					this._receiveMsgCountLabel.text = "receive msg count: " + this._receiveCountValue;
					var cpProto = JSON.parse(info.cpProto);
					
					if (info.srcUserID == GameData.userInfo.id) {
						var delayValue = new Date().getTime() - cpProto.ts;
						if (this._minDelayValue === undefined || delayValue < this._minDelayValue) {
							this._minDelayValue = delayValue;
						}
						if (this._maxDelayValue === undefined || delayValue > this._maxDelayValue) {
							this._maxDelayValue = delayValue;
						}
						this._delayLabel.text = "delay: " + delayValue + "\n" + "minDelay: " + this._minDelayValue + "\n" + "maxDelay: " + this._maxDelayValue; 
					} else {
						//console.log("cpProto=" + JSON.stringify(cpProto) + " name1=" + this._egretBird1.name + "name2=" + this._egretBird2.name);
						if (this._egretBird1.name == cpProto.uid) {
							this._egretBird1.x = cpProto.x;
							this._egretBird1.y = cpProto.y;
						} else if (this._egretBird2.name == cpProto.uid) {
							this._egretBird2.x = cpProto.x;
							this._egretBird2.y = cpProto.y;
						}
					}
			}
		}
	}


	private networkStateNotify(netnotify:MsNetworkStateNotify){
		
		console.log("玩家："+netnotify.userID+" state:"+netnotify.state);
		if(netnotify.state === 1){
			this._netWorkNoticeLabel.text = "玩家掉线:"+netnotify.userID;
			console.log("玩家掉线:"+netnotify.userID);
		}else if(netnotify.state === 2 ){
			console.log("玩家已经重连进来");
			this._netWorkNoticeLabel.text = "";
		}else{
			console.log("玩家："+ netnotify.userID+" 重新连接失败！离开房间，游戏结束");
			GameData.engine.leaveRoom('');
			GameSceneView._gameScene.lobby();
			GameData.isGameOver = true;
			GameData.isRoomOwner = false;
			GameData.syncFrame = false;
		}

	}
}