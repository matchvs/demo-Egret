class MatchUI extends eui.Component implements  eui.UIComponent {

	public static JOINFLAG ={
        RANDROOM:1,
        CREATEROOM:2,
        WITHROOMID:3,
        WITHPROPERTY:4
    }

	private lab_lobby:eui.Label;
	private lab_matchmode:eui.Label;

	private lab_player1:eui.Label;
	private lab_player2:eui.Label;
	private lab_player3:eui.Label;

	private lab_userID:eui.Label;
	private lab_userID1:eui.Label;
	private lab_userID2:eui.Label;
	private lab_userID3:eui.Label;

	private rect_player1:eui.Rect;
	private rect_player2:eui.Rect;
	private rect_player3:eui.Rect;

	private lab_roomID:eui.Label;

	private check_open:eui.CheckBox;
	private img_owner:eui.Image;


	private btn_return:eui.Button;
	private btn_start:eui.Button;

	private joinFlag:number = 1;
	private joinInfo:any;
	private _isInRoom:boolean = false;
	private isOwner:boolean = false;
	public  _playerList:Array<GameUser> = [];
	private _roomID:string = "";
	private default_name = "待加入";
	private default_rect_color = 0x555555;
	
	public constructor() {
		super();
		this.addMsResponseListen();
	}

	private getChilds(partName:string,instance:any){
		switch(partName){
			case "lab_roomID":
			this.lab_roomID = instance;
			break;
			case "lab_userID":
			this.lab_userID = instance;
			this.lab_userID.text = "用户："+GameData.gameUser.id+"\n"+GameData.gameUser.name;
			break;
			case "lab_lobby":
			this.lab_lobby = instance;
			break;
			case "lab_matchmode":
			this.lab_matchmode = instance;
			break;
			case "lab_player1":
			this.lab_player1 = instance;
			break;
			case "lab_player2":
			this.lab_player2 = instance;
			break;
			case "lab_player3":
			this.lab_player3 = instance;
			break;
			case "lab_userID1":
			this.lab_userID1 = instance;
			break;
			case "lab_userID2":
			this.lab_userID2 = instance;
			break;
			case "lab_userID3":
			this.lab_userID3 = instance;
			break;
			case "rect_player1":
			this.rect_player1 = instance;
			break;
			case "rect_player2":
			this.rect_player2 = instance;
			break;
			case "rect_player3":
			this.rect_player3 = instance;
			break;
			case "check_open":
			this.check_open = instance;
			break;
			case "img_owner":
			this.img_owner = instance;
			this.img_owner.visible = false;
			break;
			case "btn_start":
			this.btn_start = instance;
			this.btn_start.addEventListener(egret.TouchEvent.TOUCH_TAP, this.mbuttonStartGameBtn, this);
			break;
			case "btn_return":
			this.btn_return = instance;
			this.btn_return.addEventListener(egret.TouchEvent.TOUCH_TAP, this.mbuttonLeaveRoom, this);
			break;
			default:
				break;
		}
	}

	protected partAdded(partName:string,instance:any):void
	{
		this.getChilds(partName,instance);
		super.partAdded(partName,instance);
	}


	protected childrenCreated():void
	{
		super.childrenCreated();
		this.joinRoom(this.joinFlag, this.joinInfo);
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

	public setJoinParame(flag:number, info?:any){
		this.joinFlag = flag;
		this.joinInfo = info;
	}

	/**
	 * 加入房间的统一入口
	 */
	public joinRoom(flag:number, info:any){
        this.joinFlag = flag;
        if(flag == 1){
            this.joinRandRoom();
        }else if(flag == 2){
            this.createRoom();
        }else if(flag == 3){
            this.joinWithRoomID(info);
        }else if(flag == 4){
            this.joinRoomWithPro(info);
        }
    }

 /**
     * 随机加入房间
     */
    private joinRandRoom(){
        let userPro:string = JSON.stringify({name:GameData.gameUser.name, avatar:GameData.gameUser.avatar});
        mvs.MsEngine.getInstance.joinRandomRoom(GameData.maxPlayerNum,userPro);
    }

    /**
     * 主动创建房间
     */
    private createRoom(){
        let userPro:string = JSON.stringify({name:GameData.gameUser.name, avatar:GameData.gameUser.avatar});
        mvs.MsEngine.getInstance.createRoom(GameData.createRoomInfo,userPro);
    }

    /**
     * 加入指定房间
     * @param roomID 
     */
    private joinWithRoomID(roomID:string){
        let userPro:string = JSON.stringify({name:GameData.gameUser.name, avatar:GameData.gameUser.avatar});
        mvs.MsEngine.getInstance.joinRoom(roomID, userPro);
    }

    /**
     * 属性匹配
     * @param tags 
     */
    private joinRoomWithPro(tags){
        let userPro:string = JSON.stringify({name:GameData.gameUser.name, avatar:GameData.gameUser.avatar});
        let matchinfo:MsMatchInfo = new MsMatchInfo(GameData.maxPlayerNum,0,0,tags);
        mvs.MsEngine.getInstance.joinRoomWithProperties(matchinfo,userPro);
    }

	/**
     * 
     * @param id 
     * @param name 
     * @param avator 
     * @param tableID 
     */
    private addPlayerList(id:number,name:string,avatar:string, tableID:number, owner:boolean = false):GameUser{
        let play:GameUser = new GameUser();
        play.id = id;
        play.name = name;
        play.avatar = avatar;
        play.tableID = tableID;
        play.isOwner = owner;
        this._playerList.push(play);
        this.showPlayer(play);
        return play;
    }

    /**
     * 删除用户列表
     * @param id 
     */
    private delPlayerList(id:number){
        let player:GameUser = new GameUser();
        let arr:Array<GameUser> = [];
        for(let i = 0; i < this._playerList.length; i++){
            
            if(this._playerList[i].id == id){
                player.id = this._playerList[i].id;
                player.avatar = this._playerList[i].avatar;
                player.name = this._playerList[i].name;
                player.tableID = this._playerList[i].tableID;
                this._playerList.splice(i,1);
                this.wipePlayer(player);
            }
        }
    }

	/**
     * 显示用户信息
     * @param player 
     */
    private showPlayer(player:GameUser){
        let tableID:number = player.tableID;
        // this.chk_FrameSysc.visible = this.isOwner;
        if(this.joinFlag == MatchUI.JOINFLAG.CREATEROOM || this.joinFlag == MatchUI.JOINFLAG.WITHROOMID){
            // this.loadMatch.visible = false;
            this.img_owner.visible = this.isOwner;
            if(tableID == 2 || tableID == 3){
				//踢人按钮
                //this["btn_kick"+tableID].visible = this.isOwner;
            }
        }else{
			this.btn_start.visible = false;
		}

		this["lab_player"+tableID].text = tableID.toString();
		this["lab_player"+tableID].textColor = 0xffffff;
		if(player.id == GameData.gameUser.id){
			this["lab_player"+tableID].text = "我";
		}
		
        if(tableID == 1){
            this.rect_player1.fillColor = 0x8BD7E0;
            this.lab_userID1.text = player.name;
        }else if(tableID == 2){
            this.rect_player2.fillColor = 0x96E8B5;
            this.lab_userID2.text = player.name;
        }else if(tableID == 3){
            this.rect_player3.fillColor = 0xE8CE90;
            this.lab_userID3.text = player.name;
        }
    }

	/**
     * 擦除用户信息
     * @param player 
     */
    private wipePlayer(player:GameUser){
        let tableID:number = player.tableID;
        if(tableID == 1){
            this.lab_userID1.text = this.default_name;
			this.rect_player1.fillColor = this.default_rect_color;
			this.lab_player1.text = "1";
			this.lab_player1.textColor = 0x757575;

            this.lab_userID2.text = this.default_name;
			this.rect_player2.fillColor = this.default_rect_color;
			this.lab_player2.text = "2";
			this.lab_player2.textColor = 0x757575;

            this.lab_userID3.text = this.default_name ;
			this.rect_player3.fillColor = this.default_rect_color;
			this.lab_player3.text = "3";
			this.lab_player3.textColor = 0x757575;
			
            // this.btn_kick1.visible = false;
            // this.btn_kick2.visible = false;
            // this.btn_kick3.visible = false;
            
        }else if(tableID == 2){
            this.lab_userID2.text = this.default_name;
			this.rect_player2.fillColor = this.default_rect_color;
			this.lab_player2.text = "2";
			this.lab_player2.textColor = 0x757575;

            this.lab_userID3.text = this.default_name ;
			this.rect_player3.fillColor = this.default_rect_color;
			this.lab_player3.text = "3";
			this.lab_player3.textColor = 0x757575;
        }else if(tableID == 3){
            this.lab_userID3.text = this.default_name ;
			this.rect_player3.fillColor = this.default_rect_color;
			this.lab_player3.text = "3";
			this.lab_player3.textColor = 0x757575;
        }
        this.img_owner.visible = false;
		
		
    }

	/**
     * 开始游戏
     */
    private mbuttonStartGameBtn(event:egret.TouchEvent){
        if(this._playerList.length >= GameData.maxPlayerNum){
            GameData.playerUserIds = this._playerList;
            //停止加入房间
            mvs.MsEngine.getInstance.joinOver("joinOver");
        }else{
            console.log("人不够，或者还有人没有准备！");
        }
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
        // let leaveRoomInfo = ev.data;
        // if (this._player0.text === leaveRoomInfo.userId.toString()) {
        //     this._player0.text = '';
        // } else if (this._player1.text === leaveRoomInfo.userId.toString()) {
        //     this._player1.text = '';
        // } else if (this._player2.text === leaveRoomInfo.userId.toString()) {
        //     this._player2.text = '';
        // }
		let data = ev.data;
        console.info("玩家离开",data)
        let userID:number = data.userId;

        /**
         * 是否房主有变动，有变动的话就转移房主
         */
        if(data.owner == GameData.gameUser.id){
            this.isOwner = true;
        }else{
            this.isOwner = false;
        }

        //删除该用户
        this.delPlayerList(userID);
        for(let i = 0; i < this._playerList.length; i++){
            if(data.owner == this._playerList[i].id){
                this._playerList[i].isOwner = true;
            }else{
                this._playerList[i].isOwner = false;
            }
            //重置用户位置并重新显示
            this._playerList[i].tableID = i+1;
            this.showPlayer(this._playerList[i]);
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
        if(data.status == 200){
			this.lab_roomID.text = "房间号:" + data.roomInfo.roomID;
			this._roomID = data.roomInfo.roomID;
			this._isInRoom = true;
            let tableID:number = this._playerList.length+1;
            //房主
            if(data.roomInfo.ownerId == GameData.gameUser.id){
                this.isOwner = true;
            }else{
                this.isOwner = false;
            }
			
            //显示我自己的信息
            this.addPlayerList(GameData.gameUser.id, GameData.gameUser.name, GameData.gameUser.avatar, tableID, this.isOwner);

            
            //如果房间有其他人就显示别人信息
            let userList:Array<any> = data.userList;
            for(let i = 0; i < userList.length; i++){
                tableID++;
                this.otherJoinShowInfo(userList[i].userId, tableID, userList[i].userProfile, data.roomInfo.ownerId == userList[i].userId);
            }
            this.checkStart();

        }else{
            console.info("加入房间失败",data);
        }
    }

	private checkStart(){
        console.info("房间人数："+this._playerList.length);
        if(this._playerList.length == GameData.maxPlayerNum){
            console.info("可以开始游戏");
            //Laya.timer.loop(1000, this, this.countDown);
        }
    }

	/**
     * 显示其他玩家 加入房间 信息
     * @param userID 
     * @param tableID 
     * @param userProfile 
     */
    private otherJoinShowInfo(userID:number, tableID:number, userProfile:string, owner:boolean = false){
        if(userProfile && userProfile !== ""){
            let name = "";
            let avatar = "";
            let userInfo = JSON.parse(userProfile);
            if(userInfo.name){
                name = userInfo.name;
            }
            if(userInfo.avatar){
                avatar = userInfo.avatar;
            }
            this.addPlayerList(userID, name, avatar, tableID, owner);
        }
    }



    /**
     * 加入房间异步回调事件
     */
    private joinRoomNotify(ev:egret.Event) {
        let data = ev.data;
        let userID = data.userId;
        let tableID = this._playerList.length + 1;
        this.otherJoinShowInfo(data.userId, tableID, data.userProfile, data.userId == data.owner);
        //this.checkStart();
    }

    /**
     * 关闭房间回调事件
     */
    private joinOverResponse(ev:egret.Event) {
        // let rsp = ev.data;
        // if (rsp.status === 200) {
        //     console.log("关闭房间成功");
        //     if(this._canStartGame){
        //         //开始游戏
        //         this.notifyGameStart();
        //     }
        // } else {
        //     console.log("关闭房间失败，回调通知错误码：", rsp.status);
        // }
        // Toast.show(" 设置不允许房间加人 " + (rsp.status == 200 ? "success" : "fail"));
        // this._checkbox.selected = ((rsp.status == 200)?false:this._checkbox.selected);
    }

    /**
     * 关闭房间异步回调
     */
    private joinOverNotify(ev:egret.Event) {
        // let notifyInfo = ev.data;
        // console.log("userID:" + notifyInfo.userID + " 关闭房间：" + notifyInfo.roomID + " cpProto:" + notifyInfo.cpProto);
        
        // Toast.show(notifyInfo.userID + " 设置了不允许房间加人");
        // this._checkbox.selected = false;
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
        this._playerList.forEach((element)=>{
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
            this._playerList = [];
            this._playerList .push(GameData.gameUser);
            // 通过游戏开始的玩家会把userIds传过来，这里找出所有除本玩家之外的用户ID，
            // 添加到全局变量playerUserIds中
            JSON.parse(sdnotify.cpProto).userIds.forEach((element)=> {
                let gUser:GameUser = new GameUser;
                gUser.avatar = element.avatar;
                gUser.name = element.name;
                gUser.id = element.id;
                if(gUser.id !==GameData.gameUser.id ){
                    this._playerList.push(gUser);
                }
            });
            GameData.playerUserIds = this._playerList;
            this.release();
            GameSceneView._gameScene.play();
        }
    }

    /**
     * 自己重新打开房间回调
     */
    private joinOpenResponse(ev:egret.Event){
        // let d = ev.data;
        // Toast.show(" 设置允许房间加人 " + (d.status == 200 ? "success" : "fail"));
        // this._checkbox.selected = ((d.status == 200)?true:this._checkbox.selected);
    }

    /**
     * 他人重新打开房间异步
     */
    private joinOpenNotify(ev:egret.Event){
        // let d = ev.data;
        // Toast.show(d.userID + " 设置了允许房间加人");
        // this._checkbox.selected = true;
    }
	
}