<template>
	<view style="background: #f2f2f2;">
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo'></mynavBar>
		<view class="payTitle">{{navItem.title}}</view>
		<view style="margin-top: 20px;">
			<view class="card-line0" :class="[semFlag==0?'semFlagSelect':'']" @click="clickSem(0)">项目统计</view>
			<view class="card-line0 card-line1" :class="[semFlag==1?'semFlagSelect':'']" @click="clickSem(1)">班级统计
			</view>
			<view class="card-line0 card-line2" :class="[semFlag==2?'semFlagSelect':'']" @click="clickSem(2)">学生缴费情况
			</view>
		</view>
		<view v-if="semFlag==0" style="margin: 20px;">
			<zb-table v-if="columns0.length>0" :show-header="true" :columns="columns0" :stripe="true" :fit="true"
				:data="dataSource0"></zb-table>
		</view>
		<view v-if="semFlag==1" style="margin: 20px;">
			<zb-table v-if="columns1.length>0" :show-header="true" :columns="columns1" :stripe="true" :fit="true"
				:data="dataSource1"></zb-table>
		</view>
		<view v-if="semFlag==2" style="margin: 20px;">
			<uni-row>
				<uni-col :span="8" v-if="grdArray.length>0&&clsArray.length>0&&stusArray.length>0">
					<picker class="flex-box" @change="grdClick" :value="grdIndex" :range="grdArray" range-key="text">
						<view style="font-size: 13px;color: #7f7f7f;text-align: center;padding: 10px 0;">
							{{grdArray[grdIndex].text}}
							<uni-icons style="float: right;margin-right: 10px;margin-top: 2px;" type="bottom"
								color='#7f7f7f' size="14"></uni-icons>
						</view>
					</picker>
				</uni-col>
				<uni-col :span="8" v-if="grdArray.length>0&&clsArray.length>0&&stusArray.length>0">
					<picker class="flex-box" @change="clsClick" :value="clsIndex" :range="clsArray" range-key="text">
						<view style="font-size: 13px;color: #7f7f7f;text-align: center;padding: 10px 0;">
							{{clsArray[clsIndex].text}}
							<uni-icons style="float: right;margin-right: 10px;margin-top: 2px;" type="bottom"
								color='#7f7f7f' size="14"></uni-icons>
						</view>
					</picker>
				</uni-col>
				<uni-col :span="8" v-if="grdArray.length>0&&clsArray.length>0&&stusArray.length>0">
					<picker class="flex-box" @change="stusClick" :value="stusIndex" :range="stusArray" range-key="text">
						<view style="font-size: 13px;color: #7f7f7f;text-align: center;padding: 10px 0;">
							{{stusArray[stusIndex].text}}
							<uni-icons style="float: right;margin-right: 10px;margin-top: 2px;" type="bottom"
								color='#7f7f7f' size="14"></uni-icons>
						</view>
					</picker>
				</uni-col>
			</uni-row>
			<view v-if="grdArray.length==0&&clsArray.length==0&&stusArray.length==0" style="text-align: center;margin-top: 50px;">您无权限查看本页内容，请联系管理员</view>
			<view style="height: 450px;">
				<zb-table v-if="columns2.length>0" style="margin-top: 10px;" @rowClick="rowClick" :show-header="true"
					:columns="columns2" :stripe="true" :fit="true" :data="dataSource2"></zb-table>
			</view>
		</view>
		<view style="height: 50px;background: #f2f2f2;"></view>
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
				semFlag: 0,
				pagedata0: [],
				pagedata1: [],
				pagedata2: [],
				columns0: [],
				dataSource0: [],
				columns1: [],
				dataSource1: [],
				columns2: [],
				dataSource2: [],
				//顶部筛选框相关内容
				grdIndex: 0,
				clsIndex: 0,
				stusIndex: 0,
				grdArray: [],
				clsArray: [],
				stusArray: [],
				allStus:[],//获取task下所有的学生，然后和权限符获取到的年级班级等做筛选
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
			this.navItem.index = 100;
			this.navItem.text = '缴费情况';
			console.log('this.navItem:' + JSON.stringify(this.navItem));
			uni.setNavigationBarTitle({
				title: this.navItem.text
			});
			this.getList0();
			// 
			this.getFindAllStu();
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
			rowClick(row, index) {
				console.log('rowClick:' + JSON.stringify(row))
				row.index_code = this.navItem.index_code;
				row.task_id = this.navItem.task_id;
				util.openwithData('/pages/payStu/payDetail', row);
			},
			grdClick: function(e) {
				if (this.grdIndex !== e.detail.value) {
					this.grdIndex = e.detail.value
					this.clsIndex = 0
					this.stusIndex = 0
					this.showLoading()
					this.getCls();
				}
			},
			clsClick: function(e) {
				if (this.clsIndex !== e.detail.value) {
					this.clsIndex = e.detail.value
					this.stusIndex = 0
					this.showLoading()
					this.getStus();
				}
			},
			stusClick: function(e) {
				if (this.stusIndex !== e.detail.value) {
					this.stusIndex = e.detail.value
					this.showLoading()
					this.getList2();
				}
			},
			getGrd() { //获取年级
				let comData = {
					op_code: 'index',
					get_grd: true,
					all_grd: true,
					index_code: this.navItem.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB + 'acl/dataRange', comData, response => {
					console.log("responseaaa: " + JSON.stringify(response));
					this.hideLoading()
					let grds = response.grd_list;
					let grdArray = [];
					grds.map(function(currentValue) {
						let name = currentValue.name.indexOf('全部') == -1 ? currentValue.name : '全部年级';
						let obj = {};
						let tempFlag = 0;
						for (var i = 0; i < _this.allStus.length; i++) {
							let tempM = _this.allStus[i];
							if (currentValue.value == tempM.grd_code) {
								tempFlag++;
							}
						}
						obj.value = currentValue.value;
						obj.text = name;
						if (currentValue.value == '-1' || tempFlag>0) {
							grdArray.push(obj)
						}
					})
					if (grdArray.length > 0) {
						this.grdArray = grdArray;
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
					index_code: this.navItem.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB + 'acl/dataRange', comData, response => {
					console.log("responseaaa: " + JSON.stringify(response));
					this.hideLoading()
					let clss = response.cls_list;
					let clsArray = [];
					clss.map(function(currentValue) {
						let obj = {};
						let name = currentValue.name.indexOf('全部') == -1 ? currentValue.name : '全部班级';
						let tempFlag = 0;
						for (var i = 0; i < _this.allStus.length; i++) {
							let tempM = _this.allStus[i];
							if (currentValue.value == tempM.cls_code) {
								tempFlag++;
							}
						}
						obj.value = currentValue.value;
						obj.text = name;
						if (currentValue.value == '-1' || tempFlag>0) {
							clsArray.push(obj)
						}
					})
					if (clsArray.length > 0) {
						this.clsArray = clsArray;
						this.getStus();
					} else {
						this.clsArray = [];
						this.showToast('无数据授权 无法获取班级');
					}
				})
			},
			getStus() { //获取学生
				let comData = {
					op_code: 'index',
					grd_code: this.grdArray[this.grdIndex].value,
					cls_code: this.clsArray[this.clsIndex].value,
					get_stu: true,
					all_stu: true,
					index_code: this.navItem.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB + 'acl/dataRange', comData, response => {
					console.log("responseaaa: " + JSON.stringify(response));
					this.hideLoading()
					let stu = response.stu_list;
					let stusArray = [];
					let tempFlag = 0;
					stu.map(function(currentValue) {
						let obj = {};
						let name = currentValue.name !== '全部' ? currentValue.name : '全部学生';
						for (var i = 0; i < _this.allStus.length; i++) {
							let tempM = _this.allStus[i];
							if (currentValue.value == tempM.stu_code) {
								tempFlag++;
							}
						}
						obj.value = currentValue.value;
						obj.text = name;
						if (currentValue.value == '-1' || tempFlag>0) {
							stusArray.push(obj)
						}
					})
					
					if (stusArray.length > 0) {
						this.stusArray = stusArray;
						this.getList2()
					} else {
						this.stusArray = [];
						this.showToast('无数据授权 无法获取学生');
					}
				})
			},
			gotoDetail(model) {
				util.openwithData('/pages/khfw/teaLeaveCheckDetail', {
					id: model.id,
					checkFlag: _this.semFlag,
					index_code: _this.navItem.index_code,
				})
			},
			clickSem(flag) {
				if (flag != this.semFlag) {
					this.semFlag = flag;
					if (flag == 0 && this.pagedata0.length == 0) {
						this.getList0();
					} else if (flag == 1 && this.pagedata1.length == 0) {
						this.getList1();
					} else if (flag == 2 && this.pagedata2.length == 0) {
						this.getList2();
					}
				}
			},
			getList0() {
				let comData = {
					task_id: this.navItem.task_id,
					index_code: this.navItem.index_code,
				}
				// 1.2.任务项目统计
				this.post(this.globaData.INTERFACE_ONLINEPAY + 'payTask/statProject', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						var tempCol = [];
						var tempDs = [];
						tempCol.push({
							label: '缴费项目',
							name: 'project_name',
							align: 'center',
							width: 20,
							fixed: true
						})
						tempCol.push({
							label: '项目金额(元)',
							name: 'price',
							align: 'center',
							width: 200,
							fixed: false
						})
						tempCol.push({
							label: '缴费对象',
							name: 'jfdx',
							align: 'center',
							fixed: false
						})
						tempCol.push({
							label: '缴费人数(人)',
							name: 'stu_num',
							align: 'center',
							fixed: false
						})
						tempCol.push({
							label: '缴费金额(元)',
							name: 'total_price',
							align: 'center',
							fixed: false
						})
						tempCol.push({
							label: '减免人数(人)',
							name: 'deduct_num',
							align: 'center',
							fixed: false
						})
						tempCol.push({
							label: '减免金额(元)',
							name: 'deduct_money',
							align: 'center',
							fixed: false
						})
						tempCol.push({
							label: '应缴费人数(人)',
							name: 'pay_stu_num',
							align: 'center',
							fixed: false
						})
						tempCol.push({
							label: '应缴费金额(元)',
							name: 'pay_price',
							align: 'center',
							fixed: false
						})
						tempCol.push({
							label: '已缴费人数(人)',
							name: 'paid_stu_num',
							align: 'center',
							fixed: false
						})
						tempCol.push({
							label: '已缴费金额(元)',
							name: 'paid_price',
							align: 'center',
							fixed: false
						})
						for (var i = 0; i < data.data.list.length; i++) {
							var tempM = data.data.list[i];
							if (tempM.project_name.length > 10) {
								tempM.project_name = tempM.project_name.substring(0, 10);
								console.log('tempM.project_name:' + tempM.project_name)
							}
							var tempArray = [];
							if (tempM.crowd_list) {
								for (var a = 0; a < tempM.crowd_list.length; a++) {
									var tempA = tempM.crowd_list[a];
									tempArray.push(tempA.grd_name + tempA.cls_name);
								}
							}
							tempM.jfdx = tempArray.join(',')
							if (tempArray.length == 0 && i != 0) {
								tempM.jfdx = '自行导入';
							}
						}
						this.columns0 = tempCol;
						this.dataSource0 = data.data.list;
					} else {
						this.showToast(data.msg);
					}
				});
			},
			getList1() {
				let comData = {
					task_id: this.navItem.task_id,
					index_code: this.navItem.index_code,
				}
				// 1.3.任务班级统计
				this.post(this.globaData.INTERFACE_ONLINEPAY + 'payTask/statClass', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						var tempCol = [];
						var tempDs = [];
						tempCol.push({
							label: '年级',
							name: 'grd_name',
							align: 'center',
							fixed: true
						})
						tempCol.push({
							label: '班级',
							name: 'cls_name',
							align: 'center',
							fixed: true
						})
						tempCol.push({
							label: '缴费人数(人)',
							name: 'cls_num',
							align: 'center',
							fixed: false
						})
						tempCol.push({
							label: '缴费金额(元)',
							name: 'total_price',
							align: 'center',
							fixed: false
						})
						tempCol.push({
							label: '减免人数(人)',
							name: 'deduct_num',
							align: 'center',
							fixed: false
						})
						tempCol.push({
							label: '减免金额(元)',
							name: 'deduct_money',
							align: 'center',
							fixed: false
						})
						tempCol.push({
							label: '应缴费人数(人)',
							name: 'pay_num',
							align: 'center',
							fixed: false
						})
						tempCol.push({
							label: '应缴费金额(元)',
							name: 'pay_price',
							align: 'center',
							fixed: false
						})
						tempCol.push({
							label: '已缴费人数(人)',
							name: 'paid_num',
							align: 'center',
							fixed: false
						})
						tempCol.push({
							label: '已缴费金额(元)',
							name: 'paid_money',
							align: 'center',
							fixed: false
						})
						this.columns1 = tempCol;
						this.dataSource1 = data.data.list;
					} else {
						this.showToast(data.msg);
					}
				});
			},
			getList2() {
				if (this.grdArray.length==0) {
					this.showToast('无年级数据范围授权');
					return
				} else if (this.clsArray.length==0) {
					this.showToast('无班级数据范围授权');
					return
				}else if (this.stusArray.length==0) {
					this.showToast('无学生数据范围授权');
					return
				} 
				let comData = {
					task_id: this.navItem.task_id,
					grd_code: this.grdArray[this.grdIndex].value,
					cls_code: this.clsArray[this.clsIndex].value,
					stu_code: this.stusArray[this.stusIndex].value,
					index_code: this.navItem.index_code,
				}
				// 1.4.任务学生统计
				this.post(this.globaData.INTERFACE_ONLINEPAY + 'payTask/statStu', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						var tempCol = [];
						var tempDs = [];
						tempCol.push({
							label: '班级',
							name: 'cls_name',
							align: 'center',
							width: '200',
							fixed: true
						})
						tempCol.push({
							label: '学生',
							name: 'stu_name',
							align: 'center',
							fixed: true
						})
						tempCol.push({
							label: '应缴(元)',
							name: 'payable_amount',
							align: 'center',
							fixed: false
						})
						tempCol.push({
							label: '缴费情况',
							name: 'statusStr',
							align: 'center',
							fixed: false
						})
						for (var i = 0; i < data.data.list.length; i++) {
							var tempM = data.data.list[i];
							if (tempM.is_free == 1) {
								tempM.statusStr = '免缴';
							} else if (tempM.pay_status == 0) {
								tempM.statusStr = '未缴';
							} else if (tempM.pay_status == 1) {
								tempM.statusStr = '已缴';
							}
						}
						this.columns2 = tempCol;
						this.dataSource2 = data.data.list;
					} else {
						this.showToast(data.msg);
					}
				});
			},
			getFindAllStu() {
				let comData = {
					task_id: this.navItem.task_id,
					index_code: this.navItem.index_code,
				}
				// 获取当前task下的所有学生
				this.post(this.globaData.INTERFACE_ONLINEPAY + 'payDeduct/findAllStu', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.allStus = data.data.list;
						this.getGrd();
					} else {
						this.showToast(data.msg);
					}
				});
			},
		},
	}
</script>

<style>
	.payTitle {
		font-weight: 700;
		color: #333333;
		text-align: center;
		font-size: 16px;
		margin: 20px 20px 0;
	}

	.card-line0 {
		text-align: center;
		font-size: 16px;
		color: #7f7f7f;
		font-weight: 500;
		margin-top: 15px;
		border-bottom: 2px solid #aaaaaa;
		width: 120px;
		margin-left: calc((100% - 360px)/2);
	}

	.card-line1 {
		color: #7f7f7f;
		border-bottom: 2px solid #aaaaaa;
		margin-left: calc((100% - 360px)/2 + 120px);
		margin-top: -24px;
	}

	.card-line2 {
		color: #7f7f7f;
		border-bottom: 2px solid #aaaaaa;
		margin-left: calc((100% - 360px)/2 + 240px);
		margin-top: -24px;
	}

	.semFlagSelect {
		color: #008080;
		border-bottom: 2px solid #008080;
	}
</style>