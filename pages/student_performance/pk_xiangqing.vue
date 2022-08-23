<template>
	<view>
		<h4 class="examName">{{itemData.name}}</h4>
		<view style="text-align: center;padding: 30px 10px;">
			<uni-row>
				<uni-col :span="10">
					<image :src="personInfo.img_url"
						style="width: 120px;height: 120px;object-fit: cover;border-radius: 50%;"></image>
				</uni-col>
				<uni-col :span="4">
					<image src="/static/images/student_performance/vs.png"
						style="width: 70px;height: 70px;object-fit: cover;margin-top: 25px;"></image>
				</uni-col>
				<uni-col :span="10">
					<image :src="itemData.img_url"
						style="width: 120px;height: 120px;object-fit: cover;border-radius: 50%;"></image>
				</uni-col>
			</uni-row>
		</view>
		<h4 class="spaceLine">总分</h4>
		<view style="text-align: center;font-size: 27px;font-weight: 900;">
			<span v-if="itemData.my_score==itemData.pk_user_score" style="color: #FDD60C;">平</span>
			<span v-if="itemData.my_score>itemData.pk_user_score" style="color: #008080;">胜</span>
			<span v-if="itemData.my_score<itemData.pk_user_score" style="color: red;">败</span>
		</view>
		<view style="height: 2px;background-color: #B5E9E5;margin: 10px 10px 0 10px;"></view>
		<view>
			<uni-row style="display: flex;align-items: center;">
				<uni-col :span="8" style="display: flex;align-items: center;flex-direction: column;">
					<view class="scoreOrderBorder">{{itemData.my_score}}</view>
					<view class="scoreOrderName">我的总分</view>
				</uni-col>
				<uni-col :span="8" style="text-align: center;">
					<image src="/static/images/student_performance/pk.png"
						style="width: 120px;height: 70px;margin-top: 25px;"></image>
				</uni-col>
				<uni-col :span="8" style="display: flex;align-items: center;flex-direction: column;">
					<view class="scoreOrderBorder">{{itemData.pk_user_score}}</view>
					<view class="scoreOrderName">{{itemData.pk_user_name}}的总分</view>
				</uni-col>
			</uni-row>
		</view>
		<h4 class="spaceLine" style='margin-top: 15px;'>各科</h4>
		<view style="text-align: center;font-weight: 900;">
			<span style="color: red;font-size: 25px;">{{itemData.pkb}}</span><span
				style="color: red;font-size: 27px;">胜</span>
			<span style="color: #FDD60C;font-size: 25px;">{{itemData.pka}}</span><span
				style="color: #FDD60C;font-size: 27px;">平</span>
			<span style="color: #008080;font-size: 25px;">{{itemData.pkc}}</span><span
				style="color: #008080;font-size: 27px;">败</span>
			</div>
		</view>
		<view style="height: 2px;background-color: #B5E9E5;margin: 10px 10px 0 10px;"></view>
		<view style="text-align: center;padding: 10px;">
			<uni-row>
				<uni-col :span="4">
					<view style="width: 10px;height: 10px;"></view>
				</uni-col>
				<uni-col :span="6">
					<view style="font-size: 13px;text-align: center;color: #DB5050;">我的成绩</view>
				</uni-col>
				<uni-col :span="2">
					<view style="width: 10px;height: 10px;"></view>
				</uni-col>
				<uni-col :span="8">
					<view style="font-size: 13px;text-align: center;color: #5199E9;">{{itemData.pk_user_name}}的成绩</view>
				</uni-col>
				<uni-col :span="4">
					<view style="width: 10px;height: 10px;"></view>
				</uni-col>
			</uni-row>
			<uni-row v-for="(item,index) in itemData.sub_score_list" :key='index' style="margin-top: 10px;">
				<uni-col :span="4">
					<view style="font-size: 13px;">{{item.sub_name}}</view>
				</uni-col>
				<uni-col :span="6">
					<view style="font-size: 13px;text-align: center;color: #DB5050;">{{item.my_score}}</view>
				</uni-col>
				<uni-col :span="2">
					<view style="font-size: 13px;">vs</view>
				</uni-col>
				<uni-col :span="8">
					<view style="font-size: 13px;text-align: center;color: #5199E9;">{{item.pk_user_score}}</view>
				</uni-col>
				<uni-col :span="4">
					<view style="font-size: 13px;">
						<template v-if="item.my_score>item.pk_user_score">
							<view style="color: #DB5050;" class="subResult">胜</view>
						</template>
						<template v-else-if="item.my_score<item.pk_user_score">
							<view style="color: #DB5050;" class="subResult">败</view>
						</template>
						<template v-else-if="item.my_score==item.pk_user_score">
							<view style="color: #FDD60C;" class="subResult">平</view>
						</template>
					</view>
				</uni-col>
			</uni-row>
		</view>
	</view>
</template>

<script>
	import util from '@/commom/util.js';
	export default {
		data() {
			return {
				personInfo: {},
				itemData: {},
			}
		},
		onLoad(option) {
			this.personInfo = util.getPersonal();
			console.log('this.personInfo:' + JSON.stringify(this.personInfo));
			this.itemData = util.getPageData(option);
			this.itemData.text = '成绩PK详情';
			console.log('this.itemData:' + JSON.stringify(this.itemData));
			uni.setNavigationBarTitle({
				title: this.itemData.text
			});
			//#ifdef H5
			document.title = ""
			//#endif
			// 
			this.getUserInfo();
		},
		onShow() {
			//#ifdef H5
			document.title = ""
			//#endif
		},
		methods: {
			getUserInfo() {
				let comData = {
					user_codes: this.itemData.pk_user_code,
					index_code: 'index',
				}
				this.showLoading();
				this.post(this.globaData.INTERFACE_SSO_SUB + 'user/getUserInfo', comData, (data0, data) => {
					this.hideLoading();
					if (data.code == 0) {
						this.$set(this.itemData, 'img_url', data.data.list[0].img_url);
					} else {
						this.showToast(data.msg);
					}
				});
			}
		}
	}
</script>

<style>
	.examName {
		text-align: center;
		margin-top: 20px;
		margin-left: 20px;
		margin-right: 20px;
	}

	/* 间隔 */
	.spaceLine {
		margin-top: 0px;
		margin-bottom: 10px;
		text-align: center;
		padding-top: 10px;
		padding-bottom: 10px;
		background: #d7f3ef;
		font-size: 14px;
		color: #505050;
	}

	/* 班级、年级排名边框 */
	.scoreOrderBorder {
		width: 60px;
		height: 60px;
		border: 1px solid;
		border-radius: 50%;
		color: #00CFBD;
		margin-top: 40px;
		text-align: center;
		line-height: 60px;
		vertical-align: middle;
	}

	/* 班级、年级排名 */
	.scoreOrder {
		color: red;
		height: 60px;
		line-height: 60px;
		vertical-align: middle;
		font-size: 16px;
		text-align: center;
		border: 1px solid;
		border-radius: 50%;
		color: #00CFBD;
		width: 60px;
		height: 60px;
	}

	/* 班级、年级排名名字 */
	.scoreOrderName {
		font-size: 13px !important;
		margin-top: 5px;
		width: 100%;
		text-align: center;
	}

	.subResult {
		width: 20px;
		height: 20px;
		border: 1px solid;
		border-radius: 50%;
		margin-top: 0px;
		text-align: center;
		line-height: 20px;
		vertical-align: middle;
	}
</style>
