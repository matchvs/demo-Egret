class MatchProperty extends eui.Component implements  eui.UIComponent {

	private rad_A:eui.RadioButton;
	private rad_B:eui.RadioButton;

	private btn_start:eui.Button;
	private btn_return:eui.Button;
	private lab_userID:eui.Label;

	private img_header:eui.Image;

	private _tagsType:any={"match":"tagsA"};

	public constructor() {
		super();
	}

	private getChild(partName:string,instance:any){
		if("rad_A" == partName){
			this.rad_A = instance;
			this.rad_A.addEventListener(eui.UIEvent.CHANGE, this.radioChangeHandler, this);
		}else if("rad_B" == partName){
			this.rad_B = instance;
			this.rad_B.addEventListener(eui.UIEvent.CHANGE, this.radioChangeHandler, this);
		}else if("btn_start" == partName){
			this.btn_start = instance;
			this.btn_start.addEventListener(egret.TouchEvent.TOUCH_TAP, this.mButtonMatchTouch, this);
		}else if("lab_userID" == partName){
			this.lab_userID = instance;
			this.lab_userID.text = "用户："+GameData.gameUser.id+"\n"+GameData.gameUser.name;
		}else if("img_header" == partName){
			this.img_header = instance;
			this.img_header.source = GameData.gameUser.avatar;
		}else if("btn_return" == partName){
			this.btn_return = instance;
			this.btn_return.addEventListener(egret.TouchEvent.TOUCH_TAP, this.mbuttonExitRoom, this);
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
	}

	private mbuttonExitRoom(event:egret.TouchEvent){
        //退出房间成功进入游戏大厅
        GameSceneView._gameScene.lobby();
    }

	private radioChangeHandler(evt:eui.UIEvent):void {
        if(evt.target.value === 0){
            //属性A
            this._tagsType = {"match":"tagsA"};
        }else {
            //属性B
            this._tagsType = {"match":"tagsB"};
        }
        console.log("tags ="+this._tagsType["match"]);
    }

	private mButtonMatchTouch(evt:egret.TouchEvent){
        GameData.matchType = GameData.tagsMatch;
        GameData.syncFrame = false;
        GameSceneView._gameScene.match(MatchUI.JOINFLAG.WITHPROPERTY, this._tagsType);
    }
	
}