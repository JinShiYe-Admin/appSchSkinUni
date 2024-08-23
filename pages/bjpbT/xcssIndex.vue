<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo'></mynavBar>
		<view class="riqiView flexStart">
			<view @click="changeDate(0)" class="leftBtn"><uni-icons class="leftIcon" type="left" size="20"></uni-icons></view>
			<view class="showRiqi">{{selectDate}}</view>
			<view @click="changeDate(1)" class="leftBtn"><uni-icons class="leftIcon" type="right" size="20" :color="noRightColor"></uni-icons></view>
		</view>
		<view style="margin-left: 15px;font-size: 14px;color: 7f7f7f;margin-top: 10px;">宿舍楼：</view>
		<view style="margin: 5px 0 5px 10px;">
			<uni-grid :column="3">
				<uni-grid-item v-for="(item, index) in dormArray" :key="index" style="height: 50px;">
					<view class="grid-item-box gridBox" style="padding-top: 10px;" @click='dormSelect(item, index)'
						:style="index==dormIndex?'background-color: #2c96bd;color: #ffffff;':''">
						{{item.text}}
					</view>
				</uni-grid-item>
			</uni-grid>
		</view>
		<view style="margin-left: 15px;font-size: 14px;color: 7f7f7f;">楼层：</view>
		<view style="margin: 5px 10px;">
			<uni-grid :column="4">
				<uni-grid-item v-for="(item, index) in floorArray" :key="index" style="height: 40px;">
					<view class="grid-item-box gridBox" @click='floorSelect(item, index)'
						:style="index==floorIndex?'background-color: #2c96bd;color: #ffffff;':''">
						{{item.text}}
					</view>
				</uni-grid-item>
			</uni-grid>
		</view>
		<view style="margin-left: 15px;font-size: 14px;color: 7f7f7f;margin-top: 10px;">房间：</view>
		<view style="margin: 5px 10px;">
			<uni-grid :column="4">
				<uni-grid-item v-for="(item, index) in roomArray" :key="index" style="height: 70px;">
					<!-- <view class="grid-item-box gridBoxRoom" @click='roomSelect(item, index)'
						:style="index==roomIndex?'background-color: #2c96bd;color: #ffffff;':''"> -->
					<view class="grid-item-box gridBoxRoom" @click='roomSelect(item, index)'>
						{{item.text}}
						<view class="roomCount">{{item.score}}</view>
					</view>
				</uni-grid-item>
			</uni-grid>
		</view>
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
				dormArray:[],
				dormIndex:0,
				floorArray:[],
				floorIndex:0,
				roomArray:[],
				roomIndex:-1,
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
			this.getQueryDorm()
			//#ifdef H5
			document.title = ""
			//#endif
		},
		methods: {
			changeDate(flag){
				if (flag == 0) {
					this.selectDate = moment(this.selectDate).add(-1,'days').format('YYYY-MM-DD')
					this.noRightColor = ''
				} else{
					if (this.selectDate == this.nowDate) {
						
					} else{
						this.selectDate = moment(this.selectDate).add(1,'days').format('YYYY-MM-DD')
						if (this.selectDate == this.nowDate) {
							this.noRightColor = '#999'
						} else{
							this.noRightColor = ''
						}
					}
				}
			},
			getQueryDorm() {
				//7.基本信息-获取楼房信息
				let comData = {
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_DORM1 + 'dorm/queryDorm', comData, (data0, data) => {
					this.hideLoading()
					if (data.code == 0) {
						this.roomArray = [];
						this.roomIndex = -1
						if (data.data.list && data.data.list.length > 0) {
							this.dormArray = data.data.list;
							this.floorArray = this.dormArray[this.dormIndex].floor_array;
							this.getQueryRoom();
						} else {
							this.dormArray = [];
							this.floorArray = [];
							this.showToast('没有楼房信息');
						}
					} else {
						this.showToast(data.msg);
					}
				})
			},
			getQueryRoom() {
				//8.基本信息-获取房间信息
				let comData = {
					dorm_name: this.dormArray[this.dormIndex].value,
					floor_num: this.floorArray[this.floorIndex].value,
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_DORM1 + 'dorm/queryRoom', comData, (data0, data) => {
					this.hideLoading()
					if (data.code == 0) {
						for (var i = 0; i < data.data.list.length; i++) {
							let tempM = data.data.list[i]
							tempM.score = 0
						}
						if (data.data.list && data.data.list.length > 0) {
							this.roomArray = data.data.list;
							this.getRoomScore()
						} else {
							this.roomArray = [];
							this.showToast('没有房间信息');
						}
					} else {
						this.showToast(data.msg);
					}
				})
			},
			dormSelect(item, index){
				this.dormIndex = index
				this.roomIndex = -1
				this.floorArray = this.dormArray[this.dormIndex].floor_array;
				this.floorIndex = 0
				this.getQueryRoom();
			},
			floorSelect(item, index){
				this.floorIndex = index
				this.roomIndex = -1
				this.getQueryRoom();
			},
			getRoomScore(){
				let tempCodes = []
				for (var i = 0; i < this.roomArray.length; i++) {
					let tempM = this.roomArray[i]
					tempCodes.push(this.roomArray[i].value)
				}
				//5.6.巡查宿舍-获取宿舍扣/加分
				let comData = {
					dorm_room_codes: tempCodes.join(','),
					date: this.selectDate,
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_BJLHKP + 'kpScore/getRoomScore', comData, (data0, data) => {
					this.hideLoading()
					if (data.code == 0) {
						if (data.data.list && data.data.list.length > 0) {
							for (var i = 0; i < data.data.list.length; i++) {
								let tempM = data.data.list[i]
								for (var a = 0; i < this.roomArray.length; a++) {
									let tempN = this.roomArray[a]
									if (tempM.dorm_room_code == tempN.value) {
										tempN.score = tempM.score
									}
								}
							}
						}
					} else {
						this.showToast(data.msg);
					}
				})
			},
			roomSelect(item, index){
				this.roomIndex = index
				let tempData = {
					index_code:this.index_code,
					from:0,//巡查班级1，巡查宿舍0
					fromName:'巡查宿舍',
					date:this.selectDate,
					dormeName:this.dormArray[this.dormIndex].text,
					dormId:this.dormArray[this.dormIndex].value,
					floorName:this.floorArray[this.floorIndex].text,
					floorId:this.floorArray[this.floorIndex].value,
					roomName:this.roomArray[this.roomIndex].text,
					roomId:this.roomArray[this.roomIndex].value
				}
				util.openwithData('/pages/bjpbT/xcssIndex1', tempData);
			}
		}
	}
</script>

<style>
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
</style>
