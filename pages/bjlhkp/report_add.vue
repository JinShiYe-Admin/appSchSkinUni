<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo'>
		</mynavBar>
		<uni-row style="margin-top: 20px;">
			<uni-col :span="8">
				<view class="titleLeft">年级：</view>
			</uni-col>
			<uni-col :span="16">
				<view @click="grdClick()" class="titleRight">
					{{grdStr}}
					<uni-icons style="margin-left: 20px;" type="bottom" color='#7f7f7f' size="14"></uni-icons>
				</view>
			</uni-col>
			<uni-col :span="8">
				<view class="titleLeft">班级：</view>
			</uni-col>
			<uni-col :span="16">
				<view @click="clsClick()" class="titleRight">
					{{clsStr}}
					<uni-icons style="margin-left: 20px;" type="bottom" color='#7f7f7f' size="14"></uni-icons>
				</view>
			</uni-col>
			<uni-col :span="8" style="margin-top: 5px;">
				<view class="titleLeft">考评类型：</view>
			</uni-col>
			<uni-col :span="16" style="margin-top: 5px;">
				<view @click="evaTypeClick()" class="titleRight">
					{{evaTypeStr}}
					<uni-icons style="margin-left: 20px;" type="bottom" color='#7f7f7f' size="14"></uni-icons>
				</view>
			</uni-col>
			<uni-col :span="8">
				<view class="titleLeft">学年：</view>
			</uni-col>
			<uni-col :span="16">
				<view @click="yearClick()" class="titleRight">
					{{yearStr}}
					<uni-icons style="margin-left: 20px;" type="bottom" color='#7f7f7f' size="14"></uni-icons>
				</view>
			</uni-col>
			<uni-col :span="8">
				<view class="titleLeft" style="">学期：</view>
			</uni-col>
			<uni-col :span="16">
				<view @click="termClick()" class="titleRight">
					{{termStr}}
					<uni-icons style="margin-left: 20px;" type="bottom" color='#7f7f7f' size="14"></uni-icons>
				</view>
			</uni-col>
			<view v-if="evaTypeArray[evaTypeIndex].value==2">
				<uni-col :span="8">
					<view class="titleLeft" style="">周次：</view>
				</uni-col>
				<uni-col :span="16">
					<view @click="weekClick()" class="titleRight">
						{{weekStr}}
						<uni-icons style="margin-left: 20px;" type="bottom" color='#7f7f7f' size="14"></uni-icons>
					</view>
				</uni-col>
			</view>
			<view v-if="evaTypeArray[evaTypeIndex].value==3">
				<uni-col :span="8">
					<view class="titleLeft" style="">月份：</view>
				</uni-col>
				<uni-col :span="16">
					<view @click="monthClick()" class="titleRight">
						{{monthStr}}
						<uni-icons style="margin-left: 20px;" type="bottom" color='#7f7f7f' size="14"></uni-icons>
					</view>
				</uni-col>
			</view>
			<uni-col :span="8">
				<view class="titleLeft" style="">考评时段：</view>
			</uni-col>
			<uni-col :span="16">
				<view v-if="evaTypeArray[evaTypeIndex].value==1" style="margin-top: -10px;">
					<uni-datetime-picker type="date" :clear-icon="false" :border="false" v-model="defTime" />
					<uni-easyinput-select style="float: left;margin-top: -35px;width: 40px;margin-left: 130px;"
						:inputBorder="false" suffixIcon="arrowdown" disabled></uni-easyinput-select>
				</view>
				<view v-else @click="showTimePick()">
					<view class="uni-input" @click="showTimePick()" style="margin-top: -10px;">
						{{timePickerDate.join(' ~ ')}}
						<uni-icons style="margin-left: 20px;" type="arrowdown" size="13" color='#C2C7D6'></uni-icons>
					</view>
				</view>
				<view style="height: 15px;"></view>
			</uni-col>
			<!-- <uni-col :span="8">
				<view class="titleLeft" style="">计算规则：</view>
			</uni-col>
			<uni-col :span="16">
				<view class="titleRight">
					<view class="titleRight">
						<radio-group @change="radioChange">
							<view>
								<label class="radio"><radio value="1" :checked="defaultRadio==1" />本考评周期内加减法累计</label>
							</view>
							<view style="margin-top: 15px;">
								<label class="radio"><radio value="2" :checked="defaultRadio==2" />本考评周期内日评均值</label>
							</view>
						</radio-group>
					</view>
				</view>
			</uni-col> -->
		</uni-row>
		<view style="height: 50px;margin-top: 20px;">
			<button class="mini-btn submitBtn" type="default" size="mini"
				style="background-color: #049f95;border-color: #049f95;color: #ffffff;" @click="submitBtn()">保存</button>
		</view>
		<view style="height: 5px;"></view>
		<uni-popup ref="popup0" type="bottom" background-color="#fff" style="">
			<view style="margin-top: 10px;text-align: center;font-size: 16px;color: #000000;">请选择年级</view>
			<view style="margin: 20px 10px;">
				<uni-grid :column="3">
					<uni-grid-item v-for="(item, index) in grdArray" :key="index" style="height: 50px;">
						<view class="grid-item-box gridBox" style="padding-top: 10px;" @click='grdSelect(index)'
							:style="index==grdIndex?'background-color: #2c96bd;color: #ffffff;':''">
							{{item.text}}
						</view>
					</uni-grid-item>
				</uni-grid>
			</view>
		</uni-popup>
		<uni-popup ref="popup1" type="bottom" background-color="#fff" style="">
			<view style="margin-top: 10px;text-align: center;font-size: 16px;color: #000000;">请选择班级</view>
			<view style="margin: 20px 10px;">
				<uni-grid :column="4">
					<uni-grid-item v-for="(item, index) in clsArray" :key="index" style="height: 40px;">
						<view class="grid-item-box gridBox" @click='clsSelect(index)'
							:style="index==clsIndex?'background-color: #2c96bd;color: #ffffff;':''">
							{{item.text}}
						</view>
					</uni-grid-item>
				</uni-grid>
			</view>
		</uni-popup>
		<uni-popup ref="popup2" type="bottom" background-color="#fff" style="">
			<view style="margin-top: 10px;text-align: center;font-size: 16px;color: #000000;">请选择考评类型</view>
			<view style="margin: 20px 10px;">
				<uni-grid :column="1">
					<uni-grid-item v-for="(item, index) in evaTypeArray" :key="index" style="height: 40px;">
						<view class="grid-item-box gridBox" @click='evaTypeSelect(index)'
							:style="index==evaTypeIndex?'background-color: #2c96bd;color: #ffffff;':''">
							{{item.text}}
						</view>
					</uni-grid-item>
				</uni-grid>
			</view>
		</uni-popup>
		<uni-popup ref="popup3" type="bottom" background-color="#fff" style="">
			<view style="margin-top: 10px;text-align: center;font-size: 16px;color: #000000;">请选择学年</view>
			<view style="margin: 20px 10px;">
				<scroll-view scroll-y="true" style="max-height: 400px;">
					<uni-grid :column="1">
						<uni-grid-item v-for="(item, index) in yearArray" :key="index" style="height: 40px;">
							<view class="grid-item-box gridBox" @click='yearSelect(index)'
								:style="index==yearIndex?'background-color: #2c96bd;color: #ffffff;':''">
								{{item.text}}
							</view>
						</uni-grid-item>
					</uni-grid>
				</scroll-view>
			</view>
		</uni-popup>
		<uni-popup ref="popup4" type="bottom" background-color="#fff" style="">
			<view style="margin-top: 10px;text-align: center;font-size: 16px;color: #000000;">请选择学期</view>
			<view style="margin: 20px 10px;">
				<scroll-view scroll-y="true" style="max-height: 400px;">
					<uni-grid :column="1">
						<uni-grid-item v-for="(item, index) in termArray" :key="index" style="height: 40px;">
							<view class="grid-item-box gridBox" @click='termSelect(index)'
								:style="index==termIndex?'background-color: #2c96bd;color: #ffffff;':''">
								{{item.text}}
							</view>
						</uni-grid-item>
					</uni-grid>
				</scroll-view>
			</view>
		</uni-popup>
		<uni-popup ref="popup5" type="bottom" background-color="#fff" style="">
			<view style="margin-top: 10px;text-align: center;font-size: 16px;color: #000000;">请选择周次</view>
			<view style="margin: 20px 10px;">
				<scroll-view scroll-y="true" style="max-height: 400px;">
					<uni-grid :column="3">
						<uni-grid-item v-for="(item, index) in weekArray" :key="index" style="height: 40px;">
							<view class="grid-item-box gridBox" @click='weekSelect(index)'
								:style="index==weekIndex?'background-color: #2c96bd;color: #ffffff;':''">
								{{item.text}}
							</view>
						</uni-grid-item>
					</uni-grid>
				</scroll-view>
			</view>
		</uni-popup>
		<uni-popup ref="popup6" type="bottom" background-color="#fff" style="">
			<view style="margin-top: 10px;text-align: center;font-size: 16px;color: #000000;">请选择月份</view>
			<view style="margin: 20px 10px;">
				<scroll-view scroll-y="true" style="max-height: 400px;">
					<uni-grid :column="3">
						<uni-grid-item v-for="(item, index) in monthArray" :key="index" style="height: 40px;">
							<view class="grid-item-box gridBox" @click='monthSelect(index)'
								:style="index==monthIndex?'background-color: #2c96bd;color: #ffffff;':''">
								{{item.text}}
							</view>
						</uni-grid-item>
					</uni-grid>
				</scroll-view>
			</view>
		</uni-popup>
		<view class="content">
			<term-picker :visable.sync="pickerVisable" :defaultDate="defaultDate" :timeLimit='true' @confirm="confirm">
			</term-picker>
		</view>
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
				icon: '',
				navItem: {},
				pagedata: [],
				grdIndex: 0,
				grdArray: [{
					text: '',
					value: ''
				}],
				clsIndex: 0,
				clsArray: [{
					text: '',
					value: ''
				}],
				yearIndex: 0,
				yearArray: [{
					text: '',
					value: ''
				}],
				termIndex: 0,
				termArray: [{
					text: '',
					value: ''
				}],
				evaTypeIndex: 0,
				evaTypeArray: [{
					text: '日评',
					value: 1
				},{
					text: '周评',
					value: 2
				},{
					text: '月评',
					value: 3
				},{
					text: '期中评',
					value: 4
				},{
					text: '期末评',
					value: 5
				}],
				monthIndex: 0,
				monthArray: [],
				weekIndex: 0,
				weekArray: [],
				grdStr: '',
				clsStr: '',
				yearStr: '',
				termStr: '',
				evaTypeStr: '',
				monthStr: '',
				weekStr: '',
				pickerVisable: false,
				defaultDate: [],
				timePickerDate: [],
				defaultRadio:1,
				defTime: this.moment().format('YYYY-MM-DD'),
			}
		},
		components: {
			mynavBar
		},
		methods: {
			radioChange(e){
				this.defaultRadio = e.detail.value;
			},
			showTimePick() {
				this.pickerVisable = true;
			},
			confirm(date) {
				this.timePickerDate = date;
				console.log(date) // ['2021-06-01', '2021-07-01']
			},
			grdClick() {
				this.$refs.popup0.open();
			},
			grdSelect(index) {
				console.log('this.grdArray:' + JSON.stringify(this.grdArray));
				if (this.grdIndex != index) {
					this.grdIndex = index;
					this.clsIndex = 0;
					this.grdStr = this.grdArray[this.grdIndex].text;
					this.getCls();
				}
				this.$refs.popup0.close();
			},
			clsClick() {
				this.$refs.popup1.open();
			},
			clsSelect(index) {
				if (this.clsIndex != index) {
					this.clsIndex = index;
					this.clsStr = this.clsArray[this.clsIndex].text;
				}
				this.$refs.popup1.close();
			},
			evaTypeClick() {
				this.$refs.popup2.open();
			},
			evaTypeSelect(index) {
				if (this.evaTypeIndex != index) {
					this.evaTypeIndex = index;
					this.evaTypeStr = this.evaTypeArray[this.evaTypeIndex].text;
				}
				this.$refs.popup2.close();
			},
			yearClick() {
				this.$refs.popup3.open();
			},
			yearSelect(index) {
				if (this.yearIndex != index) {
					this.yearIndex = index;
					this.yearStr = this.yearArray[this.yearIndex].text;
				}
				this.$refs.popup3.close();
			},
			termClick() {
				this.$refs.popup4.open();
			},
			termSelect(index) {
				if (this.termIndex != index) {
					this.termIndex = index;
					this.termStr = this.termArray[this.termIndex].text;
				}
				this.$refs.popup4.close();
			},
			weekClick() {
				this.$refs.popup5.open();
			},
			weekSelect(index) {
				if (this.weekIndex != index) {
					this.weekIndex = index;
					this.weekStr = this.weekArray[this.weekIndex].text;
				}
				this.$refs.popup5.close();
			},
			monthClick() {
				this.$refs.popup6.open();
			},
			monthSelect(index) {
				if (this.monthIndex != index) {
					this.monthIndex = index;
					this.monthStr = this.monthArray[this.monthIndex].text;
				}
				this.$refs.popup6.close();
			},
			// getGrd() { //获取年级
			// 	let comData = {
			// 		op_code: 'index',
			// 		get_grd: true,
			// 		all_grd: false,
			// 		index_code: this.index_code,
			// 	}
			// 	this.post(this.globaData.INTERFACE_HR_SUB + 'acl/dataRange', comData, response => {
			// 		this.hideLoading()
			// 		let grds = response.grd_list;
			// 		let grdArray = [];
			// 		grds.map(function(currentValue) {
			// 			let name = currentValue.name.indexOf('全部') == -1 ? currentValue.name : '全部年级';
			// 			let obj = {};
			// 			obj.value = currentValue.value;
			// 			obj.text = name;
			// 			grdArray.push(obj)
			// 		})
			// 		if (grdArray.length > 0) {
			// 			this.grdArray = grdArray;
			// 			this.grdStr = this.grdArray[this.grdIndex].text;
			// 			this.getCls();
			// 		} else {
			// 			this.grdArray = [];
			// 			this.showToast('无数据授权 无法获取年级');
			// 		}
			// 	})
			// },
			// getCls() { //获取班级
			// 	let comData = {
			// 		op_code: 'index',
			// 		grd_code: this.grdArray[this.grdIndex].value,
			// 		get_cls: true,
			// 		all_cls: false,
			// 		index_code: this.index_code,
			// 	}
			// 	this.post(this.globaData.INTERFACE_HR_SUB + 'acl/dataRange', comData, response => {
			// 		this.hideLoading()
			// 		let clss = response.cls_list;
			// 		let clsArray = [];
			// 		clss.map(function(currentValue) {
			// 			let obj = {};
			// 			let name = currentValue.name.indexOf('全部') == -1 ? currentValue.name : '全部班级';
			// 			obj.value = currentValue.value;
			// 			obj.text = name;
			// 			clsArray.push(obj)
			// 		})
			// 		if (clsArray.length > 0) {
			// 			this.clsArray = clsArray;
			// 			this.clsStr = this.clsArray[this.clsIndex].text;
			// 		} else {
			// 			this.clsArray = [];
			// 			this.showToast('无数据授权 无法获取班级');
			// 		}
			// 	})
			// },
			getGrd() { //获取年级
				let comData = {
					is_finish: '0',
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB + 'grd', comData, response => {
					this.hideLoading()
					let grds = response.list;
					let grdArray = [{value:'',text:'全部'}];
					grds.map(function(currentValue) {
						let obj = {};
						obj.value = currentValue.grd_code;
						obj.text = currentValue.grd_name;
						grdArray.push(obj)
					})
					if (grdArray.length > 0) {
						this.grdArray = grdArray;
						this.grdStr = this.grdArray[this.grdIndex].text;
						this.getCls();
					} else {
						this.grdArray = [];
						this.showToast(data.msg);
					}
				})
			},
			getCls() { //获取班级
				let comData = {
					grd_codes: this.grdArray[this.grdIndex].value,
					is_finish: '0',
					all_cls: false,
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB + 'cls', comData, response => {
					this.hideLoading()
					let clss = response.list;
					let clsArray = [{value:'',text:'全部'}];
					clss.map(function(currentValue) {
						let obj = {};
						obj.value = currentValue.cls_code;
						obj.text = currentValue.cls_name;
						clsArray.push(obj)
					})
					if (clsArray.length > 0) {
						this.clsArray = clsArray;
						this.clsStr = this.clsArray[this.clsIndex].text;
					} else {
						this.clsArray = [];
						this.showToast(data.msg);
					}
				})
			},
			getDict() {
				var comData = {
					index_code: this.index_code,
				}
				this.showLoading();
				// 
				this.post(this.globaData.INTERFACE_HR_SUB + 'year', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						let tempYear = [];
						data.data.list.map(function(currentValue) {
							let obj = {};
							obj.value = currentValue.year_code;
							obj.text = currentValue.year_name;
							tempYear.push(obj)
						})
						this.yearArray = tempYear;
						this.yearStr = this.yearArray[this.yearIndex].text;
					} else {
						this.showToast(data.msg);
					}
				});
				comData = {
					stat:1,
					name:'',
					page_size:999,
					page_number:1,
					index_code: this.index_code,
				}
				this.showLoading();
				// 
				this.post(this.globaData.INTERFACE_BASESUB + 'SysTermP', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						let tempTerm = [];
						data.data.list.map(function(currentValue) {
							let obj = {};
							obj.value = currentValue.term_code;
							obj.text = currentValue.term_name;
							tempTerm.push(obj)
						})
						this.termArray = tempTerm;
						this.termStr = this.termArray[this.termIndex].text;
					} else {
						this.showToast(data.msg);
					}
				});
			},
			submitBtn() {
				this.showLoading();
				var tempData = {
					kp_date: this.defTime, //日期
					grd_code: this.grdArray[this.grdIndex].value, //年级代码
					grd_name: this.grdArray[this.grdIndex].text, //年级名称
					cls_code: this.clsArray[this.clsIndex].value, //班级代码
					cls_name: this.clsArray[this.clsIndex].text, //班级名称
					kp_type: this.evaTypeArray[this.evaTypeIndex].value, //考评类型
					year_code: this.yearArray[this.yearIndex].value, //学年代码
					year_name: this.yearArray[this.yearIndex].text, //学年名称
					term_code: this.termArray[this.termIndex].value, //学期代码
					term_name: this.termArray[this.termIndex].text, //学期名称
					month_no:this.monthArray[this.monthIndex].value, //月份
					week_no:this.weekArray[this.weekIndex].value, //周次
					start_date: this.timePickerDate[0],
					end_date:this.timePickerDate[1],
					create_user_code: this.personInfo.user_code, //记录人代码
					create_user_name: this.personInfo.user_name, //发记录人姓名
					rules:this.defaultRadio,
					index_code: this.index_code,
				}
				if (tempData.grd_code == '') {
					tempData.grd_code = '-1';
				}
				if (tempData.cls_code == '') {
					tempData.cls_code = '-1';
				}
				if (this.evaTypeArray[this.evaTypeIndex].value == 1) {
					tempData.start_date = this.defTime;
					tempData.end_date = this.defTime;
				}
				console.log('tempData:' + JSON.stringify(tempData));
				//4.2.添加
				this.post(this.globaData.INTERFACE_BJLHKP + 'report/add', tempData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						const eventChannel = this.getOpenerEventChannel()
						eventChannel.emit('refreshRecordList');
						uni.navigateBack();
					} else {
						this.showToast(data.msg);
					}
				});
			},
		},
		onLoad(options) {
			_this = this;
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(options);
			itemData.index = 100;
			itemData.text = '添加';
			this.navItem = itemData;
			console.log('this.navItem:' + JSON.stringify(this.navItem));
			this.index_code = itemData.index_code
			this.getGrd();
			this.getDict();
			let end_month = this.moment().format('YYYY-MM-DD')
			let start_month = this.moment().subtract(1, 'M').format('YYYY-MM-DD');
			this.defaultDate.push(start_month);
			this.defaultDate.push(end_month);
			this.timePickerDate.push(start_month);
			this.timePickerDate.push(end_month);
			this.evaTypeStr = this.evaTypeArray[this.evaTypeIndex].text;
			for (var i = 1; i < 13; i++) {
				this.monthArray.push({
					value:i,
					text:i+'月'
				})
			}
			this.monthStr = this.monthArray[this.monthIndex].text;
			for (var i = 1; i < 31; i++) {
				this.weekArray.push({
					value:i,
					text:'第'+i+'周'
				})
			}
			this.weekStr = this.weekArray[this.weekIndex].text;
			//#ifdef H5
			document.title = ""
			//#endif
		},
		onShow() { //解决IOS端列表进详情返回后不能定位到点击位置的问题
			// #ifdef H5
			uni.pageScrollTo({
				scrollTop: this.scrollLength,
				duration: 0
			});
			// #endif
			//#ifdef H5
			document.title = ""
			//#endif
		},
		onPageScroll(e) { //nvue暂不支持滚动监听，可用bindingx代替
			// #ifdef H5
			this.scrollLength = e.scrollTop
			// #endif
		},
	}
</script>

<style>
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

	.mini-btn {
		width: 100px;
		height: 40px;
		padding-top: 5px !important;
		margin-left: calc(100% - 300px);
		font-size: 14px;
		color: #333333;
		background: #d7d7d7;
	}

	.rightView {
		border: 1px solid gainsboro;
		font-size: 14px;
		padding-left: 5px;
		height: 80px;
		padding-top: 5px;
		margin: 0 10px 0 0;
		margin-right: 15px;
		width: auto;
	}

	.submitBtn {
		width: calc(100% - 60px);
		margin-left: 30px;
	}
</style>
