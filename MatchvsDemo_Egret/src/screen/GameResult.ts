class GameResult extends eui.Component implements  eui.UIComponent {
	
	private lab_userID1:eui.Label;
	private lab_userID2:eui.Label;
	private lab_userID3:eui.Label;
	private lab_score1:eui.Label;
	private lab_score2:eui.Label;
	private lab_score3:eui.Label;
	private lab_roomID:eui.Label;

	private btn_leave:eui.Button;
	private roomID:string;
	

	private _userList:Array<GameUser> =  [];

	public constructor() {
		super();
	}

	private getChilds(partName:string,instance:any){
		if( "lab_userID1" == partName){
			this.lab_userID1 = instance;
		}else if( "lab_userID2" == partName){
			this.lab_userID2 = instance;
		}else if( "lab_userID3" == partName){
			this.lab_userID3 = instance;
		}else if( "lab_score1" == partName){
			this.lab_score1 = instance;
		}else if( "lab_score2" == partName){
			this.lab_score2 = instance;
		}else if( "lab_score3" == partName){
			this.lab_score3 = instance;
		}else if( "btn_leave" == partName){
			this.btn_leave = instance;
			this.btn_leave.addEventListener(egret.TouchEvent.TOUCH_TAP, this.mbuttonExitRoom, this);
		}else if( "lab_roomID" == partName){
			this.lab_roomID = instance;
		}
	}

	protected partAdded(partName:string,instance:any):void
	{
		super.partAdded(partName,instance);
		this.getChilds(partName,instance);
	}

	protected childrenCreated():void
	{
		super.childrenCreated();
		this.showResutl();
	}

	//
	public setResult(uses:Array<GameUser>, room:string){
		this.roomID = room;
		for(let i = 0; i < uses.length; i++){
			let us:GameUser = new GameUser();
			us.avatar = uses[i].avatar;
			us.id = uses[i].id;
			us.isOwner = uses[i].isOwner;
			us.name = uses[i].name;
			us.tableID = uses[i].tableID;
			us.pValue = uses[i].pValue;
			this._userList.push(us);
		}
	}

	private showResutl(){
		this.lab_roomID.text = "房间号：" + this.roomID;
		let table2:boolean = false;
		for(let i = 0; i < this._userList.length; i++){
			if(this._userList[i].isOwner){
				this["lab_userID"+1].text = this._userList[i].id;
				this["lab_score"+1].text = this._userList[i].pValue;
			}else{
				if(table2){
					this["lab_userID"+3].text = this._userList[i].id;
					this["lab_score"+3].text = this._userList[i].pValue;
				}else{
					this["lab_userID"+2].text = this._userList[i].id;
					this["lab_score"+2].text = this._userList[i].pValue;
					table2 = true;
				}
			}
			
		}
	}
	
	private mbuttonExitRoom(event:egret.TouchEvent){
        console.log("onButtonLeaveRoom");
		mvs.MsEngine.getInstance.leaveRoom("游戏玩完一次离开");
		GameSceneView._gameScene.lobby();
		GameData.isRoomOwner = false;
		GameData.syncFrame = false;
    }

}