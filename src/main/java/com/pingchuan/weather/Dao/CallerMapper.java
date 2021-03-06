package com.pingchuan.weather.Dao;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import com.pingchuan.weather.Model.Caller;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface CallerMapper {

    void insert(Caller caller);
    
    void delete(Caller caller);
    
    void updateById(Caller caller);
    
    List<Caller> findAll(@Param("startIndex") int startInde, @Param("total") int total);

    Caller findOneById(@Param("code") String code);
}