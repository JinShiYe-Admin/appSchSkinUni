<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo'></mynavBar>
		<view class="riqiView flexStart">
			<view @click="changeDate(0)" class="leftBtn"><uni-icons class="leftIcon" type="left" size="20"></uni-icons></view>
			<view class="showRiqi">{{selectDate}}</view>
			<view @click="changeDate(1)" class="leftBtn"><uni-icons class="leftIcon" type="right" size="20" :color="noRightColor"></uni-icons></view>
		</view>
		<view v-if="grdArray.length>0">
			<view style="margin-left: 15px;font-size: 14px;color: 7f7f7f;margin-top: 10px;">年级：</view>
			<view style="margin: 5px 0 5px 10px;">
				<uni-grid :column="3">
					<uni-grid-item v-for="(item, index) in grdArray" :key="index" style="height: 50px;">
						<view class="grid-item-box gridBox" style="padding-top: 10px;" @click='grdSelect(item, index)'
							:style="index==grdIndex?'background-color: #2c96bd;color: #ffffff;':''">
							{{item.grd_name}}
						</view>
					</uni-grid-item>
				</uni-grid>
			</view>
			<view v-if="clsArray.length>0">
				<view style="margin-left: 15px;font-size: 14px;color: 7f7f7f;margin-top: 10px;">班级：</view>
				<view style="margin: 5px 10px;">
					<uni-grid :column="3">
						<uni-grid-item v-for="(item, index) in clsArray" :key="index" style="height: 70px;">
							<view class="grid-item-box gridBoxRoom" @click='clsSelect(item, index)'
								:style="index==clsIndex?'background-color: #2c96bd;color: #ffffff;':''">
								{{item.cls_name}}
								<view class="roomCount">{{parseInt(item.score)}}</view>
							</view>
						</uni-grid-item>
					</uni-grid>
				</view>
			</view>
			<view v-else class="noGrdCls">暂无数据，请联系管理员添加！</view>
		</view>
		<view v-else class="noGrdCls">{{duty_type==1?'当前日期无排班信息，不可登记':'暂无数据，请联系管理员添加！'}}</view>
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
				selectDate:'',
				duty_type:0,//1排班获取，2数据范围获取
				is_duty:false,//是否有排班
				grdArray:[],
				grdIndex:0,
				clsArray:[],
				clsIndex:-1,
				noRightColor:''
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
			this.selectDate = tempA;
			this.noRightColor = '#999'
			console.log('tempA:'+tempA)
			//#ifdef H5
			document.title = ""
			//#endif
		},
		onShow() {
			this.getGrd()
		},
		methods: {
			changeDate(flag){
				if (flag == 0) {
					this.selectDate = moment(this.selectDate).add(-1,'days').format('YYYY-MM-DD')
					this.noRightColor = ''
					this.getGrd()
				} else{
					if (this.selectDate == this.nowDate) {
						
					} else{
						this.selectDate = moment(this.selectDate).add(1,'days').format('YYYY-MM-DD')
						if (this.selectDate == this.nowDate) {
							this.noRightColor = '#999'
						} else{
							this.noRightColor = ''
						}
						this.getGrd()
					}
				}
			},
			getGrd() { //5.3.巡查班级-获取可选年级
				let comData = {
					user_code: this.personInfo.user_code,
					date: this.selectDate,
					index_code: this.index_code,
				}
				this.showLoading()
				this.post(this.globaData.INTERFACE_BJLHKP + 'kpScore/getGrd', comData, (data0, data) => {
					this.hideLoading()
					if (data.code == 0) {
						this.duty_type = data.data.duty_type
						this.is_duty = data.data.is_duty
						this.grdArray = data.data.list
						this.grdIndex = 0
						if (this.grdArray.length>0) {
							this.getCls()
						}
					} else {
						this.showToast(data.msg);
					}
				})
			},
			getCls() { //巡查班级-获取可选班级
				let comData = {
					user_code: this.personInfo.user_code,
					date: this.selectDate,
					grd_code:this.grdArray[this.grdIndex].grd_code,
					index_code: this.index_code,
				}
				this.showLoading()
				this.post(this.globaData.INTERFACE_BJLHKP + 'kpScore/getCls', comData, (data0, data) => {
					this.hideLoading()
					if (data.code == 0) {
						this.clsArray = data.data.list
						this.clsIndex = -1
					} else {
						this.showToast(data.msg);
					}
				})
			},
			grdSelect(item, index){
				this.grdIndex = index
				this.clsIndex = -1
				this.getCls()
			},
			clsSelect(item, index){
				this.clsIndex = index
				let tempData = {
					index_code:this.index_code,
					from:1,//巡查班级1，巡查宿舍0
					fromName:'巡查班级',
					date:this.selectDate,
					grdName:this.grdArray[this.grdIndex].grd_name,
					grdCode:this.grdArray[this.grdIndex].grd_code,
					clsName:this.clsArray[this.clsIndex].cls_name,
					clsCode:this.clsArray[this.clsIndex].cls_code,
					score:this.clsArray[this.clsIndex].score
				}
				util.openwithData('/pages/bjpbT/xcssIndex1', tempData);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.riqiView{
		width: 100%;
		margin: 10px;
		
		.leftBtn{
			padding-top: 5px;
			width: 35px;
			height: 30px;
			background: #f2f9f9;
			
			.leftIcon{
				margin-left: 8px;
			}
		}
		
		.showRiqi{
			font-size: 16px;
			text-align: center;
			background: #f2f9f9;
			width: calc(100% - 100px);
			padding-top: 5px;
			margin: 0 5px;
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
	.gridBoxRoom{
		height: 70px;
		background-color: #f2f2f2;
		text-align: center;
		padding: 10px 5px 0px;
		margin: 5px;
		border-radius: 3px;
		color: #000000;
		font-size: 14px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-weight: bold;
	}
	
	.roomCount{
		color: #f59a23;
	}

	.gridBoxSelect {
		background-color: #2c96bd;
		color: #ffffff;
	}
	
	.noGrdCls{
		margin-top: 20px;text-align: center;
	}
</style>
