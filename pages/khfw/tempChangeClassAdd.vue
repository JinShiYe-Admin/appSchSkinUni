<template>
	<view style="background: #f2f2f2;">
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo' text="保存并发送" :textClick="textClick">
		</mynavBar>
		<view class="typeCss" style="margin: 15px 0 0 15px;"><uni-icons type="star-filled" color='#d9001b'
				size="10"></uni-icons>临时调课名称：</view>
		<input maxlength="30" type="text" v-model="content" class="rightView" style="margin-top: 10px;"
			placeholder="请输入" />
		<view v-if="tempPageData.length>0">
			<view style="font-size: 16px;font-weight: 900;margin: 10px 0 0 15px;">课程调整</view>
			<view class="select-line"></view>
			<uni-card isShadow style="margin: 10px;" v-for="(item,index) in tempPageData" :key="index">
				<view style="float: right;color: #D9001B;" @click="clickDel(item,index)">删除</view>
				<view class="subTea">安排{{index+1}}：</view>
				<view style="height: 1px;background: #d7d7d7;margin-top: 5px;"></view>
				<uni-row style="margin-top: 20px;">
					<uni-col :span="8">
						<view class="titleLeft">原上课日期：</view>
					</uni-col>
					<uni-col :span="16">
						<view class="titleRight" style="margin-top: -5px;">
							<view @click="showPop(item,index,0)" class="show-time"><uni-icons type="calendar" color='gainsboro'></uni-icons>{{item.start_time.length>0?item.start_time:'请选择'}}</view>
						</view>
						<view style="height: 5px;"></view>
					</uni-col>
					<uni-col :span="8">
						<view class="titleLeft" style="margin-top: 5px;">操作：</view>
					</uni-col>
					<uni-col :span="16">
						<view class="titleRight" style="margin-top: 5px;">
							<view @click="typeClick(item,index)" class="titleRight">
								{{item.type_name}}
								<uni-icons style="margin-left: 20px;" type="bottom" color='#7f7f7f' size="14"></uni-icons>
							</view>
						</view>
					</uni-col>
					<uni-col :span="8">
						<view class="titleLeft">目标日期：</view>
					</uni-col>
					<uni-col :span="16">
						<view v-if="item.type==1" class="titleRight" style="margin-top: -5px;">
							<view @click="showPop(item,index,1)" class="show-time"><uni-icons type="calendar" color='gainsboro'></uni-icons>{{item.end_time.length>0?item.end_time:'请选择'}}</view>
						</view>
						<view v-else>--</view>
						<view style="height: 5px;"></view>
					</uni-col>
				</uni-row>
			</uni-card>
		</view>
		<view class="addBtn" @click="clickAdd()" style="margin-top: 15px;">+添加课程调整</view>
		<view style="height: 10px;background: #f2f2f2;"></view>
		<uni-popup ref="popup1" type="bottom" background-color="#fff" style="z-index: 999;">
			<view style="margin-top: 10px;text-align: center;font-size: 16px;color: #000000;">请选择操作</view>
			<scroll-view scroll-y="true" style="max-height: 400px;">
				<view style="margin: 20px 10px;">
					<uni-grid :column="2">
						<uni-grid-item v-for="(item, index) in typeList" :key="index" style="height: 40px;">
							<view class="grid-item-box gridBox" @click='typeSelect(item)'
								:style="item.type==nowModel.type?'background-color: #2c96bd;color: #ffffff;':''">
								{{item.type_name}}
							</view>
						</uni-grid-item>
					</uni-grid>
				</view>
			</scroll-view>
		</uni-popup>
		<lingfeng-timepicker ref="timePop" type="date" :minDate="minDate" :maxDate="maxDate" @change="timeChange"></lingfeng-timepicker>
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
				content: '',
				nowModel:{},
				tempModel: {
					type: 1,
					type_name: '调至',
					start_time: '',
					end_time: '',
				},
				tempPageData: [],
				tempSelectIndex:0,
				typeList:[{
					type:1,
					type_name:'调至'
				},{
					type:0,
					type_name:'停课'
				}],
				minDate: {
					year: this.moment().subtract(1, 'y').format('YYYY'),month: 1,date: 1
				},
				maxDate: {
					year: this.moment().add(1, 'y').format('YYYY'),month: 12,date: 31
				},
				dateFlag:0,//0原日期，1目标日期
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
			this.navItem.text = '添加临时调课';
			this.navItem.index = 100;
			console.log('this.navItem:' + JSON.stringify(this.navItem));
			uni.setNavigationBarTitle({
				title: '添加临时调课'
			});
			this.tempPageData.push(JSON.parse(JSON.stringify(this.tempModel)));
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
			setNowModel(index){
				this.tempSelectIndex = index;
				for (var i = 0; i < this.tempPageData.length; i++) {
					var tempM = this.tempPageData[i];
					if (index == i) {
						this.nowModel = tempM;
					}
				}
			},
			showPop(model,index,flag) {
				this.dateFlag = flag;
				this.setNowModel(index);
				this.$refs.timePop.show();
			},
			timeChange(val) {
				console.log(val);
				if (this.dateFlag == 0) {
					if (val == this.nowModel.end_time) {
						this.showToast('原日期不能和目标日期一样');
						return;
					}
				} else{
					if (val == this.nowModel.start_time) {
						this.showToast('原日期不能和目标日期一样');
						return;
					}
				}
				if (this.judgeDateCan(this.dateFlag,val) == 0) {
					if (this.dateFlag == 0) {
						this.nowModel.start_time = val;
					} else{
						this.nowModel.end_time = val;
					}
					this.$refs.timePop.close();
				} else{
					this.showToast('当前日期已被选择')
				}
			},
			// 判断当前日期是否已经被选择过,flag,0原日期，1目标日期
			judgeDateCan(flag,date){
				var tempFlag = 0;
				for (var i = 0; i < this.tempPageData.length; i++) {
					var tempM = this.tempPageData[i];
					if (flag == 0&&date==tempM.start_time&&this.tempSelectIndex != i) {
						tempFlag++;
					}else if (flag == 1&&date==tempM.end_time&&this.tempSelectIndex != i) {
						tempFlag++;
					}
				}
				if (tempFlag == 0) {
					return 0; //未选
				} else {
					return 1; //已选
				}
			},
			// 判断课程调整列表，是否填写完整
			judgeTempList(){
				var tempFlag = 0;
				for (var i = 0; i < this.tempPageData.length; i++) {
					var tempM = this.tempPageData[i];
					if (tempM.start_time.length==0) {
						tempFlag++;
					}
					if (tempM.type == 1&&tempM.end_time.length==0) {
						tempFlag++;
					}
				}
				if (tempFlag == 0) {
					return 0; //未选
				} else {
					return 1; //已选
				}
			},
			typeSelect(model) {
				if (this.nowModel.type != model.type) {
					this.nowModel.type = model.type;
					this.nowModel.type_name = model.type_name;
				}
				this.$refs.popup1.close();
			},
			textClick() {
				console.log('this.tempPageData:'+JSON.stringify(this.tempPageData))
				if (this.content.length == 0) {
					this.showToast('请输入调课事由');
					return;
				} else if (this.tempPageData.length == 0) {
					this.showToast('请添加调课安排');
					return;
				}
				if (this.judgeTempList() == 1) {
					this.showToast('请将调整'+this.tempPageData.length+'填写完整');
					return;
				}
				var tempArr = [];
				for (var i = 0; i < this.tempPageData.length; i++) {
					var tempM = this.tempPageData[i];
					var tempNow = {
						type:tempM.type,
						type_name:tempM.type_name,
						start_time:tempM.start_time,
					}
					if (tempM.type == 1) {
						tempNow.end_time = tempM.end_time;
					}
					tempArr.push(tempNow);
				}
				let comData = {
					name: this.content,//临时调课名称
					time_list:tempArr,//调课内容列表
					index_code: this.navItem.index_code,
				}
				console.log('comData:'+JSON.stringify(comData));
				this.showLoading();
				// 5.2.添加临时调课
				this.post(this.globaData.INTERFACE_KHFW + 'tempChangeCourse/add', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						const eventChannel = this.getOpenerEventChannel()
						eventChannel.emit('refreshtempChangeClass');
						uni.navigateBack();
					} else {
						this.showToast(data.msg);
					}
				});
			},
			clickAdd() {
				if (this.tempPageData.length == 30) {
					this.showToast('一次最多只能添加30条调课安排');
					return;
				}
				if (this.judgeTempList() == 1) {
					this.showToast('请将调整'+this.tempPageData.length+'填写完整');
					return;
				}
				this.tempPageData.push(JSON.parse(JSON.stringify(this.tempModel)));
			},
			clickDel(model, index) {
				this.tempPageData.splice(index, 1);
			},
			typeClick(item,index){
				this.setNowModel(index);
				this.$refs.popup1.open();
			}
		}
	}
