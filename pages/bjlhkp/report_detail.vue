<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo'>
		</mynavBar>
		<view style="text-align: center;font-family: 900;font-size: 16px;margin: 20px 30px 0;">{{navItem.name}}</view>
		<uni-row style="margin-top: 20px;">
			<uni-col :span="16">
				<view @click="typeClick()" style="padding-left: 15px;font-size: 14px;font-family: 700;color: #000000;">
					{{typeStr}}
					<uni-icons style="margin-left: 10px;" type="bottom" color='#7f7f7f' size="14"></uni-icons>
				</view>
			</uni-col>
			<uni-col :span="8">
				<view v-if="showDownload == 1" @click="downloadExcel()"
					style="text-align: right;margin-right: 15px;font-size: 13px;color: #2c96bd;">
					<uni-icons style="margin-left: 20px;" type="cloud-download" color='#2c96bd' size="15"></uni-icons>
					下载表格
				</view>
			</uni-col>
		</uni-row>
		<view class="select-line"></view>
		<view style="margin: 10px;height: 450px;">
			<zb-table v-if="columns.length>0" :show-header="true" :columns="columns" :stripe="true" :fit="true" :data="dataSource"></zb-table>
		</view>
		<uni-popup ref="popup0" type="bottom" background-color="#fff" style="">
			<view style="margin-top: 10px;text-align: center;font-size: 16px;color: #000000;">请选择报表</view>
			<view style="margin: 20px 10px;">
				<scroll-view scroll-y="true" style="max-height: 400px;">
					<uni-grid :column="1">
						<uni-grid-item v-for="(item, index) in typeArray" :key="index" style="height: 40px;">
							<view class="grid-item-box gridBox" @click='typeSelect(index)'
								:style="index==typeIndex?'background-color: #2c96bd;color: #ffffff;':''">
								{{item.text}}
							</view>
						</uni-grid-item>
					</uni-grid>
				</scroll-view>
			</view>
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
				personInfo: {},
				navItem: {},
				pagedata: [],
				typeStr: '年级量化均分',
				typeIndex: 0,
				typeArray: [{
					text: '年级量化均分',
					value: 98
				}, {
					text: '班级量化得分',
					value: 99
				}, {
					text: '室外卫生、升旗晨跑',
					value: 1
				}, {
					text: '教学区管理',
					value: 2
				}, {
					text: '食堂就餐',
					value: 3
				}, {
					text: '男生宿舍',
					value: 4
				}, {
					text: '女生宿舍',
					value: 5
				}],
				showDownload: 0,
				columns: [],
				dataSource:[] 
			}
		},
		components: {
			mynavBar
		},
		methods: {
			// downloadExcel() {
			// 	let comData = {
			// 		id: this.navItem.id, //报告id
			// 		index_code: this.navItem.index_code,
			// 	}
			// 	var tempUrl = 'report/grdScoreExcel'
			// 	if (this.typeArray[this.typeIndex].value == 99) {
			// 		tempUrl = 'report/clsScoreExcel';
			// 	} else if (this.typeArray[this.typeIndex].value < 10) {
			// 		comData.fir_id = this.typeArray[this.typeIndex].value;
			// 		comData.excel_name = this.navItem.name + '_' + this.typeArray[this.typeIndex].text + '.xlsx';
			// 		tempUrl = 'report/firScoreExcel';
			// 	}
			// 	this.showLoading();
			// 	uni.downloadFile({
			// 		url: "https://test.108800.com/testhrsubapi/api/admin/asset/download?url=/template/student.xlsx&name=%E5%AD%A6%E7%94%9F%E6%95%B0%E6%8D%AE%E6%A8%A1%E7%89%88.xlsx", //仅为示例，并非真实的资源
			// 		success: (res) => {
			// 			this.hideLoading();
			// 			if (res.statusCode === 200) {
			// 				console.log('下载成功:'+JSON.stringify(res));
			// 				var filePath = res.tempFilePath;

			// 				// var tempFilePaths = res.tempFilePaths;
			// 				uni.saveFile({
			// 				      tempFilePath: filePath,
			// 				      success: function (res) {
			// 				        var savedFilePath = res.savedFilePath;
			// 						console.log('savedFilePath:'+JSON.stringify(savedFilePath));
			// 						uni.openDocument({
			// 						  filePath: savedFilePath,
			// 						  showMenu: true,
			// 						  success: function (res) {
			// 						    console.log('打开文档成功');
			// 						  }
			// 						});
			// 				      }
			// 				    });
			// 			}
			// 		}
			// 	});
			// },
			typeClick() {
				this.$refs.popup0.open();
			},
			typeSelect(index) {
				if (this.typeIndex != index) {
					this.typeIndex = index;
					this.typeStr = this.typeArray[this.typeIndex].text;
					if (this.typeIndex == 0) {
						this.getGrdScore();
					} else if (this.typeIndex == 1) {
						this.getClsScore();
					} else {
						this.getFirScore();
					}
				}
				this.$refs.popup0.close();
			},
			getGrdScore() {
				let comData = {
					id: this.navItem.id, //报告id
					index_code: this.navItem.index_code,
				}
				this.showLoading();
				// 4.4.年级量化均分
				this.post(this.globaData.INTERFACE_BJLHKP + 'report/grdScore', comData, (data0, data) => {
					this.hideLoading();
					var tempCol = [];
					var tempDs = [];
					tempCol.push({
						label: '年级',
						name: 'grd_name',
						align:'center',
						fixed:true
					})
					tempCol.push({
						label: '量化均分',
						name: 'grd_avg',
						align:'center',
						fixed:false
					})
					tempCol.push({
						label: '排名',
						name: 'rank',
						align:'center',
						fixed:false
					})
					this.columns = tempCol;
					this.dataSource = data.data.list;
				})
			},
			getClsScore() {
				let comData = {
					id: this.navItem.id, //报告id
					index_code: this.navItem.index_code,
				}
				this.showLoading();
				//4.6.班级量化得分
				this.post(this.globaData.INTERFACE_BJLHKP + 'report/clsScore', comData, (data0, data) => {
					this.hideLoading();
					var tempCol = [];
					var tempDs = [];
					tempCol.push({
						label: '年级',
						name: 'grd_name',
						align:'center',
						fixed:true
					})
					tempCol.push({
						label: '班级',
						name: 'cls_name',
						align:'center',
						fixed:true
					})
					for (var i = 0; i < data.data.fir_list.length; i++) {
						var tempM = data.data.fir_list[i];
						tempCol.push({
							label: tempM.name,
							name: 'fir_score_' + tempM.id,
							align:'center',
							fixed:false
						})
					}
					tempCol.push({
						label: '累计扣分/加分',
						name: 'fir_total_score',
						align:'center',
						width: '150',
						fixed:false
					})
					tempCol.push({
						label: '量化得分',
						name: 'fir_kp_score',
						align:'center',
						fixed:false
					})
					tempCol.push({
						label: '本年级排名',
						name: 'g_rank',
						align:'center',
						fixed:false
					})
					tempCol.push({
						label: '本校排名',
						name: 's_rank',
						align:'center',
						fixed:false
					})
					this.columns = tempCol;
					this.dataSource = data.data.cls_score_list;
				})
			},
			getFirScore() {
				let comData = {
					id: this.navItem.id, //报告id
					fir_id: this.typeArray[this.typeIndex].value, //一级分类id
					index_code: this.navItem.index_code,
				}
				this.showLoading();
				//一级分类量化得分
				this.post(this.globaData.INTERFACE_BJLHKP + 'report/firScore', comData, (data0, data) => {
					this.hideLoading();
					// this.pagedata = data.data;
					var tempCol = [];
					var tempDs = [];
					if (this.typeArray[this.typeIndex].value > 3) {
						tempCol.push({
							label: '宿舍',
							// name: 'dromFloorRoom',
							name: 'dorm_room',
							align:'center',
							fixed:true
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
					} else {
						tempCol.push({
							label: '年级',
							name: 'grd_name',
							align:'center',
							fixed:true
						})
						tempCol.push({
							label: '班级',
							name: 'cls_name',
							align:'center',
							fixed:true
						})
					}
					for (var i = 0; i < data.data.sec_list.length; i++) {
						var tempM = data.data.sec_list[i];
						tempCol.push({
							label: tempM.name,
							name: 'score_' + tempM.id,
							align:'center',
							fixed:false
						})
					}
					tempCol.push({
						label: '累计扣分/加分',
						name: 'total_score',
						align:'center',
						width: '150',
						fixed:false
					})
					this.columns = tempCol;
					// for (var i = 0; i < data.data.data_list.length; i++) {
					// 	var tempM = data.data.data_list[i];
					// 	tempM.dromFloorRoom = tempM.dorm_door+tempM.dorm_floor+'层';
					// }
					this.dataSource = data.data.data_list;
				})
			},
		},
		onLoad(options) {
			_this = this;
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(options);
			itemData.index = 100;
			itemData.text = '详情';
			this.navItem = itemData;
			console.log('this.navItem:' + JSON.stringify(this.navItem));
			this.getGrdScore();
			// this.getFirScore();
			const res = uni.getSystemInfoSync();
			console.log('res:' + JSON.stringify(res));
			// if (res.osName == 'android') {
			// 	this.showDownload = 1;
			// }
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
	.select-line {
		height: 1px;
		background-color: #00CFBD;
		margin: 5px 10px;
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
</style>
