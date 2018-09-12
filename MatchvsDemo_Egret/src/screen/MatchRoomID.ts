class MatchRoomID extends eui.Component implements  eui.UIComponent {
	
	private btn_return:eui.Button;
	private lab_userID:eui.Label;
	private img_header:eui.Image;

	private btn_start:eui.Button;
	private edt_roomID:eui.EditableText;
	private lab_note:eui.Label;
	private rect_roomID:eui.Rect;
	
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
		}else if("lab_note" == partName){
			this.lab_note = instance;
			this.lab_note.visible = false;
		}else if("btn_return" == partName){
			this.btn_return = instance;
			this.btn_return.addEventListener(egret.TouchEvent.TOUCH_TAP, this.mbuttonExitRoom, this);
		}else if("btn_start" == partName){
			this.btn_start = instance;
			this.btn_start.addEventListener(egret.TouchEvent.TOUCH_TAP, this.mbuttonEnterRoom, this);
		}else if("rect_roomID" == partName){
			this.rect_roomID = instance;
		}else if("edt_roomID" == partName){
			this.edt_roomID = instance;
			this.edt_roomID.addEventListener(eui.UIEvent.CHANGE, (e)=>{
				this.roomIDIsOK();
			}, this);
		}
	}

	private roomIDIsOK(){
		var str:string  = this.edt_roomID.text;
		if(str == ""){
			this.showNote("",false);
			return;
		}
		if (!/^[0-9]+$/.test(str)){
			this.showNote("请求输入有效的房间号",true);
		}else{
			this.showNote("",false);
		}
	}


	protected partAdded(partName:string,instance:any):void
	{
		super.partAdded(partName,instance);
		this.getChild(partName, instance);
	}


	protected childrenCreated():void
	{
		super.childrenCreated();
	}

	private showNote(cont:string, flag:boolean){
		this.lab_note.visible = flag;
		this.lab_note.text = cont;
		if(flag){
			this.rect_roomID.strokeWeight = 2;
			this.rect_roomID.strokeColor = 0xF85858;
			this.rect_roomID.fillColor = 0xFFE5E5;
		}else{
			this.rect_roomID.strokeWeight = 0;
			this.rect_roomID.strokeColor = 0xFFFFFF;
			this.rect_roomID.fillColor = 0xFFFFFF;
		}
	}

	private mbuttonExitRoom(event:egret.TouchEvent){
        //退出房间成功进入游戏大厅
        GameSceneView._gameScene.lobby();
    }

	private mbuttonEnterRoom(event:egret.TouchEvent){
        let str:string  = this.edt_roomID.text;
        if (!/^[0-9]+$/.test(str) || str == ""){
            this.showNote("无效的房间号",true);
            return
        }
        let info = {name:GameData.gameUser.name,avatar:GameData.gameUser.avatar};
		let infostr = JSON.stringify(info);
		let getRoomListFlter = new MsRoomFilter(GameData.maxPlayerNum,0,0,"");
		mvs.MsResponse.getInstance.addEventListener(mvs.MsEvent.EVENT_GETROOMLIST_RSP,this.getRoomListResponse,this);
		mvs.MsEngine.getInstance.getRoomList(getRoomListFlter);
        
    }


	/**
     * 获取房间列表 简单版接口，现在没有使用
     */
    private getRoomListResponse(ev:egret.Event){
		let status = ev.data.status;
		let roomInfos = ev.data.roomInfos;
        if( status !== 200){
			this.showNote("房间查询错误"+status, true);
            return
        }
		let str:string  = this.edt_roomID.text;
		let ex = false;
        for(let i = 0; i < roomInfos.length; i++){
			if(roomInfos[i].roomID == str.trim()){
				ex = true;
			}
        }
		if(ex == false){
			this.showNote("没有查找到此房间，请重新输入", true);
			return;
		}
		mvs.MsResponse.getInstance.removeEventListener(mvs.MsEvent.EVENT_GETROOMLIST_RSP,this.getRoomListResponse,this);
		GameSceneView._gameScene.match(MatchUI.JOINFLAG.WITHROOMID, str.trim());
    }
	
}