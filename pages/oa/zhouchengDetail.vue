<template>
	<view>
		<p align="center" class="titleCSS" style="font-size: 18px;color: #000;margin-top: 10px;">{{pageModel.Title}}</p>
		<p align="center" class="name-timeCSS" style="font-size: 13px;color: #999;">{{pageModel.SendManName}} |
			{{pageModel.SendTime}}
		</p>
		<view class="contentCSS" v-html='pageModel.WeekWork'></view>
		<p class="contentCSS" style="font-size: 14px;color: #666;">负责部门：{{pageModel.WorkDept}}</p>
		<p class="contentCSS" style="font-size: 14px;color: #666;padding-bottom: 10px;">
			起止时间：{{pageModel.BeginTime}}--{{pageModel.EndTime}}</p>
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
				title: this.itemData.AnnouncementTitle
			});
			//#ifndef APP-PLUS
			document.title = ""
			//#endif
			this.getPageDetail();
		},
		methods: {
			getPageDetail() {
				var comData = {
					schoolWeekWorkId: this.itemData.AnnouncementId, //公告ID
					index_code: this.itemData.access.split('#')[1],
					op_code: 'index'
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_OA + 'announcement/getWeekWorkById', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						data.data.BeginTime = data.data.BeginTime.split(' ')[0];
						data.data.EndTime = data.data.EndTime.split(' ')[0];
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
	::v-deep table {border-spacing: 0px; max-width: 100%;}
	::v-deep td { border:1px solid; border-width: 1px;}
</style>