</script>

<style>
	.typeCss {
		font-size: 14px;
		color: #333333;
	}

	.rightView {
		border: 1px solid gainsboro;
		font-size: 14px;
		margin: 0 15px 0 15px;
		width: auto;
		padding-left: 15px;
		background: white;
		height: 35px;
	}

	.select-line {
		height: 3px;
		background-color: #aaaaaa;
		margin: 0 10px;
	}

	.addBtn {
		font-size: 13px;
		background: #169bd5;
		width: 150px;
		color: white;
		text-align: center;
		padding: 10px 0;
		border-radius: 4px;
		margin-left: 10px;
	}
	
	::v-deep .uni-date-x {
		padding: 0px !important;
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
	
	.gridBoxSelect {
		background-color: #2c96bd;
		color: #ffffff;
	}
	
	.titleLeft {
		padding-left: 20px;
		text-align: left;
		color: #000000;
		font-size: 14px;
		min-height: 40px;
	}
	
	.titleRight {
		min-height: 40px;
		color: #7f7f7f;
		font-size: 14px;
		margin-right: 10px;
	}
	
	.show-time{
		border: 1px solid gainsboro;
		padding: 8px;
		margin: 0px 20px 0 0;
		border-radius: 3px;
		font-size: 13px;
	}
</style>