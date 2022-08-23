<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='navItem' :personInfo='personInfo' text="查看批阅" :textClick="textClick"></mynavBar>
		<view style="padding:8px 15px 0;">
			<view class="title">{{navItem.name}}</view>
			<view style="font-size: 12px;text-align: right;color: #808080;margin-top: 5px;">
				{{navItem.create_time}}
			</view>
		</view>
		<view class="line"></view>
		<view style="padding:8px 15px 0;display: flex;justify-content: space-around;">
			<view class="charts-box">
			  <qiun-data-charts type="arcbar" :opts="scoreOpts" :chartData="score"/>
			</view>
		</view>
		<view style="padding:8px 5px 0;">
			<view style="height: 22px;width: 2px;background: #00baad;float: left;margin-right: 5px;"></view>
			<view style="font-size: 14px;color: gray;">各题得分详情</view>
		</view>
		<view class="line"></view>
		<view style="padding:0 5px;">
			<uni-row style="background: #e7e3e3;">
				<uni-col :span="6"><p class="scoreDetail">题型</p></uni-col>
				<uni-col :span="6"><p class="scoreDetail">题号</p></uni-col>
				<uni-col :span="7"><p class="scoreDetail">识别选项</p></uni-col>
				<uni-col :span="5"><p class="scoreDetail">得分</p></uni-col>
			</uni-row>
			<view v-for="(item,index) in scoreList" :key='index' style="margin-top: 5px;font-size: 13px;text-align: center;height: 25px;">
				<uni-row >
					<uni-col :span="6">{{item.question_title_name}}</uni-col>
					<uni-col :span="6">{{item.question_number}}</uni-col>
					<uni-col :span="7">{{(item.stu_answer_list && item.stu_answer_list.length>0)?item.stu_answer_list.join(','):'--'}}</uni-col>
					<uni-col :span="5">{{item.stu_score}}</uni-col>
				</uni-row>
				<view class="line"></view>
			</view>
		</view>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	import mynavBar from '@/components/my-navBar/m-navBar';
	let _this;
	export default {
		data() {
			return {
				index_code:'',
				personInfo: {},
				navItem: {},
				score:{},
				scoreOpts:{},
				scoreList:[],
				merge_file_path:[],
			}
		},
		components: {
			mynavBar
		},
		methods: {
			textClick(){
				console.log("this.merge_file_path: " + JSON.stringify(_this.merge_file_path));
				uni.previewImage({
					urls: _this.merge_file_path,
				});
			},
			getById(){//获取页面数据
				let comData={
					id: this.navItem.id, 
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_MARKINGPAPERS+'taskResult/getById',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					this.merge_file_path=response.result_file_list.map(item=>item.merge_file_path)
				})
			},
			getTaskResultDetail(){//获取页面数据
				let comData={
					result_id: this.navItem.id, //每页记录数
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_MARKINGPAPERS+'taskResultDetail',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					this.scoreList=response.list
				})
			}
		},
		onLoad(options) {
			_this = this;
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(options);
			itemData.index=100
			itemData.text='作业与周测成绩'
			this.navItem = itemData;
			this.index_code=itemData.index_code
			let that = this
			setTimeout(function() {
				that.score={series:[{name:"成绩",data:itemData.score?(itemData.score*1/(itemData.total_score)).toFixed(2):0,color:"#d43030"}]}
				that.scoreOpts={title:{name:itemData.score?itemData.score+' ':'0',fontSize:28,color:'#d43030'},subtitle:{name:'我的成绩',color:'#666666',fontSize:15}}
				that.getById();
				that.getTaskResultDetail();
			}, 500);
			//#ifdef H5
				document.title=""
			//#endif
		},
	}
</script>

<style>
	.scoreDetail {
		font-size: 11px;
		text-align: center;
		padding: 10px 0px;
		word-break: break-all;
	}
	.charts-box {
		width: 45%;
		height: 150px;
	}
	.select-line{
		height: 2px;
		background-color: #00CFBD;
		margin: 0 -15px;
	}
	 .slot-box {
	 	/* #ifndef APP-NVUE */
	 	display: flex;
	 	/* #endif */
	 	flex-direction: row;
	 	align-items: center;
	 }
	 
	 .content{
	 	margin: 2px 0;
	 }
	 .slot-text {
	 	flex: 1;
	 	font-size: 14px;
	 	margin-right: 10px;
	 }
	 
	 .line{
	 	height: 1px;
	 	background-color: #e5e5e5;
	 	margin: 5px;
	 }
	 .title{
		text-align: center;
		display: flex;
		justify-content: space-around;
		word-break: break-all;
	 }
	 .title-text{
		display: flex;
		align-items: center;
	 	overflow: hidden;
	 	text-overflow: ellipsis;
	 	white-space: nowrap;
	 }
	 
	 .detail-text{
	 	color: #939393;
	 	font-size: 13px;
	 	margin: 3px 0;
	 }
	 
	 .leaveType {
		 font-size:12px ;
	 	width: 48px;
	 	color: #EFAD44;
	 	padding:0px 3px;
	 	border-radius: 4px;
		margin-right: 3px;
	 	border: 1px solid #EFAD44;
	 }
	 
	 .uni-input-input{
		 font-size: 13px;
	 }
</style>
