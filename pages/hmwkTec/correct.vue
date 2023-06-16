<template>
	<view style="background: #f2f2f2;">
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo'></mynavBar>
		<view style="font-size: 14px;padding-top: 4px;font-weight: 500;background: white;">
			<view class="card-line1" :class="[semFlag==2?'semFlagSelect':'']" @click="clickSem(2)">未改完</view>
			<view class="card-line2" :class="[semFlag==3?'semFlagSelect':'']" @click="clickSem(3)">已改完</view>
		</view>
		<view v-if="pagedata.length==0" style="margin-top: 20px;text-align: center;font-size: 13px;">暂无</view>
		<uni-card v-else isShadow style="margin: 10px 5px 0;" @click="gotoDetail(item)" v-for="(item,index) in pagedata" :key="index">
			<view class="itemSub">{{item.sub_name.slice(0,1)}}</view>
			<view class="itemSub hmwkType">{{item.type==1?'线上作业':'线下作业'}}</view>
			<view v-if="item.type==1" style="font-size: 12px;float: right;margin-top: -20px;">批改：{{item.correct_count}}/{{item.stu_count}}</view>
			<view class="hmwkName">{{item.content}}</view>
			<view style="font-size: 12px;margin-top: 5px;">作业对象：{{item.clsStr}}</view>
			<view style="font-size: 12px;margin-top: 5px;">截止时间：{{item.deadline}}</view>
		</uni-card>
		<view style="height: 50px;background: #f2f2f2;"></view>
		<view class="uni-loadmore" v-if="showLoadMore">{{loadMoreText}}</view>
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
				semFlag:2,
				pagedata:[],
				flagRef: 0, //0刷新1加载更多
				pageIndex: 1,
				total_page: 0, //总页数
				loadMoreText: "加载中...",
				showLoadMore: false,
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
			console.log('this.navItem:' + JSON.stringify(this.navItem));
			uni.setNavigationBarTitle({
				title: this.navItem.text
			});
			this.getList0();
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
			gotoDetail(model){
				if (this.semFlag == 2) {
					model.index_code = _this.navItem.access.split("#")[1];
					util.openwithData('/pages/hmwkTec/correctDetail', model, {
						refreshCorrect(data) { //子页面调用父页面需要的方法
							_this.loadMoreText = "加载中..."
							_this.flagRef = 0;
							_this.pageIndex = 1;
							_this.pagedata = [];
							_this.getList0();
						}
					})
				} else{
					model.index_code = _this.navItem.access.split("#")[1];
					util.openwithData('/pages/hmwkTec/correctShowList', model, {
						refreshCorrect(data) { //子页面调用父页面需要的方法
							_this.loadMoreText = "加载中..."
							_this.flagRef = 0;
							_this.pageIndex = 1;
							_this.pagedata = [];
							_this.getList0();
						}
					})
				}
			},
			clickSem(flag){
				if (flag != this.semFlag) {
					this.semFlag = flag;
					_this.loadMoreText = "加载中..."
					_this.flagRef = 0;
					_this.pageIndex = 1;
					_this.pagedata = [];
					_this.getList0();
				}
			},
			getList0(){
				let comData = {
					status:this.semFlag,//
					user_code:this.personInfo.user_code,
					page_size: 10,
					page_number: this.pageIndex,
					index_code: this.navItem.access.split("#")[1],
				}
				this.showLoading();
				// 5.1.查询用户创建的作业分页
				this.post(this.globaData.INTERFACE_HMWK + 'stuWork/page', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.pageIndex++;
						this.total_page = data.data.total_page;
						for (var i = 0; i < data.data.list.length; i++) {
							var tempM0 = data.data.list[i];
							var tempArr = [];
							for (var a = 0; a < tempM0.clss.length; a++) {
								tempArr.push(tempM0.clss[a].cls_name);
							}
							tempM0.clsStr = tempArr.join('、');
						}
						if (this.flagRef == 0) {
							if (data.data.list.length == 0) {
								this.showToast('暂无数据');
							}
							this.pagedata = [].concat(data.data.list);
							uni.stopPullDownRefresh();
						} else {
							this.pagedata = this.pagedata.concat(data.data.list);
						}
					} else {
						this.showToast(data.msg);
					}
				});
			},
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
	}
</script>

<style>
	.card-line1 {
		text-align: center;
		font-size: 16px;
		color: #7f7f7f;
		font-weight: 500;
		margin-top: 15px;
		border-bottom: 2px solid #aaaaaa;
		width: 100px;
		margin-left: calc((100% - 200px)/2);
	}
	
	.card-line2 {
		text-align: center;
		font-size: 16px;
		color: #7f7f7f;
		font-weight: 500;
		margin-top: 15px;
		border-bottom: 2px solid #aaaaaa;
		width: 100px;
		margin-right: calc((100% - 200px)/2);
		float: right;
		margin-top: -24px;
	}
	
	.semFlagSelect{
		color: #008080;
		border-bottom: 2px solid #008080;
	}
	
	.itemSub{
		font-size: 12px;
		background: #00cfbd;
		color: white;
		border-radius: 5px 0 8px 0;
		width: 35px;
		height: 25px;
		margin: -11px 0 0 -11px;
		padding: 7px 0 0 20px;
	}
	
	.hmwkType{
		width: 70px;
		margin: -33px 0 0 45px;
		background: #f2eade;
		color: #555;
	}
	
	.hmwkName {
		font-weight: 700;
		margin-top: 10px;
		font-size: 14px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
