class LobbyView extends eui.UILayer{

    private _funcButton_W:number = 400;
    private _funcButton_H:number = 60;


    public constructor() {
        super();
		this.initView();
    }
	private initView():void
	{
        let colorLabel = new eui.Label();
        colorLabel.textColor = 0xffffff;
        colorLabel.width = 400;
        colorLabel.textAlign = "center";
        colorLabel.text = "游戏大厅";
        colorLabel.size = 35;
        // colorLabel.x = 120;
        // colorLabel.y = 80;
        colorLabel.horizontalCenter = 0;
        colorLabel.verticalCenter = 0-(4*(this._funcButton_H+10));
        this.addChild(colorLabel);

        let userid = new eui.Label();
        userid.textColor = 0xffffff;
        userid.width = 280;
        userid.textAlign = "left";
        userid.text = "用户："+GameData.gameUser.id+"\n"+GameData.gameUser.name;
        userid.size = 28;
        userid.x = 85;
        userid.y = 40;
        this.addChild(userid);

        let headimg:eui.Image = new eui.Image();
        headimg.x = 20;
        headimg.y = 40;
        headimg.width = 60;
        headimg.height = 60;
        headimg.source = GameData.gameUser.avatar;
        this.addChild(headimg);

        let button = new eui.Button();
        button.label = "随机匹配";
        button.width = this._funcButton_W;
        button.height = this._funcButton_H;
        button.horizontalCenter = 0;
        button.verticalCenter = 0-(3*(this._funcButton_H+10));
        this.addChild(button);
        button.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonClickRandomMatch, this);

        let btnJoinWithProperty = new eui.Button();
        btnJoinWithProperty.label = "自定义属性匹配";
        btnJoinWithProperty.width = this._funcButton_W;
        btnJoinWithProperty.height = this._funcButton_H;
        btnJoinWithProperty.horizontalCenter = 0;
        btnJoinWithProperty.verticalCenter = 0-(2*(this._funcButton_H+10));
        this.addChild(btnJoinWithProperty);
        btnJoinWithProperty.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonClickJoinWithProperty, this);

        let btnCreateroom = new eui.Button();
        btnCreateroom.label = "创建房间";
        btnCreateroom.width = this._funcButton_W;
        btnCreateroom.height = this._funcButton_H;
        btnCreateroom.horizontalCenter = 0;
        btnCreateroom.verticalCenter = 0-((this._funcButton_H+10));
        this.addChild(btnCreateroom);
        btnCreateroom.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonClickCreateRoom, this);

        let btnJoinRoom = new eui.Button();
        btnJoinRoom.label = "显示房间列表";
        btnJoinRoom.width = this._funcButton_W;
        btnJoinRoom.height = this._funcButton_H;
        btnJoinRoom.horizontalCenter = 0;
        btnJoinRoom.verticalCenter = 0;
        this.addChild(btnJoinRoom);
        btnJoinRoom.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonClickJoinRoomList, this);

        let btnJoinRoomSpecial = new eui.Button();
        btnJoinRoomSpecial.label = "加入指定房间";
        btnJoinRoomSpecial.width = this._funcButton_W;
        btnJoinRoomSpecial.height = this._funcButton_H;
        btnJoinRoomSpecial.horizontalCenter = 0;
        btnJoinRoomSpecial.verticalCenter = (this._funcButton_H+10);
        this.addChild(btnJoinRoomSpecial);
        btnJoinRoomSpecial.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonClickJoinRoomSpecial, this);


        let btnFrameSync = new eui.Button();
        btnFrameSync.label = "帧同步";
        btnFrameSync.width = this._funcButton_W;
        btnFrameSync.height = this._funcButton_H;
        btnFrameSync.horizontalCenter = 0;
        btnFrameSync.verticalCenter = 2*(this._funcButton_H+10);
        this.addChild(btnFrameSync);
        btnFrameSync.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonClickFrameSync, this);

        let logOutGame = new eui.Button();
        logOutGame.label = "退出";
        logOutGame.width = this._funcButton_W;
        logOutGame.height = this._funcButton_H;
        logOutGame.horizontalCenter = 0;
        logOutGame.verticalCenter = 3*(this._funcButton_H+10);
        this.addChild(logOutGame);
        logOutGame.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonClicklogOutGame, this);
        
	}
    
    /**
     * 随机加入房间按钮回调
     */
    private onButtonClickRandomMatch(e: egret.TouchEvent) {
        GameData.matchType = GameData.randomMatch;
        GameData.syncFrame = false;
        // GameSceneView._gameScene.match();
	}

    /**
     * 获取房间列表
     */
    private onButtonClickJoinRoomList(e:egret.TouchEvent){
        GameData.matchType = GameData.specialMatch;
        GameData.syncFrame = false;
        GameSceneView._gameScene.showRoomList();
    }

    /**
     * 自定义属性匹配
     */
    private onButtonClickJoinWithProperty(e:egret.TouchEvent){
        GameSceneView._gameScene.tagsMatchView();
        
    }

    /**
     * 创建房间
     */
    private onButtonClickCreateRoom(e:egret.TouchEvent){
        GameSceneView._gameScene.createRoom();
    }

    /**
     * 输入房间号加入房间
     */
    private onButtonClickJoinRoomSpecial(e:egret.TouchEvent){
        GameSceneView._gameScene.joinRoomSpecial();
    }

    /**
     * 帧同步
     */
    private onButtonClickFrameSync(e:egret.TouchEvent){
        console.log("onButtonClickFrameSync")
        GameData.matchType = GameData.randomMatch;
        GameData.syncFrame = true;
        // GameSceneView._gameScene.match();
    }

    private onButtonClicklogOutGame(e:egret.TouchEvent){
        mvs.MsResponse.getInstance.addEventListener(mvs.MsEvent.EVENT_LOGOUT_RSP, this.logoutResponse,this);
        mvs.MsEngine.getInstance.logOut();
    }
    //
    private logoutResponse(ev:egret.Event){
        mvs.MsResponse.getInstance.removeEventListener(mvs.MsEvent.EVENT_LOGOUT_RSP, this.logoutResponse,this);
        let status = ev.data.status;
        if( status !== 200){
            console.log("退出登录失败!");
            return;
        }
        GameSceneView._gameScene.login();
    }

}
