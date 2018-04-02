/**
 * 自定义属性加入房间
 */
class TagsMatchView extends eui.Group{
    private _parent:egret.DisplayObjectContainer;

    private _tagsType:any={"match":"tagsA"};

    constructor(pr:egret.DisplayObjectContainer){
        super();
        this._parent = pr;
        this.initView();
    }

    /**
     * 
     */
    private initView(){

        let myGroup = new eui.Group();
        myGroup.x = this._parent.x;
        myGroup.y = this._parent.y;
        myGroup.width = this._parent.width;
        myGroup.height = this._parent.height/2;
        this.addChild(myGroup);

        let titleText:eui.Label = new eui.Label();
        titleText.text = "自定义属性匹配";
        titleText.horizontalCenter = 0;
        titleText.y = 40;
        titleText.size = 35;
        titleText.textColor = 0xffffff;
        myGroup.addChild(titleText);

        let rdb: eui.RadioButton = new eui.RadioButton();
        rdb.label = "属性A";
        rdb.value = 0;
        rdb.groupName = "p1";
        rdb.selected = true;//默认选项
        rdb.horizontalCenter = 0;
        rdb.verticalCenter = -20;
        rdb.addEventListener(eui.UIEvent.CHANGE, this.radioChangeHandler, this);
        myGroup.addChild(rdb);

        let rdb2: eui.RadioButton = new eui.RadioButton();
        
        rdb2.label = "属性B";
        rdb2.value = 1;
        rdb2.groupName = "p1";
        rdb2.horizontalCenter = 0;
        rdb2.verticalCenter = 30;
        rdb2.addEventListener(eui.UIEvent.CHANGE, this.radioChangeHandler, this);
        myGroup.addChild(rdb2);

        let matchbtn = new eui.Button();
        matchbtn.horizontalCenter = 0;
        matchbtn.label = "开始匹配";
        matchbtn.width = 200;
        matchbtn.height = 50;
        matchbtn.y = myGroup.height*0.7;
        matchbtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.mButtonMatchTouch,this);
        myGroup.addChild(matchbtn);

        let exitBtn:eui.Button = new eui.Button();
        exitBtn.horizontalCenter = 0;
        exitBtn.label = "退出";
        exitBtn.width = 200;
        exitBtn.height = 50;
        exitBtn.y = myGroup.height*0.9;
        exitBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.mbuttonExitRoom, this);
        myGroup.addChild(exitBtn);
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
        GameSceneView._gameScene.match(this._tagsType);
    }
    
}