<template>
	<view style="background: #f2f2f2;">
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo' :text="navRightText" :textClick="textClick"></mynavBar>
		<uni-card isShadow style="margin: 20px 5px 0;">
			<uni-row style="margin-top: 10px;">
				<uni-col :span="4">
					<view class="rowStyle">年级：</view>
				</uni-col>
				<uni-col :span="20">
					<view class="rowStyle">{{navItem.grd_name}}</view>
				</uni-col>
				<uni-col :span="4">
					<view class="rowStyle">班级：</view>
				</uni-col>
				<uni-col :span="20">
					<view class="rowStyle">{{navItem.cls_name}}</view>
				</uni-col>
				<uni-col :span="4">
					<view class="rowStyle">学生：</view>
				</uni-col>
				<uni-col :span="20">
					<view class="rowStyle">{{navItem.stuStr}}</view>
				</uni-col>
				<uni-col v-if="navItem.sub_code>0" :span="4">
					<view class="rowStyle">科目：</view>
				</uni-col>
				<uni-col v-if="navItem.sub_code>0" :span="20">
					<view class="rowStyle">{{navItem.sub_name}}</view>
				</uni-col>
				<uni-col :span="4">
					<view class="rowStyle">评语：</view>
				</uni-col>
				<uni-col :span="20">
					<view class="rowStyle">{{navItem.comment}}</view>
				</uni-col>
				<uni-col v-if="navItem.type>0" :span="4">
					<view class="rowStyle">{{navItem.type==1?'表扬：':'批评：'}}</view>
				</uni-col>
				<uni-col v-if="navItem.type>0" :span="20">
					<view class="rowStyle">
						<span v-for="(tempI,index) in navItem.v" :key="index">
							<image class="biaoyImg" style="margin-right: 5px;"
								:src="navItem.type==1?'/static/images/mixedAbl/biaoyang1.jpg':'/static/images/mixedAbl/piping1.jpg'">
							</image>
						</span>
					</view>
				</uni-col>
				<uni-col v-if="imgList.length>0" :span="4">
					<view class="rowStyle">照片：</view>
				</uni-col>
				<uni-col v-if="imgList.length>0" :span="20">
					<g-upload ref='gUpload' :mode="imgList" :control='false' :deleteBtn='false' columnNum="3"></g-upload>
				</uni-col>
				<uni-col :span="24">
					<view class="rowStyle" style="text-align: right;margin-top: 20px;">{{navItem.create_time}}</view>
				</uni-col>
			</uni-row>
		</uni-card>
		<view style="height: 50px;background: #f2f2f2;"></view>
		<uni-popup ref="popupOut" type="dialog">
			<uni-popup-dialog title="确定删除?" content="您确认要删除此学生评价吗？" :duration="2000"
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
				navRightText:'',
				imgList:[],
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
			this.navItem.text = '学生评价';
			this.navItem.index = 100;
			console.log('this.navItem:' + JSON.stringify(this.navItem));
			uni.setNavigationBarTitle({
				title: '学生评价'
			});
			for (var i = 0; i < this.navItem.files.length; i++) {
				this.imgList.push(this.navItem.files[i].url);
			}
			// 获取权限
			this.getPermissionByPosition('delete', this.navItem.index_code, result => {
				if (result[0]) {
					this.navRightText = '删除';
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
				// 1.3.删除
				this.post(this.globaData.INTERFACE_ZHSZM + 'stuComment/delete', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.showToast(data.msg);
						const eventChannel = this.getOpenerEventChannel()
						eventChannel.emit('refreshstuEvaluate');
						uni.navigateBack();
					} else {
						this.showToast(data.msg);
					}
				});
			},
			textClick() {
				this.$refs.popupOut.open();
			},
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
