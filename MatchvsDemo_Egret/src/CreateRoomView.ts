/**
 * 创建房间界面,创建房间调用 doCreateRoom()
 * 加入指定的房间 调用  doJoinRoomSpecial(...)
 */
class CreateRoomView extends egret.DisplayObjectContainer{
    private _UserHeadradius = 60;
    private _parent:egret.DisplayObjectContainer;
    private _roomidText:eui.Label = null;
    private _SizeWith :number = 400;

    private _isInRoom:boolean = false;
    private _isOwner:boolean = false; //房主

    private _createRoomInfo:MsCreateRoomInfo;
    private _startGameButton:eui.Button;
    
    private _userHeard1:egret.Sprite;
    private _userHeard2:egret.Sprite;
    private _userHeard3:egret.Sprite;

    private _headimg1:eui.Image = null;

    private _gameMapA:eui.RadioButton;
    private _gameMapB:eui.RadioButton;

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
    public  _playerList:Array<GameUser> = [];
    public _roomID:string = "";

    constructor( pr?: egret.DisplayObjectContainer){
        super();
        if(pr){
            this._parent = pr;
            this._SizeWith = this._parent.x+this._parent.width*0.3;
        }else{
            this._parent = this;
        }
        this._playerList = [GameData.gameUser];
        this.initView();
    }

    /**
     * 创建界面显示元素
     */
    private initView(){
        let gamemapfull:egret.Sprite = new egret.Sprite;
        gamemapfull.graphics.lineStyle(3,0x00ff00);
        gamemapfull.graphics.beginFill(0x000000,1);
        gamemapfull.graphics.drawRect(this._SizeWith+(this._UserHeadradius*7.5)-20, 40, 140, 80);
        gamemapfull.graphics.endFill();
        this.addChild(gamemapfull);

        let rdb: eui.RadioButton = new eui.RadioButton();
        rdb.label = "彩色地图A";
        rdb.value = 0;
        rdb.groupName = "p1";
        rdb.selected = true;//默认选项
        rdb.x = this._SizeWith+(this._UserHeadradius*7.5)-10;
        rdb.y = 50;
        rdb.enabled = false;
        rdb.addEventListener(eui.UIEvent.CHANGE, this.radioChangeHandler, this);
        this._gameMapA = rdb;
        this.addChild(this._gameMapA);

        let rdb2: eui.RadioButton = new eui.RadioButton();
        
        rdb2.label = "灰色地图B";
        rdb2.value = 1;
        rdb2.groupName = "p1";
        rdb2.x = this._SizeWith+(this._UserHeadradius*7.5)-10;
        rdb2.enabled = false;
        rdb2.y = 90;
        rdb2.addEventListener(eui.UIEvent.CHANGE, this.radioChangeHandler, this);
        this._gameMapB = rdb2;
        this.addChild(this._gameMapB);

        this._userHeard1 = new egret.Sprite;
        this._userHeard1.graphics.lineStyle(3,0xffff00,1);
        this._userHeard1.graphics.beginFill(0x112200,1);
        this._userHeard1.x = this._SizeWith;
        this._userHeard1.y = 200;
        this._userHeard1.graphics.drawCircle(0, 0, this._UserHeadradius);
        this._userHeard1.graphics.endFill();
        this._userHeard1.graphics.clear;
        this.addChild(this._userHeard1);

        this._userHeard2 = new egret.Sprite;
        this._userHeard2.graphics.lineStyle(3,0xffff00);
        this._userHeard2.graphics.beginFill(0x910270,1);
        this._userHeard2.graphics.drawCircle(this._SizeWith+(this._UserHeadradius*4), 200, this._UserHeadradius);
        this._userHeard2.graphics.endFill();
        this.addChild(this._userHeard2);

        this._userHeard3 = new egret.Sprite;
        this._userHeard3.graphics.lineStyle(3,0xffff00);
        this._userHeard3.graphics.beginFill(0x11117f,1);
        this._userHeard3.graphics.drawCircle(this._SizeWith+(this._UserHeadradius*8), 200, this._UserHeadradius);
        this._userHeard3.graphics.endFill();
        this.addChild(this._userHeard3);

        var img:egret.ImageLoader = new egret.ImageLoader();
        this._imgHead1 = img;
        this._imgHead1.addEventListener(egret.Event.COMPLETE, this.imgLoadHandler, this);
        this._imgHead1.load("resource/assets/Game/star1.png");


        this._roomidText = new eui.Label();
        this._roomidText.width = 400;
        this._roomidText.x = (this._parent.width- this._roomidText.width)/2;
        this._roomidText.y = this._parent.y + 50;
        this._roomidText.size = 35;
        this._roomidText.text = "正在加载......";
        this._roomidText.textAlign = "center";
        this.addChild(this._roomidText);

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
        // 添加 matchvs 接口回调监听
        this.addMsResponseListen();
    }

