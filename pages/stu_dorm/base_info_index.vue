<template>
	<view>
		<view style="padding:5px 15px 0px;">
			<uni-row>
				<uni-col :span="24"><view class="title-text">{{total.dorm_name}}</view></uni-col>
				<template  v-for="(item,index) in total.list">
					<uni-col :span="4"><view class="detail-text" style="margin-top: 5px;">{{item.stu_sex_text}}</view></uni-col>
					<uni-col :span="6"><view class="detail-text center" style="margin-top: 5px;">层数:{{item.floor_nums}}</view></uni-col>
					<uni-col :span="7"><view class="detail-text center" style="margin-top: 5px;">房间数:{{item.room_nums}}</view></uni-col>
					<uni-col :span="7"><view class="detail-text center" style="margin-top: 5px;">床位数:{{item.bed_nums}}</view></uni-col>
				</template>
			</uni-row>
		</view>
		<view class="double-line"></view>
		 <view style="padding:5px 15px;">
			 <uni-list :border="false">
			 	<uni-list-item showArrow clickable @click="toDetails(item)" :key="index" v-for="(item,index) in pageArray" :border="true">
			 		<view slot="body" class="slot-box slot-text" @click.stop="toDetails(item)">
			 			<uni-row>
			 				<uni-col :span="24"><view class="title-text2">楼房名:{{item.dorm_name}}</view></uni-col>
			 				<template  v-for="(item2,index2) in item.list">
			 					<uni-col :span="4"><view class="detail-text" style="margin-top: 5px;">{{item2.stu_sex_text}}</view></uni-col>
			 					<uni-col :span="6"><view class="detail-text center" style="margin-top: 5px;">层数:{{item2.floor_nums}}</view></uni-col>
			 					<uni-col :span="7"><view class="detail-text center" style="margin-top: 5px;">房间数:{{item2.room_nums}}</view></uni-col>
			 					<uni-col :span="7"><view class="detail-text center" style="margin-top: 5px;">床位数:{{item2.bed_nums}}</view></uni-col>
			 				</template>
			 			</uni-row>
			 		</view>
			 	</uni-list-item>
			 </uni-list>
		 </view>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	export default {
		data() {
			return {
				index_code:'',
				dormData:{},
				itemData: {},
				total:'',//总计
				pageArray: [], //界面总数组
			}
		},
		methods: {
			getList(){//获取年级
				const params = {
					page_number: 1, //当前页数
					page_size: 10000, //每页记录数
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_DORM+'dorm/page',params,response=>{
					this.hideLoading()
					this.dormData=response
					this.total= response.total
					this.pageArray=[].concat(response.list);
					if (response.list.length == 0) {
						this.shotToast('暂无数据');
					}
				})
			},
			toDetails(item){
				console.log("item: " + JSON.stringify(item));
				item.index_code=this.index_code
				util.openwithData('/pages/stu_dorm/base_info_floor_list',item,{})
			}
		},
		onLoad(options) {
			const itemData = util.getPageData(options);
			this.index_code=itemData.access.split('#')[1]
			this.itemData=itemData
			setTimeout(()=>{
				 this.showLoading()
				 this.getList()
			},100)
			uni.setNavigationBarTitle({title:itemData.text});
			//#ifdef H5
				document.title=""
			//#endif
		},
		onShow(){//解决IOS端列表进详情返回后不能定位到点击位置的问题
			// #ifdef H5
				uni.pageScrollTo({
					scrollTop: this.scrollLength,
					duration: 0
				});
			// #endif
				//#ifdef H5
					document.title=""
				//#endif
		},
		onPageScroll(e) { //nvue暂不支持滚动监听，可用bindingx代替
			// #ifdef H5
				this.scrollLength=e.scrollTop
			// #endif
		},
	}
</script>

<style>
	::v-deep .uni-list-item__container{
		padding-left: 0 !important;
	}
	.center{
		text-align: center;
	}
	.slot-box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
	}
	.slot-text {
		flex: 1;
		font-size: 14px;
		margin-right: 10px;
	}
	
	 .line{
	 	height: 1px;
	 	background-color: #e5e5e5;
	 	margin: 5px 0;
	 }
	 
	 .title-text,.title-text2{
		display: flex;
		align-items: center;
		color: #5C5C5C;
		font-size: 14px;
	 	word-break: break-all;
	 }
	 .title-text{
		font-weight: 600;
	 }
	 .detail-text{
	 	color: #939393;
	 	font-size: 12px;
	 	margin: 3px 0;
		line-height: 2;
	 }
	 .line-green{
	 	background-color: #00CFBD;
	 	margin-bottom: 0.3125rem;
	 	height: 1px;
	 }
	 .double-line{
	 	height: 5px;
	 	background-color: #e5e5e5;
	 	margin: 5px 0;
		}
</style>
