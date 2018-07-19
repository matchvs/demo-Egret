class ReconnectView extends egret.DisplayObjectContainer{
    
    private _timer:egret.Timer;
    private _msglabel:eui.Label = new eui.Label();
    private _reconnctTimes:number = 1;
    private _totalTimes:number = 5;

    public _parent:egret.DisplayObjectContainer;
    constructor(par?:egret.DisplayObjectContainer){
        super();
        if(par){
            this._parent = par;
        }else{
            par = this;
        }
        this.initView();
    }


    	/**
	 * 注册 matchvs 组件监听事件
	 */
	private addMsResponseListen(){
        
        //重新连接
		mvs.MsResponse.getInstance.addEventListener(mvs.MsEvent.EVENT_RECONNECT_RSP, this.reconnectResponse,this);

        mvs.MsResponse.getInstance.addEventListener(mvs.MsEvent.EVENT_ERROR_RSP, this.errorResponse,this);
        //离开房间
        mvs.MsResponse.getInstance.addEventListener(mvs.MsEvent.EVENT_LEAVEROOM_RSP, this.leaveRoomResponse,this);
       
        //获取房间详情
		// mvs.MsResponse.getInstance.addEventListener(mvs.MsEvent.EVENT_GETROOMDETAIL_RSP, this.getRoomDetailResponse,this);
        
        //发送消息
		mvs.MsResponse.getInstance.addEventListener(mvs.MsEvent.EVENT_SENDEVENT_RSP, this.sendEventResponse,this);

    }

    public release(){

        mvs.MsResponse.getInstance.removeEventListener(mvs.MsEvent.EVENT_ERROR_RSP, this.errorResponse,this);
        //离开房间
        mvs.MsResponse.getInstance.removeEventListener(mvs.MsEvent.EVENT_LEAVEROOM_RSP, this.leaveRoomResponse,this);
        //发送消息
		mvs.MsResponse.getInstance.removeEventListener(mvs.MsEvent.EVENT_SENDEVENT_RSP, this.sendEventResponse,this);

        //获取房间详情
		// mvs.MsResponse.getInstance.removeEventListener(mvs.MsEvent.EVENT_GETROOMDETAIL_RSP, this.getRoomDetailResponse,this);
        //重新连接
		mvs.MsResponse.getInstance.removeEventListener(mvs.MsEvent.EVENT_RECONNECT_RSP, this.reconnectResponse,this);
    }

    public initView(){
        this.addMsResponseListen();
        let spt = new egret.Sprite();
        spt.graphics.beginFill(0x555555, 0);
        spt.graphics.drawRect( 0, 0, this._parent.width, this._parent.height );
        spt.graphics.endFill();
        this.addChild( spt ); 

        this._msglabel = new eui.Label();
        this._msglabel.text = "正在重新连接......"+this._reconnctTimes+"/"+this._totalTimes;
        this._msglabel.x = this._parent.width*0.4;
        this._msglabel.y = this._parent.height*0.2;
        this._msglabel.size = 22;
        spt.addChild(this._msglabel);

        let cancleBtn = new eui.Button();
        cancleBtn.label = "取消";
        cancleBtn.x = this._parent.width*0.4;
        cancleBtn.y = this._parent.height*0.8;
        cancleBtn.width = this._parent.width*0.2;
        cancleBtn.height = 40;
        cancleBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.mbuttonCancleBtn, this);
        spt.addChild(cancleBtn);

        this._timer = new egret.Timer(1000, 5);
        this._timer.addEventListener(egret.TimerEvent.TIMER, this.timerFunc, this);
        this._timer.start();

    }

    private timerFunc(event: egret.Event){
        this._msglabel.text = "正在重新连接......"+this._reconnctTimes+"/"+this._totalTimes;
        console.log(this._msglabel.text)
        let res = mvs.MsEngine.getInstance.reconnect();
        this._reconnctTimes++;
        if(this._reconnctTimes > this._totalTimes){
            this._timer.stop();
            if(res === 0){
                mvs.MsEngine.getInstance.leaveRoom("");
                GameSceneView._gameScene.lobby();
            }else{
                mvs.MsEngine.getInstance.leaveRoom("");
                GameSceneView._gameScene.login();
            }
            this.release();
        }
    }


    private reconnectResponse(envet:egret.Event){
        console.log("重新连接成功");
        let data = envet.data;
        let roomUserInfoList = data.roomUserInfoList;
        let roomInfo:MsRoomInfo = data.roomInfo;
        this._timer.stop();
        if(!data.status || data.status !== 200){
            console.log("重连失败"+this._reconnctTimes);
            this._msglabel.text = "重连失败......"+this._reconnctTimes+"/"+this._totalTimes;
            //mvs.MsEngine.getInstance.leaveRoom("");
            this.release();
            GameSceneView._gameScene.lobby();
        }else{
            console.log("重连成功status:"+data.status+" 重连次数："+this._reconnctTimes);
            //房主判断
            GameData.playerUserIds = [];
            GameData.playerUserIds.push(GameData.gameUser);
            roomUserInfoList.forEach((value)=>{
                 console.log("用户ID："+value.userId);
                if (GameData.gameUser.id !== value.userId) {
                    //先默认为空的
                    let userPro = {name:"",avatar:""};
                    if(value.userProfile !== ""){
                        userPro = JSON.parse(value.userProfile);
                    }
                    let gUser:GameUser = new GameUser;
                    gUser.avatar = userPro.avatar;
                    gUser.name = userPro.name;
                    gUser.id = value.userId;
                    GameData.playerUserIds.push(gUser);
                }
            });
            GameData.roomPropertyValue = roomInfo.roomProperty;
            GameData.roomID = roomInfo.roomID;
            GameData.isRoomOwner = false;
            if(GameData.playerUserIds.length === GameData.maxPlayerNum && roomInfo.state === 2){
                // mvs.MsEngine.getInstance.getRoomDetail(GameData.roomID);
                this.sendReadyEvent()
            }else{
                //还没有开始游戏
                console.log("还没有开始游戏或者游戏结束, 退出到大厅");
                mvs.MsEngine.getInstance.leaveRoom("leaveRoom");
                this.release();
                GameSceneView._gameScene.lobby();
            }
        }
    }

    private sendEventResponse(ev:egret.Event){
        let rsp:MsSendEventRsp = ev.data;
        if(rsp.status === 200){
            var event = GameData.events[rsp.sequence]
            if (event && event.action === GameData.reconnectReadyEvent) {
                delete GameData.events[rsp.sequence];
                this.release();
                GameSceneView._gameScene.play();
            }
        }else{
             this.release();
            mvs.MsEngine.getInstance.leaveRoom("leaveRoom");
            GameSceneView._gameScene.lobby();
        }
    }

    private errorResponse(event:egret.Event){
        this._timer.stop();
    }

    private mbuttonCancleBtn(event:egret.TouchEvent){
        this._timer.stop();
        this.release();
        mvs.MsEngine.getInstance.leaveRoom("");
    }

    private leaveRoomResponse(rsp:MsLeaveRoomRsp){
        console.log("取消重新连接，离开房间:"+rsp.status)
        // this.release();
        // GameSceneView._gameScene.lobby();
    }
    // private getRoomDetailResponse(event:egret.Event){
    //     let rsp:MsGetRoomDetailRsp = event.data;
    //     // console.log("status:"+rsp.status+" 还没有开始游戏或者游戏结束, 退出到大厅：state="+rsp.state);
    //     if(rsp.status === 200 && rsp.state === 2){
    //         this.sendReadyEvent()
    //     }else{
    //         this.release();
    //         mvs.MsEngine.getInstance.leaveRoom("leaveRoom");
    //         GameSceneView._gameScene.lobby();
    //     }
    // }

    private sendReadyEvent(){
        let eventTemp = {
                action: GameData.reconnectReadyEvent,
                userID: GameData.gameUser.id
            }
            let result = mvs.MsEngine.getInstance.sendEvent(JSON.stringify(eventTemp));
            
            if (!result || result.result !== 0) {
                console.log('重连发送信息失败');
                mvs.MsEngine.getInstance.leaveRoom("leaveRoom");
                GameSceneView._gameScene.lobby();
                this.release();
                return
            }
            GameData.events[result.sequence] = eventTemp;
            console.log('重连发送信息成功');
    }
}