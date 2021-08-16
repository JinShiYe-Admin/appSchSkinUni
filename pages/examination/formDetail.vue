<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo'></mynavBar>
		<view style="padding: 15px;">
			<uni-row>
				<uni-col :span="12">
					<view  class="action-button" :class="[controlIndex==0?'action-current':'']" @click="controlClick(0)">
						<image src="../../static/images/schapp_examination/pjf.png" style="width: 30px;height: 30px;"></image>
						<view class="distraction-t">平均分:{{tabsDetail.avg_score}}</view>
					</view>
				</uni-col>
				<uni-col :span="12">
					<view  class="action-button" :class="[controlIndex==1?'action-current':'']" @click="controlClick(1)">
						<image src="../../static/images/schapp_examination/zfd.png" style="width: 30px;height: 30px;"></image>
						<view class="distraction-t">主分段:{{tabsDetail.score_section}}</view>
					</view>
				</uni-col>
				<uni-col :span="12">
					<view  class="action-button" :class="[controlIndex==2?'action-current':'']" @click="controlClick(2)">
						<image src="../../static/images/schapp_examination/zgf.png" style="width: 30px;height: 30px;"></image>
						<view class="distraction-t">最高分:{{tabsDetail.max_score}}</view>
					</view>
				</uni-col>
				<uni-col v-if="selectType=='qk'" :span="12">
					<view  class="action-button" :class="[controlIndex==3?'action-current':'']" @click="controlClick(3)">
						<image src="../../static/images/schapp_examination/sxl.png" style="width: 30px;height: 30px;"></image>
						<view class="distraction-t">{{tabsDetail.pass_name}}:{{tabsDetail.pass_radio}}%</view>
					</view>
				</uni-col>
				<uni-col :span="12">
					<view  class="action-button" :class="[controlIndex==4?'action-current':'']" @click="controlClick(4)">
						<image src="../../static/images/schapp_examination/jtb.png" style="width: 30px;height: 30px;"></image>
						<view class="distraction-t">进退比:{{tabsDetail.ranking_step}}</view>
					</view>
				</uni-col>
			</uni-row>
			<uni-row>
				<uni-col>
					<view class="description">
						<view class="des-detail">
							{{description}}
						</view>
					</view>
				</uni-col>
			</uni-row>
			<uni-row>
				<uni-col>
					<view class="echarts-div">
						<h4 v-if="controlIndex===0" style="text-align: center;color: #6d6d6d;">—— 各班级均分统计 ——</h4>
						<h4 v-if="controlIndex===1" style="text-align: center;color: #6d6d6d;">—— 各分段占比统计 ——</h4>
						<h4 v-if="controlIndex===2" style="text-align: center;color: #6d6d6d;">—— 年级排名 ——</h4>
						<h4 v-if="controlIndex===3" style="text-align: center;color: #6d6d6d;">—— 上线率统计 ——</h4>
						<h4 v-if="controlIndex===4" style="text-align: center;color: #6d6d6d;">—— 各班级进退步学生统计 ——</h4>
						<qiun-data-charts v-if="controlIndex===0" type="column" :chartData="chartData0" @getIndex="getIndexZ"/><!-- 柱状图-->
						<qiun-data-charts v-if="controlIndex===1" type="ring" :chartData="chartData1" background="none" @getIndex="getIndexB"/><!-- 饼图-->
						<uni-list v-if="controlIndex===2" :border="false" style="margin-top: 10px;">
							<uni-list-item :key="index" v-for="(model,index) in zgfDetail.list" :border="true">
								<text slot="body" class="slot-box slot-text">
									<uni-row  style="width: 100vw;padding: 0 15px;">
										<uni-col :span="6"><view class="detail-text">{{model.stu_name}}</view></uni-col>
										<uni-col :span="6"><view class="detail-text">{{model.cls_name}}</view></uni-col>
										<uni-col :span="10"><view class="detail-text">总分：{{model.score}}</view></uni-col>
										<uni-col :span="2">
											<image class="zgf-ul" v-if="index==0" src='../../static/images/schapp_examination/1.png'></image>
											<image class="zgf-ul" v-else-if="index==1" src='../../static/images/schapp_examination/2.png'></image>
											<image class="zgf-ul" v-else-if="index==2" src='../../static/images/schapp_examination/3.png'></image>
											<image class="zgf-ul" v-else-if="index==3" src='../../static/images/schapp_examination/4.png'></image>
											<image class="zgf-ul" v-else-if="index==4" src='../../static/images/schapp_examination/5.png'></image>
										</uni-col>
									</uni-row>
								</text>
							</uni-list-item>
						</uni-list>
						<qiun-data-charts v-if="controlIndex===3" type="ring" :chartData="chartData3" background="none"/><!-- 饼图-->
						<qiun-data-charts v-if="controlIndex===4" type="column" :chartData="chartData4" background="none"/><!-- 柱状图-->
						
						<view v-if="controlIndex===0" class="tl-bottom">点击圆柱查看对应班级学生成绩详情</view>
						<view v-if="controlIndex===1" class="tl-bottom">点击饼图查看对应分段学生成绩详情</view>
					</view>
				</uni-col>
			</uni-row>
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
				tabBarItem:{},
				controlIndex:0,
				selectType: '', ////查询类型 qk 全科考情 dk 单科考情 第一次进入页面默认为qk
				titleName: '',
				pjfList:[],
				zfdList:[],
				tabsDetail: '', //tab栏数据
				pjfDetail: '', //平均分接口返回的详情数据
				zfdDetail: '', //主分段接口返回的详情数据
				zgfDetail: '', //最高分接口返回的详情数据
				sxlDetail: '', //上线率接口返回的详情数据
				jtbDetail: '', //进退比接口返回的详情数据
				description: '', //中间的介绍
				chartData0: {},//平均分图表数据
				chartData1:{},//主分段图表数据
				chartData3:{},//上线率图表数据
				chartData4:{},//进退比图表数据
			}
		},
		methods: {
			controlClick(type){//tab按钮点击事件
				if(this.controlIndex!==type){
					this.controlIndex=type
					switch (type){
						case 0:
							let obj = this.pjfDetail
							if (obj != '') {
								let des = `本次考试共有${obj.cls_count}个班，合计${obj.stu_count}人次参加考试，平均分${obj.avg_score}分`
								this.description = des
							}
						break;
						case 1:
							var obj2 = this.zfdDetail
							if (obj2 != '') {
								let des =`${obj2.max_name}分段占比最大，达${obj2.max_radio}%，合计${obj2.max_num}人；${obj2.min_name}分段占比最低，为${obj2.min_radio}%，合计${obj2.min_num}人，需要重点关注`
								this.description = des
							}
						break;
						case 2:
							var obj3 = this.zgfDetail
							if (obj3 != '') {
								let des =`年级最高分${obj3.max_score},最低分${obj3.min_score}，年级排名前10的学生有${obj3.stu_count}人在${obj3.cls_name}班`
								this.description = des
							}
						break;
						case 3:
							var obj4 = this.sxlDetail
							if (obj4 != '') {
								let des =`本次考试${obj4.max_name}上线率最高，为${obj4.max_radio}%，合计${obj4.max_num}人，${obj4.min_name}最低，为${obj4.min_radio}%，合计${obj4.min_num}人`
								this.description = des
							}
						break;
						case 4:
							var obj5 = this.jtbDetail
							if (obj5 != '') {
								let des = `${obj5.max_up_cls_name==null?0:obj5.max_up_cls_name}班进步人数最多，合计${obj5.max_up_num==null?0:obj5.max_up_num}人；${obj5.max_down_cls_name==null?0:obj5.max_down_cls_name}退步人数最多，合计${obj5.max_down_num==null?0:obj5.max_down_num}人；`
								if (obj5.max_up_cls_name == null && obj5.max_down_cls_name == null) {
									des = `本次考试没有进步和退步的学生；`
								} else if (obj5.max_up_cls_name != null && obj5.max_down_cls_name == null) {
									des = `${obj5.max_up_cls_name}班进步人数最多，合计${obj5.max_up_num}人；本次考试没有退步的学生；`
								} else if (obj5.max_up_cls_name == null && obj5.max_down_cls_name != null) {
									des = `本次考试没有进步的学生；${obj5.max_down_cls_name}班退步人数最多，合计${obj5.max_down_num}人；`
								}
								this.description = des
							}
						break;
					}
					 
				}
			},
			getIndexZ(e){//柱状图点击事件
			  let item=this.pjfList[e.currentIndex.index]
			  item.id=this.tabBarItem.id
			  item.name=this.tabBarItem.name
			  item.index_code=this.index_code
			  item.selectType=this.tabBarItem.selectType
			  item.sub_code=this.tabBarItem.sub_code
			  util.openwithData('/pages/examination/formDetailAvg',item)
			},
			getIndexB(e){//饼图点击事件
			  let item=this.zfdList[e.currentIndex]
			  item.id=this.tabBarItem.id
			  item.fsd_code = item.name;
			  item.newname=this.tabBarItem.name
			  item.index_code=this.index_code
			  item.selectType=this.tabBarItem.selectType
			  item.cls_code = this.tabBarItem.cls_code;
			  item.sub_code=this.tabBarItem.sub_code
			  util.openwithData('/pages/examination/formDetailSec',item)
			},
			getDetail() {//获取tab详情数据
				let comData = {
					id: this.tabBarItem.id, //考试id
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_EXAMINATION+'detail',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					this.hideLoading()
					this.tabsDetail = response
				})
			},
			getPjfDetail() {//平均分详情
				let comData = {
					id: this.tabBarItem.id, //考试id
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_EXAMINATION+'clsAvgScore',comData,response=>{
					this.hideLoading()
					this.pjfDetail = response
					//解析list 形成图表
					let list = response.list;
					this.pjfList=list
					let nameList = [];
					let valueList = [];
					list.map(function(item) {
						nameList.push(item.cls_name)
						valueList.push(parseFloat(item.avg_score))
					})
					let data={
						categories: nameList,
						series: [{name: "平均分",data: valueList}]
					}
					let that=this
					setTimeout(function() {that.chartData0 = data;}, 150);
					let des =`本次考试共有${response.cls_count?response.cls_count:0}个班，合计${response.stu_count?response.stu_count:0}人次参加考试，平均分${response.avg_score?response.avg_score:0}分`
					this.description = des
				})
			},
			getZfdDetail() {//分数段详情
				let comData = {
					id: this.tabBarItem.id, //考试id
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_EXAMINATION+'scoreSection',comData,response=>{
				    console.log("responseaaagetZfdDetail: " + JSON.stringify(response));
					this.hideLoading()
					this.zfdDetail = response
					//解析list 形成图表 
					let list = response.list;
					this.zfdList=list
					let nameList = [];
					let valueList = [];
					list.map(function(item) {
						let name = item.name + '\xa0\xa0' + item.radio + '%' + '\xa0\xa0' + item.num + '人';
						nameList.push(name)
						let obj = {}
						console.log(item)
						obj.data = item.radio
						obj.name = name
						valueList.push(obj)
					})
					let data={series: valueList}
					this.chartData1 = data;
				})
			},
			getZgfDetail() {//最高分详情
				let comData = {
					id: this.tabBarItem.id, //考试id
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_EXAMINATION+'stuScore',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					this.hideLoading()
					this.zgfDetail = response
				})
			},
			getSxlDetail() {//上线率详情
				let comData = {
					id: this.tabBarItem.id, //考试id
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_EXAMINATION+'passRate',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					this.hideLoading()
					this.sxlDetail = response
					//解析list 形成图表
					let list = response.list;
					let nameList = [];
					let valueList = [];
					list.map(function(item) {
						let name = item.name + '\xa0\xa0' + item.radio + '%' + '\xa0\xa0' + item.num + '人';
						nameList.push(name)
						let obj = {}
						obj.data = item.radio
						obj.name = name
						valueList.push(obj)
					})
					let data={series: valueList}
					this.chartData3 = data;
				})
			},
			getJtbDetail() {//进退比详情
				let comData = {
					id: this.tabBarItem.id, //考试id
					index_code: this.index_code,
				}
				this.post(this.globaData.INTERFACE_EXAMINATION+'rankingStep',comData,response=>{
				    console.log("responseaaa: " + JSON.stringify(response));
					this.hideLoading()
					this.jtbDetail = response
					let list = response.list;
					let nameList = [];
					let upList = [];
					let downList = [];
					list.map(function(item) {
						nameList.push(item.cls_name)
						upList.push(item.up)
						downList.push(item.down)
					})
					let data={
						categories: nameList,
						series: [{name: "进步人数",data: upList},{name: "退步人数",data: downList},]
					}
					this.chartData4 = data;
				})
			}
		},
		components: {
			mynavBar
		},
		onLoad(options) {
			this.personInfo = util.getPersonal();
			const itemData = util.getPageData(options);
			itemData.index=100
			itemData.text='详情'
			this.tabBarItem = itemData;
			this.index_code=itemData.index_code
			this.selectType=itemData.selectType
			setTimeout(()=>{
				this.showLoading()
				this.getDetail()
				this.getPjfDetail()
				this.getZfdDetail()
				this.getZgfDetail()
				if(itemData.selectType=='qk'){
					this.getSxlDetail()
				}
				this.getJtbDetail()
			},100)
			//#ifndef APP-PLUS
				document.title=""
			//#endif
		},
	}
