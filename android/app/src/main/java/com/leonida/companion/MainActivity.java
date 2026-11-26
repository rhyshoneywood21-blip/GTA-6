package com.leonida.companion;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.*;
import android.widget.Toast;
import android.view.View;
import android.view.WindowInsets;
import androidx.webkit.WebViewAssetLoader;
import androidx.webkit.WebViewCompat;
import androidx.webkit.WebViewFeature;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.Collections;

public class MainActivity extends Activity {
    private static final String HOST="appassets.androidplatform.net";
    private static final String ORIGIN="https://"+HOST;
    private static final int PICK=11, EXPORT=12;
    private WebView web;
    private ValueCallback<Uri[]> chooser;
    private String pendingExport;

    @Override public void onCreate(Bundle saved){
        super.onCreate(saved);
        web=new WebView(this);
        web.setBackgroundColor(0xff151020);
        setContentView(web);
        web.setOnApplyWindowInsetsListener((v,insets)->{
            if(android.os.Build.VERSION.SDK_INT>=30){
                android.graphics.Insets a=insets.getInsets(WindowInsets.Type.systemBars()|WindowInsets.Type.displayCutout());
                v.setPadding(a.left,a.top,a.right,a.bottom);
            }
            return insets;
        });
        web.requestApplyInsets();
        WebSettings s=web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setAllowFileAccess(false);
        s.setAllowContentAccess(true);
        s.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        s.setSupportMultipleWindows(false);
        s.setJavaScriptCanOpenWindowsAutomatically(false);
        s.setBuiltInZoomControls(false);
        CookieManager.getInstance().setAcceptThirdPartyCookies(web,false);
        WebViewAssetLoader loader=new WebViewAssetLoader.Builder()
            .addPathHandler("/assets/",new WebViewAssetLoader.AssetsPathHandler(this)).build();
        web.setWebViewClient(new WebViewClient(){
            @Override public WebResourceResponse shouldInterceptRequest(WebView v, WebResourceRequest req){
                return loader.shouldInterceptRequest(req.getUrl());
            }
            @Override public boolean shouldOverrideUrlLoading(WebView v, WebResourceRequest req){
                if(!req.isForMainFrame())return false;
                Uri u=req.getUrl();
                if("https".equals(u.getScheme()) && HOST.equals(u.getHost()) && u.getPath()!=null && u.getPath().startsWith("/assets/"))return false;
                if("https".equals(u.getScheme())){try{startActivity(new Intent(Intent.ACTION_VIEW,u));}catch(Exception e){toast("No browser available");}}
                return true;
            }
        });
        web.setWebChromeClient(new WebChromeClient(){
            @Override public boolean onShowFileChooser(WebView v, ValueCallback<Uri[]> cb, FileChooserParams p){
                if(chooser!=null)chooser.onReceiveValue(null);
                chooser=cb;
                Intent i=new Intent(Intent.ACTION_OPEN_DOCUMENT);
                i.addCategory(Intent.CATEGORY_OPENABLE);i.setType("application/json");
                try{startActivityForResult(i,PICK);}catch(Exception e){chooser.onReceiveValue(null);chooser=null;toast("No file picker");}
                return true;
            }
        });
        if(WebViewFeature.isFeatureSupported(WebViewFeature.WEB_MESSAGE_LISTENER)){
            WebViewCompat.addWebMessageListener(web,"AndroidBackup",Collections.singleton(ORIGIN),
                (v,message,sourceOrigin,isMainFrame,replyProxy)->{
                    if(!isMainFrame||!HOST.equals(sourceOrigin.getHost())||!"https".equals(sourceOrigin.getScheme()))return;
                    String json=message.getData();
                    if(json==null||json.length()>4_000_000){toast("Backup exceeds limit");return;}
                    try{new org.json.JSONObject(json);}catch(Exception e){toast("Invalid backup");return;}
                    runOnUiThread(()->{
                        pendingExport=json;Intent i=new Intent(Intent.ACTION_CREATE_DOCUMENT);
                        i.addCategory(Intent.CATEGORY_OPENABLE);i.setType("application/json");
                        i.putExtra(Intent.EXTRA_TITLE,"leonida-progress.json");
                        try{startActivityForResult(i,EXPORT);}catch(Exception e){pendingExport=null;toast("No file picker");}
                    });
                });
        }
        web.loadUrl(ORIGIN+"/assets/index.html");
    }
    @Override protected void onActivityResult(int req,int result,Intent data){
        super.onActivityResult(req,result,data);
        Uri u=result==RESULT_OK&&data!=null?data.getData():null;
        if(req==PICK&&chooser!=null){chooser.onReceiveValue(u==null?null:new Uri[]{u});chooser=null;}
        if(req==EXPORT){String json=pendingExport;pendingExport=null;if(u!=null&&json!=null){try(OutputStream out=getContentResolver().openOutputStream(u,"wt")){if(out==null)throw new java.io.IOException();out.write(json.getBytes(StandardCharsets.UTF_8));toast("Backup saved");}catch(Exception e){toast("Backup failed");}}}
    }
    private void toast(String text){Toast.makeText(this,text,Toast.LENGTH_SHORT).show();}
    @Override public void onBackPressed(){
        if(web.canGoBack())web.goBack();else web.evaluateJavascript("if(typeof go==='function')go('home')",null);
    }
    @Override protected void onDestroy(){if(chooser!=null){chooser.onReceiveValue(null);chooser=null;}if(web!=null){web.stopLoading();web.destroy();}super.onDestroy();}
}
