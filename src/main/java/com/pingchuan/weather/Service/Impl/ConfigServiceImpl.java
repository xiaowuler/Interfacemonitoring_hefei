package com.pingchuan.weather.Service.Impl;

import java.util.List;
import com.github.pagehelper.PageInfo;
import com.github.pagehelper.PageHelper;

import com.pingchuan.weather.Model.PageResult;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import com.pingchuan.weather.Model.Config;
import com.pingchuan.weather.Dao.ConfigMapper;
import com.pingchuan.weather.Service.ConfigService;

@Service
@Transactional
public class ConfigServiceImpl implements ConfigService{

    @Autowired
    private ConfigMapper configMapper;

    public void insert(Config config){
        configMapper.insert(config);
    }
    
    public void delete(Config config){
        configMapper.delete(config);
    }
    
    public void updateById(Config config){
        configMapper.updateById(config);
    }
    
    public PageResult<Config> findAllByPage(int pageNum, int pageSize){
        List<Config> configs = configMapper.findAll();
        long count = configs.size();
        int startIndex = pageNum - 1;
        int endIndex = (pageSize + pageNum - 1) >= count ? configs.size() : (pageSize + pageNum - 1);
        return new PageResult<>(count, configs.subList(startIndex, endIndex));
    }

    @Override
    public Config findOneByName(String name) {
        return configMapper.findOneByName(name);
    }

    @Override
    public Config findOneById(int id) {
        return configMapper.findOneById(id);
    }
}