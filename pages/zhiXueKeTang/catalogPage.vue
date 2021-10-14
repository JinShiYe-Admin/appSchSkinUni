<template>
	<view>
		<view class="tabs-fixed" style="background-color: #FFFFFF;">
			<view class="scroll-view-body">
				<text class="scroll-title" >学段:</text>
				<scroll-view v-if="resPerArray.length>0" class="scroll-view_H" scroll-x="true" :show-scrollbar="false" :scroll-into-view="scrollIntoPer">
					<view v-for="(item,index) in resPerArray" :key="item.per_code" :id="item.per_code" :data-current="index" class="scroll-view-item_H" @click="pertabtap(index)">
						<text class="uni-tab-item-title" :class="perTabIndex==index ? 'uni-tab-item-title-active' : ''">{{item.per_name}}</text>
					</view>
				</scroll-view>
			</view>
			<view class="scroll-view-body">
				<text class="scroll-title" >科目:</text>
				<scroll-view v-if="resSubArray.length>0" class="scroll-view_H" scroll-x="true" :show-scrollbar="false" :scroll-into-view="scrollIntoSub">
					<view v-for="(item,index) in resSubArray" :key="item.sub_code" :id="item.sub_code" :data-current="index" class="scroll-view-item_H" @click="subtabtap(index)">
						<text class="uni-tab-item-title" :class="subTabIndex==index ? 'uni-tab-item-title-active' : ''">{{item.sub_name}}</text>
					</view>
				</scroll-view>
			</view>
			<view class="scroll-view-body">
				<text class="scroll-title" >教版:</text>
				<scroll-view v-if="resMaterArray.length>0" class="scroll-view_H" scroll-x="true" :show-scrollbar="false" :scroll-into-view="scrollIntoMater">
					<view v-for="(item,index) in resMaterArray" :key="item.mater_code" :id="item.mater_code" :data-current="index" class="scroll-view-item_H" @click="matertabtap(index)">
						<text class="uni-tab-item-title" :class="materTabIndex==index ? 'uni-tab-item-title-active' : ''">{{item.mater_name}}</text>
					</view>
				</scroll-view>
			</view>
			<view class="scroll-view-body">
				<text class="scroll-title" >分册:</text>
				<scroll-view v-if="resFascArray.length>0" class="scroll-view_H" scroll-x="true" :show-scrollbar="false" :scroll-into-view="scrollIntoFasc">
					<view v-for="(item,index) in resFascArray" :key="item.fasc_code" :id="item.fasc_code" :data-current="index" class="scroll-view-item_H" @click="fasctabtap(index)">
						<text class="uni-tab-item-title" :class="fascTabIndex==index ? 'uni-tab-item-title-active' : ''">{{item.fasc_name}}</text>
					</view>
				</scroll-view>
			</view>
			<view class="select-line"></view>
		</view>
		<view style="padding-top: 159px;">
			<scroll-view class="select-scroll" scroll-y="true" >
				<!-- <mix-tree :list="leftList" @treeItemClick="treeItemClick" :nodeClick="true"></mix-tree> -->
				<ly-tree :tree-data="resCatalogsArray" node-key="id" @node-click="treeItemClick" :props="{label:'name'}"/>
			</scroll-view>
		</view>
		<uni-popup ref="alertDialog" type="dialog">
			<uni-popup-dialog type="warn" title="提醒" content="确定切换到当前章节吗？" @confirm="dialogConfirm"></uni-popup-dialog>
		</uni-popup>
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
				
				clickitem:{},
				
				scrollIntoPer:'',
				perTabIndex: 0,
				scrollIntoSub:'',
				subTabIndex: 0,
				scrollIntoMater:'',
				materTabIndex: 0,
				scrollIntoFasc:'',
				fascTabIndex: 0,
				
				resPerModel: {}, //当前学段
				resSubModel: {}, //当前科目
				resMaterModel: {}, //当前教版
				resFascModel: {}, //当前分册
				resCatalogsModel: {}, //当前目录
				resPerArray:[],//学段列表
				resSubArray:[],//科目列表
				resMaterArray:[],//教版列表
				resFascArray:[],//分册列表
				resCatalogsArray: [],//目录列表
			}
		},
		methods: {
			pertabtap(index){
				if (this.perTabIndex === index) {
				   return;
				}
				this.perTabIndex = index;
				this.scrollIntoPer = this.resPerArray[index].key;
				this.resPerModel = this.resPerArray[index]
				//状态重置
				this.scrollIntoSub=''
				this.subTabIndex=0
				this.scrollIntoMater=''
				this.materTabIndex=0
				this.scrollIntoFasc=''
				this.fascTabIndex=0
				this.resSubArray = [].concat([]);
				this.resMaterArray = [].concat([]);
				this.resFascArray = [].concat([]);
				this.resCatalogsArray = [].concat([]);
				// 查询科目
				this.showLoading();
				this.getResSub();
			},
			subtabtap(index){
				if (this.subTabIndex === index) {
				   return;
				}
				this.subTabIndex = index;
				this.scrollIntoSub = this.resSubArray[index].key;
				this.resSubModel =this.resSubArray[index]
				//状态重置
				this.scrollIntoMater=''
				this.materTabIndex=0
				this.scrollIntoFasc=''
				this.fascTabIndex=0
				this.resMaterArray = [].concat([]);
				this.resFascArray = [].concat([]);
				this.resCatalogsArray = [].concat([]);
				// 查询教版
				this.showLoading();
				this.getResMater();
			},
			matertabtap(index){
				if (this.materTabIndex === index) {
				   return;
				}
				this.materTabIndex = index;
				this.scrollIntoMater = this.resMaterArray[index].key;
				this.resMaterModel =this.resMaterArray[index]
				//状态重置
				this.scrollIntoFasc=''
				this.fascTabIndex=0
				this.resFascArray = [].concat([]);
				this.resCatalogsArray = [].concat([]);
				// 查询分册
				this.showLoading();
				this.getResFasc();
			},
			fasctabtap(index){
				if (this.fascTabIndex === index) {
				   return;
				}
				this.fascTabIndex = index;
				this.scrollIntoFasc = this.resFascArray[index].key;
				this.resFascModel =this.resFascArray[index]
				//状态重置
				this.resCatalogsArray = [].concat([]);
				// 查询目录
				this.showLoading();
				this.getResCatalogs();
			},
			getResPer(){// 查询学段
				let comData={
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_ZXKT+'/pub/resPer',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					this.hideLoading()
					if (response.list && response.list.length > 0) {
						for (let i = 0; i < response.list.length; i++) {
							let model = response.list[i];
							model.per_code='percode_'+model.per_code
						}
						this.resPerArray = [].concat(response.list);
						this.resPerModel = response.list[0]
						// 查询科目
						this.getResSub();
					} else {
						this.resPerArray = [].concat([]);
						this.resSubArray = [].concat([]);
						this.resMaterArray = [].concat([]);
						this.resFascArray = [].concat([]);
						this.resCatalogsArray = [].concat([]);
						this.showToast('暂无学段');
					}
				})
			},
			getResSub(){
				let per_code=this.resPerModel.per_code.split("_")[1]
				let comData={
					per_code: per_code, //学段代码
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_ZXKT+'/pub/resSub',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					this.hideLoading()
					if (response.list && response.list.length > 0) {
						for (let i = 0; i < response.list.length; i++) {
							let model = response.list[i];
							model.sub_code='subcode_'+model.sub_code
						}
						this.resSubArray = [].concat(response.list);
						this.resSubModel = response.list[0]
						// 查询教版
						this.getResMater();
					} else {
						this.resSubArray = [].concat([]);
						this.resMaterArray = [].concat([]);
						this.resFascArray = [].concat([]);
						this.resCatalogsArray = [].concat([]);
						this.showToast('暂无科目');
					}
				})
			},
			getResMater(){//查询教版
				let per_code=this.resPerModel.per_code.split("_")[1]
				let sub_code=this.resSubModel.sub_code.split("_")[1]
				let comData={
					per_code: per_code, //学段代码
					sub_code: sub_code, //科目代码
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_ZXKT+'/pub/resMater',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					this.hideLoading()
					if (response.list && response.list.length > 0) {
						for (let i = 0; i < response.list.length; i++) {
							let model = response.list[i];
							model.mater_code='matercode_'+model.mater_code
						}
						this.resMaterArray = [].concat(response.list);
						this.resMaterModel = response.list[0]
						// 查询分册
						this.getResFasc();
					} else {
						this.resMaterArray = [].concat([]);
						this.resFascArray = [].concat([]);
						this.resCatalogsArray = [].concat([]);
						this.showToast('暂无教版');
					}
				})
			},
			getResFasc(){// 查询分册
				let per_code=this.resPerModel.per_code.split("_")[1]
				let sub_code=this.resSubModel.sub_code.split("_")[1]
				let mater_code=this.resMaterModel.mater_code.split("_")[1]
				let comData={
					per_code: per_code, //学段代码
					sub_code: sub_code, //科目代码
					mater_code: mater_code, //教版代码
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_ZXKT+'/pub/resFasc',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					this.hideLoading()
					if (response.list && response.list.length > 0) {
						for (let i = 0; i < response.list.length; i++) {
							let model = response.list[i];
							model.fasc_code='fasccode_'+model.fasc_code
						}
						this.resFascArray = [].concat(response.list);
						this.resFascModel = response.list[0]
						// 查询目录
						this.getResCatalogs();
					} else {
						this.resFascArray = [].concat([]);
						this.resCatalogsArray = [].concat([]);
						this.showToast('暂无分册');
					}
				})
			},
			getResCatalogs(){//查询目录
				let per_code=this.resPerModel.per_code.split("_")[1]
				let sub_code=this.resSubModel.sub_code.split("_")[1]
				let mater_code=this.resMaterModel.mater_code.split("_")[1]
				let fasc_code=this.resFascModel.fasc_code.split("_")[1]
				let comData = {
					per_code: per_code, //学段代码
					sub_code: sub_code, //科目代码
					mater_code: mater_code, //教版代码
					fasc_code: fasc_code, //分册代码
					index_code: this.index_code
				}
				this.post(this.globaData.INTERFACE_ZXKT+'/pub/resCatalogs',comData,response=>{
					console.log("responseaaa: " + JSON.stringify(response));
					this.hideLoading()
					if (response) {
						this.resCatalogsArray = [].concat(response.catalog.children);
					} else {
						this.resCatalogsArray = [].concat([]);
						this.showToast('暂无目录');
					}
				});
			},
			treeItemClick(item) {
				console.log(item.isLeaf);
				console.log("item: " + JSON.stringify(item));
				if(item.isLeaf){
					this.clickitem=item
					this.$refs.alertDialog.open()
				}
			},
			dialogConfirm(){
				const eventChannel = this.getOpenerEventChannel()
				eventChannel.emit('refreshCatalog', {data: [this.clickitem,this.resPerModel,this.resSubModel]});
				uni.navigateBack();
				this.hideLoading()
			},
		},
		onLoad(options) {
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(options);
			this.index_code=itemData.index_code
			setTimeout(()=>{
				 this.showLoading()
				 this.getResPer()
			},100)
			uni.setNavigationBarTitle({title:'切换目录'});
			//#ifndef APP-PLUS
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
	 }
	 
	 .line{
	 	height: 1px;
	 	background-color: #e5e5e5;
	 	margin: 5px 0;
	 }
	 
	 .title-text{
		 display: flex;
		 align-items: center;
	 	overflow: hidden;
	 	text-overflow: ellipsis;
	 	white-space: nowrap;
	 }
	 
	 .detail-text{
		 flex: 1;
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
	 
	 .scroll-view_H {
	 	white-space: nowrap;
	 	width: 85%;
	 }
	 .scroll-view-item_H {
	 	display: inline-block;
	 	min-width: 40px;
		margin: 0 10px;
	 	height: 40px;
	 	line-height: 40px;
	 	text-align: left;
	 	font-size: 13px;
	 }
	 
	 .uni-tab-item-title {
	     color: #555;
	     font-size: 14px;
	     height: 40px;
	     line-height: 40px;
	     flex-wrap: nowrap;
	     /* #ifndef APP-PLUS */
	     white-space: nowrap;
	     /* #endif */
	 }
	 
	 .uni-tab-item-title-active {
	     color: #00CFBD;
	 }
	 
	 .scroll-view-body{
		 display: flex;
		 flex-direction: row;
		 align-items: center;
		 height: 40px;
	 }
	 .scroll-title{
		 width: 35px;
		 flex-shrink: 0;
		 font-size: 13px;
		 margin-left: 10px;
	 }
	 
	 .se2lect-scroll{
	 	/* #ifdef APP-PLUS */
	 	height: calc(100vh - 80px) !important;
	 	/* #endif */
	 	/* #ifdef H5 */
	 	height: calc(100vh - 45px) !important;
	 	/* #endif */
	 }
</style>
