<template>
	<view>
		<p align="center" class="titleCSS" style="font-size: 18px;color: #000;margin-top: 10px;">
			{{pageModel.AnnouncementTitle}}
		</p>
		<p align="center" class="name-timeCSS" style="font-size: 13px;color: #999;">{{pageModel.SendManName}} |
			{{pageModel.SendTime}}
		</p>
		<p class="contentCSS" style="font-size: 14px;color: #666;margin-bottom: 10px;"
			v-html="pageModel.AnnouncementContent"></p>
		<template v-for="(extraFile,index) in pageModel.AnnouncementEncName"
			v-show="pageModel.AnnouncementEncName.length==0" style="margin-bottom: 15px !important;">
			<view class="encName" v-show="extraFile">附件:
				<a class="" style="font-size: 13px;color: #3c9bfe;margin-left: 10px;"
					@click="checkEnc(pageModel.AnnouncementEncAddr[index])">附件{{index+1}}</a>
			</view>
		</template>
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
			//#ifdef H5
			document.title = ""
			var isPageHide = false;
			window.addEventListener('pageshow', function() {
				document.title = ""
				if (isPageHide) {
					window.location.reload();
					document.title = ""
				}
			});
			window.addEventListener('pagehide', function() {
				isPageHide = true;
				document.title = ""
			});
			//#endif
			this.getPageDetail();
		},
		onShow() {
			//#ifdef H5
			document.title = ""
			//#endif
		},
		methods: {
			checkEnc: function(tempUrl) {
				console.log('tempUrl:' + tempUrl);
				util.openFile(tempUrl);
			},
			getPageDetail() {
				var comData = {
					announcementId: this.itemData.AnnouncementId, //公告ID
					index_code: this.itemData.access.split('#')[1],
					op_code: 'index'
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_OA + 'announcement/getAnnouncementById', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						if (data.data.AnnouncementEncName) {
							data.data.AnnouncementEncName = data.data.AnnouncementEncName.split("|");
							data.data.AnnouncementEncAddr = data.data.AnnouncementEncAddr.split("|");
						}
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

	.encName {
		margin-left: 15px;
		margin-right: 15px;
		padding-bottom: 10px;
		font-size: 14px;
		color: #333;
	}

	.encTitle {
		font-size: 12px;
		color: #999;
	}

	.encSize {
		font-size: 12px;
		color: #3c9bfe;
	}
</style>
