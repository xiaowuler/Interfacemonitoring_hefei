package com.pingchuan.weather.Dao;

import java.util.Date;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import com.pingchuan.weather.Model.Log;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface LogMapper {

    void insert(Log log);
    
    void delete(Log log);
    
    void updateById(Log log);
    
    List<Log> findAll(@Param("startIndex") int startInde, @Param("total") int total);

    List<Log> findAllLogName(@Param("startTime") long startTime, @Param("endTime") long endTime, @Param("startIndex") int startInde, @Param("total") int total);

    List<Log> getInfoOfWeekByInterface(@Param("name") String name, @Param("startTime") long startTime, @Param("endTime") long endTime);

    int findOneByToday(@Param("name") String name, @Param("startTime") long startTime, @Param("endTime") long endTime);

    List<Log> findOneByCount(@Param("name") String name, @Param("count") int count);

    List<Log> findAllLogNames();

    List<Log> findAllByCallerAndNameAndStateAndTime(@Param("name") String name, @Param("callerCode") String callerCode, @Param("startTime") long startTime, @Param("endTime") long endTime, @Param("state") int state);

    List<Log> findAllLogNameByCount(@Param("startTime") long startTime, @Param("endTime") long endTime);
}