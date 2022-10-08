<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo' text="确定" :textClick="textClick">
		</mynavBar>
		<uni-row style="margin-top: 5px;">
			<uni-col class="addEditLeft" :span="5">
				年级：
			</uni-col>
			<uni-col :span="18">
				<picker style="margin-top: 10px;" v-if="grdArray.length>0" @change="clickGrd" :value="grdIndex"
					:range="grdArray" range-key='name'>
					<view class="uni-input pickBorder">{{grdArray[grdIndex].name}}
						<uni-icons style="float: right;" size="13" type="arrowdown" color="#C2C7D6"></uni-icons>
					</view>
				</picker>
				<view class="addEditRight" v-if='grdArray.length==0'>没有获取到年级</view>
			</uni-col>
			<uni-col class="addEditLeft" :span="5">
				班级：
			</uni-col>
			<uni-col class="" :span="19">
				<picker style="margin-top: 10px;" v-if="clsArray.length>0" @change="clickCls" :value="clsIndex"
					:range="clsArray" range-key='name'>
					<view class="uni-input pickBorder">{{clsArray[clsIndex].name}}
						<uni-icons style="float: right;" size="13" type="arrowdown" color="#C2C7D6"></uni-icons>
					</view>
				</picker>
				<view class="addEditRight" v-if='clsArray.length==0'>当前年级没有班级</view>
			</uni-col>
			
			<uni-col class="addEditLeft" :span="5">
				考评类型：
			</uni-col>
			<uni-col class="" :span="19">
				<picker style="margin-top: 10px;" v-if="evaTypeArray.length>0" @change="clickEvaType" :value="evaTypeIndex"
					:range="evaTypeArray" range-key='text'>
					<view class="uni-input pickBorder">{{evaTypeArray[evaTypeIndex].text}}
						<uni-icons style="float: right;" size="13" type="arrowdown" color="#C2C7D6"></uni-icons>
					</view>
				</picker>
				<view class="addEditRight" v-if='evaTypeArray.length==0'>当前考评类型</view>
			</uni-col>
			
			<uni-col class="addEditLeft" :span="5">
				学年：
			</uni-col>
			<uni-col class="" :span="19">
				<picker style="margin-top: 10px;" v-if="yearArray.length>0" @change="clickYear" :value="yearIndex"
					:range="yearArray" range-key='text'>
					<view class="uni-input pickBorder">{{yearArray[yearIndex].text}}
						<uni-icons style="float: right;" size="13" type="arrowdown" color="#C2C7D6"></uni-icons>
					</view>
				</picker>
				<view class="addEditRight" v-if='yearArray.length==0'>当前学年</view>
			</uni-col>
			
			<uni-col class="addEditLeft" :span="5" v-if="termArray.length>0">
				学期：
			</uni-col>
			<uni-col class="" :span="19" v-if="termArray.length>0">
				<picker style="margin-top: 10px;" @change="clickTerm" :value="termIndex"
					:range="termArray" range-key='text'>
					<view class="uni-input pickBorder">{{termArray[termIndex].text}}
						<uni-icons style="float: right;" size="13" type="arrowdown" color="#C2C7D6"></uni-icons>
					</view>
				</picker>
				<view class="addEditRight" v-if='termArray.length==0'>没有学期</view>
			</uni-col>
			
			<uni-col class="addEditLeft" :span="5" v-if="monthArray.length>0&&evaTypeArray[evaTypeIndex].value!='termEvaluation'">
				月份：
			</uni-col>
			<uni-col class="" :span="19" v-if="monthArray.length>0&&evaTypeArray[evaTypeIndex].value!='termEvaluation'">
				<picker style="margin-top: 10px;" @change="clickMonth" :value="monthIndex"
					:range="monthArray" range-key='text'>
					<view class="uni-input pickBorder">{{monthArray[monthIndex].text}}
						<uni-icons style="float: right;" size="13" type="arrowdown" color="#C2C7D6"></uni-icons>
					</view>
				</picker>
				<view class="addEditRight" v-if='monthArray.length==0'>没有月份</view>
			</uni-col>
			
			<uni-col class="addEditLeft" :span="5" v-if="weekArray.length>0&&evaTypeArray[evaTypeIndex].value=='weekEvaluation'">
				周次：
			</uni-col>
			<uni-col class="" :span="19" v-if="weekArray.length>0&&evaTypeArray[evaTypeIndex].value=='weekEvaluation'">
				<picker style="margin-top: 10px;" @change="clickWeek" :value="weekIndex"
					:range="weekArray" range-key='text'>
					<view class="uni-input pickBorder">{{weekArray[weekIndex].text}}
						<uni-icons style="float: right;" size="13" type="arrowdown" color="#C2C7D6"></uni-icons>
					</view>
				</picker>
				<view class="addEditRight" v-if='weekArray.length==0'>没有周次</view>
			</uni-col>
			<uni-col class="addEditLeft" :span="5">
				日期：
			</uni-col>
			<uni-col class="rowClo" :span="19">
				<!-- <view style="color: #00CFBD;text-align: left;height: 30px;font-size: 13px;margin: 10px 0 0 20px;" -->
				<view class="uni-input pickBorder" @click="showTimePick()" style="margin-top: 10px;">
					{{timePickerDate.join(' ~ ')}}
					<uni-icons style="float: right;" type="arrowdown" size="13" color='#C2C7D6'></uni-icons>
				</view>
			</uni-col>
		</uni-row>
		<view class="content">
			<term-picker :visable.sync="pickerVisable" :defaultDate="defaultDate" :timeLimit='true' @confirm="confirm">
			</term-picker>
		</view>
	</view>
