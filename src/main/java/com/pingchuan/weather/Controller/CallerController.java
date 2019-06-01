package com.pingchuan.weather.Controller;


import cn.hutool.http.HttpRequest;
import com.pingchuan.weather.Model.PageResult;
import com.pingchuan.weather.Util.MD5Util;
import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pingchuan.weather.Model.Caller;
import com.pingchuan.weather.Service.CallerService;

import java.util.*;

@RestController
@RequestMapping("/caller")
public class CallerController{

    @Autowired
    private CallerService callerService;
    
    @RequestMapping("/insert")
    public void insert(Caller caller){
        callerService.insert(caller);
    }
    
    @RequestMapping("/delete")
    public void delete(String code){
        Caller caller = new Caller();
        caller.setCode(code);
        callerService.delete(caller);
    }
    
    @RequestMapping("/updateById")
    public void updateById(Caller caller){
        callerService.updateById(caller);
    }

    @RequestMapping("/update")
    public void update(String name, String code, String key, byte enable){
        callerService.update(name, code, key, enable);
    }
    
    @RequestMapping("/findAllByPage")
    public PageResult<Caller> findAllByPage(int page, int rows){
        return callerService.findAllByPage(page, rows);
    }

    @RequestMapping("/insertOne")
    public void insertOne(String name, String code, String key, byte enable){
        callerService.insertOne(name, code, key, enable);
    }

    @RequestMapping("/findAllByEnable")
    public List<Caller> findAllByEnable(){
        return callerService.findAllByEnable();
    }

    @RequestMapping("/sendRequest")
    public List<Caller> sendRequest(){

        //MD5Util.MD5()

        return null;
    }

    private Map<String, Object> SetParams(){
        Map<String, Object> map = new HashMap<>();
        map.put("ModeCode", "SPCC");
        map.put("ElementCode", "ER03");
        map.put("InitialTime", "201904162000");
        map.put("ForecastTime", "201904180736");
        map.put("MinLat", "0");
        map.put("MinLon", "110");
        map.put("MaxLat", "35");
        map.put("MaxLon", "115");
        map.put("ForecastLevel", "0");
        map.put("CallerCode", "SC001");
        map.put("SignCode", "c3d25ba29d7a573e82155b653efebdf");
        return map;
    }
}
