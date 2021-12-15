export default {
	init: () => {
		// #ifdef APP-PLUS
		plus.push.setAutoNotification(true);  //设置通知栏显示通知 //必须设置
		plus.push.addEventListener("click", function(msg) {
			plus.push.clear(); //清空通知栏
			pushHandle(msg) //处理方法
		}, false);
		// 监听在线消息事件    
		plus.push.addEventListener("receive", function(msg) {
			console.log('11111111');
			if (plus.os.name=='iOS') {  //由于IOS 必须要创建本地消息 所以做这个判断
			console.log('22222222');
				if (msg.payload&& msg.payload!=null&&msg.type=='receive') {
					console.log('333333333');
					console.log(msg);
					// {"title": "xxx","content": "xxx","payload": "xxx"} 符合这种 才会自动创建消息  文档地址https://ask.dcloud.net.cn/article/35622
					plus.push.createMessage(msg.payload.content,JSON.stringify(msg.payload))  //创建本地消息
				}
			}
			if (plus.os.name=='Android') {
				if(!msg.title||!msg.content||!msg.payload){ //  不符合自动创建消息的情况
					 //这里根据你消息字段来创建消息 
					// plus.push.createMessage(msg.payload.content,JSON.stringify(msg.payload))  //创建本地消息
				}else{
					//符合自动创建消息 
					pushHandle(msg)
				}	
			}
			 	
		}, false);
		// #endif
	},

	getClient: (callback) => {
		// #ifdef APP-PLUS
		let clientInfo = plus.push.getClientInfo();  //获取 clientID
		uni.setStorageSync('clientid', clientInfo.clientid)
		console.log(clientInfo);
		// #endif

	},

}
const pushHandle = (msg) => {
	if (typeof (msg.payload )=='string') {  //如果是字符串，表示是ios创建的  要转换一下
		msg.payload=JSON.parse(msg.payload )
	}
	if(!msg) return false;
	plus.runtime.setBadgeNumber(0); //清除app角标
	
	//下面的代码根据自己业务来写 这里可以写跳转业务代码
	//跳转到tab
	if (msg.payload.pathType == '1') {
		uni.switchTab({
			url: msg.payload.url
		})
	}
	//跳转到详情
	if (msg.payload.pathType == 0) {
		let url = msg.payload.url
		if (msg.payload.args) {
			url = url + '?listId=' + msg.payload.args
		}
		console.log(url);
		uni.navigateTo({
			url: url
		})
	}
}
