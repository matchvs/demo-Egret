class GameResult extends eui.Component implements  eui.UIComponent {
	
	private lab_userID1:eui.Label;
	private lab_userID2:eui.Label;
	private lab_userID3:eui.Label;
	private lab_score1:eui.Label;
	private lab_score2:eui.Label;
	private lab_score3:eui.Label;
	private lab_roomID:eui.Label;

	private btn_leave:eui.Button;
	

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
	}

	//
	private setResult(uses:Array<GameUser>){
		for(let i = 0; i < uses.length; i++){
			let us:GameUser = new GameUser();
			us.avatar = uses[i].avatar;
			us.id = uses[i].id;
			us.isOwner = uses[i].isOwner;
			us.name = uses[i].name;
			us.tableID = uses[i].tableID;
			us.pValue = uses[i].pValue;
		}

	}

	// private showResutl(){
	// 	for(let i = 0; i < uses.length; i++){
	// 		uses[i].avatar;
	// 		uses[i].id;
	// 		uses[i].isOwner;
	// 		uses[i].name;
	// 		uses[i].tableID;
	// 		uses[i].pValue;
	// 	}
	// }
	
	private mbuttonExitRoom(event:egret.TouchEvent){
        //退出房间成功进入游戏大厅
        GameSceneView._gameScene.lobby();
    }


}