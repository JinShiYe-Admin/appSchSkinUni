<template>
	<view>
		<web-view :src="pageSrc"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pageSrc:this.PRIVACE
			}
		},
		onLoad() {
			uni.setNavigationBarTitle({title: '隐私政策'});
			//#ifdef H5
				document.title=""
			//#endif
		},
		onShow(){
			//#ifdef H5
				document.title=""
			//#endif
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
