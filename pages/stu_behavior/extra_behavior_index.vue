<template>
	<view>
		<mynavBar v-if="add" ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo' icon="plusempty" :iconClick="iconClick"></mynavBar>
		<mynavBar v-else ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo' ></mynavBar>
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
					<picker class="flex-box" @change="xwClick" :value="xwIndex" :range="xwArray" range-key="text">
						<uni-easyinput-select  :inputBorder="false" suffixIcon="arrowdown" disabled :value="xwArray[xwIndex].text" ></uni-easyinput-select>
					</picker>
				</uni-col>
			</uni-row>
			<view class="select-line"></view>
		</view>
		<view style="padding-top: 44px;">
			<uni-list :border="false">
				<uni-list-item showArrow :key="index" v-for="(item,index) in pagedata" :border="true">
					<text slot="body" class="slot-box slot-text" @click="toDetails(item)">
						<uni-row>
							<uni-col :span="24"><view class="title-text"><view class='leaveType'>{{item.item_txt}}</view>{{item.grd_name}} {{item.class_name}}&ensp;{{item.stu_name}}</view></uni-col>
							<uni-col :span="19"><view class="detail-text">记录人:{{item.create_user_name}}</view></uni-col>
							<uni-col :span="5"><view class="detail-text">{{item.create_time}}</view></uni-col>
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
				add:false,//add按钮权限
				tabBarItem: {},
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
				//顶部筛选框相关内容
				grdIndex:0,
				clsIndex:0,
				xwIndex:0,
				grdArray: [{text:'',value:''}],
				clsArray: [{text:'',value:''}],
				xwArray: [{text:'',value:''}],
			}
		},
		components: {
			mynavBar
		},
		methods: {
			iconClick(){
				let that=this
				if(this.grdArray.length==0){
					this.showToast('无法获取年级数据，不能进行添加操作')
				}else if(this.clsArray.length==0){
					this.showToast('无法获取班级数据，不能进行添加操作')
				}else if(this.xwArray.length==0){
					this.showToast('无法获取行为细项数据，不能进行添加操作')
				}else {
					util.openwithData('/pages/stu_behavior/extra_behavior_add',{index_code:this.index_code},{
						refreshExtBehavior(data){//子页面调用父页面需要的方法
							that.showLoading()
							that.pageobj0.loadFlag=0
							that.pageobj0.canload=true
							that.pageobj0.page_number=1
							that.getList0()
						}
					})
				}
			},
			grdClick:function(e){
				if(this.grdIndex!==e.detail.value){
					 this.grdIndex=e.detail.value
					 this.clsIndex=0
					 this.showLoading()
					 this.pageobj0.loadFlag=0
					 this.pageobj0.canload=true
					 this.pageobj0.page_number=1
					 this.getCls();
				}
			},
			clsClick:function(e){
				if(this.clsIndex!==e.detail.value){
					 this.clsIndex=e.detail.value
					 this.showLoading()
					 this.pageobj0.loadFlag=0
					 this.pageobj0.canload=true
					 this.pageobj0.page_number=1
					 this.getList0();
				}
			},
			xwClick:function(e){
				if(this.xwIndex!==e.detail.value){
					 this.xwIndex=e.detail.value
					 this.showLoading()
					 this.pageobj0.loadFlag=0
					 this.pageobj0.canload=true
					 this.pageobj0.page_number=1
					 this.getList0();
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
						this.getList0();
					}else{
						this.clsArray=[];
						this.showToast('无数据授权 无法获取班级');
					}
				})
			},
			getXw(){//获取行为细项
				let comData={
					op_code:'index',
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_STUXWSUB+'ExtraBehavior/getDict',comData,response=>{
				    console.log("responseabaa: " + JSON.stringify(response));
					this.hideLoading()
					let xwList = [{
						value: '',
						text: '全部行为'
					}].concat(response.qbArray);
					this.xwArray = xwList;
				})
			},
			getList0(){//获取页面数据
				let comData={
					grd_code: this.grdArray[this.grdIndex].value,
					cls_code: this.clsArray[this.clsIndex].value,
					item_code: this.xwArray[this.xwIndex].value,
					page_number: this.pageobj0.page_number, //当前页数
					page_size: this.pageSize, //每页记录数
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_STUXWSUB+'ExtraBehavior/list',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					setTimeout(function () {
						uni.stopPullDownRefresh();
					}, 1000);
					this.hideLoading()
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
				})
			},
			toDetails(item){
				item.index_code=this.index_code
				let that=this
				util.openwithData('/pages/stu_behavior/extra_behavior_detail',item,{
					refreshExtBehaviorDetail(data){//子页面调用父页面需要的方法
						that.showLoading()
						that.pageobj0.loadFlag=0
						that.pageobj0.canload=true
						that.pageobj0.page_number=1
						that.getList0()
					}
				})
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
					 this.add=result[0]
					 this.hideLoading();
				 })
				 this.getGrd()
				 this.getXw()
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
	 ::v-deep .content-clear-icon{
		 padding:0 10px 0 0 !important;
	 }
</style>
