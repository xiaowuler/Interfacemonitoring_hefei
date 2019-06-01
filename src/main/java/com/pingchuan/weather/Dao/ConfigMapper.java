package com.pingchuan.weather.Dao;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import com.pingchuan.weather.Model.Config;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface ConfigMapper {

    void insert(Config config);
    
    void delete(Config config);
    
    void updateById(Config config);
    
    List<Config> findAll(@Param("startIndex") int startInde, @Param("total") int total);

    Config findOneById(int id);

    Config findOneByName(String name);
}