package com.rn;

import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.Intent;
import android.content.res.Configuration;
import android.location.LocationManager;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.Settings;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.supermap.RNUtils.AppInfo;
import com.supermap.RNUtils.FileTools;
import com.supermap.RNUtils.Utils;
import com.supermap.containts.EventConst;
import com.supermap.interfaces.utils.SLocation;

import java.util.Locale;

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
    public void AppExit(){
        SLocation.closeGPS();
        appManager.getAppManager().AppExit(getReactApplicationContext());

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
    public void copyAssetFileToSDcard(String fileName, String toPath, Promise promise) {
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

    private  boolean is64bitCPU() {
        String CPU_ABI = null;
        try {
            if (Build.VERSION.SDK_INT >= 23) {
                return android.os.Process.is64Bit();
            } else {
                return false;
            }
        }catch (Exception e) {
            return false;
        }
    }

    @ReactMethod
    public void is64Bit(Promise promise) {
        try {
            Boolean res =  is64bitCPU();//
            promise.resolve(res);
        } catch (Exception e) {
            promise.resolve(false);
        }
    }

     @ReactMethod
     public void getLocale(Promise promise) {
        try {
            Locale locale = Locale.getDefault();
            String language = locale.getLanguage();
            String contry = locale.getCountry();
            promise.resolve(language + '-'+ contry);
        } catch (Exception e) {
            promise.resolve("");
        }
     }

    @ReactMethod
    public void isLocationOpen(Promise promise) {
        LocationManager locationManager = (LocationManager) mReactContext.getSystemService(Context.LOCATION_SERVICE);
        promise.resolve(locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER));
    }


    @ReactMethod
    public void startAppLoactionSetting(Promise promise) {
        Intent intent = new Intent();
        intent.setAction(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        try{
            mReactContext.startActivity(intent);
            promise.resolve(true);
        } catch (ActivityNotFoundException e1){
            intent .setAction(Settings.ACTION_SETTINGS);
            try{
                mReactContext.startActivity(intent);
                promise.resolve(true);
            } catch (Exception e2) {
                promise.resolve(false);
            }
        }

    }

    @ReactMethod
    public void pause (int time, Promise promise){
        try {
            final int timeInMS = time * 1000;
            new Thread(new Runnable() {
                @Override
                public void run() {
                    try {
                        Thread.sleep(timeInMS);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    promise.resolve(true);
                }
            }).start();
        }catch (Exception e){
            promise.resolve(false);
        }
    }

    public static void sendShareResult(String result) {
        mReactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(EventConst.MESSAGE_SHARERESULT, result);
    }

}
