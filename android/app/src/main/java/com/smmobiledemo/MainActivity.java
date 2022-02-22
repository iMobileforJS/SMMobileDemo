package com.smmobiledemo;

import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.supermap.RNUtils.AppInfo;
import com.supermap.RNUtils.FileTools;
import com.supermap.RNUtils.Utils;

public class MainActivity extends ReactActivity {
  public static final String SDCARD = android.os.Environment.getExternalStorageDirectory().getAbsolutePath();

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "SMMobileDemo";
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    String userName = AppInfo.getUserName();
    String originName = "Navigation_EXAMPLE.zip";
    String defaultDataZip = "Navigation_EXAMPLE.zip";
    String rootName =  AppInfo.getRootPath();
    if (rootName.equals("")) {
      rootName = "SMMobileDemo";
    }
    String defaultDataPath = SDCARD + "/" + rootName + "/ExternalData/";
    Utils.copyAssetFileToSDcard(this, defaultDataPath, originName, defaultDataZip);
    if (Utils.fileIsExist(defaultDataPath + defaultDataZip)) {
      FileTools.unZipFile(defaultDataPath + defaultDataZip, defaultDataPath);
    }
  }
}
