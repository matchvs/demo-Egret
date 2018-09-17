class RoomItem extends eui.ItemRenderer {

	private _roomID:string;
	private _state:number;
	private _num:number;
	private _max:number;
	private _map:string;

	private _parent:RoomListUI = null;

	private btn_enter:eui.Button;
	private lab_roomID:eui.Label;
	private lab_roomNum:eui.Label;
	private lab_state:eui.Label;
	private lab_map:eui.Label;

	private isme:boolean = false;

	public constructor(pt ?:RoomListUI){
        super();
        this._parent = pt;
		this.skinName = "RoomItemSkin";
    }

	protected partAdded(partName:string,instance:any):void
	{
		super.partAdded(partName,instance);
	}

	private showInfo(roomID:string, state:number, num:number, maxNum:number, map:string){
		
		this.lab_roomID.text = "房间号：" + roomID;

		let stateStr:string = state == 1 ? "待加入":"已关闭";
		this.lab_state.text = "房间状态：" + stateStr;

		let mapValue:string = map === GameData.roomPropertyType.mapA ? "彩图":"灰图";
		this.lab_map.text = "地图：" + mapValue;

		this.lab_roomNum.text = "房间人数：" + num + "/"+ maxNum;
		 mvs.MsResponse.getInstance.removeEventListener(mvs.MsEvent.EVENT_GETROOMDETAIL_RSP, this.getRoomDetailResponse, this);
		mvs.MsResponse.getInstance.addEventListener(mvs.MsEvent.EVENT_GETROOMDETAIL_RSP, this.getRoomDetailResponse, this);
	}

	protected childrenCreated():void
	{
		super.childrenCreated();
		this.btn_enter.addEventListener(egret.TouchEvent.TOUCH_TAP, this.mbuttonEnterRoom, this);
	}

	protected dataChanged():void {
		super.dataChanged();
		this._parent = this.data._parent;
		this.layContents(this.data._roomID,this.data._state,this.data._num, this.data._max, this.data._map);
		this.showInfo(this._roomID, this._state, this._num, this._max, this._map);
	}

	/**
     * 创建内容
     */
    public layContents(roomID:string, state:number, num:number, max:number, map:string):void {
		this._roomID = roomID;
		this._state = state;
		this._num = num;
		this._max = max;
		this._map = map;
    }

	private getRoomDetail(roomID:string){
        mvs.MsEngine.getInstance.getRoomDetail(roomID);
    }

    private getRoomDetailResponse(ev:egret.Event){
        let rsp:MsGetRoomDetailRsp = ev.data;
        if(rsp.status !== 200){
            console.log("getRoomDetailResponse error status:"+ rsp.status);
            return;
        }
        
        if(rsp.state === 1){
            console.log("检查房间状态为：开放状态可以进入");
			this.Release();
			if(this.isme){
				GameSceneView._gameScene.match(MatchUI.JOINFLAG.WITHROOMID,this._roomID);
			}
        }else{
            console.log("检查房间状态为：关闭状态不可以进入，请刷新房间列表");
        }
    }

    private mbuttonEnterRoom(event:egret.TouchEvent){
		console.log("点击按钮加入房间号：",this._roomID);
		this.isme = true;
        this.getRoomDetail(this._roomID);
    }

    public removeEventListe(){
        mvs.MsResponse.getInstance.removeEventListener(mvs.MsEvent.EVENT_GETROOMDETAIL_RSP, this.getRoomDetailResponse, this);
        this.btn_enter.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.mbuttonEnterRoom, this);
    }

    public Release(){
        this._parent.Release();
        this.removeEventListe()
    }
	
}