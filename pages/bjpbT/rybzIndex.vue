<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo' text="设置" :textClick="textClick"></mynavBar>
		<view v-if="timeList.length>0" class="backImg" :style="{width:screenW+'px',height:screenH+'px'}">
			<view class="riqiView flexStart">
				<view @click="changeDate(0)" class="leftBtn"><uni-icons class="leftIcon" type="left" size="20" :color="noLeftColor"></uni-icons></view>
				<view class="showRiqi" @click="showPopup()">{{timeList[timeIndex].begin_date.split(' ')[0]}} 至 {{timeList[timeIndex].end_date.split(' ')[0]}}</view>
				<view @click="changeDate(1)" class="leftBtn" style="margin-right: 15px;"><uni-icons class="leftIcon" type="right" size="20" :color="noRightColor"></uni-icons></view>
			</view>
			<view class="rongyuImg">
				<view class="clsView">优秀班级</view>
				<view class="clsList">
					<scroll-view scroll-y="true" style="max-height: 260px;">
					<uni-grid :column="2">
						<uni-grid-item v-for="(item, index) in clsList" :key="index" style="height: 30px;">
							<view class="grid-item-box gridBoxRoom" style="padding-left: 10px;">
								{{item.grd_name}}{{item.cls_name}}
							</view>
						</uni-grid-item>
					</uni-grid>
					</scroll-view>
				</view>
				<view class="showSch">{{personInfo.unit_name}}</view>
			</view>
		</view>
		<view v-else style="text-align: center;margin: 20px;font-size: 14px;color: gray;">暂无数据</view>
		<uni-popup ref="popup" type="bottom" background-color="#fff" style="z-index: 300;">
			<view style="margin-top: 10px;text-align: center;font-size: 16px;color: #000000;">请选择时段</view>
			<view style="margin: 15px 10px;">
				<uni-grid :column="1">
					<uni-grid-item v-for="(item, index) in timeList" :key="index" style="height: 50px;">
						<view class="grid-item-box gridBox" @click='typeSelect(index)'
							:style="index==timeIndex?'background-color: #2c96bd;color: #ffffff;':''">
							{{timeList[index].begin_date.split(' ')[0]}} 至 {{timeList[index].end_date.split(' ')[0]}}
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
	let _this;
	export default {
		data() {
			return {
				index_code: '',
				personInfo: {},
				navItem: {},
				timeList:[],
				timeIndex:0,
				clsList:[],
				screenH:0,
				screenW:0,
				noLeftColor:'',
				noRightColor:'#999'
			}
		},
		components: {
			mynavBar
		},
		onLoad(options) {
			_this = this;
			this.personInfo = util.getPersonal();
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			this.navItem = util.getPageData(options);
			this.navItem.index = 100;
			this.index_code = this.navItem.access.split("#")[1];
			// console.log('this.navItem:' + JSON.stringify(this.navItem));
			uni.getSystemInfo({
				success(res) {
					// console.log('getSystemInfo:'+JSON.stringify(res));
					_this.screenW = res.screenWidth
					_this.screenH = res.screenHeight - 44 - res.statusBarHeight
				}
			})
			this.getTimeList()
			//#ifdef H5
			document.title = ""
			//#endif
		},
		methods: {
			showPopup(){
				this.$refs.popup.open();
			},
			typeSelect(index){
				this.$refs.popup.close();
				if (this.timeIndex != index) {
					this.timeIndex = index
					if (this.timeIndex == 0) {
						this.noLeftColor = '#999'
						this.noRightColor = ''
					} else if (this.timeIndex == this.timeList.length - 1) {
						this.noRightColor = '#999'
						this.noLeftColor = ''
					} else{
						this.noLeftColor = ''
						this.noRightColor = ''
					}
					this.getClsList()
				}
			},
			changeDate(flag){
				if (flag == 0) {
					if (this.timeIndex == 0) {
						
					} else{
						this.timeIndex --
						if (this.timeIndex == 0) {
							this.noLeftColor = '#999'
							this.noRightColor = ''
						} else{
							this.noLeftColor = ''
							this.noRightColor = ''
						}
						this.getClsList()
					}
				} else{
					if (this.timeIndex == this.timeList.length - 1) {
						
					} else{
						this.timeIndex ++
						if (this.timeIndex == this.timeList.length - 1) {
							this.noRightColor = '#999'
							this.noLeftColor = ''
						} else{
							this.noLeftColor = ''
							this.noRightColor = ''
						}
						this.getClsList()
					}
				}
			},
			textClick(){
				let tempM ={
					index_code:this.index_code
				}
				util.openwithData('/pages/bjpbT/rybzSetting', tempM,{
					refreshRybzIndex() { //子页面调用父页面需要的方法
						_this.getTimeList();
					}
				});
			},
			getTimeList(){
				// 8.1.获取表彰周期时间范围列表
				let comData = {
					index_code: this.index_code,
				}
				this.showLoading()
				this.post(this.globaData.INTERFACE_BJLHKP + 'honorCls/getTimeRangeList', comData, (data0, data) => {
					this.hideLoading()
					if (data.code == 0) {
						this.timeList = data0.list
						this.timeIndex = data0.list.length -1
						if (this.timeList.length==1) {
							this.noLeftColor = '#999'
						}
						this.getClsList()
					} else {
						this.showToast(data.msg);
					}
				})
			},
			getClsList(){
				// 8.2.荣誉班级列表
				let comData = {
					begin_date:this.timeList[this.timeIndex].begin_date,
					end_date:this.timeList[this.timeIndex].end_date,
					index_code: this.index_code,
				}
				this.showLoading()
				this.post(this.globaData.INTERFACE_BJLHKP + 'honorCls/list', comData, (data0, data) => {
					this.hideLoading()
					if (data.code == 0) {
						this.clsList = data0.list
					} else {
						this.showToast(data.msg);
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.backImg{
		background-image: url(~@/static/images/bjlhkp/lhkpBG.jpg);
		background-size: cover;
		background-repeat: no-repeat;
		
		.rongyuImg{
			background-image: url(~@/static/images/bjlhkp/lhkpRY.png);
			background-size: 100% 100%;
			background-repeat: no-repeat;
			width: calc(100% - 40px);
			height: 600px;
			margin-left: 20px;
			
			.clsView{
				font-size: 24px;
				color:  #f9e85b;
				text-align: center;
				font-weight: 700;
				padding-top: 110px;
			}
			
			.clsList{
				margin-top: 20px;
				width: calc(100% - 120px);
				text-align: center;
				margin-left: 60px;
				font-size: 14px;
				color: #f9e85b;
				font-weight: 700;
			}
			.showSch{
				// position: fixed;
				// top: 530px;
				margin-top: 20px;
				font-size: 14px;
				color: #f9e85b;
				font-weight: 700;
				width: calc(100% + 20px);
				text-align: center;
			}
		}
	}
	.riqiView{
		width: 100%;
		// padding: 10px;
		padding-top: 10px;
		
		.leftBtn{
			padding-top: 5px;
			width: 35px;
			height: 30px;
			
			.leftIcon{
				margin-left: 15px;
			}
		}
		
		.showRiqi{
			font-size: 16px;
			text-align: center;
			width: calc(100% - 85px);
			padding-top: 5px;
			margin-left: 15px;
			// margin: 0 5px;
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
