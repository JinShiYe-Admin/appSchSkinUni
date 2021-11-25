<template>
	<view>
		<view style="padding: 0 15px;">
			<view class="detail-text" style="margin-top: 5px;">居住性别:{{stu_sex_text}}</view>
		</view>
		<view class="double-line" style="margin-top: 5px;"></view>
		<view style="padding: 0 15px;">
			<view class="title-text" style="margin-top: 5px;">管理员</view>
			<view class="line" style="margin-top: 5px;"></view>
			<view :key="index" v-for="(model,index) in officer">
				<view class="detail-text" style="margin-top: 5px;">姓名:{{model[0]}}</view>
				<view class="detail-text" style="margin-top: 5px;">电话:{{model[1]}}</view>
			</view>
		</view>
		<view class="double-line" style="margin-top: 5px;"></view>
		<view style="padding: 0 15px;">
			<view class="title-text" style="margin-top: 5px;">房间信息</view>
			<view class="line" style="margin-top: 5px;"></view>
			<view :key="index" v-for="(model,index) in room_array">
				<view class="detail-text" style="margin-top: 5px;">房间名:{{model.room_name}}</view>
				<view class="detail-text" style="margin-top: 5px;">床位数:{{model.bed_nums}}</view>
			</view>
		</view>
		<view class="double-line" style="margin-top: 5px;"></view>
		<view style="padding: 0 15px;">
			<view class="title-text" style="margin-top: 5px;">备注</view>
			<view class="detail-text" style="margin-top: 5px;">{{remark==''?remark:'无'}}</view>
		</view>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	export default {
		data() {
			return {
				index_code:'',
				itemData: {},
				stu_sex_text: '', //性别名称
				officer:[],//管理员
				room_array:[],//房间信息
				remark:'',//备注
			}
		},
		methods: {
			getPage(){
				const params = {
					dorm_name:this.itemData.dorm_name,
					floor_num: this.itemData.floor_num,
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_DORM+'dorm/floorDetail',params,response2=>{
					console.log("response2: " + JSON.stringify(response2));
					this.hideLoading()
					this.stu_sex_text = response2.stu_sex_text
					this.officer =response2.officer 
					this.room_array = response2.room_array 
					this.remark = response2.remark 
				})
			},
		},
		onLoad(options) {
			const itemData = util.getPageData(options);
			this.index_code=itemData.index_code
			this.itemData=itemData
			setTimeout(()=>{
				 this.showLoading()
				 this.getPage()
			},100)
			uni.setNavigationBarTitle({title:itemData.dorm_name+itemData.floor_num+'层'});
			//#ifndef APP-PLUS
				document.title=""
			//#endif
		},
		onShow(){//解决IOS端列表进详情返回后不能定位到点击位置的问题
			//#ifndef APP-PLUS
				document.title=""
			//#endif
		},
	}
</script>

<style>
	::v-deep .uni-list-item__container{
		padding: 0 !important;
	}
	.select-line{
		height: 2px;
		background-color: #00CFBD;
		margin: 0 -15px;
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
