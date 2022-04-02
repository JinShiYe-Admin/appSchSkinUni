<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo'></mynavBar>
		<view class="tabs-fixed" style="background-color: #FFFFFF;">
			<uni-row style="height: 35px;display: flex;align-items: center;">
				<uni-col class="mini-date" :span="8">
					<dy-Date :childValue='endDate' timeType="day" v-on:getData='timeSelect' :minSelect='startDate' :maxSelect='endDate'></dy-Date>
					<uni-icons style="padding-right: 3px;" size="13" type="arrowdown" color="#C2C7D6"></uni-icons>
				</uni-col>
			</uni-row>
			<view class="select-line"></view>
		</view>
		<view style="padding-top: 37px;">
			<!-- <h5 style='text-align: center;margin-top: 10px;font-size: 15px;'>学生体温监控报告</h5> -->
			<p class="sumCount">学生总人数：{{pageModel.total}}</p>
			<uni-row style="">
				<uni-col style="margin-top: 20px;" :span="12">
					<view class="charts-box" style="width: 100px;height: 100px;text-align: center;" @click='iconClick(1)'>
						<qiun-data-charts type="arcbar" :opts="pageModel.highShow" :animation="false"
							:chartData="pageModel.highDFL" />
					</view>
					<p class="highLow">高体温人数及占比 ></p>
				</uni-col>
				<uni-col style="margin-top: 20px;" :span="12">
					<view class="charts-box" style="width: 100px;height: 100px;text-align: center;" @click='iconClick(0)'>
						<qiun-data-charts type="arcbar" :opts="pageModel.lowShow" :animation="false"
							:chartData="pageModel.lowDFL" />
					</view>
					<p class="highLow">低体温人数及占比 ></p>
				</uni-col>
				<uni-col style="margin-top: 30px;" :span="8">
					<view class="charts-box" style="width: 100px;height: 100px;text-align: center;">
						<qiun-data-charts type="arcbar" :opts="pageModel.amShow" :animation="false"
							:chartData="pageModel.amDFL" />
					</view>
					<p class="ampmhight">上午体温</p>
					<p class="ampmhight">已上报人数及占比</p>
				</uni-col>
				<uni-col style="margin-top: 30px;" :span="8">
					<view class="charts-box" style="width: 100px;height: 100px;text-align: center;">
						<qiun-data-charts type="arcbar" :opts="pageModel.pmShow" :animation="false"
							:chartData="pageModel.pmDFL" />
					</view>
					<p class="ampmhight">下午体温</p>
					<p class="ampmhight">已上报人数及占比</p>
				</uni-col>
				<uni-col style="margin-top: 30px;" :span="8">
					<view class="charts-box" style="width: 100px;height: 100px;text-align: center;">
						<qiun-data-charts type="arcbar" :opts="pageModel.nightShow" :animation="false"
							:chartData="pageModel.nightDFL" />
					</view>
					<p class="ampmhight">晚上体温</p>
					<p class="ampmhight">已上报人数及占比</p>
				</uni-col>
			</uni-row>
		</view>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	export default {
		data() {
			return {
				index_code:'',
				personInfo: {},
				tabBarItem: {},
				pageModel:{},
				//顶部筛选框相关内容
				time:this.moment().format('YYYY-MM-DD'),
				startDate:'2020-01-01',
				endDate:this.moment().format('YYYY-MM-DD')
			}
		},
		components: {
			mynavBar
		},
		methods: {
			iconClick(flag){
				var tempModel = {
					index_code:this.index_code,
					flag:flag,
					time:this.time
				}
				util.openwithData('/pages/studentTemperature/jianKongBaoGaoList',tempModel);
			},
			timeSelect(e){
				this.time=e;
				this.showLoading();
				this.getList0();
			},
			getList0(){//获取页面数据
				let comData={
					take_date: this.time.replace(/-/g, ''), //测量日期
					index_code: this.index_code,
				}
				// 查询体温监控报告
				this.post(this.globaData.INTERFACE_TWJK_TEA+'temperature/report',comData,response=>{
					this.hideLoading();
					var tempDFL = {
						"series": [{
							"name": "",
							"data": parseFloat((response.high_per ? response.high_per : 0) / 100).toFixed(1),
							"color": "#00CFBD"
						}]
					};
					response.highDFL = JSON.parse(JSON.stringify(tempDFL));
					response.highDFL.series[0].color = '#e33c64';
					
					response.lowDFL = JSON.parse(JSON.stringify(tempDFL));
					response.lowDFL.series[0].data = parseFloat((response.low_per ? response.low_per : 0) / 100).toFixed(1);
					response.lowDFL.series[0].color = '#ff8d1a';
					
					response.amDFL = JSON.parse(JSON.stringify(tempDFL));
					response.amDFL.series[0].data = parseFloat((response.am_per ? response.am_per : 0) / 100).toFixed(1);
					
					response.pmDFL = JSON.parse(JSON.stringify(tempDFL));
					response.pmDFL.series[0].data = parseFloat((response.pm_per ? response.pm_per : 0) / 100).toFixed(1);
					
					response.nightDFL = JSON.parse(JSON.stringify(tempDFL));
					response.nightDFL.series[0].data = parseFloat((response.night_per ? response.night_per : 0) / 100).toFixed(1);
					
					var tempShow = {
						title: {
							name: parseFloat(response.high_per).toFixed(1)+'%',
							fontSize: 15,
							color: '#00CFBD'
						},
						subtitle: {
							name: response.high_count+'人',
							color: '#666666',
							fontSize: 11
						},
						extra: {
							arcbar: {
								width: '5',
								type: "circle",
								startAngle: 0.5,
								endAngle: 0.5,
							}
						}
					};
					response.highShow = JSON.parse(JSON.stringify(tempShow));
					response.highShow.title.color = '#e33c64';
					
					response.lowShow = JSON.parse(JSON.stringify(tempShow));
					response.lowShow.title.name = parseFloat(response.low_per).toFixed(1)+'%';
					response.lowShow.subtitle.name = response.low_count+'人';
					response.lowShow.title.color = '#ff8d1a';
					
					response.amShow = JSON.parse(JSON.stringify(tempShow));
					response.amShow.title.name = parseFloat(response.am_per).toFixed(1)+'%';
					response.amShow.subtitle.name = response.am_count+'人';
					
					response.pmShow = JSON.parse(JSON.stringify(tempShow));
					response.pmShow.title.name = parseFloat(response.pm_per).toFixed(1)+'%';
					response.pmShow.subtitle.name = response.pm_count+'人';
					
					response.nightShow = JSON.parse(JSON.stringify(tempShow));
					response.nightShow.title.name = parseFloat(response.night_per).toFixed(1)+'%';
					response.nightShow.subtitle.name = response.night_count+'人';
					this.pageModel = response;
				})
			},
		},
		onLoad(options) {
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(options);
			itemData.index=100
			this.tabBarItem = itemData;
			this.index_code=itemData.access.split("#")[1];
			this.getList0();
			//#ifndef APP-PLUS
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
				//#ifndef APP-PLUS
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
	.select-line{
		height: 2px;
		background-color: #00CFBD;
		margin: 0 -15px;
	}
	
	.sumCount {
		text-align: center;
		margin-top: 30px;
		font-size: 14px;
	}
	
	::v-deep .uni-col-12 {
	    padding-left: 12.5% !important;
	}
	
	::v-deep .uni-col-8 {
	    padding-left: 3.5% !important;
	}
	
	.highLow{
		margin-left: -25% !important;
		font-size: 12px;
		text-align: center;
	}
	
	.ampmhight{
		margin-left: -7% !important;
		font-size: 12px;
		text-align: center;
	}
</style>
