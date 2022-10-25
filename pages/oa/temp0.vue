<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo'></mynavBar>
		<view class="tabs-fixed" style="background-color: #FFFFFF;">
			<uni-row style="height: 35px;display: flex;align-items: center;margin-left: 20px;">
				<uni-col class="mini-date" :span="20">
					少时诵诗书所所所所所
					<uni-icons style="padding-right: 3px;" size="13" type="arrowdown" color="#C2C7D6"></uni-icons>
				</uni-col>
			</uni-row>
			<view class="select-line"></view>
		</view>
		<view style="padding-top: 37px;background-color: cornsilk;">
			<view style="text-align: center;font-size: 14px;font-weight: 600;margin-top: 10px;">2201班 无无无 20220000
			</view>
			<uni-card>
				<view class="cardTitle">学科学习目标</view>
				<p class='sumPing'>B</p>
				<view style="text-align: center;font-size: 13px;font-weight: 600;margin-top: 5px;margin-left: 5px;">成绩总评
				</view>
				<uni-row>
					<uni-col :span="8">
						<p class="scoreDetail">语文：<span style='color: #bd3124;font-size: 16px;'>A</span>
						</p>
					</uni-col>
					<uni-col :span="8">
						<p class="scoreDetail">语文：<span style='color: #bd3124;font-size: 16px;'>A</span>
						</p>
					</uni-col>
					<uni-col :span="8">
						<p class="scoreDetail">语文：<span style='color: #bd3124;font-size: 16px;'>A</span>
						</p>
					</uni-col>
					<uni-col :span="8">
						<p class="scoreDetail">语文：<span style='color: #bd3124;font-size: 16px;'>A</span>
						</p>
					</uni-col>
				</uni-row>
			</uni-card>
			<uni-card>
				<view class="cardTitle">综合实践活动</view>
				<uni-row>
					<uni-col :span="8">
						<p class="scoreDetail" style='font-size: 12px;'><span
								style='color: #bd3124;font-size: 18px;'>A</span>/10学时
						</p>
						<view class="partB">研究性学习</view>
					</uni-col>
					<uni-col :span="8">
						<p class="scoreDetail" style='font-size: 12px;'><span
								style='color: #bd3124;font-size: 18px;'>A</span>/10学时
						</p>
						<view class="partB">研究性学习</view>
					</uni-col>
					<uni-col :span="8">
						<p class="scoreDetail" style='font-size: 12px;'><span
								style='color: #bd3124;font-size: 18px;'>A</span>/10学时
						</p>
						<view class="partB">研究性学习</view>
					</uni-col>
					<uni-col :span="8">
						<p class="scoreDetail" style='font-size: 12px;'><span
								style='color: #bd3124;font-size: 18px;'>A</span>/10学时
						</p>
						<view class="partB">研究性学习</view>
					</uni-col>
				</uni-row>
			</uni-card>
			<uni-card>
				<view class="cardTitle">基础性发展目标</view>
				<uni-row>
					<uni-col :span="8">
						<p class="scoreDetail">语文：<span style='color: #bd3124;font-size: 16px;'>A</span>
						</p>
					</uni-col>
					<uni-col :span="8">
						<p class="scoreDetail">语文：<span style='color: #bd3124;font-size: 16px;'>A</span>
						</p>
					</uni-col>
					<uni-col :span="8">
						<p class="scoreDetail">语文：<span style='color: #bd3124;font-size: 16px;'>A</span>
						</p>
					</uni-col>
					<uni-col :span="8">
						<p class="scoreDetail">语文：<span style='color: #bd3124;font-size: 16px;'>A</span>
						</p>
					</uni-col>
				</uni-row>
				<view class="cardTitle" style="font-size: 14px;margin-top: 10px;">综合性评语：</view>
				<view style="font-size: 14px;margin-top: 5px;">综合性评语综合性评语综合性评语综合性评语综合性评语综合性评语综合性评语综合性评语综合性评语综合性评语综合性评语综合性评语综合性评语综合性评语综合性评语综合性评语综合性评语综合性评语综合性评语综合性评语综合性评语综合性评语</view>
			</uni-card>
			<view style="height: 10px;"></view>
		</view>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	export default {
		data() {
			return {
				index_code: '',
				personInfo: {},
				navItem: {},
				pageModel: {},
				//顶部筛选框相关内容
			}
		},
		components: {
			mynavBar
		},
		methods: {
			getList0() { //获取页面数据
				let comData = {
					take_date: this.time.replace(/-/g, ''), //测量日期
					index_code: this.index_code,
				}
				// 查询体温监控报告
				this.post(this.globaData.INTERFACE_TWJK_TEA + 'temperature/report', comData, response => {
					this.hideLoading();
					var tempDFL = {
						"series": [{
							"name": "",
							"data": parseFloat((response.high_per ? response.high_per : 0) / 100)
								.toFixed(1),
							"color": "#00CFBD"
						}]
					};
					response.highDFL = JSON.parse(JSON.stringify(tempDFL));
					response.highDFL.series[0].color = '#e33c64';

					response.lowDFL = JSON.parse(JSON.stringify(tempDFL));
					response.lowDFL.series[0].data = parseFloat((response.low_per ? response.low_per : 0) / 100)
						.toFixed(1);
					response.lowDFL.series[0].color = '#ff8d1a';

					response.amDFL = JSON.parse(JSON.stringify(tempDFL));
					response.amDFL.series[0].data = parseFloat((response.am_per ? response.am_per : 0) / 100)
						.toFixed(1);

					response.pmDFL = JSON.parse(JSON.stringify(tempDFL));
					response.pmDFL.series[0].data = parseFloat((response.pm_per ? response.pm_per : 0) / 100)
						.toFixed(1);

					response.nightDFL = JSON.parse(JSON.stringify(tempDFL));
					response.nightDFL.series[0].data = parseFloat((response.night_per ? response.night_per : 0) /
						100).toFixed(1);

					var tempShow = {
						title: {
							name: parseFloat(response.high_per).toFixed(1) + '%',
							fontSize: 15,
							color: '#00CFBD'
						},
						subtitle: {
							name: response.high_count + '人',
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
					response.lowShow.title.name = parseFloat(response.low_per).toFixed(1) + '%';
					response.lowShow.subtitle.name = response.low_count + '人';
					response.lowShow.title.color = '#ff8d1a';

					response.amShow = JSON.parse(JSON.stringify(tempShow));
					response.amShow.title.name = parseFloat(response.am_per).toFixed(1) + '%';
					response.amShow.subtitle.name = response.am_count + '人';

					response.pmShow = JSON.parse(JSON.stringify(tempShow));
					response.pmShow.title.name = parseFloat(response.pm_per).toFixed(1) + '%';
					response.pmShow.subtitle.name = response.pm_count + '人';

					response.nightShow = JSON.parse(JSON.stringify(tempShow));
					response.nightShow.title.name = parseFloat(response.night_per).toFixed(1) + '%';
					response.nightShow.subtitle.name = response.night_count + '人';
					this.pageModel = response;
				})
			},
		},
		onLoad(options) {
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(options);
			itemData.index = 100
			this.navItem = itemData;
			this.index_code = itemData.access.split("#")[1];
			// this.getList0();
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
	.select-line {
		height: 2px;
		background-color: #00CFBD;
		margin: 0 -15px;
	}

	::v-deep .uni-card {
		margin: 12px 5px;
	}

	.sumPing {
		margin-left: calc((100% - 50px)/2);
		color: brown;
		text-align: center;
		font-size: 30px;
		font-weight: 600;
		border: 1px green solid;
		width: 50px;
		height: 50px;
		border-radius: 50%;
		padding: 5px 5px 0;
	}

	.scoreDetail {
		font-size: 14px;
		/* text-align: center; */
		margin-top: 5px;
		margin-bottom: 5px;
	}

	.cardTitle {
		font-size: 16px;
		font-weight: 600;
	}

	.partB {
		font-size: 14px;
		font-weight: 600;
	}
</style>
