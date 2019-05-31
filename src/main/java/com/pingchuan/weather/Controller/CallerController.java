package com.pingchuan.weather.Controller;

import com.github.pagehelper.PageInfo;

import com.pingchuan.weather.Model.PageResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pingchuan.weather.Model.Caller;
import com.pingchuan.weather.Service.CallerService;

import java.util.List;

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
    public void delete(Caller caller){
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
    public PageResult<Caller> findAllByPage(int pageNum, int pageSize){
        return callerService.findAllByPage(pageNum, pageSize);
    }

    @RequestMapping("/insertOne")
    public void insertOne(String name, String code, String key, byte enable){
        callerService.insertOne(name, code, key, enable);
    }

    @RequestMapping("/findAllByEnable")
    public List<Caller> findAllByEnable(){
        return callerService.findAllByEnable();
    }
}
