<template>
	<view>
		<uni-list v-if="pageModel.LetterValue">
		    <uni-list-item>
		        <view slot="header" class="liTitle">通知单名称</view>
		        <view slot="footer" class="liDetail">{{pageModel.LetterName}}</view>
		    </uni-list-item>
			<uni-list-item>
			    <view slot="header" class="liTitle">发送人姓名</view>
			    <view slot="footer" class="liDetail">{{pageModel.SendManName}}</view>
			</uni-list-item>
			<uni-list-item>
			    <view slot="header" class="liTitle">发布时间</view>
			    <view slot="footer" class="liDetail">{{pageModel.SendTime}}</view>
			</uni-list-item>
			<uni-list-item>
			    <view slot="header" class="liTitle">通知人姓名</view>
			    <view slot="footer" class="liDetail">{{pageModel.NoticeManName}}</view>
			</uni-list-item>
			<uni-list-item>
			    <view slot="header" class="liTitle">通知人部门</view>
			    <view slot="footer" class="liDetail">{{pageModel.NoticeManDept}}</view>
			</uni-list-item>
			<p class="lineCell"></p>
			<uni-list-item v-for="(model,index) in pageModel.LetterValue" :key='index'>
			    <view slot="header" class="liTitle">{{model.key}}</view>
			    <view slot="footer" class="liDetail">{{model.value}}</view>
			</uni-list-item>
		</uni-list>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	export default {
		data() {
			return {
				personInfo: {},
				itemData: {},
				pageModel: {}
			}
		},
		onLoad(option) {
			this.personInfo = util.getPersonal();
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			this.itemData = util.getPageData(option);
			console.log('this.itemData:' + JSON.stringify(this.itemData));
			uni.setNavigationBarTitle({
				title: this.itemData.LetterName
			});
			//#ifndef APP-PLUS
			document.title = ""
			//#endif
			this.getPageDetail();
		},
		onShow(){
					//#ifndef APP-PLUS
						document.title=""
					//#endif
				},
		methods: {
			getPageDetail() {
				var comData = {
					letterId: this.itemData.LetterId, //公告ID
					noticeManId: this.personInfo.user_code, //通知人姓名
					index_code:this.itemData.access.split('#')[1],
					op_code: 'index'
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_OA + 'noticeLetter/getReceiveNoticeLetterById', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.pageModel = data.data;
					} else {
						this.showToast(data.msg);
					}
				});
			}
		}
	}
</script>

<style>
	.contentCSS {
		margin: 10px 15px 0 15px;
		font-size: 14px;
		color: #666;
		word-break: break-all;
	}

	.titleCSS {
		margin-left: 15px;
		margin-right: 15px;
		font-size: 18px;
		color: #000;
		word-break: break-all;
	}

	.name-timeCSS {
		margin-top: 10px;
		font-size: 12px;
		color: #999;
	}
	
	.liTitle {
		font-size: 15px;
		color: #333;
	}
	
	.liDetail {
		font-size: 14px;
		color: #666;
	}
	
	.lineCell {
		height: 10px;
		width: 100%;
		background: #f2f2f2;
	}
</style>
