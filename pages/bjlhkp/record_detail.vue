<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo'>
		</mynavBar>
		<view style="text-align: center;font-family: 900;font-size: 16px;margin-top: 20px;">{{navItem.sec_name}}</view>
		<view style="text-align: center;font-size: 14px;margin: 10px 15px;color: #333333;word-break: break-all;">
			{{navItem.item_name}}</view>
		<view style="font-weight: 900;color: #d9001b;font-size: 32px;text-align: center;">{{parseInt(navItem.score)}}
		</view>
		<uni-row>
			<uni-col :span="6">
				<view class="titleLeft">日期</view>
			</uni-col>
			<uni-col :span="18">
				<view class="titleRight">{{navItem.kp_date.split(' ')[0]}}</view>
			</uni-col>
			<view v-if="navItem.fir_id<4">
				<uni-col :span="6">
					<view class="titleLeft">年级</view>
				</uni-col>
				<uni-col :span="18">
					<view class="titleRight">{{navItem.grd_name}}</view>
				</uni-col>
				<uni-col :span="6">
					<view class="titleLeft">班级</view>
				</uni-col>
				<uni-col :span="18">
					<view class="titleRight">{{navItem.cls_name}}</view>
				</uni-col>
			</view>
			<view v-if="navItem.fir_id>3&&navItem.dorm_door">
				<uni-col :span="6">
					<view class="titleLeft">楼房</view>
				</uni-col>
				<uni-col :span="18">
					<view class="titleRight">{{navItem.dorm_door}}</view>
				</uni-col>
				<uni-col :span="6">
					<view class="titleLeft">楼层</view>
				</uni-col>
				<uni-col :span="18">
					<view class="titleRight">{{navItem.dorm_floor}}</view>
				</uni-col>
				<uni-col :span="6">
					<view class="titleLeft">房间号</view>
				</uni-col>
				<uni-col :span="18">
					<view class="titleRight">{{navItem.dorm_room}}</view>
				</uni-col>
				<uni-col :span="6">
					<view class="titleLeft">床位号</view>
				</uni-col>
				<uni-col :span="18">
					<view class="titleRight">{{navItem.bedList.length>0?navItem.bedList:'--'}}</view>
				</uni-col>
			</view>
			<uni-col :span="6">
				<view class="titleLeft">学生</view>
			</uni-col>
			<uni-col :span="18">
				<view class="titleRight">{{navItem.stuList.length>0?navItem.stuList:'--'}}</view>
			</uni-col>
			<uni-col :span="6">
				<view class="titleLeft" style="margin-top: 10px;">说明</view>
			</uni-col>
			<uni-col :span="18">
				<view class="titleRight" style="margin-top: 10px;">{{navItem.remark&&navItem.remark.length>0?navItem.remark:'--'}}</view>
			</uni-col>
			<uni-col :span="6">
				<view class="titleLeft" style="margin-top: 10px;">照片</view>
			</uni-col>
			<uni-col :span="18">
				<view v-if="navItem.asset_list.length==0" class="titleRight" style="margin-top: 10px;">--</view>
				<uni-grid v-else-if="navItem.asset_list.length>0" :column="3" style="margin-top: 10px;">
					<uni-grid-item v-for="(item, index) in navItem.asset_list" :key="index" style="">
						<!-- <view class="grid-item-box gridBox" style="padding-top: 10px;" @click='grdSelect(item, index)'>
							<image style="width: 60px;height: 60px;" :src=item.url>
						</view> -->
						<image @click='checkEnc(index)' style="width: 80px;height: 80px;" :src=item.url>
					</uni-grid-item>
				</uni-grid>
			</uni-col>
			<uni-col :span="6">
				<view class="titleLeft" style="">记录人</view>
			</uni-col>
			<uni-col :span="18">
				<view class="titleRight" style="">{{navItem.create_user_name}}</view>
			</uni-col>
			<uni-col :span="6" v-if="navItem.check_status == 1">
				<view class="titleLeft">审核分</view>
			</uni-col>
			<uni-col :span="18" v-if="navItem.check_status == 1">
				<view class="titleRight">{{parseInt(navItem.check_score)}}</view>
			</uni-col>
			<uni-col :span="6" v-if="navItem.check_status == 1">
				<view class="titleLeft">审核人</view>
			</uni-col>
			<uni-col :span="18" v-if="navItem.check_status == 1">
				<view class="titleRight">{{navItem.check_user_name}}</view>
			</uni-col>
			<p class="kpType" v-if="navItem.check_status == 1">已审</p>
		</uni-row>
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
				icon: '',
				navItem: {},
				pagedata: [],
			}
		},
		components: {
			mynavBar
		},
		methods: {
			checkEnc: function(index) {
				let newList = []
				this.navItem.asset_list.map(item => {
					newList.push(item.url);
				})
				uni.previewImage({
					current: index,
					urls: newList
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
			// this.index_code = itemData.access.split("#")[1]
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
	.titleLeft {
		padding-left: 20px;
		text-align: left;
		color: #7f7f7f;
		font-size: 14px;
		min-height: 40px;
	}

	.titleRight {
		text-align: left;
		color: #000000;
		font-size: 14px;
		min-height: 40px;
		margin-right: 10px;
		word-break: break-all;
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
	
	.kpType {
		width: 60px !important;
		height: 25px !important;
		border-radius: 5px;
		border: 1px solid #d9001b;
		color: #d9001b;
		float: right;;
		font-size: 13px;
		text-align: center;
		padding-top: 5px;
		margin-right: 20px;
		margin-top: -60px;
		font-weight: 900;
	}
</style>
