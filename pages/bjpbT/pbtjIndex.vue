<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo'></mynavBar>
		<view class="flexCenter typeCss" @click="showTypeSelect()">
			<view class="typeShow">{{typeList[typeIndex].name}}</view>
			<view><uni-icons class="downIcon" type="down" size="15"></uni-icons></view>
		</view>
		<view class="flexCenter typeTime">
			<view class="timeShow1">统计时间段：</view>
			<view class="timeShow2">
				<uni-datetime-picker :clearIcon="false" :border="false" @change="change" v-model="range" type="daterange" :end=nowDate rangeSeparator="至" />
			</view>
			<view><uni-icons class="downIcon" type="down" size="15"></uni-icons></view>
		</view>
		<view style="margin: 10px;height: 450px;">
			<zb-table v-if="columns.length>0" :show-header="true" :columns="columns" :stripe="true" :fit="true" :data="dataSource"></zb-table>
		</view>
		<uni-popup ref="popup" type="bottom" background-color="#fff" style="z-index: 300;">
			<view style="margin-top: 10px;text-align: center;font-size: 16px;color: #000000;">请选择报表</view>
			<view style="margin: 15px 10px;">
				<uni-grid :column="1">
					<uni-grid-item v-for="(item, index) in typeList" :key="index" style="height: 50px;">
						<view class="grid-item-box gridBox" @click='typeSelect(item, index)'
							:style="index==typeIndex?'background-color: #2c96bd;color: #ffffff;':''">
							{{item.name}}
						</view>
					</uni-grid-item>
				</uni-grid>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	import moment from 'moment/moment.js';
	export default {
		data() {
			return {
				index_code: '',
				personInfo: {},
				navItem: {},
				nowDate:'',
				typeList:[{name:'年级量化均分'},{name:'班级量化均分'}],
				typeIndex:0,
				range: [],
				columns: [],
				dataSource:[] 
			}
		},
		components: {
			mynavBar
		},
		onLoad(options) {
			this.personInfo = util.getPersonal();
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			this.navItem = util.getPageData(options);
			this.navItem.index = 100;
			// this.navItem.text = '在线缴费';
			this.index_code = this.navItem.access.split("#")[1];
			console.log('this.navItem:' + JSON.stringify(this.navItem));
			
			let tempA = moment().format('YYYY-MM-DD')
			this.nowDate = tempA
			let tempTime = moment().subtract(1, 'months').format('YYYY-MM-DD')
			this.range.push(tempTime)
			this.range.push(tempA)
			this.getFirstArray()
			this.getGrdList()
			//#ifdef H5
			document.title = ""
			//#endif
		},
		methods: {
			change(e) {
				if (this.typeIndex == 0) {
					this.getGrdList()
				} else if (this.typeIndex == 1) {
					this.getClsList()
				} else{
					this.getFirstList()
				}
			},
			getFirstArray(){
				// 3.5.列表
				let comData = {
					level:1,
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_BJLHKP + 'statistics/firstItemList', comData, (data0, data) => {
					this.hideLoading()
					if (data.code == 0) {
						this.typeList = this.typeList.concat(data0.list)
					} else {
						this.showToast(data.msg);
					}
				})
			},
			showTypeSelect(){
				this.$refs.popup.open();
			},
			typeSelect(model,index){
				this.$refs.popup.close();
				if (this.typeIndex != index) {
					this.typeIndex = index
					if (index == 0) {
						this.getGrdList()
					} else if (index == 1) {
						this.getClsList()
					} else{
						this.getFirstList()
					}
				}
			},
			getGrdList(){
				// 6.1.年级评比均分
				let comData = {
					begin_time:this.range[0],
					end_time:this.range[1],
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_BJLHKP + 'statistics/grdAvgScore', comData, (data0, data) => {
					this.hideLoading()
					if (data.code == 0) {
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
							name: 'score',
							align:'center',
							fixed:false
						})
						tempCol.push({
							label: '排名',
							name: 'order',
							align:'center',
							fixed:false
						})
						this.columns = tempCol;
						this.dataSource = data.data.list;
					} else {
						this.showToast(data.msg);
					}
				})
			},
			getClsList(){
				// 6.2.班级评比得分
				let comData = {
					begin_time:this.range[0],
					end_time:this.range[1],
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_BJLHKP + 'statistics/clsScore', comData, (data0, data) => {
					this.hideLoading()
					if (data.code == 0) {
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
						for (var i = 0; i < data.data.item_list.length; i++) {
							var tempM = data.data.item_list[i];
							tempCol.push({
								label: tempM.name,
								name: 'score_' + tempM.id,
								align:'center',
								fixed:false
							})
						}
						tempCol.push({
							label: '累计扣分/加分',
							name: 'kp_score',
							align:'center',
							width: '150',
							fixed:false
						})
						tempCol.push({
							label: '评比得分',
							name: 'score',
							align:'center',
							fixed:false
						})
						tempCol.push({
							label: '本年级排名',
							name: 'grd_order',
							align:'center',
							fixed:false
						})
						tempCol.push({
							label: '本校排名',
							name: 'sch_order',
							align:'center',
							fixed:false
						})
						this.columns = tempCol;
						this.dataSource = data.data.list;
					} else {
						this.showToast(data.msg);
					}
				})
			},
			getFirstList(){
				// 6.3.一级分类统计
				let comData = {
					begin_time:this.range[0],
					end_time:this.range[1],
					item_id:this.typeList[this.typeIndex].id,
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_BJLHKP + 'statistics/itemScore', comData, (data0, data) => {
					this.hideLoading()
					if (data.code == 0) {
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
						for (var i = 0; i < data.data.item_list.length; i++) {
							var tempM = data.data.item_list[i];
							tempCol.push({
								label: tempM.name,
								name: 'score_' + tempM.id,
								align:'center',
								fixed:false
							})
						}
						tempCol.push({
							label: '累计扣分/加分',
							name: 'kp_score',
							align:'center',
							width: '150',
							fixed:false
						})
						this.columns = tempCol;
						this.dataSource = data.data.list;
					} else {
						this.showToast(data.msg);
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.typeCss{
		margin: 10px;
		.typeShow{
			font-size: 16px;
			text-align: center;
			color: #333;
			font-weight: 700;
		}
	}
	.typeTime{
		margin: 10px;
		.timeShow1{
			font-size: 14px;
			text-align: center;
			color: #333;
		}
		.timeShow2{
			width: 230px;
			margin-top: -8px;
		}
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
		height: 50px;
		background-color: #f2f2f2;
		text-align: center;
		padding: 10px 5px 0px;
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
