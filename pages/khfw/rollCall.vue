<template>
	<view style="background: #f2f2f2;">
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo' :text="rightText" :textClick="textClick">
		</mynavBar>
		<view style="margin: 10px 0 0 15px;font-size: 13px;">说明：点名操作会同时生成教师签到记录。</view>
		<view style="color: #00CFBD;text-align: left;height: 30px;font-size: 13px;margin: 10px 0 0 20px;"
			@click="showTimePick()">
			{{timePickerDate.join(' ~ ')}}
			<uni-icons type="arrowdown" size="15" color='#00CFBD'></uni-icons>
		</view>
		<uni-card isShadow v-for="(item,index) in pagedata" :key="index">
			<uni-row
				style="margin: 0 10px;text-align: center;color: #000000;padding-bottom: 5px;font-size: 14px;">
				<uni-col :span="8">
					<view class="rowStyle" style="">{{item.grd_name}}</view>
				</uni-col>
				<uni-col :span="8">
					<view class="rowStyle" style="">{{item.cls_name}}</view>
				</uni-col>
				<uni-col :span="8">
					<view class="rowStyle" style="">{{item.stu_name}}</view>
				</uni-col>
			</uni-row>
			<view class="cardLine"></view>
			<!-- <view class="card-line">{{item.sign_status_cn}}</view> -->
			<uni-row style="font-size: 12px;margin-top: 5px;">
				<uni-col :span="6">
					<view class="rowStyle" style="">日期：</view>
				</uni-col>
				<uni-col :span="18">
					<view class="rowStyle" style="">{{item.sub_date.split(' ')[0]}}</view>
				</uni-col>
				<uni-col :span="6">
					<view class="rowStyle" style="">星期：</view>
				</uni-col>
				<uni-col :span="18">
					<view class="rowStyle" style="">{{item.week_name}}</view>
				</uni-col>
				<uni-col :span="6">
					<view class="rowStyle" style="">上课时间：</view>
				</uni-col>
				<uni-col :span="18">
					<view class="rowStyle" style="">{{item.time_name}}</view>
				</uni-col>
				<uni-col :span="6">
					<view class="rowStyle" style="">上课地点：</view>
				</uni-col>
				<uni-col :span="18">
					<view class="rowStyle" style="">{{item.addr_list.length>0?item.addr_list[0].address:''}}</view>
				</uni-col>
				<uni-col :span="6">
					<view class="rowStyle" style="">课程：</view>
				</uni-col>
				<uni-col :span="18">
					<view class="rowStyle" style="">{{item.sub_name}}</view>
				</uni-col>
				<uni-col :span="6">
					<view class="rowStyle" style="">老师：</view>
				</uni-col>
				<uni-col :span="18">
					<view class="rowStyle" style="">{{item.tec_list[0].tec_name}}</view>
				</uni-col>
			</uni-row>
			<view class="itemStatus" :style="{color:item.sign_status==5?'#d9001b':'',border:item.sign_status==5?'2px solid #d9001b':''}">{{item.sign_status_cn}}</view>
		</uni-card>
		
		<view class="content">
			<term-picker :visable.sync="pickerVisable" :defaultDate="defaultDate" :timeLimit='true'
				@confirm="confirm"></term-picker>
		</view>
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
				rightText:'',
				pickerVisable: false,
				defaultDate: [],
				timePickerDate: [],
				defTime: this.moment().format('YYYY-MM-DD'),
				pageSize:15,
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
			this.navItem.text = '点名';
			this.navItem.index = 100;
			console.log('this.navItem:' + JSON.stringify(this.navItem));
			uni.setNavigationBarTitle({
				title: '点名'
			});
			let end_month = this.moment().format('YYYY-MM-DD')
			let start_month = this.moment().subtract(1, 'w').format('YYYY-MM-DD');
			this.defaultDate.push(start_month);
			this.defaultDate.push(end_month);
			this.timePickerDate.push(start_month);
			this.timePickerDate.push(end_month);
			this.getList0();
			// 获取权限
			this.getPermissionByPosition('add', this.navItem.access.split('#')[1], result => {
				if (result[0]) {
					this.rightText = '点名';
				}
			})
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
			textClick() {
				util.openwithData('/pages/khfw/rollCall1', {
					index_code: _this.navItem.access.split("#")[1],
				}, {
					refreshRollCall(data) { //子页面调用父页面需要的方法
						_this.showLoading()
						_this.loadMoreText = "加载中..."
						_this.flagRef = 0;
						_this.pageIndex = 1;
						_this.getList0();
					}
				})
			},
			showTimePick() {
				this.pickerVisable = true;
			},
			// 点击确定按钮，返回当前选择的值
			confirm(date) {
				this.timePickerDate = date;
				console.log(date) // ['2021-06-01', '2021-07-01']
				this.showLoading()
				this.loadMoreText = "加载中..."
				this.flagRef = 0;
				this.pageIndex = 1;
				this.getList0();
			},
			getList0(){
				let comData = {
					start_date:this.timePickerDate[0],
					end_date:this.timePickerDate[1],
					page_size:10,
					page_number:this.pageIndex,
					index_code: this.navItem.access.split("#")[1],
				}
				// 分页查询
				this.post(this.globaData.INTERFACE_KHFW + 'afterClassSignStu/page', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						// for (var i = 0; i < data.data.page.list.length; i++) {
						// 	let tempM = data.data.page.list[i];
						// 	if(tempM.status == 1){
						// 		tempM.statusStr = '发出';
						// 	}else if(tempM.status == 2){
						// 		tempM.statusStr = '撤销';
						// 	}else if(tempM.status == 3){
						// 		tempM.statusStr = '被退';
						// 	}
						// 	if(tempM.progress == 1){
						// 		tempM.progressStr = '新建';
						// 	}else if(tempM.progress == 2){
						// 		tempM.progressStr = '审批中';
						// 	}else if(tempM.progress == 3){
						// 		tempM.progressStr = '审毕';
						// 	}
						// }
							this.pageIndex++;
							this.total_page = data.data.page.total_page;
							if (this.flagRef == 0) {
								if (data.data.page.list.length == 0) {
									this.showToast('暂无数据');
								}
								this.pagedata = [].concat(data.data.page.list);
								uni.stopPullDownRefresh();
							} else {
								this.pagedata = this.pagedata.concat(data.data.page.list);
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
	/* .card-line {
		text-align: center;
		font-size: 18px;
		color: red;
		font-weight: 500;
		margin-top: 15px;
		border-bottom: 2px solid #049f95;
		width: 60px;
		margin-left: calc((100% - 60px)/2);
	} */
	
	/* .uni-table-td {
	    padding: 3px 10px;
	} */
	
	.cardLine{
		height: 1px;
		width: calc((100% + 100px));
		background: #d7d7d7;
		margin-left: -50px;
	}
	
	.itemStatus{
		font-size: 18px;
		color: #f59a23;
		border: 2px solid #f59a23;
		width: 38px;
		padding: 5px 10px;
		border-radius: 8px;
		float: right;
		margin-top: -70px;
		transform: rotate(315deg) ;
		font-family: 700;
	}
</style>