<template>
	<view>
		<web-view :src="pageSrc"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pageSrc:'http://www.jsy8800.com'
			}
		},
		onLoad() {
			uni.setNavigationBarTitle({title: '公司介绍'});
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
