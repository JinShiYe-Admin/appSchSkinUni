<template>
	<view>
		<uniNavBar :title='tabBarItem.name' style="font-size: 10px;" left-icon="back" backgroundColor='#00CFBD' fixed='true' statusBar='true' color='white' @clickLeft='clickLeft()'></uniNavBar>
		<view class="tabs-fixed">
			<uni-row>
				<uni-col :span="tabBarItem.selectType =='qk'?8:12">
					<picker class="flex-box" @change="clsClick" :value="clsIndex" :range="clsArray" range-key="text">
						<view style="font-size: 13px;color: #7f7f7f;text-align: center;padding: 10px 0;">
							{{clsArray[clsIndex].text}}
							<uni-icons style="float: right;margin-right: 10px;margin-top: 2px;" type="bottom" color='#7f7f7f' size="14"></uni-icons>
						</view>
					</picker>
				</uni-col>
				<uni-col v-if="tabBarItem.selectType =='qk'" :span="8">
					<picker class="flex-box" @change="kmClick" :value="kmIndex" :range="kmArray" range-key="text">
						<view style="font-size: 13px;color: #7f7f7f;text-align: center;padding: 10px 0;">
							{{kmArray[kmIndex].text}}
							<uni-icons style="float: right;margin-right: 10px;margin-top: 2px;" type="bottom" color='#7f7f7f' size="14"></uni-icons>
						</view>
					</picker>
				</uni-col>
				<uni-col :span="tabBarItem.selectType =='qk'?8:12">
					<picker class="flex-box" @change="kcClick" :value="kcIndex" :range="kcArray" range-key="text">
						<view style="font-size: 13px;color: #7f7f7f;text-align: center;padding: 10px 0;">
							{{kcArray[kcIndex].text}}
							<uni-icons style="float: right;margin-right: 10px;margin-top: 2px;" type="bottom" color='#7f7f7f' size="14"></uni-icons>
						</view>
					</picker>
				</uni-col>
			</uni-row>
			<view class="line" style="margin: 0 0 0 -3px;"></view>
		</view>
		<view>
			<view style="margin-top: 40px;">
				<uni-list :border="false">
					<uni-list-item  :key="index" v-for="(item,index) in pageModel.showList" :border="true" >
						<view slot="body" class="slot-box slot-text" @click="showtoast(item)">
							<uni-row>
								<uni-col :span="24"><view class="detail-text">{{item.cls_name}} {{item.stu_name}}</view></uni-col>
								<uni-col :span="14"><view class="detail-text-ms"><text v-if="kmArray[kmIndex].value==-1">总分</text>分数：{{item.score}}</view></uni-col>
								<uni-col :span="10"><view class="detail-text-ms"><text v-if="kmArray[kmIndex].value==-1">总分</text>排名：{{item.grd_order}}</view></uni-col>
								<uni-col :span="14"><view class="detail-text-ms"><text v-if="kmArray[kmIndex].value==-1">总分</text>年级进退步：{{Math.abs(item.grd_order_diff)}} <uni-icons v-if="item.grd_order_diff>0" type="arrowthinup" size="12" color="#FF4444"></uni-icons> <uni-icons v-else-if="item.grd_order_diff<0" type="arrowthindown" size="12" color="#04D0BE"></uni-icons></view></uni-col>
								<uni-col :span="10"><view v-if="pageModel.tag_list && pageModel.tag_list.length > 0" class="detail-text-popover">各科分数及排名<uni-icons type="arrowdown" size="12" color="#04D0BE"></uni-icons></view></uni-col>
							</uni-row>
						</view>
					</uni-list-item>
				</uni-list>
			</view>
		</view>
		<uni-popup ref="popupAvg" type="center" style="background-color: white;" >
			<view style="background-color: white;padding: 10px;border-radius: 5px;">
				<!-- <view style="text-align: right;margin:-25px -28px -28px 0px;"> <button type="primary" style="border: 0;" class="mini-btn" plain="true" size="mini" @click="closePop"><uni-icons type="close" size="25" color="#04D0BE"></uni-icons></button></view> -->
				<view  style="border: 1px solid #66c1bb;margin-top: 10px;width: 80vw;max-height: 400px;overflow-y: scroll;">
					<view style="height: 20px;background-color: #66c1bb;margin: 0px 0 0 0;font-size: 13px;color: white;padding-left: 10px;text-align: center;">
						<uni-row>
							<uni-col :span="8">
								<view>科目</view>
							</uni-col>
							<uni-col :span="8">
								<view>分数</view>
							</uni-col>
							<uni-col :span="8">
								<view>排名</view>
							</uni-col>
						</uni-row>
					</view>
					<scroll-view scroll-y="true" style="max-height: 380px;">
						<uni-row v-for="(model,index) in scoreDetailArray" :key='index' style="text-align: center;height:30px;display: flex;align-items: center;background-color:#E5E5E5 ;">
							<uni-col :span="8">
								<view class="scoreDetail">{{model.subName}}</view>
							</uni-col>
							<uni-col :span="8">
								<view class="scoreDetail">{{model.subScore}}</view>
							</uni-col>
							<uni-col :span="8">
								<view class="scoreDetail">{{model.subOrder}}</view>
							</uni-col>
						</uni-row>
					</scroll-view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import util from '../../commom/util.js';
	import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue'
	export default {
		data() {
			return {
				index_code:'',
				personInfo: {},
				tabBarItem:{},
				
				pageModel:{},
				scoreDetailArray:[],
				//顶部筛选框相关内容
				clsIndex:0,
				kmIndex:0,
				kcIndex:0,
				clsArray: [{text:'',value:''}],
				kmArray: [{text:'',value:''}],
				kcArray: [{text:'',value:''}],
			}
		},
		components: {
			uniNavBar
		},
		methods: {
			clickLeft: function() {
				uni.navigateBack();
			},
			closePop(){
				this.$refs.popupAvg.close();
			},
			showtoast(model){
				console.log("model: " + JSON.stringify(model));
				this.scoreDetailArray = [];
				console.log("this.pageModel.tag_list: " + JSON.stringify(this.pageModel.tag_list));
				if (this.pageModel.tag_list && this.pageModel.tag_list.length > 0) {
					let tempArr = [];
					for (let a = 0; a < this.pageModel.tag_list.length; a++) {
						let tempTag = this.pageModel.tag_list[a];
						let tempModel = {
							subName: tempTag.name,
							subKey: tempTag.key
						};
						for (let i in model) {
							if (i.indexOf("paper_order_") != -1) {
								let tempKeyArray = i.split('_');
								if (tempTag.key == tempKeyArray[2]) {
									if(model[i]){
										tempModel.subOrder = model[i];
									}else{
										tempModel.subOrder = '无';
									}
								}
							}
							if (i.indexOf("paper_score_") != -1) {
								let tempKeyArray = i.split('_');
								if (tempTag.key == tempKeyArray[2]) {
									if(model[i]){
										tempModel.subScore = model[i];
									}else{
										tempModel.subScore = '0';
									}
								}
							}
						}
						tempArr.push(tempModel);
					}
					console.log('tempArr:'+JSON.stringify(tempArr));
					this.scoreDetailArray = [].concat(tempArr);
					this.$refs.popupAvg.open();
				}else{
					// this.scoreDetailArray = [].concat([{subName:'',subKey:'',subOrder:'',subScore:'暂无数据'}]);
					// this.$refs.popupAvg.open();
				}
			},
			clsClick:function(e){
				if(this.clsIndex!==e.detail.value){
					 this.clsIndex=e.detail.value
					 this.showLoading()
					 this.getKc();
				}
			},
			kmClick:function(e){
				if(this.kmIndex!==e.detail.value){
					 this.kmIndex=e.detail.value
					 this.showLoading()
					 this.getList1();
				}
			},
			kcClick:function(e){
				if(this.kcIndex!==e.detail.value){
					 this.kcIndex=e.detail.value
					 this.showLoading()
					 this.getList1();
				}
			},
			getCls(){//获取班级
				let comData={
					paper_id: this.tabBarItem.id,
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_MARKINGPAPERS+'report/getCls',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					this.hideLoading()
					if(response.list.length==0){
						this.showToast('暂无您管理班级的数据');
					}
					response.list.map((currentValue,index)=> {
						currentValue.value = currentValue.cls_code;
						currentValue.text = currentValue.cls_name;
						if (currentValue.value == -1) {
							currentValue.text = '全部班级';
						}
						if (currentValue.cls_code == this.tabBarItem.cls_code) {
							// datasource.clsModel = currentValue;
							this.clsIndex=index
						}
					})
					this.getKc()
					this.clsArray = [].concat(response.list);
				})
			},
			getKm(){//获取科目
				let comData={
					paper_id: this.tabBarItem.id,
					cls_name: this.tabBarItem.cls_name,
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_MARKINGPAPERS+'report/getSub',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					this.hideLoading()
					response.list.map((currentValue,index)=> {
						currentValue.value = currentValue.sub_code;
						currentValue.text = currentValue.sub_name;
						if (currentValue.value == -1) {
							currentValue.text = '全部科目';
						}
					});
					this.kmArray = [].concat(response.list);
					this.getList1()
				})
			},
			getKc(){//获取考次
				let comData={
					paper_id: this.tabBarItem.id,
					index_code:this.index_code,
				}
				this.post(this.globaData.INTERFACE_MARKINGPAPERS+'paper/comparePapers',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					this.hideLoading()
					response.list.map((currentValue,index)=> {
						currentValue.value = currentValue.id;
						currentValue.text = currentValue.name;
						if (currentValue.id == response.select_id) {
							this.kcIndex = index;
						}
					})
					this.kcArray = [].concat(response.list);
					if(this.tabBarItem.selectType=='qk'){
						//1.16.考情分析-考情报表-学生成绩列表
						this.getKm()
					}else{
						if(this.kcArray.length>0){
							this.getList1()
						}else{
							this.kcArray=[{text:'暂无',value:''}]
						}
					}
				})
				 
			},
			getList1(){//获取页面数据
				let comData={
					paper_id: this.tabBarItem.id,
					sub_code: this.tabBarItem.subCode, //科目代码
					compare_paper_id: this.kcArray[this.kcIndex].value, //对比考试id
					index_code: this.index_code,
				}
				let url='singleSub/stuScore';
				if(this.tabBarItem.selectType=='qk'){
					url='report/stuScore'
					comData={
						paper_id: this.tabBarItem.id,
						cls_code: this.clsArray[this.clsIndex].value, //班级代码
						sub_code: this.kmArray[this.kmIndex].value, //科目代码
						compare_paper_id: this.kcArray[this.kcIndex].value, //对比考试id
						index_code: this.index_code,
					}
				}
				this.post(this.globaData.INTERFACE_MARKINGPAPERS+url,comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					setTimeout(function () {
						uni.stopPullDownRefresh();
					}, 1000);
					this.hideLoading()
					let tempArray = [];
					for (let a = 0; a < response.list.length; a++) {
						let tempM = response.list[a];
						if (tempM.grd_order_diff) {
					
						} else {
							tempM.grd_order_diff = 0;
						}
						if(this.clsArray[this.clsIndex].value == '-1'){
							tempArray.push(tempM);
						}
						if(this.clsArray[this.clsIndex].value == tempM.cls_code){
							tempArray.push(tempM);
						}
					}
					response.showList = [].concat(tempArray);
					this.pageModel = response;
				})
			},
		},
		onLoad(options) {
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(options);
			console.log("itemData: " + JSON.stringify(itemData));
			itemData.index=100
			itemData.text=itemData.name
			this.tabBarItem = itemData;
			this.index_code=itemData.index_code
			setTimeout(()=>{
				this.showLoading()
				this.getCls()
			},100)
			//#ifdef H5
				document.title=""
			//#endif
		},
		onShow(){ 
			//#ifdef H5
				document.title=""
			//#endif
		},
		onPullDownRefresh() {
			this.getList1()
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 5000);
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
	 	color: #6C6C6C;
		font-weight: 600;
	 	font-size: 15px;
	 	margin: 3px 0;
	 }
	 
	 .detail-text-ms{
		 color: #A09FA3;
		 font-size: 13px;
		 margin: 6px 0;
	 }
	 
	 .detail-text-popover{
		 color: #04D0BE;
		 font-size: 13px;
		 margin: 6px 0;
		 font-weight: 600;
	 }
	 
	 .leaveType {
	 	width: 26px;
	 	color: #2A82E4;
	 	padding:0px 3px;
	 	border-radius: 4px; 
	 	border: 1px solid #2A82E4;
	 }
	 .line-green{
	 	background-color: #00CFBD;
	 	height: 2px;
	 }
	 
	 .uni-list::before {
	     height: 0px;
	 }
	 
	 
	 
	 .ant-avatar{
	 	-webkit-box-sizing: border-box;
	 	    box-sizing: border-box;
	 	    margin: 0;
	 	    padding: 0;
	 	    color: rgba(0, 0, 0, 0.65);
	 	    font-size: 14px;
	 	    font-variant: tabular-nums;
	 	    line-height: 1.5;
	 	    list-style: none;
	 	    -webkit-font-feature-settings: 'tnum';
	 	    font-feature-settings: 'tnum';
	 	    position: relative;
	 	    display: inline-block;
	 	    overflow: hidden;
	 	    color: #fff;
	 	    white-space: nowrap;
	 	    text-align: center;
	 	    vertical-align: middle;
	 	    background: #ccc;
	 	    width: 32px;
	 	    height: 32px;
	 	    line-height: 32px;
	 	    border-radius: 50%;
	 }
	 
	 .ant-avatar-lg {
	     width: 40px;
	     height: 40px;
	     line-height: 40px;
	     border-radius: 50%;
	 }
	 .biaoti {
	 	color: #444444;
	 	font-size: 16px;
		font-weight: 400;
	 	white-space:normal;
		word-break: break-all;
	 }
	 ::v-deep .uni-nav-bar-text {
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	 }
	 .scoreDetail{
		 font-size: 13px;
		 color: #000;
		 text-align: center;
		 margin-top: 0px;
		 background-color: #e5e5e5;
	 }
	 .readOnly{
		 pointer-events: none;
	 }
</style>
