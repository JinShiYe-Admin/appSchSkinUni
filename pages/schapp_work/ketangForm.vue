<template>
	<view>
		<view class="tabs-fixed" style="background-color: #FFFFFF;">
			<view style="display: flex;">
				<picker style="flex: 1;"  @change="grdClick" :value="grdIndex" :range="grdArray" range-key="text">
					<view style="font-size: 13px;color: #7f7f7f;text-align: center;padding: 10px 0;">
						{{grdArray[grdIndex].text}}
						<uni-icons style="float: right;margin-right: 10px;margin-top: 2px;" type="bottom" color='#7f7f7f' size="14"></uni-icons>
					</view>
				</picker>
				<view class="mini-date" style="flex: 1;">
					<dy-Date :childValue='endDate' timeType="day" v-on:getData='timeSelect' :minSelect='startDate' :maxSelect='endDate'></dy-Date>
					<uni-icons style="padding-right: 3px;" size="13" type="arrowdown" color="#C2C7D6"></uni-icons>
				</view>
				<picker style="flex: 1;"  @change="jcClick" :value="jcIndex" :range="jcArray" range-key="text">
					<view style="font-size: 13px;color: #7f7f7f;text-align: center;padding: 10px 0;">
						{{jcArray[jcIndex].text}}
						<uni-icons style="float: right;margin-right: 10px;margin-top: 2px;" type="bottom" color='#7f7f7f' size="14"></uni-icons>
					</view>
				</picker>
			</view>
			<view class="select-line"></view>
		</view>
		<view style="padding-top: 40px;">
			<uni-list :border="false">
				<uni-list-item :border="true">
					<view slot="body" class="slot-box slot-text">
						<uni-row>
							<uni-col :span="7"><view class="title-text-total">{{listTotal.row_name}}:{{listTotal.people_num}} 人</view></uni-col>
							<uni-col v-if="pagedata.length>0" :span="17"><view class="detail-text"  style="text-align: right;">{{pagedata[0].section}}({{pagedata[0].time_range}})</view></uni-col>
							<template v-for="(item,index) in listTotal.kqxxList">
								<uni-col :key="index" :span="8"><view class="detail-text">{{item.name}}:{{item.value}} 人</view></uni-col>
							</template>
						</uni-row>
					</view>
				</uni-list-item>
			</uni-list>
			<view v-if="listTotal.kqxxList" class="double-line"></view>
			<uni-list :border="false">
				<uni-list-item  :key="index" v-for="(model,index) in pagedata" :border="true">
					<view slot="body" class="slot-box slot-text">
						<uni-row>
							<uni-col :span="24"><view class="title-text">{{model.grd_name}}&ensp;{{model.class_name}}({{model.people_num}}人)</view></uni-col>
							<uni-col :span="8"><view class="detail-text">是否点名:{{model.is_roll_call}}</view></uni-col>
							<template v-for="(item,index2) in model.kqxxList">
								<uni-col :key="index2" :span="8"><view class="detail-text">{{item.name}}:{{item.value}} 人</view></uni-col>
							</template>
							
						</uni-row>
					</view>
				</uni-list-item>
			</uni-list>
			<uni-load-more :status="pageobj0.status" :icon-size="17" :content-text="pageobj0.contentText" />
		</view>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	export default {
		data() {
			return {
				index_code:'',
				pageSize:15,
				pageobj0:{
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
				pagedata:[],
				listTotal:{},//统计数据
				//顶部筛选框相关内容
				grdIndex:0,
				jcIndex:0,
				time:this.moment().format('YYYY-MM-DD'),
				grdArray: [{text:'',value:'-1'}],
				jcArray: [{text:'',value:''}],
				startDate:'2010-01-01',
				endDate:this.moment().format('YYYY-MM-DD')
			}
		},
		methods: {
			grdClick:function(e){
				if(this.grdIndex!==e.detail.value){
					 this.grdIndex=e.detail.value
					 this.showLoading()
					 this.pageobj0.loadFlag=0
					 this.pageobj0.canload=true
					 this.pageobj0.page_number=1
					 this.getList0();
				}
			},
			jcClick:function(e){
				if(this.jcIndex!==e.detail.value){
					 this.jcIndex=e.detail.value
					 this.showLoading()
					 this.pageobj0.loadFlag=0
					 this.pageobj0.canload=true
					 this.pageobj0.page_number=1
					 this.getList0();
				}
			},
			timeSelect(e){
				// console.log(e);
				this.time=e
				this.showLoading()
				this.pageobj0.loadFlag=0
				this.pageobj0.canload=true
				this.pageobj0.page_number=1
				this.getList0();
			},
			getGrd(){//获取年级
				let comData={
					op_code:'index',
					get_grd:true,
					all_grd: true,
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_HR_SUB+'acl/dataRange',comData,response=>{
				    // console.log("responseaaa: " + JSON.stringify(response));
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
						this.getJc();
					}else{ 
						this.grdArray=[];
						this.showToast('无数据授权 无法获取年级');
					}
				})
			},
			getJc(){//获取常量
				let comData={
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_WORK+'AttendanceReport/getDict',comData,response=>{
				    // console.log("responseaaa: " + JSON.stringify(response));
					this.hideLoading()
					let list = [].concat(response.classtimeArray);
					if(list.length>0){
						this.jcArray = list
						this.getList0();
					}else{
						this.showToast('无法获取考勤项目');
					}
				})
			},
			getList0(){//获取页面数据
				let comData={
					grd_code: this.grdArray[this.grdIndex].value,
					cls_code:'-1',
					classtime_schedule_id: this.jcArray[this.jcIndex].value,
					attendance_time: this.time,
					page_number: this.pageobj0.page_number, //当前页数
					page_size: this.pageSize, //每页记录数
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_WORK+'AttendanceReport/statisticsClasstimeAttendance',comData,response=>{
				    // console.log("responseaaa: " + JSON.stringify(response));
					setTimeout(function () {
						uni.stopPullDownRefresh();
					}, 1000);
					this.hideLoading()
					if(this.pageobj0.loadFlag===0){
						this.addKqName(response.qaArray,response.staticArray,list=>{
							this.pagedata=[].concat(list);
						})
						if(response.total.row_name){
							this.addKqName(response.qaArray,[response.total],list=>{
								if(list.length>0){
									this.listTotal=list[0];
								}
							})
						}
					}else{
						//合并数组
						this.addKqName(response.qaArray,response.staticArray,list=>{
							this.pagedata= this.pagedata.concat(list);
						})
						if(response.total.row_name){
							this.addKqName(response.qaArray,[response.total],list=>{
								if(list.length>0){
									this.listTotal=list[0];
								}
							})
						}
					}
					if(this.pageobj0.page_number>=response.total_page){
						this.pageobj0.status = 'noMore';
						this.pageobj0.canload=false
					}else{
						this.pageobj0.status = 'more';
					}
				})
			},
			addKqName(qaList,list,callback){
				let time_range=''
				let section=''
				list.map(function(currValue){
					let list=[]
					if(currValue.time_range!=''){
						time_range=currValue.time_range
					}
					if(currValue.time_range!=''){
						section=currValue.section
					}
					qaList.map(function(currValue2){
						let kqValue=currValue2.value;
						if(""+currValue[kqValue]){
							let obj={}
							obj.name=currValue2.text;
							obj.value=currValue[kqValue];
							list.push(obj)
						}
					})
					currValue.kqxxList=list;
				})
				//给合计的item赋值个节次对应的时间
				list.map(function(currValue){
					let list=[]
					if(currValue.time_range==''){
						currValue.time_range=time_range
						currValue.section=section
					}
				})
				// console.log("list: " + JSON.stringify(list));
				callback(list)
			}
		},
		onLoad(options) {
			const itemData = util.getPageData(options);
			this.index_code=itemData.access.split("#")[1]
			setTimeout(()=>{
				 this.showLoading()
				 this.getGrd()
			},100)
			uni.setNavigationBarTitle({title:itemData.text});
			//#ifdef H5
				document.title=""
			//#endif
		},
		onPullDownRefresh() {
			this.pageobj0.loadFlag=0
			this.pageobj0.canload=true
			this.pageobj0.page_number=1
			this.getList0()
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 5000);
		},
		onReachBottom() {
			if(this.pageobj0.canload){
				this.pageobj0.loadFlag=1
				this.pageobj0.status = 'loading';
				this.pageobj0.page_number=this.pageobj0.page_number+1
				this.getList0()
			}
		},
		onShow(){
			//#ifdef H5
				document.title=""
			//#endif
		},
	}
</script>

<style>
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
	 	margin: 5px 0;
	 }
	 
	 .title-text-total{
		 /* display: flex;
		 align-items: center;
	 	width: 80vw; */
		font-size: 16px;
	 	overflow: hidden;
	 	text-overflow: ellipsis;
	 	white-space: nowrap;
	 }
	 .title-text{
		 /* display: flex; */
		 /* align-items: center; */
	 	/* width: 80vw; */
		color: #5C5C5C;
	 	/* overflow: hidden;
	 	text-overflow: ellipsis;
	 	white-space: nowrap; */
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
	 .double-line{
	 	height: 5px;
	 	background-color: #e5e5e5;
	 	margin: 5px 0;
	 }
</style>
