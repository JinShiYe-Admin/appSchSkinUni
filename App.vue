<script>
	import push from './js_sdk/push/push.js'; 
	export default {
		onLaunch: function() {
			push.getClient();
			push.init();
			console.log('App Launch，app启动')
			var platform = uni.getSystemInfoSync().platform;
			//#ifdef APP
			/* 5+  push 消息推送 ps:使用:H5+的方式监听，实现推送*/
			plus.push.addEventListener("click", function(msgc) {
				console.log(msgc);
				//  && msgc.type == 'click'
				if (platform == 'ios') {
					//离线是payload为object , 在线时本地创建的为string(本地创建通知只能传string，否则无法传递payload)
					if (typeof msgc.payload == 'string') {
						console.log('string')
						var paymsg = JSON.parse(msgc.payload);
					} else {
						console.log('obj')
						var paymsg = msgc.payload;
					}
					console.log(paymsg)
					//执行跳转判断
				}
				//这里可以写跳转业务代码
			}, false);
			// 监听在线消息事件    
			plus.push.addEventListener("receive", function(msg) {
				//这里可以写跳转业务代码
				console.log(msg)
				if (msg.type == "receive") // 这里判断触发的来源，否则一直推送。  
				{
					if (platform == 'ios') {
						// console.log(msg.payload)
						plus.push.createMessage(
							msg.payload.content,
							//本地创建通知payload只能传string，否则无法成功传递（为null）
							JSON.stringify(msg.payload), {
								cover: false,
								title: msg.title,
							});
					}
				}
				if (platform == 'android') {
					//执行跳转判断
				}
			}, false);
			
			//#endif 
		},
		onShow: function() {
			console.log('App Show，app展现在前台')
		},
		onHide: function() {
			console.log('App Hide，app不再展现在前台')
		}
	}
</script>

<style lang="scss">
	// @import "./third-ui/uview-ui/index.scss";
	@import "./commom/uni.css";
	@import "./commom/common.css";
	
</style>

