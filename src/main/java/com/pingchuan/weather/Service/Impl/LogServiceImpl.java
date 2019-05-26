package com.pingchuan.weather.Service.Impl;

import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.*;

import com.github.pagehelper.PageInfo;
import com.github.pagehelper.PageHelper;

import com.pingchuan.weather.DTO.LogDTO;
import com.pingchuan.weather.Dao.CallerMapper;
import com.pingchuan.weather.Dao.ConfigMapper;
import com.pingchuan.weather.Model.Caller;
import com.pingchuan.weather.Model.Config;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import com.pingchuan.weather.Model.Log;
import com.pingchuan.weather.Dao.LogMapper;
import com.pingchuan.weather.Service.LogService;

@Service
@Transactional
public class LogServiceImpl implements LogService{

    @Autowired
    private LogMapper logMapper;

    @Autowired
    private ConfigMapper configMapper;

    @Autowired
    private CallerMapper callerMapper;

    public void insert(Log log){
        logMapper.insert(log);
    }
    
    public void delete(Log log){
        logMapper.delete(log);
    }
    
    public void updateById(Log log){
        logMapper.updateById(log);
    }
    
    public PageInfo<Log> findAllByPage(int pageNum, int pageSize){
        PageHelper.startPage(pageNum, pageSize);
        List<Log> logs = logMapper.findAll();
        return new PageInfo<>(logs);
    }

    @Override
    public List<LogDTO> findAllByDate() {
        List<LogDTO> logDTOS = new ArrayList<>();

        //准备参数
        String startTime = getTimeByDays(-7);
        String endTime = getTimeByDays(1);
        //Config failureRateConfig = configMapper.findOneById(3);
        //Config consumingAvgConfig = configMapper.findOneById(2);
        //Config healthStatusConfig = configMapper.findOneById(4);


        List<Log> logs = logMapper.findAllLogName(startTime, endTime);
        LogDTO logDTO ;
        for (Log log : logs){
            logDTO = new LogDTO();
            logDTO.setLog(log);
            logDTO = getInfoOfWeek(logDTO, startTime, endTime);
            logDTOS.add(logDTO);
        }

        return logDTOS;
    }

    @Override
    public PageInfo<LogDTO> findAllByState(int pageNum, int pageSize) {
        PageHelper.startPage(pageNum, pageSize);

        List<LogDTO> logDTOS = new ArrayList<>();
        //准备参数
        String startTime = getTimeByDays(-7);
        String endTime = getTimeByDays(1);
        String lastTime = getLastTime();
        Config successRateConfig = configMapper.findOneById(5);
        Config successConsumingAvgConfig = configMapper.findOneById(6);
        Config failureConsumingAvgConfig = configMapper.findOneById(6);

        List<Log> logs = logMapper.findAllLogName(startTime, endTime);
        LogDTO logDTO = null;
        for (Log log : logs){
            logDTO = new LogDTO();
            logDTO.setLog(log);
            //logDTO = getInfoOfWeek(logDTO, startTime, endTime);
            logDTO.setCallNumberDay(getTodayCallNumber(logDTO.getLog().getName(), startTime, lastTime));
            logDTO.setSuccessRate(getOneSuccessRate(successRateConfig, logDTO.getLog().getName()));
            logDTO.setSuccessConsumingAvg(getOneConsumingAvg(1, logDTO.getLog().getName(), Integer.parseInt(successConsumingAvgConfig.getValue())));
            logDTO.setFailureConsumingAvg(getOneConsumingAvg(0, logDTO.getLog().getName(), Integer.parseInt(failureConsumingAvgConfig.getValue())));
            logDTOS.add(logDTO);
        }

        return new PageInfo<>(logDTOS);
    }

    @Override
    public List<Log> findAllLogName() {
        return logMapper.findAllLogNames();
    }

    @Override
    public PageInfo<LogDTO> findAllByCallerAndNameAndStateAndTime(String name, int callerId, Date startTime, Date endTime, int state, int pageNum, int pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        List<Log> logs = logMapper.findAllByCallerAndNameAndStateAndTime(name, callerId, startTime, endTime, state);
        List<LogDTO> logDTOS = new ArrayList<>();

        for (Log log:
             logs) {
            LogDTO logDTO = new LogDTO();
            Long count = log.getEndTime().getTime() - log.getStartTime().getTime();
            count = count == 0 ? 500 : count;
            logDTO.setConsumingTime(count);
            Caller caller = callerMapper.findOneById(callerId);
            logDTO.setCallerName(caller.getName());
            logDTO.setLog(log);
            logDTOS.add(logDTO);
        }

        return new PageInfo<>(logDTOS);
    }

    private float getOneConsumingAvg(int flag, String name, int size) {
        List<Log> logs = logMapper.findOneByCount(name, size);

        long consumingTime = 0;
        for (Log log : logs){
            if (log.getIsSuccess() == flag)
            {
                Long count = log.getEndTime().getTime() - log.getStartTime().getTime();
                consumingTime += count == 0 ? 400 : count;
            }
        }

        DecimalFormat df=new DecimalFormat("0.00");
        return Float.parseFloat(df.format((float)consumingTime / size));
    }

    private float getOneSuccessRate(Config successRateConfig, String name) {
        int count = Integer.parseInt(successRateConfig.getValue());
        List<Log> logs = logMapper.findOneByCount(name, count);
        int successCount = 0;
        for (Log log : logs){
            if (log.getIsSuccess() == 1)
                successCount++;
        }

        DecimalFormat df=new DecimalFormat("0.00");
        return Float.parseFloat(df.format((float)successCount / count));
    }

    private int getTodayCallNumber(String name, String startTime, String endTime) {
        return logMapper.findOneByToday(name, startTime, endTime);
    }

    private String getLastTime(){
        Calendar calendar = Calendar.getInstance(TimeZone.getTimeZone("GMT+08:00"));
        calendar.set(calendar.get(Calendar.YEAR), calendar.get(Calendar.MONTH), calendar.get(Calendar.DAY_OF_MONTH), 0, 0, 0);
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        return sdf.format(calendar.getTime());
    }

    private String getTimeByDays(int days){
        Calendar calendar = Calendar.getInstance(TimeZone.getTimeZone("GMT+08:00"));
        calendar.add(Calendar.DAY_OF_MONTH, days);
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        return sdf.format(calendar.getTime());
    }

    private LogDTO getInfoOfWeek(LogDTO logDTO, String startTime, String endTime) {
        List<Log> logs = logMapper.getInfoOfWeekByInterface(logDTO.getLog().getName(), startTime, endTime);
        if (logs == null)
        {
            logDTO.setFailureRate(0);
            logDTO.setHealthStatus(0);
            logDTO.setConsumingAvg(0);
            return logDTO;
        }


        logDTO.setCallNumber(logs.size());

        Long countTime = 0L;
        int failureRateCount = 0;
        int healthStatusCount = 0;

        for (int x = 0, len = logs.size(); x < len; x++){
            Long count = logs.get(x).getEndTime().getTime() - logs.get(x).getStartTime().getTime();
            count = count == 0 ? 500 : count;
            countTime += count;

            if (logs.get(x).getIsSuccess() == 0)
                failureRateCount ++;
            else
                healthStatusCount ++;
        }


        DecimalFormat df=new DecimalFormat("0.00");
        logDTO.setFailureRate(Float.parseFloat(df.format((float)failureRateCount / logs.size())));
        logDTO.setHealthStatus(Float.parseFloat(df.format((float)healthStatusCount / logs.size())));
        logDTO.setConsumingAvg(Float.parseFloat(df.format((float)countTime / logs.size())));

        return logDTO;
    }
}