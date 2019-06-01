package com.pingchuan.weather.Dao;

import com.pingchuan.weather.DTO.LegendLevel;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface LegendLevelMapper {
    List<LegendLevel> findAll(String type);
}