<template>
	<view>
		<view class="mui-row">
			<view style="text-align: center;margin:25px auto;background-color: #FF9900;border-radius: 50%;width: 66px;height: 66px;">
				<view style="color: #FFFFFF;font-size: 18px;font-weight: 600;display: inline-block;margin-top: 25px;">{{itemData.item_txt}}</view>
			</view>
		</view> 
		<uni-row style="padding: 10px 20px 0;color: #505050;font-size: 14px;">
			<uni-col :span="8">
				请假开始时间
			</uni-col>
			<uni-col :span="16">
				{{itemData.begintime}}
			</uni-col>
			<uni-col :span="8">
				请假结束时间
			</uni-col>
			<uni-col :span="16">
				{{itemData.endtime}}
			</uni-col>
			<uni-col :span="8">
				出入权限
			</uni-col>
			<uni-col :span="16">
				{{itemData.in_out_permission_txt}}
			</uni-col>
			<uni-col :span="8">
				请假事由
			</uni-col>
			<uni-col :span="16" style="word-break:break-all;">
				{{itemData.comment}}
			</uni-col>
			<uni-col :span="8">
				批准人
			</uni-col>
			<uni-col :span="16">
				{{itemData.create_user_name}}
			</uni-col>
		</uni-row>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	export default {
		data() {
			return {
				personInfo: {},
				itemData: {},
			}
		},
		onLoad(option) {
			this.personInfo = util.getPersonal();
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			this.itemData = util.getPageData(option);
			console.log('this.itemData:' + JSON.stringify(this.itemData));
			uni.setNavigationBarTitle({
				title: '请假详情'
			});
			//#ifndef APP-PLUS
			document.title = ""
			//#endif
		},
		onShow(){
					//#ifndef APP-PLUS
						document.title=""
					//#endif
				},
		methods: {
			
		}
	}
</script>

<style>
.uni-col {
		min-height: 40px;
	}
</style>