        /**
     * 注册监听
     */
    private addMsResponseListen(){
        
        //错误回调
        mvs.MsResponse.getInstance.addEventListener(mvs.MsEvent.EVENT_ERROR_RSP, this.errorResponse, this);

        //创建房间
        mvs.MsResponse.getInstance.addEventListener(mvs.MsEvent.EVENT_CREATEROOM_RSP, this.createRoomResponse,this);

        //加入房间
        mvs.MsResponse.getInstance.addEventListener(mvs.MsEvent.EVENT_JOINROOM_RSP, this.joinRoomResponse,this);
        mvs.MsResponse.getInstance.addEventListener(mvs.MsEvent.EVENT_JOINROOM_NTFY, this.joinRoomNotify,this);

        //关闭房间
        mvs.MsResponse.getInstance.addEventListener(mvs.MsEvent.EVENT_JOINOVER_NTFY, this.joinOverNotify,this);
        mvs.MsResponse.getInstance.addEventListener(mvs.MsEvent.EVENT_JOINOVER_RSP, this.joinOverResponse,this);

        //发送消息
        mvs.MsResponse.getInstance.addEventListener(mvs.MsEvent.EVENT_SENDEVENT_RSP, this.sendEventResponse,this);
        mvs.MsResponse.getInstance.addEventListener(mvs.MsEvent.EVENT_SENDEVENT_NTFY, this.sendEventNotify,this);

        //离开房间
        mvs.MsResponse.getInstance.addEventListener(mvs.MsEvent.EVENT_LEAVEROOM_RSP, this.leaveRoomResponse,this);
        mvs.MsResponse.getInstance.addEventListener(mvs.MsEvent.EVENT_LEAVEROOM_NTFY, this.leaveRoomNotify,this);

        //踢人
        mvs.MsResponse.getInstance.addEventListener(mvs.MsEvent.EVENT_KICKPLAYER_RSP, this.kickPlayerResponse,this);
        mvs.MsResponse.getInstance.addEventListener(mvs.MsEvent.EVENT_KICKPLAYER_NTFY, this.kickPlayerNotify,this);

        //设置房间属性
        mvs.MsResponse.getInstance.addEventListener(mvs.MsEvent.EVENT_SETROOMPROPERTY_RSP, this.setRoomPropertyResponse,this);
        mvs.MsResponse.getInstance.addEventListener(mvs.MsEvent.EVENT_SETROOMPROPERTY_NTFY, this.setRoomPropertynotify,this);

        //踢人
    }

