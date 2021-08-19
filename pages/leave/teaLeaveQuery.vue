<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo'></mynavBar>
		<view class="tabs-fixed">
			<uni-row>
				<uni-col :span="8">
					<picker class="flex-box" @change="grdClick" :value="grdIndex" :range="grdArray" range-key="text">
						<uni-easyinput-select  :inputBorder="false" suffixIcon="arrowdown" disabled :value="grdArray[grdIndex].text" ></uni-easyinput-select>
					</picker>
				</uni-col>
				<uni-col :span="8">
					<picker class="flex-box" @change="clsClick" :value="clsIndex" :range="clsArray" range-key="text">
						<uni-easyinput-select  :inputBorder="false" suffixIcon="arrowdown" disabled :value="clsArray[clsIndex].text" ></uni-easyinput-select>
					</picker>
				</uni-col>
				<uni-col :span="8">
					<picker class="flex-box" @change="stusClick" :value="stusIndex" :range="stusArray" range-key="text">
						<uni-easyinput-select  :inputBorder="false" suffixIcon="arrowdown" disabled :value="stusArray[stusIndex].text" ></uni-easyinput-select>
					</picker>
				</uni-col>
			</uni-row>
			<view class="select-line"></view>
			<view class="uni-flex">
				<uni-datetime-picker style="width: 100%;padding: 0 30px;" v-model="datetimerange" :border="false" type="daterange" rangeSeparator="至" />
			</view>
		</view>
		<view>
			<view style="padding-top: 85px;">
				<uni-list :border="false">
					<uni-list-item showArrow :key="index" v-for="(item,index) in pagedata1" :border="true">
						<text slot="body" class="slot-box slot-text" @click="toDetails(item)">
							<uni-row>
								<uni-col :span="24"><view class="title-text">{{item.comment?item.comment:'暂无内容'}}</view></uni-col>
								<uni-col :span="24"><view class="detail-text">{{item.begintime}} ~ {{item.endtime}}</view></uni-col>
								<uni-col :span="20"><view class="detail-text">{{item.grd_name}} {{item.cls_name}}&ensp;{{item.stu_name}}</view></uni-col>
								<uni-col :span="4"><view class="detail-text leaveType">{{item.item_code=='sickLeave'?'病假':item.item_code=='absenceLeave'?'事假':''}}</view></uni-col>
							</uni-row>
						</text>
					</uni-list-item>
				</uni-list>
				<uni-load-more :status="pageobj1.status" :icon-size="17" :content-text="pageobj1.contentText" />
			</view>
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
				
				pageobj1:{
					loadFlag:0,//0 刷新 1加载更多
					page_number:1,//页码
					status:'more',//加载更多的状态
					contentText: {
						contentdown: '',//上滑加载更多
						contentrefresh: '加载中',
						contentnomore: ''//没有更多
					},
					canload:true,//是否加载更多
				},
				pagedata1:[],
				datetimerange: [this.moment().subtract(7,'days').format('YYYY-MM-DD'), this.moment().format('YYYY-MM-DD')],
				page_number:1,//页码
				//顶部筛选框相关内容
				grdIndex:0,
				clsIndex:0,
				stusIndex:0,
				grdArray: [{name:'',value:''}],
				clsArray: [{sub_name:'',sub_code:''}],
				stusArray: [{name:'',value:''}],
			}
		},
		methods: {
			grdClick:function(e){
				if(this.grdIndex!==e.detail.value){
					 this.grdIndex=e.detail.value
					 this.clsIndex=0
					 this.stusIndex=0
					 this.showLoading()
					 this.pageobj1.loadFlag=0
					 this.pageobj1.canload=true
					 this.pageobj1.page_number=1
					 this.getCls();
				}
			},
			clsClick:function(e){
				if(this.clsIndex!==e.detail.value){
					 this.clsIndex=e.detail.value
					 this.stusIndex=0
					 this.showLoading()
					 this.pageobj1.loadFlag=0
					 this.pageobj1.canload=true
					 this.pageobj1.page_number=1
					 this.getStus();
				}
			},
			stusClick:function(e){
				if(this.stusIndex!==e.detail.value){
					 this.stusIndex=e.detail.value
					 this.showLoading()
					 this.pageobj1.loadFlag=0
					 this.pageobj1.canload=true
					 this.pageobj1.page_number=1
					 this.getList1();
				}
			},
			getGrd(){//获取年级
				let comData={
					op_code:'index',
					get_grd:true,
					all_grd: true,
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB+'acl/dataRange',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					this.hideLoading()
					let grds = response.grd_list;
					let grdArray=[];
					grds.map(function(currentValue) {
						let name=currentValue.name.indexOf('全部')==-1?currentValue.name:'全部年级';
						let obj = {};
						obj.value = currentValue.value;
						obj.text = name;
						grdArray.push(obj)
					})
					if(grdArray.length>0 ){
						this.grdArray=grdArray;
						this.getCls();
					}else{ 
						this.grdArray=[];
						this.showToast('无数据授权 无法获取年级');
					}
				})
			},
			getCls(){//获取班级
				let comData={
					op_code:'index',
					grd_code:this.grdArray[this.grdIndex].value,
					get_cls:true,
					all_cls:true,
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB+'acl/dataRange',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					this.hideLoading()
					let clss = response.cls_list;
					let clsArray=[];
					clss.map(function(currentValue) {
						let obj = {};
						let name=currentValue.name.indexOf('全部')==-1?currentValue.name:'全部班级';
						obj.value = currentValue.value;
						obj.text = name;
						clsArray.push(obj)
					})
					if(clsArray.length>0 ){
						this.clsArray=clsArray;
						this.getStus();
					}else{
						this.clsArray=[];
						this.showToast('无数据授权 无法获取班级');
					}
				})
			},
			getStus(){//获取学生
				let comData={
					op_code:'index',
					grd_code: this.grdArray[this.grdIndex].value,
					cls_code: this.clsArray[this.clsIndex].value,
					get_stu:true,
					all_stu:true,
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB+'acl/dataRange',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					this.hideLoading()
					let stu = response.stu_list;
					let stusArray=[];
					stu.map(function(currentValue) {
						let obj = {};
						let name=currentValue.name!=='全部'?currentValue.name:'全部学生';
						obj.value = currentValue.value;
						obj.text = name;
						stusArray.push(obj)
					})
					if(stusArray.length>0 ){
						this.stusArray=stusArray;
						this.getList1()
					}else{
						this.stusArray=[];
						this.showToast('无数据授权 无法获取学生');
					}
				})
			},
			getList1(){//获取页面数据
				let comData={
					grd_code: this.grdArray[this.grdIndex].value,
					cls_code: this.clsArray[this.clsIndex].value,
					stu_code: this.stusArray[this.stusIndex].value,
					item_code:'',
					begintime:this.datetimerange[0]+' 00:00:00',
					endtime:this.datetimerange[1]+' 23:59:59',
					pageNumber: this.page_number, //当前页数
					pageSize: 10, //每页记录数
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_WORK+'LeaveRecord/list',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					setTimeout(function () {
						uni.stopPullDownRefresh();
					}, 1000);
					this.hideLoading()
					if(this.pageobj1.loadFlag===0){
						this.pagedata1=[].concat(response.list)
					}else{
						this.pagedata1=this.pagedata1.concat(response.list)
					}
					if(this.pageobj1.page_number>=response.total_page){
						this.pageobj1.status = 'noMore';
						this.pageobj1.canload=false
					}else{
						this.pageobj1.status = 'more';
					}
				})
			},
			toDetails(item){
				item.index_code=this.index_code
				util.openwithData('/pages/leave/teaLeaveQuery_Detail',item)
			}
		},
		watch: {
			datetimerange(newval) {
				this.getList1();
			}
		},
		components: {
			mynavBar
		},
		onLoad(options) {
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(options);
			itemData.index=100
			itemData.title=itemData.name
			this.tabBarItem = itemData;
			this.index_code=itemData.access.split("#")[1]
			setTimeout(()=>{
				this.showLoading()
				this.getGrd()
			},100)
			//#ifndef APP-PLUS
				document.title=""
			//#endif
		},
		onPullDownRefresh() {
			this.pageobj1.loadFlag=0
			this.pageobj1.canload=true
			this.pageobj1.page_number=1
			this.getList1()
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 5000);
		},
		onReachBottom() {
			if(this.pageobj1.canload){
				this.pageobj1.loadFlag=1
				this.pageobj1.status = 'loading';
				this.pageobj1.page_number=this.pageobj1.page_number+1
				this.getList1()
			}
			 
		},
	}
</script>

<style>
	.select-line{
		height: 2px;
		background-color: #00CFBD;
		margin: 0 -15px;
	}
	
	.uni-flex{
		border-bottom:1px solid rgba(240,240,240,0.4);
		justify-content: space-evenly;
		margin: 0 -5px 0 -3px;
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
	 	margin: 5px 0;
	 }
	 
	 .title-text{
	 	width: 80vw;
	 	overflow: hidden;
	 	text-overflow: ellipsis;
	 	white-space: nowrap;
	 }
	 
	 .detail-text{
	 	color: #939393;
	 	font-size: 12px;
	 	margin: 3px 0;
	 }
	 
	 .leaveType {
	 	width: 26px;
	 	color: #2A82E4;
	 	padding:0px 3px;
	 	border-radius: 4px;
	 	border: 1px solid #2A82E4;
	 }
	  
</style>
