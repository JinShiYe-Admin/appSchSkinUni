<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo'>
		</mynavBar>
		<view class="tabs-fixed" style="background-color: #FFFFFF;">
			<uni-row>
				<uni-col :span="8">
					<view @click="grdClick()" style="font-size: 13px;padding-top: 10px;padding-left: 15px;">
						{{grdStr}}
						<uni-icons style="float: right;margin-right: 20px;" type="bottom" color='#7f7f7f' size="14"></uni-icons>
					</view>
				</uni-col>
				<uni-col :span="8">
					<view @click="clsClick()" style="font-size: 13px;padding-top: 10px;padding-left: 15px;">
						{{clsStr}}
						<uni-icons style="float: right;margin-right: 20px;" type="bottom" color='#7f7f7f' size="14"></uni-icons>
					</view>
				</uni-col>
				<uni-col :span="8">
					<view @click="stuClick()" style="font-size: 13px;padding-top: 10px;padding-left: 15px;">
						{{stuStr}}
						<uni-icons style="float: right;margin-right: 20px;" type="bottom" color='#7f7f7f' size="14"></uni-icons>
					</view>
				</uni-col>
				<uni-col :span="14" style="">
					<view style="color: #00CFBD;text-align: left;height: 30px;font-size: 13px;margin: 10px 0 0 20px;"
						@click="showTimePick()">
						{{timePickerDate.join(' ~ ')}}
						<uni-icons type="arrowdown" size="15" color='#00CFBD'></uni-icons>
					</view>
				</uni-col>
			</uni-row>
			<view class="select-line"></view>
		</view>
		<view style="padding-top: 74px;">
			<view style="margin: 10px;height: 450px;">
				<zb-table v-if="columns.length>0" @rowClick="rowClick" :show-header="true" :columns="columns" :stripe="true" :fit="true" :data="dataSource"></zb-table>
			</view>
		</view>
		<view class="content">
			<term-picker :visable.sync="pickerVisable" :defaultDate="defaultDate" :timeLimit='true'
				@confirm="confirm"></term-picker>
		</view>
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
			<!-- <view style="height: 5px;"></view> -->
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
			<!-- <view style="height: 5px;"></view> -->
		</uni-popup>
		<uni-popup ref="popup2" type="bottom" background-color="#fff" style="">
			<view style="margin-top: 10px;text-align: center;font-size: 16px;color: #000000;">请选择学生</view>
			<view style="margin: 20px 10px;">
				<scroll-view scroll-y="true" style="max-height: 400px;">
					<uni-grid :column="4">
						<uni-grid-item v-for="(item, index) in stuArray" :key="index" style="height: 40px;">
							<view class="grid-item-box gridBox" @click='stuSelect(index)'
								:style="index==stuIndex?'background-color: #2c96bd;color: #ffffff;':''">
								{{item.text}}
							</view>
						</uni-grid-item>
					</uni-grid>
				</scroll-view>
			</view>
			<!-- <view style="height: 20px;"></view> -->
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
				index_code: '',
				personInfo: {},
				navItem: {},
				pickerVisable: false,
				defaultDate: [],
				timePickerDate: [],
				defTime: this.moment().format('YYYY-MM-DD'),
				grdIndex: 0,
				grdArray: [],
				clsIndex: 0,
				clsArray: [],
				stuIndex: 0,
				stuArray: [],
				grdStr: '',
				clsStr: '',
				stuStr: '',
				columns: [],
				dataSource:[] 
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
			this.navItem.text = '学生课时';
			this.navItem.index = 100;
			this.index_code = this.navItem.access.split("#")[1];
			console.log('this.navItem:' + JSON.stringify(this.navItem));
			uni.setNavigationBarTitle({
				title: '学生课时'
			});
			let end_month = this.moment().format('YYYY-MM-DD')
			let start_month = this.moment().subtract(1, 'M').format('YYYY-MM-DD');
			this.defaultDate.push(start_month);
			this.defaultDate.push(end_month);
			this.timePickerDate.push(start_month);
			this.timePickerDate.push(end_month);
			this.getGrd();
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
			rowClick(row ,index){
				console.log('rowClick:'+JSON.stringify(row))
				row.index_code = this.index_code;
				row.start_date = this.timePickerDate[0];
				row.end_date = this.timePickerDate[1];
				util.openwithData('/pages/khfw/stuClassHourDetail',row);
			},
			showTimePick() {
				this.pickerVisable = true;
			},
			// 点击确定按钮，返回当前选择的值
			confirm(date) {
				this.timePickerDate = date;
				console.log(date) // ['2021-06-01', '2021-07-01']
				this.getPageData();
			},
			grdClick() {
				this.$refs.popup0.open();
			},
			grdSelect(index) {
				console.log('this.grdArray:' + JSON.stringify(this.grdArray));
				if (this.grdIndex != index) {
					this.grdIndex = index;
					this.clsIndex = 0;
					this.stuIndex = 0;
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
					this.stuIndex = 0;
					this.clsStr = this.clsArray[this.clsIndex].text;
					this.getStu();
				}
				this.$refs.popup1.close();
			},
			stuClick() {
				this.$refs.popup2.open();
			},
			stuSelect(index) {
				if (this.stuIndex != index) {
					this.stuIndex = index;
					this.stuStr = this.stuArray[this.stuIndex].text;
					this.getPageData();
				}
				this.$refs.popup2.close();
			},
			getGrd() { //获取年级
				let comData = {
					op_code: 'index',
					get_grd: true,
					all_grd: true,
					index_code: this.index_code,
				}
				this.showLoading()
				this.post(this.globaData.INTERFACE_HR_SUB + 'acl/dataRange', comData, response => {
					this.hideLoading()
					let grds = response.grd_list;
					let grdArray = [];
					grds.map(function(currentValue) {
						let name = currentValue.name.indexOf('全部') == -1 ? currentValue.name : '全部年级';
						let obj = {};
						obj.value = currentValue.value;
						obj.text = name;
						grdArray.push(obj)
					})
					if (grdArray.length > 0) {
						this.grdArray = grdArray;
						this.grdStr = this.grdArray[this.grdIndex].text;
						this.getCls();
					} else {
						this.grdArray = [];
						this.showToast('无数据授权 无法获取年级');
					}
				})
			},
			getCls() { //获取班级
				let comData = {
					op_code: 'index',
					grd_code: this.grdArray[this.grdIndex].value,
					get_cls: true,
					all_cls: true,
					index_code: this.index_code,
				}
				this.showLoading()
				this.post(this.globaData.INTERFACE_HR_SUB + 'acl/dataRange', comData, response => {
					this.hideLoading()
					let clss = response.cls_list;
					let clsArray = [];
					clss.map(function(currentValue) {
						let obj = {};
						let name = currentValue.name.indexOf('全部') == -1 ? currentValue.name : '全部班级';
						obj.value = currentValue.value;
						obj.text = name;
						clsArray.push(obj)
					})
					if (clsArray.length > 0) {
						this.clsArray = clsArray;
						this.clsStr = this.clsArray[this.clsIndex].text;
						this.getStu();
					} else {
						this.clsArray = [];
						this.showToast('无数据授权 无法获取班级');
					}
				})
			},
			getStu() { //获取学生
				let comData = {
					op_code: 'index',
					grd_code: this.grdArray[this.grdIndex].value,
					cls_code: this.clsArray[this.clsIndex].value,
					get_stu: true,
					all_stu: true,
					index_code: this.index_code,
				}
				this.showLoading()
				this.post(this.globaData.INTERFACE_HR_SUB + 'acl/dataRange', comData, response => {
					this.hideLoading()
					let stu = response.stu_list;
					let stuArray = [];
					stu.map(function(currentValue) {
						let obj = {};
						let name = currentValue.name.indexOf('全部') == -1 ? currentValue.name : '全部学生';
						obj.value = currentValue.value;
						obj.text = name;
						obj.selectFlag = 0;
						stuArray.push(obj)
					})
					if (stuArray.length > 0) {
						this.stuArray = stuArray;
						this.stuStr = this.stuArray[this.stuIndex].text;
						this.getPageData();
					} else {
						this.stuArray = [];
						this.showToast('无数据授权 无法获取班级');
					}
				})
			},
			getPageData() {
				let comData = {
					start_date:this.timePickerDate[0],
					end_date:this.timePickerDate[1],
					grd_code: this.grdArray[this.grdIndex].value, //年级代码
					cls_code: this.clsArray[this.clsIndex].value, //班级代码
					stu_code: this.stuArray[this.stuIndex].value, //学生代码
					index_code: this.navItem.access.split("#")[1],
				}
				this.showLoading()
				this.post(this.globaData.INTERFACE_KHFW + 'afterClassStat/stuStat', comData, (data0, data) => {
					this.hideLoading()
					if (data.code == 0) {
						var tempCol = [];
						var tempDs = [];
						tempCol.push({
							label: '学生',
							name: 'stu_name_show',
							align:'center',
							// fixed:true
						})
						tempCol.push({
							label: '年级',
							name: 'grd_name',
							align:'center',
							fixed:false
						})
						tempCol.push({
							label: '班级',
							name: 'cls_name',
							align:'center',
							fixed:false
						})
						tempCol.push({
							label: '报名课时量(节)',
							name: 'stu_sub_num',
							align:'center',
							fixed:false
						})
						tempCol.push({
							label: '已上课时量(节)',
							name: 'stu_sign_num',
							align:'center',
							fixed:false
						})
						this.columns = tempCol;
						for (var i = 0; i < data.data.list.length; i++) {
							var tempM = data.data.list[i];
							tempM.stu_name_show = tempM.sno&&tempM.sno.length>0?tempM.stu_name+'('+tempM.sno+')':tempM.stu_name
							tempM.stu_sub_num = parseInt(tempM.stu_sub_num);
							tempM.stu_sign_num = parseInt(tempM.stu_sign_num);
						}
						this.dataSource = data.data.list;
					} else {
						this.showToast(data.msg);
					}
				})
			},
		}
	}
</script>

<style>
	.select-line {
		height: 2px;
		background-color: #00CFBD;
		margin: 0 -15px;
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
</style>
