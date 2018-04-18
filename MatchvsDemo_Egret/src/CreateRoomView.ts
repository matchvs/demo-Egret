/**
 * 创建房间界面,创建房间调用 doCreateRoom()
 * 加入指定的房间 调用  doJoinRoomSpecial(...)
 */
class CreateRoomView extends egret.DisplayObjectContainer{
    private _UserHeadradius = 60;
    private _parent:egret.DisplayObjectContainer;
    private _roomidText:eui.Label;
    private _SizeWith :number = 400;

    private _isInRoom:boolean = false;
    private _isOwner:boolean = false;

    private _createRoomInfo:MsCreateRoomInfo;
    private _startGameButton:eui.Button;
    
    private _userHeard1:egret.Sprite;
    private _userHeard2:egret.Sprite;
    private _userHeard3:egret.Sprite;

    private _imgHead1:egret.ImageLoader;
    
    private _userID_ptext = "待加入";
    private _userID_1:eui.Label;
    private _userID_2:eui.Label;
    private _userID_3:eui.Label;

    private _kickUserID:string;     //被踢掉的用户ID
    private _kickUserButton2:eui.Button;
    private _kickUserButton3:eui.Button;

    private _allgameReady:Array<boolean> = [false];
    private _roomRealUserNum:number = 0;  //房间玩家数量
    public  _userIds = [];

    constructor( pr?: egret.DisplayObjectContainer){
        super();
        if(pr){
            this._parent = pr;
            this._SizeWith = this._parent.x+this._parent.width*0.3;
        }else{
            this._parent = this;
        }
        this._userIds = [GameData.userInfo.id];
        this.initView();
    }

