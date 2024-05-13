<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo' text="保存" :textClick="textClick">
		</mynavBar>
		<view style="padding:0 15px;">
			<view class="title-text">
				{{navItem.sub_date.split(' ')[0]}}&ensp;&ensp;{{navItem.week_name}}&ensp;&ensp;{{navItem.time_name}}
			</view>
			<view class="title-text">
				{{navItem.sub_name}}&ensp;&ensp;{{navItem.tec_name}}&ensp;&ensp;{{navItem.addr_list.length>0?navItem.addr_list[0].address:''}}
			</view>
			<view class="title-total">
				<view class="detail-text-total">总人数：{{bjrs}}人</view>
				<view class="detail-text-total">已到：{{yd}}人</view>
				<view class="detail-text-total">缺勤：{{ktqq}}人</view>
				<view class="detail-text-total">迟到：{{cd}}人</view>
				<view class="detail-text-total">早退：{{zt}}人</view>
				<view class="detail-text-total">请假：{{qj}}人</view>
			</view>
		</view>
		<view class="line" style="margin-top: 20px;"></view>
		<view style="position: sticky;top: 44px;z-index: 2;background: #EAEAEA;margin:-6px 0 0;">
			<view style="display: flex;">
				<button type="primary" style="font-size: 12px;background-color: #4cd964;border-color: #4cd964;"
					@click="yidao">将未选择的全部设为已到</button>
				<button type="primary" style="font-size: 12px;background-color: #f0ad4e;border-color: #f0ad4e;"
					@click='queqin'>将未选择的全部设为缺勤</button>
			</view>
		</view>
		<uni-list>
			<uni-list-item v-for="(item,index) in stuList" :key="index" :title="item.showName" class="listTitle">
				<template v-slot:footer>
					<view @click="clickItem(item,1)" class="listBtn" :style="{color:item.sign_status==1?'white':'',background:item.sign_status==1?'#2C96BD':''}">已到</view>
					<view @click="clickItem(item,3)" class="listBtn" :style="{color:item.sign_status==3?'white':'',background:item.sign_status==3?'#2C96BD':''}">迟到</view>
					<view @click="clickItem(item,4)" class="listBtn" :style="{color:item.sign_status==4?'white':'',background:item.sign_status==4?'#2C96BD':''}">早退</view>
					<view @click="clickItem(item,2)" class="listBtn" :style="{color:item.sign_status==2?'white':'',background:item.sign_status==2?'#2C96BD':''}">请假</view>
					<view @click="clickItem(item,5)" class="listBtn" :style="{color:item.sign_status==5?'white':'',background:item.sign_status==5?'#2C96BD':''}">缺勤</view>
				</template>
			</uni-list-item>
		</uni-list>
		<uni-popup ref="alertDialog" type="dialog">
			<uni-popup-dialog type="warn" title="提醒" content="已存在点名记录，是否继续？" closeText='取消' confirmText="继续"
				@confirm="dialogConfirm" @close="dialogClose"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	let _this;

	export default {
		data() {
			return {
				index_code: '',
				personInfo: {},
				navItem: {},
				pageData: {},
				stuList: [],
				bjrs: 0,
				yd: 0,
				ktqq: 0,
				cd: 0,
				zt: 0,
				qj: 0,
				isSign:0,//是否已经点名
			}
		},
		components: {
			mynavBar,
		},
		onLoad(options) {
			_this = this;
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(options);
			itemData.index = 100
			itemData.text = '点名'
			this.navItem = itemData;
			this.index_code = itemData.index_code
			//console.log("this.navItem: " + JSON.stringify(this.navItem));
			this.getToSign();
			//#ifdef H5
			document.title = ""
			//#endif
		},
		onShow() {
			//#ifdef H5
			document.title = ""
			//#endif
		},
		methods: {
			getToSign() {
				//签到课程表
				let comData = {
					after_class_sign_tec_id: this.navItem.id,
					index_code: this.navItem.index_code,
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_KHFW + 'afterClassSignStu/toSign', comData, (data0, pageData) => {
					this.hideLoading()
					if (pageData.code == 0) {
						this.pageData = pageData.data;
						for (var i = 0; i < pageData.data.stu_list.length; i++) {
							let tempM = pageData.data.stu_list[i]
							tempM.showName = tempM.sno&&tempM.sno.length>0?tempM.stu_name+'('+tempM.sno+')':tempM.stu_name
						}
						this.stuList = pageData.data.stu_list;
						for (var i = 0; i < this.stuList.length; i++) {
							var tempM = this.stuList[i];
							if (tempM.sign_status != 0) {
								this.isSign++;
							}
						}
						this.setTotal();
						if (this.stuList.length == 0) {
							this.showToast('没有学生名单，请添加！');
						}
					} else {
						this.showToast(data.msg);
					}
				})
			},
			dialogConfirm(e) {
				this.$refs.alertDialog.close()
				this.submitData()
			},
			dialogClose() {
				this.$refs.alertDialog.close()
			},
			textClick() {
				if (this.stuList.length == 0) {
					this.showToast('没有学生名单，请添加！');
					return;
				}
				// 判断学生是否都选择点名状态
				var tempFlag = 0;
				for (var i = 0; i < this.stuList.length; i++) {
					var tempM = this.stuList[i];
					if (tempM.sign_status == 0) {
						tempFlag++;
					}
				}
				if (tempFlag>0) {
					this.showToast('还有学生暂未设置点名状态');
					return;
				}
				if (this.isSign > 0) {
					this.$refs.alertDialog.open()
				} else{
					this.submitData()
				}
			},
			clickItem(model,flag){
				model.sign_status = flag;
				this.setTotal()
			},
			submitData() {
				var tempArr = [];
				for (var i = 0; i < this.stuList.length; i++) {
					var tempM = this.stuList[i];
					tempArr.push({
						id:tempM.id,
						stu_code:tempM.stu_code,
						stu_name:tempM.stu_name,
						grd_code:tempM.grd_code,
						cls_code:tempM.cls_code,
						grd_name:tempM.grd_name,
						cls_name:tempM.cls_name,
						sno:tempM.sno,
						sign_status:tempM.sign_status
					})
				}
				let comData = {
					data: tempArr,
					after_class_sign_tec_id:this.navItem.id,
					index_code: this.index_code,
				}
				//点名
				this.post(this.globaData.INTERFACE_KHFW + 'afterClassSignStu/sign', comData, (response0, response) => {
					//console.log("responseaaaa: " + JSON.stringify(response));
					this.hideLoading()
					if (response.code == 0) {
						const eventChannel = this.getOpenerEventChannel()
						eventChannel.emit('refreshRollCall1');
						uni.navigateBack();
					}
					this.showToast(response.msg);
				})
			},
			yidao() {
				let stuList = this.stuList
				stuList.map(stuItem => {
					if (stuItem.sign_status == 0) {
						stuItem.sign_status = 1;
					}
				})
				this.stuList = stuList
				this.setTotal()
			},
			queqin() {
				let stuList = this.stuList
				stuList.map(stuItem => {
					if (stuItem.sign_status == 0) {
						stuItem.sign_status = 5;
					}
				})
				this.stuList = stuList
				this.setTotal()
			},
			setTotal() {
				let bjrs = [],
					yd = [],
					ktqq = [],
					cd = [],
					zt = [],
					qj = []
				this.stuList.map(stuItem => {
					if (stuItem.sign_status == 1) {
						yd.push(stuItem)
					}
					if (stuItem.sign_status == 5) {
						ktqq.push(stuItem)
					}
					if (stuItem.sign_status == 3) {
						cd.push(stuItem)
					}
					if (stuItem.sign_status == 4) {
						zt.push(stuItem)
					}
					if (stuItem.sign_status == 2) {
						qj.push(stuItem)
					}
				})
				this.bjrs = this.stuList.length
				this.yd = yd.length
				this.ktqq = ktqq.length
				this.cd = cd.length
				this.zt = zt.length
				this.qj = qj.length
			}
		},
	}
</script>

<style>
	.listTitle{
		height: 50px;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		word-break: break-all;
	}
	.title-text {
		text-align: center;
		word-break: break-all;
		/* display: flex;
		align-items: center; */
		font-size: 14px;
		font-weight: 600;
		margin-top: 15px;
	}

	.title-total {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-between;
		margin-top: 15px;
	}

	.detail-text-total {
		color: #6C6C6C;
		font-size: 13px;
		margin: 3px 0;
		width: calc(32% - 5px);
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
	}

	::v-deep .uni-list-item__content {
		justify-content: center;
	}

	.listBtn {
		width: 45px;
		height: 25px;
		border-radius: 3px;
		background: #f2f2f2;
		color: #7f7f7f;
		font-size: 12px;
		text-align: center;
		padding-top: 7px;
		margin-left: 5px;
	}
</style>