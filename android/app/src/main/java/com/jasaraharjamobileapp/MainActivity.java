package com.jasaraharjamobileapp;

import com.facebook.react.ReactActivity;
import io.realm.react.RealmReactPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.ocetnik.timer.BackgroundTimerPackage;
import com.microsoft.codepush.react.CodePush;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import com.oblador.vectoricons.VectorIconsPackage;
import com.github.xinthink.rnmk.ReactMaterialKitPackage;
import com.babisoft.ReactNativeLocalization.ReactNativeLocalizationPackage;
import com.AirMaps.AirPackage;
import com.imagepicker.ImagePickerPackage;
import com.learnium.RNDeviceInfo.*;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.crashlytics.android.Crashlytics;
import com.crashlytics.android.answers.Answers;
import com.smixx.fabric.FabricPackage;
import io.fabric.sdk.android.Fabric;
import com.ivanph.webintent.RNWebIntentPackage;

import android.content.Intent;
import android.os.Bundle;
import java.util.Arrays;
import java.util.List;

public class MainActivity extends ReactActivity {

    private ReactNativePushNotificationPackage mReactNativePushNotificationPackage;

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "JasaRaharjaMobileApp";
    }
    @Override
    protected boolean getUseDeveloperSupport() {
        return BuildConfig.DEBUG;
    }
    @Override
    protected List<ReactPackage> getPackages() {
      mReactNativePushNotificationPackage = new ReactNativePushNotificationPackage(this);
      return Arrays.<ReactPackage>asList(
        new MainReactPackage(),
        new RealmReactPackage(),
        new RNDeviceInfo(),
        new BackgroundTimerPackage(),
        new CodePush(BuildConfig.CODEPUSH_KEY, this, BuildConfig.DEBUG), // Development App Push
        //new CodePush("4Lq9ZrNhIfTmNYkWcyJ0o7sbBfEeNJmQEL32l", this, BuildConfig.DEBUG), // Development App Push
        //new CodePush("aPIDhI5pJoF8EVCwl5HHH62t05eaNJmQEL32l", this, BuildConfig.DEBUG), // Staging App Push
        //new CodePush("5S9HZbdNCOc6RzD3k-JD-IBCWRcwNJmQEL32l", this, BuildConfig.DEBUG), // Production App Push
        new VectorIconsPackage(),
        new ReactMaterialKitPackage(),
        new ReactNativeLocalizationPackage(),
        new ImagePickerPackage(),
        new FabricPackage(this),
        new RNWebIntentPackage(),
        mReactNativePushNotificationPackage
      );
    }


   // Add onNewIntent
    @Override
    public void onNewIntent (Intent intent) {
      super.onNewIntent(intent);
      mReactNativePushNotificationPackage.newIntent(intent);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Fabric.with(this, new Crashlytics());
        Fabric.with(this, new Answers());
    }


    // for code push
    @Override
    protected String getJSBundleFile() {
        return CodePush.getBundleUrl();
    }


}