</script>

<style>
	.action-button{
		margin: 5px;
		height: 45px;
		padding: 5px 0 5px 5px;
		display: flex;
		align-items: center;
		border: 1px solid #D6D9DA;
		border-radius: 15px;
		
	}
	.charts-box {
		width: 100%;
		height: 300px;
	}
	.distraction-t{
		flex: 1;
		text-align: center;
		font-size: 13px;
	}
	.action-current{
		background-color: #D8ECF3;
	}
	
	.description {
		margin: 0.3125rem -15px 0;
		min-height: 3rem;
		border-radius: 1.3375rem;
		background-color: rgba(216, 236, 243, 1);
	}
	
	.des-detail {
		padding: 0.3125rem 0.9375rem;
		font-size:13px;
		min-height: 3rem;
		margin: auto;
		width: 80%;
		background-color: #FFFFFF;
		border-bottom: 0.1875rem solid rgba(0, 153, 204, 1);
	}
	.echarts-div {
		box-shadow: 0rem 0rem 0.42rem 0rem rgba(0, 0, 0, 0.5);
		margin: 0.5rem -15px 0;
		padding-top: 0.625rem;
	}
	.tl-bottom{
		font-size: 13px;
		color: #C33531;
		height: 50px;
		display: flex;
		align-items: center;
		justify-content: space-around;
	}
	.detail-text{
		color: #828282;
		font-weight: 400;
		font-size: 14px;
		margin: 3px 0;
	}
	.zgf-ul {
		width: 20px;
		height:20px;
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
	::v-deep .uni-list-item__container{
		padding:8px ;
	}
</style>