</template>

<script>
	import util from '@/commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	import sofarPicker from '@/components/term-picker/term-picker.vue';
	let _this;
	export default {
		data() {
			return {
				personInfo: {},
				navItem: {},
				grdArray: [],
				grdIndex: 0,
				clsArray: [],
				clsIndex: 0,
				evaTypeArray: [],
				evaTypeIndex: 0,
				yearArray: [],
				yearIndex: 0,
				termArray: [],
				termIndex: 0,
				monthArray: [],
				monthIndex: 0,
				weekArray: [],
				weekIndex: 0,
				defaultDate: [],
				timePickerDate: [],
				pickerVisable: false,
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
			console.log('this.navItem:' + JSON.stringify(this.navItem));
			this.navItem.text = '生成量化考评报告';
			this.navItem.name = '生成量化考评报告';
			this.navItem.index = 100;
			//#ifdef H5
			document.title = "";
			//#endif
			// 
			this.getDict();
			this.getGrd();
			// let end_month = this.moment().format('YYYY-MM-DD');
			// this.defaultDate.push(end_month);
			// this.defaultDate.push(end_month);
			// this.timePickerDate.push(end_month);
			// this.timePickerDate.push(end_month);
		},
		onShow() {
			//#ifdef H5
			document.title = ""
			//#endif
		},
		methods: {
			showTimePick() {
				this.pickerVisable = true;
			},
			// 点击确定按钮，返回当前选择的值
			confirm(date) {
				this.timePickerDate = date;
				console.log(date) // ['2021-06-01', '2021-07-01']
			},
			textClick() {
				console.log('this.timePickerDate:' + JSON.stringify(this.timePickerDate));
				if (this.timePickerDate.length==0) {
					this.showToast('请选择正确的日期');
				} else{
					var comData = {
						index_code: this.navItem.access.split("#")[1],
						cls_code: this.clsArray[this.clsIndex].value,
						grd_code: this.grdArray[this.grdIndex].value,
						begintime: this.timePickerDate[0],
						endtime: this.timePickerDate[1],
						// month: this.monthArray[this.monthIndex].value,
						school_year: this.yearArray[this.yearIndex].value,
						term_name: this.termArray[this.termIndex].value,
						// week: this.weekArray[this.weekIndex].value,
						evaluation_type: this.evaTypeArray[this.evaTypeIndex].value,
					}
					if (this.evaTypeArray[this.evaTypeIndex].value!='termEvaluation') {
						comData.month = this.monthArray[this.monthIndex].value;
					}
					if (this.evaTypeArray[this.evaTypeIndex].value=='weekEvaluation') {
						comData.week = this.weekArray[this.weekIndex].value;
					}
					console.log('comData:' + JSON.stringify(comData));
					this.showLoading();
					// // 38.量化考评-确认生成量化报告
					this.post(this.globaData.INTERFACE_LHKP + 'Evaluation/generateStatisticsReport', comData, (data0,
						data) => {
						this.hideLoading();
						if (data.code == 0) {
							const eventChannel = this.getOpenerEventChannel()
							eventChannel.emit('refreshEvaluationIndex');
							uni.navigateBack();
						} else {
							this.showToast(data.msg);
						}
					});
				}
			},
			clickGrd: function(e) {
				if (this.grdIndex !== e.target.value) {
					this.grdIndex = e.target.value;
					this.clsIndex = 0;
					this.clsArray = [];
					this.showLoading();
					this.getCls();
				}
			},
			clickCls: function(e) {
				if (this.clsIndex !== e.detail.value) {
					this.clsIndex = e.detail.value
				}
			},
			clickEvaType: function(e) {
				if (this.evaTypeIndex !== e.detail.value) {
					this.evaTypeIndex = e.detail.value
				}
			},
			clickYear: function(e) {
				if (this.yearIndex !== e.detail.value) {
					this.yearIndex = e.detail.value
				}
			},
			clickTerm: function(e) {
				if (this.termIndex !== e.detail.value) {
					this.termIndex = e.detail.value
				}
			},
			clickMonth: function(e) {
				if (this.monthIndex !== e.detail.value) {
					this.monthIndex = e.detail.value
				}
			},
			clickWeek: function(e) {
				if (this.weekIndex !== e.detail.value) {
					this.weekIndex = e.detail.value
				}
			},
			getGrd() { //获取年级
				let comData = {
					op_code: 'index',
					get_grd: true,
					all_grd: false,
					index_code: this.navItem.access.split("#")[1],
				}
				this.post(this.globaData.INTERFACE_HR_SUB + 'acl/dataRange', comData, response => {
					this.hideLoading()
					if (response.grd_list.length > 0) {
						this.grdArray = response.grd_list;
						this.getCls();
					} else {
						this.showToast('无数据授权 无法获取年级');
					}
				})
			},
			getCls() { //获取班级
				let comData = {
					op_code: 'index',
					grd_code: this.grdArray[this.grdIndex].value,
					get_cls: true,
					all_cls: false,
					index_code: this.navItem.access.split("#")[1],
				}
				this.post(this.globaData.INTERFACE_HR_SUB + 'acl/dataRange', comData, response => {
					this.hideLoading()
					if (response.cls_list.length > 0) {
						this.clsArray = response.cls_list;
					} else {
						this.showToast('无数据授权 无法获取班级');
					}
				})
			},
			getDict() {
				var comData = {
					index_code: this.navItem.access.split("#")[1],
				}
				this.showLoading();
				// 
				this.post(this.globaData.INTERFACE_LHKP + 'Evaluation/getDict', comData, (data0,
					data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.yearArray = data.data.school_year_array;
						this.termArray = data.data.term_array;
						this.evaTypeArray = data.data.evaluation_type_array;
						this.monthArray = data.data.month_array;
						this.weekArray = data.data.week_array;
					} else {
						this.showToast(data.msg);
					}
				});
			}
		}
	}
</script>

<style>
	.addEditLeft {
		text-align: right;
		margin-top: 20px;
		font-size: 14px;
		color: #505050;
	}

	.addEditRight {
		text-align: left;
		margin-top: 20px;
		font-size: 14px;
		color: #E6A23C;
	}

	.pickBorder {
		border: 1px solid #e5e5e5;
		width: 220px;
		border-radius: 5px;
	}

	::v-deep .mini-date .uni-input {
		text-align: left !important;
		margin-left: 10px;
		font-size: 14px !important;
		color: #000000 !important;
	}
</style>
