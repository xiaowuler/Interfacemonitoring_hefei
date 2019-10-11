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
import com.pingchuan.weather.Model.PageResult;
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
    
    public PageResult<Log> findAllByPage(int pageNum, int pageSize){
        int count = logMapper.findAll(0, 0).size();
        List<Log> logs = logMapper.findAll((pageNum - 1) * pageSize, pageSize);
        List<Log> logList = new ArrayList<>();
        for (int x = 0, len = logs.size(); x < len; x++){
            if (x == len)
                break;
            logList.add(logs.get(x));
        }
        return new PageResult<>(count, logList);
    }

    @Override
    public List<LogDTO> findAllByDate() {
        List<LogDTO> logDTOS = new ArrayList<>();

        //准备参数
        long startTime = getTimeByDays(-7);
        long endTime = getTimeByDays(1);
        /*Config failureRateConfig = configMapper.findOneById(3);
        Config consumingAvgConfig = configMapper.findOneById(2);
        Config healthStatusConfig = configMapper.findOneById(4);*/

        List<Log> logs = logMapper.findAllLogName(startTime, endTime, 0, 0);
        LogDTO logDTO ;
        for (Log log : logs){
            logDTO = new LogDTO();
            logDTO.setLog(log);
            logDTO.setName(log.getName());
            logDTO = getInfoOfWeek(logDTO, startTime, endTime);
            logDTOS.add(logDTO);
        }

        return logDTOS;
    }

    @Override
    public PageResult<LogDTO> findAllByState(int pageNum, int pageSize) {

        //PageHelper.startPage(pageNum, pageSize);
        List<LogDTO> logDTOS = new ArrayList<>();
        //准备参数
        long startTime = getTimeByDays(-7);
        long endTime = getTimeByDays(1);
        //long lastTime = addTimeByDays(1);
        Config successRateConfig = configMapper.findOneById(5);
        Config successConsumingAvgConfig = configMapper.findOneById(6);
        Config failureConsumingAvgConfig = configMapper.findOneById(6);


        List<Log> logs = logMapper.findAllLogName(startTime, endTime, (pageNum - 1) * pageSize, pageSize);
        int total = logMapper.findAllLogNameByCount(startTime, endTime).size();
        //float[] randomArray = {90.7f, 44.6f, 11.2f, 77.5f, 25.7f, 63.2f, 75.1f, 44.8f};
        //Long count = (long)logs.size();
        LogDTO logDTO = null;
        for (int x = 0, len = logs.size(); x < len; x++ ){
            if (x == total)
                break;
            if (logs.get(x) == null)
                continue;

            logDTO = new LogDTO();
            logDTO.setLog(logs.get(x));
            logDTO.setName(logs.get(x).getName());
            logDTO.setCallNumberDay(getTodayCallNumber(logDTO.getLog().getName(), addTimeByDays(0), addTimeByDays(1)));
            logDTO.setCallNumberLastDay(getTodayCallNumber(logDTO.getLog().getName(), addTimeByDays(-1), addTimeByDays(0)));
            logDTO.setCallNumberBeforeDay(getTodayCallNumber(logDTO.getLog().getName(), addTimeByDays(-2), addTimeByDays(-1)));


            //death data
            //String success = String.format("%.2f", randomArray[x] / 100);
            //logDTO.setSuccessRate(Float.parseFloat(success));
            logDTO.setSuccessRate(getOneSuccessRate(successRateConfig, logDTO.getLog().getName()));
            logDTO.setSuccessConsumingAvg(getOneConsumingAvg(1, logDTO.getLog().getName(), Integer.parseInt(successConsumingAvgConfig.getValue())));

            //logDTO.setFailureRate(100 - Float.parseFloat(success));
            logDTO.setFailureConsumingAvg(getOneConsumingAvg(0, logDTO.getLog().getName(), Integer.parseInt(failureConsumingAvgConfig.getValue())));
            logDTOS.add(logDTO);
        }


        return new PageResult<>(total,logDTOS);
    }

    @Override
    public List<Log> findAllLogName() {
        ArrayList<Log> logNames = (ArrayList<Log>) logMapper.findAllLogNames();
        Log log = new Log();
        log.setName("全部");
        logNames.add(0, log);
        return logNames;
    }

    @Override
    public PageResult<LogDTO> findAllByCallerAndNameAndStateAndTime(String name, String callerId, Date startTime, Date endTime, int state, int pageNum, int pageSize) {
        List<Log> logs = logMapper.findAllByCallerAndNameAndStateAndTime(name, callerId, startTime.getTime(), endTime.getTime(), state);
        long total = logs.size();
        List<LogDTO> logDTOS = new ArrayList<>();

        for (int x = (pageNum -1) * pageSize, len = pageNum * pageSize; x < len;
             x++) {
            if (x == total)
                break;

            if (logs.get(x) == null)
                continue;

            LogDTO logDTO = new LogDTO();
            Long count = logs.get(x).getEndTime() - logs.get(x).getStartTime();
            count = count == 0 ? 500 : count;
            logDTO.setConsumingTime(count);
            Caller caller = callerMapper.findOneById(logs.get(x).getCaller());

            if (caller != null)
                logDTO.setCallerName(caller.getName());
            else
                logDTO.setCallerName("接口调试客户端");

            logDTO.setLog(logs.get(x));
            logDTO.setName(logs.get(x).getName());
            logDTO.setStartTime(new Date(logs.get(x).getStartTime()));
            logDTO.setEndTime(new Date(logs.get(x).getEndTime()));
            logDTO.setState(logs.get(x).getIsSuccess() == 1 ? "成功" : "失败");
            logDTOS.add(logDTO);
        }

        return new PageResult<>(total, logDTOS);
    }

    private float getOneConsumingAvg(int flag, String name, int size) {
        List<Log> logs = logMapper.findOneByCount(name, size);

        long consumingTime = 0;
        for (Log log : logs){
            if (log.getIsSuccess() == flag)
            {
                Long count = log.getEndTime() - log.getStartTime();
                consumingTime += count == 0 ? 400 : count;
            }
        }

        DecimalFormat df=new DecimalFormat("0.00");
        return Float.parseFloat(df.format((float)consumingTime / logs.size()));
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

    private int getTodayCallNumber(String name, long startTime, long endTime) {
        return logMapper.findOneByToday(name, startTime, endTime);
    }

    private long addTimeByDays(int days){
        Calendar calendar = Calendar.getInstance(TimeZone.getTimeZone("GMT+08:00"));
        calendar.set(calendar.get(Calendar.YEAR), calendar.get(Calendar.MONTH), calendar.get(Calendar.DAY_OF_MONTH), 0, 0, 0);
        calendar.add(Calendar.DAY_OF_MONTH, days);
        return calendar.getTimeInMillis();
    }

    private long getTimeByDays(int days){
        Calendar calendar = Calendar.getInstance(TimeZone.getTimeZone("GMT+08:00"));
        calendar.add(Calendar.DAY_OF_MONTH, days);
        return calendar.getTimeInMillis();
    }

    private LogDTO getInfoOfWeek(LogDTO logDTO, long startTime, long endTime) {
        List<Log> logs = logMapper.getInfoOfWeekByInterface(logDTO.getLog().getName(), startTime, endTime);
        if (logs == null)
        {
            logDTO.setFailureRate(0);
            logDTO.setSuccessRate(100 - logDTO.getFailureRate());
            logDTO.setCorrectRate(0);
            logDTO.setConsumingAvg(0);
            return logDTO;
        }


        logDTO.setCallNumber(logs.size());

        Long countTime = 0L;
        int failureRateCount = 0;
        int healthStatusCount = 0;

        for (int x = 0, len = logs.size(); x < len; x++){
            Long count = logs.get(x).getEndTime() - logs.get(x).getStartTime();
            count = count == 0 ? 500 : count;
            countTime += count;

            if (logs.get(x).getIsSuccess() == 0)
                failureRateCount ++;
            else
                healthStatusCount ++;
        }


        DecimalFormat df=new DecimalFormat("0.00");
        logDTO.setFailureRate(Float.parseFloat(df.format((float)failureRateCount / logs.size())));
        logDTO.setSuccessRate(Float.parseFloat(df.format((100 - logDTO.getFailureRate()))));
        logDTO.setCorrectRate(Float.parseFloat(df.format((float)healthStatusCount / logs.size())));
        logDTO.setConsumingAvg(Float.parseFloat(df.format((float)countTime / logs.size())));

        return logDTO;
    }
}