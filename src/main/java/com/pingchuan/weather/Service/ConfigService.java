package com.pingchuan.weather.Service;

import com.pingchuan.weather.Model.Config;
import com.github.pagehelper.PageInfo;


public interface ConfigService{

    void insert(Config config);
    
    void delete(Config config);
    
    void updateById(Config config);
    
    PageInfo<Config> findAllByPage(int pageNum, int pageSize);
}