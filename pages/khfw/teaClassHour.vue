<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo'>
		</mynavBar>
		<view class="tabs-fixed" style="background-color: #FFFFFF;">
			<uni-row>
				<uni-col :span="14" style="">
					<view style="color: #00CFBD;text-align: left;height: 30px;font-size: 13px;margin: 10px 0 0 20px;"
						@click="showTimePick()">
						{{timePickerDate.join(' ~ ')}}
						<uni-icons type="arrowdown" size="15" color='#00CFBD'></uni-icons>
					</view>
				</uni-col>
				<uni-col :span="10">
					<view @click="teaClick()" style="font-size: 13px;padding-top: 10px;margin-left: 10px;">
						{{teaStr}}
						<uni-icons style="float: right;margin-right: 20px;" type="bottom" color='#7f7f7f' size="14"></uni-icons>
					</view>
				</uni-col>
			</uni-row>
			<view class="select-line"></view>
		</view>
		<view style="padding-top: 44px;">
			<view style="margin: 10px;height: 450px;">
				<zb-table v-if="columns.length>0" @rowClick="rowClick" :show-header="true" :columns="columns" :stripe="true" :fit="true" :data="dataSource"></zb-table>
			</view>
		</view>
		<view class="content">
			<term-picker :visable.sync="pickerVisable" :defaultDate="defaultDate" :timeLimit='true'
				@confirm="confirm"></term-picker>
		</view>
		<uni-popup ref="popup0" type="bottom" background-color="#fff" style="">
			<view style="margin-top: 10px;text-align: center;font-size: 16px;color: #000000;">请选择老师</view>
			<view style="margin: 20px 10px;">
				<uni-grid :column="3">
					<uni-grid-item v-for="(item, index) in teaArray" :key="index" style="height: 50px;">
						<view class="grid-item-box gridBox" style="padding-top: 10px;" @click='teaSelect(index)'
							:style="index==teaIndex?'background-color: #2c96bd;color: #ffffff;':''">
							{{item.tec_name}}
						</view>
					</uni-grid-item>
				</uni-grid>
			</view>
			<!-- <view style="height: 5px;"></view> -->
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
				teaStr:'',
				teaIndex: 0,
				teaArray: [],
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
			this.navItem.text = '教师课时';
			this.navItem.index = 100;
			this.index_code = this.navItem.access.split("#")[1];
			console.log('this.navItem:' + JSON.stringify(this.navItem));
			uni.setNavigationBarTitle({
				title: '教师课时'
			});
			let end_month = this.moment().format('YYYY-MM-DD')
			let start_month = this.moment().subtract(1, 'M').format('YYYY-MM-DD');
			this.defaultDate.push(start_month);
			this.defaultDate.push(end_month);
			this.timePickerDate.push(start_month);
			this.timePickerDate.push(end_month);
			// 
			this.getParamList();
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
				// console.log('rowClick:'+JSON.stringify(row))
				row.index_code = this.index_code;
				row.start_date = this.timePickerDate[0];
				row.end_date = this.timePickerDate[1];
				util.openwithData('/pages/khfw/teaClassHourDetail',row);
			},
			showTimePick() {
				this.pickerVisable = true;
			},
			// 点击确定按钮，返回当前选择的值
			confirm(date) {
				this.timePickerDate = date;
				// console.log(date) // ['2021-06-01', '2021-07-01']
				this.getPageData();
			},
			teaClick() {
				this.$refs.popup0.open();
			},
			teaSelect(index) {
				// console.log('this.teaArray:' + JSON.stringify(this.teaArray));
				if (this.teaIndex != index) {
					this.teaIndex = index;
					this.teaStr = this.teaArray[this.teaIndex].tec_name;
					this.getPageData();
				}
				this.$refs.popup0.close();
			},
			getParamList() {
				//教师参数列表
				let comData = {
					index_code: this.navItem.access.split("#")[1],
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_KHFW + 'afterClassSubTec/paramList', comData, (data0, data) => {
					this.hideLoading()
					if (data.code == 0) {
						if (data.data.list.length>1) {
							this.teaArray.push({
								tec_name:'全部老师',
								tec_code:'-1'
							})
						}
						this.teaArray = this.teaArray.concat(data.data.list);
						this.teaStr = this.teaArray[this.teaIndex].tec_name;
						this.getPageData();
					} else {
						this.showToast(data.msg);
					}
				})
			},
			getPageData() {
				//1.1.教师课时统计 
				let comData = {
					start_date:this.timePickerDate[0],
					end_date:this.timePickerDate[1],
					tec_codes:this.teaArray[this.teaIndex].tec_code,
					index_code: this.navItem.access.split("#")[1],
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_KHFW + 'afterClassStat/tecStat', comData, (data0, data) => {
					this.hideLoading()
					if (data.code == 0) {
						var tempCol = [];
						var tempDs = [];
						tempCol.push({
							label: '教师',
							name: 'tec_name',
							align:'center',
							fixed:true
						})
						tempCol.push({
							label: '部门',
							name: 'dpt_name',
							align:'center',
							fixed:false
						})
						tempCol.push({
							label: '校内/校外',
							name: 'in_sch_name',
							align:'center',
							fixed:false
						})
						tempCol.push({
							label: '安排课时量(节)',
							name: 'tec_sub_num',
							align:'center',
							fixed:false
						})
						tempCol.push({
							label: '已上课时量(节)',
							name: 'tec_sign_num',
							align:'center',
							fixed:false
						})
						this.columns = tempCol;
						for (var i = 0; i < data.data.list.length; i++) {
							var tempM = data.data.list[i];
							if (tempM.dpt_name&&tempM.dpt_name.length>4) {
								tempM.dpt_name = tempM.dpt_name.slice(0,4)+'...';
							}
							if (tempM.tec_name&&tempM.tec_name.length>4) {
								tempM.tec_name = tempM.tec_name.slice(0,4)+'...';
							}
							if (tempM.in_sch == null) {
								tempM.in_sch_name = '';
							} else if (tempM.in_sch == 1) {
								tempM.in_sch_name = '校内';
							} else if (tempM.in_sch == 0) {
								tempM.in_sch_name = '校外';
							}
							tempM.tec_sub_num = parseInt(tempM.tec_sub_num);
							tempM.tec_sign_num = parseInt(tempM.tec_sign_num);
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
