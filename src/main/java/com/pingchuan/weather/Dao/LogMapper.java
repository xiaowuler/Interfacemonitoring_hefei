package com.pingchuan.weather.Dao;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import com.pingchuan.weather.Model.Log;

@Mapper
public interface LogMapper {

    void insert(Log log);
    
    void delete(Log log);
    
    void updateById(Log log);
    
    List<Log> findAll();
}