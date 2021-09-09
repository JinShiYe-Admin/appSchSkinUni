<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo' :icon="icon" :iconClick="iconClick"></mynavBar>
		<view class="tabs-fixed" style="background-color: #FFFFFF;">
			 <uni-row>
				<uni-col :span="8" >
					<picker @change="grdClick" :value="grdIndex" :range="grdArray" range-key="text">
						<uni-easyinput-select  :inputBorder="false" suffixIcon="arrowdown" disabled :value="grdArray[grdIndex].text" ></uni-easyinput-select>
					</picker>
				</uni-col>
			 </uni-row>
			 <view class="select-line"></view>
		</view>
		<view style="padding-top: 44px;" >
			<uni-list :border="false">
				<uni-list-item showArrow :key="index" v-for="(item,index) in pagedata" :border="true">
					<text slot="body" class="slot-box slot-text" @click="toDetails(item)">
						<uni-row>
							<uni-col :span="24"><view class="title-text">{{item.send_time}}</view></uni-col>
							<uni-col :span="24"><view class="detail-text">接收年级:
								<template v-for="(item1,index) in item.tousers">
									<template v-if="index < item.tousers.length-1">{{item1.grd_name}},</template>
									<template v-else>{{item1.grd_name}}</template>
								</template>
							</view></uni-col>
							<uni-col :span="24"><view class="detail-text">{{item.msg_content}}</view></uni-col>
						</uni-row>
					</text>
				</uni-list-item>
				
			</uni-list>
			<uni-load-more :status="pageobj0.status" :icon-size="17" :content-text="pageobj0.contentText" />
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
				icon:'',
				tabBarItem: {},
				
				//顶部筛选框相关内容
				grdIndex:0,
				grdArray: [{text:'',value:''}],
				
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
				 
			}
		},
		components: {
			mynavBar
		},
		methods: {
			 grdClick:function(e){
			 	if(this.grdIndex!==e.detail.value){
			 		 this.grdIndex=e.detail.value
			 		 this.clsIndex=0
			 		 this.clsArray=[]
			 		 this.showLoading()
			 		 this.pageobj0.loadFlag=0
			 		 this.pageobj0.canload=true
			 		 this.pageobj0.page_number=1
			 		 this.getCls();
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
						this.getList0()
			 		}else{ 
			 			this.grdArray=[];
			 			this.showToast('无数据授权 无法获取年级');
			 		}
			 	})
			 },
			iconClick(){
				let that=this
				util.openwithData('/pages/schhome/grade_notice_add',{index_code:this.index_code},{
					refreshList(data){//子页面调用父页面需要的方法
						that.showLoading()
						that.pageobj0.loadFlag=0
						that.pageobj0.canload=true
						that.pageobj0.page_number=1
						that.getList0()
					}
				})
			},
			getList0(){//获取页面数据
				let comData={
					get_unit_code:this.personInfo.unit_code,
					msg_type:this.MSG_SMS.GRADE.MSG_TYPE,
					msg_content:'',
					dest_user:'',
					send_time_begin:'1970-01-01',
					send_time_end:'2051-01-01',
					send_user:this.personInfo.user_code,
					grd_code:this.grdArray[this.grdIndex].value=="-1"?'':this.grdArray[this.grdIndex].value,
					cls_code:'',
					serviced:'0,1,99,100',
					page_number: this.pageobj0.page_number, //当前页数
					page_size: this.pageSize, //每页记录数
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_SCHHOME+'api/appsms/appsmsp',comData,response=>{
					setTimeout(function () {
						uni.stopPullDownRefresh();
					}, 1000);
					this.hideLoading()
					if(response!=null){
						if(this.pageobj0.loadFlag===0){
							this.pagedata=[].concat(response.list)
						}else{
							this.pagedata=this.pagedata.concat(response.list)
						}
						if(this.pageobj0.page_number>=response.total_page){
							this.pageobj0.status = 'noMore';
							this.pageobj0.canload=false
						}else{
							this.pageobj0.status = 'more';
						}
					}else{
						this.pagedata=[]
						this.showToast('暂无数据')
						this.pageobj0.status = 'noMore';
						this.pageobj0.canload=false
					}
				})
			},
			toDetails(item){
				item.index_code=this.index_code
				util.openwithData('/pages/schhome/grade_notice_detail',item,{})
			}
		},
		onLoad(options) {
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(options);
			itemData.index=100
			this.tabBarItem = itemData;
			this.index_code=itemData.access.split("#")[1]
			setTimeout(()=>{
				 this.showLoading()
				 this.getPermissionByPosition('add',this.index_code,result=>{
					 if(result[0]){
						 this.icon='plusempty'
					 }
					 this.hideLoading();
				 })
				 this.getGrd();
			},100)
			//#ifndef APP-PLUS
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
	 
	 .title-text{
		 display: flex;
		 align-items: center;
	 	width: 80vw;
	 	overflow: hidden;
	 	text-overflow: ellipsis;
	 	white-space: nowrap;
	 }
	 
	 .detail-text{
	 	color: #939393;
	 	font-size: 12px;
	 	margin: 3px 0;
		word-break: break-all;
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
