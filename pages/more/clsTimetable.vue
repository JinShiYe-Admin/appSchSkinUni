<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo'></mynavBar>
		<view style="margin: 10px;">
			<uni-pagination :total="totalDate" :value="returnIndex" show-icon="true"
				@change="change" /></uni-pagination>
			<view style="font-weight: 900;font-size: 16px;text-align: center;margin: -25px 0 10px 0;">
				{{yearMonth}}
			</view>
		</view>
		<uni-row style="margin: 5px;">
			<uni-col :span="3">
				<view class="rowStyle" style="border:1px solid transparent"></view>
			</uni-col>
			<uni-col :span="3" v-for="(item,index) in tempArr0" :key="item.day">
				<view class="rowStyle">{{item.day}}</view>
			</uni-col>
			<uni-col :span="3">
				<view class="rowStyle" style="border:1px solid transparent"></view>
			</uni-col>
			<uni-col :span="3" v-for="(item,index) in tempArr1" :key="index">
				<view class="rowStyle">{{item}}</view>
			</uni-col>
			<view style="margin-top: 10px;">
				<view v-for="(item0,index0) in pageData" :key="index0">
					<uni-col :span="3">
						<view class="rowClass" style="background: #e1d3be;"
							:style="{height:(152*item0.child.length-2)+'px'}">
							<view class="rowStyle" style="padding-top: 10px;">
								{{item0.time_name}}
							</view>
							<view class="rowStyle">{{item0.start_time}}</view>
							<view class="rowStyle">-</view>
							<view class="rowStyle">{{item0.end_time}}</view>
						</view>
					</uni-col>
					<view v-for="(item1,index1) in item0.child" :key="index1">
						<view v-for="(item2,index2) in item1.child" :key="index2">
							<uni-col :span="3" v-if="item2.setValue == 1">
								<view class="rowClass"
									:style="{background:item2.day == today?'#2c96bd':'',color:item2.day == today?'white':''}">
									<view class="rowStyle" style="font-weight: 900;padding-top: 10px;">
										{{item2.sub_name}}</view>
									<view v-if="navItem.flag == 3" class="rowStyle" style="transform: scale(0.9);margin-top: 5px;">
										{{item2.tec_name}}
									</view>
									<view class="rowStyle" style="transform: scale(0.9);margin-top: 5px;">
										{{item2.addr_list&&item2.addr_list.length>0?item2.addr_list[0].address:item2.cls_name}}
									</view>
								</view>
							</uni-col>
							<uni-col :span="3" v-else>
								<view class="rowClass" style="background: #f2f2f2;" :style="{background:item2.day == today?'#2c96bd':''}"></view>
							</uni-col>
						</view>
					</view>
				</view>
			</view>
		</uni-row>
		<view style="height: 5px;background: #f2f2f2;"></view>
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
				yearMonth: '', //年、月显示
				totalDate: 600,
				returnIndex: 1, //
				tempArr0: [],
				tempArr1: ['一', '二', '三', '四', '五', '六', '日'],
				start_date: '',
				end_date: '',
				pageData: [],
				today:this.moment().format('YYYY-MM-DD')
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
			this.navItem.text = '课表';
			this.navItem.index = 100;
			console.log('this.navItem:' + JSON.stringify(this.navItem));
			uni.setNavigationBarTitle({
				title: '课表'
			});
			setTimeout(() => {
				this.returnIndex = 30;
				this.setDate();
			}, 500)
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
			setDate() {
				var tempD = this.totalDate / 2 / 10;
				var tempFlag = tempD - this.returnIndex;
				this.yearMonth = this.moment().subtract(7 * tempFlag, 'days').format('YYYY') + '年' + this.moment()
					.subtract(7 * tempFlag, 'days').format('MM') + '月';
				var tempDay = this.moment().subtract(7 * tempFlag, 'days').format('DD');
				// 
				var tempArr = util.getWeekDataList(this.moment().subtract(7 * tempFlag, 'days').format('YYYY-MM-DD'));
				
				this.tempArr0 = [];
				for (var i = 0; i < tempArr.length; i++) {
					this.tempArr0.push({
						date:tempArr[i],
						day:tempArr[i].split('-')[2],
						week:this.tempArr1[i],
					});
				}
				this.start_date = tempArr[0];
				this.end_date = tempArr[6];
				this.getSignList();
				console.log('tempArr:'+JSON.stringify(this.tempArr0))
			},
			change(e) {
				this.returnIndex = e.current;
				this.setDate();
			},
			getSignList() {
				//12.1.实际课表查询
				let comData = {
					start_date: this.start_date,
					end_date: this.end_date,
					get_after_kb:true,//是否获取课后服务的课表
					// get_times:true,//是否获取节次信息
				}
				if (this.navItem.flag == 1) {//老师身份
					comData.tec_code = this.personInfo.user_code;
					comData.index_code = this.personInfo.personalCenter1Access;
				} else{
					comData.cls_code = this.personInfo.cls_code;
					comData.stu_code = this.personInfo.stu_code;
					comData.index_code = this.personInfo.personalCenter3Access;
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_BJLHKP + 'scheduleKbSign/signList', comData, (data0, data) => {
					this.hideLoading()
					if (data.code == 0) {
						if (data.data.list.length == 0) {
							this.showToast('暂无数据');
							this.pageData = [];
							return;
						}
						var tempArr0 = [];
						for (var i = 0; i < data.data.list.length; i++) {
							var tempM0 = data.data.list[i];
							tempArr0.push({
								time_name: tempM0.time_name,
								name: tempM0.name,
								start_time: tempM0.start_time.slice(0, 5),
								end_time: tempM0.end_time.slice(0, 5),
								child: []
							});
						}
						tempArr0 = util.ArrayUnique(tempArr0, 'time_name');
						tempArr0.sort(util.compare('start_time', 1));
						// 将课程按照周一到周日，形成数组
						var tempArr1 = JSON.parse(JSON.stringify(tempArr0));
						for (var i = 0; i < tempArr1.length; i++) {
							var tempM = tempArr1[i];
							for (var a = 1; a < 8; a++) {
								tempM.child.push({
									week_code: a == 7 ? 0 : a,
									child: []
								})
							}
						}
						for (var i = 0; i < tempArr1.length; i++) {
							var tempM0 = tempArr1[i];
							for (var a = 0; a < tempM0.child.length; a++) {
								var tempM1 = tempM0.child[a];
								for (var b = 0; b < data.data.list.length; b++) {
									var tempM2 = data.data.list[b];
									if (this.navItem.flag == 3&&tempM2.tec_list) {
										var tempTea = [];
										for (var m = 0; m < tempM2.tec_list.length; m++) {
											tempTea.push(tempM2.tec_list[m].tec_name);
										}
										tempM2.tec_name = tempTea.join(',');
									}
									if (tempM0.time_name == tempM2.time_name && tempM2.week_code == tempM1.week_code) {
										tempM2.setValue = 1;
										tempM2.day = this.tempArr0[tempM2.week_code == 0 ? 6 : tempM2.week_code-1].date;
										tempM2.selectFlag = 0; //是否点击选中
										tempM1.child.push(tempM2);
									}
								}
							}
						}
						// console.log('tempArr03:' + JSON.stringify(tempArr1));
						for (var i = 0; i < tempArr0.length; i++) {
							var tempM00 = tempArr0[i];
							var tempIndex = 0;
							for (var m = 0; m < tempArr1[i].child.length; m++) {
								var tempM11 = tempArr1[i].child[m];
								tempIndex = tempM11.child.length > tempIndex ? tempM11.child.length : tempIndex;
							}
							// console.log('tempIndex:' + tempIndex)
							for (var m = 0; m < tempIndex; m++) {
								tempM00.child.push({
									child: []
								})
							}
							// console.log('tempM00:' + JSON.stringify(tempM00));
							for (var a = 0; a < tempM00.child.length; a++) {
								var tempM01 = tempM00.child[a];
								for (var n = 0; n < 7; n++) {
									var tempQ = tempArr1[i].child[n];
									if (tempQ.child[a] && tempQ.child[a].time_name == tempM00.time_name) {
										tempM01.child.push(tempQ.child[a]);
									} else {
										tempM01.child.push({
											day:this.tempArr0[n].date,
											week_code: a, //设置星期几
											setValue: 0 //判断当前model是否有数据 ，0无，1有
										});
									}
								}
							}
						}
						// console.log('tempArr03:' + JSON.stringify(tempArr0));
						this.pageData = tempArr0;
					} else {
						this.showToast(data.msg);
					}
				})
			},
		}
	}
</script>

<style>
	.rowStyle {
		font-size: 12px !important;
		text-align: center;
		word-break: break-all;
	}

	.rowClass {
		color: #333333;
		font-size: 10px !important;
		text-align: center;
		height: 150px;
		background: #f2f2f2;
		border-radius: 5px;
		margin: 2px 1px 0 1px;
		word-break: break-all;
	}

	::v-deep .uni-pagination__num-current {
		color: rgba(0, 0, 0, 0) !important;
		display: none !important;
	}

	::v-deep .uni-pagination__num-current-text {
		color: rgba(0, 0, 0, 0) !important;
		display: none !important;
	}
</style>