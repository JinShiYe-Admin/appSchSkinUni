<template>
	<view style="background: #f2f2f2;">
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo' :text="rightText" :textClick="textClick"></mynavBar>
		<uni-card isShadow style="margin: 20px 5px 0;">
			<uni-row style="margin-top: 10px;">
				<uni-col :span="6">
					<view class="rowStyle">作业类型：</view>
				</uni-col>
				<uni-col :span="18">
					<view class="rowStyle">{{navItem.type==1?'线上作业':'线下作业'}}</view>
				</uni-col>
				<uni-col :span="6">
					<view class="rowStyle">科目：</view>
				</uni-col>
				<uni-col :span="18">
					<view class="rowStyle">{{navItem.sub_name}}</view>
				</uni-col>
				<uni-col :span="6">
					<view class="rowStyle">作业内容：</view>
				</uni-col>
				<uni-col :span="18">
					<view class="rowStyle">{{navItem.content}}</view>
				</uni-col>
				<uni-col :span="6">
					<view class="rowStyle">作业对象：</view>
				</uni-col>
				<uni-col :span="18">
					<view class="rowStyle">{{navItem.clsStr}}</view>
				</uni-col>
				<uni-col :span="6">
					<view class="rowStyle">截止时间</view>
				</uni-col>
				<uni-col :span="18">
					<view class="rowStyle">{{navItem.deadline}}</view>
				</uni-col>
				<uni-col v-if="navItem.files.length>0" :span="6">
					<view class="rowStyle">附件：</view>
				</uni-col>
				<uni-col v-if="navItem.files.length>0" :span="18">
					<g-upload ref='gUpload' :mode="hmwkImgList" :control='false' :deleteBtn='false' columnNum="3"></g-upload>
				</uni-col>
			</uni-row>
		</uni-card>
		<view style="height: 50px;background: #f2f2f2;"></view>
		<uni-popup ref="popupOut" type="dialog">
			<uni-popup-dialog title="确定删除?" content="您确认要删除此作业吗？" :duration="2000"
				:before-close="true" @close="closeOut()" @confirm="confirmOut()"></uni-popup-dialog>
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
				rightText:'',
				hmwkImgList:[],//作业的附件
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
			this.navItem.text = '作业详情';
			this.navItem.index = 100;
			console.log('this.navItem:' + JSON.stringify(this.navItem));
			uni.setNavigationBarTitle({
				title: '作业详情'
			});
			for (var i = 0; i < this.navItem.files.length; i++) {
				this.hmwkImgList.push(this.navItem.files[i].url);
			}
			// 获取权限
			this.getPermissionByPosition('delete', this.navItem.index_code, result => {
				if (result[0]) {
					this.rightText = '删除';
				}
			})
			//#ifdef H5
			document.title = "";
			//#endif
			//
		},
		onShow() {
			//#ifdef H5
			document.title = ""
			//#endif
		},
		methods: {
			closeOut() {
				this.$refs.popupOut.close();
			},
			confirmOut(value) {
				this.$refs.popupOut.close();
				let comData = {
					id: this.navItem.id,
					index_code: this.navItem.index_code,
				}
				// 5.3.删除作业
				this.post(this.globaData.INTERFACE_HMWK + 'stuWork/delete', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.showToast(data.msg);
						const eventChannel = this.getOpenerEventChannel()
						eventChannel.emit('refreshaddList');
						uni.navigateBack();
					} else {
						this.showToast(data.msg);
					}
				});
			},
			textClick() {
				this.$refs.popupOut.open();
			}
		}
	}
</script>

<style>
	.biaoyImg {
		width: 20px;
		height: 20px;
	}
	
	.rowStyle {
		font-size: 14px;
		min-height: 30px;
		margin-top: 5px;
		word-break: break-all;
	}
	
	::v-deep .uni-grid-item--border {
		border-bottom: 0px !important;
		border-right: 0px !important;
	}
	
	::v-deep .uni-grid-item--border-top {
		border-top: 0px !important;
	}
	
	::v-deep .uni-grid--border {
		border-left: 0px !important;
	}
	
	.gridBox {
		height: 40px;
		background-color: #f2f2f2;
		text-align: center;
		padding: 5px 5px 0px;
		margin: 5px;
		border-radius: 3px;
		color: #333333;
		font-size: 14px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
