<template>
	<view>
		<mynavBar ref="mynavBar" :titleClick="titleClick" :navItem='tabBarItem' :personInfo='personInfo' :text="navRight" :textClick="textClick"></mynavBar>
		<view>
			<uni-popup ref="popup" background-color="#fff">
				<view class="popup-content" :class="{ 'popup-height': 'top' }">
					<view class="popup-content-view" :key="tempPer.per_code" v-for="(tempPer, index) in perArray">
						<label class="perList" @click="selectItem(tempPer)" :style="{background:(tempPer.per_code==resPerModel.per_code?'#00CFBD':'#ECECEC'),color:(tempPer.per_code==resPerModel.per_code?'white':'')}">{{tempPer.per_name}}</label>
					</view>
				</view>
			</uni-popup>
			<uni-popup ref="subpopup" background-color="#fff">
				<view class="popup-content" :class="{ 'popup-height': 'top' }">
					<view class="popup-content-view" :key="tempSub.per_code" v-for="(tempSub, index) in subArray">
						<label class="perList" @click="selectSubItem(tempSub)" :style="{background:(tempSub.sub_code==resSubModel.sub_code?'#00CFBD':'#ECECEC'),color:(tempSub.sub_code==resSubModel.sub_code?'white':'')}">{{tempSub.sub_name}}</label>
					</view>
				</view>
			</uni-popup>
		</view>
		<view style="padding-top: 0px;">
			<scroll-view class="select-scroll" scroll-y="true" >
				<ly-tree :tree-data="resCatalogsArray" node-key="id" @node-click="treeItemClick" :props="{label:'name'}" :checkOnlyLeaf="true" :showCheckbox="true" :defaultCheckedKeys="defaultCheckedKeys"/>
			</scroll-view>
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
				showItem: false,
				navRight: '',
				perArray: [],
				resPerModel: {}, //当前学段
				subArray: [],
				resSubModel: {}, //当前科目
				resCatalogsArray: [],//目录列表
				defaultCheckedKeys:[],//已经完成的节点
			}
		},
		components: {
			mynavBar
		},
		methods: {
			titleClick(){
				console.log('textClick');
				this.type = 'top';
				// open 方法传入参数 等同在 uni-popup 组件上绑定 type属性
				this.$refs.popup.close();
				this.$refs.subpopup.open('top');
			},
			textClick() {
				console.log('textClick');
				this.type = 'top';
				// open 方法传入参数 等同在 uni-popup 组件上绑定 type属性
				this.$refs.subpopup.close();
				this.$refs.popup.open('top');
			},
			selectItem(tempPer) {
				this.$refs.popup.close();
				if(tempPer.per_code!=this.resPerModel.per_code){
					this.showLoading()
					this.resPerModel = tempPer;
					this.navRight = tempPer.per_name + '↓';
					this.getResSub();
				}
			},
			selectSubItem(tempSub){
				this.$refs.subpopup.close();
				if(tempSub.sub_code!=this.resSubModel.sub_code){
					this.showLoading()
					this.resSubModel = tempSub;
					this.tabBarItem.text=tempSub.sub_name+ '↓'; //给标题赋值
					// this.tabBarItem.titleIcon={value:'arrowdown',style:{fontSize:14,color:'#FFFFFF'}}
					this.getResCatalogs();
				}
			},
			treeItemClick(item) {
				console.log(item.isLeaf);
				console.log("item: " + JSON.stringify(item));
				if(item.isLeaf){
					this.showLoading()
					let data = item.data
					data.index_code = this.index_code
					let comData={
						catalog_id: data.id,
						user_code: this.personInfo.user_code,
						index_code: this.index_code,
					}
					this.post(this.globaData.INTERFACE_ZXKT+'/test/schedule',comData,response=>{
						 console.log("responseaaa: " + JSON.stringify(response));
						this.hideLoading()
						data.catalogId= data.id
						data.difficulty= response
						util.openwithData("/pages/zhiXueKeTang/zujuancs_start", data);
					})
				}
			},
			getResPer(){// 查询学段
				let comData={
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_ZXKT+'/pub/resPer',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					this.hideLoading()
					if (response.list && response.list.length > 0) {
						this.resPerModel = response.list[0];
						this.perArray = response.list;
						this.navRight = response.list[0].per_name + '↓';
						// 查询科目
						this.getResSub();
					} else {
						this.resPerModel = {};
						this.perArray =[];
						this.subArray= []
						this.resSubModel= {}
						this.resCatalogsArray= []
						this.showToast('暂无学段');
					}
				})
			},
			getResSub(){
				let comData={
					per_code: this.resPerModel.per_code, //学段代码
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_ZXKT+'/pub/resSub',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					this.hideLoading()
					if (response.list && response.list.length > 0) {
						this.subArray = response.list;
						this.resSubModel = response.list[0];
						this.tabBarItem.text=response.list[0].sub_name+ '↓'; //给标题赋值
						// this.tabBarItem.titleIcon={value:'arrowdown',style:{fontSize:14,color:'#FFFFFF'}}
						// 查询教版
						this.getResCatalogs();
					} else {
						this.subArray= []
						this.resSubModel= {}
						this.resCatalogsArray= []
						this.showToast('暂无科目');
					}
				})
			},
			getResCatalogs(){//查询目录
				let comData = {
					per_code: this.resPerModel.per_code, //学段代码
					sub_code: this.resSubModel.sub_code, //科目代码
					user_code: this.personInfo.user_code,  
					index_code: this.index_code
				}
				this.post(this.globaData.INTERFACE_ZXKT+'/pub/catalogs',comData,response=>{
					console.log("responseaaa: " + JSON.stringify(response));
					this.hideLoading()
					if (response) {
						this.getDefaultCheckedKeys(response.catalog.children)
						this.resCatalogsArray = [].concat(response.catalog.children);
					} else {
						this.resCatalogsArray = [].concat([]);
						this.showToast('暂无目录');
					}
				},response=>{
					this.tabBarItem.text='切换目录'+ '↓'; //给标题赋值
					// this.tabBarItem.titleIcon={value:'arrowdown',style:{fontSize:14,color:'#FFFFFF'}}
					this.resCatalogsArray = [].concat([]);
				});
			},
			getDefaultCheckedKeys(list){
				list.map(item=>{
					item.disabled='disabled'
					if(item.children){
						this.getDefaultCheckedKeys(item.children)
					}else{
						if(item.is_finish==1){
							this.defaultCheckedKeys.push(item.id)
						}
					}
				})
			},
		},
		onLoad(options) {
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(options);
			itemData.index=100
			this.tabBarItem = itemData;
			this.index_code=itemData.access.split("#")[1]
			setTimeout(()=>{
				 this.showLoading()
				 this.getResPer()
			},100)
			//#ifndef APP-PLUS
				document.title=""
			//#endif
		},
		onShow(){//解决IOS端列表进详情返回后不能定位到点击位置的问题
			if(this.resPerModel.per_code && this.resSubModel.sub_code){
				// 查询教版
				this.getResCatalogs();
			}
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
	 	width: 100%;
	 }
	 .scroll-view-item_H {
	 	display: inline-block;
	 	width: 70px;
	 	height: 40px;
	 	line-height: 40px;
	 	text-align: center;
	 	font-size: 14px;
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
	 .resource-img{
		 width: 40px;
		 height: 40px;
		 margin-right: 5px;
	 }
	 
	 .popup-content {
	 	/* #ifndef APP-NVUE */
	 	display: flex;
	 	/* #endif */
	 	flex-direction: row;
	 	/* align-items: center; */
	 	/* justify-content: center; */
		/* #ifdef APP-PLUS */
			padding: 80px 0px 10px 0px;
		/* #endif */
		/* #ifdef H5 */
			padding: 50px 0px 10px 0px;
		/* #endif */
	 	/* height: 50px; */
	 	background-color: #fff;
		justify-content: flex-start;
		flex-wrap: wrap;
	 }
	 
	 .popup-content-view{
		height: 48px;
		padding: 0 8px;
		display: flex;
		align-items: center;
	 }
	 
	 .perList {
	 	border: 1px solid white;
	 	padding: 5px 20px;
	 	border-radius: 5px;
	 	font-size: 13px;
		height: 26px;
		display: flex;
		align-items: center;
	 }
</style>
