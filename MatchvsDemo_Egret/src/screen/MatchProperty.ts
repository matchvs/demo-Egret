class MatchProperty extends eui.Component implements  eui.UIComponent {

	private rad_A:eui.RadioButton;
	private rad_B:eui.RadioButton;

	private btn_start:eui.Button;
	private btn_return:eui.Button;
	private lab_userID:eui.Label;
	private lab_A:eui.Label;
	private lab_B:eui.Label;

	private img_header:eui.Image;

	private _tagsType:any={"match":"tagsA"};

	private rect_proA:eui.Rect;
	private rect_proB:eui.Rect;

	public constructor() {
		super();
	}

	private getChild(partName:string,instance:any){
		if("rad_A" == partName){
			this.rad_A = instance;
			this.rad_A.addEventListener(egret.Event.CHANGE, this.radioChangeHandler, this);
		}else if("rad_B" == partName){
			this.rad_B = instance;
			this.rad_B.addEventListener(egret.Event.CHANGE, this.radioChangeHandler, this);
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
		}else if("rect_proA" == partName){
			this.rect_proA = instance;
			this.rect_proA.addEventListener(egret.TouchEvent.TOUCH_TAP, (e)=>{	this.rad_A.selected = true; this.changeInfo(0);	}, this);
		}else if("rect_proB" == partName){
			this.rect_proB = instance;
			this.rect_proB.addEventListener(egret.TouchEvent.TOUCH_TAP, (e)=>{	this.rad_B.selected = true;	this.changeInfo(1);}, this);
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

	private changeInfo(value){
		if(value == 0){
			this.rect_proA.fillColor = 0x354244;
			this.rect_proA.strokeWeight = 2;
			this.rect_proB.fillColor = 0x555555;
			this.rect_proB.strokeWeight = 0;
			this.lab_A.textColor = 0x00C1E0;
			this.lab_B.textColor = 0xCFCFCF;
            //属性A
            this._tagsType = {"match":"tagsA"};
        }else {
			this.rect_proB.fillColor = 0x354244;
			this.rect_proB.strokeWeight = 2;
			this.rect_proA.fillColor = 0x555555;
			this.rect_proA.strokeWeight = 0;
			this.lab_B.textColor = 0x00C1E0;
			this.lab_A.textColor = 0xCFCFCF;
            //属性B
            this._tagsType = {"match":"tagsB"};
        }
        console.log("tags ="+this._tagsType["match"]);
	}

	private radioChangeHandler(evt:eui.UIEvent):void {
        this.changeInfo(evt.target.value);
        
    }

	private mButtonMatchTouch(evt:egret.TouchEvent){
        GameData.matchType = GameData.tagsMatch;
        GameData.syncFrame = false;
        GameSceneView._gameScene.match(MatchUI.JOINFLAG.WITHPROPERTY, this._tagsType);
    }
	
}