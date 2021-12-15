<script>
	import push from './js_sdk/push/push.js'; 
	export default {
		onLaunch: function() {
			console.log('App Launch，app启动')
			//#ifdef APP
			console.log('11111111');
			push.getClient();
			push.init();
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

