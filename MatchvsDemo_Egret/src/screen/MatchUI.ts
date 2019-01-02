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

    private group_map:eui.Group;
    private rad_mapA:eui.RadioButton;
    private rad_mapB:eui.RadioButton;
    private btn_kick2:eui.Button;
    private btn_kick3:eui.Button;

	private lab_roomID:eui.Label;

	private img_owner:eui.Image;


	private btn_return:eui.Button;
	private btn_start:eui.Button;
    private check_closeRoom:eui.CheckBox;

	private joinFlag:number = 1;
	private joinInfo:any;
	private _isInRoom:boolean = false;
	private isOwner:boolean = false;
    private canStartGame:boolean = false;
	public  _playerList:Array<GameUser> = [];
	private _roomID:string = "";


	private default_name = "待加入";
	private default_rect_color = 0x555555;
	
	public constructor() {
		super();
        this.initView();
	}

    private initView(){
        this.addMsResponseListen();
        GameData.roomPropertyValue = GameData.roomPropertyType.mapA;
    }

	private getChilds(partName:string,instance:any){
		switch(partName){
			case "lab_roomID":
			this.lab_roomID = instance;
			break;
            case "group_map":
			this.group_map = instance;
            this.group_map.visible = false;
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
			case "img_owner":
                this.img_owner = instance;
                this.img_owner.visible = false;
			break;
			case "btn_start":
                this.btn_start = instance;
                this.btn_start.enabled = false;
                this.btn_start.addEventListener(egret.TouchEvent.TOUCH_TAP, this.mbuttonStartGameBtn, this);
			break;
			case "btn_return":
                this.btn_return = instance;
                this.btn_return.addEventListener(egret.TouchEvent.TOUCH_TAP, this.mbuttonLeaveRoom, this);
            break;
            case "rad_mapA":
                this.rad_mapA = instance;
                this.rad_mapA.enabled = false;
                this.rad_mapA.addEventListener(egret.TouchEvent.TOUCH_TAP, this.radioChangeHandler, this);
            break;
            case "rad_mapB":
                this.rad_mapB = instance;
                this.rad_mapB.enabled = false;
                this.rad_mapB.addEventListener(egret.TouchEvent.TOUCH_TAP, this.radioChangeHandler, this);
            break;
            case "btn_kick2":
                this.btn_kick2 = instance;
                this.btn_kick2.visible = false;
                this.btn_kick2.addEventListener(egret.TouchEvent.TOUCH_TAP, this.btnKickPlayerClick, this);
            break;
            case "btn_kick3":
                this.btn_kick3 = instance;
                this.btn_kick3.visible = false;
                this.btn_kick3.addEventListener(egret.TouchEvent.TOUCH_TAP, this.btnKickPlayerClick, this);
            break;
            case "check_closeRoom":
                this.check_closeRoom = instance;
                this.check_closeRoom.addEventListener(egret.Event.CHANGE, ()=>{
                    this.check_closeRoom.label = this.check_closeRoom.selected ? "允许加入":"禁止加入";
                    this.check_closeRoom.selected ? mvs.MsEngine.getInstance.joinOpen("x") : mvs.MsEngine.getInstance.joinOver("x");
                }, this);
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

        //创建房间事件
        mvs.MsResponse.getInstance.addEventListener(mvs.MsEvent.EVENT_CREATEROOM_RSP,this.createRoomResponse, this);

        //踢人事件
        mvs.MsResponse.getInstance.addEventListener(mvs.MsEvent.EVENT_KICKPLAYER_RSP, this.kickPlayerResponse,this);
        mvs.MsResponse.getInstance.addEventListener(mvs.MsEvent.EVENT_KICKPLAYER_NTFY, this.kickPlayerNotify,this);

        //设置帧同步
        mvs.MsResponse.getInstance.addEventListener(mvs.MsEvent.EVENT_NETWORKSTATE_NTFY,  this.networkStateNotify,this);

        //设置房间属性
        mvs.MsResponse.getInstance.addEventListener(mvs.MsEvent.EVENT_SETROOMPROPERTY_RSP, this.setRoomPropertyResponse,this);
        mvs.MsResponse.getInstance.addEventListener(mvs.MsEvent.EVENT_SETROOMPROPERTY_NTFY, this.setRoomPropertynotify,this);
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

        //创建房间事件
        mvs.MsResponse.getInstance.removeEventListener(mvs.MsEvent.EVENT_CREATEROOM_RSP,this.createRoomResponse, this);

        //踢人事件
        mvs.MsResponse.getInstance.removeEventListener(mvs.MsEvent.EVENT_KICKPLAYER_RSP, this.kickPlayerResponse,this);
        mvs.MsResponse.getInstance.removeEventListener(mvs.MsEvent.EVENT_KICKPLAYER_NTFY, this.kickPlayerNotify,this);

        //设置帧同步
        mvs.MsResponse.getInstance.removeEventListener(mvs.MsEvent.EVENT_NETWORKSTATE_NTFY,  this.networkStateNotify,this);

        //设置房间属性
        mvs.MsResponse.getInstance.removeEventListener(mvs.MsEvent.EVENT_SETROOMPROPERTY_RSP, this.setRoomPropertyResponse,this);
        mvs.MsResponse.getInstance.removeEventListener(mvs.MsEvent.EVENT_SETROOMPROPERTY_NTFY, this.setRoomPropertynotify,this);
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
            this.lab_matchmode.text = "（随机匹配）";
            this.joinRandRoom();
        }else if(flag == 2){
            this.createRoom();
        }else if(flag == 3){
            this.joinWithRoomID(info);
            this.lab_matchmode.text = "";
        }else if(flag == 4){
            if(GameData.syncFrame){
                this.lab_matchmode.text = "（帧同步匹配）";
                info = {"match":"frameSync"}
            }else{
                this.lab_matchmode.text = "（自定义属性匹配）";
            }
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
        if(this.joinFlag == MatchUI.JOINFLAG.CREATEROOM || this.joinFlag == MatchUI.JOINFLAG.WITHROOMID){
            this.group_map.visible = true;
            this.rad_mapA.enabled = this.isOwner;
            this.rad_mapB.enabled = this.isOwner;
            console.log("mapValue:",this.rad_mapA.value);
            console.log("mapValue:",this.rad_mapB.value);
            this.btn_start.visible = this.isOwner;
            this.img_owner.visible = this.isOwner;
            if(tableID == 2 || tableID == 3){
                this["btn_kick"+tableID].visible = this.isOwner;
            }
        }else{
			this.btn_start.visible = false;
            this.group_map.visible = false;
		}

        this.check_closeRoom.visible = !this.canStartGame;
        this.check_closeRoom.enabled = this.isOwner;

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
            this.btn_kick2.visible = false;
            this.btn_kick3.visible = false;
            
        }else if(tableID == 2){
            this.lab_userID2.text = this.default_name;
			this.rect_player2.fillColor = this.default_rect_color;
			this.lab_player2.text = "2";
			this.lab_player2.textColor = 0x757575;

            this.lab_userID3.text = this.default_name ;
			this.rect_player3.fillColor = this.default_rect_color;
			this.lab_player3.text = "3";
			this.lab_player3.textColor = 0x757575;

            this.btn_kick2.visible = false;
            this.btn_kick3.visible = false;
        }else if(tableID == 3){
            this.lab_userID3.text = this.default_name ;
			this.rect_player3.fillColor = this.default_rect_color;
			this.lab_player3.text = "3";
			this.lab_player3.textColor = 0x757575;

            this.btn_kick3.visible = false;
        }
        this.img_owner.visible = false;
		
		
    }

    /**
     * 擦除用户，再次显示用户
     * @param userID 
     * @param owner 
     */
    private wipePlayerLocation(userID:number, owner:number){

        this.isOwner = owner == GameData.gameUser.id;
        this.delPlayerList(userID);
        for(let i = 0; i < this._playerList.length; i++){
            
            this._playerList[i].isOwner = owner == this._playerList[i].id
            //重置用户位置并重新显示
            this._playerList[i].tableID = i+1;
            this.showPlayer(this._playerList[i]);
        }
    }

    /**
     * 地图改变事件
     */
    private radioChangeHandler(evt:eui.UIEvent):void {
        if(evt.target.value == 0){
            //地图A
            GameData.roomPropertyValue = GameData.roomPropertyType.mapA;
            mvs.MsEngine.getInstance.setRoomProperty(this._roomID,GameData.roomPropertyType.mapA);
        }else {
            //地图B
            GameData.roomPropertyValue = GameData.roomPropertyType.mapB;
            mvs.MsEngine.getInstance.setRoomProperty(this._roomID,GameData.roomPropertyType.mapB);
        }
        console.log("日志选择：", GameData.roomPropertyValue);
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

    
    private btnKickPlayerClick(e:egret.TouchEvent){
        let tableid = 0;
        if(e.target.name == "btn_kick2"){
            tableid = 2;
        }else if(e.target.name == "btn_kick3"){
            tableid = 3;
        }
        let user:GameUser = this.getUserForTableID(tableid);
        if(user == null){
            console.info("用户不存在");
            return;
        }
        mvs.MsEngine.getInstance.kickPlayer(user.id, "我们不能一起好好的玩游戏");
    }

    private getUserForTableID(tableid:number):GameUser{
        let user:GameUser = null;
        this._playerList.forEach((p)=>{
            if(p.tableID == tableid){
                user = p;
            }
        });
        return user;
    }

    /**
     * 他人离开房间回调
     */
    private leaveRoomNotify(ev:egret.Event) {
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
        this.canStartGame = false;
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
     * 创建房间回调
     */
    private createRoomResponse(e:egret.Event){
        let data = e.data;
        if(data.status == 200){
            let tableID:number = 1;
            //房主
            if(data.owner == GameData.gameUser.id){
                this.isOwner = true;
            }else{
                this.isOwner = false;
            }
            //显示我自己的信息
            this.addPlayerList(GameData.gameUser.id, GameData.gameUser.name, GameData.gameUser.avatar, tableID, this.isOwner);
            this.lab_roomID.text = "房间号:" + data.roomID;
            this._roomID = data.roomID;
            GameData.roomID =  data.roomID;
            this._isInRoom = true;
        }else{
            console.info("加入房间失败",data);
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
            GameData.roomID = data.roomInfo.roomID;
			this._isInRoom = true;
            
            GameData.gameUser.isOwner = false;
            //房主
            if(data.roomInfo.ownerId == GameData.gameUser.id){
                this.isOwner = true;
            }else{
                this.isOwner = false;
            }

            //地图
            if(data.roomInfo.roomProperty === GameData.roomPropertyType.mapB){
                GameData.roomPropertyValue = GameData.roomPropertyType.mapB
                this.rad_mapB.selected = true;
            }else{
                GameData.roomPropertyValue = GameData.roomPropertyType.mapA
                this.rad_mapA.selected = true;
            }


			let tableID:number =  1;
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
            this.canStartGame = true;
            this.check_closeRoom.visible = false;
            if(this.joinFlag == MatchUI.JOINFLAG.CREATEROOM || this.joinFlag == MatchUI.JOINFLAG.WITHROOMID){
                this.btn_start.visible = this.isOwner;
                this.btn_start.enabled = this.isOwner;
            }else{
                if(this.isOwner){
                    mvs.MsEngine.getInstance.joinOver("人满开始游戏");
                }
                this.btn_start.visible = false;
                this.btn_start.enabled = false;
                
            }
        }else{
            this.canStartGame = false;
            this.btn_start.enabled = false;
            this.check_closeRoom.visible = true;
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
        this.checkStart();
    }

    

    /**
     * 开始游戏
     */
    private notifyGameStart() {
        GameData.isRoomOwner = true;
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
        console.log("收到消息", ev.data);
        let sdnotify = ev.data;
        if (sdnotify
            && sdnotify.cpProto
            && sdnotify.cpProto.indexOf(GameData.gameStartEvent) >= 0) {
            GameData.playerUserIds = this._playerList;
            this.release();
            GameSceneView._gameScene.play();
        }
    }

    /**
     * 关闭房间回调事件
     */
    private joinOverResponse(ev:egret.Event) {
        let rsp = ev.data;
        if (rsp.status === 200) {
            console.log("关闭房间成功");
            if(this.canStartGame){
                //开始游戏
                this.notifyGameStart();
                GameData.playerUserIds = this._playerList;
                return;
            }
        } else {
            console.log("关闭房间失败，回调通知错误码：", rsp.status);
        }
        Toast.show(" 设置不允许房间加人 " + (rsp.status == 200 ? "success" : "fail"));
        this.check_closeRoom.selected = ((rsp.status == 200)?false:this.check_closeRoom.selected);
    }

    /**
     * 关闭房间异步回调
     */
    private joinOverNotify(ev:egret.Event) {
        let notifyInfo = ev.data;
        console.log("userID:" + notifyInfo.userID + " 关闭房间：" + notifyInfo.roomID + " cpProto:" + notifyInfo.cpProto);
        Toast.show(notifyInfo.userID + " 设置了不允许房间加人");
        this.check_closeRoom.selected = false;
        this.check_closeRoom.label = "禁止加入";
    }

    /**
     * 自己重新打开房间回调
     */
    private joinOpenResponse(ev:egret.Event){
        let d = ev.data;
        Toast.show(" 设置允许房间加人 " + (d.status == 200 ? "success" : "fail"));
        this.check_closeRoom.selected = ((d.status == 200)?true:this.check_closeRoom.selected);
    }

    /**
     * 他人重新打开房间异步
     */
    private joinOpenNotify(ev:egret.Event){
        let d = ev.data;
        Toast.show(d.userID + " 设置了允许房间加人");
        this.check_closeRoom.selected = true;
        this.check_closeRoom.label = "允许加入";
    }


    private cancelStart(userID:number, roomID:string){
        this.btn_start.enabled = false ;
        this.btn_start.visible = this.isOwner ;
        this.canStartGame = false;
        this.check_closeRoom.visible = true;
    }

    /**
     * 剔除指定房间成功
     * @param e 
     */
    private kickPlayerResponse(ev:egret.Event){
        let data = ev.data;
        this.cancelStart(data.userID, this._roomID);
        this.wipePlayerLocation(data.userID, data.owner);
    }

    /**
     * 有玩家被剔除
     * @param e 
     */
    private kickPlayerNotify(e:egret.Event){
        let data = e.data;
        console.info("玩家离开",data);
        if(data.userID == GameData.gameUser.id){
            this.release();
            GameSceneView._gameScene.lobby();
        }else{
            this.cancelStart(data.userID, this._roomID);
            this.wipePlayerLocation(data.userID, data.owner);
        }
    }

    /**
     * 有人断开
     */
    private networkStateNotify(e:egret.Event){
        let data = e.data;
        let userID = data.userID;
        this.cancelStart(userID, data.roomID);
        if(data.state = 1){
            console.info("玩家断开:"+userID);
            mvs.MsEngine.getInstance.kickPlayer(userID, "玩家断线踢掉");
        }else if( data.state == 2){
            console.info("玩家正在从新连接..."+userID);
        }else{
            console.info("玩家离开"+userID);
            this.wipePlayerLocation(data.userID, data.owner);
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
            this.rad_mapB.selected = true;
        }else{
            GameData.roomPropertyValue = GameData.roomPropertyType.mapA;
            this.rad_mapA.selected = true;
        }
    }

    /**
     * 自己设置房间数据回调事件
     */
    private setRoomPropertyResponse(ev:egret.Event):void{
        console.log("roomProperty = "+ev.data.roomProperty);
    }
}