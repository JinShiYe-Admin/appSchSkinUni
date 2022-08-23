<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo' :text="rightText" :textClick="textClick">
		</mynavBar>
		<button @click="saveTag()" type="default" class="down-btn mini-btn"
			style="float: right;margin-right: 10px;margin-top: 10px;background: #00CFBD;border-color: #00CFBD;color: white;"
			size="mini">保存</button>
		<input maxlength="10" type="text" v-model="tag"
			style="float: right;border: 1px solid gainsboro;margin: 5px -10px 0 0;font-size: 14px;width: 150px;height: 35px;padding-left: 5px;"
			placeholder="请输入我的标签" />
		<p style="font-size: 14px;color: #666;float: right;margin-top: 15px;">我的标签：</p>
		<br /><br />
		<p align="center" class="titleCSS" style="font-size: 18px;color: #000;margin-top: 10px;">
			{{detailModel.NoticeTitle}}
		</p>
		<p align="center" class="name-timeCSS" style="font-size: 13px;color: #999;">{{detailModel.SendManName}} |
			{{detailModel.SendTime}}
		</p>
		<p class="contentCSS" style="font-size: 14px;color: #666;" v-html="detailModel.NoticeContent"></p>
		<view v-for="(extraFile,index) in detailModel.NoticeEncAddr" :key='index'>
			<view class="encName">附件:
				<a class="" style="font-size: 13px;color: #3c9bfe;margin-left: 10px;"
					@click="checkEnc(extraFile)">附件{{index+1}}</a>
			</view>
		</view>
		<p style="height: 10px;background-color: #f2f2f2;"></p>
		<p class="titleCSS" style="font-size: 14px;color: #333;margin: 10px 0 10px 10px;">接收列表</p>
		<uni-list>
			<uni-list-item v-for="(replyModel,index) in detailModel.list" :key='index' direction='column'>
				<view slot="body">
					<view style="float: left;height: 40px;">
						<image class="peopleImg"
							:src="replyModel.ReceiveManPic?replyModel.ReceiveManPic:'http://www.108800.com/user.jpg'">
						</image>
					</view>
					<view class="rightView">
						<a class="biaoti0 title">{{replyModel.ReceiveManName}}</a>
						<uni-row v-if="replyModel.IsRead ==1" class="nameTime">
							<uni-col :span="10">
								【已读】
							</uni-col>
							<uni-col :span="14">
								{{replyModel.ReadTime}}
							</uni-col>
						</uni-row>
					</view>
				</view>
			</uni-list-item>
		</uni-list>
		<uni-popup ref="popup" type="dialog">
			<uni-popup-dialog title="确定撤销?" :duration="2000" :before-close="true" @close="close" @confirm="confirm">
			</uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import util from '@/commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	let _this;
	export default {
		data() {
			return {
				personInfo: {},
				navItem: {},
				rightText: '',
				detailModel: {},
				tag: ''
			}
		},
		components: {
			mynavBar
		},
		onLoad(option) {
			_this = this;
			this.personInfo = util.getPersonal();
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			this.navItem = util.getPageData(option);
			this.navItem.text = '通知详情';
			this.navItem.index = 100;
			console.log('this.navItem:' + JSON.stringify(this.navItem));
			uni.setNavigationBarTitle({
				title: '通知详情'
			});
			//#ifdef H5
			document.title = "";
			var isPageHide = false;
			window.addEventListener('pageshow', function() {
				if (isPageHide) {
					window.location.reload();
				}
			});
			window.addEventListener('pagehide', function() {
				isPageHide = true;
			});
			//#endif
			//获取详情
			this.getNoticeByReceiveId_sendId_Detail();
		},
		onShow() {
			//#ifdef H5
			document.title = ""
			//#endif
		},
		methods: {
			close() {
				this.$refs.popup.close();
			},
			confirm(value) {
				this.$refs.popup.close();
				//不需要加密的数据
				var comData0 = {
					noticeId: this.detailModel.NoticeId,
					index_code: this.navItem.access.split('#')[1],
					op_code: 'index'
				};
				this.showLoading();
				//发送网络请求，data为网络返回值
				this.post(this.globaData.INTERFACE_OA + 'notice/doSetNoticeUndo', comData0, (data0, data) => {
					this.hideLoading();
					if (data.code == 0 && data.data.Result == 1) {
						this.showToast("成功");
						this.rightText = '';
					}
				});
			},
			textClick() {
				console.log('textClick');
				_this.$refs.popup.open();
			},
			getNoticeByReceiveId_sendId_Detail() {
				this.showLoading();
				var comData0 = {};
				var url;
				if (this.navItem.flag == 0) { //15.通过通知接收表ID获取通知
					comData0 = {
						noticeManId: this.navItem.NoticeManId, //协同事务接收表ID
						index_code: this.navItem.access.split('#')[1],
						op_code: 'index'
					}
					url = this.globaData.INTERFACE_OA + 'notice/getNoticeByReceiveId';
				} else { //14.通过通知ID获取通知
					comData0 = {
						noticeId: this.navItem.NoticeId, //协同事务ID
						index_code: this.navItem.access.split('#')[1],
						op_code: 'index'
					}
					url = this.globaData.INTERFACE_OA + 'notice/getNoticeById';
				}
				// 获取收到的协同事务列表（接收人为单人）
				this.post(url, comData0, (data0, data) => {
					this.hideLoading();
					console.log('data:' + JSON.stringify(data));
					if (data.code == 0) {
						if (data.data.NoticeEncName) {
							data.data.NoticeEncName = data.data.NoticeEncName.split("|");
							data.data.NoticeEncAddr = data.data.NoticeEncAddr.split("|");
						}
						//如果是接收的，判断是否右上角有功能
						if (this.navItem.flag == 1) {
							// 进程处于“新建”且 状态处于“发出”时 显示撤销按钮
							if (data.data.Progress == 1 && data.data.Status == 1) {
								console.log('222222');
								this.rightText = '撤回';
							}
						}
						this.tag = data.data.Tag;
						this.detailModel = data.data;
						console.log('this.detailModel:' + JSON.stringify(this.detailModel));
						if (data.data.ReadStatus == 2) { //未读
							//9.阅读通知
							var comData1 = {
								noticeId: data.data.NoticeId, //通知ID
								receiveManId: this.personInfo.user_code, //阅读人ID
								index_code: this.navItem.access.split('#')[1],
								op_code: 'index'
							}
							//9.阅读通知
							this.post(this.globaData.INTERFACE_OA + 'notice/doSetNoticeRead', comData1, (data0,
								data) => {

							});
						}
					} else {
						this.showToast(data.msg);
					}
				});
			},
			saveTag() {
				console.log('saveTag');
				if (this.tag != this.detailModel.Tag) {
					this.showLoading();
					//
					var comData = {
						noticeId: this.detailModel.NoticeId, //通知ID
						noticeTag: this.tag, //标签
						index_code: this.navItem.access.split('#')[1],
						op_code: 'index'
					}
					var url = '';
					if (this.navItem.flag == 1) { //我发送的
						url = this.globaData.INTERFACE_OA + 'notice/doSetSendNoticeTag';
					} else { //接收的
						comData.receiveManId = this.personInfo.user_code; //阅读人ID
						url = this.globaData.INTERFACE_OA + 'notice/doSetReceiveNoticeTag';
					}
					this.post(url, comData, (data0, data) => {
						this.hideLoading();
						console.log('修改接收的通知标签:' + JSON.stringify(data));
						if (data.code == 0 && data.data.Result == 1) {
							this.showToast("保存成功");
							this.detailModel.Tag = this.tag;
						} else {
							this.showToast(data.msg);
						}
					});
				} else {
					this.showToast('请勿重复保存标签');
				}
			},
			checkEnc: function(tempUrl) {
				console.log('tempUrl:' + tempUrl);
				util.openFile(tempUrl);
			}
		}
	}
