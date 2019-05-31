package com.pingchuan.weather.Controller;

import com.github.pagehelper.PageInfo;

import com.pingchuan.weather.Model.PageResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pingchuan.weather.Model.Config;
import com.pingchuan.weather.Service.ConfigService;

@RestController
@RequestMapping("/config")
public class ConfigController{

    @Autowired
    private ConfigService configService;
    
    @RequestMapping("/insert")
    public void insert(String name, String value, String description){
        Config config = new Config();
        config.setName(name);
        config.setValue(value);
        config.setDescription(description);
        configService.insert(config);
    }
    
    @RequestMapping("/delete")
    public void delete(int id){
        Config config = configService.findOneById(id);
        if (config == null)
            return;
        configService.delete(config);
    }
    
    @RequestMapping("/updateById")
    public void updateById(int id, String name, String value, String description){
        Config config = new Config();
        config.setId(id);
        config.setName(name);
        config.setValue(value);
        config.setDescription(description);
        configService.updateById(config);
    }
    
    @RequestMapping("/findAllByPage")
    public PageResult<Config> findAllByPage(int pageNum, int pageSize){
        return configService.findAllByPage(pageNum, pageSize);
    }
}
