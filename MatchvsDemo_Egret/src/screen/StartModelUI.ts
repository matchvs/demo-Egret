class StartModelUI extends eui.Component implements eui.UIComponent {
    private _btnMatchvs:eui.Button = null;
    private _btnIndepen:eui.Button = null;
    private _lbMatchvs:eui.Label = null;
    private _lbIndepen:eui.Label = null;

    private _lb_desc1:eui.Label = null;
    private _lb_desc2:eui.Label = null;

    constructor() {
        super();
    }

    /**
     * 获取子控件
     */
    protected partAdded(partName: string, instance: any): void {
        if("btn_indepen" == partName){
            //Matchvs独立部署服务
            this._btnIndepen = instance;
            this._btnIndepen.addEventListener(egret.TouchEvent.TOUCH_TAP,this.BtnIndepenTouch,this);
        }
        if("btn_matchvs" == partName){
            //Matchvs云服务
            this._btnMatchvs = instance;
            this._btnMatchvs.addEventListener(egret.TouchEvent.TOUCH_TAP,this.BtnMatcvhsTouch,this);
        }
        if("lb_matchvs" == partName){
            this._lbMatchvs = instance;
            this._lbMatchvs.addEventListener(egret.TouchEvent.TOUCH_TAP,this.BtnMatcvhsTouch,this);
        }
        if("lb_indepen" == partName){
            this._lbIndepen = instance;
            this._lbIndepen.addEventListener(egret.TouchEvent.TOUCH_TAP,this.BtnIndepenTouch,this);
        }
        if("lb_desc1" == partName){
            this._lb_desc1 = instance;
        }
        if("lb_desc2" == partName){
            this._lb_desc2 = instance;
        }
        console.info("partName:"+partName,"instance:",instance)
    }

    /**
     * 子控件加载完成
     */
    protected childrenCreated(): void {
    }

    /**
     * Matchvs云服务 按钮事件
     */
    private BtnMatcvhsTouch(event:egret.TouchEvent){
        GameSceneView._gameScene.login();
    }

    /**
     * Matchvs独立部署服务 按钮事件
     */
    private BtnIndepenTouch(event:egret.TouchEvent){
        GameSceneView._gameScene.premiseLogin();
    }

    /**
     * 设置描述信息
     */
    private setLbDesc1(msg:string){
        if(this._lb_desc1 == null){
            return;
        }
        this._lb_desc1.text = msg;
    }

    /**
     * 设置描述信息
     */
    private setLbDesc2(msg:string){
        if(this._lb_desc2 == null){
            return;
        }
        this._lb_desc2.text = msg;
    }

}