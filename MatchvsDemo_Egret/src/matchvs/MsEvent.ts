/**
 * matchvs 事件类型定义
 */
module mvs {
    export class MsEvent {

        //初始化
        public static EVENT_INIT_RSP = "MATCHVS_INIT_EVENT";

        //注册
        public static EVENT_REGISTERUSER_RSP = "MATCHVS_REGISTERUSER_EVENT";

        //登录事件
        public static EVENT_LOGIN_RSP = "MATCHVS_LOGIN_EVENT";

        //加入房间事件
        public static EVENT_JOINROOM_RSP = "MATCHVS_JOINROOM_EVENT";
        public static EVENT_JOINROOM_NTFY = "MATCHVS_JOINROOM_NOTIFY_EVENT";

        //创建房间事件
        public static EVENT_CREATEROOM_RSP = "MATCHVS_CREATEROOM_RSP_EVENT";

        //发送消息事件
        public static EVENT_SENDEVENT_RSP = "MATCHVS_INIT_EVENT";
        public static EVENT_SENDEVENT_NTFY = "MATCHVS_SENDEVENT_NOTIFY_EVENT";

        //gameServer 消息事件
        public static EVENT_GAMESERVER_NTFY = "MATCHVS_GAMESERVER_NOTIFY_EVENT";

        //离开房间事件
        public static EVENT_LEAVEROOM_RSP = "MATCHVS_LEAVEROOM_RSP_EVENT";
        public static EVENT_LEAVEROOM_NTFY = "MATCHVS_LEAVEROOM_NTFY_EVENT";
        
        //关闭房间事件
        public static EVENT_JOINOVER_RSP= "MATCHVS_JOINOVER_RSP_EVENT";
        public static EVENT_JOINOVER_NTFY = "MATCHVS_LEAVEROOM_EVENT";

        //打开房间事件
        public static EVENT_JOINOPEN_RSP= "MATCHVS_JOINOPEN_RSP_EVENT";
        public static EVENT_JOINOPEN_NTFY = "MATCHVS_JOINOPEN_NTFY_EVENT";

        //网络状态事件
        public static  EVENT_NETWORKSTATE_NTFY = "MATCHVS_NETWORKSTATE_NTFY";

        //发送帧事件
        public static EVENT_SENDFRAME_RSP = "MATCHVS_SENDFRAME_RSP_EVENT";

        //设置帧同步事件
        public static EVENT_SETFRAMESYNC_RSP = "MATCHVS_SETFRAMESYNC_RSP_EVENT";

        //更新帧同步事件
        public static EVENT_FRAMEUPDATE = "MATCHVS_FRAMEUPDATE_EVENT";

        //错误发生事件
        public static EVENT_ERROR_RSP = "MATCHVS_ERROR_RSP_EVENT";

        //登出事件
        public static EVENT_LOGOUT_RSP = "MATCHVS_LOGOUT_RSP_EVENT";

        //设置房间属性
        public static EVENT_SETROOMPROPERTY_RSP = "MATCHVS_SETROOMPROPERTY_RSP_EVENT";
        public static EVENT_SETROOMPROPERTY_NTFY = "MATCHVS_SETROOMPROPERTY_NTFY_EVENT";

        //踢人
        public static EVENT_KICKPLAYER_RSP = "MATCHVS_KICKPLAYER_RSP_EVENT";
        public static EVENT_KICKPLAYER_NTFY = "MATCHVS_KICKPLAYER_NTFY_EVENT";

        // 获取房间类别 简单信息 接口
        public static EVENT_GETROOMLIST_RSP = "MATCHVS_GETROOMLIST_RSP_EVENT";

        // 获取房间列表 扩展信息 接口
        public static EVENT_GETROOMLIST_EX_RSP = "MATCHVS_GETROOMLIST_EX_RSP_EVENT";

        //获取房间详细信息
        public static EVENT_GETROOMDETAIL_RSP = "MATCHVS_GETROOMDETAIL_RSP_EVENT";

        //断线重新连接
        public static EVENT_RECONNECT_RSP = "MATCHVS_RECONNECT_RSP_EVENT";

        constructor(){
        }
    }
}