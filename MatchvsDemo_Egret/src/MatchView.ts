class MatchView extends eui.UILayer {
    private _roomID: egret.TextField;
    private _player0: egret.TextField;
    private _player1: egret.TextField;
    private _player2: egret.TextField;
    private _isInRoom: boolean = false;

    private _gameUserList:Array<GameUser> = [];

    private _canStartGame:boolean = false;

    private _checkbox:eui.CheckBox = null;

    public constructor(tags?: any) {
        super();
        this.initView(tags);
        this._isInRoom = false;
        Toast.initRes(this, "resource/loading/toast-bg.png");
    }
    private initView(tags?: any): void {
        //使用地图A
        GameData.roomPropertyValue = GameData.roomPropertyType.mapA;
        let roomIdLabel = new egret.TextField();
        roomIdLabel.textColor = 0xffffff;
        roomIdLabel.width = 400;
        roomIdLabel.textAlign = "center";
        roomIdLabel.text = "正在加载...";
        roomIdLabel.size = 24;
        roomIdLabel.x = 172;
        roomIdLabel.y = 80;
        this._roomID = roomIdLabel;
        this.addChild(this._roomID);

        let player0 = new egret.TextField();
        player0.textColor = 0xffffff;
        player0.width = 400;
        player0.textAlign = "center";
        player0.text = "";
        player0.size = 24;
        player0.x = 172;
        player0.y = 100;
        this._player0 = player0;
        this.addChild(this._player0);

        let player1 = new egret.TextField();
        player1.textColor = 0xffffff;
        player1.width = 400;
        player1.textAlign = "center";
        player1.text = "";
        player1.size = 24;
        player1.x = 172;
        player1.y = 120;
        this._player1 = player1;
        this.addChild(this._player1);

        let player2 = new egret.TextField();
        player2.textColor = 0xffffff;
        player2.width = 400;
        player2.textAlign = "center";
        player2.text = "";
        player2.size = 24;
        player2.x = 172;
        player2.y = 140;
        this._player2 = player2;
        this.addChild(this._player2);

        let exitRoom = new eui.Button();
        exitRoom.label = "退出";
        exitRoom.x = 500;
        exitRoom.y = 460;
        exitRoom.width = 240;
        exitRoom.height = 60;
        this.addChild(exitRoom);
        exitRoom.addEventListener(egret.TouchEvent.TOUCH_TAP, this.mbuttonLeaveRoom, this);

        this.addMsResponseListen();

        /**
         * 加入房间的信息
         */
        let info = {name:GameData.gameUser.name,avatar:GameData.gameUser.avatar};
		let infostr = JSON.stringify(info);

        if (GameData.matchType == GameData.randomMatch) {
            mvs.MsEngine.getInstance.joinRandomRoom(GameData.maxPlayerNum,infostr);
        } else if (GameData.matchType == GameData.tagsMatch && tags) {
            //tags {"match1":"12","match2":"match2"} object of key-value 
            let matchinfo: MsMatchInfo = new MsMatchInfo(GameData.maxPlayerNum, 1, 1, tags);
            mvs.MsEngine.getInstance.joinRoomWithProperties(matchinfo,"tagsMatch");
        }

        var checkbox = new eui.CheckBox();
        checkbox.label = "允许加入";
        checkbox.selected = true;
        
        checkbox.addEventListener(egret.Event.CHANGE, e => {
            checkbox.label = checkbox.selected ? "允许加入" : "不允许加入";
            checkbox.selected ? mvs.MsEngine.getInstance.joinOpen("x") : mvs.MsEngine.getInstance.joinOver("x");
        }, this);
        checkbox.x = 50;
        checkbox.y = 50;
        this._checkbox = checkbox;
        this.addChild(checkbox);
    }

    /**
     * 注册监听
     */
    private addMsResponseListen(){
        //加入房间
        mvs.MsResponse.getInstance.addEventListener(mvs.MsEvent.EVENT_JOINROOM_RSP, this.joinRoomResponse,this);
        mvs.MsResponse.getInstance.addEventListener(mvs.MsEvent.EVENT_JOINROOM_NTFY, this.joinRoomNotify,this);

        //关闭房间
        mvs.MsResponse.getInstance.addEventListener(mvs.MsEvent.EVENT_JOINOVER_NTFY, this.joinOverNotify,this);
        mvs.MsResponse.getInstance.addEventListener(mvs.MsEvent.EVENT_JOINOVER_RSP, this.joinOverResponse,this);

        //打开房间
        mvs.MsResponse.getInstance.addEventListener(mvs.MsEvent.EVENT_JOINOPEN_RSP, this.joinOpenResponse,this);
        mvs.MsResponse.getInstance.addEventListener(mvs.MsEvent.EVENT_JOINOPEN_NTFY, this.joinOpenNotify,this);

        //发送消息
        mvs.MsResponse.getInstance.addEventListener(mvs.MsEvent.EVENT_SENDEVENT_RSP, this.sendEventResponse,this);
        mvs.MsResponse.getInstance.addEventListener(mvs.MsEvent.EVENT_SENDEVENT_NTFY, this.sendEventNotify,this);

        //离开房间
        mvs.MsResponse.getInstance.addEventListener(mvs.MsEvent.EVENT_LEAVEROOM_RSP, this.leaveRoomResponse,this);
        mvs.MsResponse.getInstance.addEventListener(mvs.MsEvent.EVENT_LEAVEROOM_NTFY, this.leaveRoomNotify,this);
    }

    /**
     * 取消监听
     */
    public release(){
        mvs.MsResponse.getInstance.removeEventListener(mvs.MsEvent.EVENT_JOINROOM_RSP, this.joinRoomResponse,this);
        mvs.MsResponse.getInstance.removeEventListener(mvs.MsEvent.EVENT_JOINROOM_NTFY, this.joinRoomNotify,this);

        mvs.MsResponse.getInstance.removeEventListener(mvs.MsEvent.EVENT_JOINOVER_NTFY, this.joinOverNotify,this);
        mvs.MsResponse.getInstance.removeEventListener(mvs.MsEvent.EVENT_JOINOVER_RSP, this.joinOverResponse,this);

        mvs.MsResponse.getInstance.removeEventListener(mvs.MsEvent.EVENT_SENDEVENT_RSP, this.sendEventResponse,this);
        mvs.MsResponse.getInstance.removeEventListener(mvs.MsEvent.EVENT_SENDEVENT_NTFY, this.sendEventNotify,this);

        mvs.MsResponse.getInstance.removeEventListener(mvs.MsEvent.EVENT_JOINOPEN_RSP, this.joinOpenResponse,this);
        mvs.MsResponse.getInstance.removeEventListener(mvs.MsEvent.EVENT_JOINOPEN_NTFY, this.joinOpenNotify,this);

        //离开房间
        mvs.MsResponse.getInstance.removeEventListener(mvs.MsEvent.EVENT_LEAVEROOM_RSP, this.leaveRoomResponse,this);
        mvs.MsResponse.getInstance.removeEventListener(mvs.MsEvent.EVENT_LEAVEROOM_NTFY, this.leaveRoomNotify,this);
    }

    /**
     * 退出房间
     */
    private mbuttonLeaveRoom(event: egret.TouchEvent) {
        //如果没有进入房间成功就直接返回游戏大厅界面
        if (this._isInRoom) {
            mvs.MsEngine.getInstance.leaveRoom("累了困了离开一下");
        } else {
            this.release();
            //退出房间成功进入游戏大厅
            GameSceneView._gameScene.lobby();
        }

    }


    /**
     * 他人离开房间回调
     */
    private leaveRoomNotify(ev:egret.Event) {
        let leaveRoomInfo = ev.data;
        if (this._player0.text === leaveRoomInfo.userId.toString()) {
            this._player0.text = '';
        } else if (this._player1.text === leaveRoomInfo.userId.toString()) {
            this._player1.text = '';
        } else if (this._player2.text === leaveRoomInfo.userId.toString()) {
            this._player2.text = '';
        }
    }

    /**
     * 自己离开房间回调
     */
    private leaveRoomResponse(ev:egret.Event) {
        let rsp = ev.data;
        if (rsp.status !== 200) {
            console.log("退出房间失败！status=" + rsp.status);
        } else {
            this.release();
            //退出房间成功进入游戏大厅
            GameSceneView._gameScene.lobby();
        }
    }


    /**
     * 加入房间回调
     * @param {egret.Event} event
     */
    private joinRoomResponse(event:egret.Event) {
        let data = event.data;
        let roomInfo = data.roomInfo;
        let roomuserInfoList = data.userList;
        if (data.status !== 200) {
            console.log("joinRoomResponse,status:" + data.status);
            return;
        }

        this._roomID.text = "房间号:" + roomInfo.roomID;
        this._isInRoom = true;
        GameData.roomID = roomInfo.roomID;
        this._gameUserList = [];
        this._gameUserList.push(GameData.gameUser);
        this.showPlayUser(GameData.gameUser);
        var self = this;
        roomuserInfoList.forEach( (item) =>{
            let user = self.addPlayUser(item.userId,item.userProfile);
            //显示用户
            self.showPlayUser(user);
        });
        console.log('房间用户: ' , this._gameUserList);

        if (this._gameUserList.length >= GameData.maxPlayerNum) {
            this._canStartGame = true;
            var result = mvs.MsEngine.getInstance.joinOver("关闭房间");
            console.log("发出关闭房间的通知");
            if (result !== 0) {
                console.log("关闭房间失败，错误码：", result);
                return;
            }
            GameData.playerUserIds = this._gameUserList;
        }
    }

    private showPlayUser(user:GameUser){
        //自己显示在第一个
        if(user.id == GameData.gameUser.id){
            this._player0.text = user.id+"["+user.name+"]";
        }else{
            if (this._player1.text === '') {
                this._player1.text = user.id+"["+user.name+"]";
            } else if (this._player2.text === '') {
                this._player2.text = user.id +"["+user.name+"]";
            }
        }
    }

    /**
     * 添加并且显示用户
     */
    private addPlayUser(userid:number,userProfile:string):GameUser{
        //先默认为空的
        let userPro = {name:"",avatar:""};

        if(userProfile !== ""){
            userPro = JSON.parse(userProfile);
        }

        let gUser:GameUser = new GameUser;
        gUser.avatar = userPro.avatar;
        gUser.name = userPro.name;
        gUser.id = userid;
        this._gameUserList.push(gUser);
        return gUser;
    }

    /**
     * 加入房间异步回调事件
     */
    private joinRoomNotify(ev:egret.Event) {
        let roomUserInfo = ev.data;
        //获取用户头像和昵称
        let usr = this.addPlayUser(roomUserInfo.userId,roomUserInfo.userProfile);
        this.showPlayUser(usr);
    }

    /**
     * 关闭房间回调事件
     */
    private joinOverResponse(ev:egret.Event) {
        let rsp = ev.data;
        if (rsp.status === 200) {
            console.log("关闭房间成功");
            if(this._canStartGame){
                //开始游戏
                this.notifyGameStart();
            }
        } else {
            console.log("关闭房间失败，回调通知错误码：", rsp.status);
        }
        Toast.show(" 设置不允许房间加人 " + (rsp.status == 200 ? "success" : "fail"));
        this._checkbox.selected = ((rsp.status == 200)?false:this._checkbox.selected);
    }

    /**
     * 关闭房间异步回调
     */
    private joinOverNotify(ev:egret.Event) {
        let notifyInfo = ev.data;
        console.log("userID:" + notifyInfo.srcUserID + " 关闭房间：" + notifyInfo.roomID + " cpProto:" + notifyInfo.cpProto);
        
        Toast.show(notifyInfo.srcUserID + " 设置了不允许房间加人");
        this._checkbox.selected = false;
    }

    /**
     * 开始游戏
     */
    private notifyGameStart() {
        GameData.isRoomOwner = true;
        // let event = {
        //     action: GameData.gameStartEvent,
        //     userIds: GameData.playerUserIds
        // };
        let arrs = [];
        this._gameUserList.forEach((element)=>{
            arrs.push({id:element.id,name:element.name,avatar:element.avatar});
        });

        let event = {
            action: GameData.gameStartEvent,
            userIds: arrs
        };

        /**
         * 发送开始游戏消息
         */
        let result = mvs.MsEngine.getInstance.sendEvent(JSON.stringify(event));
        if (result.result !== 0){
            return console.log('发送游戏开始通知失败，错误码' + result.result);
        }
        
        // 发送的事件要缓存起来，收到异步回调时用于判断是哪个事件发送成功
        GameData.events[result.sequence] = event;
        console.log("发起游戏开始的通知，等待回复");
    }

    private sendEventResponse(ev:egret.Event) {
        let rsp = ev.data;
        if (rsp.status !== 200) {
            return console.log('事件发送失败,status:' + status);
        }

        var event = GameData.events[rsp.sequence]

        if (event && event.action === GameData.gameStartEvent) {
            delete GameData.events[rsp.sequence];
            this.release();
            GameSceneView._gameScene.play();
        }
    }

    private sendEventNotify(ev:egret.Event) {
        let sdnotify = ev.data;
        if (sdnotify
            && sdnotify.cpProto
            && sdnotify.cpProto.indexOf(GameData.gameStartEvent) >= 0) {
            this._gameUserList = [];
            this._gameUserList .push(GameData.gameUser);
            // 通过游戏开始的玩家会把userIds传过来，这里找出所有除本玩家之外的用户ID，
            // 添加到全局变量playerUserIds中
            JSON.parse(sdnotify.cpProto).userIds.forEach((element)=> {
                let gUser:GameUser = new GameUser;
                gUser.avatar = element.avatar;
                gUser.name = element.name;
                gUser.id = element.id;
                if(gUser.id !==GameData.gameUser.id ){
                    this._gameUserList.push(gUser);
                }
            });
            GameData.playerUserIds = this._gameUserList;
            this.release();
            GameSceneView._gameScene.play();
        }
    }

    /**
     * 自己重新打开房间回调
     */
    private joinOpenResponse(ev:egret.Event){
        let d = ev.data;
        Toast.show(" 设置允许房间加人 " + (d.status == 200 ? "success" : "fail"));
        this._checkbox.selected = ((d.status == 200)?true:this._checkbox.selected);
    }

    /**
     * 他人重新打开房间异步
     */
    private joinOpenNotify(ev:egret.Event){
        let d = ev.data;
        Toast.show(d.userID + " 设置了允许房间加人");
        this._checkbox.selected = true;
    }

    
    
}