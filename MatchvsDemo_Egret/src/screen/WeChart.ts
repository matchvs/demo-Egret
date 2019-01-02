class WeChart extends eui.Component implements  eui.UIComponent {
	public constructor() {
		super();
	}

	protected partAdded(partName:string,instance:any):void
	{
		super.partAdded(partName,instance);
	}


	protected childrenCreated():void
	{
		super.childrenCreated();
		this.GetWeChartAuthor();
	}

	private GetWeChartAuthor(){
		try{
			let wxm = new Wxmodel();
			wxm.UserAuthorButton({
				success:(res)=>{
					console.log("微信授权成功");
					GameSceneView._gameScene.login();
				},
				fail: (res)=>{
					console.log("微信授权成功");
					GameSceneView._gameScene.login();
				},
				style:{
					bgcolor:"#00C1E0",
					text:"微信授权",
				}
			});
		}catch(r){
			GameSceneView._gameScene.login();
		}
		
	}
	
}