    /**
     * 取消监听
     */
    public release(){
        mvs.MsResponse.getInstance.removeEventListener(mvs.MsEvent.EVENT_ERROR_RSP, this.errorResponse, this);
        mvs.MsResponse.getInstance.removeEventListener(mvs.MsEvent.EVENT_CREATEROOM_RSP, this.createRoomResponse,this);
        mvs.MsResponse.getInstance.removeEventListener(mvs.MsEvent.EVENT_JOINROOM_RSP, this.joinRoomResponse,this);
        mvs.MsResponse.getInstance.removeEventListener(mvs.MsEvent.EVENT_JOINROOM_NTFY, this.joinRoomNotify,this);

        mvs.MsResponse.getInstance.removeEventListener(mvs.MsEvent.EVENT_JOINOVER_NTFY, this.joinOverNotify,this);
        mvs.MsResponse.getInstance.removeEventListener(mvs.MsEvent.EVENT_JOINOVER_RSP, this.joinOverResponse,this);

        mvs.MsResponse.getInstance.removeEventListener(mvs.MsEvent.EVENT_SENDEVENT_RSP, this.sendEventResponse,this);
        mvs.MsResponse.getInstance.removeEventListener(mvs.MsEvent.EVENT_SENDEVENT_NTFY, this.sendEventNotify,this);


        //离开房间
        mvs.MsResponse.getInstance.removeEventListener(mvs.MsEvent.EVENT_LEAVEROOM_RSP, this.leaveRoomResponse,this);
        mvs.MsResponse.getInstance.removeEventListener(mvs.MsEvent.EVENT_LEAVEROOM_NTFY, this.leaveRoomNotify,this);

        //踢人
        mvs.MsResponse.getInstance.removeEventListener(mvs.MsEvent.EVENT_KICKPLAYER_RSP, this.kickPlayerResponse,this);
        mvs.MsResponse.getInstance.removeEventListener(mvs.MsEvent.EVENT_KICKPLAYER_NTFY, this.kickPlayerNotify,this);

        //设置房间属性
        mvs.MsResponse.getInstance.removeEventListener(mvs.MsEvent.EVENT_SETROOMPROPERTY_RSP, this.setRoomPropertyResponse,this);
        mvs.MsResponse.getInstance.removeEventListener(mvs.MsEvent.EVENT_SETROOMPROPERTY_NTFY, this.setRoomPropertynotify,this);
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
            mvs.MsEngine.getInstance.leaveRoom("leaveRoom");
        }else{
            this.release();
            //退出房间成功进入游戏大厅
            GameSceneView._gameScene.lobby();
        } 
    }

    /**
     * 开始游戏
     */
    private mbuttonStartGameBtn(event:egret.TouchEvent){
        if((this._playerList.length >= GameData.maxPlayerNum)
            && this.canStartGame){
            GameData.playerUserIds = this._playerList;
            //停止加入房间
            mvs.MsEngine.getInstance.joinOver("joinOver");
        }else{
            console.log("人不够，或者还有人没有准备！");
        }
    }
    /**
     * 踢掉用户3
     */
    private mbuttonKickUserButton3(event:egret.TouchEvent){
        let kickUserID = this._userID_3.text;
        let uid:number = 0;
        this._playerList.forEach(function(element){
            if(kickUserID.indexOf(""+element.id) >= 0){
                uid = element.id;
            }
        });
        mvs.MsEngine.getInstance.kickPlayer(uid,"");
    }
    /**
     * 踢掉用户2
     */
    private mbuttonKickUserButton2(event:egret.TouchEvent){
        let kickUserID = this._userID_2.text;
        let uid:number = 0;
        this._playerList.forEach(function(element){
            if(kickUserID.indexOf(""+element.id) >= 0){
                uid = element.id;
            }
        });
        mvs.MsEngine.getInstance.kickPlayer(uid,"");
    }


    /**
     * 房主创建房间
     */
    public doCreateRoom(){
        this._createRoomInfo = GameData.createRoomInfo;
        GameData.roomPropertyValue = GameData.createRoomInfo.roomProperty;
        //调用 matchvs 创建房间接口
        mvs.MsEngine.getInstance.createRoom(GameData.createRoomInfo, JSON.stringify({name:GameData.gameUser.name,avatar:GameData.gameUser.avatar}));
    }

    /**
     * 其他玩家加入房间
     */
    public doJoinRoomSpecial(roomID:string, userProperty:string){
        mvs.MsEngine.getInstance.joinRoom(roomID, userProperty);
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

    /**
     * 创建房间事件回调
     */
    private createRoomResponse(ev:egret.Event){
        let rsp = ev.data;
        if(rsp.status !== 200){
            this._roomidText.text = ("创建房间失败：status="+status);
            console.log("创建房间失败 status="+status);
            return;
        }else{
            this._isInRoom = true;
            this._roomID = rsp.roomID;
            GameData.roomID = rsp.roomID;
            this._roomidText.text = ("房间号：\n"+rsp.roomID);
            console.log("创建房间成功 roomID="+this._roomidText.text);

            this._isOwner = true;
            GameData.gameUser.isOwner = true;

            this._playerList = [];
            this._playerList.push(GameData.gameUser);
            this.showPlayerInfo(GameData.gameUser,true);
        }
    }

    /**
     * 非房主自己加入房间的回调
     */
    private joinRoomResponse(event:egret.Event){
        let data = event.data;
        let roomInfo = data.roomInfo;
        let roomuserInfoList = data.userList;
        if(data.status !== 200){
            this._roomidText.text = ("加入房间失败：status="+status);
            console.log("加入房间失败： status="+status);
            return;
        }

        console.log("owner ="+ roomInfo.ownerId.toString());

        //显示房间信息
        this._isInRoom = true;
        this._roomidText.text = ("房间号：\n"+roomInfo.roomID);
        this._roomID  = roomInfo.roomID;
        GameData.roomID = roomInfo.roomID;

        if(roomInfo.roomProperty === GameData.roomPropertyType.mapB){
            GameData.roomPropertyValue = GameData.roomPropertyType.mapB
            this._gameMapB.selected = true;
        }else{
            GameData.roomPropertyValue = GameData.roomPropertyType.mapA
            this._gameMapA.selected = true;
        }

        this._playerList  = [];
        GameData.gameUser.isOwner = false;
        this._playerList.push(GameData.gameUser);
        this.showPlayerInfo(GameData.gameUser,true);
        //显示我自己的
        for(let i = 0; i < roomuserInfoList.length; i++){
            console.log("userProfile:"+roomuserInfoList[i].userProfile);
            let user = this.addPlayUser( roomuserInfoList[i].userId, roomuserInfoList[i].userProfile);
            
            /**
             * 如果是房主就现在最左边
             */
            if(roomuserInfoList[i].userId === roomInfo.ownerId){
                user.isOwner = true;
            }else {
                user.isOwner = false;
            }
            this.showPlayerInfo(user,true);
        }

        //非房主发送准备游戏
        if(this._isOwner === false){
            console.log("非房主发送准备游戏消息！");
            this.gameReadyNotify();
        }
    }
    /**
     * 有其他人加入房间的回调
     */
    private joinRoomNotify(ev:egret.Event){
        let roomUserInfo = ev.data;
        //加入房间
        let user:GameUser = this.addPlayUser(roomUserInfo.userId, roomUserInfo.userProfile);
        //显示用户
        this.showPlayerInfo(user,true);
    }

    /**
     * 他人离开房间回调
     */
    private leaveRoomNotify(ev:egret.Event){
        let leaveRoomInfo = ev.data;
        if(this._userID_1.text !== "" && this._userID_1.text.indexOf(leaveRoomInfo.userId.toString())>=0){
            //房主退出
            console.log("房主退出房间");
            mvs.MsEngine.getInstance.leaveRoom("leaveRoom");
        }
        this.delPlayUser(leaveRoomInfo.userId);
    }

    /**
     * 自己离开房间回调
     */
    private leaveRoomResponse(ev:egret.Event){
        let rsp = ev.data;
        if(rsp.status !== 200){
            this._roomidText.text = ("退出房间失败！status="+rsp.status);
        }else{
            this.release();
            //退出房间成功进入游戏大厅
            GameSceneView._gameScene.lobby();
        }
    }


    /**
     * 房主剔人，其他用户收到的异步回调
     */
    private kickPlayerNotify(ev:egret.Event){
        let knotify = ev.data;
        this._kickUserID = knotify.userId.toString();

        //如果剔除的是自己，就退出房间
        if(this._kickUserID === GameData.gameUser.id.toString()){
            this.release();
            //退出房间成功进入游戏大厅
            GameSceneView._gameScene.lobby();
            return
        }else{
            this.delPlayUser(knotify.userId);
        }
    }
    /**
     * 剔除用户房主自己收到的回调
     */
    private kickPlayerResponse(ev:egret.Event){
        let rsp = ev.data;
        this.delPlayUser(rsp.userID);
        //this.changeUserIDs(rsp.userID, -1);
    }

    private joinOverResponse(ev:egret.Event){
        let rsp = ev.data;
        if(rsp.status !== 200){
            console.log("关闭房间失败，回调通知错误码：", rsp.status);
            return;
        }
        //停止加入房间调用成功,通知其他用户开始游戏
        this.notifyGameStart();
    }

    /**
     * 显示用户信息
     * @param {} user
     * @param {} isShow true 显示用户 false 不显示用户
     */
    private showPlayerInfo(user:GameUser,isShow:boolean){
        let info = user.id+"\n"+user.name;
        if(isShow){
            if(user.isOwner){
                //房主在最右边位置
                this._userID_1.text = info;
                //如果这个房主是我自己
                if(user.id === GameData.gameUser.id){
                    //显示地图选择
                    this._gameMapA.enabled = true;
                    this._gameMapB.enabled = true;
                    //显示开始按钮
                    this._startGameButton.visible = true;
                }
            }else{
                //不是房主，哪个为空就坐哪个
                if(this._userID_2.text === this._userID_ptext){
                    this._userID_2.text = info;
                    //如果我自己是房主就显示踢人的标记
                    if(this._isOwner){
                        this._kickUserButton2.visible = true;
                    }
                }else if(this._userID_3.text === this._userID_ptext){
                    this._userID_3.text = info;
                    if(this._isOwner){
                        this._kickUserButton3.visible = true;
                    }
                }
            }
        }else{
            //取消显示
            if((info) === this._userID_2.text){
                this._userID_2.text = this._userID_ptext;
                this._kickUserButton2.visible = false;
            }else if(info === this._userID_3.text){
                this._userID_3.text = this._userID_ptext;
                this._kickUserButton3.visible = false;
            }
        }
    }

    /**
     * 添加用户
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
        this._playerList.push(gUser);

        return gUser;
    }

    /**
     * 删除用户
     */
    private delPlayUser(userid:number):GameUser{
        let user:GameUser  = new GameUser();
        for(let i = 0; i < this._playerList.length; i++){
            if(this._playerList[i].id === userid){
                user.id = this._playerList[i].id;
                user.avatar = this._playerList[i].avatar;
                user.name = this._playerList[i].name;
                user.isOwner = this._playerList[i].isOwner;
                //移除该用户
                this._playerList.splice(i,1);
            }
        }
        //取消显示
        this.showPlayerInfo(user, false);
        return user;
    }


    private notifyGameStart(){
        //设置房主标记，到游戏界面要用到，如果是房主要第一个 创建球的位置
        GameData.isRoomOwner = this._isOwner;

        let arrs = [];
        this._playerList.forEach((element)=>{
            arrs.push({id:element.id,name:element.name,avatar:element.avatar});
        });

        let event = {
            action: GameData.gameStartEvent,
            userIds: arrs
        };
        
        let result = mvs.MsEngine.getInstance.sendEvent(JSON.stringify(event));
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
    private sendEventResponse(ev:egret.Event){
        let rsp = ev.data;
        if (rsp.status !== 200) {
            return console.log('事件发送失败,status:'+status);
        }

        var event = GameData.events[rsp.sequence]

        if (event && event.action === GameData.gameStartEvent) {
            delete GameData.events[rsp.sequence];
            this.release();
            GameSceneView._gameScene.play();
        }
    }

    /**
     * 收到消息回调
     */
    private sendEventNotify(ev:egret.Event){
        let eventInfo = ev.data;
        // 判断是否收到开始游戏消息
        if (eventInfo
            && eventInfo.cpProto
            && eventInfo.cpProto.indexOf(GameData.gameStartEvent) >= 0) {
            this._playerList = [];
            this._playerList.push(GameData.gameUser);
            // 通过游戏开始的玩家会把userIds传过来，这里找出所有除本玩家之外的用户ID，
            // 添加到全局变量playerUserIds中
            JSON.parse(eventInfo.cpProto).userIds.forEach((userId)=> {
                let gUser:GameUser = new GameUser;
                gUser.avatar = userId.avatar;
                gUser.name = userId.name;
                gUser.id = userId.id;
                if(gUser.id !==GameData.gameUser.id ){
                    this._playerList.push(gUser);
                }
            });
            GameData.playerUserIds = this._playerList;
            this.release();
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

    /**
     * 检测是否可以开始游戏
     */
    private canStartGame():boolean{
        if(this._playerList.length < GameData.maxPlayerNum){
            return false;
        }
        for(let i = 0; i < GameData.maxPlayerNum; i++ ){
            if( !this._playerList[i] && this._allgameReady[this._playerList[i].id] === false){
                return false;
            }
        }
        return true;
    }

    /**
     * 发送游戏准备通知消息
     */
    private gameReadyNotify(){
        let event = {
            action: GameData.gameReadyEvent,
            data:{},
        };
        let result = mvs.MsEngine.getInstance.sendEvent(JSON.stringify(event));
        if (result.result !== 0){
            console.log('发送游戏准备通知失败，错误码' + result.result);
            return;
        }

        // 发送的事件要缓存起来，收到异步回调时用于判断是哪个事件发送成功
        GameData.events[result.sequence] = event;
        console.log("发起游戏准备的通知，等待开始游戏");
    }

    /**
     * matchvs 发送错误回调
     */
    private errorResponse(ev:egret.Event){
        console.log("加入房间错误错误回调：errCode=" + ev.data.errCode + " errMsg="+ev.data.errMsg);
        this.release();
        GameSceneView._gameScene.errorView(2, "加入房间错误错误回调：errCode=" + ev.data.errCode + " errMsg="+ev.data.errMsg);
        return
    }

    private joinOverNotify(ev:egret.Event){
        let notifyInfo = ev.data;
        console.log("userID:"+notifyInfo.srcUserID+" 关闭房间："+notifyInfo.roomID+" cpProto:"+notifyInfo.cpProto);
    }

    /**
     * 地图改变事件
     */
    private radioChangeHandler(evt:eui.UIEvent):void {
        if(evt.target.value === 0){
            //地图A
            GameData.roomPropertyValue = GameData.roomPropertyType.mapA;
            mvs.MsEngine.getInstance.setRoomProperty(this._roomID,GameData.roomPropertyType.mapA);
        }else {
            //地图B
            GameData.roomPropertyValue = GameData.roomPropertyType.mapB;
            mvs.MsEngine.getInstance.setRoomProperty(this._roomID,GameData.roomPropertyType.mapB);
        }
    }

    /**
     * 他人设置房间属性回调事件
     */
    private setRoomPropertynotify(ev:egret.Event):void{
        let notify = ev.data;
        console.log("roomProperty = "+notify.roomProperty);
        if(notify.roomProperty === GameData.roomPropertyType.mapB){
            GameData.roomPropertyValue = GameData.roomPropertyType.mapB;
            this._gameMapB.selected = true;
        }else{
            GameData.roomPropertyValue = GameData.roomPropertyType.mapA;
            this._gameMapA.selected = true;
        }
    }

    /**
     * 自己设置房间数据回调事件
     */
    private setRoomPropertyResponse(ev:egret.Event):void{
        console.log("roomProperty = "+ev.data.roomProperty);
    }
}