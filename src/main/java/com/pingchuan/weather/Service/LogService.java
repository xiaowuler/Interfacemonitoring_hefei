package com.pingchuan.weather.Service;

import com.pingchuan.weather.Model.Log;
import com.github.pagehelper.PageInfo;


public interface LogService{

    void insert(Log log);
    
    void delete(Log log);
    
    void updateById(Log log);
    
    PageInfo<Log> findAllByPage(int pageNum, int pageSize);
}