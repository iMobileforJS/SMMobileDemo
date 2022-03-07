package com.rn;

import android.content.Intent;
import android.content.res.Configuration;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.Settings;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.supermap.RNUtils.FileTools;
import com.supermap.RNUtils.Utils;
import com.supermap.interfaces.utils.SLocation;

public class AppUtils extends ReactContextBaseJavaModule {
    private static ReactContext mReactContext;
    public static final String SDCARD = android.os.Environment.getExternalStorageDirectory().getAbsolutePath();

    public AppUtils(ReactApplicationContext reactContext) {
        super(reactContext);
        mReactContext=reactContext;
    }

    @Override
    public String getName() {
        return "AppUtils";
    }
    @ReactMethod
    public void AppExit(Promise promise){
        try {
            SLocation.closeGPS();
            AppManager.getAppManager().AppExit(getReactApplicationContext());
            promise.resolve(true);
        } catch (Exception e) {
            promise.resolve(false);
        }
    }

    @ReactMethod
    public void isPad(Promise promise) {
        try {
            Boolean res =  (mReactContext.getResources().getConfiguration().screenLayout & Configuration.SCREENLAYOUT_SIZE_MASK) >= Configuration.SCREENLAYOUT_SIZE_LARGE;
            promise.resolve(res);
        } catch (Exception e) {
            promise.resolve(false);
        }
    }

    /**
     * android 11 external storage 读写权限申请code
     */
    public static final int REQUEST_CODE = 1234;

    static Promise permissionPromise;

    public static void onPermissionResult(boolean result) {
        if(permissionPromise != null) {
            permissionPromise.resolve(result);
            permissionPromise = null;
        }
    }

    @ReactMethod
    public void requestStoragePermissionR(Promise promise) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                // 先判断有没有权限
                if (Environment.isExternalStorageManager()) {
                    promise.resolve(true);
                } else {
                    Intent intent = new Intent(Settings.ACTION_MANAGE_APP_ALL_FILES_ACCESS_PERMISSION);
                    intent.setData(Uri.parse("package:" + mReactContext.getPackageName()));
                    mReactContext.getCurrentActivity().startActivityForResult(intent, REQUEST_CODE);
                    permissionPromise = promise;
                }
            } else {
                promise.resolve(true);
            }
        } catch (Exception e) {
            promise.resolve(false);
        }
    }

    @ReactMethod
    public void copyAssetFileTo(String fileName, String toPath, Promise promise) {
        try {
            String originName = fileName;
            String defaultDataZip = fileName;
            Utils.copyAssetFileToSDcard(mReactContext, toPath, originName, defaultDataZip);
            if (Utils.fileIsExist(toPath + defaultDataZip)) {
                FileTools.unZipFile(toPath + defaultDataZip, toPath);
                promise.resolve(true);
            } else {
                promise.resolve(false);
            }
        } catch (Exception e) {
            promise.resolve(false);
        }
    }

}
