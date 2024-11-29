<template>
	<view style="background: #f2f2f2;height: 100vh;">
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo'></mynavBar>
		<view class="flexCenter semView">
			<view @click="clickSem(0)" :class="btnFlag==0?'sh0Btn':'sh1Btn'">未审核</view>
			<view @click="clickSem(1)" :class="btnFlag==0?'sh1Btn':'sh0Btn'">已审核</view>
		</view>
		<view class="pbList" v-for="model in pageArray" @click="gotoDetail(model)">
			<view class="clsView flexBetween">
				<view class="clsStr">{{model.cls_name}}</view>
				<view class="clsStr">{{model.dorm_room}}</view>
			</view>
			<view v-if="btnFlag==1" class="shenSS">审</view>
			<view :class="btnFlag==0?'':'cellList'">
				<view class="flexStart pbCell" v-for="item in model.item_list">
					<view class="ellipsis-2 pbCont">{{item.item_name}}</view>
					<view class="pbCount">{{btnFlag==0?parseInt(item.score):parseInt(item.check_score)}}</view>
				</view>
			</view>
			<view class="stuView flexStart">
				<uni-icons class="stuIcon" type="person" size="15"></uni-icons>
				<view class="stuStr">{{model.stuStr.length==0?'-':model.stuStr}}</view>
			</view>
			<view class="timeView flexEnd">
				<view class="personStr">{{model.create_user_name}}</view>
				<uni-icons class="timeIcon" type="calendar" size="15" color="#555"></uni-icons>
				<view class="timeStr">{{btnFlag==0?model.create_time:model.check_time}}</view>
			</view>
		</view>
		<view class="uni-loadmore" v-if="showLoadMore">{{loadMoreText}}</view>
		<view style="height: 10px;"></view>
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
				btnFlag:0,
				pageArray:[],
				pageIndex: 1,
				total_page: 0,
				flagRef: 0, //是刷新0，还是加载更多1
				loadMoreText: "加载中...",
				showLoadMore: false,
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
			this.getList();
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
				this.getList();
			}, 300);
		},
		onPullDownRefresh() {
			this.loadMoreText = "加载中..."
			this.flagRef = 0;
			this.pageIndex = 1;
			this.getList();
		},
		methods: {
			clickSem(flag){
				this.btnFlag = flag
				this.loadMoreText = "加载中..."
				this.flagRef = 0;
				this.pageIndex = 1;
				this.getList();
			},
			getList(){
				// 5.13.审核分页查询
				let comData = {
					page_size:10,
					page_number:this.pageIndex,
					check_status:this.btnFlag,
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_BJLHKP + 'kpScore/checkPage', comData, (data0, data) => {
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
				model.flag = this.btnFlag
				util.openwithData('/pages/bjpbT/ssshDetail', model,{
					refreshSsshIndex() { //子页面调用父页面需要的方法
						_this.loadMoreText = "加载中..."
						_this.flagRef = 0;
						_this.pageIndex = 1;
						_this.getList();
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.semView{
		margin: 20px;
		font-size: 13px;
		text-align: center;
		
		.sh0Btn{
			width: 100px;
			color: #00b6ab;
			padding-bottom: 5px;
			border-bottom: 1px solid #00b6ab;
		}
		
		.sh1Btn{
			width: 100px;
			color: #7f7f7f;
			padding-bottom: 5px;
			border-bottom: 1px solid #7f7f7f;
		}
	}
	.pbList{
		background: white;
		margin: 10px;
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
			margin-top: -75px;
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
				width: 55px;
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
</style>
