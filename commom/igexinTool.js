var isAndorid, PushManager, context, Instance, GeTuiSdk;

function initGeXin() {
	if (plus.os.name == 'Android') {
		isAndorid = true;
	} else {
		isAndorid = false;
	}

	if (isAndorid) {
		PushManager = plus.android.importClass("com.igexin.sdk.PushManager");
		context = plus.android.runtimeMainActivity().getContext();
		Instance = PushManager.getInstance();
	} else {
		GeTuiSdk = plus.ios.importClass("GeTuiSdk");
	}
	return this
}

function bindAlias(alias) {
	if (isAndorid) {
		Instance.bindAlias(context, alias);
	} else {
		GeTuiSdk.bindAliasandSequenceNum(alias, alias);
	}
}

function unbindAlias(alias) {
	if (isAndorid) {
		Instance.unBindAlias(context, alias, true);
	} else {
		GeTuiSdk.unbindAliasandSequenceNumandIsSelf(alias, alias, true);
	}
}

function getVersion() {
	if (isAndorid) {
		return Instance.getVersion(context);
	} else {
		return GeTuiSdk.version();
	}
}

//开启推送  
function turnOnPush() {
	if (isAndorid) {
		Instance.turnOnPush(context);
	} else {
		console.log('开启了');
		GeTuiSdk.setPushModeForOff(false);
	}
	return this
}
//关闭推送  
function turnOffPush() {
	if (isAndorid) {
		Instance.turnOffPush(context);
	} else {
		GeTuiSdk.setPushModeForOff(true);
	}
}
module.exports = {
	initGeXin: initGeXin,
	bindAlias:bindAlias,
	unbindAlias:unbindAlias,
	getVersion:getVersion,
	turnOnPush:turnOnPush,
	turnOffPush:turnOffPush
}
