<template>
	<view style="background: #f2f2f2;">
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo' text="点名" :textClick="textClick">
		</mynavBar>
		<view style="margin: 10px 0 0 15px;font-size: 13px;">说明：点名操作会同时生成教师签到记录。</view>
		<view style="color: #00CFBD;text-align: left;height: 30px;font-size: 13px;margin: 10px 0 0 20px;"
			@click="showTimePick()">
			{{timePickerDate.join(' ~ ')}}
			<uni-icons type="arrowdown" size="15" color='#00CFBD'></uni-icons>
		</view>
		<uni-card isShadow>
			<uni-row
				style="margin: 0 10px;text-align: center;background: goldenrod;color: white;padding: 5px 0;border-radius: 2px;">
				<uni-col :span="8">
					<view class="rowStyle" style="">六年级</view>
				</uni-col>
				<uni-col :span="8">
					<view class="rowStyle" style="">六年级</view>
				</uni-col>
				<uni-col :span="8">
					<view class="rowStyle" style="">六年级</view>
				</uni-col>
			</uni-row>
			<view class="card-line">迟到</view>
			<uni-table border stripe emptyText="暂无更多数据" style="margin-top: 20px;">
				<!-- 表头行 -->
				<!-- <uni-tr>
					<uni-th align="center">日期</uni-th>
					<uni-th align="center">姓名</uni-th>
					<uni-th align="left">地址</uni-th>
				</uni-tr> -->
				<!-- 表格数据行 -->
				<uni-tr>
					<uni-td style="background: gainsboro;">2020-10-20</uni-td>
					<uni-td>北京市海淀区</uni-td>
				</uni-tr>
				<uni-tr>
					<uni-td style="background: gainsboro;">2020-10-21</uni-td>
					<uni-td>北京市海淀区</uni-td>
				</uni-tr>
				<uni-tr>
					<uni-td style="background: gainsboro;">2020-10-22</uni-td>
					<uni-td>北京市海淀区北京市市海淀区</uni-td>
				</uni-tr>
				<uni-tr>
					<uni-td style="background: gainsboro;">2020-10-23</uni-td>
					<uni-td>北京市海淀区</uni-td>
				</uni-tr>
			</uni-table>
		</uni-card>
		<view class="content">
			<term-picker :visable.sync="pickerVisable" :defaultDate="defaultDate" :timeLimit='true'
				@confirm="confirm"></term-picker>
		</view>
		<view style="height: 50px;background: #f2f2f2;"></view>
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
				pickerVisable: false,
				defaultDate: [],
				timePickerDate: [],
				defTime: this.moment().format('YYYY-MM-DD'),
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
					// index_code: _this.index_code,
					// fir_id: this.navItem.fir_id
				}, {
					refreshRecordList(data) { //子页面调用父页面需要的方法
						// _this.showLoading()
						// _this.pageobj0.loadFlag = 0
						// _this.pageobj0.canload = true
						// _this.pageobj0.page_number = 1
						// _this.getList0()
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
				// this.pageobj0.loadFlag = 0
				// this.pageobj0.canload = true
				// this.pageobj0.page_number = 1
				// this.getList0();
			},
		}
	}
</script>

<style>
	.card-line {
		text-align: center;
		font-size: 25px;
		color: red;
		font-weight: 500;
		margin-top: 15px;
		border-bottom: 1px solid green;
		width: 100px;
		margin-left: calc((100% - 100px)/2);
	}
</style>