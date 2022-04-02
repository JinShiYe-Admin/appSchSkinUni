<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo'></mynavBar>
		<view class="tabs-fixed" style="background-color: #FFFFFF;">
			<uni-row style="height: 35px;display: flex;align-items: center;">
				<uni-col class="mini-date" :span="8">
					<dy-Date :childValue='time' timeType="day" v-on:getData='timeSelect' :minSelect='startDate' :maxSelect='endDate'></dy-Date>
					<uni-icons style="padding-right: 3px;" size="13" type="arrowdown" color="#C2C7D6"></uni-icons>
				</uni-col>
			</uni-row>
			<!-- <view class="select-line"></view> -->
		</view>
		<view style="padding-top: 37px;">
			<uni-row style="">
				<uni-col class="rowClo" :span="7">
					记录数量：{{pagedata.length}}
				</uni-col>
				<uni-col class="rowClo" :span="8">
					
				</uni-col>
				<uni-col class="rowClo" :span="3">
					上午
				</uni-col>
				<uni-col class="rowClo" :span="3">
					下午
				</uni-col>
				<uni-col class="rowClo" :span="3">
					晚上
				</uni-col>
			</uni-row>
			<view class="select-line" style="background-color: #a6a6a6;margin-top: 5px;"></view>
			<uni-row style="" v-for="(model,index) in pagedata" :key='index'>
				<uni-col class="rowName" :span="7">
					{{model.stu_name}}
				</uni-col>
				<uni-col class="rowClass" :span="8">
					{{model.grd_name}} {{model.cls_name}}
				</uni-col>
				<uni-col :class="model.morning>=37.2||model.morning<=36?'rowTiwenRed':'rowTiwenBlack'" :span="3">
					{{model.morning}}
				</uni-col>
				<uni-col :class="model.afternoon>=37.2||model.afternoon<=36?'rowTiwenRed':'rowTiwenBlack'" :span="3">
					{{model.afternoon}}
				</uni-col>
				<uni-col :class="(model.evening>=37.2||model.evening<=36)?'rowTiwenRed':'rowTiwenBlack'" :span="3">
					{{model.evening}}
				</uni-col>
				<view class="row-line"></view>
			</uni-row>
			<view v-if="tabBarItem.flag == 0" class="tiwenFlag">注：低体温学生指体温低于或者等于36°C的学生。</view>
			<view v-if="tabBarItem.flag == 1" class="tiwenFlag">注：高体温学生指体温达到或者超过37.2°C的学生。</view>
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
				pagedata:[],
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
			timeSelect(e){
				this.time=e;
				this.showLoading();
				this.getList0();
			},
			getList0(){//获取页面数据
				let comData={
					take_date: this.time.replace(/-/g, ''), //测量日期
					index_code: this.index_code,
					type:this.tabBarItem.flag,
				}
				// 查询体温监控报告
				this.post(this.globaData.INTERFACE_TWJK_TEA+'temperature/abnormal',comData,response=>{
					this.hideLoading();
					this.pagedata = [].concat(response.list);
				})
			},
		},
		onLoad(options) {
			this.personInfo = util.getPersonal();
			var itemData = util.getPageData(options);
			console.log('itemData:'+JSON.stringify(itemData));
			itemData.index=100;
			if(itemData.flag == 1){
				itemData.text = '高体温学生名单';
			}else{
				itemData.text = '低体温学生名单';
			}
			this.tabBarItem = itemData;
			this.index_code = itemData.index_code;
			this.time = itemData.time;
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
	
	.row-line{
		height: 0.5px;
		background-color: #e0dddd;
		/* margin: 0 -15px; */
		margin-top: 44px;
		margin-left: 10px;
	}
	
	.rowClo{
		text-align: center;
		margin-top: 15px;
		font-size: 12px;
		color: #505050;
	}
	
	.rowName{
		text-align: center;
		margin-top: 15px;
		font-size: 15px;
		color: #000000;
	}
	
	.rowClass{
		text-align: center;
		margin-top: 15px;
		font-size: 12px;
		color: #808080;
	}
	
	.rowTiwenRed{
		text-align: center;
		margin-top: 15px;
		font-size: 16px;
		color: #d43030;
	}
	
	.rowTiwenBlack{
		text-align: center;
		margin-top: 15px;
		font-size: 16px;
		color: #505050;
	}
	
	.tiwenFlag{
		margin: 20px 0 0 10px;
		padding-bottom: 10px;
		font-size: 11px;
		color: #505050;
	}
</style>