</script>

<style>
	.uni-input-placeholder {
		padding-left: 5px;
	}

	.uni-input-input {
		padding-left: 5px;
	}

	.contentCSS {
		margin: 5px 15px 5px 15px;
		font-size: 14px;
		color: #666;
		word-break: break-all;
	}

	.titleCSS {
		font-size: 18px;
		color: #000;
	}

	.name-timeCSS {
		margin-top: 5px;
		font-size: 12px;
		color: #999;
	}

	.encName {
		margin-left: 15px;
		margin-right: 15px;
		margin-bottom: 10px;
		font-size: 14px;
		color: #333;
	}

	.prev-btn,
	.down-btn {
		margin-left: 20px;
	}

	.peopleImg {
		width: 40px;
		height: 40px;
		border-radius: 50%;
	}

	.rightView {
		margin-left: 10px;
		float: left;
		width: calc(100% - 50px);
	}

	.biaoti {
		font-size: 13px;
		width: calc(100% - 50px);
	}

	.biaoti0 {
		margin-left: 8px;
		font-size: 13px;
		width: calc(100%);
	}

	.title {
		height: 100%;
		float: left;
		font-size: 13px;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		color: #000000;
	}

	.nameTime {
		font-size: 13px;
		color: gray;
	}

	.uni-col {
		margin-top: 0px;
	}
</style>
