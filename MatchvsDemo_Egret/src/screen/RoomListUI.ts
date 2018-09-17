class RoomListUI extends eui.Component implements  eui.UIComponent {


	private btn_return:eui.Button;
	private lab_userID:eui.Label;
	private img_header:eui.Image;
	
	private lab_getInfo:eui.Label;

	private roomItemA:eui.ArrayCollection = new eui.ArrayCollection([]);

	// private _roomList = new Array<RoomItem>();
	private _getRoomListFlter:MsRoomFilter;
	private _roomListSprite:egret.Sprite = null;
	private data_roomList:eui.List;
	private _timer: egret.Timer;
	public constructor() {
		super();
	}

	private getChild(partName:string,instance:any){
		if("lab_userID" == partName){
			this.lab_userID = instance;
			this.lab_userID.text = "用户："+GameData.gameUser.id+"\n"+GameData.gameUser.name;
		}else if("img_header" == partName){
			this.img_header = instance;
			this.img_header.source = GameData.gameUser.avatar;
		}else if("btn_return" == partName){
			this.btn_return = instance;
			this.btn_return.addEventListener(egret.TouchEvent.TOUCH_TAP, this.mbuttonExitRoom, this);
		}else if("data_roomList" == partName){
			this.data_roomList = instance;
		}else if("lab_getInfo" == partName){
			this.lab_getInfo = instance;
		}
	}

	protected partAdded(partName:string,instance:any):void
	{
		super.partAdded(partName,instance);
		this.getChild(partName,instance);
	}


	protected childrenCreated():void
	{
		super.childrenCreated();
		this._roomListSprite = new egret.Sprite();
        this.addChild(this._roomListSprite);
		this.getRoomListEx();
		this._timer = new egret.Timer(2000, 0);
        this._timer.addEventListener(egret.TimerEvent.TIMER, this.timerFunc, this);
        //监听获取房间列表事件
        mvs.MsResponse.getInstance.addEventListener(mvs.MsEvent.EVENT_GETROOMLIST_EX_RSP,this.getRoomListExResponse,this);
        this._timer.start();

	}

	private mbuttonExitRoom(event:egret.TouchEvent){
        this._timer.stop();
        //退出房间成功进入游戏大厅
        GameSceneView._gameScene.lobby();
    }

	 private timerFunc(event: egret.Event) {
        this.getRoomListEx();
    }

	/**
     * 获取房间列表 扩展接口，附带更多的返回信息
     */
    private getRoomListEx():void{
        let filter = new MsRoomFilterEx(GameData.createRoomInfo.maxPlayer,
        GameData.createRoomInfo.mode,
        GameData.createRoomInfo.canWatch,
        GameData.createRoomInfo.roomProperty, 0, 1, 1, 0, 0, 3);
        mvs.MsEngine.getInstance.getRoomListEx(filter);
    }

	/**
     * 获取房间信息列表扩展接口，跟getRoomList接口相比 此接口提供更多的房间信息
     */
    private getRoomListExResponse(ev:egret.Event){
        let rsp:MsGetRoomListExRsp = ev.data;
        if(rsp.status != 200){
			this.lab_getInfo.text = "获取失败!";
            return
        }
        if(rsp.roomAttrs.length == 0){
			this.lab_getInfo.text = "当前没有房间";
			this.data_roomList.dataProvider = new eui.ArrayCollection([]);
            return;
        }
		this.lab_getInfo.text = "";

		this.roomItemA.removeAll();
        for(let i = 0; i < rsp.roomAttrs.length ; i++){
			console.log("房间数据量：",rsp.roomAttrs.length);
			let it = {
				_parent:this,
				_roomID: rsp.roomAttrs[i].roomID,
				_num: rsp.roomAttrs[i].gamePlayer,
				_state:rsp.roomAttrs[i].state,
				_map:rsp.roomAttrs[i].roomProperty,
				_max:rsp.roomAttrs[i].maxPlayer,
			}
			this.roomItemA.addItem(it);
        }
		this.data_roomList.dataProvider = this.roomItemA;
		this.data_roomList.itemRenderer = RoomItem;
    }
    public Release(){
        this._timer.stop();
        mvs.MsResponse.getInstance.removeEventListener(mvs.MsEvent.EVENT_GETROOMLIST_EX_RSP,this.getRoomListExResponse,this);
    }
	
}