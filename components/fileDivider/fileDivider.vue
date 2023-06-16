<template>
	<view style="height: 40px;">
		<view :style="{color:titleColor}" class="titleCss">{{titleStr.length>10?titleStr.slice(0,8)+'...':titleStr}}</view>
		<view :style="{background:lineColor}" style="margin: -10px 0 0 20px;" class="lineCss"></view>
		<view style="margin: -15px 0 0 80px;">
			<uni-icons type="star-filled" size="23" :color="lineColor"></uni-icons>
		</view>
		<view style="margin: -25px 80px 0 0;text-align: right;">
			<uni-icons type="star-filled" size="23" :color="lineColor"></uni-icons>
		</view>
		<view :style="{background:lineColor}" style="margin: -15px 20px 0 0;float: right;" class="lineCss"></view>
	</view>
</template>

<script>
	export default {
		name:"fileDivider",
		props: {
			// 线颜色
			lineColor: {
				type: String,
				default: '#f0dab8'
			},
			// 标题
			titleStr: {
				type: String,
				default: ''
			},
			// 标题颜色
			titleColor: {
				type: String,
				default: '#b8741a'
			},
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style>
	.titleCss{
		text-align: center;
		font-size: 14px;
		font-weight: 700;
	}
	
	.lineCss{
		width: 50px;
		height: 2px;
	}
</style>