    private initView(){

        
        let userHeard1:egret.Sprite = new egret.Sprite;
        userHeard1.graphics.lineStyle(3,0xffff00);
        userHeard1.graphics.beginFill(0x112200,1);
        userHeard1.x = this._SizeWith;
        userHeard1.y = 200;
        userHeard1.graphics.drawCircle(0, 0, this._UserHeadradius);
        userHeard1.graphics.endFill();
        userHeard1.graphics.clear;
        this.addChild(userHeard1);

        let userHeard2:egret.Sprite = new egret.Sprite;
        userHeard2.graphics.lineStyle(3,0xffff00);
        userHeard2.graphics.beginFill(0x910270,1);
        userHeard2.graphics.drawCircle(this._SizeWith+(this._UserHeadradius*4), 200, this._UserHeadradius);
        userHeard2.graphics.endFill();
        this.addChild(userHeard2);

        let userHeard3:egret.Sprite = new egret.Sprite;
        userHeard3.graphics.lineStyle(3,0xffff00);
        userHeard3.graphics.beginFill(0x11117f,1);
        userHeard3.graphics.drawCircle(this._SizeWith+(this._UserHeadradius*8), 200, this._UserHeadradius);
        userHeard3.graphics.endFill();
        this.addChild(userHeard3);

        this._userHeard1 = userHeard1;
        this._userHeard2 = userHeard2;
        this._userHeard3 = userHeard3;



        var img:egret.ImageLoader = new egret.ImageLoader();
        this._imgHead1 = img;
        this._imgHead1.addEventListener(egret.Event.COMPLETE, this.imgLoadHandler, this);
        this._imgHead1.load("resource/assets/Game/star1.png");


        let roomid = new eui.Label();
        roomid.width = 400;
        roomid.x = (this._parent.width-roomid.width)/2;
        roomid.y = this._parent.y + 50;
        roomid.size = 35;
        roomid.text = "正在加载......";
        roomid.textAlign = "center";
        this._roomidText = roomid;
        this.addChild(roomid);

        let userID1 = new eui.Label();
        userID1.text = this._userID_ptext;
        userID1.x = (this._SizeWith-this._UserHeadradius);
        userID1.width = this._UserHeadradius*2;
        userID1.y = 300;
        userID1.textAlign = "center";
        this._userID_1 = userID1;
        this.addChild(this._userID_1);

        let userID2 = new eui.Label();
        userID2.text = this._userID_ptext;
        userID2.x = (this._SizeWith-this._UserHeadradius)+(this._UserHeadradius*4);
        userID2.width = this._UserHeadradius*2;
        userID2.y = 300;
        userID2.textAlign = "center";
        this._userID_2 = userID2;
        this.addChild(this._userID_2);

        let userID3 = new eui.Label();
        userID3.x = (this._SizeWith-this._UserHeadradius)+(this._UserHeadradius*8);
        userID3.text = this._userID_ptext;
        userID3.width = this._UserHeadradius*2;
        userID3.y = 300;
        userID3.textAlign = "center";
        this._userID_3 = userID3;
        this.addChild(this._userID_3);

        let kickBtn2 = new eui.Button();
        kickBtn2.label = "踢出房间";
        kickBtn2.x = (this._SizeWith-this._UserHeadradius)+(this._UserHeadradius*4);
        kickBtn2.y = 360;
        kickBtn2.width = 150;
        kickBtn2.height = 60;
        kickBtn2.visible = false;
        this._kickUserButton2 = kickBtn2;
        this.addChild(this._kickUserButton2);

        let kickBtn3 = new eui.Button();
        kickBtn3.label = "踢出房间";
        kickBtn3.x = (this._SizeWith-this._UserHeadradius)+(this._UserHeadradius*8);
        kickBtn3.y = 360;
        kickBtn3.width = 150;
        kickBtn3.height = 60;
        kickBtn3.visible = false;
        this._kickUserButton3 = kickBtn3;
        this.addChild(this._kickUserButton3);


        let startGameBtn = new eui.Button();
        startGameBtn.label = "开始游戏";
        startGameBtn.x = (this._SizeWith-this._UserHeadradius);
        startGameBtn.y = 460;
        startGameBtn.width = 240;
        startGameBtn.height = 80;
        startGameBtn.visible = false;
        this._startGameButton = startGameBtn;
        this.addChild(startGameBtn);

        let exitRoom = new eui.Button();
        exitRoom.label = "退出";
        exitRoom.x = (this._SizeWith)+startGameBtn.width + 80;
        exitRoom.y = 460;
        exitRoom.width = 240;
        exitRoom.height = 80;
        this.addChild(exitRoom);


        exitRoom.addEventListener(egret.TouchEvent.TOUCH_TAP, this.mbuttonLeaveRoom, this);
        startGameBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.mbuttonStartGameBtn, this);
        this._kickUserButton3.addEventListener(egret.TouchEvent.TOUCH_TAP, this.mbuttonKickUserButton3, this);
        this._kickUserButton2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.mbuttonKickUserButton2, this);

        GameData.response.errorResponse = this.errorResponse;
        //加入房间回调
        GameData.response.joinRoomResponse = this.joinRoomResponse.bind(this);
        GameData.response.joinRoomNotify = this.joinRoomNotify.bind(this);
        GameData.response.createRoomResponse = this.createRoomResponse.bind(this);
        //离开房间回调
        GameData.response.leaveRoomResponse = this.leaveRoomResponse.bind(this);
        GameData.response.leaveRoomNotify =  this.leaveRoomNotify.bind(this);
        //踢人相关的回调
        GameData.response.kickPlayerNotify = this.kickPlayerNotify.bind(this);
        GameData.response.kickPlayerResponse = this.kickPlayerResponse.bind(this);
        //发送消息相关回调
        GameData.response.sendEventNotify = this.sendEventNotify.bind(this);
        GameData.response.sendEventResponse = this.sendEventResponse.bind(this); // 设置事件发射之后的回调

        GameData.response.joinOverNotify = this.joinOverNotify.bind(this);

        GameData.response.setRoomPropertyNotify = this.setRoomPropertynotify.bind(this);
        GameData.response.setRoomPropertyResponse = this.setRoomPropertyResponse.bind(this);


    }

    private imgLoadHandler( event:egret.Event ):void{
        var loader:egret.ImageLoader = <egret.ImageLoader>event.target;
		var bitmapData:egret.BitmapData = loader.data;
        var bmd:egret.BitmapData = bitmapData;
        let texture = new egret.Texture();
        texture.bitmapData = loader.data;
        let bmp1:egret.Bitmap = new egret.Bitmap(texture);

        this._userHeard1.addChild(bmp1);
    }

    /**
     * 退出房间
     */
    private mbuttonLeaveRoom(event:egret.TouchEvent){
        //如果没有进入房间成功就直接返回游戏大厅界面
        if(this._isInRoom){
            GameData.engine.leaveRoom("leaveRoom");
        }else{
            //退出房间成功进入游戏大厅
            GameSceneView._gameScene.lobby();
        }
        
    }

    /**
     * 开始游戏
     */
    private mbuttonStartGameBtn(event:egret.TouchEvent){
        if((this._roomRealUserNum >= GameData.maxPlayerNum)
            && this.canStartGame){

            GameData.response.joinOverResponse = this.joinOverResponse.bind(this);
            //停止加入房间
            GameData.engine.joinOver("joinOver");
        }else{
            console.log("人不够，或者还有人没有准备！");
        }
    }
    /**
     * 踢掉用户3
     */
    private mbuttonKickUserButton3(event:egret.TouchEvent){
        this._kickUserID = this._userID_3.text;
        GameData.engine.kickPlayer(Number(this._kickUserID),"");
    }
    /**
     * 踢掉用户2
     */
    private mbuttonKickUserButton2(event:egret.TouchEvent){
        this._kickUserID = this._userID_2.text;
        GameData.engine.kickPlayer(Number(this._kickUserID),"");
    }


    /**
     * 房主创建房间
     */
    public doCreateRoom(){
        //this._createRoomInfo = new MsCreateRoomInfo("MatchvsDemoEgret",3,0,0,0,"roomProperty");
        GameData.engine.createRoom(GameData.createRoomInfo, "myroom");
    }

    /**
     * 显示房间ID
     */
    private showRoomID(roomID:string){
        let roomid = new eui.Label();
        roomid.width = 400;
        roomid.x = (this._parent.width-roomid.width)/2;
        roomid.y = this._parent.y + 50;
        roomid.size = 35;
        roomid.text = roomID;
        roomid.textAlign = "center";
        this._roomidText = roomid;
        this.addChild(roomid);
    }

    public createKickButton(){
    }


    private createRoomResponse(rsp:MsCreateRoomRsp){
        if(rsp.status !== 200){
            this._roomidText.text = ("创建房间失败：status="+status);
            console.log("创建房间失败 status="+status);
            return;
        }else{
            this._isInRoom = true;
            this._roomidText.text = ("房间号：\n"+rsp.roomID);
            console.log("创建房间成功 roomID="+rsp.roomID);
            this._userID_1.text = rsp.owner.toString();
            this._roomRealUserNum = 1;
            this._startGameButton.visible = true;
            this._isOwner = true;
        }
    }

    /**
     * 非房主加入房间
     */
    public doJoinRoomSpecial(roomID:string, userProperty:string){
        GameData.engine.joinRoom(roomID, userProperty);
    }

    /**
     * 非房主自己加入房间的回调
     */
    private joinRoomResponse(status:number, roomuserInfoList:Array<MsRoomUserInfo>, roomInfo:MsRoomInfo){
        if(status !== 200){
            this._roomidText.text = ("加入房间失败：status="+status);
            console.log("加入房间失败： status="+status);
            return;
        }else{

            console.log("owner ="+ roomInfo.ownerId.toString());

            this._isInRoom = true;
            this._roomidText.text = ("房间号：\n"+roomInfo.roomID);
            //真实人数
            this._roomRealUserNum = roomuserInfoList.length+1;
            //显示我自己的

            
            for(let i = 0; i < roomuserInfoList.length; i++){
                console.log("userProfile:"+roomuserInfoList[i].userProfile);
                /**
                 * 如果是房主就现在最左边
                 */
                if(roomuserInfoList[i].userId === roomInfo.ownerId){
                    this._userID_2.text =  GameData.userInfo.id.toString();
                }else {
                    this._userID_3.text = roomuserInfoList[i].userId.toString();
                }
            }
            this._userID_1.text = roomInfo.ownerId.toString();
            this._userID_2.text =  GameData.userInfo.id.toString();

            //非房主发送准备游戏
            if(this._isOwner === false){
                console.log("非房主发送准备游戏消息！");
                this.gameReadyNotify();
            }
        }
    }
    /**
     * 有其他人加入房间的回调
     */
    private joinRoomNotify(roomUserInfo:MsRoomUserInfo){
        this.changeUserIDs(roomUserInfo.userId, 1);
    }

    private leaveRoomNotify(leaveRoomInfo:MsLeaveRoomNotify){
        if(leaveRoomInfo.userId.toString() === this._userID_1.text){
            //房主退出
            console.log("房主退出房间");
            GameData.engine.leaveRoom("leaveRoom");
            // if(leaveRoomInfo.userId === GameData.userInfo.id){

            // }
        }
        this.changeUserIDs(leaveRoomInfo.userId, -1);
    }

    private leaveRoomResponse(rsp:MsLeaveRoomRsp){
        if(rsp.status !== 200){
            this._roomidText.text = ("退出房间失败！status="+rsp.status);
        }else{
            //退出房间成功进入游戏大厅
            GameSceneView._gameScene.lobby();
        }
    }


    /**
     * 房主剔人，其他用户收到的异步回调
     */
    private kickPlayerNotify(knotify:MsKickPlayerNotify){
        this._kickUserID = knotify.userId.toString();

        //如果剔除的是自己，就退出房间
        if(this._kickUserID === GameData.userInfo.id.toString()){
            //退出房间成功进入游戏大厅
            GameSceneView._gameScene.lobby();
            return
        }else{
            this.changeUserIDs(knotify.userId, -1);
        }
    }
    /**
     * 剔除用户房主自己收到的回调
     */
    private kickPlayerResponse(rsp:MsKickPlayerRsp){

        this.changeUserIDs(rsp.userID, -1);
    }

    private joinOverResponse(rsp:MsJoinOverRsp){
        if(rsp.status !== 200){
            console.log("关闭房间失败，回调通知错误码：", rsp.status);
            return;
        }
        //停止加入房间调用成功,通知其他用户开始游戏
        this.notifyGameStart();
    }

    private changeUserIDs(userid:number, open:number){
        console.log("用户变动：userid:="+userid+" 操作："+open)
        if(open === 1){
            this._roomRealUserNum += 1;
            this._userIds.push(userid);

            //显示信息
            if(this._userID_2.text === this._userID_ptext){
                this._userID_2.text = userid.toString();
                if(this._isOwner){
                    this._kickUserButton2.visible = true;
                }
            }else if(this._userID_3.text === this._userID_ptext){
                this._userID_3.text = userid.toString();
                if(this._isOwner){
                    this._kickUserButton3.visible = true;
                }
            }


        }else if(open === -1){
            this._roomRealUserNum -= 1;
            for(let i = 0; i < this._userIds.length; i++){
                if(this._userIds[i] === userid){
                    this._userIds.splice(i,1);
                }
            }

            //取消显示
            if(userid.toString() === this._userID_2.text){
                this._userID_2.text = this._userID_ptext;
                this._kickUserButton2.visible = false;
            }else if(userid.toString() === this._userID_3.text){
                this._userID_3.text = this._userID_ptext;
                this._kickUserButton3.visible = false;
            }
        }
        if(this._isOwner)console.log("房间人数：" + this._userIds.length + " userids:"+this._userIds);
        
    }

    private notifyGameStart(){
        GameData.isRoomOwner = this._isOwner;
        GameData.playerUserIds = this._userIds;
        let event = {
            action: GameData.gameStartEvent,
            userIds: GameData.playerUserIds
        };
        
        let result = GameData.engine.sendEvent(JSON.stringify(event));
        if (result.result !== 0){
            console.log('发送游戏开始通知失败，错误码' + result.result);
            return;
        }

        // 发送的事件要缓存起来，收到异步回调时用于判断是哪个事件发送成功
        GameData.events[result.sequence] = event;
        console.log("发起游戏开始的通知，等待回复");
    }

    /**
     * 发送消息回调
     */
    private sendEventResponse(rsp:MsSendEventRsp){
        if (rsp.status !== 200) {
            return console.log('事件发送失败,status:'+status);
        }

        var event = GameData.events[rsp.sequence]

        if (event && event.action === GameData.gameStartEvent) {
            delete GameData.events[rsp.sequence]
            GameSceneView._gameScene.play();
        }
    }

    /**
     * 收到消息回调
     */
    private sendEventNotify(eventInfo:MsSendEventNotify){
        if (eventInfo
            && eventInfo.cpProto
            && eventInfo.cpProto.indexOf(GameData.gameStartEvent) >= 0) {
            GameData.playerUserIds = [GameData.userInfo.id]
            // 通过游戏开始的玩家会把userIds传过来，这里找出所有除本玩家之外的用户ID，
            // 添加到全局变量playerUserIds中
            JSON.parse(eventInfo.cpProto).userIds.forEach(function(userId) {
                if (userId !== GameData.userInfo.id) GameData.playerUserIds.push(userId)
            });
            GameSceneView._gameScene.play();
        }
        if(this._isOwner){
            if(eventInfo 
            && eventInfo.cpProto
            && eventInfo.cpProto.indexOf(GameData.gameReadyEvent) >= 0){
                //准备
                this._allgameReady[eventInfo.srcUserId] = true;
                console.log(eventInfo.srcUserId+" 准备好");

            }
        }
    }

    private canStartGame():boolean{
        if(this._userIds.length < GameData.maxPlayerNum){
            return false;
        }
        for(let i = 0; i < GameData.maxPlayerNum; i++ ){
            if( !this._userIds[i] && this._allgameReady[this._userIds[i]] === false){
                return false;
            }
        }
        return true;
    }

    /**
     * 发送游戏准备
     */
    private gameReadyNotify(){
        let event = {
            action: GameData.gameReadyEvent,
            data:{},
        };
        let result = GameData.engine.sendEvent(JSON.stringify(event));
        if (result.result !== 0){
            console.log('发送游戏准备通知失败，错误码' + result.result);
            return;
        }

        // 发送的事件要缓存起来，收到异步回调时用于判断是哪个事件发送成功
        GameData.events[result.sequence] = event;
        console.log("发起游戏准备的通知，等待开始游戏");
    }


    private errorResponse(errCode:number, errMsg:string){
        console.log("加入房间错误错误回调：errCode=" + errCode + " errMsg="+errMsg);
        GameSceneView._gameScene.errorView(2, "加入房间错误错误回调：errCode=" + errCode + " errMsg="+errMsg);
        return
    }

    private joinOverNotify(notifyInfo:MsJoinOverNotifyInfo){
        console.log("userID:"+notifyInfo.srcUserID+" 关闭房间："+notifyInfo.roomID+" cpProto:"+notifyInfo.cpProto);
    }

    private setRoomPropertynotify(notify:MsRoomPropertyNotifyInfo):void{
    }

    private setRoomPropertyResponse(rsp:MsSetRoomPropertyRspInfo):void{

    }
    private 
}