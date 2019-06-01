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
        int count = configMapper.findAll(0, 0).size();
        List<Config> configs = configMapper.findAll((pageNum - 1) * pageSize, pageSize);
        return new PageResult<>(count, configs);
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