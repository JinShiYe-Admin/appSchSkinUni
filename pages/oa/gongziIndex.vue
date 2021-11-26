<template>
	<view>
		<uni-list>
			<uni-list-item v-for="(model,index) in pageArray" :key='index' direction='column' clickable @click="clickItem(model)">
				<view slot="body">
					<view style="float: left;">
						<image class="peopleImg" :src="model.SendManPic?model.SendManPic:'http://www.108800.com/user.jpg'"></image>
					</view>
					<view class="rightView">
						<view class="title">{{model.LetterName}}</view>
						<uni-row class="nameTime">
							<uni-col :span="12">
								{{model.SendManName}}
							</uni-col>
							<uni-col :span="12">
								{{model.SendTime}}
							</uni-col>
						</uni-row>
					</view>
				</view>
			</uni-list-item>
		</uni-list>
		<view class="uni-loadmore" v-if="showLoadMore">{{loadMoreText}}</view>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	export default {
		data() {
			return {
				personInfo: {},
				itemData: {},
				pageArray: [],
				pageIndex: 1,
				total_page: 0,
				flagRef: 0, //是刷新0，还是加载更多1
				loadMoreText: "加载中...",
				showLoadMore: false,
			}
		},
		onLoad(option) {
			this.personInfo = util.getPersonal();
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			this.itemData = util.getPageData(option);
			console.log('this.itemData:' + JSON.stringify(this.itemData));
			uni.setNavigationBarTitle({
				title: this.itemData.text
			});
			//#ifndef APP-PLUS
			document.title = ""
			//#endif
			//79.获取某人接收的通知单列表
			this.getPageList();
		},
		onShow(){//解决IOS端列表进详情返回后不能定位到点击位置的问题
			// #ifdef H5
				uni.pageScrollTo({
					scrollTop: this.scrollLength,
					duration: 0
				});
			// #endif
						//#ifndef APP-PLUS
							document.title=""
						//#endif
		},
		onPageScroll(e) { //nvue暂不支持滚动监听，可用bindingx代替
			// #ifdef H5
				this.scrollLength=e.scrollTop
			// #endif
		},
		onReachBottom() {
			this.flagRef = 1;
			if (this.total_page < this.pageIndex) {
				this.loadMoreText = "没有更多数据了!"
				return;
			}
			this.showLoadMore = true;
			setTimeout(() => {
				this.getPageList();
			}, 300);
		},
		onPullDownRefresh() {
			this.loadMoreText = "加载中..."
			this.flagRef = 0;
			this.pageIndex = 1;
			this.getPageList();
		},
		methods: {
			clickItem(model) {
				console.log('clickItem:' + JSON.stringify(model));
				model.access = this.itemData.access;
				util.openwithData("/pages/oa/gongziDetail", model);
			},
			getPageList() {
				var comData = {
					schoolId: this.personInfo.unit_code, //学校ID
					name: '', //通知单名称
					type: 1, //类型,1 工资条2 成绩单
					noticeManId: this.personInfo.user_code, //通知人ID
					beginTime: '20170101', //查询开始时间
					endTime: '30180127', //查询结束时间
					page_number: this.pageIndex, //当前页数
					page_size: '20', //每页记录数
					index_code: this.itemData.access.split('#')[1],
					op_code: 'index'
				}
				this.showLoading();
				//79.获取某人接收的通知单列表
				this.post(this.globaData.INTERFACE_OA + 'noticeLetter/getReceiveNoticeLetterByMan', comData, (data) => {
					this.hideLoading();
					this.pageIndex++;
					this.total_page = data.total_page;
					if (this.flagRef == 0) {
						if(data.list.length==0){
							this.showToast('暂无数据');
						}
						this.pageArray = [].concat(data.list);
						uni.stopPullDownRefresh();
					} else {
						this.pageArray = this.pageArray.concat(data.list);
					}
				});
			}
		}
	}
</script>

<style>
	.peopleImg {
		width: 40px;
		height: 40px;
		border-radius: 50%;
	}
	
	.rightView{
		margin-left: 10px;
		float: left;
		width: calc(100% - 50px);
	}
	
	.title{
		font-size: 13px;
		word-break:break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	
	.nameTime{
		margin-top: 5px;
		font-size: 13px;
		color: gray;
	}
</style>
