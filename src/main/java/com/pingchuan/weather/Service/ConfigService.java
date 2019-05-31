package com.pingchuan.weather.Service;

import com.pingchuan.weather.Model.Config;
import com.github.pagehelper.PageInfo;
import com.pingchuan.weather.Model.PageResult;


public interface ConfigService{

    void insert(Config config);
    
    void delete(Config config);
    
    void updateById(Config config);

    PageResult<Config> findAllByPage(int pageNum, int pageSize);
}