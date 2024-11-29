<template>
	<view style="background: #f2f2f2;">
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo'></mynavBar>
		<view class="riliView">
			<custom-calendar ref="riliCustom" :yearMonth="tempValue" :dataSource="defaultDate"
				@dateChange="getData"></custom-calendar>
			<view class="flexEnd riliType">
				<view class="view0 flexStart">
					<view class="bgView0"></view>
					<view class="bgCont">已过期</view>
				</view>
				<view class="view1 flexStart">
					<view class="bgView1"></view>
					<view class="bgCont">值日日期</view>
				</view>
			</view>
		</view>
		<view class="zhiriCont">
			<view class="flexStart">
				<view class="typeTitle">所在值日组：</view>
				<view class="typeCont">{{pageData.group_names}}</view>
			</view>
			<view class="flexStart">
				<view class="typeTitle">负责的班级：</view>
				<view class="typeCont">{{pageData.cls_names}}</view>
			</view>
			<view class="flexStart">
				<view class="typeTitle">负责的项目：</view>
				<view class="typeCont">
					<view class="content" v-for="(item,index) in pageData.item_list">{{index+1}}.{{item.name}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	import riliCustom from '@/components/custom-calendar/custom-calendar';
	import moment from 'moment/moment.js';
	export default {
		data() {
			return {
				index_code: '',
				personInfo: {},
				navItem: {},
				defaultDate:[],
				year:'',
				month:'',
				tempValue:'',
				pageData:{}
			}
		},
		components: {
			mynavBar,riliCustom
		},
		onLoad(options) {
			this.personInfo = util.getPersonal();
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			this.navItem = util.getPageData(options);
			this.navItem.index = 100;
			// this.navItem.text = '在线缴费';
			this.index_code = this.navItem.access.split("#")[1];
			console.log('this.navItem:' + JSON.stringify(this.navItem));
			let currentDate = new Date();
			this.year = currentDate.getFullYear(); // 获取年份
			this.month = currentDate.getMonth() + 1; // 获取月份（注意需要加1，因为月份是从0开始的）
			this.tempValue = this.year + '-' + this.month
			// console.log('this.year:'+this.year)
			// console.log('this.month:'+this.month)
			// console.log('this.tempValue:'+this.tempValue)
			this.defaultDate = []
			// this.getPageList();
			//#ifdef H5
			document.title = ""
			//#endif
		},
		methods: {
			getData(value) {
				this.getPageData(value)
			},
			getPageData(item){
				let comData = {
					user_code: this.personInfo.user_code,
					begin_date: item.beginT,
					end_date: item.endT,
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_BJLHKP + 'kpDutyDay/myDuty', comData, (data0, data) => {
					this.hideLoading()
					if (data.code == 0) {
						this.pageData = data.data
						let tempArray = []
						for (var i = 0; i < data.data.day_list.length; i++) {
							var tempM = data.data.day_list[i]
							tempArray.push(tempM)
						}
						this.defaultDate = tempArray
					} else {
						this.showToast(data.msg);
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.riliView{
	background: white;
	border-radius: 0 0 10px 10px;
}
.riliType{
	margin: 0 10px 10px 0;
	.view0{
		margin-right: 20px;
		margin-bottom: 10px;
		.bgView0{
			width: 15px;
			height: 15px;
			background:  #d7d7d7;
		}
		.bgCont{
			margin: -1px 0 0 3px;
			font-size: 12px;
		}
	}
	.view1{
		.bgView1{
			width: 15px;
			height: 15px;
			background:  #00cfbd;
		}
		.bgCont{
			margin: -1px 0 0 3px;
			font-size: 12px;
		}
	}
}

.zhiriCont{
	background: white;
	border-radius: 10px;
	margin: 5px 0 20px 0;
	padding: 10px;
	font-size: 14px;
	.typeTitle{
		margin-top: 5px;
		color: #7f7f7f;
		white-space: nowrap;
	}
	.typeCont{
		margin-top: 5px;
		color: #333333;
		word-break: break-all;
		
		.content{
			margin-bottom: 5px;
		}
	}
}
</style>