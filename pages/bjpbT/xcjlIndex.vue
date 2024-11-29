<template>
	<view style="background: #f2f2f2;">
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo'></mynavBar>
		<view class="pageHead">
			<view class="riqiView flexStart">
				<view @click="changeDate(0)" class="leftBtn"><uni-icons class="leftIcon" type="left" size="20"></uni-icons></view>
				<view class="showRiqi">{{selectDate}}</view>
				<view @click="changeDate(1)" class="leftBtn"><uni-icons class="leftIcon" type="right" size="20" :color="noRightColor"></uni-icons></view>
			</view>
			<view class="grdClsStu flexBetween">
				<view class="grdClsView flexStart" @click="showGrdCls()">
					<view class="grdCls">{{grdClsStr}}</view>
					<uni-icons class="downIcon" type="down" size="15"></uni-icons>
				</view>
				<view class="stuView flexStart" @click="showStu()">
					<view class="stuCss">{{stuArray.length>0?stuArray[stuIndex].create_user_name:''}}</view>
					<uni-icons class="downIcon" type="down" size="15"></uni-icons>
				</view>
			</view>
		</view>
		<view style="margin-top: 110px;"></view>
		<view class="pbList" v-for="model in pageArray" @click="gotoDetail(model)">
			<view class="clsView flexBetween">
				<view class="clsStr">{{model.cls_name}}</view>
				<view class="clsStr">{{model.dorm_room}}</view>
			</view>
			<!-- <view class="shenSS">审</view> -->
			<view class="cellList">
				<view class="flexStart pbCell" v-for="item in model.item_list">
					<view class="ellipsis-2 pbCont">{{item.item_name}}</view>
					<view class="pbCount">{{parseInt(item.score)}}</view>
				</view>
			</view>
			<view class="stuView flexStart">
				<uni-icons class="stuIcon" type="person" size="15"></uni-icons>
				<view class="stuStr">{{model.stuStr.length==0?'-':model.stuStr}}</view>
			</view>
			<view class="timeView flexEnd">
				<view class="personStr">{{model.create_user_name}}</view>
				<uni-icons class="timeIcon" type="calendar" size="15" color="#555"></uni-icons>
				<view class="timeStr">{{model.create_time}}</view>
			</view>
		</view>
		<view v-if="pageArray.length>0" style="height: 10px;"></view>
		<view class="uni-loadmore" v-if="showLoadMore">{{loadMoreText}}</view>
		<uni-popup ref="popup" type="bottom" background-color="#fff" style="z-index: 300;">
			<view style="margin-top: 10px;text-align: center;font-size: 16px;color: #000000;">请选择年级和班级</view>
			<view style="margin-left: 10px;font-size: 14px;color: 7f7f7f;">年级：</view>
			<view style="margin: 15px 10px;">
				<uni-grid :column="3">
					<uni-grid-item v-for="(item, index) in grdArray" :key="index" style="height: 50px;">
						<view class="grid-item-box gridBox" style="padding-top: 10px;" @click='grdSelect(item, index)'
							:style="index==grdIndexTemp?'background-color: #2c96bd;color: #ffffff;':''">
							{{item.text}}
						</view>
					</uni-grid-item>
				</uni-grid>
			</view>
			<view style="margin-left: 10px;font-size: 14px;color: 7f7f7f;">班级：</view>
			<view style="margin: 15px 10px;">
				<uni-grid :column="4">
					<uni-grid-item v-for="(item, index) in clsArrayTemp" :key="index" style="height: 40px;">
						<view class="grid-item-box gridBox" @click='clsSelect(item, index)'
							:style="index==clsIndexTemp?'background-color: #2c96bd;color: #ffffff;':''">
							{{item.text}}
						</view>
					</uni-grid-item>
				</uni-grid>
			</view>
			<view style="height: 50px;margin: 20px 0;">
				<button class="mini-btn" type="default" size="mini"
					style="background-color: #049f95;border-color: #049f95;color: #ffffff;"
					@click="popSure(1)">确定</button>
				<button class="mini-btn" style="margin-left: 50px;" type="default" size="mini"
					@click="popSure(0)">取消</button>
			</view>
		</uni-popup>
		<uni-popup ref="popup4" type="bottom" background-color="#fff" style="z-index: 300;">
			<view style="margin-top: 10px;text-align: center;font-size: 16px;color: #000000;">请选择记录人</view>
			<view style="margin: 20px 10px;">
				<scroll-view scroll-y="true" style="max-height: 400px;">
					<uni-grid :column="4">
						<uni-grid-item v-for="(item, index) in stuArray" :key="index" style="height: 40px;">
							<view class="grid-item-box gridBox" @click='stuSelect(index)'
								:style="index==stuIndex?'background-color: #2c96bd;color: #ffffff;':''">
								{{item.create_user_name}}
							</view>
						</uni-grid-item>
					</uni-grid>
				</scroll-view>
			</view>
			<!-- <view style="height: 5px;"></view> -->
		</uni-popup>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	import moment from 'moment/moment.js';
	let _this;
	export default {
		data() {
			return {
				index_code: '',
				personInfo: {},
				navItem: {},
				nowDate:'',
				selectDate:'',
				noRightColor:'',
				pageArray:[],
				pageIndex: 1,
				total_page: 0,
				flagRef: 0, //是刷新0，还是加载更多1
				loadMoreText: "加载中...",
				showLoadMore: false,
				
				//顶部筛选框相关内容
				grdIndex: 0,
				grdIndexTemp: 0,
				grdArray: [{
					text: '',
					value: ''
				}],
				clsIndex: 0,
				clsArray: [{
					text: '',
					value: ''
				}],
				clsIndexTemp: 0,
				clsArrayTemp: [{
					text: '',
					value: ''
				}],
				grdClsStr: '',
				stuArray:[],
				stuIndex:0,
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
			// this.navItem.text = '在线缴费';
			this.index_code = this.navItem.access.split("#")[1];
			console.log('this.navItem:' + JSON.stringify(this.navItem));
			
			let tempA = moment().format('YYYY-MM-DD')
			this.nowDate = tempA
			this.selectDate = tempA;
			this.noRightColor = '#999'
			console.log('tempA:'+tempA)
			
			this.getStu(1)
			
			//#ifdef H5
			document.title = ""
			//#endif
		},
		onReachBottom() {
			this.flagRef = 1;
			if (this.total_page < this.pageIndex) {
				this.loadMoreText = "没有更多数据了!"
				return;
			}
			this.showLoadMore = true;
			setTimeout(() => {
				this.getList0();
			}, 300);
		},
		onPullDownRefresh() {
			this.loadMoreText = "加载中..."
			this.flagRef = 0;
			this.pageIndex = 1;
			this.getList0();
		},
		methods: {
			changeDate(flag){
				if (flag == 0) {
					this.selectDate = moment(this.selectDate).add(-1,'days').format('YYYY-MM-DD')
					this.noRightColor = ''
					this.loadMoreText = "加载中..."
					this.flagRef = 0;
					this.pageIndex = 1;
					this.getList0();
				} else{
					if (this.selectDate == this.nowDate) {
						
					} else{
						this.selectDate = moment(this.selectDate).add(1,'days').format('YYYY-MM-DD')
						if (this.selectDate == this.nowDate) {
							this.noRightColor = '#999'
						} else{
							this.noRightColor = ''
						}
						this.loadMoreText = "加载中..."
						this.flagRef = 0;
						this.pageIndex = 1;
						this.getList0();
					}
				}
			},
			showGrdCls(){
				this.$refs.popup.open();
			},
			showStu(){
				this.$refs.popup4.open();
			},
			grdSelect(item, index) {
				if (this.grdIndexTemp != index) {
					this.grdIndexTemp = index;
					this.getCls(2);
				}
			},
			clsSelect(item, index) {
				if (this.clsIndexTemp != index) {
					this.clsIndexTemp = index;
				}
			},
			stuSelect(index){
				if (this.stuIndex != index) {
					this.stuIndex = index;
					this.flagRef = 0;
					this.pageIndex = 1;
					this.getList0();
				}
				this.$refs.popup4.close();
			},
			clsClick() {
				this.grdIndexTemp = this.grdIndex;
				this.clsIndexTemp = this.clsIndex;
				this.clsArrayTemp = JSON.parse(JSON.stringify(this.clsArray));
				this.$refs.popup.open()
			},
			popSure(flag) {
				this.$refs.popup.close();
				if (flag == 0) {
					this.grdIndexTemp = this.grdIndex;
					this.clsArrayTemp = JSON.parse(JSON.stringify(this.clsArray));
					this.clsIndexTemp = this.clsIndex;
				} else {
					this.grdIndex = this.grdIndexTemp;
					this.clsArray = JSON.parse(JSON.stringify(this.clsArrayTemp));
					this.clsIndex = this.clsIndexTemp;
					this.showLoading()
					this.flagRef = 0;
					this.pageIndex = 1;
					this.grdClsStr = this.grdArray[this.grdIndex].text + ' ' + this.clsArray[this.clsIndex].text;
					this.getList0();
				}
			},
			getGrd(flag) { //获取年级
				let comData = {
					op_code: 'index',
					get_grd: true,
					all_grd: true,
					index_code: this.index_code,
				}
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
						this.getCls(flag);
					} else {
						this.grdArray = [];
						this.showToast('无数据授权 无法获取年级');
					}
				})
			},
			getCls(flag) { //获取班级
				let comData = {
					op_code: 'index',
					grd_code: this.grdArray[this.grdIndexTemp].value,
					get_cls: true,
					all_cls: true,
					index_code: this.index_code,
				}
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
						this.clsArrayTemp = JSON.parse(JSON.stringify(clsArray));
						this.clsIndexTemp = 0;
						if (flag == 1) {
							this.clsArray = JSON.parse(JSON.stringify(clsArray));
							this.grdClsStr = this.grdArray[this.grdIndex].text + ' ' + this.clsArray[this.clsIndex].text;
							this.getList0()
						}
					} else {
						this.clsArray = [];
						this.clsArrayTemp = [];
						this.showToast('无数据授权 无法获取班级');
					}
				})
			},
			getStu(flag) { //5.1.查询记录人列表
				let comData = {
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_BJLHKP + 'kpScore/createUserList', comData, (data0, data) => {
					this.hideLoading()
					if (data.code == 0) {
						this.getGrd(flag)
						this.stuArray =  [{"create_user_name": "全部","create_user_code": ""}].concat(data.data.list)
					} else {
						this.showToast(data.msg);
					}
				})
			},
			getList0() { //5.2.分页查询
				let comData = {
					page_number: this.pageIndex, //当前页数
					page_size: '10', //每页记录数
					kp_date:this.selectDate,
					grd_code:this.grdArray[this.grdIndex].value,
					cls_code:this.clsArray[this.clsIndex].value,
					create_user_code:this.stuArray[this.stuIndex].create_user_code,
					user_code:this.personInfo.user_code,
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_BJLHKP + 'kpScore/page', comData, (data0, data) => {
					this.hideLoading()
					if (data.code == 0) {
						this.pageIndex++;
						this.total_page = data0.total_page;
						for (var i = 0; i < data0.list.length; i++) {
							let tempM = data0.list[i]
							tempM.stuStr = ''
							let tempArr = []
							if (tempM.stu_list&&tempM.stu_list.length>0) {
								for (var a = 0; a < tempM.stu_list.length; a++) {
									let tempA = tempM.stu_list[a]
									if (tempA.stu_name) {
										tempArr.push(tempA.stu_name)
									}
								}
								tempM.stuStr = tempArr.join('、')
							}
						}
						if (this.flagRef == 0) {
							if (data0.list.length == 0) {
								this.showToast('暂无数据');
							}
							this.pageArray = [].concat(data0.list);
							uni.stopPullDownRefresh();
						} else {
							this.pageArray = this.pageArray.concat(data0.list);
						}
					} else {
						this.showToast(data.msg);
					}
				})
			},
			gotoDetail(model){
				model.index_code = this.index_code
				let tempM = {
					index_code:this.index_code,
					id:model.id
				}
				util.openwithData('/pages/bjpbT/xcjlDetail', model,{
					refreshXcjlIndex() { //子页面调用父页面需要的方法
						_this.loadMoreText = "加载中..."
						_this.flagRef = 0;
						_this.pageIndex = 1;
						_this.getList0();
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.pageHead{
		position: fixed;
		/* #ifdef APP */
		top: 80px;
		/* #endif */
		/* #ifndef APP */
		top: 40px;
		/* #endif */
		left: 0;
		width: 100%;
		background: white;
		padding-top: 5px;
		z-index: 300;
		
		.riqiView{
			top: 40px;
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
		
		.grdClsStu{
			top: 100px;
			margin: 5px 15px;
			padding-top: 5px;
			
			.grdClsView{
				margin-bottom: 10px;
				.grdCls{
					font-size: 14px;
					color: #333;
				}
				.downIcon{
					padding: 3px 0 0 2px;
				}
			}
			.stuView{
				
				.stuCss{
					font-size: 14px;
					color: #333;
				}
				.downIcon{
					padding: 3px 0 0 2px;
				}
			}
		}
	}
	.pbList{
		background: white;
		margin: 10px 10px 10px 10px;
		border-radius: 10px;
		
		.clsView{
			margin: 10px 15px;
			
			.clsStr{
				margin-top: 10px;
				font-size: 12px;
				color: #000;
			}
		}
		
		.shenSS{
			z-index: 200;
			width: 60px;
			height: 60px;
			border: 2px dashed #ec808d;
			color: #ec808d;
			font-size: 18px;
			border-radius: 50%;
			text-align: center;
			line-height: 60px;
			font-weight: 700;
			position: relative;
			left: calc(100% - 100px);
			top: 0px;
		}
		
		.cellList{
			/* margin-top: -75px; */
		}
		
		.pbCell{
			background: white;
			margin: 5px 10px 5px 10px;
			height: 55px;
			
			.pbCont{
				line-height: 24px;
				height: 45px;
				font-size: 14px;
				color: #333;
				background: #f2f2f2;
				padding: 5px 10px;
				border-radius: 5px;
				width: calc(100% - 73px);
			}
			
			.pbCount{
				height: 55px;
				width: 75px;
				background: #f2f2f2;
				border-radius: 5px;
				margin-left: 3px;
				text-align: center;
				line-height: 55px;
				font-size: 24px;
				color: #d9001b;
				font-weight: bold;
			}
		}
		
		.stuView{
			margin: 5px 15px;
			
			.stuIcon{
				
			}
			.stuStr{
				font-size: 12px;
			}
		}
		
		.timeView{
			margin: 5px 15px;
			
			.personStr{
				font-size: 12px;
				color: #555555;
			}
			
			.timeIcon{
				padding-top: 1px;
				margin: 0 5px 0 10px;
			}
			.timeStr{
				font-size: 12px;
				margin-bottom: 10px;
				color: #555555;
			}
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
</style>
