package com.pingchuan.weather.Dao;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import com.pingchuan.weather.Model.Config;

@Mapper
public interface ConfigMapper {

    void insert(Config config);
    
    void delete(Config config);
    
    void updateById(Config config);
    
    List<Config> findAll();
}