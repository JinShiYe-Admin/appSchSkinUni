<template>
	<view>
		<mynavBar ref="mynavBar" :navItem='tabBarItem' :personInfo='personInfo'></mynavBar>
		<view class="tabs">
			<uni-row>
				<uni-col :span="8">
					<picker class="flex-box" @change="termClick" :value="tremIndex" :range="tremArray" range-key="name">
						<uni-easyinput-select  :inputBorder="false" suffixIcon="arrowdown" disabled :value="tremArray[tremIndex].name" ></uni-easyinput-select>
					</picker>
				</uni-col>
				<uni-col :span="8">
					<picker class="flex-box" @change="courseClick" :value="subIndex" :range="subArray" range-key="sub_name">
						<uni-easyinput-select  :inputBorder="false" suffixIcon="arrowdown" disabled :value="subArray[subIndex].sub_name" ></uni-easyinput-select>
					</picker>
				</uni-col>
				<uni-col :span="8">
					<picker class="flex-box" @change="statusClick" :value="statusIndex" :range="statusArray" range-key="name">
						<uni-easyinput-select  :inputBorder="false" suffixIcon="arrowdown" disabled :value="statusArray[statusIndex].name" ></uni-easyinput-select>
					</picker>
				</uni-col>
			</uni-row>
			<view class="select-line"></view>
			<view class="uni-flex">
				<uni-datetime-picker border="false" start-placeholder="2021-3-20" end-placeholder="2021-5-20" v-model="range" type="daterange" start="2021-3-20" end="2021-5-20" rangeSeparator="至" />
			</view>
		</view>
		<view>
			<view  style="padding-top: 85px;">
				<view :key="item" v-for="item in 100" >{{item}}</view>
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
				
				tremIndex:0,
				subIndex:0,
				statusIndex:0,
				tremArray: [{name:'全部年级',value:''}],
				subArray: [{sub_name:'全部班级',sub_code:''}],
				statusArray: [{name:'全部学生',value:''},{name:'未做',value:1},{name:'已做',value:2},{name:'已评',value:3}],
			}
		},
		methods: {
			termClick:function(e){
				console.log("e.detail.value: ",e.detail.value);
				if(this.tremIndex!==e.detail.value){
					 
				}
			},
			courseClick:function(e){
				console.log("e.detail.value: ",e.detail.value);
				if(this.subIndex!==e.detail.value){
				 
				}
			},
			statusClick:function(e){
				console.log("e.detail.value: ",e.detail.value);
				if(this.statusIndex!==e.detail.value){
					 
				}
			},
			startTime:function(){
				console.log(123);
			},
			endTime:function(){
				console.log(321);
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
			},500)
			//#ifndef APP-PLUS
				document.title=""
			//#endif
		}
	}
</script>

<style>
	.tabs {
		width: 100vw;
		position: fixed;
	    background-color: #FFFFFF;
		padding: 3px 3px 0;
		z-index: 10;
		/* #ifndef APP-PLUS */
		top: 44px;
		/* #endif */
		/* #ifdef APP-PLUS */
		right: 3px;
		/* #endif */
	}
	
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
	
	 
</style>
