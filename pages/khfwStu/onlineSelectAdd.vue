<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo'>
		</mynavBar>
		<view class="tabs-fixed" style="background-color: #FFFFFF;">
			<uni-row>
				<uni-col :span="12">
					<uni-datetime-picker style="margin-top: 5px;" type="date" :clear-icon="false" :border="false"
						:value="defTime" @change="changeDate" />
					<uni-easyinput-select style="float: left;margin-top: -35px;width: 40px;margin-left: 130px;"
						:inputBorder="false" suffixIcon="arrowdown" disabled></uni-easyinput-select>
				</uni-col>
				<uni-col :span="12">
					<view @click="checkClick()"
						style="font-size: 14px;color: #7f7f7f;text-align: center;padding: 12px 0;">
						{{checkStr}}
						<uni-icons style="float: right;margin-right: 10px;margin-top: 2px;" type="bottom"
							color='#7f7f7f' size="14"></uni-icons>
					</view>
				</uni-col>
			</uni-row>
			<view class="select-line"></view>
		</view>
		<view style="padding-top: 44px;">
			<uni-card isShadow @click="toDetails(item)" v-for="(item, index) in pagedata" :key="index">
				<uni-row>
					<uni-col :span="16">
						<view style='font-weight: 600;margin-bottom: 5px;font-size: 14px;color: #000000;'>
							{{item.sec_name}}</view>
					</uni-col>
					<uni-col :span="8">
						<view class="title-text" style="text-align: right;">{{navItem.mode=='cls'?item.cls_name:item.dorm_room}}</view>
					</uni-col>
				</uni-row>
				<uni-row>
					<uni-col :span="20">
						<view class="title-text">{{item.item_name}}</view>
					</uni-col>
					<uni-col :span="4">
						<view style="font-weight: 900;color: #d9001b;font-size: 26px;text-align: right;">
							{{parseInt(item.score)}}</view>
					</uni-col>
				</uni-row>
				<view v-if="checkArray[checkIndex].value == 0" class="title-text" style='color: #7f7f7f;font-size: 14px;'>
					<uni-icons type="person" size="16"></uni-icons>{{item.stuList.length>0?item.stuList:'--'}}
				</view>
				<uni-row v-else>
					<uni-col :span="20">
						<view class="title-text">{{item.item_name}}</view>
					</uni-col>
					<uni-col :span="4">
						<p class="kpType">已审</p>
					</uni-col>
				</uni-row>
			</uni-card>
			<uni-load-more :status="pageobj0.status" :icon-size="17" :content-text="pageobj0.contentText" />
		</view>
		<uni-popup ref="popup" type="bottom" background-color="#fff" style="">
			<view style="margin-top: 10px;text-align: center;font-size: 16px;color: #000000;">请选择</view>
			<view style="margin: 15px 10px;">
				<uni-grid :column="3">
					<uni-grid-item v-for="(item, index) in checkArray" :key="index" style="height: 50px;">
						<view class="grid-item-box gridBox" style="padding-top: 10px;" @click='checkSelect(item, index)'
							:style="index==checkIndex?'background-color: #2c96bd;color: #ffffff;':''">
							{{item.text}}
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

				//顶部筛选框相关内容
				checkIndex: 0,
				checkArray: [{
					text: '未审核',
					value: 0
				},{
					text: '已审核',
					value: 1
				}],
				checkStr: '未审核',
				pageSize: 15,
				pageobj0: {
					loadFlag: 0, //0 刷新 1加载更多
					page_number: 1, //页码
					status: 'more', //加载更多的状态
					contentText: {
						contentdown: '', //上滑加载更多
						contentrefresh: '加载中',
						contentnomore: '' //没有更多
					},
					canload: true, //是否加载更多
				},
				pagedata: [],
				defTime: this.moment().format('YYYY-MM-DD'),
			}
		},
		components: {
			mynavBar
		},
		methods: {
			changeDate(e) {
				if (this.defTime != e) {
					this.defTime = e;
					this.showLoading()
					this.pageobj0.loadFlag = 0
					this.pageobj0.canload = true
					this.pageobj0.page_number = 1
					this.getList0();
				}
			},
			checkClick() {
				this.$refs.popup.open();
			},
			checkSelect(item, index) {
				if (this.checkIndex != index) {
					this.checkIndex = index;
					this.checkStr = this.checkArray[this.checkIndex].text;
					this.showLoading()
					this.pageobj0.loadFlag = 0
					this.pageobj0.canload = true
					this.pageobj0.page_number = 1
					this.getList0();
				}
				this.$refs.popup.close();
			},
			getList0() { //获取页面数据
				let comData = {
					user_code: this.personInfo.user_code,
					kp_date: this.defTime,
					check_status: this.checkArray[this.checkIndex].value,
					fir_id: this.navItem.id,
					page_number: this.pageobj0.page_number, //当前页数
					page_size: this.pageSize, //每页记录数
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_BJLHKP + 'score/checkPage', comData, response => {
					setTimeout(function() {
						uni.stopPullDownRefresh();
					}, 1000);
					this.hideLoading()
					if (response != null && response.list.length > 0) {
						response.list.map(item => {
							var stuList = [];
							var bedList = [];
							item.stu_list.map(titem => {
								stuList.push(titem.stu_name);
								if (titem.dorm_bed) {
									bedList.push(titem.dorm_bed);
								}
							})
							item.stuList = stuList.join(',');
							item.bedList = bedList.join(',');
						})
						if (this.pageobj0.loadFlag === 0) {
							this.pagedata = [].concat(response.list)
						} else {
							this.pagedata = this.pagedata.concat(response.list)
						}
						if (this.pageobj0.page_number >= response.total_page) {
							this.pageobj0.status = 'noMore';
							this.pageobj0.canload = false
						} else {
							this.pageobj0.status = 'more';
						}
					} else {
						this.pagedata = []
						this.showToast('暂无数据')
						this.pageobj0.status = 'noMore';
						this.pageobj0.canload = false
					}
				})
			},
			toDetails(item) {
				if (this.checkArray[this.checkIndex].value == 0) {
					item.index_code = _this.index_code;
					item.modelType = _this.navItem.mode;
					util.openwithData('/pages/bjlhkp/check_on', item, {
						refreshCheckList(data) { //子页面调用父页面需要的方法
							_this.showLoading()
							_this.pageobj0.loadFlag = 0
							_this.pageobj0.canload = true
							_this.pageobj0.page_number = 1
							_this.getList0()
						}
					})
				} else{
					item.fir_id = _this.navItem.id;
					util.openwithData('/pages/bjlhkp/record_detail', item);
				}
			}
		},
		onLoad(options) {
			_this = this;
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(options);
			console.log('itemData:'+JSON.stringify(itemData))
			itemData.index = 100
			this.navItem = itemData;
			this.index_code = itemData.access.split("#")[1]
			setTimeout(() => {
				this.getList0();
			}, 100)
			//#ifdef H5
			document.title = ""
			//#endif
		},
		onPullDownRefresh() {
			this.pageobj0.loadFlag = 0
			this.pageobj0.canload = true
			this.pageobj0.page_number = 1
			this.getList0()
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 5000);
		},
		onReachBottom() {
			if (this.pageobj0.canload) {
				this.pageobj0.loadFlag = 1
				this.pageobj0.status = 'loading';
				this.pageobj0.page_number = this.pageobj0.page_number + 1
				this.getList0()
			}
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
	.select-line {
		height: 2px;
		background-color: #00CFBD;
		margin: 0 -15px;
	}

	.title-text {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		margin-top: 5px;
		font-size: 14px;
		color: #7f7f7f;
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
	
	.kpType {
		width: 40px !important;
		height: 20px !important;
		border-radius: 5px;
		border: 1px solid #d9001b;
		color: #d9001b;
		float: right;;
		font-size: 13px;
		text-align: center;
	}
</style>
